# Build discovery pages from real content, keeping chapter lists off the blog feed.
require_relative 'lib/content'
require 'json'
require 'digest'

entries = []
%w[_posts _novels _manga].each do |collection|
  Dir.glob("#{collection}/**/*.md").sort.each do |file|
    data, = Content.read(file)
    next if data['published'] == false
    date = DateTime.parse(data.fetch('date').to_s)
    next if collection == '_posts' && date > DateTime.now
    slug = File.basename(file, '.md').sub(/\A\d{4}-\d{2}-\d{2}-/, '')
    prefix = {'_posts'=>'blog', '_novels'=>'novels', '_manga'=>'manga'}.fetch(collection)
    entries << {'title'=>data.fetch('title'), 'url'=>data['permalink'] || "/#{prefix}/#{slug}/",
                'date'=>date.iso8601, 'day'=>date.strftime('%m.%d'), 'year'=>date.year.to_s,
                'category'=>data['category'], 'tags'=>Array(data['tags']).map(&:to_s).uniq,
                'kind'=>{'_posts'=>'文章','_novels'=>'章节','_manga'=>'画集'}.fetch(collection)}
  end
end
entries.sort_by! { |entry| [entry['date'],entry['url']] }.reverse!
posts = entries.select { |entry| entry['kind'] == '文章' }
years = posts.group_by { |entry| entry['year'] }.map { |year, items| {'year'=>year,'entries'=>items} }
tags = entries.flat_map { |entry| entry['tags'] }.uniq.sort.map do |name|
  {'id'=>'tag-' + Digest::SHA256.hexdigest(name)[0,12], 'name'=>name,
   'entries'=>entries.select { |entry| entry['tags'].include?(name) }}
end
Content.write('_data/discovery.json',JSON.pretty_generate({'post_count'=>posts.length,'years'=>years,'tags'=>tags}))
puts "Prepared #{years.length} archive years and #{tags.length} tags for #{entries.length} content documents."
