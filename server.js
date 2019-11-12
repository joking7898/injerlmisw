/*
현재 핵심문제
1. Pagerouter.js의 콜백함수들에서 html페이지를 출력하게 수정하는 것.
2. Pagerouter.js의 콜백함수들에서 EJS기능으로 데이터베이스에서 읽어낸 값을 페이지에 전달하는 것.
서버를 가동하려면, visual code로 이 파일 연 다음, 위에 Terminal - New Terminal 들어가서 밑에 터미널 창 띄운 후, node server.js라는 명령어 치면 됨.
*/
var express = require('express')
var Eapp = express()
var morgan = require('morgan')
var PageRouter = require('./PageRouter.js')
var bodyparser = require('body-parser')

var http = require('http');
var fs = require('fs');
var _url = require('url');
var mysql = require('mysql');
/*
mysql 연결하는 단계. 호스트, 유저, 비밀번호, 사용 데이터베이스는 본인 깔려있는 데이터베이스에 맞게 알아서 맞추면 됨.
사실 db연결을 여기서 할 필요는 업음, 이건 DB기능 테스트할때 만들어본거. 지워도 됨. DB연결부는 Pagerouter.js에 몰빵하시오.
 */
var mysqlcon = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'freehongkong',
    database: 'gottraction'
});
Eapp.use(morgan('short'))
Eapp.use(bodyparser.urlencoded({extended:false}))
Eapp.use(PageRouter);
Eapp.use(express.static('./public'))

mysqlcon.connect(function(err){
    if(err)
    // 확인하고 싶은 사항이 있다면, 알고리즘 문제 풀 때 printf로 체크하듯이, console.log로 확인하면 됨.
    console.log("error with connecting to database: " + err);
});
/*
쿼리 실험문. 이윤우 컴퓨터에선 정상동작되어 결과가 나왔음. 앞으로 쿼리 쓸 일 있으면 이 양식보고 따라쓰면 됨. 콜백함수에서 rows는 반환된 출력, err은 반환된 오류.
*/
mysqlcon.query('select * from user',function(err,rows){
    if(err)
        console.log("Query error message : " + err);
    console.log("rowmsg : "+rows[0].id);
})


/*
밑의 Eapp.use는 없애도 서버는 정상작동함. 현재 유일한 역할은 url에 따라 페이지 보여주는 것.
문제가 되는 부분은, PageRouter에서도 request를 받아 처리하는 부분이 있다는 것.
이것과 Page router에 있는 콜백 함수들이 동시에 호출되기 때문에 충돌위험이 있어 Pagerouter로 기능을 옮기고 이 함수는 폐기하는 것을 권장.
*/
Eapp.use(function(request,response){
    var url = request.url;
    var queryData = _url.parse(url,true).query;
    url = _url.parse(url,true).pathname;

    response.writeHead(200);
    /*
    홈페이지에 들어온 request의 url에 따라 웹 페이지를 출력함. 원래 이렇게 짜면 안되고, PageRouter에서 출력해 줘야 함.
    */
    if(url.endsWith('html')||url.endsWith('js')||url.endsWith('css')||url.endsWith('jpg')||url.endsWith('png')||url.endsWith('woff')||url.endsWith('ttf')||url.endsWith('woff2'))
    {
        response.end(fs.readFileSync(__dirname + url));
    }else{
        response.end();
    }
})
// app.listen(3000);
http.createServer(Eapp).listen(3000)