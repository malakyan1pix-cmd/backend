const fs = require('node:fs/promises');
const path = require('node:path');

async function rotateLog (filePath, limit) {
    let stats;
    try {
        stats = await fs.stat(filePath);
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.log(`No log file yet at ${filePath} -- nothing to rotate.`);
            return;
        }
        throw error;
    }

    if (stats.size <= limit) {
        console.log(`${filePath} is ${stats.size} bytes -- under the limit, no rotation needed.`);
        return;
    }
    const timeStamp = new Date()
    .toISOString()
    .replace(/[:.]/g, '-');

    const {name, ext} = path.parse(filePath);
    const archiveName = `${name}-${timeStamp}${ext}`;

    await fs.rename(filePath, archiveName);
    await fs.writeFile(filePath, '');
    console.log(`Rotated: ${filePath} -> ${archiveName} (fresh log created)`);

}
const filePath = process.argv[2];
const limit = 20;

rotateLog(filePath, limit);