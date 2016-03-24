# poeditor-cli
Command line tool for managing translation terms for POEditor.com

# How to use
## Install
npm install -g poeditor-cli

## Run
You should now be able to use the command line tool by typing poeditor [command]. The first run will require you to do some configuration, like proving an API-Token for POEditor.com .
This first configration run will put a .poeditor-config in the current working directory, and will be used by the cli-tool in future uses, but only if the command was executed from the same directory where the configuration file resides.

# Commands
Usage: poeditor [options] [command]


  Commands:

    pull                                   Download translations from POEditor
    push                                   Upload newly added/staged translations to POEditor
    config                                 Perform some configurations
    add [destination] [key] [translation]  Add new translation term with a key and the default translation
    reset                                  Clears POEditor staging area
    projects                               Displays the available projects for the given API-Token
    status                                 Displays the current staging are, e.g. Terms that still have to be pushed to the POEditor server
    statistics                             Displays the current projects completition statistics
    help [cmd]                             display help for [cmd]

  Options:

    -h, --help     output usage information
    -V, --version  output the version number
