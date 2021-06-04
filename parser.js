'use strict';

const fs = require('fs');

const test = fs.readFileSync('test.json', 'utf8');
const test2 = fs.readFileSync('test2.json', 'utf8');

const spaceParser = input =>
  (input.match(/^[\s\n]/) ? input.slice(input.match(/\S/).index) : input);

const stringParser = input => {
  if (!input.startsWith('"')) return null;
  let string = '';
  input = input.slice(1);

  while (input.length > 0 && !input.startsWith('"')) {
    string += input.slice(0, 1);
    input = input.slice(1);
  }
  return input.startsWith('"') ? [string, input.slice(1)] : null;
};

const objectParser = input => {
  if (!input.startsWith('{')) return null;
  const object = {};
  input = input.slice(1);
  let key = '';
  let value = '';

  while (input.length > 0 && !input.startsWith('}')) {
    input = spaceParser(input);
    const returned = inputCheck(input);

    if (typeof returned[0] === 'string' && key === '') {
      key = returned[0];
    } else if (returned[0] !== null && key !== '') {
      value = returned[0];
      object[key] = value;
      key = '';
      value = '';
    }

    input = spaceParser(returned[1]);
  }

  return input.startsWith('}') ? [object, input.slice(1)] : null;
};

const arrayParser = input => {
  if (!input.startsWith('[')) return null;
  input = input.slice(1);
  const arr = [];
  let el = '';

  while (input.length > 0 && !input.startsWith(']')) {
    input = spaceParser(input);
    const returned = inputCheck(input);

    if (returned[0] !== null) {
      el = returned[0];
      arr.push(el);
    }

    input = spaceParser(returned[1]);
  }
  return input.startsWith(']') ? [arr, input.slice(1)] : null;
};

const inputCheck = input => {
  const start = input.slice(0, 1);
  if (start === '{') return objectParser(input);
  else if (start === '[') return arrayParser(input);
  else if (start === '"') return stringParser(input);
  else if (start === ':') return [null, input.slice(1)];
  else if (start === ',') return [null, input.slice(1)];
};

console.log('------------------------\nFirst test:\n------------------------');
const inpStr = test.toString();
const output = objectParser(inpStr)[0];
console.log(JSON.stringify(output, null, 2));

console.log('------------------------\nSecond test:\n------------------------');
const inpStr2 = test2.toString();
const output2 = objectParser(inpStr2)[0];
console.log(JSON.stringify(output2, null, 2));
