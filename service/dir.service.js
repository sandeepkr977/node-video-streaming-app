let path = require('path');
let fs = require('fs');
let fl = [];

let listOfFiles = (dir, fileList) => {
    let files = fs.readdirSync(dir, { encoding: 'utf-8' });
    files.forEach(f => {
        if (fs.statSync(path.join(dir, f)).isDirectory())
            listOfFiles(path.join(dir, f));
        else if (fs.statSync(path.join(dir, f)).isFile()) {
            fileList.push({ file: f, path: dir, size: fs.statSync(path.join(dir, f)).size });
        }
    });
}

let dirSize = (dir) => {
    var fileList = new Array();
    listOfFiles(dir, fileList);
    return fileList.reduce((total, value) => total + value.size, 0);
}

console.log(dirSize(__dirname + '\\..\\VIDEOS'))