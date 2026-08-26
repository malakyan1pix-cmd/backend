const path = require('node:path');

function  sanitizeName(name) {
    const { name: base, ext } = path.parse(name);

    const cleanExt = ext.toLowerCase();
    const cleanBase = base
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

    return cleanBase + cleanExt;
}


async function organizeFiles(inputDir, outputDir) {
    await fs.mkdir(outputDir, { recursive: true });

    const files = await fs.readdir(inputDir, { withFileTypes: true });

    for (const file of files) {
        if (!file.isFile()) {
            continue;
        }

        const oldPath = path.join(inputDir, file.name);
        const newName = sanitizeName(file.name);
        const newPath = path.join(outputDir, newName);

        await fs.copyFile(oldPath, newPath);

        console.log(`${file.name} -> ${newName}`);
    }
}

const inputDir = process.argv[2];
const outputDir = process.argv[3];

if (!inputDir || !outputDir) {
    console.log('Usage: node sanitize.js <input-folder> <output-folder>');
    process.exit(1);
}

organizeFiles(inputDir, outputDir);