require_relative 'lib/content'
require 'json'
required = Content::REQUIRED_FIELDS
publication = Content.publication_options
errors, urls, expected = [], [], []
count = 0
Dir.glob('{_posts,_novels,_manga}/**/*.md').each do |file|
  begin
    data, = Content.read(file)
  rescue StandardError => error
    errors << error.message
    next
  end
  required.each { |key| errors << "#{file}: missing #{key}" if data[key].nil? || data[key].to_s.strip.empty? }
  errors << "#{file}: tags must be a nonempty list" unless data['tags'].is_a?(Array) && !data['tags'].empty?
  errors << "#{file}: unsupported toc_levels" unless data['toc_levels'].to_s.match?(/\Ah[2-6](,h[2-6])*\z/)
  date = nil
  begin
    value = file.start_with?('_novels/') ? Content.chapter_date(data['date']) : data['date']
    date = DateTime.parse(value.to_s)
  rescue ArgumentError
    errors << "#{file}: invalid date"
  end
  if file.start_with?('_posts/') && !File.basename(file).match?(/\A\d{4}-\d{2}-\d{2}-.+\.md\z/)
    errors << "#{file}: posts need a dated filename"
  end
  if date && Content.published?(data, date: date, **publication)
    urls << data['permalink'] if data['permalink']
    if file.start_with?('_novels/')
      errors << "#{file}: public chapter needs a generated permalink" unless data['permalink']
      expected << data['permalink'] if data['permalink']
    end
  end
  count += 1
end
errors << 'Duplicate content URLs' unless urls.uniq.length == urls.length
library = JSON.parse(File.read('_data/library.json',encoding:'UTF-8'))
chapters = library.values.flat_map { |book| book['chapters'] }
errors << 'Chapter catalog does not match public source chapter URLs exactly once' unless chapters.map { |c| c['url'] }.sort == expected.sort && expected.uniq.length == expected.length
abort(errors.join("\n")) unless errors.empty?
puts "PASS: #{count} content documents have complete metadata; #{expected.length} public chapters have unique catalog entries."
