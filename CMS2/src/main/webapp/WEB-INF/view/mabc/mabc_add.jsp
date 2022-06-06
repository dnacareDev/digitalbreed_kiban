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
    <script src="/digit/js/MABC_analysis/script.js"></script>
</head>
<body>
    <div id="wrap_old">		
        <main id="main">           
            <section class="data_table_section">
                <div class="data_table_title_wrap">
                    <h2 class="data_tqqable_title">MABC 분석 [MABC analysis]</h2>
                    <!-- a download href="dataFile/test_MABC.xlsx">결과파일다운</a -->
                </div>
                <div class="mab_top_bar">
                    <div class="mab_bar_left mab_bar">
                        <div class="select_box add_select_box">
                            <div class="select_wrap">
                                <span class="data_name">작목</span>
                                <select class="type_select" id="crop_selection">
                                	<option >작목 선택</option>
	                            	<c:forEach var="crop" items="${crop}">
	                                	<option value="<c:out value='${crop.crop}'/>"><c:out value="${crop.crop}"/></option>
	                                </c:forEach>
                                </select>
                            </div>
                        	<div class="select_wrap">
                                <span class="data_name">유전체 DB 버전</span>
	                            <select class="type_select_info" id="genomic_information" name="marker_id">
	                                <option value=""></option>
	                            </select>
                            </div>
                        
                        </div>

                        <div class="input_file_wrap">
                            <input type="file" onchange="onChangeLen()" class="addMabcFile" id="len_file">
                            <!-- <label for="len_file">파일첨부</label> -->
                        </div>
                        
                    </div>
                    <div class="mab_bar_right mab_bar add_bar_right">
                        <div class="input_file_wrap">
                            <a download href="/digit/upload/sampleFile/(업로드용)고추-mab_예제파일.xlsx" class="ex_data add_ex_data">샘플파일다운(샘플작목:고추)</a>
                            <input type="text" class="file_text" placeholder="" readonly disabled>
                            <form action="insertOutcomeResult" id="insertForm" method="POST" enctype="multipart/form-data">
                            	<input id="input-file" type="file" class="addMabcFile" onchange="readExcel()" name="file">
                            </form>
                            <div class="flie_btn_box">
                                <label for="input-file" class="file_add">파일첨부</label>
                                <div style="display:none;"class="lenPos" id="marker_file"></div>
                                <button class="save cont_btn add_re_btn" onclick="onClickInit(true)">초기화</button>
                            </div>
                              	<div class="memo_wrap">
	                               <div id="memo" style="display: none;">
		                                <span class="memo_text">메모</span>
		                            	<input type="text" id="outcome_comment">
	                               </div>
	                               <button class="save cont_btn" id="dataSaveBtn" style="display: none;" onclick="InsertOutcomeResult()">분석저장</button>
	                           </div>
                            <input type="hidden" id="user_username" name="user_username" value="<c:out value='${user.user_username}'/>">
                        </div>
                    </div>
                    <div class="view add_view">
                        <div class="commonBtn" onclick="AnalysisBtn(3)">MABC 분석실행</div>
                    </div>
                    <p class="give_info"></p>
                </div>
                <div class="mab_chr_wrap">
                    <div class="mab_chr_wrap_left">
                        <div class="btn_all_box add_btn_all_box">
                            <div class="chr_btn_wrap">
                                <p></p>
                                <div>
                                    <!-- <div class="commonBtn active" onclick="onClickInit()">초기화</div> -->
                                </div>
                            </div>
                            <div class="chr_select_wrap add_chr_select_wrap">
                            
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
                        <!-- div class="commonBtn" onclick="downloadGraphImg()">내려받기</div -->
                    </div>
                </div>


                <!-- 그래프 -->
                <div class="table_page_wrap">
                    <div class="visualWrapPosition visualWrapPosition2">
                        <div class="visualWrap">
                            <div class="tableWrap">
                                <div class="tableContent">
                                    <table id="table" class="table">
                                    </table>
                                </div>
                            </div>
                            <div class="graphContainer">
                                <div class="graphWrap">
                                </div>
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

    <script type="text/javascript">
    /*
        document.addEventListener('DOMContentLoaded', () => {
            const outList = document.querySelectorAll('.out_list');
            const navList = document.querySelectorAll('.list_link');
        
            function headerActive() {
                // 현재 HTML 이름 + 확장자
                let thisHTMLName = document.URL.substring(document.URL.lastIndexOf('/') + 1, document.URL.length);
            
                navList.forEach((item) => {
                    let link = item.getAttribute('href');
                    let linkName = link.split('/');
                    if(linkName[1] === thisHTMLName) {
                        
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
    */
    
	$(document).ready(function()
	{
		SelectMarkerVersion("고추");
	});
	
	$("#crop_selection").change(function()
	{
		var marker_crop = $("#crop_selection").val();
		
		SelectMarkerVersion(marker_crop);
	});
	
	function SelectMarkerVersion(e)
	{
		var data = {"marker_crop" : e};
		
		$.ajax(
		{
			url : "selectUseMarkerVersion",
			method : "POST",
			dataType : "json",
			data : data,
			success : function(result)
			{
				var version_list = $("#genomic_information");
				var add_list = "";
				
				add_list += '<option value="0" hidden>유전체 정보 버전 선택</option>';
				
				for(var i = 0; i < result.length; i++)
				{
					add_list += '<option value="' + result[i].marker_id + '">' + result[i].marker_version + '</option>';
				}
				
				version_list.empty();
				version_list.append(add_list);
			}
		});
	}
	
	$("#genomic_information").change(function()
	{
		var data = {"marker_id" : $("#genomic_information").val()};
		
		$.ajax(
		{
			url : "mabc/selectMarkerFile",
			method : "POST",
			dataType : "json",
			data : data,
			success : function(result)
			{
                var lenURL = "";
                result.map(item => {
                    if(item.marker_file_type == 1){
                        lenURL = item.marker_file;
                    }
                })
                
				$("#marker_file").text(lenURL);
				
				onChangeVersion();
				$(".give_info").text(result[0].marker_credit);

                readMakerFile(result);
			}
		});
	});
	
    function AnalysisBtn(e)
    {
    	onClickRun();
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
    </script>
</body>
</html>