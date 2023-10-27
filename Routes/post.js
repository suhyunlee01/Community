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
    console.log("몽고디비 연결오류", err);
})


router.get('/list', function(req, res){
    //post 컬렉션을 선택한거임!
    mydb.collection('post').find().toArray().then(result=>{
        // console.log(result);
        //render(랭더링할 파일, {파일에 저장할 데이터})
        //데이터 바인딩
        res.render('list', {data : result});
    })

})



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


//이건 get방식의 /edit 요청
router.get('/edit/:id', function(req, res){

    req.params.id = new ObjectId(req.params.id);

    mydb.collection('post').findOne({_id : req.params.id}).then(result => {
        res.render('edit', {data : result});
    })
})


//이건 post방식의 /edit 요청
router.post('/edit', function(req, res){

    console.log(req.body.id);
    req.body.id = new ObjectId(req.body.id);

    console.log(req.body.content);
    //몽고DB에 데이터 저장하기
    mydb.collection('post').updateOne({_id : req.body.id}, 
        {$set : {title : req.body.title, content : req.body.content, date : req.body.someDate}}
        ).then(result => {
            console.log(result);
            console.log('수정완료');
            //수정하던 상세페이지로 되돌아가게 함.
            res.redirect('/content/'+ req.body.id);
        })
        .catch(err =>{
        })

})


//클라이언트에서 요청한 url의 동적인 id값
//클라이언트가 URL의 /:id 값으로 652de238f2af8d0fe49e1e4a를 넣어서
//요청하게된다면 이제 URL의 파라미터는 내가 기입한 이 문자열이 되는 것
router.get('/content/:id', function(req,res){
    console.log(req.params.id);

    //URL의 파라미터 = id
    //클라이언트에서 요청할 때 쓴 id 파라미터와 같은 값인 {_id}를 몽고DB에서 찾기 위해
    //req.params.id를 오브젝트 형으로 바꿈
    req.params.id = new ObjectId(req.params.id);

    mydb.collection('post')
    .findOne({_id : req.params.id})
    .then(result => { // 'post' 컬렉션에서 _id 값이 요청한 URL의 id 파라미터와 일치하는 문서를 찾아서 반환
        console.log(result);
        //랜더링 시 해당 id의 데이터 사용기
        res.render('content', {data : result});
    })
})

//클라이언트에서 요청한 url의 동적인 id값
//클라이언트가 URL의 /:id 값으로 652de238f2af8d0fe49e1e4a를 넣어서
//요청하게된다면 이제 URL의 파라미터는 내가 기입한 이 문자열이 되는 것
router.get('/content/:id', function(req,res){
    console.log(req.params.id);

    //URL의 파라미터 = id
    //클라이언트에서 요청할 때 쓴 id 파라미터와 같은 값인 {_id}를 몽고DB에서 찾기 위해
    //req.params.id를 오브젝트 형으로 바꿈
    req.params.id = new ObjectId(req.params.id);

    mydb.collection('post')
    .findOne({_id : req.params.id})
    .then(result => { // 'post' 컬렉션에서 _id 값이 요청한 URL의 id 파라미터와 일치하는 문서를 찾아서 반환
        console.log(result);
        //랜더링 시 해당 id의 데이터 사용하기
        res.render('content', {data : result});
    })
})


router.get('/search', function(req, res){
    console.log(req.query);
    mydb.collection('post')
    .find({title : req.query.value}).toArray()
    .then((result)=>{
        console.log(result);
        res.render('sresult.ejs', {data : result});
    })
})


module.exports = router;