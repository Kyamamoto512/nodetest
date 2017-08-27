"use strict";
const express = require('express')
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb)=> {
    cb(null, './static/images')
  },
  filename: (req, file, cb)=> {

     const filename = file.fieldname + '-' + Date.now()

     switch(file.mimetype) {
       case "image/jpeg":
         return cb(null, `${filename}.jpg`)
       case "image/png":
         return cb(null, `${filename}.png`)
       case "image/gif":
         return cb(null, `${filename}.gif`)
       default:
         return cb(null, filename)
     }
  }
});

const upload = multer({
    storage: storage,
});
// ルーティングを行うためのモジュール
const router = express.Router()
/* GET home page. */
router.get('/', (req, res, next)=> {
  // テンプレートファイルを使ってHTMLファイルを返す
  connection.query('SELECT * FROM posts;', (err, results, fields)=>{
    if(err)
      return next(new Error())
    else
      return res.render('index', {'posts': results})
  })
})

// router.post('/post', (req, res, next)=>{

//   if(!req.body.text)
//     return next(new Error())
//   else
//     connection.query('INSERT INTO posts (text, name) values (?, ?)', [req.body.text, req.body.name], (err, results, fields)=>{
//       if(err)
//         return next(new Error())
//       else if(results)
//         return res.redirect('/')
//       else
//         return next(new Error())
//     })
// })

router.post('/post', upload.single("image"), (req, res, next)=>{

  if(!req.body.text)
    return next(new Error())
  else
    connection.query('INSERT INTO posts (text, name, src) values (?, ?, ?);', [req.body.text, req.body.name, (req.file && req.file.path)?`/${req.file.path}`:"",], (err, results, fields)=>{
      if(err)
        return next(new Error(err))
      else if(results)
        return res.redirect('/')
      else
        return next(new Error())
    });
})
// require構文を使って外部から読み込みたい時にこれを設定
module.exports = router
