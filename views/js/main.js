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
        {prependTo: '#mobile-menu-wrap', allowParentLinks: true}
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
    $('.pop-up').magnificPopup({type: 'image'});

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
    $(".filter-left .category-filter .category-option .co-item label").on(
        'click',
        function () {
            if ($(this).hasClass('active')) {
                $(this).removeClass('active');
            } else {
                $(this).addClass('active');
            }
        }
    );

    $(".filter-left .rating-filter .rating-option .ro-item label").on(
        'click',
        function () {
            if ($(this).hasClass('active')) {
                $(this).removeClass('active');
            } else {
                $(this).addClass('active');
            }
        }
    );

    $(".filter-left .distance-filter .distance-option .do-item label").on(
        'click',
        function () {
            if ($(this).hasClass('active')) {
                $(this).removeClass('active');
            } else {
                $(this).addClass('active');
            }
        }
    );

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

        location.href = './listings.ejs?category=' + $(
            '#AttractionCategory option:selected'
        ).text() + '&location=' + $('#AttractionLocation option:selected').text();

    });
    $("#submit1").click(function () {
        // console.log('listings.ejs?category=' + $('#AttractionCategory1
        // option:selected').text() + '&location=' + $('#AttractionLocation1
        // option:selected').text());

        location.href = './listings.ejs?category=' + $(
            '#AttractionCategory1 option:selected'
        ).text() + '&location=' + $('#AttractionLocation2 option:selected').text();

    });

    $("#AttractionLocation").change(function () {
        var selectLocation = $('#AttractionLocation option:selected').text();

        switch (selectLocation) {
            case "서울":
                $("#mainLocalText").text("서울특별시");
                break;
            case "부산":
                $("#mainLocalText").text("부산광역시");
                break;
            case "대구":
                $("#mainLocalText").text("대구광역시");
                break;
            case "인천":
                $("#mainLocalText").text("인천광역시");
                break;
            case "광주":
                $("#mainLocalText").text("광주광역시");
                break;
            case "대전":
                $("#mainLocalText").text("대전광역시");
                break;
            case "울산":
                $("#mainLocalText").text("울산광역시");
                break;
            case "세종":
                $("#mainLocalText").text("세종특별자치시");
                break;
            case "경기":
                $("#mainLocalText").text("경기도");
                break;
            case "강원":
                $("#mainLocalText").text("강원도");
                break;
            case "충북":
                $("#mainLocalText").text("충청북도");
                break;
            case "충남":
                $("#mainLocalText").text("충청남도");
                break;
            case "전북":
                $("#mainLocalText").text("전라북도");
                break;
            case "전남":
                $("#mainLocalText").text("전라남도");
                break;
            case "경북":
                $("#mainLocalText").text("경상북도");
                break;
            case "경남":
                $("#mainLocalText").text("경상남도");
                break;
            case "제주":
                $("#mainLocalText").text("제주특별시");
                break;
        }
    });

    $('.starRev span').click(function(){
        $(this).parent().children('span').removeClass('on');
        $(this).addClass('on').prevAll('span').addClass('on');
        return false;
      });

})(jQuery);