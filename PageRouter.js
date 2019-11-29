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

//밑 코드 데이터베이스 연결
var dbConfig = require('./dbConfig');
// var dbOptions = dbConfig;
var mysqlcon = mysql.createConnection({
    host: 'yunudb.c9jcx2tgvrrn.us-west-2.rds.amazonaws.com',
    user: 'admin',
    password: 'freehongkong', 
    database: 'gottraction',
    multipleStatements:true
    //port: '3306'
});
var app = express();
/*var dbOptions = {
  host: 'yunudb.c9jcx2tgvrrn.us-west-2.rds.amazonaws.com', 
  user: 'admin', 
  password: 'freehongkong',
  database: 'gottraction',
};
 
var conn = mysql.createConnection(dbOptions);
conn.connect();*/
var fs = require('fs')
var ejs = require('ejs')
var bodyparser = require('body-parser')
router.use(bodyparser.urlencoded({extended: false}))

//session test - kty
// router.use(session({
//   secret: '!@#$%^&*',
//   store: new MySQLStore(dbOptions),
//   resave: false,
//   saveUninitialized: false,
//   cookie : {secure : false ,maxAge: 1000 * 60 * 60 }// 유효기간 1시간  
// }));
router.use(session({
    secret: 'Yunu',
    resave: false,
    saveUninitialized: false,
    cookie : {secure : false ,maxAge: 1000 * 60 * 60 }// 유효기간 1시간  
  }));
session.user = {
    id:'dummy',
    password:''
} 
//yeah 
router.use(passport.initialize());
router.use(passport.session());

mysqlcon.connect(function (err) {
})

//passport 로그인 구현단.
/*passport.use(new LocalStrategy(
  function(username, password, done) {
    var sql = 'SELECT * FROM user WHERE id=?';
    conn.query(sql, [username], function(err, results){
      if(err)
        return done(err);
      if(!results[0])
        return done('please check your id.');

      var user = results[0];
        if(password === user.password){
          console.log("pw일치");
          console.log(user);
          return done(null, user);
        }
        else {
          console.log("pw체크해라.");
          return done('please check your password.');
        }
    });//query
  }
));
passport.serializeUser(function(user, done) {
    console.log(user.id); // id 출력 잘됨.
    console.log("serializeUser 실행");
    done(null, user.id);
});
passport.deserializeUser(function(id, done) {
    console.log("deserializeUser 실행"); //실행이 왜 안될까.
    var sql = 'SELECT * FROM user WHERE id=?';
    conn.query(sql, [id], function(err, results){
        if(err){
        console.log("1");
        return done(err, false);      
        }
        if(!results[0]){
        console.log("2");
        return done(err, false);      
        }
        return done(null, results[0]);
    });
});*/
//처음 실행했을때
router.get('/views/Register/Login.ejs', function (req, res) {
    // 로그인 확인된 유저가 안보이면 login함수로 로그인 유저 보이면 welcome으로
    if(!req.user)
        res.redirect('/login');
    else
        res.redirect('/welcome');
    });
    //만약 login함수들어왔는데 로그인 확인 보여지면 welcome으로 안보이면 로그인 login.ejs 페이지 뿌림
router.get('/login', function(req, res){
    if(!req.user){
        console.log("req.user 안가져와짐.")
        // login.ejs massage 변수 전달.
        res.render('Register/Login.ejs');    
    }
    else
    res.redirect('/welcome');
});
router.get('/welcome', function(req, res){
    if(!req.user){
        console.log("안가져와짐.")
        return res.redirect('/login');
    }
    //아이디 로그인 됬을때.
    else{
        console.log("id가져옴.");
        // res.render('/views/index.ejs', {name:req.user.id});
        res.render('index.ejs');
    }
});
//로그아웃 함수.
router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});
//패스포트인증 성공했을때 welcome 라우터로 실패시 login라우터로  이동.
// router.post('/login',
//     passport.authenticate(
//         'local',
//         {
//             successRedirect: '/welcome',
//             failureRedirect: '/login',
//             failureFlash: false
//         })
// );
router.post('/login',function(req,res){
    var id = req.body.id;
    var password = req.body.your_pass;
    mysqlcon.query("select * from user where id = ? and password = ?",[id,password],function(err,results) {
        if (!err && results[0] !=undefined){
            session.user = {
                "id":results[0].id,
                "password":results[0].password
            }
            res.redirect("/views/index.ejs?#");
//            res.render('index.ejs', {
//            result: results    
            // SQL Query 실행결과인 results 를 statusList.ejs 파일에 result 이름의 리스트로 전송
//            });
        }
        else{
            res.redirect("/login");
            console.log('Error while performing Query in login.', err);
        }
    })
});
// session 구현부분.
// router.get('/', function (req, res) {
//   if(!req.session.name)
//     res.redirect('/login');
//   else
//     res.redirect('/welcome');
// });
// router.get('/login', function(req, res){
//   if(!req.session.name)
//     res.render('login.ejs', { message:'로그인좀 해라.'});
//   else
//     res.redirect('/welcome');
// });
// router.get('/welcome', function(req, res){
//   if(!req.user)
//     return res.redirect('/login');
//   else
//     res.render('welcome.ejs', {name:req.user.id});
// });
// router.get('/welcome', function(req, res){
//   console.log('웰컴들어오냐?');
//   if(!req.session.name){
//     console.log('세션 이름이 왜없니.?');
//     return res.redirect('/login');    
//   }
//   else
//     res.render('welcome.ejs', {name:req.session.name});
// });
// router.post('/login', function(req, res) {
//     var id = req.body.username;
//     var pw = req.body.password;
//     var sql = 'SELECT * FROM user WHERE id=?';
//     conn.query(sql, [id], function(err, results){
//       if(err)
//         console.log(err);
 
//       if(!results[0])
//       return res.render('login.ejs', {message:'아이디 체크 안허냐'});
 
//       var user = results[0];
//       if(pw === user.password){
//         req.session.name = user.id;
//         req.session.save(function(){
//           return res.redirect('/welcome');
//         });
//       }
//       else {
//         return res.render('login.ejs', {message:'비밀번호 체크하라고!!.'});
//       }
//     });//query
//   }
// );
// router.get('/logout', function(req, res){
//   req.session.destroy(function(err){
//     res.redirect('/');
//   });
// });
 

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
            result: results,
            loggedin : session.user.id!=null||session.user.id!='dummy'    
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
    var userid = session.user.id?session.user.id:'dummy'
    mysqlcon.query("select authority from user where id = ?",[userid],function(err,result){
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
                _url:req.url,
                loggedin : session.user.id!=null||session.user.id!='dummy'
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
        var userid = session.user.id?session.user.id:'dummy'
        mysqlcon.query("select * from attraction where id = ?; select * from review where AttractionId = ?; select authority from user where id = ?",[AttractionId,AttractionId,userid],function(err,results) {
        if (!err){
            results[0][0].contents= (results[0][0].contents.replace(new RegExp('\n','g'), '<br>'))
            res.render('single-listing.ejs', {
            result: results[0],
            reviews: results[1],
            Aid:AttractionId,
            authority:results[2][0].authority,
            loggedin : session.user.id!=null||session.user.id!='dummy'
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
    if(name_r=="" ||session.user.id == 'dummy')
        res.redirect(req.url)
    mysqlcon.query(
        `INSERT INTO attraction (title, address, phone, fee, opentime, category, location, contents, picture,user_id) VALUES (?,?,?,?,?,?,?,?,?,?)`,
        [req.body.name_r, req.body.address_r, req.body.phone_r, req.body.fee_r, req.body.time_r, 
        req.body.cate_r, req.body.loca_r, req.body.content_r, req.body.picture_r,session.user.id], 
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
//회원가입 sql문 구분.
router.post("/views/Register/Register_user.ejs", function (req, res, next) {
    // console.log(req.body);
    var id = req.body.id;
    var pass = req.body.pass;
    var repass = req.body.re_pass;
    var sql = 'SELECT * FROM user WHERE id=?';
        conn.query(sql, [id], function(err, results){
        if(err){
            console.log(err);              
        }

        if(results.length == 0){
              if(pass == repass){
                mysqlcon.query(
                    `INSERT INTO user (id, email, password, authority) VALUES (?,?,?,?)`,
                    [req.body.id, req.body.email, req.body.pass,'user'], 
                    function (error, result) {
                        if (error) {
                            console.log("데이터베이스 입력 에러...");
                            throw error;
                        }
                    }
                )
                res.redirect("/views/Register/Login.ejs")
            }
            else{
                //이거 로그 따로 alert로 만들것.
                console.log('pw 맞지않음.');
                res.redirect("/views/Register/Register_user.ejs");
            }
        }
        else{
            //이거 로그 따로 alert로 만들것.
            console.log('id중복');
            res.redirect("/views/Register/Register_user.ejs");
        }
    })
})

router.post("/views/listings.ejs",function(req,res){
    //req.url.querystring+="&page="
    res.redirect(req.url)
})
router.post("/views/single-listing.ejs", function (req, res, next) {
    var description = req.body.description;
    var stars = req.body.stars;

    if(description=="" || session.user.id == 'dummy')
        res.redirect(req.url)
    else
    {
        mysqlcon.query( "insert into review (AttractionId,userid,description,Wtime,stars) values (?,?,?,"+"sysdate()"+",?)",[req.query.id,session.user.id,description,stars],function(err,result){
         
            console.log("insert into review (AttractionId,userid,description,Wtime,stars) values (?,?,?,"+"sysdate()"+",?)",[req.query.id,session.user.id,description,stars])
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
    if(req.query.Rid == undefined ||session.user.id == 'dummy'){
        res.redirect("index.ejs")
    }else
    {
    mysqlcon.query("select userid,AttractionId from review where id = ?;select authority from user where id = ?",[req.query.Rid,session.user.id],
    function(err,result){
        console.log(req.query.Rid)
        if(err)
            console.log(err);
        if(result[0][0].userid==session.user.id || result[1][0].authority =='admin' ){
        //세션 구현되면 위에 yunu 부분들 세션에 있는 id 불러오는걸로 바꿔라.    
            mysqlcon.query("delete from review where id = ?",[req.query.Rid],function(err,results){
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
    mysqlcon.query("select user_id from attraction where id = ?;select authority from user where id = ?",[req.query.Aid,session.user.id],
    //글 게시자랑 글 지우려는 색기 권한을 불러오는거임.//세션 구현되면 위에 yunu 부분들 세션에 있는 id 불러오는걸로 바꿔라.
    function(err,result){
        if(err)
            console.log(err);
        if(result[0][0].user_id==session.user.id || result[1][0].authority =='admin' ){
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
    mysqlcon.query("select authority from user where id = ?",[session.user.id],function(err,result){
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