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
    <link rel="stylesheet" href="/digit/css/MABC_analysis/common.css">
    <link rel="stylesheet" href="/digit/css/MABC_analysis/style.css">
    <link rel="stylesheet" href="/digit/css/MABC_analysis/media.css">
	<link rel="stylesheet" href="/digit/css/alarm.css">
    <script src="/digit/vendor/jquery-3.6.0.js"></script>
    <script src="/digit/vendor/makeXlsx.js"></script>
    <script src="/digit/vendor/makeXlsxFile.js"></script>
    <script src="/digit/vendor/xlsxCdn.js"></script>
    <script src="/digit/js/MABC_analysis/common.js"></script>
    <script src="/digit/js/nav.js"></script>
    <script src="/digit/js/alarm.js"></script>
    <script src="/digit/js/MABC_analysis/html2canvas.js"></script>
</head>
<body>
    <div id="wrap_old">
        <main id="main"> 
            <section class="data_table_section">
                <div class="data_table_title_wrap">
                    <h2 class="data_tqqable_title">MABC 분석 [MABC analysis]</h2>
                    <a data="<c:out value='${outcome.outcome_file}'/>" class="re_down_btn result_down_btn" download href="<c:out value='/digit/${outcome.outcome_file}'/>" onclick="<c:out value='DownloadBtn(${outcome.outcome_id});'/>" style="margin-left: 20px;">결과파일다운</a>
                </div>
                <div class="mab_top_bar">
                    <div class="mab_bar_left mab_bar">
                        <div class="select_box">
                             <div class="select_wrap">
                                <span class="data_name">작목</span>
                                <select id="" class="type_select" disabled>
                                    <option value=""><c:out value="${outcome.marker_crop}"/></option>
                                </select>
                            </div>
                             <div class="select_wrap">
                                <span class="data_name">유전체 DB 버전</span>
                                 <select id="" class="type_select_info" disabled>
                                	<option value=""><c:out value="${outcome.marker_version}"/></option>
                            	</select>
                            </div>
                        </div>

                        <div class="input_file_wrap">
                            <input type="file" onchange="onChangeLen()" class="addMabcFile" id="len_file">
                            <!-- <label for="len_file">파일첨부</label> -->
                        </div>
                        
                    </div>
                    <div class="mab_bar_right mab_bar">
                        <div class="input_file_wrap">
                            <!-- <a class="file_ex" download href="/digit/dataFile/test_MABC.xlsx">샘플파일다운</a> -->
                            <input type="text" class="file_text" placeholder="" readonly disabled>
                            <input id="input-file" type="file" class="addMabcFile" onchange="readExcel()">
                            <div class="flie_btn_box">
                                <label for="input-file" class="file_add">파일첨부</label>
                                <div style="display:none;"class="lenPos"><c:out value="${outcome.marker_file}"/></div>
                                <div style="display:none;"class="serverFile"><c:out value="${marker_xlsx_file}"/></div>
                                <button class="save first_save" onclick="onClickInit(true); clearScreen();">초기화</button>
                                <button class="save" onclick="InsertOutcome()">상태저장</button>
                                <button class="save" onclick="loadSaveDate()">불러오기</button>
                                <!--button class="save" onclick="onClickRun()">분석실행</button  -->
                                <!-- <button class="dawnload">결과파일 <br /> 내려받기</button> -->
                            </div>
                        </div>
                    </div>
                    <div class="view view_box">
                        <!-- <div class="commonBtn" onclick="onClickInit(true)">MABC 분석실행</div> -->
                        <div class="commonBtn" onclick="AnalysisBtn(3)">MABC 분석실행</div>
                        <!-- div class="commonBtn" onclick="onClickInit(true)">초기화</div>
                        <div class="commonBtn" onclick="InsertOutcome();">상태저장</div>
                        <div class="commonBtn" onclick="loadSaveDate();">불러오기</div -->
                        <input type="hidden" id="outcome_id" value="<c:out value='${outcome.outcome_id}'/>">
                        <input type="hidden" id="outcome_result">
                        <!-- <button class="view">View MAB map</button> -->
                    </div>
                    <p class="give_info"><c:out value="${outcome.marker_credit}"/></p>
                </div>
                <div class="mab_chr_wrap">
                    <div class="mab_chr_wrap_left">
                        <div class="btn_all_box">
                            <div class="chr_btn_wrap">
                                <p></p>
                                
                                <div>
                                    <!-- <div class="commonBtn active" onclick="onClickInit()">초기화</div> -->
                                </div>
                            </div>
                            
                            <div class="chr_select_wrap">  
                            	<div class="download_btn_wrap" style="display:flex;">
	                                <select class="downloadSelectBox" style="margin-right:10px;">
				                        <option disabled selected>파일 선택</option>
				                        <option>table</option>
				                        <option>map</option>
				                    </select>
					                <div class="commonBtn download" onclick="onClickDownload()">내려받기</div>                            
                            	</div>
								
								<div class='card_header_wrap'>								
	                                <select class="chrSelectBox" onchange="onChangeChrSort()">
	                                    <option disabled selected>회복율정렬 선택</option>
	                                </select>
	                                <div class="card_checkbox_wrap">                                
	                                	<input type="checkbox" class="commonBtn allchr checkbox" onclick="onClickAllChr(this)"><p>All chromosome</p>
	                                </div>
								</div>
                            </div>
                        </div>
                    </div>
                    <div class="mab_chr_wrap_right">
                        <!-- <div class="commonBtn" onclick="downloadGraphImg()">내려받기</div> -->
                    </div>
                </div>

                <!-- 그래프 -->
                <div class="table_page_wrap">
                    <div class="visualWrapPosition">
                        <div class="visualWrap">
                            <div class="tableWrap">
                                <div class="tableContent">
                                    <table id="table" class="table">
                                    </table>
                                </div>
                            </div>
                            <div class="graphContainer">
                                <div class="graphWrap"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    </div>
    <!-- 모달입니다! -->
    <div class="modal">
        <div class="modalBg" onclick="closeMOdal()"></div>
        <div class="modalContent">
            <button onclick="closeMOdal()" class="modal_close">닫기</button>
            <div class="modal_title">
                <p>MABC 상세</p>
                <button class="modalZoomBtn" onclick="downloadModalImg()">내려받기</button>
            </div>
            <select class="mabcModalSelect" onchange="onChangeModalSelect()">
                <option disabled selected>개체선택</option>
            </select>
            <div class="modalGraph_Container">
                <div class="modalGraph_control">
                    <button class="modalZoomBtn" onclick="onClickZoom(true)">+</button>
                    <button class="modalZoomBtn" onclick="onClickZoom(false)">-</button>
                    <input onchange="onChangeModalSlider(this)" type="range" min="1" max="8" value="3" class="modalSlider" >
                </div>
                <div class="modalGraph_Wrap">
                    <div class="modalGraph_scale"></div>
                </div>
            </div>
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
    <script src="/digit/js/MABC_analysis/script.js"></script>
<script type="text/javascript">
	document.addEventListener('DOMContentLoaded', () => {
	    const outList = document.querySelectorAll('.out_list');
	    const navList = document.querySelectorAll('.list_link');
	
	    function headerActive()
	    {
	        // 현재 HTML 이름 + 확장자
	        let thisHTMLName = document.URL.substring(document.URL.lastIndexOf('/') + 1, document.URL.length);
	    
	        navList.forEach((item) => {
	            let link = item.getAttribute('href');
	            let linkName = link.split('/');
	            if(linkName[1] === thisHTMLName)
	            {
	                navList.forEach((items) => {
	                    let parent = items.parentNode;
	                    parent.classList.remove('active');
	                });
	                
	                outList.forEach((items) => {
	                    items.classList.remove('on');
	                }); 
	
	                item.parentNode.parentNode.parentNode.classList.add('on');
	                item.parentNode.classList.add('active');
	            };
	        });
	    };
	    
	    headerActive();
	});
	
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
    
    function AnalysisBtn(e)
    {
    	onClickInit(true);
    	
    	InsertAnalysis(e);
    }
    
    function InsertAnalysis(e)
    {
    	$.ajax(
		{
			url : "insertAnalysis",
			method : "POST",
			dataType : "json",
			data : {"type" : e},
			success : function()
			{
			}
		});
    }
    
    function XSSCheck(str, level)
    {
    	if (level == undefined || level == 0)
    	{
    		str = str.replace(/\<|\>|\"|\'|\%|\;|\(|\)|\&|\+|\-/g,"");
    	}
    	else if(level != undefined && level == 1)
    	{
    		str = str.replace(/\</g, "&lt;");
    		str = str.replace(/\>/g, "&gt;");
    	}
    	
    	return str;
    }
</script>
</body>
</html>