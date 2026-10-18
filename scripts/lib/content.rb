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

  def self.chapter_date(value)
    return value.strftime('%Y-%m-%d %H:%M:%S %z') if value.is_a?(Time)
    return value.strftime('%Y-%m-%d') + ' 12:00:00 +0800' if value.instance_of?(Date)
    value
  end

  def self.publication_options(root = '.')
    file = File.join(root, '_config.yml')
    config = File.file?(file) ? YAML.safe_load(File.read(file, encoding: 'UTF-8'), permitted_classes: [Date, Time]) || {} : {}
    { now: config['time'] ? DateTime.parse(config['time'].to_s) : DateTime.now,
      future: !!config['future'], unpublished: !!config['unpublished'] }
  end

  def self.published?(data, now: DateTime.now, future: false, unpublished: false, date: nil)
    return false unless data.fetch('published', true) || unpublished
    return true if future || data['date'].nil?
    (date || DateTime.parse(data['date'].to_s)) <= now
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
      begin
        data, = read(file)
      rescue RuntimeError, Psych::Exception => error
        warn "Preserved unmanaged file #{file}: #{error.message.lines.first.strip}"
        next
      end
      unless data.is_a?(Hash)
        warn "Preserved unmanaged file #{file}: YAML metadata is not a mapping"
        next
      end
      File.delete(file) if data['generated_by'] == 'prepare_library'
    end
  end
end
