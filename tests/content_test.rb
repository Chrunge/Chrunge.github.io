require 'minitest/autorun'
require 'tmpdir'
require 'fileutils'
require 'open3'
require 'rbconfig'
require 'json'
require_relative '../scripts/lib/content'

class ContentTest < Minitest::Test
  def test_front_matter_keeps_body_and_parses_dates
    Dir.mktmpdir do |dir|
      dir = dir.tr('\\', '/')
      file = File.join(dir, 'note.md')
      File.binwrite(file, "---\r\ntitle: 笔记\r\ndate: 2026-10-17\r\ntags: [手动标签]\r\n---\r\n正文\r\n---\r\n后文\r\n")
      data, body = Content.read(file)
      assert_equal '笔记', data['title']
      assert_equal Date.new(2026, 10, 17), data['date']
      assert_equal ['手动标签'], data['tags']
      assert_equal ['正文', '---', '后文'], body.lines.map(&:strip)
      File.write(file, '没有资料头', encoding: 'UTF-8')
      assert_raises(RuntimeError) { Content.read(file) }
    end
  end

  def test_identical_generated_content_does_not_rewrite_the_file
    Dir.mktmpdir do |dir|
      dir = dir.tr('\\', '/')
      file = File.join(dir, 'index.json')
      Content.write(file, '{}')
      timestamp = Time.at(1_600_000_000)
      File.utime(timestamp, timestamp, file)
      Content.write(file, '{}')
      assert_equal timestamp, File.mtime(file)
      Content.write(file, '{"updated":true}')
      assert_equal '{"updated":true}', File.read(file)
    end
  end

  def test_generation_from_sources_preserves_manual_tags_and_only_prunes_owned_outputs
    Dir.mktmpdir do |dir|
      dir = dir.tr('\\', '/')
      FileUtils.cp_r(File.expand_path('../scripts', __dir__), dir)
      FileUtils.mkdir_p([File.join(dir, '_data'), File.join(dir, '_novels', '计算机', '课程')])
      File.write(File.join(dir, '_data', 'tag_rules.yml'), "- prefix: 计算机/\n  tags: [默认分类]\n", encoding: 'UTF-8')
      file = File.join(dir, '_novels', '计算机', '课程', '01.md')
      data = { 'title'=>'第一章', 'date'=>'2026-10-17 12:00:00 +0800', 'tags'=>['手动标签'], 'description'=>'测试资料', 'legacy_url'=>'/blog/legacy/' }
      Content.write(file, data.to_yaml + "---\n\n## 本章\n\n正文。\n")
      generate = lambda do
        out, err, status = Open3.capture3(RbConfig.ruby, 'scripts/prepare_library.rb', chdir: dir)
        assert status.success?, out + err
      end
      generate.call
      after, body = Content.read(file)
      assert_equal ['手动标签'], after['tags']
      assert_equal "\n## 本章\n\n正文。\n", body
      catalog = JSON.parse(File.read(File.join(dir, '_data', 'library.json'), encoding: 'UTF-8'))
      assert_equal after['permalink'], catalog.values.first['chapters'].first['url']
      redirect = Dir.glob('*.html', base: File.join(dir, 'redirects')).map { |name| File.join(dir, 'redirects', name) }.first
      assert_equal after['permalink'], Content.read(redirect).first['target_url']
      stale = File.join(dir, '_library', 'stale.md')
      custom = File.join(dir, '_library', 'custom.md')
      Content.write(stale, { 'generated_by'=>'prepare_library' }.to_yaml + "---\n")
      Content.write(custom, { 'generated_by'=>'author' }.to_yaml + "---\n")
      after.delete('legacy_url')
      Content.write(file, after.to_yaml + "---\n" + body)
      generate.call
      refute File.exist?(stale)
      assert File.exist?(custom)
      refute File.exist?(redirect)
      assert_equal 1, Dir.glob('*.md', base: File.join(dir, '_library')).count { |name| Content.read(File.join(dir, '_library', name)).first['generated_by'] == 'prepare_library' }
    end
  end

  def test_front_matter_preserves_leading_indentation
    Dir.mktmpdir do |dir|
      file = File.join(dir, 'note.md')
      body = "\n    puts :whale\n\n第二段。\n"
      File.binwrite(file, "---\r\ntitle: Fixture\r\n---\r\n" + body)
      assert_equal body, Content.read(file).last
    end
  end

  def test_chapters_use_explicit_order_then_natural_names_and_repeat_stably
    with_library_fixture do |dir, write_chapter, generate|
      write_chapter.call('02.md', { 'order'=>2 })
      write_chapter.call('10.md', { 'order'=>1 })
      write_chapter.call('01.md', { 'order'=>2 })
      generate.call
      catalog = JSON.parse(File.read(File.join(dir, '_data/library.json'), encoding: 'UTF-8'))
      assert_equal ['10.md', '01.md', '02.md'], catalog.values.first['chapters'].map { |chapter| chapter['title'] }
      generated = Dir.glob(File.join(dir, '{_novels,_data,_library,redirects}/**/*')).select { |file| File.file?(file) }
      before = generated.to_h { |file| [file, File.binread(file)] }
      generate.call
      assert_equal before, generated.to_h { |file| [file, File.binread(file)] }
    end
  end

  def test_generation_keeps_first_indented_block_and_body_bytes
    ["    puts :whale\n\n末段。\n", "\r\n    puts :whale\r\n\r\n末段。\r\n", "\n\n## Heading\n\n末段。\n"].each do |body|
      with_library_fixture do |dir, write_chapter, generate|
        file = write_chapter.call('01.md', {}, body)
        assert_equal body, Content.read(file).last
        generate.call
        assert_equal body, Content.read(file).last
        first = File.binread(file)
        generate.call
        assert_equal first, File.binread(file)
      end
    end
  end

  def test_pruning_preserves_unmanaged_html_and_invalid_metadata
    with_library_fixture do |dir, write_chapter, generate|
      write_chapter.call('01.md')
      generate.call
      custom = {
        File.join(dir, 'redirects/author.html')=>"<h1>Author page</h1>\n",
        File.join(dir, '_library/invalid.md')=>"---\ntitle: [broken\n---\n正文。\n",
        File.join(dir, '_library/list.md')=>"---\n- author\n---\n正文。\n"
      }
      custom.each { |file, text| File.binwrite(file, text) }
      warning = generate.call
      custom.each { |file, text| assert_equal text.b, File.binread(file) }
      assert_includes warning, 'Preserved unmanaged file'
      assert_raises(RuntimeError) { Content.read(File.join(dir, 'redirects/author.html')) }
      assert_raises(Psych::SyntaxError) { Content.read(File.join(dir, '_library/invalid.md')) }
    end
  end

  private

  def with_library_fixture
    Dir.mktmpdir do |directory|
      dir = directory.tr('\\', '/')
      FileUtils.cp_r(File.expand_path('../scripts', __dir__), dir)
      FileUtils.mkdir_p([File.join(dir, '_data'), File.join(dir, '_novels', 'Fixture')])
      File.write(File.join(dir, '_data', 'tag_rules.yml'), "- prefix: Fixture/\n  tags: [默认分类]\n", encoding: 'UTF-8')
      write_chapter = lambda do |name, extra = {}, body = "\n## Heading\n\n正文。\n"|
        file = File.join(dir, '_novels', 'Fixture', name)
        data = { 'title'=>name, 'date'=>'2026-10-17 12:00:00 +0800', 'category'=>'Fixture', 'tags'=>['手动标签'],
                 'description'=>'Fixture', 'excerpt'=>'Fixture', 'original_filename'=>name, 'toc_levels'=>'h2,h3' }.merge(extra)
        Content.write(file, data.to_yaml + "---\n" + body)
        file
      end
      generate = lambda do
        out, err, status = Open3.capture3(RbConfig.ruby, 'scripts/prepare_library.rb', chdir: dir)
        assert status.success?, out + err
        err
      end
      yield dir, write_chapter, generate
    end
  end
end
