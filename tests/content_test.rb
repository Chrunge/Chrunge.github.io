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
end
