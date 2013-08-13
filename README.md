Build Information Monitor
=========================

Having a continuous integration server doesn't do very much if nobody knows when the builds break.  That's why you really should have some sort of "build information radiator".  You can make your own with the Philips Hue light bulbs, X10 home automation or in other ways you dream up.  This software will help you control if things should be on and perhaps what color they should show.

Installation For Use
--------------------

You should be able to install the package with npm and point the installed program at your config file.  A sample one is committed to the repository to help get you started.

    sudo npm install -g build-monitor
	build-monitor my_config.yml

Development Installation
------------------------

First, clone the repository somewhere you'd like to see it.  Next, you will need to get the submodules and packages from npm.  Finally, run the `setup_repository` script to finish getting git hooks and other tidbits.

   git clone https://github.com/fidian/build-monitor.git
   cd build-monitor
   git submodule init
   git submodule update
   npm install
   3rd_party/bare_repo/util/bin/setup_repository

License
-------

This repository is covered by an MIT license.  The full text is available in the `LICENSE.md` file in the repository.
