# Generate the directory-based bookshelf before Jekyll, using Ruby standard libraries.
require_relative 'lib/content'
require 'json'
require 'digest'
require 'fileutils'

root = File.directory?('_novels') ? '.' : File.expand_path('..', __dir__)
tag_rules = YAML.safe_load(File.read(File.join(root, '_data', 'tag_rules.yml'), encoding:'UTF-8'))
read_document = Content.method(:read)
natural = ->(name) { name.downcase.gsub(/\d+/) { |n| n.rjust(12, '0') } }
publication = Content.publication_options(root)
novels_root = File.join(root, '_novels')
groups = Dir.glob(File.join(novels_root, '**', '*.md')).group_by do |file|
  parent = File.dirname(file)
  parent == novels_root ? '小说' : parent.delete_prefix(novels_root + '/')
end
library, tree = {}, []
generated = File.join(root, '_library')
redirects = File.join(root, 'redirects')
FileUtils.mkdir_p([generated, redirects])
expected_books, expected_redirects = [], []

groups.sort.each do |directory, files|
  segments = directory.split('/')
  id = Digest::SHA256.hexdigest(directory)[0, 12]
  title = segments.last
  title = "#{title} · 综合笔记" if segments.length == 1 && title != '小说'
  chapters = files.map { |file| [file, *read_document.call(file)] }
  chapters.select! { |_, data, _| Content.published?(data, **publication) }
  next if chapters.empty?
  chapters.sort_by! { |file, data, _| [data.fetch('order', 1_000_000).to_i, natural.call(File.basename(file))] }
  book = {'id'=>id, 'title'=>title, 'category'=>segments.first, 'directory'=>directory,
          'url'=>"/novels/#{id}/", 'description'=>"#{directory.gsub('/', ' / ')}，共 #{chapters.length} 章。按章节阅读，慢慢整理知识。", 'chapters'=>[]}
  chapters.each_with_index do |(file, data, body), index|
    relative_path = file.delete_prefix(novels_root + '/')
    tag_rule = tag_rules.find { |rule| relative_path.start_with?(rule.fetch('prefix')) }
    # Respect author-edited tags; directory rules only supply missing defaults.
    data['tags'] = tag_rule.fetch('tags') if tag_rule && (!data['tags'].is_a?(Array) || data['tags'].empty?)
    data['date'] = data['date'].strftime('%Y-%m-%d %H:%M:%S %z') if data['date'].is_a?(Time)
    data['date'] = data['date'].strftime('%Y-%m-%d') + ' 12:00:00 +0800' if data['date'].is_a?(Date)
    chapter_id = Digest::SHA256.hexdigest(File.basename(file))[0, 12]
    url = "/novels/#{id}/read/#{chapter_id}/"
    data.merge!('layout'=>'chapter', 'book_id'=>id, 'chapter_index'=>index, 'permalink'=>url)
    Content.write(file, data.to_yaml + "---\n" + body)
    book['chapters'] << {'title'=>data['title'], 'url'=>url, 'index'=>index+1, 'description'=>data['description']}
    if data['legacy_url']
      redirect = {'layout'=>'redirect','title'=>data['title'],'permalink'=>data['legacy_url'],'target_url'=>url,'sitemap'=>false,'generated_by'=>'prepare_library'}
      redirect_file = File.join(redirects, "#{id}-#{chapter_id}.html")
      expected_redirects << redirect_file
      Content.write(redirect_file, redirect.to_yaml + "---\n")
    end
  end
  library[id] = book
  node_list = tree
  node = nil
  segments.each do |segment|
    node = node_list.find { |candidate| candidate['name'] == segment }
    unless node
      node = {'name'=>segment, 'children'=>[], 'books'=>[]}
      node_list << node
    end
    node_list = node['children']
  end
  node['books'] << book
  data = {'layout'=>'book','title'=>title,'book_id'=>id,'permalink'=>book['url'],
          'description'=>book['description'],'generated_by'=>'prepare_library'}
  book_file = File.join(generated, "#{id}.md")
  expected_books << book_file
  Content.write(book_file, data.to_yaml + "---\n")
end
Content.prune_generated(generated, '*.md', expected_books)
Content.prune_generated(redirects, '*.html', expected_redirects)
Content.write(File.join(root, '_data', 'library.json'), JSON.pretty_generate(library))
Content.write(File.join(root, '_data', 'library_tree.json'), JSON.pretty_generate(tree))
puts "Prepared #{library.length} books and #{library.values.sum { |book| book['chapters'].length }} chapters."
