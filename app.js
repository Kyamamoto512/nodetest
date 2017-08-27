"use strict"

require('dotenv').config();
// httpを利用するためのモジュール
const http = require('http')
const io = require('socket.io')(http);
const PORT = process.env.PORT || 3000;
const express = require('express')
const logger = require('morgan')
const app = express()
const mysql = require('mysql')
const bodyParser = require('body-parser')

const connection = mysql.createConnection({
  host: 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
})

connection.connect(function(err) {
  if (err) {
    return console.error('error connecting: ' + err.stack)
  }else{
    console.log('connected as id ' + connection.threadId)
  }                                                                                                                                                       
})
// グローバル変数として設定
global.connection = connection

// ルーティングファイルを読み込む
const index = require('./routes/index')


// jsonをサポート
app.use(bodyParser.json())
// x-www-form-urlencodedをサポート
app.use(bodyParser.urlencoded({ extended: false }))
// ログを取得
//app.use(logger())
// テンプレートファイルを配置したディレクトリを指定
app.set('views', `${__dirname}/views`)
// テンプレートファイルの形式としてejsを指定
app.set('view engine', 'ejs')

// デフォルトのルーティングとしてindexを指定
app.use('/', index)
app.use("/static", express.static(`${__dirname}/static`))

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
  });
});

app.use((req, res, next)=>{
  res.status('404')
  return res.render('error',{message: "404 Not Found"})
});


// サーバーを定義、Expressを利用する
const server = http.createServer(app)
// ３０００番ポートでリクエストを待ち受ける
server.listen(PORT)
console.log(`listening on *:${PORT}`);