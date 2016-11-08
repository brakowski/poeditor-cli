# poeditor-cli

As a developer it's really annoying to open the POEditor.com website just to add a few new translations terms or change existing ones. With this command line tool, that will not be neccessary anymore (_mostly_). 

The naming conventions for the commands are inspired by git.

# Configuration

There are two ways to configure the commandline tool. A global configuration and a local configuration. The local configuration refers to the `.poeditor-config` file in the current working directory (e.g. the directory poeditor is being executed in).

You can either use the command `poeditor config` to set a specific configuration, or simply edit the configuration file manually (the config is saved as JSON).

The following configuration options are available:

* **targetDir** - The target directory, where the downloaded translations should be written to **[default: _./_]**
* **apiToken** - The API-Token to access your POEditor.com account
* **projectId** - The id of the project you want to manage as a default
* **projectLanguages** - An array of languages that should be managed (must exist in the project)
* **defaultLanguage** - The default language for the project on POEditor.com **[default: _en-us_]**
* **exportType** - The downloaded translations from POEditor.com can be saved in a few different filetypes. Currently `json`, `json-properties` and `properties` are supported. A custom exporter can also be provided, see below. **[default: _properties_]**
* **exportSingleFileTarget** - You can either save all the downloaded translations in the defined **exportType** in a single file or in multiple files, where each file is for a different translation language **[default: _false_]**

On the first run in a specific working directory, you will be asked by to provide a few configurations like the API-Token, that will already put a few configurations into your `.poeditor-config` file.

## Export types
* **json** - This export type just saves the downloaded translations as json in either a single file or multiple files
* **properties** - Saves all the downloaded translations into multiple `.property` files

You can also provide your own custom exporter. For that you only need to provide the exporter js file path starting at the working directory. That javascript file should export a function that takes three parameters `config`, `files` and `callback`. **config** contains the configuration for the current execution or poeditor, **files** contains the downloaded translations and **callback** is a function that should be called by the exporter as soon as it is done writing to the target directory.
# How to use
## Install
`npm install -g poeditor-cli`

## Run
You should now be able to use the command line tool by typing `poeditor [command]`.

# Commands
Usage: poeditor [options] [command]


  Commands:

    pull                                   Download translations from POEditor
    push                                   Upload newly added/staged translations to POEditor
    config                                 Perform some configurations
    add <term> <defaultTranslation>        Add new translation term with a key and the default translation
    reset                                  Clears POEditor staging area
    projects                               Displays the available projects for the given API-Token
    status                                 Displays the current staging are, e.g. Terms that still have to be pushed to the POEditor server
    statistics                             Displays the current projects completition statistics
    help [cmd]                             display help for [cmd]

  Options:

    -h, --help     output usage information
    -V, --version  output the version number
