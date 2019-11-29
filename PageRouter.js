var express = require('express')
var router = express.Router()
var mysql = require('mysql');
var ejs = require('ejs');
var qs = require('querystring')
var url = require('url')

//밑 코드 데이터베이스 연결
var mysqlcon = mysql.createConnection({
    host: 'yunudb.c9jcx2tgvrrn.us-west-2.rds.amazonaws.com', user: 'admin', password: 'freehongkong', database: 'gottraction',multipleStatements:true,
    user: 'admin',
    password: 'freehongkong',
    database: 'gottraction'
    
    //port: '3306'
});
var fs = require('fs')
var ejs = require('ejs')
var bodyparser = require('body-parser')
router.use(bodyparser.urlencoded({extended: false}))

mysqlcon.connect(function (err) {
})

//index.ejs 관련 sql
router.get("/views/index.ejs",function (req,res){
    var querydata = url.parse(req.url,true).query;
    
    console.log(querydata.category)
    var querystring = "SELECT category,count(*)AS count FROM gottraction.attraction group by category";
    mysqlcon.query(querystring,function(err,results) {
    if (!err){
       // console.log('The solution is: ', rows);
       // log로 체크하는구문.   
        res.render('index.ejs', {
        result: results    
        // SQL Query 실행결과인 results 를 statusList.ejs 파일에 result 이름의 리스트로 전송
      });
    }
    else{
        console.log('Error while performing Query.', err);
    }
    })
    //res.redirect("/views/listing.ejs")
})


//페이지 출력 여기서 해주라는 요청.
router.get("/views/listings.ejs",function (req,res){
    var querydata = url.parse(req.url,true).query;
    
    var category = (querydata.category == undefined)?"전체":querydata.category;
    var location = (querydata.location == undefined)?"전체":querydata.location;
    var querystring = "select * from attraction";
    var authorizationCondition ="";

    if(category =="전체" && location == "전체"){
        querystring;
    }
    else if(category !="전체" || location != "전체"){
        if(category =="전체"){
            querystring += " where location = '"+location+"'";
        }
        else if(location =="전체"){
            querystring += " where category = '"+category+"'";
        }
    }
    if(category !="전체"&&  location != "전체")
        querystring += " where location = '"+location+"' and category = '"+category+"'";
    
    mysqlcon.query("select authority from user where id = ?",['yunu'],function(err,result){
        if(result[0].authority=='user')
        {
            if(category == "전체"&& location == "전체")
                authorizationCondition = " where authorized = 1"
            else
                authorizationCondition = " and authorized = 1"
                
        }
        mysqlcon.query(querystring +authorizationCondition,function(err,results) {
            if (!err){
               // console.log('The solution is: ', rows);
               // log로 체크하는구문.   
                res.render('listings.ejs', {
                result: results,
                _url:req.url
                // SQL Query 실행결과인 results 를 statusList.ejs 파일에 result 이름의 리스트로 전송
              });
            }
            else{
                console.log('Error while performing Query.', err);
            }
            })    
    })
    
    //res.redirect("/views/listing.ejs")
})

router.get("/views/single-listing.ejs",function (req,res){
    var querydata = url.parse(req.url,true).query;
    
    var AttractionId = querydata.id;
    if(AttractionId == undefined){
        res.redirect('/views/index.ejs?#')
    }
    else
    {
    mysqlcon.query("select * from attraction where id = ?; select * from review where AttractionId = ?; select authority from user where id = ?",[AttractionId,AttractionId,"yunu"],function(err,results) {
    if (!err){
        results[0][0].contents= (results[0][0].contents.replace(new RegExp('\n','g'), '<br>'))
        res.render('single-listing.ejs', {
        result: results[0],
        reviews: results[1],
        Aid:AttractionId,
        authority:results[2][0].authority
        // SQL Query 실행결과인 results 를 statusList.ejs 파일에 result 이름의 리스트로 전송
      });
    }
    else{
        console.log('Error while performing Query.', err);
    }
    })
}
}
    //res.redirect("/views/listing.ejs")
)

// 홈페이지에 url없이 접속시 index url로 리다이렉트
router.get("/",function (req,res){
    res.redirect("/views/index.ejs?#") // 이 주소로 해야지 정상 작동되는거 구현완료.
})

//index.html 페이지를 띄우는 건 사실 server.js가 아니라 여기 이부분에서 처리되어야 함. 밑은 페이지 출력을 구현하려던 흔적
/*
router.get("/html/index.html",function (req,res){
    res.writeHead(200);
    res.end(fs.readFileSync(__dirname + "/htmlpage/index.html"));
})
*/

//작성 내용 mysql에 넣기

router.post("/views/register.ejs", function (req, res, next) {
    // console.log(req.body);
    var name_r = req.body.name_r;
    var address_r = req.body.address_r;
    var phone_r = req.body.phone_r;
    var fee_r = req.body.fee_r;
    var time_r = req.body.time_r;
    var cate_r = req.body.cate_r;
    var loca_r = req.body.loca_r;
    var content_r = req.body.content_r;
    var picture_r = req.body.picture_r;
    if(name_r=="")
        res.redirect(req.url)
    mysqlcon.query(
        `INSERT INTO attraction (title, address, phone, fee, opentime, category, location, contents, picture,user_id) VALUES (?,?,?,?,?,?,?,?,?,?)`,
        [req.body.name_r, req.body.address_r, req.body.phone_r, req.body.fee_r, req.body.time_r, 
        req.body.cate_r, req.body.loca_r, req.body.content_r, req.body.picture_r,'yunu'], 
        function (error, result) {
            if (error) {
                console.log("데이터베이스 입력 에러...");
                throw error;
            }
            // response.writeHead(302, {Location: `/?id=${result.insertId}`});
            // response.end();
        }
    )
    res.redirect("/views/listings.ejs")
})
router.post("/views/single-listing.ejs", function (req, res, next) {
    var description = req.body.description;
    var stars = req.body.stars;

    if(description=="")
        res.redirect(req.url)
    else
    {
        mysqlcon.query( "insert into review (AttractionId,userid,description,Wtime,stars) values (?,?,?,"+"sysdate()"+",?)",[req.query.id,'yunu',description,stars],function(err,result){
         
            console.log("insert into review (AttractionId,userid,description,Wtime,stars) values (?,?,?,"+"sysdate()"+",?)",[req.query.id,'yunu',description,stars])
            if(err)
            console.log("Query Error : "+ err)
        })
        mysqlcon.query("update attraction set score = (select round(avg(stars),2) from review where Attractionid = ?) where id = ?",[req.query.id,req.query.id],function(err,result){
            if(err)
            console.log("Query Error : "+ err)
        })
        res.redirect(req.url)
    }
})

router.post("/views/deleteReview",function(req,res){
    if(req.query.Rid == undefined){
        res.redirect("index.ejs")
    }else
    {
    mysqlcon.query("select userid,AttrctionId from review where id = ?;select authority from user where id = ?",[req.query.Rid,'yunu'],
    function(err,result){
        if(err)
            console.log(err);
        if(result[0][0].userid=='yunu' || result[1][0].authority =='admin' ){
        //세션 구현되면 위에 yunu 부분들 세션에 있는 id 불러오는걸로 바꿔라.    
            mysqlcon.query("delete from review where id = ?",[req.query.Rid],function(err,result){
                mysqlcon.query("update attraction set score = (select round(avg(stars),2) from review where Attractionid = ?) where id = ?",[result[0][0].AttractionId, result[0][0].AttractionId],function(err,result){
                    if(err)
                    console.log("Query Error : "+ err)
                });
                res.redirect("/views/single-listing.ejs?id="+req.query.Aid);
            })}
        else res.redirect("/views/single-listing.ejs?id="+req.query.Aid);
            
    })
    }
})
router.post("/views/deleteAttraction",function(req,res){
    if(req.query.Aid == undefined){
        res.redirect("index.ejs")
    }
    else
    {
    mysqlcon.query("select user_id from attraction where id = ?;select authority from user where id = ?",[req.query.Aid,'yunu'],
    //글 게시자랑 글 지우려는 색기 권한을 불러오는거임.//세션 구현되면 위에 yunu 부분들 세션에 있는 id 불러오는걸로 바꿔라.
    function(err,result){
        if(err)
            console.log(err);
        if(result[0][0].user_id=='yunu' || result[1][0].authority =='admin' ){
        //세션 구현되면 위에 yunu 부분들 세션에 있는 id 불러오는걸로 바꿔라.    
            mysqlcon.query("delete from review where attractionid = ?;delete from attraction where id = ?",[req.query.Aid,req.query.Aid],function(err,result){
                res.redirect("/views/listings.ejs");
            })}
        else res.redirect("/views/single-listing.ejs?id="+req.query.Aid);
            
    })
}
})
router.post("/views/authorize",function(req,res){
    if(req.query.Aid == undefined){
        res.redirect("index.ejs")
    }
    mysqlcon.query("select authority from user where id = ?",["yunu"],function(err,result){
        //세션 구현되면 위에 yunu 부분들 세션에 있는 id 불러오는걸로 바꿔라.
        if(result[0].authority ="admin")
            mysqlcon.query("update attraction set authorized = !authorized where id = ?",[req.query.Aid],function(err,result){
                if(err)
                    console.log("DB error" + err)
                    res.redirect("/views/single-listing.ejs?id="+req.query.Aid)
            })
    })
})
module.exports = router;