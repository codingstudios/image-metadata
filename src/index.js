const express = require('express');
const app = express();
const path = require('path');
const axios = require('axios');
const helmet = require('helmet');
const exif = require('exifr');
const reader = require('exifreader');
const upload = require('express-fileupload');

app.use(upload());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.set('trust proxy');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
}));


app.get('/', (req, res) => {
    res.render("index");
})

app.post('/url', async (req,res) => {
   try {
   const url = req.body.url;
   const img = (await axios.get(`${url}`, { responseType: 'arraybuffer' }).catch(err=>{
      console.log(err)
   })).data;
   const data = await exif.parse(img);
   const parse = await reader.load(img);
   res.send({ ...data, ...parse })
   }catch(e) {
       console.log(e);
    res.send({
       message: "Something went wrong"
    });
   }
})

app.post('/image', async (req,res) => {
   try {
   const img = req.files.file.data;
   const data = await exif.parse(img);
   const parse = await reader.load(img);
   res.send({ ...data, ...parse })
   }catch(e) {
       console.log(e);
    res.send({
       message: "Something went wrong"
    });
   }
})

app.listen(4000);


/*
Handcoded By Chee Yong Lee (https://github.com/joeleeofficial) & (https://github.com/leecheeyong)
This code is available as open source under the terms of the MIT License (https://github.com/CodingStudios/image-metadata/blob/main/LICENSE)
*/
