/*  ---------------------------------------------------
    Template Name: Local Direction
    Description: Local Direction HTML Template
    Author: Colorlib
    Author URI: https://www.colorlib.com
    Version: 1.0
    Created: Colorlib
---------------------------------------------------------  */

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

    $("#submit").click(function () {
        // console.log('listings.ejs?category=' + $('#AttractionCategory
        // option:selected').text() + '&location=' + $('#AttractionLocation
        // option:selected').text());

        // location.href = './listings.ejs?category=' + $(
        //     '#AttractionCategory option:selected'
        // ).text() + '&location=' + $('#AttractionLocation option:selected').text();

    });

    $("#submit2").click(function () {
        // console.log('listings.ejs?category=' + $('#AttractionCategory
        // option:selected').text() + '&location=' + $('#AttractionLocation
        // option:selected').text());

        // location.href = './listings.ejs?category=' + $(
        //     '#AttractionCategory2 option:selected'
        // ).text() + '&location=' + $('#AttractionLocation2 option:selected').text();

    });

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