const fs = require('node:fs');

function encode() {
    const records = [
        { timestamp: 1754836321, temperature: 21.5, sensorId: 1 },
        { timestamp: 1754836421, temperature: 22.1, sensorId: 2 },
        { timestamp: 1754836521, temperature: 20.8, sensorId: 3 },
        { timestamp: 1754836621, temperature: 21.9, sensorId: 3 },
        { timestamp: 1754836721, temperature: 22.4, sensorId: 1 },
        { timestamp: 1754836821, temperature: 20.5, sensorId: 3 },
        { timestamp: 1754836921, temperature: 21.7, sensorId: 2 },
        { timestamp: 1754837021, temperature: 22.0, sensorId: 3 },
        { timestamp: 1754837121, temperature: 21.3, sensorId: 1 },
        { timestamp: 1754837221, temperature: 22.2, sensorId: 3 }
    ];
    const bufferSize = 7 + records.length * 9;
    const buffer = Buffer.alloc(bufferSize);
    let offset = 0;
    
    buffer.write('SNSR', offset);
    offset += 4;
    
    buffer.writeUInt8(1, offset);
    offset += 1;
    
    buffer.writeUInt16BE(records.length, offset);
    offset += 2;
    
    for (const record of records) {
        buffer.writeUInt32BE(record.timestamp, offset);
        offset += 4;
        
        buffer.writeFloatBE(record.temperature, offset);
        offset += 4;
        
        buffer.writeUInt8(record.sensorId, offset);
        offset += 1;
    }
    return buffer;
}

const output  = encode();
fs.writeFileSync('records.bin', output);
