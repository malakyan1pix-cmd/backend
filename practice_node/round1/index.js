const fs = require('node:fs');

function caeserShift(input, shift) {
    let res = Buffer.alloc(input.length);

    for (let i = 0; i < input.length; i++) {
        let byte = input[i];

        if (byte >= 65 && byte <= 90) {
            res[i] = ((((byte - 65 + shift) % 26) + 26) % 26) + 65;
        }
        else if (byte >= 97 && byte <= 122) {
            res[i] = ((((byte - 97 + shift) % 26) +26) % 26) + 97;
        }
        else {
            res[i] = byte;
        }
    }
    return res;
}


const inputPath = process.argv[2] ?? 'message.txt';
const shift = process.argv[3] ?? 2;

const input = fs.readFileSync(inputPath);
const output = caeserShift(input, shift);

fs.writeFileSync('encoded.txt', output);