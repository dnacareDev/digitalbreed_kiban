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
    <link rel="stylesheet" href="/digit/css/Register_result_data/common.css">
    <link rel="stylesheet" href="/digit/css/Register_result_data/result_data.css">
    <link rel="stylesheet" href="/digit/css/Register_result_data/media.css">
    <link rel="stylesheet" href="/digit/css/Register_result_data/result_media.css">
    <link rel="stylesheet" href="/digit/css/style.css">
    <link rel="stylesheet" href="/digit/css/alarm.css">
    <link rel="stylesheet" href="/digit/tui/tui-pagination/dist/tui-pagination.css">
    <link rel="stylesheet" href="/digit/tui/tui-grid/dist/tui-grid.css">
    <link rel="stylesheet" href="/digit/tui/tui-date-picker/dist/tui-date-picker.css">
    <link rel="stylesheet" href="/digit/tui/tui-time-picker/dist/tui-time-picker.css">
    <script src="/digit/vendor/jquery-3.6.0.js"></script>
    <script src="/digit/js/Register_result_data/common.js"></script>
    <script src="/digit/js/nav.js"></script>
    <script src="/digit/js/alarm.js"></script>
    <script src="/digit/tui/tui-pagination/dist/tui-pagination.js"></script>
    <script src="/digit/tui/tui-date-picker/dist/tui-date-picker.js"></script>
    <script src="/digit/tui/tui-time-picker/dist/tui-time-picker.js"></script>
    <script src="/digit/tui/tui-grid/dist/tui-grid.js"></script>
    <style>
    	#wrap #main {height: 100%;}
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
            <section class="data_table_section result_table_section">
                <h2 class="data_table_title">NGS MABC [NGS MABC]</h2>
                <div id="list_grid"></div>
                <div class="btn_wrap result_btn_wrap">
                    <a href="ngs_add"><button class="new_btn same_btn">신규등록</button></a>
                </div>
            </section>
        </main>
    </div>
    <script type="text/javascript">
		$(document).ready(function(){
			Grid();
		})
	
		function Grid()
		{
			var header = [
				{'header' : '작목', 'name' : 'marker_crop', 'sortable' : true, 'filter' : {type: 'text', showApplyBtn: true, showClearBtn: true}, minWidth: 120},
				{'header' : '유전체 DB 버전', 'name' : 'marker_version', 'sortable' : true, 'filter' : {type: 'text', showApplyBtn: true, showClearBtn: true}, minWidth: 160},
				{'header' : '메모', 'name' : 'outcome_comment', 'sortable' : true, 'filter' : {type: 'text', showApplyBtn: true, showClearBtn: true}, minWidth: 180},
				{'header' : '분석상태', 'name' : 'outcome_status', 'sortable' : true, 'filter' : {type: 'text', showApplyBtn: true, showClearBtn: true}, minWidth: 120},
				{'header' : '결과 데이터', 'name' : 'outcome_origin_file', 'sortable' : true, 'filter' : {type: 'text', showApplyBtn: true, showClearBtn: true}, minWidth: 210},
				{'header' : '등록날짜', 'name' : 'create_date', 'sortable' : true, 'filter' : {type: 'text', showApplyBtn: true, showClearBtn: true}, minWidth: 210}
			]
			
			$.ajax(
			{
				url : "SelectList",
				method : "POST",
				data : {"type" : 7},
				dataType : "JSON",
				success : function(result)
				{
					list_grid = new tui.Grid(
					{
						el : document.getElementById("list_grid"),
						scrollX : true,
						scrollY : false,
						data : result.outcome,
						rowHeaders: [
						{
							type: 'rowNum',
							renderer: RowNumRenderer,
						}],
						editingEvent : 'click',
						columns : header,
						pageOptions : {
							useClient : true,
							perPage : 10
						}
					});
					
					var outcome_list = [];
					
					for(var i = 0; i < result.outcome.length; i++)
					{
						var item = {"outcome_id" : result.outcome[i].outcome_id,
									"marker_crop" : result.outcome[i].marker_crop,
									"marker_version" : result.outcome[i].marker_version,
									"outcome_status" : result.outcome[i].outcome_status == 1 ? "분석 완료" : "분석중",
									"outcome_comment" : result.outcome[i].outcome_comment,
									"outcome_origin_file" : result.outcome[i].outcome_origin_file,
									"create_date" : result.outcome[i].create_date};
						
						outcome_list.push(item);
					}
					
					list_grid.setColumns(header);
					list_grid.resetData(outcome_list);
					
					// 클릭 이벤트
					list_grid.on('click', (ev) => {
						//if(ev.targetType == "rowHeader")
						//{
							location.href = "/digit/ngs_detail?outcome_id=" + list_grid.getRow(ev.rowKey).outcome_id;
						//}
					});
				}
			});
		}
		
		class RowNumRenderer
		{
			constructor(props)
			{
				const el = document.createElement('span');
				el.innerHTML = props.grid.getRowCount() - props.formattedValue + 1;
				this.el = el;
			}
			
			getElement()
			{
				return this.el;
			}
			
			render(props)
			{
				this.el.innerHTML = props.grid.getRowCount() - props.formattedValue + 1;
			}
		}
	</script>
</body>
</html>