const Downloader = require('./downloader');

const downloader = new Downloader();

downloader.on('progress', (percent) => {
    const filled = Math.floor(percent / 5);
    const empty = 20 - filled;

    const progressBar = '#'.repeat(filled);
    const emptyBar = '-'.repeat(empty);

    const bar = `[${progressBar}${emptyBar}]`;

    process.stdout.write(`\r${bar} ${percent}%`);

});

downloader.on('done', () => {
    process.stdout.write('\nDownload complete!\n');
});

downloader.download();