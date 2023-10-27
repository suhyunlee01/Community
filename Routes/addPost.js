//라우터 객체 새로 생성함
let router = require('express').Router();

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



router.get('/enter', function(req, res){
    res.render('enter');
})



//서버로부터 DB로 데이터를 보내는 post //client에서한 post는 클라이언트에서 서버로 데이터를 보내는 post임
router.post('/save', function(req, res){

    //MONGO DB의 post 컬렉션에 클라이언트에서 받아온 데이터(req에 있는 데이터)저장
    mydb.collection('post').insertOne(
        {
            title:req.body.title,
            content: req.body.content,
            date: req.body.someDate,
            path: imagepath
        }
    ).then(result => {
            console.log(result);
            console.log('✨데이터 추가 성공✨');
    })

    res.render('save');
});




// delete할 데이터 id를 클라이언트로부터 받아서
//DB로 삭제 요청
router.post('/delete', (req, res) => {
    console.log(req.body._id);

    //오브젝트 형으로 저장하는 몽고 DB에 맞추기 위해서 오브젝트 형태로 바꿈
    req.body._id = new ObjectId(req.body._id);
    mydb.collection('post').deleteOne(req.body).then(result =>{
        console.log('삭제완료');
         //성공 시 status 200을 클라이언트로 보냄
        res.status(200).send();
    }).catch(err=>{
        console.log("딜리트포스트 에러", err);
        res.status(500).send;
    })
});



//multer
let multer = require('multer');

let storage = multer.diskStorage({ //memoryStorage()
    destination : function(req, file, done){
        done(null, './public/image')
    },
    filename : function(req, file, done){
        done(null, file.originalname)
    }
})

let upload = multer({storage : storage});


router.post('/photo', upload.single('picture'), function(req, res){
    console.log('서버에 파일 첨부하기');
    console.log(req.file.path);
    imagepath = '/' + req.file.path;
})

module.exports = router;