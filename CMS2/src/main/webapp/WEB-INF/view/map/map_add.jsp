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
    <link rel="stylesheet" href="/digit/css/draw_maker_map/style.css">
    <link rel="stylesheet" href="/digit/css/draw_maker_map/common.css">
    <link rel="stylesheet" href="/digit/css/draw_maker_map/draw_maker_map.css">
    <link rel="stylesheet" href="/digit/css/draw_maker_map/media.css">
    <link rel="stylesheet" href="/digit/css/style.css">
    <link rel="stylesheet" href="/digit/css/alarm.css">
    <script src="/digit/vendor/jquery-3.6.0.js"></script>
    <script src="/digit/vendor/xlsxCdn.js"></script>
    <script src="/digit/vendor/makeXlsx.js"></script>
    <script src="/digit/vendor/makeXlsxFile.js"></script>
    <script src="/digit/js/MABC_analysis/html2canvas.js"></script>
    <script src="/digit/js/nav.js"></script>
    <script src="/digit/js/alarm.js"></script>
</head>
<body>
    <div id="wrap">
        <div style="position:fixed; left:50px; bottom:150px; display:none;">
            <div>gff</div>
            <input type="file" onchange="readGff()"/>
            
            <div>len</div>
            <input type="file" onchange="readLen()"/>
            
            <div>어드민 분자표지 xlsx</div>
            <input type="file" class="adminMaker" onchange="readAdminExcel()"/>
           </div>

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
                <div class="sect_warp">

                    <section class="mark_map_sect">
                        <div class="data_table_title_wrap">
                            <h2 class="data_table_title">분자표지 맵 [Draw marker map]</h2>
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
		                                </select>                                               
                                    </div>
                                </div>
                            </div>
                            <div class="mab_bar_right mab_bar">
                                <div class="input_file_wrap">
                                    <div class="under_marker_check">
                                        <input type="checkbox"checked data-toggletype="admin" onchange="onChangeToggle(this)" id="toggleAdmin">
                                        <span>분자표지 세트</span>
                                        <input type="checkbox" data-toggletype="user" onchange="onChangeToggle(this)" id="toggleUser">
                                        <span>유저 분자표지 세트</span>
                                    </div>
                                    <input type="text" class="file_text" placeholder="" readonly disabled>
                                    <form action="insertOutcomeResult" id="insertForm" method="POST" enctype="multipart/form-data">
                                    	<input id="input-file" type="file" class="addMabcFile" onchange="readUserExcel()" name="file">
                                    </form>
                                    <div class="flie_btn_box">
                                        <label for="input-file" class="file_add">파일첨부</label>
                                        <a download href="/digit/upload/sampleFile/(업로드용)고추_마커맵_예제파일.xlsx" class="ex_data">샘플파일다운(샘플화일:고추V1.55)</a>
                                    </div>
                                </div>
                              	<div class="memo_wrap">
	                               <div id="memo" style="display: none;">
		                                <span class="memo_text">메모</span>
		                            	<input type="text" id="outcome_comment">
	                               </div>
	                               <button class="save cont_btn" onclick="InsertNewOutcome();" id="analSaveBtn" style="display: none;">분석저장</button>                                    
	                           </div>
                           	</div>
                            <div class="view">
                                <button class="commonBtn" onclick="onClickView(1);">분자표지맵 분석실행</button>
                            </div>
                            <p class="give_info"></p>
                            <input type="hidden" id="user_username" name="user_username" value="<c:out value='${user.user_username}'/>">
                        </div>
                    </section>
        

                    <!-- <div>어드민 분자표지 xlsx</div>
                    <input type="file" onchange="readAdminExcel()"/> -->
        
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
                    <div class="visualWrap">
                        <!-- 표 -->
                        <div class="tableContainer">
                            <div class="table_header data_header">
                            	<div class='download_btn_wrap'>
				                    <select class="downloadSelectBox">
				                        <option disabled selected hidden>파일 선택</option>
				                        <option>table</option>
				                        <option>map</option>
				                    </select>
				                    <div style="margin-right: auto; margin-left:10px;" class="commonBtn download" onclick="onClickDownload()">내려받기</div>                            
		                        </div>
                                <!-- <h2 class="table_title">Maker info</h2> -->
                                <!-- button class="export_btn" style="display:none;" onclick="downloadTableImg()">내려받기</button -->
                            </div>
                            <div class="tableWrap">
                                <table class="table">
                                    <thead>
                                        <tr>
                                            <th>
                                                <input type="checkbox" onchange="onChangeAllCkBox(this)" id="allCkBox">
                                                <!-- <input onchange="onChangeAllCkBox(this)" id="allCkBox" type="checkbox"> -->
                                            </th>
                                            <th>
                                                <div>
                                                    <label>Chr.</label>
                                                    <!-- <input type="text" id="_chr"> -->
                                                </div>
                                            </th>
                                            <th>
                                                <div>
                                                    <label>Id</label>
                                                    <!-- <input type="text" id="_Id"> -->
                                                </div>
                                            </th>
                                            <th>
                                                <div>
                                                    <label class="tablePos"> Pos.(Mbp)</label>
                                                    <!-- <input type="text" id="_Pos"> -->
                                                </div>
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
                                <!--  button class="export_btn" style="display:none;"  onclick="downloadGraphImg()">내려받기</button -->
                                <input type="text" onchange="onChangeGff(this)" class="chartInput" placeholder="Gene search">
                            </div>
                            <div class="chartContainer">
                                <div class="chartWrap">
                                    <!--
                                        <div class="chartElName">
                                            <div class="chartName">이름이름</div>
                                            <div class="chartEl">
                                                <div class="chartStack"></div>
                                                <div class="chartStackName">qwe</div>
                                                
                                            </div>
                                        </div>
                                    -->
                        
                                </div>
                            </div>
                        </div>
                </div>
            </main>
    
    
            <!-- 모달 -->
            <div class="modalWrap">
                <div class="modalBg" onclick="onClickModalBg()"></div>
                <div class="modalContent">
                    <div class="modalHeader ">
                        <div class="modalTitle">Chr12 상세</div>
                        <div class="data_header">
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
                                <div class="modalChart"></div>
                            </div>
                        </div>
    
                        <!-- 표 --> 
                        <div class="modal_table_data_wrap">
                            <div class="modalTable" id="_modalTable">
                                <div class="modalTableName">분자표지 리스트</div>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>
                                                <input class="modalAllInput" onchange="onChangeModalAllCkBox(this)" type="checkbox" id="AllInput">
                                            </th>
                                            <th>
                                                <div>
                                                    <label>Id</label>
                                                    <!-- <input type="text" id="_Id_2"> -->
                                                </div>
                                            </th>
                                            <th>
                                                <div>
                                                    <label class="tablePos">Pos.</label>
                                                    <!-- <input type="text" id="_pos_2"> -->
                                                </div>
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
                                            <tr>
                                                <td>분자표지명</td>
                                                <td>-</td>
                                            </tr>
                                            <tr>
                                                <td>염색체 번호</td>
                                                <td>-</td>
                                            </tr>
                                            <tr>
                                                <td>위치</td>
                                                <td>-</td>
                                            </tr>
                                            <tr>
                                                <td>용도</td>
                                                <td>-</td>
                                            </tr>
                                            <tr>
                                                <td>서열</td>
                                                <td>-</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </div>
    </div>
    <script src="/digit/js/draw_maker_map/script.js"></script>
    <script src="/digit/js/draw_maker_map/common.js"></script>
    <script type="text/javascript">
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
				url : "map/selectMarkerFile",
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
			data.set("outcome_type", 1);
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
						
						location.href = "/digit/map";
					}
				},
				error : function(e)
				{
					console.log(e);
				}
			});
		}
	</script>
</body>
</html>