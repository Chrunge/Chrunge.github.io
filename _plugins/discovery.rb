require 'digest'
require 'time'

module CloudWhale
  class Discovery < Jekyll::Generator
    safe true
    priority :low

    KINDS = { 'posts'=>'文章', 'novels'=>'章节', 'manga'=>'画集' }.freeze

    def generate(site)
      documents = KINDS.flat_map do |collection, kind|
        Array(site.collections[collection]&.docs).select(&:write?).map { |document| [document, kind] }
      end
      documents.sort_by! { |document, _| [document.date, document.url] }.reverse!
      entries = documents.map do |document, kind|
        date, data = document.date, document.data
        { 'title'=>data.fetch('title'), 'url'=>document.url,
          'date'=>date.iso8601, 'day'=>date.strftime('%m.%d'), 'year'=>date.year.to_s,
          'category'=>data['category'], 'tags'=>Array(data['tags']).map(&:to_s).uniq, 'kind'=>kind }
      end
      posts = entries.select { |entry| entry['kind'] == '文章' }
      years = posts.group_by { |entry| entry['year'] }.map { |year, items| { 'year'=>year, 'entries'=>items } }
      tags = entries.flat_map { |entry| entry['tags'] }.uniq.sort.map do |name|
        { 'id'=>'tag-' + Digest::SHA256.hexdigest(name)[0, 12], 'name'=>name,
          'entries'=>entries.select { |entry| entry['tags'].include?(name) } }
      end
      site.data['discovery'] = { 'post_count'=>posts.length, 'years'=>years, 'tags'=>tags }
      Jekyll.logger.info 'Discovery:', "#{entries.length} published documents, #{tags.length} tags."
    end
  end
end
