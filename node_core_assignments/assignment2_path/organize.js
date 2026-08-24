const fs = require('node:fs/promises');
const path = require('node:path');

const sourceDir = process.argv[2]; 
const destinationDir = process.argv[3];  

if (!sourceDir || !destinationDir) {
    console.log('Usage: node organize.js <source> <destination>');
    process.exit(1);
}

async function exists(filePath) {
    try {
        await fs.access(filePath);
        return true;
    } catch {
        return false;
    }
}

async function organizeDirectory (currentDir, destinationDir) {
    const entries = await fs.readdir(currentDir, {
        withFileTypes: true
    });
    
    for (const entry of entries) {
        const sourcePath = path.join(currentDir, entry.name);

        if (entry.isDirectory()) {
            await organizeDirectory(sourcePath, destinationDir);
        }

        if (entry.isFile()) {
            const fileName = path.basename(sourcePath);
            const parsed = path.parse(fileName);   

            let category;

            if (fileName.startsWith('.')) {
                category = 'hidden';
            } else if (parsed.ext === '') {
                category = 'no-extension';
            } else {
                category = parsed.ext.slice(1);
            }

            const categoryDir = path.join(destinationDir, category);
            await fs.mkdir(categoryDir, {
                recursive: true
            });

            let destinationName = fileName;
            let destinationPath = path.join(categoryDir, destinationName);

            let counter = 1;

            while (await exists(destinationPath)) {
                destinationName = `${parsed.name}-${counter}${parsed.ext}`;
                destinationPath = path.join(categoryDir, destinationName);
                counter++;
            }

            await fs.copyFile(sourcePath, destinationPath);
            console.log(`${sourcePath} -> ${destinationPath}`);

        }
    }
}



organizeDirectory(sourceDir, destinationDir)
.then(() => {
    console.log('Organization completed.');
})
.catch((error) => {
    console.error('Error:', error.message);
    process.exit(1);
})