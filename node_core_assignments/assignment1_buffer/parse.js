const fs = require('node:fs');

function parse () {
    const buffer = fs.readFileSync('records.bin');
    
    const magic = buffer.toString('ascii', 0, 4);
    if (magic !== 'SNSR') {
        throw new Error('Invalid file format: expected SNSR');
    }
    
    const version = buffer.readUInt8(4);
    if (version !== 1) {
        throw new Error(`Unsupported version: ${version}`);
    }
    console.log('File format valid (SNSR v1)');
    
    const recordCount = buffer.readUInt16BE(5);
    console.log('Records parsed:', recordCount);

    const records = [];
    let offset = 7; 
    
    for (let i = 0; i < recordCount; i++) {
        const timestamp = buffer.readUInt32BE(offset);
        const date = new Date(timestamp * 1000);
        
        const temperature = buffer.readFloatBE(offset + 4);
        const sensorId = buffer.readUInt8(offset + 8);

        records.push({
            timestamp: date,
            temperature,
            sensorId
        });
        offset += 9;
    }
    return records;
}

function averageTemperature(records) {
    let totalTemperature = 0;

    for (const record of records) {
        totalTemperature += record.temperature;
    }
    const avTemp = totalTemperature / records.length;
    return avTemp;
}

function mostActiveSensor (records) {
    const sensorCounts = new Map();

    for (const record of records) {
        const sensorId = record.sensorId;
        if (!sensorCounts.has(sensorId)) {
            sensorCounts.set(sensorId, 1);
        }
        else {
            sensorCounts.set(
                sensorId, sensorCounts.get(sensorId) + 1
            );
        }
    }
    let mostActiveId = null;
    let maxCount = 0;

    for (const [sensorId, count] of sensorCounts) {
        if (count > maxCount) {
            maxCount = count;
            mostActiveId = sensorId;
        }
    }
    return {
        sensorId: mostActiveId,
        count: maxCount
    };
}

let res = parse();
let temperature = averageTemperature(res);
let result = mostActiveSensor(res);
console.log(`Average temperature: ${temperature.toFixed(2)}°C`);
console.log(`Most active sensor: #${result.sensorId} (${result.count} readings)`);