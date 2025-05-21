################################################################################
#  config.rb
#    Configure Middleman to generate Apple Help Book containers for multiple
#    targets.
################################################################################

##########################################################################
# Build System Integration
#  If built from Xcode (or another build system you create), then setup
#  some of our variables automatically from the environment variables
#  that the build system sets for us. You’ll have to set up Xcode to
#  set this environment variable, of course.
##########################################################################
version_app = ENV.has_key?('MIDDLEMAC_CFBundleShortVersionString') ? ENV['MIDDLEMAC_CFBundleShortVersionString'] : nil


##########################################################################
# Targets Configuration
#  Middlemac is capable of building multiple targets for variants of your
#  application using the `middleman-targets` gem. Activate it and change
#  the option values here to suit your needs. Note that middleman-targets
#  adds configuration parameters to the base Middleman application; these
#  are *not* extension options.
##########################################################################
activate :MiddlemanTargets

# Set the default target, i.e, the target that is used automatically when you
# `middleman build` or `middleman server` without the `targets` CLI option.
config[:target] = :main

# Targets

# NOTE: Ruby has a type of variable called a `symbol`, which are used below
# quite extensively and look like :this_symbol. Except they’re not really
# variables; you can’t assign values to them. Their value is themselves,
# though they have useful string representations (:this_symbol.to_s). You
# can even get the symbol representation of this_string.to_sym. Because
# they're unique, they make excellent array/hash keys and excellent,
# guaranteed unique values.

# :CFBundleID
# Just as different versions of your app must have different bundle identifiers
# so the OS can distinguish them, their help files must have unique bundle IDs,
# too. Your application specifies the help file `CFBundleID` in its
# `CFBundleHelpBookName` entry. Therefore for each target, ensure that your
# application has a `CFBundleHelpBookName` that matches the `CFBundleID` that
# you will set here.

# :HPDBookIconPath
# If specified a target-specific icon will be used as the help book icon by
# Apple’s help viewer. This path must be relative to the location of the
# `Resources` directory per Apple’s specification. If `nil` (or not present)
# then the default `SharedGlobalAssets/convention/icon_32x32@2x.png` will be
# used.

# :CFBundleName
# This value will be used for correct .plists and .strings setup, and will
# determine final .help directory name. All targets should use the same
# :CFBundleName. Built targets will be named `CFBundleName_(target).help`.
# This is *not* intended to be a product name, which is defined below.

# :ProductName
# You can specify different product names for each build target. The product
# name for the current target will be available via the `product_name` helper.

# :ProductVersion
# You can specify different product versions for each build target. The
# product version for the current target will be available via the
# `product_version` helper.

# :ProductURI
# You can specify different product URIs for each build target. The URI
# for the current target will be available via the `product_uri` helper.

# :ProductCopyright
# You should specify a copyright string to be included in the Apple Help Book.
# This typically appears when you print a Help Book.

# (other)
# You can specify additional .plist and .strings keys here, too. Have a look
# at `Info.plist.erb` and `InfoPlist.strings.erb`; simply use the exact key
# name and they will be supported. This is probably unneeded unless you are
# implementing advanced help book features.

# :Features
# A hash of features that a particular target supports or doesn't support.
# The `has_feature` function and several helpers will use the true/false value
# of these features in order to conditionally include content.

config[:targets] = {
        :main =>
            {
                :CFBundleID       => 'com.hackingwithswift.ShipShape.help',
                :HPDBookIconPath  => nil,
                :CFBundleName     => 'ShipShape',
                :ProductName      => 'ShipShape',
                :ProductVersion   => version_app || '1.0.0',
                :ProductURI       => 'https://github.com/twostraws/ShipShape',
                :ProductCopyright => '© 2025 Paul Hudson. All rights reserved.',
                :features =>
                    {
                    }
            },
    } # targets

# By enabling :target_magic_images, target specific images will be used instead
# of the image you specify if it'ss prefixed with :target_magic_word. For
# example, you might request "all-my_image.png", and "pro-my_image.png" (if it
# exists) will be used in your :pro target instead.
#
# Important: when this is enabled, images from *other* targets will *not* be
# included in the build! In the example above, *any* image prefixed with "free-"
# would not be included in the output directory.
config[:target_magic_images] = true
config[:target_magic_word] = 'all'


################################################################
# Configuration
#  Change the option values to suit your needs.
################################################################
activate :Middlemac do |options|

  # Directory where finished .help bundle should go. It should be relative
  # to this file, or make nil to leave in this help project directory. The
  # *actual* output directory will be an Apple Help bundle at this location
  # named in the form `#{CFBundleName} (target).help`. You might want to target
  # the `Resources` directory of your XCode project so that your XCode project
  # is always up to date.
  options.help_output_location = nil

  # Indicates whether or not spaces should be avoided in the name of the help
  # bundle. The default value for backwards compatibility is `true` because
  # some tools, such a make, don't like spaces.
  options.help_output_avoid_spaces = true

  # Indicates whether or not the `help_output_location` includes the `(target)`
  # prefix in the help book bundle name. The default, `true`, will result in
  # `#{CFBundleName} (target).help`, which is the historical behavior. Setting
  # this to `false` will result in a help book named `#{CFBundleName}.help`,
  # instead. This can be useful if you are building help books from scripts via
  # XCode, and you set `help_output_location` to `ENV['BUILT_PRODUCTS_DIR']`.
  # @return [Boolean] `true` or `false` to enable or disable this behavior.
  options.help_output_use_target = true

  # If set to true, then the enhanced image_tag helper will be used
  # to include @2x, @3x, and @4x srcset automatically, if the image assets
  # exist.
  options.retina_srcset = true

  # If set to an array of possible image extension values, then the `image_tag`
  # helper will work for images even if you don't specify an extension, but only
  # if a file exists in the sitemap that has one of these extensions. Set this to
  # an array of extensions in the order of precedence.
  options.img_auto_extensions = %w(.svg .png .jpg .jpeg .gif .tiff .tif)

  # If set to true, some of the templates will show additional information
  # when pages are generated, such as contents of md_links and md_images.
  # Also, JavaScript redirects will be omitted from naked pages, and the
  # meta refresh will be set to 100 seconds for such pages.
  options.show_debug = false

  # If set to true, Apple will provide next page and previous page navigation
  # gadgets automatically at the bottom of each content page. Apple itself
  # does not use this feature currently.
  options.show_previous_next = false

  # Indicate whether or not numeric file name prefixes used for sorting
  # pages should be eliminated during output. This results in cleaner
  # URI's. Helpers such as `page_name` and Middleman helpers such as
  # `page_class` will reflect the pretty name.
  config.strip_file_prefixes = true

end #activate


################################################################
# STOP! There's nothing below here that you should have to
# change. Just follow the conventions and framework provided.
################################################################


#===============================================================
# Setup directories to mirror Help Book directory layout.
#===============================================================
set :source,         'Contents'
set :data_dir,       'Contents/Resources/SharedGlobalAssets/_data'
set :assets_dir,     'Resources/SharedGlobalAssets'
set :partials_dir,   '_partials'
set :layouts_dir,    '_layouts'
set :convention_dir, 'convention'
set :css_dir,        'css'
set :fonts_dir,      'fonts'
set :images_dir,     'images'
set :js_dir,         'js'


#===============================================================
# Other required setup. Note: don't use relative assets or
# links here, as Apple require very specific hrefs.
#===============================================================
set :strip_index_file, false


#===============================================================
# Default to HTML5 Layout.
# Specify layouts from most specific to least specific.
#===============================================================
Haml::TempleEngine.disable_option_validator!
set :haml, :format => :html5
page 'Resources/*.lproj/asides/*.html', :layout => :'layout-apple-modern-aside'
page 'Resources/*.lproj/*.html', :layout => :'layout-apple-modern'


#===============================================================
# Add-on features
#===============================================================
activate :syntax


################################################################################
# Helpers
################################################################################


#===============================================================
# Methods defined in this helpers block are available in
# templates.
#===============================================================
helpers do

  # no helpers here, but the Middlemac class offers quite a few,
  # or you can add your own.

end #helpers


################################################################################
# Build-specific configurations
################################################################################


#===============================================================
# :server - the server is running and watching files.
#===============================================================
configure :server do

  # Reload the browser automatically whenever files change
  activate :livereload, :host => '127.0.0.1'

  compass_config do |config|
    config.output_style = :expanded
    config.sass_options = { :line_comments => true }
  end

end #configure


#===============================================================
# :build - build is executed specifically.
#===============================================================
configure :build do

  compass_config do |config|
    config.output_style = :expanded
    config.sass_options = { :line_comments => false }
  end

end #configure
