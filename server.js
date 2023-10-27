//MySQL + NodeJS 접속 코드
let mysql = require('mysql');

//mysql 접속하기 위한 설정
//아래 정보에 의해서 접속하는 것
//createConnection 메서드는 커넥트 성공 시 true 실패 시 false가 반환된다.
var con = mysql.createConnection({
    host : '127.0.0.1', //localhost라고 적지 말고 아이피 주소로 기입
    user : 'root',
    password : '1234',
    database : 'myboard'
});
con.connect();

// query('요청 쿼리문', 콜백함수())
con.query('select * from post', function(err, rows, fields){
    console.log(fields);
});
const dotenv = require('dotenv').config();







//MONGO DB 접속 코드

//MongoClient 객체 생성
let mongoDBClient = require('mongodb').MongoClient;
const { ObjectId } = require('mongodb');
const url = process.env.DB_URL;
//몽고DB 객체
let mydb;

//mongodb 연결
mongoDBClient.connect(url).then(client => {
    
    //client 객체를 통해 mongodb내의 'myboard'라는 이름을 가진 데이터베이스에 접근함
    mydb = client.db('myboard');

    console.log('✨mongo db 접속 성공✨');
    
    //DB 접속 성공 시, 웹 서버가 listen 하게 함.
    http.listen(process.env.PORT, function(){
        console.log("✨8080 포트 서버 대기중...✨");
    });

}).catch(err=>{
})







//서버 생성
const express = require('express');
const app = express();

//multer로 받은 이미지 경로
let imagepath = '';

//웹소켓
const http = require('http').createServer(app);
const {Server} = require('socket.io');
var io = new Server(http);

//style 경로 지정
app.use(express.static(__dirname));

//public 경로 지정
// app.use(express.static("public"));
app.use("/public", express.static("public"));

const bodyParser = require('body-parser');
// URL-encoded 데이터로 파싱하기 위한 미들웨어 등록
app.use(bodyParser.urlencoded({ extended: true }));


//세션을 초기화하는 미들웨어 위치: router의 앞에 와야 함.
//세션 연습
// express-session 미들웨어 추가
let session = require('express-session');
app.use(session({
    //암호를 위한 씨드값
    secret : 'wegk989egweg676ewg',
    resave : false, //세션 데이터가 변경되지 않아도 저장 ? false
    saveUninitialized : true, //초기화되지 않은 세션 저장.
    
}));






//경로 설정 //require 내의 경로가 

//passport.js
const passport = require('passport');
app.use(passport.initialize()); // 이 미들웨어는 Passport 초기화를 처리함
app.use(passport.session());// 세션관리를 위한 passport 미들웨어임

//server_local.js에는 패스포트 로컬만
const LocalStrategy = require('passport-local').Strategy;

//sha256 해시 함수를 사용하기 위한 모듈
const sha = require('sha256');

//ejs 사용
const { render } = require('ejs');
app.set('view engine', 'ejs'); 
// views 폴더를 설정했을 경우


// path 모듈을 가져옴
const path = require('path');
app.set('views', path.join(__dirname, 'views'));


// app.use('/', require());
app.use('/', require('./Routes/post.js'));
app.use('/', require('./Routes/user.js'));
app.use('/', require('./Routes/addPost.js'));



//라우터 생성
//Get 방식으로 서버에 데이터 전송
app.get('/', function(req, res){
    if(req.isAuthenticated()){
        // Passport.js를 통해 인증된 경우, req.user로 사용자 정보에 접근 가능
        res.render('index', { data : req.user });
    } else {
        res.render('index', { data : null });
    }
});

app.get('/socket', function(req, res){
    res.render('socket.ejs');
})

io.on('connection', function(socket){
    console.log('유저 접속');
    //emit으로 보낸 메시지 받아오기
    socket.on('user-send', function(data){
        console.log(data);
    })
});

// // delete할 데이터 id를 클라이언트로부터 받아서
// //DB로 삭제 요청
// app.post('/delete', (req, res) => {
//     console.log(req.body._id);

//     //오브젝트 형으로 저장하는 몽고 DB에 맞추기 위해서 오브젝트 형태로 바꿈
//     req.body._id = new ObjectId(req.body._id);
//     mydb.collection('post').deleteOne(req.body).then(result =>{
//         console.log('삭제완료');
//          //성공 시 status 200을 클라이언트로 보냄
//         res.status(200).send();
//     }).catch(err=>{
//         console.log("딜리트포스트 에러", err);
//         res.status(500).send;
//     })
// });


// app.get('/session', function(req,res){
//     if(isNaN(req.session.milk)){
//         req.session.milk = 0;
//     }
//     req.session.milk += 1000;
//     res.send("session: " + req.session.milk + "원");
// })



//클라이언트에서 받아온 정보 처리
// app.post('/login', function(req, res){
//     console.log(req.body.userid);
//     console.log(req.body.userpw);

//     mydb.collection('account')
//     .findOne({
//         userid: req.body.userid,
//     }).then(result => {
//         if (result && result.userpw === sha(req.body.userpw)) {
//             // 세션에 추가
//             req.session.user = req.body;
//             console.log('로그인', result.userid);
//             res.render('index', { data: result });
//         } else {
//             res.send('로그인 정보가 잘못되었습니다');
//         }
//     }).catch(() => {
//         res.send('데이터 받아오기 실패.');
//     });
// })

