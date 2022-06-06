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
    <link rel="stylesheet" href="/digit/css/polymorphic_maker_map/style.css">
    <link rel="stylesheet" href="/digit/css/polymorphic_maker_map/common.css">
    <link rel="stylesheet" href="/digit/css/polymorphic_maker_map/polymorphic_maker_map.css">
    <link rel="stylesheet" href="/digit/css/polymorphic_maker_map/media.css">
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
        <div style="position:fixed; left:50px; bottom:150px; display:none; z-index: 9999999;">
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
                            <h2 class="data_tqqable_title">다형성 분자표지  [Polymorphic marker map]</h2>
                            <%-- <a download href="${outcome.outcome_file}">결과파일다운</a> --%>                                                                                                                                                              
                        </div>
                        <div class="mab_top_bar">
                            <div class="mab_bar_left mab_bar">
                                <div class="select_box">
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
			                            <select class="type_select_info" id="genomic_information">
			                                <option value=""></option>
			                            </select>
                                   	 </div>
                                </div>
                            </div>
                            <div class="mab_bar_right mab_bar">
                                <div class="input_file_wrap">
                                     <a download class="ex_data add_ex_data" href="/digit/upload/sampleFile/(업로드용)멜론_다형성분자표지_예제파일.xlsx" class="ex_data">샘플파일다운(샘플작목:멜론)</a>
                                    <input type="text" class="file_text" placeholder="" readonly disabled>
                                    <form action="insertOutcomeResult" id="insertForm" method="POST" enctype="multipart/form-data">
                                    	<input id="input-file" type="file" class="addMabcFile" onchange="readUserExcel()" name="file">
                                    </form>
                                    <div class="flie_btn_box">
                                        <label for="input-file" class="file_add">파일첨부</label>
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
                              	<div class="memo_wrap">
	                               <div id="memo" style="display: none;">
		                                <span class="memo_text">메모</span>
		                            	<input type="text" id="outcome_comment">
	                               </div>
	                               <button class="save cont_btn" id="polySaveBtn" onclick="InsertNewOutcome();" style="display: none;">분석저장</button>
	                           </div>
                            </div>
                            <div class="view">
                                <button class="commonBtn" onclick="onClickPolyRun(2)">다형성 분자표지 분석실행</button>
                            </div>
                            <p class="give_info"></p>
                            <input type="hidden" id="user_username" name="user_username" value="<c:out value='${user.user_username}'/>">
                        </div>
                    </section>

            <!-- <div>gff</div>`
            <input type="file" onchange="readGff()"/> -->
            <div class="file_box" style="display:none;">
                <div>gff</div>
                <input type="file" onchange="readGff()"/>
                
                <div>len</div>
                <input type="file" onchange="readLen()"/>
                
                <div>어드민 분자표지 xlsx</div>
                <input type="file" onchange="readAdminExcel()"/>

				<div class="serverLen" id="marker_len"></div>
				<div class="serverGff" id="marker_gff"></div>
				<div class="serverMaker" id="marker_xlsx"></div>
            </div>
        
            <!-- <div>사용자 분자표지 xlsx</div>
            <input type="file" onchange="readUserExcel()"/> -->


            <!-- <button onclick="downloadTableImg()">표 내려받기</button>
            <button onclick="downloadGraphImg()">차트 내려받기</button> -->


            <div class="visualWrap">
                <!-- 표 -->
                <div class="tableContainer">
                    <div class="table_header data_header">
                        <!-- <h2 class="table_title">Maker info</h2> -->
                         <div class="export_btn">
	                         <div class='download_btn_wrap'>
			                    <select class="downloadSelectBox">
			                        <option disabled selected hidden>파일 선택</option>
			                        <option>table</option>
			                        <option>map</option>
			                    </select>
			                    <div style="margin-right: auto; margin-left:10px;" class="commonBtn download" onclick="onClickDownload()">내려받기</div>
			                   <!--  <div style="margin-right: auto; margin-left:10px;" class="commonBtn download" onclick="downloadGraphImg()">내려받기</div> -->                            
	                        </div>
                        </div>
                    </div>
                    <div class="tableWrap">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>
                                        <input onchange="onChangeAllCkBox(this)" type="checkbox">
                                    </th>
                                    <th>
                                        <label>Chr</label>
                                        <!-- <input type="text" id="_Id_2"> -->
                                    </th>
                                    <th>
                                        <label>Id</label>
                                        <!-- <input type="text" id="_Id_2"> -->
                                    </th>
                                    <th>
                                        <label>Pos</label>
                                        <!-- <input type="text" id="_Id_2"> -->
                                    </th>
                                    <th>
                                        <div>
                                            <label>분자표지보유</label>
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="markerTbody"></tbody>
                        </table>
                    </div>
                </div>
                
                <!-- 차트 -->
                <div class="chartArea">
                    <div class="cart_header data_header">
                     <div class="export_btn">
	                     	<div class="cart_box_header">	                    
                        		<input type="text" onchange="onChangeGff(this)" class="chartInput" placeholder="Gene search">	                     		
	                     	</div>	                     
	                     </div>
                    </div>
                    <!-- <input type="text" onchange="onChangeGff(this)" class="chartInput" placeholder="Gene search"> -->
                    <div class="chartContainer">
                        <div class="chartWrap">
                            
                                <!-- <div class="chartElName">
                                    <div class="chartName">이름</div>
                                    <div class="chartEl">
                                        <div class="chartStackEls">
                                            <div class="chartStack"></div>
                                            <div class="chartStackName">qwe</div>
                                        </div>
                                    </div>
                                </div> -->
                           
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
                    	<input type="number" id="polyModalInput">
                        <button id="polyModalInput_btn" class="export_btn" onclick="onClickanalytics()" style="margin-right:20px;">자동 분석</button>
                        <button class="export_btn" onclick="downloadModalImg()">내려받기</button>
                        <!-- button class="export_btn" onclick="onClickanalytics()" style="margin-right:20px;">자동 분석</button -->
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
</body>

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
				
				add_list += '<option value="none" hidden>유전체 정보 버전 선택</option>';
				
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
			url : "polymorphic/selectMarkerFile",
			method : "POST",
			dataType : "json",
			data : data,
			success : function(result)
			{
				for(var i = 0; i < result.length; i++)
				{
					if(result[i].marker_file_type == 1)
					{
						$("#marker_len").text(result[i].marker_file);
					}
					else if(result[i].marker_file_type == 2)
					{
						$("#marker_gff").text(result[i].marker_file);
					}
					else if(result[i].marker_file_type == 3)
					{
						$("#marker_xlsx").text(result[i].marker_file);
					}
				}
				
				onChangeVersion();
				$(".give_info").text(result[0].marker_credit);
			}
		});
	});

	function InsertNewOutcome()
	{
		var data = new FormData($("#insertForm")[0]);
		data.set("user_username", $("#user_username").val());
		data.set("marker_id", $("#genomic_information").val());
		data.set("outcome_type", 2);
		data.set("outcome_comment", $("#outcome_comment").val());
		
		$.ajax(
		{
			url : "insertOutcomeResult",
			method : "POST",
			data : data,
			cache : false,
			contentType : false,
			processData : false,
			success : function(result)
			{
				if(result == 0)
				{
					alert("저장에 실패하였습니다.");
				}
				else
				{
					alert("저장되었습니다.");
					
					location.href = "/digit/polymorphic";
				}
			},
			error : function(e)
			{
				console.log(e);
			}
		});
	}
</script>
	<script src="/digit/js/polymorphic_maker_map/script.js"></script>
	<script src="/digit/js/polymorphic_maker_map/common.js"></script>
</html>