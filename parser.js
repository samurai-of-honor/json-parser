const fs = require('fs');

let fileContent = fs.readFileSync("test.json", "utf8");


const objectParser = (input) => {
    if (!input.startsWith('{')) return null;
    let object = {}
    input = input.slice(1, input.length - 1).replace(/\s/g, ''); // replace spaces with ''
    while (true) {
        input = stringParser(input);
        if (!input) return null;
        let [key, value] = input;
        if (!value) return null;
        value = valueParser(value);
        if (!value) return null;
        object[key] = value[0];

        if (!temp) break;
        input = temp[1];
    }
    return (input.startsWith('}')) ? [object, input.slice(1)] : null;
}

const arrayParser = (input) => {
    if (!input.startsWith('[')) return null;
    input = input.slice(1);
    let arr = [];
    while (true) {
        let space;
        input = valueParser(input);
        if (!input) { return null } arr.push(input[0]);
        if (!temp) { break } input = temp[1];
    }
    return (input.startsWith(']')) ? [arr, input.slice(1)] : null;
}



const stringParser = (input, i = 1) => {
    if (!input.startsWith('"')) return null;
    while (input[i] !== '"') i++;
    return [input.substring(1, i), input.slice(i + 1)];
}



const anyOneParserFactory = (...parsers) => (input) => parsers.reduce((accum, parser) => (accum === null) ? parser(input) : accum);
const valueParser = anyOneParserFactory(stringParser, arrayParser, objectParser);
const inpStr = fileContent.toString();
const output = valueParser(inpStr);
console.log(output);
output ? console.log(JSON.stringify(output[0], null, 2)) : console.log('Invalid JSON');