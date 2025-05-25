These instructions are going to assume you have [Homebrew] installed.

First, you should install `rbenv`, which is a tool to let you have multiple versions
of Ruby installed on your computer, and to let you specify which version to use in a
given directory. Not only is this handy for Ruby development, but it lets you try making
local modifications to gems without screwing up your whole system. As someone
who doesn't normally program in Ruby, I find this especially helpful.

`brew install rbenv`

Next, install ruby. There are precisely 1.2 gazillion releases of ruby, and only a person
who develops primarily in ruby (so, not me) can keep them straight. There is a sort of
master list at [ruby-lang.org](https://www.ruby-lang.org/en/downloads/releases/) and that's
how one can discover what the state of a particular version is (current, outdated, end-of-life).

`rbenv install 3.4.4`

For subsequent steps we'll need to be sure that any gems we install are put in the right
place. If a build step spawns a new shell, then that shell is likely to use whatever the
*default* version of ruby is, rather than whatever version of ruby invoked the shell.

`rbenv global 3.4.4`

Okay, and now we need to build and then install Middlemac. First, grab the source that has
been modified to work with 

`git clone git@github.com:sbeitzel/middlemac.git`

`cd middlemac`

`bundle install` - this will download and install all the dependencies Middlemac needs.

`rake install` - this will actually install Middlemac to your Ruby installation.

At this point, you should be ready to go!

[Homebrew]: https://brew.sh
