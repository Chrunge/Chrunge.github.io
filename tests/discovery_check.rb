# Integration check: use Jekyll's actual URLs and publication decisions.
require 'tmpdir'
require 'fileutils'
require 'jekyll'
require_relative '../scripts/lib/content'
require_relative '../_plugins/discovery'

def assert(condition, message)
  raise message unless condition
end

Dir.mktmpdir('discovery-check-') do |directory|
  source = directory.tr('\\', '/')
  documents = {
    '_posts/2020-01-01-example-note.md'=>{ 'slug'=>'chosen-slug' },
    '_posts/2020-01-02-hidden.md'=>{ 'published'=>false },
    '_posts/2999-01-01-future.md'=>{ 'date'=>'2999-01-01 12:00:00 +0800' },
    '_novels/visible.md'=>{ 'permalink'=>'/books/custom/chapter/' },
    '_novels/hidden.md'=>{ 'published'=>false },
    '_novels/future.md'=>{ 'date'=>'2999-01-01 12:00:00 +0800' },
    '_manga/visible.md'=>{ 'permalink'=>'/illustrations/custom/' }
  }
  documents.each do |name, extra|
    file = File.join(source, name)
    FileUtils.mkdir_p(File.dirname(file))
    data = { 'title'=>name, 'date'=>'2020-01-01 12:00:00 +0800', 'category'=>'Fixture', 'tags'=>['Shared'] }.merge(extra)
    Content.write(file, data.to_yaml + "---\n\n# Fixture\n")
  end
  [[false, false, ''], [false, false, '/nested'], [true, false, ''], [false, true, ''], [true, true, '']].each do |future, unpublished, baseurl|
    options = { 'source'=>source, 'destination'=>File.join(source, '_site'), 'permalink'=>'/notes/:year/:title/',
                'collections'=>{ 'novels'=>{ 'output'=>true, 'permalink'=>'/chapters/:name/' }, 'manga'=>{ 'output'=>true } },
                'time'=>'2026-10-18 12:00:00 +0800', 'timezone'=>'Asia/Shanghai',
                'future'=>future, 'unpublished'=>unpublished, 'baseurl'=>baseurl, 'plugins'=>[], 'quiet'=>true }
    Content.write(File.join(source, '_config.yml'), options.to_yaml)
    site = Jekyll::Site.new(Jekyll.configuration(options))
    site.process
    discovery = site.data.fetch('discovery')
    actual = discovery['tags'].flat_map { |tag| tag['entries'].map { |entry| entry['url'] } }.uniq.sort
    public_docs = %w[posts novels manga].flat_map { |name| site.collections[name].docs }.select(&:write?)
    assert actual == public_docs.map(&:url).sort, 'Discovery URLs must match Jekyll output URLs'
    actual.each { |url| assert public_docs.find { |doc| doc.url == url }.destination(site.dest).then { |file| File.file?(file) }, 'Indexed document must exist' }
    assert discovery['years'].flat_map { |year| year['entries'] }.any? { |entry| entry['url'] == '/notes/2020/chosen-slug/' }, 'Configured post permalink and slug must be respected'
    assert actual.include?('/books/custom/chapter/'), 'Explicit chapter permalink must be respected'
    assert actual.include?('/illustrations/custom/'), 'Explicit gallery permalink must be respected'
    policy = Content.publication_options(source)
    expected = documents.count do |name, _|
      data, = Content.read(File.join(source, name))
      Content.published?(data, **policy)
    end
    assert actual.length == expected, 'Preparation policy must match Jekyll publication options'
    if !future && !unpublished
      assert actual.length == 3, 'Default output must omit all hidden and future documents'
    end
  end
end
puts 'PASS: Jekyll URLs, configured routes, explicit permalinks, subpaths and publication options.'
