const fs = require('node:fs');
const filePath = process.argv[2];

if (!filePath) {
    console.log('Usage: node analyze.js <log-file>');
    process.exit(1);
}

const stream = fs.createReadStream(filePath, {encoding: 'utf-8'});

let leftover = '';

let linesProcessed = 0;
let errorCount = 0;
let warnCount = 0;
let infoCount = 0;

let lastErrorTimestamp = null;
let lastErrorTimeString = null;

let longestGap = 0;
let longestGapStart = null;
let longestGapEnd = null;


function processLine (line) {
    if (!line) {
        return;
    }
    linesProcessed++;
    const timestampString = line.slice(0, 20);

    if (line.includes('[ERROR]')) {
        errorCount++;
        const currentTimestamp = new Date(timestampString);
        
        if (lastErrorTimestamp !== null) {
            const gap = (currentTimestamp - lastErrorTimestamp) / 1000;
            if (gap > longestGap) {
                longestGap = gap;
                longestGapStart = lastErrorTimeString;
                longestGapEnd = timestampString;
            }
        }
        lastErrorTimestamp = currentTimestamp;
        lastErrorTimeString = timestampString;
    } else if (line.includes('[WARN]')){
            warnCount++;

    } else if (line.includes('[INFO]')) {
        infoCount++; 
    }
}

stream.on ('data', (chunk) => {
    const data = leftover + chunk;
    const lines = data.split('\n');
    leftover = lines.pop();
    for (const line of lines) {
        processLine(line);
    }
});


stream.on('end', () => {
    if (leftover) {
        processLine(leftover);
    }
    console.log(`Lines processed: ${linesProcessed}`);
    console.log(`ERROR: ${errorCount}`);
    console.log(`WARN: ${warnCount}`);
    console.log(`INFO: ${infoCount}`);
    console.log(`Longest gap between ERRORs: ${longestGap} seconds`);

    if (longestGapStart !== null && longestGapEnd !== null) {
        console.log(`(between ${longestGapStart} and ${longestGapEnd})`);
    }
});

stream.on('error', (error) => {
    console.error(`Error reading file: ${error.message}`);
    process.exit(1);
});