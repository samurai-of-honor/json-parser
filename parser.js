'use strict';

const fs = require('fs');

const testToRun = () => {
  let test;
  if (process.argv[2] !== undefined) {
    if (fs.existsSync(process.argv[2])) {
      test = fs.readFileSync(process.argv[2], 'utf8');
    } else {
      console.log(`Cant find file named: ${process.argv[2]}`);
    }
  } else {
    test = fs.readFileSync('test.json', 'utf8');
  }
  return test;
};

const inputCheck = (input) => {
  const start = input.slice(0, 1);
  const query = /^[-+]?(\d+(\.\d*)?|\.\d+)([e][+-]?\d+)?/i;
  if (start === '{') return objectParser(input);
  else if (start === '[') return arrayParser(input);
  else if (start === '"') return stringParser(input);
  else if (input.match(query)) return numberParser(input);
  else if (start === ':') return ['', input.slice(1)];
  else if (start === ',') return ['', input.slice(1)];
  else if (input.startsWith('null')) return [null, input.slice(4)];
};

const spaceParser = (input) =>
  input.match(/^[\s\n]/) ? input.slice(input.match(/\S/).index) : input;

const numberParser = (input) => {
  const query = /^[-+]?(\d+(\.\d*)?|\.\d+)([e][+-]?\d+)?/i;
  const number = input.match(query)[0];
  return [parseFloat(number), input.slice(number.length)];
};

const stringParser = (input) => {
  if (!input.startsWith('"')) return null;
  let string = '';
  input = input.slice(1);

  while (input.length > 0 && !input.startsWith('"')) {
    string += input.slice(0, 1);
    input = input.slice(1);
  }
  return input.startsWith('"') ? [string, input.slice(1)] : null;
};

const objectParser = (input) => {
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
    } else if (returned[0] !== '' && key !== '') {
      value = returned[0];
      object[key] = value;
      key = '';
      value = '';
    }

    input = spaceParser(returned[1]);
  }

  return input.startsWith('}') ? [object, input.slice(1)] : null;
};

const arrayParser = (input) => {
  if (!input.startsWith('[')) return null;
  input = input.slice(1);
  const arr = [];
  let el = '';

  while (input.length > 0 && !input.startsWith(']')) {
    input = spaceParser(input);
    const returned = inputCheck(input);

    if (returned[0] !== '') {
      el = returned[0];
      arr.push(el);
    }

    input = spaceParser(returned[1]);
  }
  return input.startsWith(']') ? [arr, input.slice(1)] : null;
};

const test = testToRun();

if (test) {
  console.log('------------------------\nTest:\n------------------------');
  const inpStr = test.toString();
  const output = objectParser(inpStr)[0];
  console.log(JSON.stringify(output, null, 2));
}
