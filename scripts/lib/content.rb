require 'yaml'
require 'date'

module Content
  REQUIRED_FIELDS = %w[title date category tags description excerpt original_filename toc_levels].freeze

  def self.read(file)
    text = File.read(file, mode: 'rb', encoding: 'UTF-8')
    header = text.match(/\A---\r?\n(.*?)\r?\n---\r?\n?/m)
    raise "#{file}: missing YAML header" unless header
    data = YAML.safe_load(header[1], permitted_classes: [Date, Time], aliases: false) || {}
    [data, text[header[0].length..]]
  end

  def self.write(file, text)
    return if File.file?(file) && File.read(file, mode: 'rb', encoding: 'UTF-8') == text
    File.write(file, text, mode: 'wb', encoding: 'UTF-8')
  end

  def self.prune_generated(directory, pattern, expected)
    expected = expected.map { |file| File.expand_path(file) }
    Dir.glob(pattern, base: directory).each do |name|
      file = File.join(directory, name)
      next if expected.include?(File.expand_path(file))
      data, = read(file)
      File.delete(file) if data['generated_by'] == 'prepare_library'
    end
  end
end
