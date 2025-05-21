# Helpbook

By default, every macOS app has a `Help` menu. Without any modification, it contains a search
term entry box, and an item named like, "*appname* Help" which, when selected, displays an alert
that says, "Help isn't available for *appname*."

Providing help is, well, helpful, although getting the structure of the book right and packaging
everything up can be tricky, since all the documentation is pretty obscure. Fortunately, there are
tools to make it easier.

## Tools

The helpbook for this project gets built with [Middlemac]. This is a set of Ruby helpers for the
[Middleman] static site builder. This allows one to write the help documentation using Markdown,
create localized versions of the help files, and then package the whole thing up into a help book
that can be bundled with the app for distribution.

> __NOTE__ The maintainer of Middlemac hasn't touched it for a while, and the Ruby language and gem
> ecosystem has continued to evolve. There is a [PR](https://github.com/middlemac/middlemac/pull/9)
> to update it for Ruby 3 (since Ruby 2 is past its end-of-life). Until this gets merged back to
> Middlemac, there are some hoops to go through to be able to build the help book on your machine.

### Installing Middlemac

If the PR mentioned above has gotten merged, you should be able to just install
middlemac and be happy: `bundle install middlemac`.
If it hasn't, then you may need to clone the repo with the fix
in it, build the middlemac gems locally, and install them. That is a kind of tiresome
process, which deserves its own separate [documentation](BUILDING_MIDDLEMAC.md).

## Configuration

A macOS application's help book has its own bundle ID. This is *different* from the bundle ID
for the application, but it must be unique. General practice is to use the application's
bundle ID followed by `.help`. For example, `com.hackingwithswift.ShipShape.help`. This ID gets
set in the `config.rb` file in the help book source directory. To tell the
operating system that the book is associated with our application, we need to add an entry to
`Info.plist`: `CFBundleHelpBookName`. This is the bundle ID of the help book.

To have Xcode bundle the help book into the application, we need to add an entry to the
`Info.plist`: `CFBundleHelpBookFolder`. This is the name of the directory where the help book
has been packaged.

The help book directory also needs to be added to the Xcode project as a resource. In the
"Build Phases" tab for the application target, add a "Copy Bundle Resources" item that refers
to the built help book folder.

__TODO__ Add some screen shots here for clarity.

## Development

This is probably why you're even reading this document. During development of help book content,
it can be helpful to run a web server locally and look through the pages in a browser rather
than constantly rebuilding the book, installing it, and clearing the cache so that the operating
system shows the updates. Middleman has a built in server to make this easy. At the root of
the help book source directory, run this on the command line: `middleman serve`. This will
serve the help book on the default port, 4567. To specify a different port, add the `--port`
argument, e.g.: `middleman serve --port 5678`.

It can be helpful to have a handy reference with examples, so you might want to have a separate
folder somewhere that you've initialized with `middlemac init`. This would create the default
example help book, with English and Spanish content (to demonstrate localization).

> __NOTE__ The operating system indexes and _caches_ help books as they are used. So, if you're
> working on developing the content of the help book, you may need to clear the cache. This must
> be done from a terminal window, and it must be done with root user privilege: `sudo hiutil -P`.
> This will clear the help book cache on the local system and force it to reindex the help books.

[Middlemac]: https://github.com/middlemac/middlemac
[Middleman]: https://github.com/middleman/middleman

