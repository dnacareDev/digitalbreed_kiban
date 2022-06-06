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
</head>
<body>
    <div id="wrap_old">
        <main id="main">            
            <section class="data_table_section">
                <div class="data_table_title_wrap">
                    <h2 class="data_tqqable_title">유사도 분석 [Phylogeny analysis]</h2>
                </div>
                <div class="data_sample_down">
                    <a download href="/digit/upload/sampleFile/(업로드용)토마토-유사도분석_예제파일.xlsx">샘플파일다운(샘플화일:토마토)</a>
                </div>
                <div class="mab_top_bar">
                    <div class="mab_bar_right mab_bar">
                    	<form action="InsertPhylogeny" id="insertForm" method="POST" enctype="multipart/form-data">
	                        <div class="input_file_wrap">
	                            <input type="text" class="file_text" placeholder="" readonly disabled>
	                            <input id="input-file" type="file" class="addMabcFile" name="file" accept=".xlsx">
	                            <div class="flie_btn_box">
	                                <label for="input-file" class="file_add">파일첨부</label>
	                            </div>
	                        </div>
						</form>
						<div class="memo_wrap">
							<div id="memo" style="display: none;">
								<span class="memo_text">메모</span>
								<input type="text" id="outcome_comment">
							</div>
                            <button type="button" class="save" id="phyloSaveBtn" onclick="SaveBtn()" style="display: none;">분석저장</button>
						</div>
                    </div>
                    <div class="view" style="justify-content: right;">
                        <div class="commonBtn" onclick="InsertBtn()">유사도 분석실행</div>
                    </div>
                </div>
                <div class="mab_chr_wrap">
                    <div class="mab_chr_wrap_center">
                        <div class="btn_all_box">
                        	<div style="display:flex;">
	               				<select class="downloadSelectBox" id="select_file" style="display:none" onchange="onChangeSelect()">
			                        <option value="0" disabled="" selected="" hidden="">파일 선택</option>
			                        <option value="1">표준형트리</option>
			                        <option value="2">방사형트리</option>
			                    </select>
				                    
	                            <div class="commonBtn download" style="display: none; text-align: center">
	                            	<!-- <a download="upgma.png" href="" id="download_file">내려받기</a> -->
	                            	<a download="upgma.png" id="downloadImg">내려받기</a>
	                            </div>
                            </div>
                            
                            <div class="btn_all_box_content">
                                <img alt="" id="result_img" src="" style="max-width: 35%;">
                                <img alt="" id="result_img2" src="" style="max-width: 35%;">
                            </div>
                        </div>
                    </div>
                </div>
                <input type="hidden" id="user_username" value="<c:out value='${user.user_username}'/>">
                <input type="hidden" id="outcome_file">
            </section>
        </main>
    </div>
    
	<div class="load_wrap">
	    <div class="load">
	        <h2>잠시만 기다려주세요</h2>
	        <div class="loader"></div>
	    </div>
	</div>
</body>
<script type="text/javascript">
	var _url = "";
	var _url2 = "";
	
	function InsertBtn()
	{	
		if(document.getElementById("input-file").files.length == 0)
		{
			alert("파일을 첨부해주세요");
			
			return;
		}

		var data = new FormData($("#insertForm")[0]);
		
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
	
	function SaveBtn()
	{
		var user_username = $("#user_username").val();
		var outcome_file = $("#outcome_file").val();
		var outcome_comment = $("#outcome_comment").val();
		
		if(outcome_file == "")
		{
			alert("저장할 결과가 없습니다.")
		}
		else
		{
			var data = {"user_username" : user_username, "outcome_file" : outcome_file, "outcome_type" : 4, "outcome_comment" : outcome_comment};
			
			$.ajax(
			{
				url : "insertNewOutcome",
				type : "POST",
				data : data,
				success : function(result)
				{
					if(result == 0)
					{
						alert("저장에 실패하였습니다.");
					}
					else
					{
						alert("저장되었습니다.");
						
						location.href = "/digit/phylogeny";
					}
				},
				error : function(e)
				{
					console.log(e);
				}
			});
		}
	}
	
    function onChangeSelect(){
    	
    	var select_file = document.querySelector("#select_file");
    	var selectText = select_file.options[select_file.selectedIndex].innerText;
		
		var downloadImg = document.querySelector("#downloadImg");;
		if(selectText == "표준형트리"){
			downloadImg.setAttribute("href", _url)
		}else if(selectText == "방사형트리"){
			downloadImg.setAttribute("href", _url2)
		}else{
			return;
		}

		
    }
</script>
</html>