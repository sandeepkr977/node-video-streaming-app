let path = require('path');
let fs = require('fs');

let getAllFilesFromDir = (dir, fileList) => {
    let files = fs.readdirSync(dir, { encoding: 'utf-8' });
    files.forEach(f => {
        if (fs.statSync(path.join(dir, f)).isDirectory())
            getAllFilesFromDir(path.join(dir, f), fileList);
        else if (fs.statSync(path.join(dir, f)).isFile()) {
            fileList.push({ file: f, path: dir, size: fs.statSync(path.join(dir, f)).size });
        }
    });
}

let getDirSize = (dir) => {
    var fileList = new Array();
    getAllFilesFromDir(dir, fileList);
    return fileList.reduce((total, value) => total + value.size, 0);
}

module.exports = {
    getDirSize,
    getAllFilesFromDir
}