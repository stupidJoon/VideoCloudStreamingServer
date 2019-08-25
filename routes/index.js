var express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const exec = require('child_process').exec;

var router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/videos'));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
})
const upload = multer({ storage: storage })

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/upload', upload.single('video'), (req, res) => {
  console.log(req.query)
  console.log(JSON.stringify(req.body, null, 4))
  let str = 'ffmpeg -i public/videos/' + req.file.originalname + ' -profile:v baseline -level 3.0 -s 640x360 -start_number 0 -hls_time 10 -hls_list_size 0 -f hls public/videos/' + req.file.originalname.split('.')[0] + '.m3u8';
  exec(str, (error, stdout, stderr) => {
    if (error) console.log(error);
    console.log(stdout);
    console.log(stderr);
    res.json({'status': true});
  });
});

router.get('/video', (req, res) => {
  fs.readdir(path.join(__dirname, '../public/videos/'), (err, files) => {
    if (err) throw err;
    let fileNameArr = [];
    files.forEach((value, index, array) => {
      if (value.split('.')[1] == 'm3u8') {
        fileNameArr.push(value);
      }
    });
    res.json({'status': true, 'videos': fileNameArr});
  });
});

module.exports = router;
