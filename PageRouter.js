var express = require('express')
var router = express.Router()
var mysql = require('mysql');
var ejs = require('ejs');
var qs = require('querystring');

//밑 코드 데이터베이스 연결
var mysqlcon = mysql.createConnection({
    host: 'gottraction.c9jcx2tgvrrn.us-west-2.rds.amazonaws.com', user: 'admin', password: 'freehongkong', database: 'gottraction'
    //port: '3306'
});
var fs = require('fs')
var ejs = require('ejs')
var bodyparser = require('body-parser')
router.use(bodyparser.urlencoded({extended: false}))

mysqlcon.connect(function (err) {
    console.log("Ekrqnr", err);
})

//페이지 출력 여기서 해주라는 요청.
router.get("/views/listings.ejs", function (req, res) {
    mysqlcon.query("select * from attraction", function (err, results) {
        if (!err) {
            // console.log('The solution is: ', rows); log로 체크하는구문.
            res.render('listings.ejs', {
                result: results
                // SQL Query 실행결과인 results 를 statusList.ejs 파일에 result 이름의 리스트로 전송
            });
        } else {
            console.log('Error while performing Query.', err);
        }
    })
    //res.redirect("/views/listing.ejs")
})
/**
 * 홈페이지에 url없이 접속시 index url로 리다이렉트
 */
router.get("/", function (req, res) {
    res.redirect("/views/index.ejs")
})
/* index.html 페이지를 띄우는 건 사실 server.js가 아니라 여기 이부분에서 처리되어야 함. 밑은 페이지 출력을 구현하려던 흔적 */
/*
router.get("/html/index.html",function (req,res){
    res.writeHead(200);
    res.end(fs.readFileSync(__dirname + "/htmlpage/index.html"));
})
*/

//작성 내용 mysql에 넣기

router.post("/register", function (req, res, next) {
    console.log(req.body);
    var name_r = req.body.name_r;
    var address_r = req.body.address_r;
    var phone_r = req.body.phone_r;
    var fee_r = req.body.fee_r;
    var time_r = req.body.time_r;
    var cate_r = req.body.cate_r;
    var loca_r = req.body.loca_r;
    var content_r = req.body.content_r;
    var picture_r = req.body.picture_r;


    mysqlcon.query(
        `INSERT INTO attraction (title, address, phone, fee, opentime, category, location, contents, picture) VALUES (?,?,?,?,?,?,?,?,?)`,
        [req.body.name_r, req.body.address_r, req.body.phone_r, req.body.fee_r, req.body.time_r, 
        req.body.cate_r, req.body.loca_r, req.body.content_r, req.body.picture_r], 
        function (error, result) {
            if (error) {
                console.log("데이터베이스 입력 에러...");
                throw error;
            }
            // response.writeHead(302, {Location: `/?id=${result.insertId}`});
            // response.end();
        }
    )

    // var regist_body = '';
    // request.on('data', function (data) {
    //     regist_body = regist_body + data;
    // });
    // request.on('end', function () {
    //     var post = qs.parse(regist_body);
        
    // });


    res.redirect("/views/listings.ejs")
})

module.exports = router;