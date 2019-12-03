var express = require('express')
var router = express.Router()
var mysql = require('mysql');
var ejs = require('ejs');
var qs = require('querystring')
var url = require('url')
// 태윤 추가부분.
var passport = require('passport');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var LocalStrategy = require('passport-local').Strategy;
var bodyParser = require('body-parser');
var multer = require('multer')
var path = require('path')
//var storage = multer.memoryStorage();
var storage = multer.diskStorage({
    destination: function (req, file, cb) { cb(null, path.join(__dirname, 'views/img/uploaded')) },
    filename: function (req, file, cb) { cb(null, file.originalname) }
});
var upload = multer({ storage: storage });//{storage:storage})

//밑 코드 데이터베이스 연결
var dbConfig = require('./dbConfig');
// var dbOptions = dbConfig;
var mysqlcon = mysql.createConnection({
    host: 'yunudb.c9jcx2tgvrrn.us-west-2.rds.amazonaws.com',
    user: 'admin',
    password: 'freehongkong',
    database: 'gottraction',
    multipleStatements: true
    //port: '3306'
});

var app = express();
var fs = require('fs')
var ejs = require('ejs')
var bodyparser = require('body-parser')
router.use(bodyparser.urlencoded({ extended: false }))

router.use(session({
    secret: 'Yunu',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 1000 * 60 * 60 }// 유효기간 1시간  
}));


session.user = {
    id: 'dummy',
    password: ''
}
router.use(passport.initialize());
router.use(passport.session());

mysqlcon.connect(function (err) {
})

//처음 실행했을때
// router.get('/views/Register/Login.ejs', function (req, res) {
//     // 로그인 확인된 유저가 안보이면 login함수로 로그인 유저 보이면 welcome으로
//     if (!req.user)
//         res.redirect('/login');
//     else
//         res.redirect('/welcome');
// });
// //만약 login함수들어왔는데 로그인 확인 보여지면 welcome으로 안보이면 로그인 login.ejs 페이지 뿌림
// router.get('/login', function (req, res) {
//     if (!req.user) {
//         console.log("req.user 안가져와짐.")
//         // login.ejs massage 변수 전달.
//         res.render('Register/Login.ejs');
//     }
//     else
//         res.redirect('/welcome');
// });
// router.get('/welcome', function (req, res) {
//     if (!req.user) {
//         console.log("안가져와짐.")
//         return res.redirect('/login');
//     }
//     //아이디 로그인 됬을때.
//     else {
//         console.log("id가져옴.");
//         // res.render('/views/index.ejs', {name:req.user.id});
//         res.render('index.ejs');
//     }
// });
// //로그아웃 함수.
// router.get('/logout', function (req, res) {
//     req.logout();
//     res.redirect('/');
// });
router.get('/views/Register/Login.ejs', function (req, res) {
    var tryagain = req.query.tryagain
    var succses = req.query.succses

    res.render('Register/Login.ejs',
        {tryagain:tryagain!=undefined,
            succses:succses!=undefined,}
    );
})

router.post('/views/Register/Login.ejs', function (req, res) {
    var id = req.body.id;
    var password = req.body.your_pass;
    mysqlcon.query("select * from user where id = ? and password = ?", [id, password], function (err, results) {
        if (!err && results[0] != undefined) {
            session.user = {
                "id": results[0].id,
                "password": results[0].password
            }
            res.redirect("/views/index.ejs?#");


            //            res.render('index.ejs', {
            //            result: results    
            //            SQL Query 실행결과인 results 를 statusList.ejs 파일에 result 이름의 리스트로 전송
            //            });
        }
        else {
            res.redirect("/views/Register/Login.ejs?tryagain=true");
            console.log('Error while performing Query in login.', err);
        }
    })
});

//index.ejs 관련 sql
router.get("/views/index.ejs", function (req, res) {
    var querydata = url.parse(req.url, true).query;
    var change = req.query.change

    console.log(querydata.category)
    var querystring = "SELECT category,count(*)AS count FROM gottraction.attraction group by category;SELECT * FROM attraction ORDER BY  score DESC LIMIT 4";
    mysqlcon.query(querystring, function (err, results) {
        if (!err) {
            // console.log('The solution is: ', rows);
            // log로 체크하는구문.   
            res.render('index.ejs', {
                result: results[0],
                popular: results[1],
                loggedin: session.user.id != null && session.user.id != 'dummy',
                user_id: session.user.id,
                change:change!=undefined
                // SQL Query 실행결과인 results 를 statusList.ejs 파일에 result 이름의 리스트로 전송
            });
        }
        else {
            console.log('Error while performing Query.', err);
        }
    })
    //res.redirect("/views/listing.ejs")
})

router.get("/views/logout", function (req, res) {
    session.user.id = 'dummy'
    session.user.password = ''
    res.redirect("/views/index.ejs")
})

//페이지 출력 여기서 해주라는 요청.
router.get("/views/listings.ejs", function (req, res) {
    
    var querydata = url.parse(req.url, true).query;

    var category = (querydata.category == undefined) ? "전체" : querydata.category;
    var location = (querydata.location == undefined) ? "전체" : querydata.location;
    var querystring = "select * from attraction";
    var authorizationCondition = "";
    var gradeCondition = "";
    var orderCondition = "";

    var starUrl = req.url;
    var orderUrl = (querydata.order == undefined) ? "최신순" : querydata.order;

    if (category == "전체" && location == "전체") {
        querystring;
    }
    else if (category != "전체" && location != "전체") {
        querystring += " where location = '" + location + "' and category = '" + category + "'";
    }
    else if (category != "전체" || location != "전체") {
        if (category == "전체") {
            querystring += " where location = '" + location + "'";
        }
        else if (location == "전체") {
            querystring += " where category = '" + category + "'";
        }
    }
    var userid = session.user.id ? session.user.id : 'dummy'
    mysqlcon.query("select authority from user where id = ?", [userid], function (err, result) {
        if (result[0].authority == 'user') {
            if (category == "전체" && location == "전체")
                authorizationCondition = " where authorized = 1"
            else
                authorizationCondition = " and authorized = 1"
        }
        //별점 분류 코드 - start
        if (starUrl.indexOf('grade=') != -1) {
            if (querystring.indexOf('where') != -1) {
                gradeCondition = " and (";
            }
            else if (authorizationCondition.indexOf('where') != -1) {
                gradeCondition = " and (";
            }
            else {
                gradeCondition = " where (";
            }
        }
        else {
            gradeCondition = "";
        }
        if (starUrl.indexOf('5.0') != -1) {
            gradeCondition = gradeCondition + 'score = 5.0 or ';
        }
        if (starUrl.indexOf('4.0') != -1) {
            gradeCondition = gradeCondition + 'score >= 4.0 and score < 5.0 or ';
        }
        if (starUrl.indexOf('3.0') != -1) {
            gradeCondition = gradeCondition + 'score >= 3.0 and score < 4.0 or ';
        }
        if (starUrl.indexOf('2.0') != -1) {
            gradeCondition = gradeCondition + 'score >= 2.0 and score < 3.0 or ';
        }
        if (starUrl.indexOf('1.0') != -1) {
            gradeCondition = gradeCondition + 'score >= 1.0 and score < 2.0 or ';
        }
        if (starUrl.indexOf('grade=') != -1) {
            gradeCondition = gradeCondition.substr(0, gradeCondition.length - 4);
            gradeCondition = gradeCondition + ')';
        }
        if (orderUrl == '최신순') {
            orderCondition = ' order by id desc';
        }
        else if (orderUrl == '오래된순') {
            orderCondition = ' order by id asc';
        }
        else if (orderUrl == '평점순') {
            orderCondition = ' order by score desc'
        }
        else {
            orderCondition = '';
            console.log('orderCondition error!!!================================');
        }
        //별점 분류 코드 - end
        mysqlcon.query(querystring + authorizationCondition + gradeCondition + orderCondition, function (err, results) {
            if (!err) {
                // console.log('The solution is: ', rows);
                // log로 체크하는구문.  
                console.log(querystring + authorizationCondition + gradeCondition + orderCondition + '======================================================'); 
                res.render('listings.ejs', {
                    result: results,
                    user_id: session.user.id,
                    _url: req.url,
                    pageNum:(req.query.page)?req.query.page:1,
                    loggedin: session.user.id != null && session.user.id != 'dummy',
                    loginfirst:querydata.loginfirst!=null
                    // SQL Query 실행결과인 results 를 statusList.ejs 파일에 result 이름의 리스트로 전송
                });
            }
            else {
                console.log('Error while performing Query.', err);
            }
        })
    })

    //res.redirect("/views/listing.ejs")
})

router.get("/views/single-listing.ejs", function (req, res) {
    var querydata = url.parse(req.url, true).query;

    var AttractionId = querydata.id;
    if (AttractionId == undefined) {
        res.redirect('/views/index.ejs?#')
    }
    else {
        var userid = session.user.id ? session.user.id : 'dummy'
        mysqlcon.query("select * from attraction where id = ?; select * from review where AttractionId = ?; select authority from user where id = ?", [AttractionId, AttractionId, userid], function (err, results) {
            if (!err) {
                results[0][0].contents = (results[0][0].contents.replace(new RegExp('\n', 'g'), '<br>'))
                res.render('single-listing.ejs', {
                    result: results[0],
                    reviews: results[1],
                    Aid: AttractionId,
                    authority: results[2][0].authority,
                    loggedin: session.user.id != null && session.user.id != 'dummy',
                    user_id: session.user.id
                    // SQL Query 실행결과인 results 를 statusList.ejs 파일에 result 이름의 리스트로 전송
                });
            }
            else {
                console.log('Error while performing Query.', err);
            }
        })
    }
})

// 홈페이지에 url없이 접속시 index url로 리다이렉트
router.get("/", function (req, res) {
    res.redirect("/views/index.ejs?#") // 이 주소로 해야지 정상 작동되는거 구현완료.
})
router.get("/views/register.ejs",function(req,res){
    if(session.user.id=='dummy')
        res.redirect('/views/listings.ejs?loginfirst=true')
    else
        res.render('register.ejs',
            {
                user_id: session.user.id,
                loggedin: session.user.id != 'dummy'
            })
})
//작성 내용 mysql에 넣기
router.post("/views/register.ejs", upload.single('picture_r'), function (req, res, next) {
    //    console.log(req)
    //    console.log(req.files)
    var name_r = req.body.name_r;
    var address_r = req.body.address_r;
    var phone_r = req.body.phone_r;
    var fee_r = req.body.fee_r;
    var time_r = req.body.time_r;
    var cate_r = req.body.cate_r;
    var loca_r = req.body.loca_r;
    var content_r = req.body.content_r;
    //var picture_r = req.body.picture_r;

    if (name_r == "" || session.user.id == 'dummy') {
        res.redirect(req.url);
    }
    else {

        mysqlcon.query(
            `INSERT INTO attraction (title, address, phone, fee, opentime, category, location, contents, picture,user_id) VALUES (?,?,?,?,?,?,?,?,?,?)`,
            [name_r, address_r, phone_r, fee_r, time_r,
            cate_r, loca_r, content_r, (req.file)?req.file.originalname:"", session.user.id],
            function (error, result) {
                if (error) {
                    console.log("데이터베이스 입력 에러...");
                    throw error;
                }
                // response.writeHead(302, {Location: `/?id=${result.insertId}`});
                // response.end();
            }
        )
        console.log('=================================등록====================================');
        res.redirect('/views/listings.ejs');
    }
})
router.get('/views/Register/Register_user.ejs', function (req, res) {
    var insertagain = req.query.insertagain
    var passagain = req.query.passagain
    var idagain = req.query.idagain

    res.render('Register/Register_user.ejs',
        {
            insertagain:insertagain!=undefined,
            passagain:passagain!=undefined,
            idagain:idagain!=undefined
        }
    );
})
//회원가입 sql문 구분.
router.post("/views/Register/Register_user.ejs", function (req, res, next) {
    // console.log(req.body);
    var id = req.body.id;
    var pass = req.body.pass;
    var repass = req.body.re_pass;
    var sql = 'SELECT * FROM user WHERE id=?';
    if(id=='undefined' || pass=='undefined' || repass=='undefined'){
        res.redirect("/views/Register/Register_user.ejs#?insertagain=true");
    }
    else{
         mysqlcon.query(sql, [id], function (err, results) {
        if (err) {
            res.redirect("/views/Register/Register_user.ejs?insertagain=true");
            console.log(err);
        }

        if (results.length == 0) {
            if (pass == repass) {
                mysqlcon.query(
                    `INSERT INTO user (id, email, password, authority) VALUES (?,?,?,?)`,
                    [req.body.id, req.body.email, req.body.pass, 'user'],
                    function (error, result) {
                        if (error) {
                            res.redirect("/views/Register/Register_user.ejs?insertagain=true");
                            console.log("데이터베이스 입력 에러...");
                            throw error;
                        }
                    }
                )
                res.redirect("/views/Register/Login.ejs?succses=true")
            }
            else {
                //이거 로그 따로 alert로 만들것.
                console.log('pw 맞지않음.');
                res.redirect("/views/Register/Register_user.ejs?passagain=true");
            }
        }
        else {
            //이거 로그 따로 alert로 만들것.
            console.log('id중복');
            res.redirect("/views/Register/Register_user.ejs?idagain=true");
        }
    })
    }
})

router.post("/views/listings.ejs", function (req, res) {
    //req.url.querystring+="&page="
    res.redirect(req.url)
})

router.post("/views/single-listing.ejs", function (req, res, next) {
    var description = req.body.description;
    var stars = req.body.stars;

    if (description == "" || session.user.id == 'dummy')
        res.redirect(req.url)
    else {
        mysqlcon.query("insert into review (AttractionId,userid,description,Wtime,stars) values (?,?,?," + "sysdate()" + ",?)", [req.query.id, session.user.id, description, stars], function (err, result) {

            console.log("insert into review (AttractionId,userid,description,Wtime,stars) values (?,?,?," + "sysdate()" + ",?)", [req.query.id, session.user.id, description, stars])
            if (err)
                console.log("Query Error : " + err)
        })
        mysqlcon.query("update attraction set score = (select round(avg(stars),2) from review where Attractionid = ?) where id = ?", [req.query.id, req.query.id], function (err, result) {
            if (err)
                console.log("Query Error : " + err)
        })
        res.redirect(req.url)
    }
})

router.post("/views/deleteReview", function (req, res) {
    if (req.query.Rid == undefined || session.user.id == 'dummy') {
        res.redirect("index.ejs")
    } else {
        mysqlcon.query("select userid,AttractionId from review where id = ?;select authority from user where id = ?", [req.query.Rid, session.user.id],
            function (err, result) {
                console.log(req.query.Rid)
                if (err)
                    console.log(err);
                if (result[0][0].userid == session.user.id || result[1][0].authority == 'admin') {
                    //세션 구현되면 위에 yunu 부분들 세션에 있는 id 불러오는걸로 바꿔라.    
                    mysqlcon.query("delete from review where id = ?", [req.query.Rid], function (err, results) {
                        mysqlcon.query("update attraction set score = (select round(avg(stars),2) from review where Attractionid = ?) where id = ?", [result[0][0].AttractionId, result[0][0].AttractionId], function (err, result) {
                            if (err)
                                console.log("Query Error : " + err)
                        });
                        res.redirect("/views/single-listing.ejs?id=" + req.query.Aid);
                    })
                }
                else res.redirect("/views/single-listing.ejs?id=" + req.query.Aid);

            })
    }
})

router.post("/views/deleteAttraction", function (req, res) {
    if (req.query.Aid == undefined) {
        res.redirect("index.ejs")
    }
    else {
        mysqlcon.query("select user_id from attraction where id = ?;select authority from user where id = ?", [req.query.Aid, session.user.id],
            //글 게시자랑 글 지우려는 색기 권한을 불러오는거임.//세션 구현되면 위에 yunu 부분들 세션에 있는 id 불러오는걸로 바꿔라.
            function (err, result) {
                if (err)
                    console.log(err);
                if (result[0][0].user_id == session.user.id || result[1][0].authority == 'admin') {
                    //세션 구현되면 위에 yunu 부분들 세션에 있는 id 불러오는걸로 바꿔라.    
                    mysqlcon.query("delete from review where attractionid = ?;delete from attraction where id = ?", [req.query.Aid, req.query.Aid], function (err, result) {
                        res.redirect("/views/listings.ejs");
                    })
                }
                else res.redirect("/views/single-listing.ejs?id=" + req.query.Aid);

            })
    }
})

router.post("/views/authorize", function (req, res) {
    if (req.query.Aid == undefined) {
        res.redirect("index.ejs")
    }
    mysqlcon.query("select authority from user where id = ?", [session.user.id], function (err, result) {
        //세션 구현되면 위에 yunu 부분들 세션에 있는 id 불러오는걸로 바꿔라.
        if (result[0].authority = "admin")
            mysqlcon.query("update attraction set authorized = !authorized where id = ?", [req.query.Aid], function (err, result) {
                if (err)
                    console.log("DB error" + err)
                res.redirect("/views/single-listing.ejs?id=" + req.query.Aid)
            })
    })
})
router.get('/views/Register/Modify.ejs', function (req, res) {
    var passagain = req.query.passagain
    var insertpassagain = req.query.insertpassagain
    res.render('Register/Modify.ejs',
        {   
            passagain:passagain!=undefined ,
            insertpassagain:insertpassagain!=undefined   
        }
    );
})

router.post("/views/Register/Modify.ejs", function (req, res) {
//     console.log(res.body)
//     if (req.body.pass != session.user.password)
//         res.redirect("Modify.ejs?passagain=true")
//     else {
//         if (req.body.choice == "확인") {
//             if(req.body.New_pass == req.body.re_pass){
//                 mysqlcon.query("update user set password = ? where id=?", [req.body.New_pass, session.user.id], function (err, results) {
//                 if (err){

//                 }
//                     console.log("DB query error : ", err)
//                 res.redirect("/views/index.ejs")})
//             }
//             else
//                 res.redirect("Modify.ejs?insertpassagain=true")
//         }
//         else if (req.body.choice == '회원 탈퇴') {
//             mysqlcon.query("delete from user where id=?", [session.user.id], function (err, results) {
//                 if (err)
//                     console.log("DB query error : ", err)
//                 res.redirect("/views/index.ejs")
//             })
//         }
//         session.user.id='dummy'
//     }
// })
console.log(req.body.new_pass)
console.log(req.body.re_pass)
    if (!(req.body.new_pass == req.body.re_pass)){
        res.redirect("Modify.ejs?passagain=true")  
    }
    if (!(req.body.pass == session.user.password)){
        res.redirect("Modify.ejs?insertpassagain=true")  
    }
    if (req.body.pass == session.user.password){
        if (req.body.choice == "확인") {

            if(req.body.new_pass != req.body.re_pass){
                    res.redirect("Modify.ejs?insertpassagain=true")
                }
            mysqlcon.query("update user set password = ? where id=?", [req.body.new_pass, session.user.id], function (err, results) {
                if (err)
                    console.log("DB query error : ", err)

                    res.redirect("/views/index.ejs?change=true")
            })
        }
        else if (req.body.choice == '회원 탈퇴') {
            mysqlcon.query("delete from user where id=?", [session.user.id], function (err, results) {
                if (err)
                    console.log("DB query error : ", err)
                else{
                     res.redirect("/views/index.ejs")
                }
            })
        }
    }

})

router.get("/views/contact.ejs", function (req, res) {
    res.render('contact.ejs', {
        loggedin: session.user.id != null && session.user.id != 'dummy',
        user_id: session.user.id
        // SQL Query 실행결과인 results 를 statusList.ejs 파일에 result 이름의 리스트로 전송
    });
})

module.exports = router;