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
    <link rel="stylesheet" href="/digit/css/spectrum.css">
    <link rel="stylesheet" href="/digit/css/common_header.css"> 
    <link rel="stylesheet" href="/digit/css/Register_result_data/common.css">
    <link rel="stylesheet" href="/digit/css/Register_result_data/result_data.css">
    <link rel="stylesheet" href="/digit/css/draw_karyotype/draw_karyotype.css">
    <link rel="stylesheet" href="/digit/css/draw_karyotype/media.css">
    <link rel="stylesheet" href="/digit/css/style.css">
    <link rel="stylesheet" href="/digit/css/alarm.css">
    <script src="/digit/vendor/jquery-3.6.0.js"></script>
    <script src="/digit/vendor/spectrum.js"></script>
    <script src="/digit/vendor/chart.min.js"></script>
    <script src="/digit/js/nav.js"></script>
    <script src="/digit/js/Register_result_data/common.js"></script>
    <c:if test="${user.user_type == 0}">
   		 <script src="/digit/js/alarm.js"></script>
    </c:if>
    <script src="/digit/js/MABC_analysis/html2canvas.js"></script>
</head>
<body>            
    <div id="wrap">
   	        <div style="position:fixed; left:50px; bottom:150px; display: none; z-index: 999999;">
	            gff
	            <input type="file" onchange="readGff()"/>
	            len
	            <input type="file" onchange="onChangeLen()">
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
        <!-- <header id="header">
            <script>loadHTML("header.html");</script>
        </header> -->
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
                    <c:if test="${user.user_type >= 0}">  
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
                    </c:if>
                    <c:if test="${user.user_type >= 0}">   		 
                    	<li class="ui_list" onclick="location.href='/digit/logout'"></li>
                    </c:if>
                </ul>
            </div>
            <section class="data_table_section result_table_section">
              	<div class="data_table_title_wrap">
                    <h2 class="data_table_title">염색체 시각화 [Draw karyotype]</h2>
                </div>
                <div class="draw_karyotype_box">
                      <div class="mab_top_bar karo_top_bar">
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
		                    	<c:forEach var="m" items="${marker}" varStatus="status">
			                    	<tr>
			                    		<c:if test="${m.marker_file_type eq 1}">
				                        	<div class="serverLen" style="display: none;"><c:out value="${m.marker_file}"/></div>
				                        </c:if>
			                    		<c:if test="${m.marker_file_type eq 2}">
				                        	<div class="serverGff" style="display: none;"><c:out value="${m.marker_file}"/></div>
				                        </c:if>
			                       </tr>
		                    	</c:forEach>
                                <!-- <button class="chart_btn active" onclick="onClickKind('Chr')">Chromosome</button>
                                <button class="chart_btn" onclick="onClickKind('Sca')">Scaffold</button>
                                <button class="chart_btn" onclick="onClickKind('Con')">Contig</button> -->
                           </div>
	                        <div class="view">
	                            <!-- <button class="commonBtn" oncliccartbtnk="onClickView()">염색체 시각화 실행</button> -->
	                        </div>
                       </div>
                    </div>
                </div>
                <div class="chart_box">
                    <div class="table_header data_header">
		                <div class="commonBtn download" onclick="onClickExport()">내려받기</div>                            
                        <input type="text" onchange="onChangeGff(this)" class="chartInput" placeholder="Gene search">
                    </div>
                    
                    <div class="chart_parent">
                        <div>
                            <div class="chartName" style="opacity: 0;">a<br/>b</div>
                            <div class="standard_wrap">
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>
                        </div>
                        <div class="chart_box_wrap">
                            <div class="chartContainer">
                                <div class="chartWrap"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    </div>
</body>
 <script src="/digit/js/draw_karyotype/script.js"></script>
</html>