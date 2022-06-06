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
    <link rel="stylesheet" href="/digit/css/style.css">
    <link rel="stylesheet" href="/digit/css/common.css">
    <link rel="stylesheet" href="/digit/css/common_header.css">
    <link rel="stylesheet" href="/digit/css/snp_analysis/common.css">
    <link rel="stylesheet" href="/digit/css/snp_analysis/style.css">
    <link rel="stylesheet" href="/digit/css/snp_analysis/media.css">
    <link rel="stylesheet" href="/digit/css/grid.css">
    <link rel="stylesheet" href="/digit/css/alarm.css">
    <script src="/digit/vendor/jquery-3.6.0.js"></script>
    <script src="/digit/js/grid.js"></script>
    <script src="/digit/js/snp/common.js"></script>
    <script src="/digit/js/nav.js"></script>
    <script src="/digit/js/alarm.js"></script>
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
			<div class="logo1">
				<a href="/digit/home"><img src='./images/logo.png' width="100%"></a>
			</div>
			<nav id="nav">
                <ul class="out_list_wrap">
                    <li class="out_list">
                        <p class="out_list_text">디지털분석시스템</p>
						<c:if test="${user.user_type != 0}">
                       		 <ul class="inner_list_wrap">
                       	 </c:if>
                       	 <c:if test="${user.user_type == 0}">
                       		 <ul class="inner_list_wrap_admin">
                       	 </c:if>							
                            <li class="inner_list">
                                <a class="list_link" href="/digit/karyotype_list" style="text-indent: 1em;">염색체 시각화</a>
                            </li>
                            <li class="inner_list">
                                <a class="list_link" href="/digit/map" style="text-indent: 1em;">분자표지 맵</a>
                            </li>
                            <li class="inner_list">
                                <a class="list_link" href="/digit/polymorphic" style="text-indent: 1em;">다형성 분자표지</a>
                            </li>
                            <li class="inner_list">
                                <a class="list_link" href="/digit/mabc_list" style="text-indent: 1em;">MABC 분석</a>
                            </li>
                            <li class="inner_list">
                                <a class="list_link" href="/digit/phylogeny" style="text-indent: 1em;">유사도 분석</a>
                            </li>
                            <li class="inner_list">
                                <a class="list_link" href="/digit/specificmaker" style="text-indent: 1em;">계통구분용 분자표지</a>
                            </li>
                             <c:if test="${user.user_type == 0}">
								<li class="inner_list">
									<a class="list_link" href="/digit/qtl" style="text-indent: 1em;">QTL 분석</a>
								</li>							
								<li class="inner_list">
									<a class="list_link" href="/digit/ngs_list" style="text-indent: 1em;">NGS MABC</a>
								</li>
								<li class="inner_list">
									<a class="list_link" href="/digit/snp_list" style="text-indent: 1em;">SNP 분석</a> 
								</li>
							 </c:if>
                        </ul>
                    </li>
                    <c:if test="${user.user_type == 0}">
	                    <li class="out_list">
	                        <p class="out_list_text">데이터관리</p>
	                        <ul class="inner_list_wrap">
	                            <li class="inner_list">
	                                <a class="list_link" href="/digit/marker_list" style="text-indent: 1em;">유전체 및 분자표지 데이터 베이스 관리</a>
	                            </li>
	                            <li class="inner_list">
	                                <a class="list_link" href="/digit/result_list" style="text-indent: 1em;">결과 데이터 관리</a>
	                            </li>
	                        </ul>
	                    </li>
	                    <li class="out_list">
	                        <a class="list_link" href="/digit/manage_list">
	                            <p class="out_list_text">System management</p>
	                        </a>
	                    </li>
                    </c:if>
                    <li class="out_list">
	                        <a class="list_link" href="/digit/userresult_list">
	                            <p class="out_list_text">사용자 결과 데이터 관리</p>
	                        </a>
					</li>
                </ul>
			</nav>
		</header>
        <main id="main" data="<c:out value='${outcome.outcome_file}'/>">
            <div class="user_header">
                <div class="search_wrap">
                    <div class="tb_menu_btn">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
                <ul class="ui_list_wrap">
                    <li class="ui_list"><c:out value="${user.user_username}"/></li>
                    <li class="ui_list alarm">
                   		<!-- 알람 갯수 => alarm_on에 on 클라스로 활성화 비활성화 -->
						<span class="alarm_on on"><c:out value="${fn:length(notice)}"/></span>
						<div class="alarm_box">
							<!-- 알람 팝업의 제목 => alarm_num에 alarm_on의 갯수 일치 -->
							<h2 class="alarm_title">
								분석 완료 &#40;<span class="alarm_num"><c:out value="${fn:length(notice)}"/></span>&#41;
							</h2>
							<ul class="alram_list_box">
								<!-- 알림 목록 리스트 요소 -->
								<c:forEach var="n" items="${notice}">
									<li class="alram_list">
										<!-- 리스트 클릭시 페이지 이동 -->
										<c:choose>
											<c:when test="${n.outcome_type eq 1}"><a class="alram_link" href="/digit/map"></c:when>
											<c:when test="${n.outcome_type eq 2}"><a class="alram_link" href="/digit/polymorphic"></c:when>
											<c:when test="${n.outcome_type eq 3}"><a class="alram_link" href="/digit/mabc_list"></c:when>
											<c:when test="${n.outcome_type eq 4}"><a class="alram_link" href="/digit/phylogeny"></c:when>
											<c:when test="${n.outcome_type eq 5}"><a class="alram_link" href="/digit/specificmaker"></c:when>
											<c:when test="${n.outcome_type eq 6}"><a class="alram_link" href="/digit/qtl"></c:when>
											<c:when test="${n.outcome_type eq 7}"><a class="alram_link" href="/digit/ngs_list"></c:when>
											<c:when test="${n.outcome_type eq 8}"><a class="alram_link" href="/digit/snp_list"></c:when>
										</c:choose>
										<span class="alram_date"><c:out value="${n.create_date}"/></span>
										<p class="alram_title alram_text">분석 완료</p>
										<p class="alram_Ad alram_text">분석 구분:
										<c:choose>
											<c:when test="${n.outcome_type eq 1}">분자표지 맵</c:when>
											<c:when test="${n.outcome_type eq 2}">다형성 분자표지</c:when>
											<c:when test="${n.outcome_type eq 3}">MABC 분석</c:when>
											<c:when test="${n.outcome_type eq 4}">유사도 분석</c:when>
											<c:when test="${n.outcome_type eq 5}">계통구분용 분자표지</c:when>
											<c:when test="${n.outcome_type eq 6}">QTL 분석</c:when>
											<c:when test="${n.outcome_type eq 7}">NGS MABC</c:when>
											<c:when test="${n.outcome_type eq 8}">SNP 분석</c:when>
										</c:choose>
										</p>
										<p class="alram_Ad alram_text">전달 사항:
											<span class="alram_chief"><c:out value="${n.outcome_comment}"/></span>
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
                    <li class="ui_list" onclick="location.href='/digit/logout'"></li>
                </ul>
            </div>
            <section class="data_table_section">
                <div class="data_table_title_wrap">
                    <h2 class="data_table_title">SNP 분석 [SNP analysis]</h2>
                    <!-- <a download href="/digit/dataFile/test_MABC.xlsx">결과파일다운</a> -->
                </div>
                <div class="mab_top_bar detail_mab_bar">
                    <div class="mab_bar_left mab_bar">
                        <div class="select_box">
                            <div class="select_wrap">
                                <span class="data_name">작목</span>
                                <select class="type_select" disabled>
                                    <option value=""><c:out value="${outcome.marker_crop}"/></option>
                                </select>
                            </div>
                            <div class="select_wrap">
                                <span class="data_name">유전체 DB 버전</span>
                                <select class="type_select_info" disabled>
                                    <option value=""><c:out value="${outcome.marker_version}"/></option>
                                </select>
                            </div>
                            <!-- div class="select_wrap">
                                <span class="data_name"></span> 
                                <button style="padding: 0;" class="save" onclick="clearScreen()">초기화</button>
                            </div -->
                        </div>
                  	</div>
                    
                    <div class="mab_bar_right mab_bar" style="display:none;">
                        <div class="add_file_box">
                            <div class="select_wrap input_mab_wrap">
                                <span>Raw read 업로드</span>
                                <input type="text" placeholder="상품명을 입력해주세요">
                            </div>
                            <div class="input_file_wrap">
                                <div class="input_wrap">
                                    <input type="text" class="file_text" placeholder="업로드할 파일(*_1.fastq)을 선택해주세요" readonly disabled >
                                    <input id="input-file1" type="file" class="addMabcFile" onchange="readExcel()">
                                </div>
                                <div class="flie_btn_box">
                                    <label for="input-file1" class="file_add comm_btn">파일첨부</label>
                                </div>
                            </div>
                            <div class="input_file_wrap">
                                <div class="input_wrap">
                                    <input type="text" class="file_text" placeholder="업로드할 파일(*_1.fastq)을 선택해주세요" readonly disabled >
                                    <input id="input-file2" type="file" class="addMabcFile" onchange="readExcel()">
                                </div>
                                <div class="flie_btn_box">
                                    <label for="input-file2" class="file_add comm_btn">파일첨부</label>
                                </div>
                            </div>
                        </div>
                        <button type="button" class="sample_add_btn">+</button>
                    </div>
                    
                    <div class="view view_box">
                        <!-- div class="commonBtn" onclick="onClickRun()">분석실행</div -->	
                    </div>
                    <p class="give_info snp_give_info"><c:out value="${outcome.marker_credit}"/></p>
                </div>
                <div class='download_btn_wrap'>
                   <select class="downloadSelectBox" id="select_file">
	                    <option disabled selected hidden value="0">파일 선택</option>
	                	<option value="1">Raw Data 통계치</option>
	                	<option value="2">전처리 결과</option>
	                	<option value="3">Mapping 결과</option>
	                	<option value="4">데이터 결과</option>
	                	<!-- option value="5">전체파일</option -->
                    </select>
                    <div style="margin-right: auto; margin-left:10px;" class="commonBtn download" onclick="<c:out value='onClickDownload(${outcome.outcome_id})'/>'">내려받기</div>                            
        		 </div>
			    <!-- <div style="margin-bottom: 20px; bottom: 10px;" class="commonBtn" download onclick="onClickDownload()">내려받기</div> -->
			    
                <div class="mab_chr_wrap">
                    <div class="mab_chr_wrap_left" style="overflow-y: scroll; width: 100%;">  <!-- 그래프1 -->
                    	<h1>Raw Data 통계치</h1>
						<div id="grid1" style="margin-top:20px; margin-bottom: 10px;"></div>
						<h1>전처리 결과</h1>
						<div id="grid2" style="margin-top:20px; margin-bottom: 10px;"></div>
						<h1>Mapping 결과</h1>
						<div id="grid3" style="margin-top:20px; margin-bottom: 10px;"></div>
                    </div>
                    <div class="mab_chr_wrap_left" style="overflow-y: scroll; width: 100%;"> 
                    	<h1>데이터 결과</h1>
						<div id="grid4" style="margin-top:20px;"></div>
                    </div>
                </div>
                <input id="file_name" type="hidden" value="<c:out value='${outcome.outcome_file}'/>">
            </section>
        </main>
    </div>

    <!-- 분석완료 모달 -->
    <div class="modal done_modal">
        <div class="modal_box">
            <h2 class="done_tite">분석이 완료되었습니다.</h2>
        </div>
    </div>
    
    
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
	
	<div class="dim" style="display:none"></div>
	<script type="text/javascript">
	 	function numberWithCommas(x)
	 	{
	 		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
	 	}

	 	var _url = document.getElementById("main").getAttribute("data");

		
	 	function onClickDownload(e)
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
		    	
		    	var a_url = (_url).split(".")[0];
		    	
		    	if(select_file == 1)
		    	{
		    		a.setAttribute("download", "raw_result.txt");
			    	a.href = a_url + "_raw_result.txt";
		    	}
		    	else if(select_file == 2)
		    	{
		    		a.setAttribute("download", "prepro_result.txt");
			    	a.href = a_url + "_prepro_result.txt";
		    	}
		    	else if(select_file == 3)
		    	{
		    		a.setAttribute("download", "prepro_result.txt");
			    	a.href = a_url + "_mapping_result.txt";
		    	}
		    	else if(select_file == 4)
		    	{
		    		a.setAttribute("download", "result.txt");
			    	a.href = a_url + "_result.txt";
		    	}
		    	else if(select_file == 5)
		    	{
		    		a.setAttribute("download", "result.zip");
			    	a.href = a_url + "_result.zip";
		    	}
		    	
		    	document.body.appendChild(a);
		    	a.click();
		    	
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
	    }

	 	async function initTable(url)
	 	{
	    	let response = await fetch(url);
	        let data = await response.blob();
	        let metadata = {type: "text"};
	        let file = new File([data], "qtl.txt", metadata);
	        
	    	return file;
	 	}

	 	async function initGrid(url,index)
	 	{
	 		let file = await initTable(url);
		    
	 		getText(file ,index);
	 	}

	 	function onClickRun()
	 	{
	        initGrid(_url.split("_")[0] + '_raw_result.txt', 1);
	        initGrid(_url.split("_")[0] + '_prepro_result.txt', 2);
	        initGrid(_url.split("_")[0] + '_mapping_result.txt', 3);
	        initGrid(_url.split("_")[0] + '_result.txt', 4);
	 	}

	 	//initTable(document.getElementById("file_name").value.split(".")[0] + "_raw_result.txt");
	    //console.log(document.getElementById("file_name").value.split(".")[0])
	    //console.log(document.getElementById("file_name").value.split(".")[0])
	    //console.log(document.getElementById("file_name").value.split(".")[0])

	    function drawGrid(index,columns,datas)
	    {
	        var Grid = tui.Grid;

	        const grid = new Grid(
	        {
	        	el: document.getElementById('grid' + index),
	        	columns:columns, 
	        	data: datas
	        });
		    
	        Grid.applyTheme('striped'); 
	    }
		    

	    function getText(fileToRead,index)
	    {
	        var reader = new FileReader(); 
	        reader.readAsText(fileToRead);

	        reader.onload = function(e)
	        { 
	        	loadHandler(e,index);
	        };
		    
	        reader.onerror = errorHandler;
	    }

	    function loadHandler(event,index)
	    {
	    	var csv = event.target.result;
		    
	    	process(csv,index);
	    }

	    async function process(csv,index)
	    {
	    	var lines = csv.split("\n");
		
	        result = [];

	        var headers = lines[0].split(",");
	        var headerTag = "";
	        var columns =  []
	        var datas = [];

	        for(var i =0; i<headers.length; i++)
	        {
	        	var headersArray = headers[i].split("\t");
		
	        	for(var j = 0;j<headersArray.length ; j++)
	        	{
	        		columns.push(
	        		{
	        			header : headersArray[j].replace(/"/gi,""), 
	        			name : j,
	        			align: 'center'
	        		})
	        	}
	        }

	        for (var i = 1; i < lines.length - 1; i++)
	        {
				var words = lines[i].split(",");
					
				for(var z=0;z<words.length;z++)
				{
					var d = words[z].split("\t");
					var tempOb = {};
					var rowData = "";
						
					for(var j =0;j<d.length;j++)
					{
						try
						{
							rowData = parseInt(d[j]) ? numberWithCommas(d[j]) : d[j];
						}
						catch(e)
						{
							rowData = d[j];
						}
						
						tempOb[j] = rowData;
			        	
					}
			        
					datas.push(tempOb);
				}
	        }

	        drawGrid(index,columns,datas);
	    }

	    function errorHandler(evt) 
	    {
		    if (evt.target.error.name == "NotReadableError")
		    {
		        alert("Canno't read file !");
		    }
	    }
	
	    //해당 페이지 탭 active css 주기
	    var pathname = window.location.pathname;
	    var pathArray = pathname.split("/");
	    
	    $("#"+pathArray[1]).addClass("active");
	    
	    if(pathArray[2] != null)
	    {
	        $("."+pathArray[2]).addClass("active");
	    }
	
	    function Alert(text)
	    {
	    	//popup
	        $("#alert").show();
	        $(".dim").show();
	        $("#alert .title_text").text(text);
	
	        $("#alert button").click(function()
	        {
	        	$("#alert, .dim").hide();
	            //return location.reload();
	        });
	        
	        return false;
	    }
	
	    function Alert1(text)
	    {
	    	//popup
	        $("#alert").show();
	        $(".dim").show();
	        $("#alert .title_text").text(text);
	
	        $("#alert button").click(function()
	        {
	            $("#alert, .dim").hide();
	        });
	    }
	    
	    function clearScreen()
	    {
	    	Alert('스크린이 초기화되었습니다')
	    }
	    
	    onClickRun();
	    
	</script>
    </body>
</html>