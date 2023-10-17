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



//MONGO DB 접속 코드

//MongoClient 객체 생성
let mongoDBClient = require('mongodb').MongoClient;
const url = 'mongodb+srv://leesuhyun05505:123412@cluster0.ex8gcx8.mongodb.net/?retryWrites=true&w=majority';

let mydb;

//mongodb 연결
mongoDBClient.connect(url).then(client => {
    
    //client 객체를 통해 mongodb내의 'myboard'라는 이름을 가진 데이터베이스에 접근함
    mydb = client.db('myboard');

    console.log('✨mongo db 접속 성공✨');
    
    //DB 접속 성공 시, 웹 서버가 listen 하게 함.
    app.listen(8080, function(){
        console.log("✨8080 포트 서버 대기중...✨");
    });

}).catch(err=>{
    console.log(err);
})




//서버 생성
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
//style 경로 지정
app.use(express.static(__dirname));

const bodyParser = require('body-parser');
// URL-encoded 데이터로 파싱하기 위한 미들웨어 등록
app.use(bodyParser.urlencoded({ extended: true }));


//ejs 사용
app.set('view engine', 'ejs'); 
// path 모듈을 가져옴
const path = require('path');
// views 폴더를 설정했을 경우
app.set('views', path.join(__dirname, 'views'));



//라우터 생성
//Get 방식으로 서버에 데이터 전송
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
})
app.get('/book', function(req, res){
    res.send("도서 목록 관련 페이지");
})
app.get('/list', function(req, res){
    mydb.collection('post').find().toArray().then(result=>{
        console.log(result);
        //render(랭더링할 파일, {파일에 저장할 데이터})
        //
        res.render('list', {data : result});
    })

})

app.get('/enter', function(req, res){
    res.render('enter');
})

//서버로부터 DB로 데이터를 보내는 post //client에서한 post는 클라이언트에서 서버로 데이터를 보내는 post임
app.post('/save', function(req, res){
    console.log(req.body.title);
    console.log(req.body.content);
    console.log(req.body.someDate);

    // req 매개변수에 있는 클라이언트로부터 받아온 데이터 사용
    // console.log(req.body);

    //MYSQL 저장
    // // 현재 시간을 JavaScript에서 생성
    // let currentTime = new Date();
    
    // // 쿼리문
    // let sql = "INSERT INTO post (title, content, created) values(?, ?, ?)";
    
    // //클라이언트로 받은 데이터 = req 를 params로 전달
    // let params = [req.body.title, req.body.content, currentTime];
    
    // // query('요청 쿼리문', '쿼리문에 전달할parmas', 콜백함수())
    // //쿼리문의 ?, ?, ?에 params로 전달
    // con.query(sql, params, function(err, result){
    //     if(err) throw err;
    //     console.log("✨데이터가 추가 성공✨");
    // })


    //MONGO DB에 클라이언트에서 받아온 데이터(req에 있는 데이터)저장
    mydb.collection('post').insertOne(
            {
                title:req.body.title,
                content: req.body.content,
                date: req.body.someDate
            }
    ).then(result => {
            console.log(result);
            console.log('✨데이터 추가 성공✨');
    })

    //클라이언트에서 데이터 바인딩
    res.render('save');
});


// delete할 데이터 id를 클라이언트로부터 받아서
//DB로 삭제 요청
app.post('/delete', (req, res) => {
    console.log(req.body._id);

    req.body._id = new ObjectId(req.body._id);
    mydb.collection('post').deleteOne(req.body).then(result =>{
        console.log('삭제완료');
         //성공 시 status 200을 클라이언트로 보냄
        res.status(200).send();
    }).catch(err=>{
        console.log(err)
        res.status(500).send;
    })
});