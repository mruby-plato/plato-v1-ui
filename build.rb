#!/usr/bin/env ruby
require 'fileutils'

pwd = Dir.getwd
plato_dir = File.dirname($0)
ide_dir = File.join(plato_dir, 'plato')

if lang = ARGV[0]
  lang = lang.downcase
  unless lang == 'en' || lang == 'ja'
    puts <<"EOS"
Unsupport language #{lang.inspect}
Usage: ruby #{$0} <lang>
  lang: language ID (en|ja)
EOS
    exit(1)
  end
  languages = [lang]
else
  languages = ['ja', 'en']
end

targets = case RUBY_PLATFORM.downcase
when /mswin(?!ce)|mingw|cygwin|bccwin/
  ['win32-ia32']
when /darwin/
  ['darwin']
when /linux/
  ['linux']
else
  puts "Unsupport platform #{RUBY_PLATFORM.inspect}"
  exit(0)
end

# Import mrbgems list
puts 'Import mrbgem list.'
listmgem_json_dir = File.join(plato_dir, '..', 'plato', 'tools', 'boxmgem', 'mgemlist')
Dir.glob(File.join(listmgem_json_dir, '*.lst')).each {|list|
  FileUtils.cp_r(list, File.join(ide_dir, 'mgemlist'))
}

# Install node modules
puts 'Install node.js modules.'
`cd #{ide_dir} && npm install && cd #{pwd}`

# Make application package
languages.each {|lang|
  puts "Make application package (lang=#{lang})"

  #
  # Localize HTML files
  #
  # cp -R html-XX plato/html
  html_dir = File.join(ide_dir, 'html')
  FileUtils.rm_rf(html_dir)
  FileUtils.cp_r(File.join(plato_dir, "html-#{lang}"), html_dir)
  # mv -f plato/html/index.html plato/
  FileUtils.mv(File.join(html_dir, 'index.html'), ide_dir, {:force => true})

  #
  # Localize image files
  #
  # cp -R -f images-XX/* plato/image
  images_dir = File.join(ide_dir, 'images')
  FileUtils.cp_r(Dir.glob(File.join(plato_dir, "images-#{lang}", "*")), images_dir)

  targets.each {|target|
    # puts "node build-#{target}.js #{lang}"
    `cd #{ide_dir} && node ../build-#{target}.js #{lang} && cd #{pwd}`
  }
}
