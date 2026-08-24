const fs = require('node:fs/promises');
const path = require('node:path');

async function readJson(filePath) {
    const content = await fs.readFile(filePath, 'utf8');
    try {
        return JSON.parse(content);
    } catch (error) {
        throw new Error(`Invalid JSON in ${path.basename(filePath)}: ${error.message}`);
    }
}

function isPlainObject (value) {
        return value !== null &&
        typeof value === 'object' &&
        !Array.isArray(value);
    }


function deepMerge(base, override) {
    const result = {...base};

    for (const key of Object.keys(override)) {
        if (isPlainObject(base[key]) && isPlainObject(override[key])) {
            result[key] = deepMerge(base[key], override[key]);
        } else {
            result[key] = override[key];
        }
    }
    return result;
}

async function main() {
    const environment = process.argv[2];

    if (!environment) {
        throw new Error('Usage: node merge.js <environment>');
    }

    const basePath = path.join(__dirname, 'config.base.json');

    const overridePath = path.join(__dirname,`config.${environment}.json`);
    const finalPath = path.join(__dirname, 'config.final.json');
    const tempPath = path.join(__dirname, 'config.final.json.tmp');

    const baseConfig = await readJson(basePath);
    let overrideConfig = {};

    try {
        overrideConfig = await readJson(overridePath);
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.warn(`Warning: ${path.basename(overridePath)} not found`);
        } else {
            throw error;
        }
    }
    const result = deepMerge(baseConfig, overrideConfig);
    const data = JSON.stringify(result, null, 2);

    await fs.writeFile(tempPath, data);
    await fs.rename(tempPath, finalPath);

    console.log(`Configuration written to ${path.basename(finalPath)}`);
}

main().catch((error) => {
    console.error(error.message);
    process.exit(1);
});