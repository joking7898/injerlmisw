var express = require('express')
var router = express.Router()
var mysql = require('mysql');
var ejs = require('ejs');
var qs = require('querystring')
var url = require('url')
//밑 코드 데이터베이스 연결
var mysqlcon = mysql.createConnection({
    host: 'gottraction.c9jcx2tgvrrn.us-west-2.rds.amazonaws.com',
    user: 'admin',
    password: 'freehongkong',
    database: 'gottraction'
    //port: '3306'
});
var fs= require('fs')
var ejs = require('ejs')
var bodyparser = require('body-parser')
router.use(bodyparser.urlencoded({extended:false}))

mysqlcon.connect(function(err){
})

//페이지 출력 여기서 해주라는 요청.
router.get("/views/listings.ejs",function (req,res){
    var querydata = url.parse(req.url,true).query;
    
    console.log(querydata.category)
    var category = (querydata.category == undefined)?"":querydata.category;
    var location = (querydata.location == undefined)?"서울시":querydata.location;
    var querystring = "select * from attraction where location = '"+location+"'";
    if(category !="")
        querystring += "and category = '"+category+"'";

    mysqlcon.query(querystring,function(err,results) {
    if (!err){
       // console.log('The solution is: ', rows);
       // log로 체크하는구문.   
        res.render('listings.ejs', {
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
router.get("/views/CategorySelection",function (req,res){
    res.redirect("/views/index.ejs")
})
/**
 * 홈페이지에 url없이 접속시 index url로 리다이렉트
 */
router.get("/",function (req,res){
    res.redirect("/views/index.ejs")
})
/*
index.html 페이지를 띄우는 건 사실 server.js가 아니라 여기 이부분에서 처리되어야 함. 밑은 페이지 출력을 구현하려던 흔적
*/
/*
router.get("/html/index.html",function (req,res){
    res.writeHead(200);
    res.end(fs.readFileSync(__dirname + "/htmlpage/index.html"));
})
*/
module.exports = router;