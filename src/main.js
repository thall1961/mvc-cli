import chalk from 'chalk';
import fs from 'fs';
import ncp from 'ncp';
import path from 'path';
import {promisify} from 'util';

const access = promisify(fs.access);
const copy = promisify(ncp);

async function copyTemplateFiles(options) {
  return (
    copy(options.templateDirectory, options.targetDirectory),
    {
      clobber: false
    }
  );
}

// change to createMVC
export async function createProject(options) {
  options = {
    ...options,
    targetDirectory: options.targetDirectory || process.cwd()
  };

  const currentFileUrl = import.meta.url;
  const templateDir = path.resolve(
    new URL(currentFileUrl).pathname.substring(
      new URL(currentFileUrl).pathname.indexOf('/') + 1
    ),
    './../templates',
    options.template.toLowerCase()
  );
  options.templateDirectory = templateDir;

  try {
    await access(templateDir, fs.constants.R_OK);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }

  console.log('Copying project files');
  await copyTemplateFiles(options);
  console.log('%s Project ready', chalk.green.bold('DONE'));

  return true;
}
