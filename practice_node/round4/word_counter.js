const fs = require('node:fs');

const filePath = process.argv[2];

if (!filePath) {
    console.log('Usage: node word-counter.js <file>');
    process.exit(1);
}

const stream = fs.createReadStream(filePath, {
    encoding: 'utf8', 
});

let wordCount = 0;
let leftover = '';
let bytesProcessed = 0; 

stream.on('data', (chunk) => {
    bytesProcessed += Buffer.byteLength(chunk, 'utf8');
    const data = leftover + chunk;
    const parts = data.split(/\s+/);  //разделить строку на слова
    const lastWord = data.match(/\S+$/);
    
    if (lastWord) {
        leftover = lastWord[0];
        parts.pop();
    } else {
        leftover = '';
    }
    wordCount += parts.filter(Boolean).length;
});

stream.on('end', () => {
    if (leftover) {
        wordCount++;
    }

    console.log(`Words: ${wordCount}`);
    console.log(`Bytes processed: ${bytesProcessed}`);
});

stream.on('error', (err) => {
    console.error('Error:', err.message)
});