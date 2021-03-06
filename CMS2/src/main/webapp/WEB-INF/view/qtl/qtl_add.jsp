<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ page import="java.util.*" %>    
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>디지털육종정보화시스템</title>
    <link rel="stylesheet" href="/digit/css/reset.css">
    <link rel="stylesheet" href="/digit/css/common_header.css">
    <link rel="stylesheet" href="/digit/css/QTL_marker/common.css">
    <link rel="stylesheet" href="/digit/css/QTL_marker/style.css">
    <link rel="stylesheet" href="/digit/css/QTL_marker/media.css">
    <link rel="stylesheet" href="/digit/css/style.css">
    <link rel="stylesheet" href="/digit/css/grid.css">
    <link rel="stylesheet" href="/digit/css/alarm.css">
    <script src="/digit/vendor/jquery-3.6.0.js"></script>
    <script src="/digit/js/grid.js"></script>
    <script src="/digit/js/nav.js"></script>
    <script src="/digit/js/MABC_analysis/common.js"></script>
    <script src="/digit/js/alarm.js"></script>
    <style>
        .card {
            box-shadow: 0 3px 20px 3px rgb(0 0 0 / 7%);
        }

        table {
            border-top: 1px solid grey;
            border-collapse: collapse;
        }

        th, td {
            border-bottom: 2px solid #E5E9F2;
            padding: 10px;
            text-align: center;
            font-weight: initial;
        }

        th, tbody tr {
            background-color: white;
        }
      #main .view {
    	justify-content: right;
	}
    </style>
</head>
<body>
    <div id="wrap_old">

        <main id="main">

            <section class="data_table_section">
                <div class="data_table_title_wrap">
                    <h2 class="data_tqqable_title">QTL 분석 [QTL analysis]</h2>
                </div>
                <div class="data_sample_down">
                    <a download href="/digit/upload/sampleFile/(업로드용)멜론_qtl_예제파일.csv">샘플파일다운(샘플작목:멜론)</a>
                </div>
                <div class="mab_top_bar">
                    <div class="mab_bar_right mab_bar">
						<form action="InsertQTL" id="insertForm" method="POST" enctype="multipart/form-data">
                    	
	                        <div class="input_file_wrap">
	                            <input type="text" class="file_text" placeholder="" readonly disabled>
	                            <input id="input-file" name="input-file" type="file" class="addMabcFile" name="file" accept=".xlsx" >
	                            <div class="flie_btn_box">
	                                <label for="input-file" class="file_add">파일첨부</label>
	                            </div>	
								<div class="memo_wrap_lod">
	                               <div id="memo_lod" >
		                                <span class="memo_text_lod">LOD</span>
		                            	<input type="text" name="lod" id="lod">
	                               </div>
	                           </div>	                                                        
                              	<div class="memo_wrap">
	                               <div id="memo" style="display: none;">
		                                <span class="memo_text">메모</span>
		                            	<input type="text" id="outcome_comment">
	                               </div>
	                                <button type="button" class="save" id="qtlSaveBtn" onclick="SaveBtn()" style="display: none;">분석저장</button>
	                           </div>
	                        </div>
                        </form>
                    </div>
                    <div class="view">
                        <div class="commonBtn" onclick="InsertBtn()">QTL 분석실행</div>
                    </div>
                </div>
                
          
                <div class='download_btn_wrap' style="display:none;">
                   <select class="downloadSelectBox" id="select_file">
                        <option value="0" disabled selected hidden>파일 선택</option>
                        <option value="1">map</option>
                        <option value="2">table</option>
                    </select>
                    <div style="margin-right: auto; margin-left:10px;" class="commonBtn download" onclick="onClickDownload()">내려받기</div>                            
                </div>
                
                 <div class="mab_chr_wrap" style="width: 100%;display: flex;">
                    <div class="mab_chr_wrap_left" style="overflow-y: scroll; width:calc(50% - 10px); margin-right:10px;">  <!-- 그래프1 -->
						<img style="max-width: 90%;" id="result-img" src="">
                    </div>
                    <div class="mab_chr_wrap_left mab_chr_wrap_right" style="margin-left:10px; overflow-y: scroll; width:calc(50% - 10px); height: 560px;"> 
						<div id="grid1" style="margin-top:50px;"></div>
                    </div>
               	</div>
                
                <input type="hidden" id="user_username" value="<c:out value='${user.user_username}'/>">
                <input type="hidden" id="outcome_file">
                <input type="hidden" id="url">
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
	async function initTable(url){
		
		let response = await fetch(url);
	    let data = await response.blob();
	    let metadata = {
	      type: "text/csv"
	    };
	    let file = new File([data], "qtl.csv", metadata);
		  
		getText(file);
	}
	
	function initImage(url){
		document.getElementById("result-img").src = url;
	}
	
	function handleFiles(files)
	{
		if (window.FileReader)
		{
			getText(files[0]);
		}
		else
		{
			alert('FileReader are not supported in this browser.');
		}
	}
	
	
	function getText(fileToRead) {
	    var reader = new FileReader(); 
	    reader.readAsText(fileToRead);
	    reader.onload = loadHandler;
	    reader.onerror = errorHandler;
	}
	
	function loadHandler(event) {
	    var csv = event.target.result;
	    process(csv);
	}
	
	async function process(csv) {
	
		var lines = csv.split("\n");
	
	    result = [];
	    var headers = lines[0].split(",");
	    var headerTag = "";
	    var columns =  []
	    var datas = [];
	    for(var i =0;i<headers.length;i++){
	    	columns.push({
	    		header : headers[i].replace(/"/gi,""), 
	    		name : i,
	    		align: 'center'
	    	})
	    }
	 
	    for (var i = 1; i < lines.length - 1; i++) {
			var words = lines[i].split(",");
	
	        var resultTag = "";
	        
	        var tempOb = {};
			for(var j =0;j<words.length;j++){
				tempOb[j] = words[j].replace(/"/gi,"");
	    	}
	    	datas.push(tempOb);
	    }
	
	    var Grid = tui.Grid;
	    const grid = new Grid({
	        el: document.getElementById('grid1'),
	        columns:columns, 
	        data: datas
	    });
	    
	    Grid.applyTheme('striped'); 
	
	}
	
	function errorHandler(evt) {
	if (evt.target.error.name == "NotReadableError") {
	    alert("Canno't read file !");
	}
	}

	function InsertBtn()
	{
	
		if(document.getElementById("input-file").files.length == 0){
			alert("파일을 첨부해주세요");
			return;
		}
		
	
		var data = new FormData($("#insertForm")[0]);
		
		var loading = document.querySelector('.load_wrap');
		loading.classList.add('on');
			
		
		$.ajax(
		{
			url : "insertQTL",
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
				
				initImage(result + "_qtl.png");
				initTable(result + "_qtl.csv");
				// document.getElementById("qtl_download").setAttribute("href", result + "_qtl.png");
				
				$(".mab_chr_wrap").css("display", "flex");
				
				$("#outcome_file").val(result);
				
				$("#qtlSaveBtn").css("display", "block");
				$("#memo").css("display", "flex");
				
				
				document.getElementsByClassName("download_btn_wrap")[0].style.display = "flex";
		    	$.ajax(
    			{
    				url : "insertAnalysis",
    				method : "POST",
    				dataType : "json",
    				data : {"type" : 6},
    				success : function()
    				{
    				}
    			});
			},
			error : function(e)
			{
				loading.classList.remove('on');
				
			}
		});
	}
	
	function SaveBtn()
	{
		var user_username = $("#user_username").val();
		var outcome_file = $("#outcome_file").val();
		var outcome_comment = $("#outcome_comment").val();
		var lod = $("#lod").val();

		if(outcome_file == "")
		{
			alert("저장할 결과가 없습니다.")
		}
		else
		{
			var data = {"user_username" : user_username, "outcome_file" : outcome_file, "outcome_type" : 6, "outcome_comment" : outcome_comment, "lod" : lod};
			
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
						
						location.href = "/digit/qtl";
					}
				},
				error : function(e)
				{
					console.log(e);
				}
			});
		}
	}
	
    function onClickDownload()
    {
    	var select_file = $("#select_file").val();
    	
    	if(select_file == 0)
    	{
    		alert("내려받을 파일을 선택하세요.");
    	}
    	else
    	{
    		let a = document.createElement('a');
	    	a.style.display = 'none';
	    	
	    	var a_url = $("#outcome_file").val();
	    	
	    	if(select_file == 1)
	    	{
	    		a.setAttribute("download", "qtl.png");
		    	a.href = a_url + "_qtl.png";
	    	}
	    	else if(select_file == 2)
	    	{
	    		a.setAttribute("download", "qtl.csv");
		    	a.href = a_url + "_qtl.csv";
	    	}
	    	
	    	document.body.appendChild(a);
	    	a.click();
    	}
    }
</script>
</html>