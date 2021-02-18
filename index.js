let express = require("express");
let app = express();
let fs = require('fs');
let path = require('path');
let bodyParser = require('body-parser');

let morgan = require('morgan');
let PORT = 8888;

let videoService = require('./service/video.service');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    var ip = (req.headers['x-forwarded-for'] || '').split(',').pop().trim() ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
    console.log("CLIENT IP ADDRESS : " + ip);
    req.params['ipAddress'] = ip;
    next();
})

morgan(function(tokens, req, res) {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms'
    ].join(' ')
});

videoService.readVideos()

// video start--------------------------------------

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/videos', videoService.getVideoList);

app.get('/video/upload', (req, res) => {
    return res.sendFile(path.join(__dirname, 'upload.html'));
});

app.post('/video/upload', videoService.uploadVideo);

app.get('/video/:id', videoService.getVideo);

app.get('/video/upload/success', videoService.uploadVideoSuccess);

app.get('/video/:id/stream', videoService.streamVideo);

// app.post('/video/:id/delete', videoService.removeVideo);

// video end-----------------------------------------------

// channel--------------------------------------


// channel end------------------------------------

app.listen(PORT, () => {
    console.log(`server started and listening on port ${PORT}`);
});