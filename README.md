# WP Hachel Gulpfile

The code above is a Gulp script used to compile CSS and JavaScript files for a WordPress theme. Gulp is a command line tool that automates common web development tasks, such as compiling CSS and JavaScript files.

The script starts by including various Node.js modules, such as gulp, sass and uglify, which will be used to perform the automation tasks. It also uses the dotenv module to load environment variables from an .env file.

The script then defines an is_wpdev function that checks whether the current environment is of type "development". This function will be used to determine whether the files should be compiled in development mode or production mode.

The script then defines several functions to perform different automation tasks. The copyExternalLibrary function copies the external library files to the specified destination directory. The buildStyles function compiles the Sass files into CSS and applies various transformations (such as adding CSS prefixes and minimisation) depending on the current environment. The buildScripts function does the same with the JavaScript files.

Finally, the script defines Gulp tasks to be performed using these functions, as well as tasks for monitoring files and generating translation files for the theme.

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`WP_ENV`

## themeconfig.json

### externalLibrary

Allows to copy a file or a folder, specific or not

- use `single` settings when it is a solo file
- use an `array` in `src` settings for specific folders or files

### stylesFiles and scriptsFiles

- use an `array` in `src` settings for specific folders or files

### makepotFiles

- use the `domain` and `package` settings of your theme to make it work

## Feedback

If you have any feedback, please reach out to us at laurenthergot.contact@gmail.com
