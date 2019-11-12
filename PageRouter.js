var express = require('express')
var router = express.Router()
var mysql = require('mysql');
/*
밑의 데이터베이스 연결은 알아서 뚝딱뚞딲 고쳐서 쓰시오.
*/
var mysqlcon = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'freehongkong',
    database: 'gottraction'
});
var fs= require('fs')
var ejs = require('ejs')
var bodyparser = require('body-parser')
router.use(bodyparser.urlencoded({extended:false}))

mysqlcon.connect(function(err){
})

/*
 * router.get뒤에 있는 주소로 접속하면 뒤의 콜백함수가 출력됨.
 원래 페이지 출력은 여기 콜백함수안에서 이루어져야 함. 하지만 제대로 출력되지 않아 문제가 되는 중.
 */
router.get("/htmlpage/listings.html",function (req,res){
    //res.sendfile(__dirname + "/htmlpage/listings.html")
    /*
    쿼리를 떄리려면 밑처럼 때리면 됨.
    json으로 데이터베이스에서 받아온 값을 페이지에 건네줄 수 있지만, 이상망측한 문제가 있고, 다들 ejs 기능으로 값 전달하라고 함.
    */
    mysqlcon.query("select * from document",function(err,rows){
        if(err)
            console.log(err)
        res.json({documents:rows})
        //res.end()
    })
})
/**
 * 홈페이지에 url없이 접속시 index url로 리다이렉트
 */
router.get("/",function (req,res){
    res.redirect("/htmlpage/index.html")
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