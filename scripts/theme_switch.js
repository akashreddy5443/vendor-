const fs = require('fs');
const path = require('path');

const srcDir = path.resolve(__dirname, '../src');

function getAllFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);

    arrayOfFiles = arrayOfFiles || [];

    files.forEach(function (file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
        } else {
            if (file.match(/\.(tsx|ts|js|jsx|css)$/)) {
                arrayOfFiles.push(path.join(dirPath, "/", file));
            }
        }
    });

    return arrayOfFiles;
}

const files = getAllFiles(srcDir);

// Replacement Logic
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // Direct Tailwind swaps
    content = content.replace(/orange-50/g, 'blue-50');
    content = content.replace(/orange-100/g, 'blue-100');
    content = content.replace(/orange-200/g, 'blue-200');
    content = content.replace(/orange-300/g, 'blue-300');
    content = content.replace(/orange-400/g, 'blue-400');
    content = content.replace(/orange-500/g, 'blue-500');
    content = content.replace(/orange-600/g, 'blue-600');
    content = content.replace(/orange-700/g, 'blue-700');
    content = content.replace(/orange-800/g, 'blue-800');
    content = content.replace(/orange-900/g, 'blue-900');
    content = content.replace(/orange-950/g, 'blue-950');

    if (content !== original) {
        console.log(`Updated: ${path.basename(file)}`);
        fs.writeFileSync(file, content, 'utf8');
    }
});
