require_relative 'lib/content'
require 'json'
required = Content::REQUIRED_FIELDS
errors, urls = [], []
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
  begin
    DateTime.parse(data['date'].to_s)
  rescue ArgumentError
    errors << "#{file}: invalid date"
  end
  if file.start_with?('_posts/') && !File.basename(file).match?(/\A\d{4}-\d{2}-\d{2}-.+\.md\z/)
    errors << "#{file}: posts need a dated filename"
  end
  urls << data['permalink'] if data['permalink']
  count += 1
end
errors << 'Duplicate content URLs' unless urls.uniq.length == urls.length
library = JSON.parse(File.read('_data/library.json',encoding:'UTF-8'))
chapters = library.values.flat_map { |book| book['chapters'] }
expected = Dir.glob('_novels/**/*.md').length
errors << 'Chapter catalog does not include every source chapter exactly once' unless chapters.length == expected && chapters.map { |c| c['url'] }.uniq.length == expected
abort(errors.join("\n")) unless errors.empty?
puts "PASS: #{count} content documents have complete metadata; #{expected} chapters have unique catalog entries."
