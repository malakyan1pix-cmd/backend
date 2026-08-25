const path = require('node:path');

function  sanitizeName(name) {
    const { name: base, ext } = path.parse(name);

    const cleanExt = ext.toLowerCase();
    const cleanBase = base
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') //sarqi gcik
    .replace(/^-+|-+$/g, '');

    return cleanBase + cleanExt;
}
const inputPath = process.argv[2];


console.log(sanitizeName('My Photo (final) FINAL.JPG'));
console.log(sanitizeName('report--2024.PDF'));
console.log(sanitizeName('weird_spacing .txt'));
console.log(sanitizeName('archive.tar.GZ'));
console.log(sanitizeName('noext_file'));