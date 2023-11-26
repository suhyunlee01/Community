//라우터 객체 새로 생성함
let router = require('express').Router();




//passport.js
const passport = require('passport');
router.use(passport.initialize()); // 이 미들웨어는 Passport 초기화를 처리함
router.use(passport.session());// 세션관리를 위한 passport 미들웨어임

//server_local.js에는 패스포트 로컬만
const LocalStrategy = require('passport-local').Strategy;

//sha256 해시 함수를 사용하기 위한 모듈
const sha = require('sha256');

//'/login'경로로 post 요청이 올 시 passport 미들웨어 사용해서 로컬 인증 시도
router.post('/login', passport.authenticate("local", {
    successRedirect : "/",
    //인증을 패스포트로 하고 실패하면 다시 login 페이지로 이동
    failureRedirect : "/login"
}),
function(req, res){ //passport 인증 후에 post 메서드의 콜백함수 실행 //셔션
    //현재 요청과 관련된 세션 객체
    console.log(req.session);
    console.log(req.session.passport); 
})




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
    router.listen(process.env.PORT, function(){
        console.log("✨8080 포트 서버 대기중...✨");
    });

}).catch(err=>{
})

//Passport에게 로컬 전략 설정
passport.use(new LocalStrategy(
    {
        //사용자가 제출한 아이디와 비밀번호 필드 지정함
        usernameField : "userid",
        passwordField : "userpw",
        session : true, // Passport가 세션을 사용하여 사용자 인증 상태를 유지하도록 허용
        passReqToCallback : false // LocalStrategy의 콜백 함수에 요청(request) 객체를 전달할지 여부
    },
    function(inputid, inputpw, done){ //LocalStrategy의 콜백 //실제 인증 수행
        mydb.collection('account')
        .findOne({userid : inputid})
        .then(result => {
            //만약 DB에 저장된 암호화된 비번과 사용자가 작성해서 submit한 암호화된 비번이 같을 경우
            if(result.userpw == sha(inputpw)){
                console.log("로그인 성공. 새로운 로그인");
                done(null, result);
            }else{
                console.log("비밀번호가 일치하지 않습니다.")
                done(null, false, {message : "비밀번호가 일치하지 않습니다."})
            }
        })
    }
))

//serializeUser 함수는  Passport에게 어떻게 사용자 객체를 세션에 저장할지 알려줌
//user는 Passport 인증 전략(local, social 등)을 통해 인증된 사용자 객체이다.
passport.serializeUser(function(user, done){
    console.log('시리얼라이즈 유저', 'serializerUser');
    console.log('패스포트에서 전달된 사용자객체의 아이디', user.userid);

    //세션에 id 저장
    done(null, user.userid);
})

//한 번 로그인 된 이후, 세션유지용 //갖고있는 값으로 id 계속 검사함
passport.deserializeUser(function(puserid, done){
    console.log('deserializerUser');
    console.log(puserid);

    mydb.collection('account')
    .findOne({userid : puserid})
    .then(result => {
        done(null, result);
    })
})

//서버로부터 페이지 받아오기
router.get('/login', function(req, res){
    console.log(req.session);
    //만약 세션에 user 정보가 있다면 세션유지
    if(req.session.user){
        console.log("세션 유지", req.session.user);
        res.render('index', {data : req.session.user})
    }else{
        //없으면 그냥 로그인 페이지 랜더
        res.render('login.ejs');
    }
})

router.get('/myPage', function(req, res){
    console.log(req.session);
    //만약 세션에 user 정보가 있다면 세션유지
    if(req.isAuthenticated()){
        res.render('myPage', { data : req.user})
    }else{
        //없으면 그냥 로그인 페이지 랜더
        res.send('로그인이 필요합니다.' + ' <a href="/login"><button class="btn btn-outline-success" type="submit">로그인</button></a>');
    }
})

router.get('/logout', function(req, res){
    console.log('로그아웃');
    req.session.destroy();
    res.redirect('/');
})

router.get('/signup', function(req, res){
    res.render('signup')
})

router.post('/signup', function(req, res){
    console.log("유저이메일", req.body.useremail);
    console.log("유저그룹",req.body.usergroup);
    mydb.collection('account').insertOne(
        {
            userid: req.body.userid,
            //회원가입 시 암호화해서 비번 DB에 저장
            userpw: sha(req.body.userpw),
            useremail: req.body.useremail,
            usergroup: req.body.usergroup
        }
    ).then(result => {
            console.log(result);
            res.send('가입완료' + ' <a href="/login"><button class="btn btn-outline-success" type="submit">로그인</button></a>');
    })
})

module.exports = router;