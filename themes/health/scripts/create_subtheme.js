#!/usr/bin/env node

/**
 * @file
 * Custom functionality to create a new Health sub-theme.
 */

const { exception } = require('console');
const copydir = require('copy-dir');
const fs = require('fs');
const replace = require("replace-in-file");
const [,, themeName] = process.argv;
const projectPath = process.cwd();
const files = [
  "MY_THEME.info.yml",
  "MY_THEME.libraries.yml",
  "MY_THEME.theme",
];
const regexPattern = /MY_THEME/g;

if (typeof themeName !== "string") {
  throw "This function expects you to provide the name of the new theme as a string. Please try again.";
}

// Copy sub-theme to new folder.
const newProjectPath = `${projectPath}/../${themeName}`;

try {
  copydir.sync(`${projectPath}/MY_THEME`, newProjectPath, {
    utimes: true,
    mode: true,
    cover: true,
    filter: (stat, filepath, filename) => {
      // Ignore node_modules directory.
      if (stat === 'directory' && filename === 'node_modules') {
        return false;
      }
      return true;
    }
  });
}
catch (error) {
  console.error("Error occurred: ", error);
}

// Replace instances on MY_THEME in files with new project name.
for (const file in files) {
  try {
    // Rename files so they are picked up by Drupal and match new theme name.
    const newFileName = files[file].replace(regexPattern, themeName);
    fs.rename(`${newProjectPath}/${files[file]}_`, `${newProjectPath}/${newFileName}`, (error) => {
      if (error) {
        console.error("Error occurred: ", error);
      }
    });

    // Replace instances of MY_THEME with new theme name.
    const options = {
      files: [
        `${newProjectPath}/${newFileName}`
      ],
      from: regexPattern,
      to: themeName
    };
    const results = replace.sync(options);
  }
  catch (error) {
    console.error("Error occurred: ", error);
  }
}

// Rename `components/MY_THEME` directory.
const originalDirectory = `${newProjectPath}/source/sass/components/MY_THEME`;
const newDirectory = `${newProjectPath}/source/sass/components/${themeName}`;
try {
  fs.renameSync(originalDirectory, newDirectory);
}
catch (error) {
  console.error("Error occurred: ", error);
}

// Yay it worked. Tell the world about it.
const successMessage = `

Congratulations! Your new subtheme "${themeName}" is ready.

`;
console.log(successMessage);
