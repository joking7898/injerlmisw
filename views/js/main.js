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
        $("#preloder").delay(200).fadeOut("slow");
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
    $(".mobile-menu").slicknav({
        prependTo: '#mobile-menu-wrap',
        allowParentLinks: true
    });

    $('.slicknav_nav ul ').prepend('<li class="header-right-warp"></li>');
    $('.header-right').clone().prependTo('.slicknav_nav > ul > .header-right-warp');

    /*----------------------
        Testimonial Slider
    -----------------------*/
    $(".testimonial-item").owlCarousel({
        loop: true,
        margin: 0,
        nav: true,
        items: 1,
        dots: false,
        navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
        smartSpeed: 1200,
        autoplay: false,
    });

    /*------------------
        Magnific Popup
    --------------------*/
    $('.pop-up').magnificPopup({
        type: 'image'
    });

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
    $(".filter-left .category-filter .category-option .co-item label").on('click', function () {
        if ($(this).hasClass('active')) {
            $(this).removeClass('active');
        }
        else {
            $(this).addClass('active');
        }
    });

    $(".filter-left .rating-filter .rating-option .ro-item label").on('click', function () {
        if ($(this).hasClass('active')) {
            $(this).removeClass('active');
        }
        else {
            $(this).addClass('active');
        }
    });

    $(".filter-left .distance-filter .distance-option .do-item label").on('click', function () {
        if ($(this).hasClass('active')) {
            $(this).removeClass('active');
        }
        else {
            $(this).addClass('active');
        }
    });

    /*-------------------
		리뷰 작성
    --------------------- */
        /*로그인 버튼*/
        $(".share-btn>a").on("click",function(){
          $("#review_f").animate({top:"20px"},500);
          return false;
        });
      
        $(".share-btn .review_close_btn, input[alt='등록버튼']")
        .on("click",function(){
          $("#review_f").animate({top:"-500px"},500);
          return false;
        });
      
        $("#rating, #content").on("focus",function(){
           $(this).prev().css("left","-9999px");
        });
      
        $("#rating, #content").on("blur",function(){
           if($(this).val()=="") $(this).prev().css("left","2px");
        });

        function showReview() {
            window.open("./review.html", "a", "width=400, height=300, left=100, top=50");
        }

})(jQuery);