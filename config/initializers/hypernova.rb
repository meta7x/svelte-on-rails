require 'hypernova'
require 'hypernova/plugins/development_mode_plugin'

Hypernova.add_plugin!(DevelopmentModePlugin.new)

Hypernova.configure do |config|
    config.host = '0.0.0.0'
    config.port = '3030'
end