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
    <link rel="stylesheet" href="/digit/css/polymorphic_maker_map/style.css">
    <link rel="stylesheet" href="/digit/css/polymorphic_maker_map/common.css">
    <link rel="stylesheet" href="/digit/css/polymorphic_maker_map/polymorphic_maker_map.css">
    <link rel="stylesheet" href="/digit/css/polymorphic_maker_map/media.css">
    <link rel="stylesheet" href="/digit/css/draw_maker_map/media.css">
    <link rel="stylesheet" href="/digit/css/alarm.css">
    <script src="/digit/vendor/html2canvas.js"></script>
    <script src="/digit/vendor/jquery-3.6.0.js"></script>
    <script src="/digit/vendor/xlsxCdn.js"></script>
    <script src="/digit/vendor/makeXlsx.js"></script>
    <script src="/digit/vendor/makeXlsxFile.js"></script>
    <script src="/digit/js/nav.js"></script>
    <script src="/digit/js/alarm.js"></script>
</head>
<body>
    <div id="wrap_old">
	    <div style="position:fixed; left:50px; bottom:150px; display:none;">
		     <div>gff</div>
		     <input type="file" onchange="readGff()"/>
		     
		     <div>len</div>
		     <input type="file" onchange="readLen()"/>
		     
		     <div>어드민 분자표지 xlsx</div>
		     <input type="file" onchange="readAdminExcel()"/>
        </div>             

        <main id="main">

                <div class="sect_warp">
                    <section class="mark_map_sect">
                        <div class="data_table_title_wrap">
                            <h2 class="data_tqqable_title">다형성 분자표지 [Polymorphic marker map]</h2>
                            <a class="result_down_btn" download href="<c:out value='${outcome.outcome_file}'/>" onclick="<c:out value='DownloadBtn(${outcome.outcome_id});'/>'">결과파일다운</a>
                        </div>
                        <div class="mab_top_bar">
                            <div class="mab_bar_left mab_bar">
                                <div class="select_box">
                                	 <div class="select_wrap">
                                        <span class="data_name">작목</span>
		                                <select id="" class="type_select" disabled>
		                                    <option value=""><c:out value="${marker[0].marker_crop}"/></option>
		                                </select>
                                    </div>
                                     <div class="select_wrap">
                                        <span class="data_name">유전체 DB 버전</span>
		                                <select id="" class="type_select_info" disabled>
		                                    <option value=""><c:out value="${marker[0].marker_version}"/></option>
		                                </select>		                                
                                    </div>
                                </div>
                            </div>
                            <div class="mab_bar_right mab_bar">
                                <div class="input_file_wrap">
                                    <input type="text" class="file_text" placeholder="" readonly disabled>
                                    <input id="input-file" type="file" class="addMabcFile" onchange="readUserExcel()">
                                    <div class="flie_btn_box">
                                        <label for="input-file" class="file_add">파일첨부</label>
                                        <!-- a download href="/upload/sampleFile/polymarker_sample.xlsx" class="ex_data">샘플파일다운</a -->
                                    </div>
                                </div>
                                <div class="select_top_box">
                                    <label>
                                        <select class="selectSecond com_select" onchange="onchangeSelect()">
                                            <option disabled selected>모본 선택</option>
                                        </select>
                                    </label>
                                    <label>
                                        <select class="selectFirst com_select" onchange="onchangeSelect()">
                                            <option disabled selected>부본 선택</option>
                                        </select>
                                    </label>
                                </div>
                            </div>
                            <div class="view">
                                <button class="commonBtn" onclick="setTimeout(function(){onClickPolyRun(2);},500)">다형성 분자표지 분석실행</button>
                            </div>
                             <p class="give_info"><c:out value="${marker[0].marker_credit}"/></p>
                        </div>
                    </section>

            <!-- <div>gff</div>
            <input type="file" onchange="readGff()"/> -->
            <div class="file_box" style="display:none;">
                <div>gff</div>
                <input type="file" onchange="readGff()"/>
                
                <div>len</div>
                <input type="file" onchange="readLen()"/>
                
                <div>어드민 분자표지 xlsx</div>
                <input type="file" onchange="readAdminExcel()"/>
                
                
            	<c:forEach var="m" items="${marker}" varStatus="status">
            	<tr>
            		<c:if test="${m.marker_file_type eq 1}">
                 <div class="serverLen"><c:out value="${m.marker_file}"/></div>
                 </c:if>
            		<c:if test="${m.marker_file_type eq 2}">
                 <div class="serverGff"><c:out value="${m.marker_file}"/></div>
                 </c:if>
            		<c:if test="${m.marker_file_type eq 3}">
                 <div class="serverMaker"><c:out value="${m.marker_file}"/></div>
                 </c:if>
               </tr>
            	</c:forEach>
            </div>
        
            <!-- <div>사용자 분자표지 xlsx</div>
            <input type="file" onchange="readUserExcel()"/> -->


            <!-- <button onclick="downloadTableImg()">표 내려받기</button>
            <button onclick="downloadGraphImg()">차트 내려받기</button> -->


            <div class="visualWrap">
                
                <div class="tableContainer">
                    <div class="table_header data_header">
                        <!-- <h2 class="table_title">Maker info</h2> -->
                        <div class="export_btn" style="display: none;">
	                         <div class='download_btn_wrap'>
			                    <select class="downloadSelectBox">
			                        <option disabled selected hidden>파일 선택</option>
			                        <option>table</option>
			                        <option>map</option>
			                    </select>
			                    <div style="margin-right: auto; margin-left:10px;" class="commonBtn download" onclick="onClickDownload()">내려받기</div>                            
								<!-- <div style="margin-right: auto; margin-left:10px;" class="commonBtn download" onclick="downloadGraphImg()">내려받기</div> -->
	                        </div>
                        </div>
                    </div>
                    <div class="tableWrap">
                    </div>
                </div>
                
                <div class="chartArea">
                    <div class="cart_header data_header">
	                     <div class="export_btn" style="display:none;">
	                     	<div class="cart_box_header">	                     	
	                     		<input type="text" onchange="onChangeGff(this)" class="chartInput" placeholder="Gene search">
	                     	</div>	                     
	                     </div>
	                    <div class="chartContainer">
	                        <div class="chartWrap"></div>
	                    </div>
                	</div>
            	</div>
            </div>
        </main>

        <!-- 모달 -->
        <div class="modalWrap">
            <div class="modalBg" onclick="onClickModalBg()"></div>

            <div class="modalContent">
                <div class="modalHeader">
                    <div class="modalTitle">Chr12 상세</div>
                    <div class="data_header" style="flex-direction:row;">
	                    <!-- input type="number" id="polyModalInput" -->
                        <!-- <button class="export_btn" onclick="downloadModalImg()">내려받기</button> -->
                        <!-- button class="export_btn" onclick="onClickanalytics()" style="margin-right:20px;">자동 분석</button -->
                        <input type="number" id="polyModalInput">
                        <button id="polyModalInput_btn" class="export_btn" onclick="onClickanalytics()" style="margin-right:20px;">자동 분석</button>
                        <button class="export_btn" onclick="downloadModalImg()">내려받기</button>

                    </div>
                </div>
                <ul class="modal_tab_menu">
                    <li data-modal="_modalChartContainer" class="on">Chr12 상세</li>
                    <li data-modal="_modalTable">Maker Info</li>
                    <li data-modal="_modalData">Table Info</li>
                </ul>

                <div class="modalVisual">
                    <!-- 차트 -->
                    <div class="modalChartContainer" id="_modalChartContainer">
                        <div class="modalChartCtl">
                            <button onclick="onClickZoom(true)">+</button>
                            <button onclick="onClickZoom(false)">-</button>
                            <input onchange="onChangeModalSlider(this)" type="range" min="1" max="8" value="3" class="modalSlider" >
                        </div>
                        <div class="modalChartWrap">
                            <div class="modalChart">
                                
                            </div>
                        </div>
                    </div>

                    <!-- 표 --> 
                    <div class="modal_table_data_wrap">
                        <div class="modalTable" id="_modalTable">
                            <div class="modalTableName">분자표지 리스트</div>
                            <table class="modalTableContent">
                                <thead>
                                    <tr>
                                        <th>
                                            <input class="modalAllInput" onchange="onChangeModalAllCkBox(this)" type="checkbox">
                                        </th>
                                        <th>
                                            <label>Id</label>
                                            <!-- <input type="text" id="_Id_2"> -->
                                        </th>
                                        <th>
                                            <label class="tablePos">Pos</label>
                                            <!-- <input type="text" id="_Id_2"> -->
                                        </th>
                                    </tr>
                                </thead>
                                <tbody class="modalTableBody">
                                </tbody>
                            </table>
                        </div>
                        <div class="modalData" id="_modalData">
                            <div class="modalTableName">분자표지 정보</div>
                            <div class="table_name_box">
                                <table class="name_table">
                                    <thead>
                                        <tr>
                                            <!-- th rowspan="3">Maker information</th -->
                                        </tr>
                                    </thead>
                                    <tbody>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script type="text/javascript">
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
	</script>
    <script src="/digit/js/polymorphic_maker_map/script.js"></script>
    <script src="/digit/js/polymorphic_maker_map/common.js"></script>
</body>
</html>