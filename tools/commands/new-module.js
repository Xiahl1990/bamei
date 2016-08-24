'use strict';

/**
 * 项目脚手架开发工具
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

const fs = require('fs');
const path = require('path');
const colors = require('colors');
const inquirer = require('inquirer');
const utils = require('lei-utils');

const schema = [{
  type: 'input',
  name: 'module',
  message: 'module 名称:',
  validate(value) {
    if (!/^([a-z0-9]|-)+$/.test(value)) {
      return colors.red('[X] 格式不正确 (假如要创建模块 bamei-module-abc 则输入 abc)');
    }
    return true;
  },
}];
inquirer.prompt(schema).then(answers => {

  const shortName = answers.module;
  const pkg = require(path.resolve(__dirname, './new-module/module-package.tpl.json'));
  pkg.name = pkg.description = `bamei-module-${ shortName }`;

  const dir = path.resolve(__dirname, `../../modules/${ shortName }`);
  if (fs.existsSync(dir)) {
    console.log(colors.red(`${ dir } 目录已存在！`));
    return;
  }
  console.log(`创建目录: ${ dir }`);
  fs.mkdirSync(dir);

  const pkgFile = path.resolve(dir, 'package.json');
  console.log(`创建文件: ${ pkgFile }`);
  fs.writeFileSync(pkgFile, utils.jsonStringify(pkg, 2));

  const sourceIndexFile = path.resolve(__dirname, './new-module/module-index.tpl.js');
  const indexFile = path.resolve(dir, 'index.js');
  console.log(`创建文件: ${ indexFile }`);
  let indexContent = fs.readFileSync(sourceIndexFile).toString();
  indexContent = replaceVar(indexContent, '${name}', shortName);
  indexContent = replaceVar(indexContent, '${Name}', capitalizeFirstLetter(shortName));
  fs.writeFileSync(indexFile, indexContent);

  console.log('完成。');

}).catch(err => {
  console.error(colors.red(err.stack));
});

function replaceVar(tpl, name, value) {
  return tpl.replace(name, value);
}

function capitalizeFirstLetter(text) {
  return text[0].toUpperCase() + text.slice(1);
}