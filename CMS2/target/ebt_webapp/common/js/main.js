$( document ).ready(function() {
    //modal popup
    $('.rating_btn').click(function(){
        if($(this).hasClass("pink_btn")){
            $(".eval").show();
            $('html, body').css({'overflow': 'hidden', 'height': '100%'});
            $('#wrap').on('scroll touchmove mousewheel', function(e) {
                e.preventDefault();
                e.stopPropagation();
                return false;
              });
        }
    }); 
    $(document).on("click",function(e){
        if($(".eval").is(e.target)){
            $(".eval").hide();
            $('html, body').css({'overflow': 'auto', 'height': 'auto'});
            $('#wrap').off('scroll touchmove mousewheel');
        }
    })
    $('.result_btn').click(function(){
        if($(this).hasClass("green_btn")){
            $(".result").show();
            $('html, body').css({'overflow': 'hidden', 'height': '100%'});
            $('#wrap').on('scroll touchmove mousewheel', function(e) {
                e.preventDefault();
                e.stopPropagation();
                return false;
              });
        }
    });

    $(document).on("click",function(e){
        if($(".result").is(e.target)){
            $(".result").hide();
            $('html, body').css({'overflow': 'auto', 'height': 'auto'});
            $('#wrap').off('scroll touchmove mousewheel');
        }
    })
    $('.rating_btn').click(function(){
        if($(this).hasClass("pink_btn")){
            $(".exe").show();
            $('html, body').css({'overflow': 'hidden', 'height': '100%'});
            $('#wrap').on('scroll touchmove mousewheel', function(e) {
                e.preventDefault();
                e.stopPropagation();
                return false;
              });
        }
    });
    $(document).on("click",function(e){
        if($(".exe").is(e.target)){
            $(".exe").hide();
            $('html, body').css({'overflow': 'auto', 'height': 'auto'});
            $('#wrap').off('scroll touchmove mousewheel');
        }
    })

    $(document).on("click",function(e){
        if($(".result").is(e.target)){
            $(".result").hide();
            $('html, body').css({'overflow': 'auto', 'height': 'auto'});
            $('#wrap').off('scroll touchmove mousewheel');
        }
    })
    // nav hover 
    $('.nav').mouseover(function(){
        $(".nav_txt").stop().show()
    })
    $('.nav').mouseout(function(){
        $(".nav_txt").stop().hide()
    })
    // Day1 사진 grayscale 이벤트
    $("input").change(function(){
        $(this).parent().siblings(1).children('img').css({'filter':'grayscale(100%)'});
    })
    $("input").change(function(){
        if($(this).is(":checked")){
           $(this).parent().siblings(1).children('img').css({'filter':'none'});
        }else{
            $(this).parent().siblings(1).children('img').css({'filter':'grayscale(100%)'});
        }
    });
    // 심사 이미지 체크 이벤트

    // popup
    $('.remind_btn').click(function() {
        $('.popup').addClass('on')
    });

    $('.closed_btn, .popup_black').click(function() {
        $('.popup').removeClass('on')
    });

    $('.event_popup_btn').click(function() {
        $('.event.popup').removeClass('on')
    });
    
    // mobile header
    function scrollDisable(){
        $('body').addClass('hidden').on('scroll touchmove mousewheel', function(e){
            e.preventDefault();
        });
    }
    function scrollAble(){
        $('body').removeClass('hidden').off('scroll touchmove mousewheel');
    }

    $('.nav_btn').click(function(){
        if($(this).hasClass('on')){
            $('.nav_btn').removeClass('on');
            $('.nav').removeClass('on');
            scrollAble()
        }else{
            $('.nav_btn').addClass('on');
            $('.nav').addClass('on');
            scrollDisable()
        }
    });

    anychart.onDocumentReady(function () {
       
        var data = [
             { 
                 "x": "IT", 
                 "value": 590000000, 
                 category: "Sino-Tibetan" 
            }, 
            { "x": "Python", 
            "value": 283000000, 
            category: "Indo-European" }, 
            { 
                "x": "소프트웨어", 
                "value": 544000000, 
                category: "Indo-European"
             }, 
             { 
                 "x": "JAVA", 
                 "value": 527000000, 
                 category: "Indo-European" 
                }, 
                { "x": "C++", 
                "value": 422000000,
                 category: "Afro-Asiatic" }, 
                 { "x": "HTML",
                  "value": 620000000,
                   category: "Afro-Asiatic" } ]; 
                   var chart = anychart.tagCloud(data); 
                                chart.angles([0]);
                                 chart.container("container"); // chart.getCredits().setEnabled(false); 
                                 chart.draw(); });

    // faq-
    $('.question').click(function(){
        if($(this).hasClass('on')){
            $(this).removeClass('on');
            $(this).next('.answer').removeClass('on');
        }else{
            $(this).addClass('on');
            $(this).next('.answer').addClass('on');
        }
    });
});