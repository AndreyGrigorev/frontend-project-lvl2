#!/usr/bin/env node
import { Command } from 'commander';
import _ from 'lodash';
import * as fs from 'fs';
import * as path from 'path';

const program = new Command();

const read = (file) => {
  let result = fs.readFileSync(path.resolve(file)).toString();
  result = JSON.parse(result);

  return result;
};

program
  .description('Compares two configuration files and shows a difference.') 
  .version('0.0.1', '-V, --version', 'output the version number')
  .option('-f, --format <type>', 'output format')
  .argument('<filepath1>')
  .argument('<filepath2>')
  .action((filepath1, filepath2) => {
    const firstObj = read(filepath1);
    const secondObj = read(filepath2);
    const arrKeys = [...Object.keys(firstObj), ...Object.keys(secondObj)].sort();
    const sortKeys = _.sortedUniq(arrKeys);
    console.log('{');
    for (const key of sortKeys) {
      if (firstObj.hasOwnProperty(key)) {                    // Содержится ли свойство в 1-м объекте? Если да, то ...
        if (secondObj.hasOwnProperty(key)) {                 // Содержится ли свойство во 2-м объекте? Если да, то ...
          if (firstObj[key] === secondObj[key]) {            // Одинаковые ли значения этих свойств? Если да, то ...
          console.log('  ' + `  ${key}: ` + firstObj[key]);
          } else {                                           // Если не одинаковые, то ...
          console.log('  ' + `- ${key}: ` + firstObj[key]);
          console.log('  ' + `+ ${key}: ` + secondObj[key]);
          }
        } else {                                             // Если не содержится во 2-м объекте, то ...
          console.log('  ' + `- ${key}: ` + firstObj[key]);
        }
      } else {                                               // Если свойство не содержится в 1-м объекте, то ...
        console.log('  ' + `+ ${key}: ` + secondObj[key]);
      }
    }
    console.log('}');
  });

program.parse();