let Busboy = require('busboy');
let fs = require('fs');
var md5 = require('md5');
var path = require('path');
let inspect = require('util').inspect;
let cache = require('./cache.service');

let videoDataFile = __dirname + '/../data.json';

// let videos = require(videoDataFile);


let uploadVideo = (req, res) => {
    let folderSize = __dirname + '\\..\\VIDEOS';
    let date = new Date();
    let userId = "UID123"
    let folder = __dirname + "\\.." + "\\VIDEOS\\" + userId + "\\" + "Y" + date.getFullYear() + "\\" + "M" + date.getMonth() + "\\" + "D" + date.getDate();

    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder, { recursive: true });
    }
    var busboy = new Busboy({ headers: req.headers });

    let videoId = null;
    let videoPath = null;
    let videoTitle = null;
    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
        videoId = md5(userId + date.getTime());

        videoPath = folder + "\\" + videoId + path.extname(filename);
        videoTitle = path.basename(filename).split(".")[0];

        fs.open(videoPath, 'w', function(err, file) {
            if (err) throw err;
        });

        let fw = fs.createWriteStream(videoPath);
        file.on('data', function(data) {
            fw.write(data)
        });

        file.on('end', function() {
            console.log('File [' + fieldname + '] Finished');
        });
    });

    busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated) {
        console.log('Field [' + fieldname + ']: value: ' + inspect(val));
    });

    busboy.on('finish', function() {
        addVideo({
            path: videoPath,
            id: videoId,
            title: videoTitle
        })
        res.writeHead(303, { Connection: 'close', Location: '/video/upload/success' });
        res.end()
    });

    req.pipe(busboy);
}

let addVideo = async(v) => {
    let data = cache.getValues();
    let nv = {
        "path": v.path,
        "videoId": v.id,
        "title": v.title,
        "screenshot": [],
        "subscribersCount": 200,
        "channelName": "Latest Gaana",
        "views": "2k",
        "uploadedOn": new Date()
    };
    data.push(nv);
    var result = await fs.writeFileSync(videoDataFile, JSON.stringify(data), { encoding: 'utf-8' });
    cache.put(v.id, nv);
    console.log(`Video Added : ${nv}`);
}

let streamVideo = (req, res) => {
    let videoId = req.params['id'];
    let videoPath = cache.get(videoId).path;
    const range = req.headers.range;

    if (!range) {
        res.status(400).send("Requires Range header");
    }

    const videoSize = fs.statSync(videoPath).size;
    const CHUNK_SIZE = 10 ** 6; // 1MB
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
    const contentLength = end - start + 1;
    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4",
    };
    res.writeHead(206, headers);
    const videoStream = fs.createReadStream(videoPath, { start, end });
    videoStream.pipe(res);
}

let getVideo = async(req, res) => {
    let videoId = req.params['id'];
    let video = cache.get(videoId);
    let streamUrl = `/video/${videoId}/stream`;
    res.jsonp({
        video,
        streamUrl
    });
}

let uploadVideoSuccess = (req, res) => {
    res.jsonp({
        status: 'success'
    });
}


let getVideoList = async(req, res) => {
    console.log(req.query['index']);
    console.log(req.query['page-per-records']);
    let data = cache.getValues();
    res.send(data);
}

let readVideos = async() => {
    let data = await fs.readFileSync(videoDataFile, { encoding: 'utf-8' });
    let arr = JSON.parse(data);
    arr.map((v, k) => cache.put(v.videoId, v));
}

module.exports = {
    uploadVideo,
    addVideo,
    streamVideo,
    getVideo,
    uploadVideoSuccess,
    getVideoList,
    readVideos
};