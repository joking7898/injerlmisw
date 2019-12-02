'use strict';

(function ($) {

    /*------------------
        Preloader
    --------------------*/
    $(window).on('load', function () {
        $(".loader").fadeOut();
        $("#preloder")
            .delay(200)
            .fadeOut("slow");
    });

    /*------------------
        Background Set
    --------------------*/
    $('.set-bg').each(function () {
        var bg = $(this).data('setbg');
        $(this).css('background-image', 'url(' + bg + ')');
    });

    /*------------------
		Navigation
	--------------------*/
    $(".mobile-menu").slicknav(
        { prependTo: '#mobile-menu-wrap', allowParentLinks: true }
    );

    $('.slicknav_nav ul ').prepend('<li class="header-right-warp"></li>');
    $('.header-right')
        .clone()
        .prependTo('.slicknav_nav > ul > .header-right-warp');

    /*----------------------
        Testimonial Slider
    -----------------------*/
    $(".testimonial-item").owlCarousel({
        loop: true,
        margin: 0,
        nav: true,
        items: 1,
        dots: false,
        navText: [
            '<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'
        ],
        smartSpeed: 1200,
        autoplay: false
    });

    /*------------------
        Magnific Popup
    --------------------*/
    $('.pop-up').magnificPopup({ type: 'image' });

    /*-------------------
		Category Select
	--------------------- */
    $('.ca-search').niceSelect();

    /*-------------------
		Local Select
	--------------------- */
    $('.lo-search').niceSelect();

    /*-------------------
		Arrange Select
	--------------------- */
    $('.arrange-select select').niceSelect();

    /*-------------------
		Radio Btn
	--------------------- */
    //평점 체크박스 클릭시 리스팅 분류
    $(".filter-left .rating-filter .rating-option .ro-item label").on('click', function () {
        var nowUrl = window.location.href; //현재 주소
        var starlabel;          //별점 라벨 텍스트
        if ($(this).hasClass('active')) {
            $(this).removeClass('active');
            starlabel = $(this).text();
            nowUrl = nowUrl.replace('&grade=' + starlabel,'');
            window.location = nowUrl;
        } else {
            $(this).addClass('active');
            starlabel = $(this).text();
            window.location = nowUrl + '&grade=' + starlabel;
        }
    }
    );

    //리다이렉트 하더라도 체크박스 유지되도록
    if(window.location.href.indexOf('5.0') != -1) {
        $(".filter-left .rating-filter .rating-option #five label").addClass('active')
    }
    if(window.location.href.indexOf('4.0') != -1) {
        $(".filter-left .rating-filter .rating-option #four label").addClass('active')
    }
    if(window.location.href.indexOf('3.0') != -1) {
        $(".filter-left .rating-filter .rating-option #three label").addClass('active')
    }
    if(window.location.href.indexOf('2.0') != -1) {
        $(".filter-left .rating-filter .rating-option #two label").addClass('active')
    }
    if(window.location.href.indexOf('1.0') != -1) {
        $(".filter-left .rating-filter .rating-option #one label").addClass('active')
    }

    /*-------------------
		리뷰 작성
    --------------------- */
    /*로그인 버튼*/
    $(".share-btn>a").on("click", function () {
        $("#review_f").animate({
            top: "20px"
        }, 500);
        return false;
    });

    $(".share-btn .review_close_btn, input[alt='등록버튼']").on("click", function () {
        $("#review_f").animate({
            top: "-500px"
        }, 500);
        return false;
    });

    $("#rating, #content").on("focus", function () {
        $(this)
            .prev()
            .css("left", "-9999px");
    });

    $("#rating, #content").on("blur", function () {
        if ($(this).val() == "")
            $(this)
                .prev()
                .css("left", "2px");
    }
    );

    $("#AttractionLocation").change(function () {
        var selectLocation = $('#AttractionLocation option:selected').text();

        switch (selectLocation) {
            case "서울":
                $("#mainLocalText").text("서울특별시");
                $("#local_img").css('background-image', 'url(local_img/Seoul.jpg');
                $("#mainLocalText").css('color', 'white');
                $("#mainLocalText").css('text-shadow', '0 0 20px black');
                break;
            case "부산":
                $("#mainLocalText").text("부산광역시");
                $("#local_img").css('background-image', 'url(local_img/Busan.jpg');
                $("#mainLocalText").css('color', 'white');
                $("#mainLocalText").css('text-shadow', '0 0 20px black');
                break;
            case "대구":
                $("#mainLocalText").text("대구광역시");
                $("#local_img").css('background-image', 'url(local_img/Daegu.jpg');
                $("#mainLocalText").css('color', 'white');
                $("#mainLocalText").css('text-shadow', '0 0 20px black');
                break;
            case "인천":
                $("#mainLocalText").text("인천광역시");
                $("#local_img").css('background-image', 'url(local_img/Incheon.jpg');
                $("#mainLocalText").css('color', 'white');
                $("#mainLocalText").css('text-shadow', '0 0 20px black');
                break;
            case "광주":
                $("#mainLocalText").text("광주광역시");
                $("#local_img").css('background-image', 'url(local_img/Gwangju.jpg');
                $("#mainLocalText").css('color', 'white');
                $("#mainLocalText").css('text-shadow', '0 0 20px black');
                break;
            case "대전":
                $("#mainLocalText").text("대전광역시");
                $("#local_img").css('background-image', 'url(local_img/Daejeon.jpg');
                $("#mainLocalText").css('color', 'white');
                $("#mainLocalText").css('text-shadow', '0 0 20px black');
                break;
            case "울산":
                $("#mainLocalText").text("울산광역시");
                $("#local_img").css('background-image', 'url(local_img/Ulsan.jpg');
                $("#mainLocalText").css('color', 'white');
                $("#mainLocalText").css('text-shadow', '0 0 20px black');
                break;
            case "세종":
                $("#mainLocalText").text("세종특별자치시");
                $("#local_img").css('background-image', 'url(local_img/Sejong.jpg');
                $("#mainLocalText").css('color', 'white');
                $("#mainLocalText").css('text-shadow', '0 0 20px black');
                break;
            case "경기":
                $("#mainLocalText").text("경기도");
                $("#local_img").css('background-image', 'url(local_img/Gyeonggi.jpg');
                $("#mainLocalText").css('color', 'white');
                $("#mainLocalText").css('text-shadow', '0 0 20px black');
                break;
            case "강원":
                $("#mainLocalText").text("강원도");
                $("#local_img").css('background-image', 'url(local_img/Gwangwon.jpg');
                $("#mainLocalText").css('color', 'white');
                $("#mainLocalText").css('text-shadow', '0 0 20px black');
                break;
            case "충북":
                $("#mainLocalText").text("충청북도");
                $("#local_img").css('background-image', 'url(local_img/Chungbuk.jpg');
                $("#mainLocalText").css('color', 'white');
                $("#mainLocalText").css('text-shadow', '0 0 20px black');
                break;
            case "충남":
                $("#mainLocalText").text("충청남도");
                $("#local_img").css('background-image', 'url(local_img/Chungnam.jpg');
                $("#mainLocalText").css('color', 'white');
                $("#mainLocalText").css('text-shadow', '0 0 20px black');
                break;
            case "전북":
                $("#mainLocalText").text("전라북도");
                $("#local_img").css('background-image', 'url(local_img/Jeonbuk.jpg');
                $("#mainLocalText").css('color', 'white');
                $("#mainLocalText").css('text-shadow', '0 0 20px black');
                break;
            case "전남":
                $("#mainLocalText").text("전라남도");
                $("#local_img").css('background-image', 'url(local_img/Jeonnam.jpg');
                $("#mainLocalText").css('color', 'black');
                $("#mainLocalText").css('text-shadow', '0 0 20px white');
                break;
            case "경북":
                $("#mainLocalText").text("경상북도");
                $("#local_img").css('background-image', 'url(local_img/Gyeongbuk.jpg');
                $("#mainLocalText").css('color', 'white');
                $("#mainLocalText").css('text-shadow', '0 0 20px black');
                break;
            case "경남":
                $("#mainLocalText").text("경상남도");
                $("#local_img").css('background-image', 'url(local_img/Gyeongnam.jpg');
                $("#mainLocalText").css('color', 'white');
                $("#mainLocalText").css('text-shadow', '0 0 20px black');
                break;
            case "제주":
                $("#mainLocalText").text("제주특별시");
                $("#local_img").css('background-image', 'url(local_img/Jeju.jpg');
                $("#mainLocalText").css('color', 'white');
                $("#mainLocalText").css('text-shadow', '0 0 20px black');
                break;
        }
    });

    $('.starRev span').click(function () {
        $(this).parent().children('span').removeClass('on');
        $(this).addClass('on').prevAll('span').addClass('on');
        $(this).parent().value++;
        return false;
    });

})(jQuery);

function mapchange () {
    const locationIndex = decodeURI(window.location.search).indexOf('location');
    const locationName = decodeURI(window.location.search).substr(locationIndex + 9, decodeURI(window.location.search).length - locationIndex + 9);
    switch (locationName) {
        case "서울":
            document.getElementById("listing-map").src = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d202404.22056510206!2d126.84912352641236!3d37.56528899085878!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357ca28b61c565cd%3A0x858aedb4e4ea83eb!2z7ISc7Jq47Yq567OE7Iuc!5e0!3m2!1sko!2skr!4v1573526085048!5m2!1sko!2skr";
            break;
        case "부산":
            document.getElementById("listing-map").src = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d145481.98595633433!2d128.9770748749855!3d35.16940421665001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3568eb6de823cd35%3A0x35d8cb74247108a7!2z67aA7IKw6rSR7Jet7Iuc!5e0!3m2!1sko!2skr!4v1575117488237!5m2!1sko!2skr";
            break;
        case "대구":
            document.getElementById("listing-map").src = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d103447.88670191725!2d128.49665977612415!3d35.87972967070765!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3565e3b8b2efadd5%3A0xba92e029a0382e30!2z64yA6rWs6rSR7Jet7Iuc!5e0!3m2!1sko!2skr!4v1575207539856!5m2!1sko!2skr";
            break;
        case "인천":
            document.getElementById("listing-map").src = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d202677.8471908769!2d126.53426499499842!3d37.46446732002009!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x35796f2596138247%3A0x7d37fd902cb76142!2z7J247LKc6rSR7Jet7Iuc!5e0!3m2!1sko!2skr!4v1575207556565!5m2!1sko!2skr";
            break;
        case "광주":
            document.getElementById("listing-map").src = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d104358.25567860466!2d126.7737597545477!3d35.17667984122212!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3571892301f5a7af%3A0x5f4d2ed0125f548!2z6rSR7KO86rSR7Jet7Iuc!5e0!3m2!1sko!2skr!4v1575207571824!5m2!1sko!2skr";
            break;
        case "대전":
            document.getElementById("listing-map").src = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d102799.74712134487!2d127.31875979148228!3d36.37307955835727!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x356548d7ba4a6601%3A0xd196d69d988ad3b5!2z64yA7KCE6rSR7Jet7Iuc!5e0!3m2!1sko!2skr!4v1575207587364!5m2!1sko!2skr";
            break;
        case "울산":
            document.getElementById("listing-map").src = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d207722.5752812821!2d129.21141474927518!3d35.561968979439236!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x35662e8be2b2de81%3A0x7083fa7333d93101!2z7Jq47IKw6rSR7Jet7Iuc!5e0!3m2!1sko!2skr!4v1575207600545!5m2!1sko!2skr"
            break;
        case "세종":
            document.getElementById("listing-map").src = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d205316.286423545!2d127.14895971640624!3d36.480098399999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357ad2abe6c47565%3A0x4da638f5f9f95e37!2z7IS47KKF7Yq567OE7J6Q7LmY7Iuc7LKt!5e0!3m2!1sko!2skr!4v1575207720558!5m2!1sko!2skr";
            break;
        case "경기":
            document.getElementById("listing-map").src = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d809272.1706631234!2d126.53545592682883!3d37.59699473505371!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357c79e4e57eb68d%3A0x10c1f98d6f6b5c2!2z6rK96riw64-E!5e0!3m2!1sko!2skr!4v1575207743206!5m2!1sko!2skr";
            break;
        case "강원":
            document.getElementById("listing-map").src = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d938009.5867291365!2d128.04842230412228!3d37.893120908565756!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x356237ec59968d89%3A0xe150c7d25a07a6e!2z6rCV7JuQ64-E!5e0!3m2!1sko!2skr!4v1575208462936!5m2!1sko!2skr";
            break;
        case "충북":
            document.getElementById("listing-map").src = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d819608.7781962245!2d127.40644538742812!3d36.63609111409891!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3563859bf76bfd19%3A0xba9c4a97b8700fe9!2z7Lap7LKt67aB64-E!5e0!3m2!1sko!2skr!4v1575207842457!5m2!1sko!2skr";
            break;
        case "충남":
            document.getElementById("listing-map").src = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d820671.8933991492!2d126.23337484650789!3d36.536035348665216!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357a7d271d70a4ff%3A0x1ab2be67e4e76445!2z7Lap7LKt64Ko64-E!5e0!3m2!1sko!2skr!4v1575207861674!5m2!1sko!2skr";
            break;
        case "전북":
            document.getElementById("listing-map").src = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d829183.3175006296!2d126.36956396556108!3d35.72628409114883!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x35704076a34cb85d%3A0xec8e946488b299d7!2z7KCE652867aB64-E!5e0!3m2!1sko!2skr!4v1575207875284!5m2!1sko!2skr";
            break;
        case "전남":
            document.getElementById("listing-map").src = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1679647.847540705!2d125.37679031110173!3d34.690997289469685!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x356e0f3a0c472589%3A0x6400cf7444019a70!2z7KCE652864Ko64-E!5e0!3m2!1sko!2skr!4v1575207885945!5m2!1sko!2skr";
            break;
        case "경북":
            document.getElementById("listing-map").src = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1640953.7577527235!2d128.72445116683375!3d36.55440690973277!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3560a4bf7a1918bd%3A0xc656699ac74cdc23!2z6rK97IOB67aB64-E!5e0!3m2!1sko!2skr!4v1575207902916!5m2!1sko!2skr";
            break;
        case "경남":
            document.getElementById("listing-map").src = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d834829.2508125879!2d127.83058963262383!3d35.1802624297224!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3568eb6de823cd35%3A0xead060655338f95f!2z6rK97IOB64Ko64-E!5e0!3m2!1sko!2skr!4v1575207914185!5m2!1sko!2skr";
            break;
        case "제주":
            document.getElementById("listing-map").src = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d850967.5445130069!2d126.01256925637642!3d33.57696125042842!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x350ce3544cc84045%3A0x66bc36d2981ebf31!2z7KCc7KO87Yq567OE7J6Q7LmY64-E!5e0!3m2!1sko!2skr!4v1575207926346!5m2!1sko!2skr";
            break;
        default:
            document.getElementById("listing-map").src = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3313736.2630661577!2d125.6296571926375!3d35.79820083016777!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x356455ebcb11ba9b%3A0x91249b00ba88db4b!2z64yA7ZWc66-86rWt!5e0!3m2!1sko!2skr!4v1575208327163!5m2!1sko!2skr";
            break;
    }
}

mapchange()