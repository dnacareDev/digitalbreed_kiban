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
    <link rel="stylesheet" href="css/reset.css">
    <link rel="stylesheet" href="css/common_header.css">
    <link rel="stylesheet" href="css/QTL_marker/common.css">
    <link rel="stylesheet" href="css/QTL_marker/style.css">
    <link rel="stylesheet" href="css/QTL_marker/media.css">
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/grid.css">
    <link rel="stylesheet" href="css/alarm.css">
    <script src="js/grid.js"></script>
    <script src="js/nav.js"></script>
    <script src="vendor/jquery-3.6.0.js"></script>
    <script src="js/MABC_analysis/common.js"></script>
    <script src="js/alarm.js"></script>
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
  </style>
    <style>
      #main .view {
    	justify-content: right;
	}
    </style>
</head>
<body>
    <div id="wrap">
        <div class="tb_blank"></div>
		<header id="header">
			<div class="logo">
				<a href="home">
					<img class="logo_img" src="images/logo.png" alt="로고">
				</a>
			</div>
			<nav id="nav">
                <ul class="out_list_wrap">
                    <li class="out_list">
                        <p class="out_list_text">Digital breeding System</p>
                        <ul class="inner_list_wrap">
                            <li class="inner_list">
                                <a class="list_link" href="karyotype_list">염색체 시각화 <span>[Draw karyotype]</span></a>
                            </li>
                            <li class="inner_list">
                                <a class="list_link" href="map">마커 맵 <span>[Draw maker map]</span></a>
                            </li>
                            <li class="inner_list">
                                <a class="list_link" href="polymorphic">다형성 마커 <span>[Polymorphic maker map]</span></a>
                            </li>
                            <li class="inner_list">
                                <a class="list_link" href="mabc_list">MABC 분석 <span>[MABC analysis]</span></a>
                            </li>
                            <li class="inner_list">
                                <a class="list_link" href="phylogeny">유사도 분석 <span>[Phylogeny analysis]</span></a>
                            </li>
                            <li class="inner_list">
                                <a class="list_link" href="specificmaker">계통구분용 마커 <span>[Line specific maker]</span></a>
                            </li>
                            <li class="inner_list">
                                <a class="list_link" href="qtl">QTL 분석 <span>[QTL analysis]</span></a>
                            </li>
                            <li class="inner_list">
                                <a class="list_link" href="ngs_list">NGS MABC <span>[NGS MABC]</span></a>
                            </li>
                            <li class="inner_list">
                                <a class="list_link" href="snp_list">SNP 분석 <span>[SNP analysis]</span></a>
                            </li>
                        </ul>
                    </li>
                    <c:if test="${user.user_type == 0}">
	                    <li class="out_list">
	                        <p class="out_list_text">Data management</p>
	                        <ul class="inner_list_wrap">
	                            <li class="inner_list">
	                                <a class="list_link" href="marker_list">유전체 및 마커정보 데이터 베이스 관리</a>
	                            </li>
	                            <li class="inner_list">
	                                <a class="list_link" href="result_list">결과 데이터 관리</a>
	                            </li>
	                        </ul>
	                    </li>
	                    <li class="out_list">
	                        <a class="list_link" href="manage_list">
	                            <p class="out_list_text">System management</p>
	                        </a>
	                    </li>
                    </c:if>
                </ul>
			</nav>
		</header>
        <main id="main">
            <div class="user_header">
                <div class="search_wrap">
                    <div class="tb_menu_btn">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
                <ul class="ui_list_wrap">
                    <li class="ui_list">${user.user_username}</li>
                    <li class="ui_list alarm">
                   		<!-- 알람 갯수 => alarm_on에 on 클라스로 활성화 비활성화 -->
						<span class="alarm_on on">${fn:length(notice)}</span>
						<div class="alarm_box">
							<!-- 알람 팝업의 제목 => alarm_num에 alarm_on의 갯수 일치 -->
							<h2 class="alarm_title">
								분석 완료 &#40;<span class="alarm_num">${fn:length(notice)}</span>&#41;
							</h2>
							<ul class="alram_list_box">
								<!-- 알림 목록 리스트 요소 -->
								<c:forEach var="n" items="${notice}">
									<li class="alram_list">
										<!-- 리스트 클릭시 페이지 이동 -->
										<c:choose>
											<c:when test="${n.outcome_type eq 1}"><a class="alram_link" href="map"></c:when>
											<c:when test="${n.outcome_type eq 2}"><a class="alram_link" href="polymorphic"></c:when>
											<c:when test="${n.outcome_type eq 3}"><a class="alram_link" href="mabc_list"></c:when>
											<c:when test="${n.outcome_type eq 4}"><a class="alram_link" href="phylogeny"></c:when>
											<c:when test="${n.outcome_type eq 5}"><a class="alram_link" href="specificmaker"></c:when>
											<c:when test="${n.outcome_type eq 6}"><a class="alram_link" href="qtl"></c:when>
											<c:when test="${n.outcome_type eq 7}"><a class="alram_link" href="ngs_list"></c:when>
											<c:when test="${n.outcome_type eq 8}"><a class="alram_link" href="snp_list"></c:when>
										</c:choose>
										<span class="alram_date">${n.create_date}</span>
										<p class="alram_title alram_text">분석 완료</p>
										<p class="alram_Ad alram_text">분석 구분:
										<c:choose>
											<c:when test="${n.outcome_type eq 1}">마커 맵</c:when>
											<c:when test="${n.outcome_type eq 2}">다형성 마커</c:when>
											<c:when test="${n.outcome_type eq 3}">MABC 분석</c:when>
											<c:when test="${n.outcome_type eq 4}">유사도 분석</c:when>
											<c:when test="${n.outcome_type eq 5}">계통구분용 마커</c:when>
											<c:when test="${n.outcome_type eq 6}">QTL 분석</c:when>
											<c:when test="${n.outcome_type eq 7}">NGS MABC</c:when>
											<c:when test="${n.outcome_type eq 8}">SNP 분석</c:when>
										</c:choose>
										</p>
										<p class="alram_Ad alram_text">전달 사항:
											<span class="alram_chief">${n.outcome_comment}</span>
										</p>
										</a>
									</li>
								</c:forEach>
							</ul>
							<div class="alram_footer">
								<a class="sc_status">일정 현황</a>
							</div>
						</div>
                    </li>
                    <li class="ui_list" onclick="location.href='/logout'"></li>
                </ul>
            </div>
            <section class="data_table_section">
                <div class="data_table_title_wrap">
                    <h2 class="data_table_title">QTL 분석 [QTL analysis]</h2>
                </div>
                <div class="data_sample_down">
                    <a download href="/upload/sampleFile/qtl_sample.csv">샘플파일다운</a>
                </div>
                <div class="mab_top_bar">
                    <div class="mab_bar_right mab_bar">
                    	<form action="InsertQTL" id="insertForm" method="POST" enctype="multipart/form-data">
	                        <div class="input_file_wrap">
	                            <input type="text" class="file_text" placeholder="" readonly disabled>
	                            <input id="input-file" type="file" class="addMabcFile" name="file" onchange="console.log(this.files)">
	                            <div class="flie_btn_box">
	                                <label for="input-file" class="file_add">파일첨부</label>
	                                <button type="button" class="save" id="qtlSaveBtn" onclick="SaveBtn()" style="display: none;">분석저장</button>
	                            </div>
	                        </div>
                        </form>
                    </div>
                    <div class="view">
                        <div class="commonBtn" onclick="InsertBtn()">QTL 분석실행</div>
                    </div>
                </div>
                
          
                <div class='download_btn_wrap'>
                   <select class="downloadSelectBox" id="select_file">
                        <option value="0" disabled selected hidden>파일 선택</option>
                        <option value="1">table</option>
                        <option value="2">map</option>
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
                
                
                
                <input type="hidden" id="user_username" value="${user.user_username}">
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
<script>

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

</script>
<script type="text/javascript">
	function InsertBtn()
	{
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
						document.getElementsByClassName("load")[0].children[0].innerHTML = "잠시만 기다려주세요.<br/>분석 준비중입니다.";
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
				
				console.log(e);
			}
		});
	}
	
	function SaveBtn()
	{
		var user_username = $("#user_username").val();
		var outcome_file = $("#outcome_file").val();
		
		if(outcome_file == "")
		{
			alert("저장할 결과가 없습니다.")
		}
		else
		{
			var data = {"user_username" : user_username, "outcome_file" : outcome_file, "outcome_type" : 6};
			
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