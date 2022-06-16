<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ page import="java.util.*" %>    
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>디지털육종정보화시스템</title>
    <link rel="stylesheet" href="/digit/css/reset.css">
    <link rel="stylesheet" href="/digit/css/common_header.css">
    <link rel="stylesheet" href="/digit/css/phylogeneticMarker/common.css">
    <link rel="stylesheet" href="/digit/css/phylogeneticMarker/style.css">
    <link rel="stylesheet" href="/digit/css/phylogeneticMarker/media.css">
    <link rel="stylesheet" href="/digit/css/style.css">
    <link rel="stylesheet" href="/digit/css/alarm.css">
    <script src="/digit/vendor/jquery-3.6.0.js"></script>
    <script src="/digit/js/nav.js"></script>
    <script src="/digit/js/MABC_analysis/common.js"></script>
    <script src="/digit/js/alarm.js"></script>
    <style>
      #main .view {
    	justify-content: right;
	}
	
        .data_table_title_wrap .result_down_btn {
    margin-left: 20px !important;
	}

.data_table_title_wrap .result_down_btn {
    background: none;
    color: #000;
    text-decoration: underline;
    height: 20px;
    line-height: 20px;
    padding-left: 15px;
    background: url(/images/download.svg) no-repeat left center;
    width: 120px;
}

	
    </style>
</head>
<body>
    <div id="wrap_old">
        <main id="main">            
            <section class="data_table_section">
                <div class="data_table_title_wrap">
                    <h2 class="data_tqqable_title">유사도 분석 [Phylogeny analysis]</h2>
                    <a class="result_down_btn" download=""  href='/digit/${outcome.outcome_file.replace("_upgma.png", ".xlsx")}' onclick="<c:out value='DownloadBtn(${outcome.outcome_id});'/>">분석파일다운</a>
                </div>
                <!--
                <div class="data_sample_down">
                    <a download href="/upload/sampleFile/upgma_sample.csv">샘플파일다운</a>
                </div>
                -->
                <div class="mab_top_bar">
                    
                    <div class="mab_bar_right mab_bar">
                       	<form action="InsertPhylogeny" id="insertForm" method="POST" enctype="multipart/form-data">
	                        <div class="input_file_wrap">
	                            <input type="text" class="file_text" placeholder="" readonly disabled>
	                            <input id="input-file" type="file" class="addMabcFile" name="file" accept=".csv" >
	                            <div class="flie_btn_box">
	                                <label for="input-file" class="file_add">파일첨부</label>
	                                <button type="button" class="save" id="phyloSaveBtn" onclick="SaveBtn()" style="display: none;">분석저장</button>
	                            </div>
	                        </div>
						</form>
                    </div>
                    <div class="view" style="justify-content: right;">
                       <div class="commonBtn" onclick="InsertBtn()">유사도 분석실행</div>
                   </div>
                   
                </div>
                <div class="mab_chr_wrap">
                    <div class="mab_chr_wrap_center">
                        <div class="btn_all_box">
                        
                        	<div style="display:flex;">
			                    <select class="downloadSelectBox" id="select_file" onchange="onChangeSelect()">
			                        <option value="0" disabled="" selected="" hidden="">파일 선택</option>
			                        <option value="1">표준형트리</option>
			                    </select>
			                    
	                            <div class="commonBtn download">
	                            	<a download="upgma.png" id="downloadImg" onclick="<c:out value='DownloadBtn(${outcome.outcome_id});'/>">내려받기</a>
	                            </div>
                        	</div>
                            
                            
                            <div class="btn_all_box_content"><center>
                                <img alt="" id="result_img" src="" style="max-width: 50%;">
                               <!--<img style="max-width: 35%;" id="result_img2" alt="" src="">-->
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    </div>
</body>
  
<div class="popAlert" id="alert" style="display:none;"> <!-- alert 호출방법은 return Alert('내용')으로 하시면 됩니다 !! return 필수-->
    <div class="alert_table">
        <div class="alert_inner">
            <div class="alert_cover">
                <div class="title_text"></div>
                <button type="button">확인</button>
            </div>
        </div>
    </div>
</div>

<div class="popAlert" id="confirm" style="display:none;">
    <div class="alert_table">
        <div class="alert_inner">
            <div class="alert_cover">
                <div class="title_text"></div>
                <div class="btn_box">
                    <button type="button" id="ok_button" onclick="return true">확인</button>
                    <button type="button" id="no_button">취소</button>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="load_wrap">
    <div class="load">
        <h2>잠시만 기다려주세요</h2>
        <div class="loader"></div>
    </div>
</div>
<div class="dim" style="display:none"></div>
<script type="text/javascript">

    //해당 페이지 탭 active css 주기
    var pathname = window.location.pathname;
    var pathArray = pathname.split("/");
    $("#"+pathArray[1]).addClass("active");
    if(pathArray[2] != null){
        $("."+pathArray[2]).addClass("active");
    }
    
    function InsertBtn()
	{
    	
    	
		var data = new FormData($("#insertForm")[0]);
		
		if(document.getElementById("input-file").files.length == 0){
			alert("파일을 첨부해주세요");
			return;
		}
		
		
		var loading = document.querySelector('.load_wrap');
		loading.classList.add('on');
		
		$.ajax(
		{
			url : "insertPhylogeny",
			type : "POST",
			data : data,
			cache : false,
			contentType : false,
			processData : false,
			xhr: function()
			{
				var xhr = $.ajaxSettings.xhr();
				
				xhr.upload.onprogress = function(e)
				{
					//progress 이벤트 리스너 추가
					var percent = parseInt(e.loaded * 100 / e.total);
					
					document.getElementsByClassName("load")[0].children[0].innerHTML = "잠시만 기다려주세요.<br/>" + percent + "% 진행중입니다.";
					
					if(percent == 100)
					{
						document.getElementsByClassName("load")[0].children[0].innerHTML = "잠시만 기다려주세요.<br/>분석 진행중입니다.";
					}
				};
				
				return xhr;
			},
			success : function(result)
			{
				loading.classList.remove('on');
				
				_url = result + "_upgma_1.png";
				_url2 = result + "_upgma_2.png";
				
				$("#result_img").attr("src", result + "_upgma_1.png");
				$("#result_img2").attr("src", result + "_upgma_2.png");
				$("#result_file").attr("href", result + "_upgma.png");
				$("#outcome_file").val(result);
				
				$(".download").css("display", "block");
				$("#download_file").attr("href", result + "_upgma.png");
			
				document.querySelector("#select_file").style.display="unset";
				
				$("#phyloSaveBtn").css("display", "block");
				$("#memo").css("display", "flex");
				
		    	$.ajax(
    			{
    				url : "insertAnalysis",
    				method : "POST",
    				dataType : "json",
    				data : {"type" : 4},
    				success : function()
    				{
    				}
    			});
			},
			error : function(e)
			{
				loading.classList.remove('on');
				
				console.log(e);
			}
		});
	}

    function Alert(text){ //popup

        $("#alert").show();
        $(".dim").show();
        $("#alert .title_text").text(text);

        $("#alert button").click(function(){
        	$("#alert, .dim").hide();
		 
            //return location.reload();
        });
        return false;
    }

    function Alert1(text){ //popup

        $("#alert").show();
        $(".dim").show();
        $("#alert .title_text").text(text);

        $("#alert button").click(function(){
            $("#alert, .dim").hide();
        });
    }
    
    function clearScreen(){
    	Alert('스크린이 초기화되었습니다')
    }
    
   	var _url = '${outcome.outcome_file.replace("_upgma.png", "_upgma_1.png")}';
   	var _url2 = '${outcome.outcome_file.replace("_upgma.png", "_upgma_2.png")}';
   	var _url3 = '${outcome.outcome_file.replace("_upgma.png", "_upgma_list.csv")}';
    function runScreen(){
    	
    	document.getElementById("result_img").src = '/' + _url;
    	document.getElementById("result_img2").src = '/' + _url2;
    }
    
    runScreen();
    
    function DownloadBtn(e)
    {
		$.ajax(
		{
			url : "updateOutcomeFileStatus",
			method : "POST",
			dataType : "json",
			data : {"outcome_id" : e},
			success : function()
			{
			}
		});
    }   
    
    function onChangeSelect(){
    	
    	var select_file = document.querySelector("#select_file");
    	var selectText = select_file.options[select_file.selectedIndex].innerText;
		
		var downloadImg = document.querySelector("#downloadImg");;
		if(selectText == "표준형트리"){
			downloadImg.setAttribute("download", "upgma.png")
			downloadImg.setAttribute("href", _url)
		}else if(selectText == "방사형트리"){
			downloadImg.setAttribute("download", "upgma.png")
			downloadImg.setAttribute("href", _url2)
		}else{
			downloadImg.setAttribute("download", "upgma_list.csv")
			downloadImg.setAttribute("href", _url3)
			return;
		}

		
    }
</script>
</html>