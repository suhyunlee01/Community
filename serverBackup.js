// //MySQL + NodeJS 접속 코드
// let mysql = require('mysql');

// //mysql 접속하기 위한 설정
// //아래 정보에 의해서 접속하는 것
// //createConnection 메서드는 커넥트 성공 시 true 실패 시 false가 반환된다.
// var con = mysql.createConnection({
//     host : '127.0.0.1', //localhost라고 적지 말고 아이피 주소로 기입
//     user : 'root',
//     password : '1234',
//     database : 'myboard'
// });
// con.connect();

// // query('요청 쿼리문', 콜백함수())
// con.query('select * from post', function(err, rows, fields){
//     console.log(fields);
// });



// //MONGO DB 접속 코드

// //MongoClient 객체 생성
// let mongoDBClient = require('mongodb').MongoClient;
// const { ObjectId } = require('mongodb');
// const url = 'mongodb+srv://leesuhyun05505:123412@cluster0.ex8gcx8.mongodb.net/?retryWrites=true&w=majority';
// let mydb;

// //mongodb 연결
// mongoDBClient.connect(url).then(client => {
    
//     //client 객체를 통해 mongodb내의 'myboard'라는 이름을 가진 데이터베이스에 접근함
//     mydb = client.db('myboard');

//     console.log('✨mongo db 접속 성공✨');
    
//     //DB 접속 성공 시, 웹 서버가 listen 하게 함.
//     app.listen(8080, function(){
//         console.log("✨8080 포트 서버 대기중...✨");
//     });

// }).catch(err=>{
//     console.log("몽고디비 연결오류", err);
// })


// //서버 생성
// const express = require('express');

// const app = express();

// //style 경로 지정
// app.use(express.static(__dirname));
// const bodyParser = require('body-parser');
// // URL-encoded 데이터로 파싱하기 위한 미들웨어 등록
// app.use(bodyParser.urlencoded({ extended: true }));

// app.use(express.static("public"));


// //sha256 해시 함수를 사용하기 위한 모듈
// const sha = require('sha256');



// //ejs 사용
// app.set('view engine', 'ejs'); 
// // path 모듈을 가져옴
// const path = require('path');
// const { render } = require('ejs');
// // views 폴더를 설정했을 경우
// app.set('views', path.join(__dirname, 'views'));

// // //cookie parser 미들웨어 사용하기
// // let cookieParser = require('cookie-parser');
// // app.use(cookieParser('wegwegwe120249sgsd234234234'));

// // //쿠키 연습
// // app.get('/cookie', function(req, res){
//     //     //생성된 쿠키값의 value를 정수로 만든 후, 1000씩 올림
//     //     let milk = parseInt(req.cookies.milk) + 1000;
//     //     //만약 브라우저에 쿠키가 없는 상태라서 값에 undefined가 출력된다면,
//     //     //NaN나 undefined로 출력하지 않고 0으로 value를 출력하게 함.
//     //     if(isNaN(milk)){
//         //         milk = 0;
// //     }
// //     //milk라는 key로 1000원을 저장한다는 의미 //서버에서 쿠키 생성함
// //     res.cookie('milk', milk, {maxAge:2000});
// //     //생성한 쿠키를 클라이언트로 전송하는 것
// //     res.send('product : ' + milk + " 원");
// // })


// //세션을 초기화하는 미들웨어 위치: router의 앞에 와야 함.
// //세션 연습
// // express-session 미들웨어 추가
// let session = require('express-session');
// app.use(session({
//     //암호를 위한 씨드값
//     secret : 'wegk989egweg676ewg',
//     resave : false,
//     //세션 사용 전까지 세션 식별자를 발급할지 말지 유무(보통은 발급 안함인 true값)
//     saveUninitialized : true,
    
// }));


// //라우터 생성
// //Get 방식으로 서버에 데이터 전송
// app.get('/', function(req, res){
//     // 세션 객체가 정의되어 있고, 그 안에 user 프로퍼티가 정의되어 있을 때에만 접근
//     if(req.session && req.session.user){
//         res.render('index', { data : req.session.user });
//     } else {
//         res.render('index', { data : null });
//     }
// });
// app.get('/book', function(req, res){
//     res.send("도서 목록 관련 페이지");
// })
// app.get('/list', function(req, res){
//     //post 컬렉션을 선택한거임!
//     mydb.collection('post').find().toArray().then(result=>{
//         // console.log(result);
//         //render(랭더링할 파일, {파일에 저장할 데이터})
//         //데이터 바인딩
//         res.render('list', {data : result});
//     })

// })

// app.get('/enter', function(req, res){
//     res.render('enter');
// })




// //서버로부터 DB로 데이터를 보내는 post //client에서한 post는 클라이언트에서 서버로 데이터를 보내는 post임
// app.post('/save', function(req, res){
//     // console.log(req.body.title);
//     // console.log(req.body.content);
//     // console.log(req.body.someDate);

//     // req 매개변수에 있는 클라이언트로부터 받아온 데이터 사용
//     // console.log(req.body);

//     //MYSQL 저장
//     // // 현재 시간을 JavaScript에서 생성
//     // let currentTime = new Date();
    
//     // // 쿼리문
//     // let sql = "INSERT INTO post (title, content, created) values(?, ?, ?)";
    
//     // //클라이언트로 받은 데이터 = req 를 params로 전달
//     // let params = [req.body.title, req.body.content, currentTime];
    
//     // // query('요청 쿼리문', '쿼리문에 전달할parmas', 콜백함수())
//     // //쿼리문의 ?, ?, ?에 params로 전달
//     // con.query(sql, params, function(err, result){
//     //     if(err) throw err;
//     //     console.log("✨데이터가 추가 성공✨");
//     // })


//     //MONGO DB의 post 컬렉션에 클라이언트에서 받아온 데이터(req에 있는 데이터)저장
//     mydb.collection('post').insertOne(
//         {
//             title:req.body.title,
//             content: req.body.content,
//             date: req.body.someDate
//         }
//     ).then(result => {
//             console.log(result);
//             console.log('✨데이터 추가 성공✨');
//     })

//     res.render('save');
// });


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



// //클라이언트에서 요청한 url의 동적인 id값
// //클라이언트가 URL의 /:id 값으로 652de238f2af8d0fe49e1e4a를 넣어서
// //요청하게된다면 이제 URL의 파라미터는 내가 기입한 이 문자열이 되는 것
// app.get('/content/:id', function(req,res){
//     console.log(req.params.id);

//     //URL의 파라미터 = id
//     //클라이언트에서 요청할 때 쓴 id 파라미터와 같은 값인 {_id}를 몽고DB에서 찾기 위해
//     //req.params.id를 오브젝트 형으로 바꿈
//     req.params.id = new ObjectId(req.params.id);

//     mydb.collection('post')
//     .findOne({_id : req.params.id})
//     .then(result => { // 'post' 컬렉션에서 _id 값이 요청한 URL의 id 파라미터와 일치하는 문서를 찾아서 반환
//         console.log(result);
//         //랜더링 시 해당 id의 데이터 사용하기
//         res.render('content', {data : result});
//     })
// })


// //이건 get방식의 /edit 요청
// app.get('/edit/:id', function(req, res){

//     req.params.id = new ObjectId(req.params.id);

//     mydb.collection('post').findOne({_id : req.params.id}).then(result => {
//         res.render('edit', {data : result});
//     })
// })


// //이건 post방식의 /edit 요청
// app.post('/edit', function(req, res){

//     console.log(req.body.id);
//     req.body.id = new ObjectId(req.body.id);

//     console.log(req.body.content);
//     //몽고DB에 데이터 저장하기
//     mydb.collection('post').updateOne({_id : req.body.id}, 
//         {$set : {title : req.body.title, content : req.body.content, date : req.body.someDate}}
//         ).then(result => {
//             console.log(result);
//             console.log('수정완료');
//             //수정하던 상세페이지로 되돌아가게 함.
//             res.redirect('/content/'+ req.body.id);
//         })
//         .catch(err =>{
//             console.log(err);
//         })

// })

// app.get('clear', function(req, res){
//     res.clearCookie('milk');
//     res.send('쿠키 제거 완료');
// })


// // app.get('/session', function(req,res){
// //     if(isNaN(req.session.milk)){
// //         req.session.milk = 0;
// //     }
// //     req.session.milk += 1000;
// //     res.send("session: " + req.session.milk + "원");
// // })



// //클라이언트에서 받아온 정보 처리
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


// //서버로부터 페이지 받아오기
// app.get('/login', function(req, res){
//     console.log(req.session);
//     //만약 세션에 user 정보가 있다면 세션유지
//     if(req.session.user){
//         console.log("세션 유지", req.session.user);
//         res.render('index', {data : req.session.user})
//     }else{
//         //없으면 그냥 로그인 페이지 랜더
//         res.render('login.ejs');
//     }
// })

// app.get('/myPage', function(req, res){
//     console.log(req.session);
//     //만약 세션에 user 정보가 있다면 세션유지
//     if(req.session.user){
//         res.render('myPage', { data : req.session.user})
//     }else{
//         //없으면 그냥 로그인 페이지 랜더
//         res.send('로그인이 필요합니다.' + ' <a href="/login"><button class="btn btn-outline-success" type="submit">로그인</button></a>');
//     }
// })

// app.get('/logout', function(req, res){
//     console.log('로그아웃');
//     req.session.destroy();
//     res.redirect('/');
// })

// app.post('/signup', function(req, res){
//     console.log("유저이메일", req.body.useremail);
//     console.log("유저그룹",req.body.usergroup);
//     mydb.collection('account').insertOne(
//         {
//             userid: req.body.userid,
//             userpw: req.body.userpw,
//             useremail: req.body.useremail,
//             usergroup: req.body.usergroup
//         }
//     ).then(result => {
//             console.log(result);
//             res.send('가입완료' + ' <a href="/login"><button class="btn btn-outline-success" type="submit">로그인</button></a>');
//     })

// })

// app.get('/signup', function(req, res){
//     res.render('signup');
// })