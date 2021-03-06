var express = require('express')
var router = express.Router()
var mysql = require('mysql');
var ejs = require('ejs');
var qs = require('querystring')
var url = require('url')
var passport = require('passport');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var LocalStrategy = require('passport-local').Strategy;
var bodyParser = require('body-parser');
var multer = require('multer')
var path = require('path')
var storage = multer.diskStorage({
    destination: function (req, file, cb) { cb(null, path.join(__dirname, 'views/img/uploaded')) },
    filename: function (req, file, cb) { cb(null, file.originalname) }
});
var upload = multer({ storage: storage });//{storage:storage})

//밑 코드 데이터베이스 연결
var dbConfig = require('./dbConfig');
var mysqlcon = mysql.createConnection(dbConfig);

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

router.get('/views/Register/Login.ejs', function (req, res) {
    var tryagain = req.query.tryagain
    var succses = req.query.succses

    res.render('Register/Login.ejs',
        {
            tryagain: tryagain != undefined,
            succses: succses != undefined,
        }
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
    var outchange = req.query.outchange

    //console.log(querydata.category)
    var querystring = "SELECT category,count(*)AS count FROM attraction where authorized !=0 and category in('자연','문화관광','테마관광지','도보','레저/체험') group by category;\
    SELECT * FROM attraction ORDER BY  score DESC LIMIT 4;";
    mysqlcon.query(querystring, function (err, results) {
        if (!err) {
            //console.log(results)
            //console.log('The solution is: ', rows);
            // log로 체크하는구문.   
            res.render('index.ejs', {
                result: results[0],
                popular: results[1],
                loggedin: session.user.id != null && session.user.id != 'dummy',
                user_id: session.user.id,
                change: change != undefined,
                outchange: outchange != undefined
                // SQL Query 실행결과인 results 를 statusList.ejs 파일에 result 이름의 리스트로 전송
            });
        }
        else {
            console.log('Error while performing Query.', err);
        }
    })
})

router.get("/views/logout", function (req, res) {
    session.user.id = 'dummy'
    session.user.password = ''
    res.redirect("/views/index.ejs")
})

//페이지 출력 여기서 해주라는 요청.
router.get("/views/listings.ejs", function (req, res) {

    var querydata = url.parse(req.url, true).query;
    var unregistering = req.query.unregistering
    var registering = req.query.registering
    var category = (querydata.category == undefined) ? "전체" : querydata.category;
    var location = (querydata.location == undefined) ? "전체" : querydata.location;
    var querystring = "select * from attraction";
    var authorizationCondition = "";
    var gradeCondition = "";
    var orderCondition = "";

    var starUrl = req.url;
    var orderUrl = (querydata.order == undefined) ? "최신순" : querydata.order;
    var orderSort = new Array(3).fill("");
    var fixedCategory = new Array(6).fill("");
    var fixedLocation = new Array(18).fill("");

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
    switch (category) {
        case '전체':
            fixedCategory[0] = 'selected';
            break;
        case '자연':
            fixedCategory[1] = 'selected';
            break;
        case '문화관광':
            fixedCategory[2] = 'selected';
            break;
        case '테마관광지':
            fixedCategory[3] = 'selected';
            break;
        case '도보':
            fixedCategory[4] = 'selected';
            break;
        case '레저/체험':
            fixedCategory[5] = 'selected';
            break;
    }
    switch (location) {
        case '전체':
            fixedLocation[0] = 'selected';
            break;
        case '서울':
            fixedLocation[1] = 'selected';
            break;
        case '부산':
            fixedLocation[2] = 'selected';
            break;
        case '대구':
            fixedLocation[3] = 'selected';
            break;
        case '인천':
            fixedLocation[4] = 'selected';
            break;
        case '광주':
            fixedLocation[5] = 'selected';
            break;
        case '대전':
            fixedLocation[6] = 'selected';
            break;
        case '울산':
            fixedLocation[7] = 'selected';
            break;
        case '세종':
            fixedLocation[8] = 'selected';
            break;
        case '경기':
            fixedLocation[9] = 'selected';
            break;
        case '강원':
            fixedLocation[10] = 'selected';
            break;
        case '충북':
            fixedLocation[11] = 'selected';
            break;
        case '충남':
            fixedLocation[12] = 'selected';
            break;
        case '전북':
            fixedLocation[13] = 'selected';
            break;
        case '전남':
            fixedLocation[14] = 'selected';
            break;
        case '경북':
            fixedLocation[15] = 'selected';
            break;
        case '경남':
            fixedLocation[16] = 'selected';
            break;
        case '제주':
            fixedLocation[17] = 'selected';
            break;
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
            orderSort[0] = 'selected';
        }
        else if (orderUrl == '오래된순') {
            orderCondition = ' order by id asc';
            orderSort[1] = 'selected';
        }
        else if (orderUrl == '평점순') {
            orderCondition = ' order by score desc'
            orderSort[2] = 'selected';
        }
        else {
            orderCondition = '';
            console.log('orderCondition error!!!================================');
        }
        //별점 분류 코드 - end
        mysqlcon.query(querystring + authorizationCondition + ((authorizationCondition=="" && querystring.indexOf('where') == -1)?" where user_id =?":" or user_id =?") +gradeCondition + orderCondition,[session.user.id], function (err, results) {
            if (!err) {
                // console.log('The solution is: ', rows);
                // log로 체크하는구문.  
                console.log(querystring + authorizationCondition + gradeCondition + orderCondition + '======================================================'); 
                res.render('listings.ejs', {
                    result: results,
                    user_id: session.user.id,
                    _url: req.url,
                    orderSorts: orderSort,
                    fixedCategories: fixedCategory,
                    fixedLocations: fixedLocation,
                    pageNum: (req.query.page) ? req.query.page : 1,
                    loggedin: session.user.id != null && session.user.id != 'dummy',
                    loginfirst: querydata.loginfirst != null,
                    // SQL Query 실행결과인 results 를 statusList.ejs 파일에 result 이름의 리스트로 전송
                    unregistering: unregistering != undefined,
                    registering: registering != undefined
                });
            }
            else {
                console.log('Error while performing Query.', err);
            }
        })
    })
})

router.get("/views/single-listing.ejs", function (req, res) {
    var querydata = url.parse(req.url, true).query;

    var AttractionId = querydata.id;
    if (AttractionId == undefined) {
        res.redirect('/views/index.ejs?#')
    }
    else {
        var userid = session.user.id ? session.user.id : 'dummy'
        mysqlcon.query("select * from attraction where id = ?;\
                        select * from review where AttractionId = ?;\
                        select authority from user where id = ?;", [AttractionId, AttractionId, userid], function (err, results) {
            if (!err) {
                results[0][0].contents = (results[0][0].contents.replace(new RegExp('\n', 'g'), '<br>'))
                res.render('single-listing.ejs', {
                    result: results[0],
                    reviews: results[1],
                    Aid: AttractionId,
                    authority: results[2][0].authority,
                    loggedin: session.user.id != null && session.user.id != 'dummy',
                    user_id: session.user.id,
                    loginfirst:querydata.loginfirst!=null
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
router.get("/views/register.ejs", function (req, res) {
    if (session.user.id == 'dummy')
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
    //console.log(req)
    //console.log(req.files)
    var name_r = req.body.name_r;
    var address_r = req.body.address_r;
    var phone_r = req.body.phone_r;
    var fee_r = req.body.fee_r;
    var time_r = req.body.time_r;
    var cate_r = req.body.cate_r;
    var loca_r = req.body.loca_r;
    var content_r = req.body.content_r;

    if (name_r == '' || address_r == '') {
        res.redirect('/views/listings.ejs?unregistering=true');
    } else {
        mysqlcon.query(
            `INSERT INTO attraction (title, address, phone, fee, opentime, category, location, contents, picture,user_id) VALUES (?,?,?,?,?,?,?,?,?,?)`,
            [name_r, address_r, phone_r, fee_r, time_r,
                cate_r, loca_r, content_r, (req.file) ? req.file.originalname : "", session.user.id],
            function (error, result) {
                if (error) {
                    console.log("데이터베이스 입력 에러...");
                    res.redirect('/views/listings.ejs?unregistering=true');
                    throw error;
                }
            }
        )
        res.redirect('/views/listings.ejs?registering=true');
    }
})
router.get('/views/Register/Register_user.ejs', function (req, res) {
    var insertagain = req.query.insertagain
    var blank = req.query.blank
    var passagain = req.query.passagain
    var idagain = req.query.idagain

    res.render('Register/Register_user.ejs',
        {
            insertagain: insertagain != undefined,
            blank: blank != undefined,
            passagain: passagain != undefined,
            idagain: idagain != undefined
        }
    );
})
//회원가입 sql문 구분.
router.post("/views/Register/Register_user.ejs", function (req, res, next) {
    console.log(req.body);
    var id = req.body.id;
    var pass = req.body.pass;
    var repass = req.body.re_pass;
    var email = req.body.email;
    var sql = 'SELECT * FROM user WHERE id=?';
    if (id == '' || pass == '' || repass == '' || email == '') {
        res.redirect("/views/Register/Register_user.ejs?blank=true");
    }
    else {
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
                    console.log('pw 맞지않음.');
                    res.redirect("/views/Register/Register_user.ejs?passagain=true");
                }
            }
            else {
                console.log('id중복');
                res.redirect("/views/Register/Register_user.ejs?idagain=true");
            }
        })
    }
})

router.post("/views/listings.ejs", function (req, res) {
    res.redirect(req.url)
})

router.post("/views/single-listing.ejs", function (req, res, next) {
    var description = req.body.description;
    var stars = req.body.stars;

    if (description == "" || session.user.id == 'dummy')
        res.redirect(req.url+"&loginfirst=true")
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
            function (err, result) {
                if (err)
                    console.log(err);
                if (result[0][0].user_id == session.user.id || result[1][0].authority == 'admin') {
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
            passagain: passagain != undefined,
            insertpassagain: insertpassagain != undefined
        }
    );
})

router.post("/views/Register/Modify.ejs", function (req, res) {
    console.log(req.body.new_pass)
    console.log(req.body.re_pass)
    if (!(req.body.new_pass == req.body.re_pass)) {
        res.redirect("Modify.ejs?passagain=true")
    }
    if (!(req.body.pass == session.user.password)) {
        res.redirect("Modify.ejs?insertpassagain=true")
    }
    if (req.body.pass == session.user.password) {
        if (req.body.choice == "확인") {

            if (req.body.new_pass != req.body.re_pass) {
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
                else {
                    session.user.id = 'dummy'
                    session.user.password = ''
                    res.redirect("/views/index.ejs?outchange=true")
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