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
    <link rel="stylesheet" href="/digit/css/alarm.css">
    <script src="/digit/vendor/jquery-3.6.0.js"></script>
    <script src="/digit/vendor/chart.min.js"></script>
    <script src="/digit/js/nav.js"></script>
    <script src="/digit/js/Register_result_data/common.js"></script>
    <script src="/digit/js/alarm.js"></script>
	<style>
	    .clearfix::before{
	        content: "";
	        display: block;
	    }
	    .clearfix::after{
	        content: "";
	        display: block;
	        clear: both;
	    }
	    #main{
	        height: auto;
	    }
	    #wrap{
	        overflow: auto;
	        height: auto;
	    }
	    
	    #wrap #main {
		    min-height: 900px;
		    max-height: 935px;
		    height: 100%;
		    padding-top: 40px;
		}
		
	     [class*="_inner"]{
	        padding: 29px 31px 45px;
	    }
	    
	    .main_top{
	        width: 100%;
	        border: 1px solid #E6EBEE;
	        border-radius: 8px;
	    }
	    
	    .main_bottom{
	        margin-top:25px;
	        width: 100%;
	    }
	    .main_bottom .main_bottom_left{
	        float: left;
	        width: calc((100% - 25px)/2);
	        border: 1px solid #E6EBEE;
	        border-radius: 8px;
	    }
	    
	    .main_bottom .main_bottom_right{
	        float: left;
	        width: calc((100% - 25px)/2);
	        margin-left: 25px;
	        border: 1px solid #E6EBEE;
	        border-radius: 8px;
	    }
	    h2{
	        padding-bottom: 30px;
	    }
	    @media only screen and (max-width: 1000px){
	        .main_bottom .main_bottom_left, .main_bottom .main_bottom_right{
	            width:100%;
	            margin-left:0;
	            
	        }
	        .main_bottom .main_bottom_right{
	            margin-top: 25px;  
	        }
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
        <main id="main" class="clearfix">
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
											<c:when test="${n.outcome_type eq 9}"><a class="alram_link" href="/digit/userresult_list"></c:when>
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
											<c:when test="${n.outcome_type eq 9}">사용자 결과 데이터 관리</c:when>
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
                <input type="hidden" value="<c:out value='${notice}'/>">
            </div>
            
            <!--section start-->
            <section class="main_section">
                <div class="main_top clearfix">
                    <div class="main_top_inner">
                        <h2>일별 분석 상황</h2>
                        <div class="canvas_chart" style="width: 100%; height: 249px;">
                            <canvas id="lineChart" style="height: 100%;"></canvas>
                        </div>
                    </div>
                </div>
                <div class="main_bottom clearfix">
                    <div class="main_bottom_left">
                        <div class="main_bottom_left_inner">
                            <h2>파일 다운로드</h2>
                            <div class="canvas_chart" style="width: 100%; height: 249px;">
                                <canvas id="pieChart" style="width: 100%;"></canvas>
                            </div>
                        </div>
                    </div>
                    <div class="main_bottom_right">
                        <div class="main_bottom_right_inner">
                            <h2>총 분석 상황</h2>
                            <div class="canvas_chart" style="width: 100%; height: 249px;">
                                <canvas id="stackChart" style="width: 100%;"></canvas>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    </div>
	<script>
		function setLineCanvasWidth()
		{
			var lineChart = document.getElementById("lineChart");
			
			lineChart.style.width = lineChart.parentElement.offsetWidth + "px";
		}
	
		// 라인차트
		function drawLineChart()
		{
			setLineCanvasWidth();
			
			window.addEventListener("resize",setLineCanvasWidth);
			
			new Chart(document.getElementById("lineChart"),
			{
			    type: 'line',
			    data: {
			    	labels: ['분자표지맵', '다형성 분자표지', 'MABC 분석', '유사도 분석', '계통구분용 분자표지', 'QTL 분석', 'NGS MABC', 'SNP 분석','사용자결과데이터'],
			        datasets: [
			          {
			            label: '오늘',
			            data: [<c:out value="${first.map}"/>, <c:out value="${first.poly}"/>, <c:out value="${first.mabc}"/>, <c:out value="${first.phylogeny}"/>, <c:out value="${first.spec}"/>, <c:out value="${first.qtl}"/>, <c:out value="${first.ngs}"/>, <c:out value="${first.snp}"/>, <c:out value="${first.userresult}"/>],
			            borderColor: "#F75320",
			            fill: false,
			            lineTension: 0
			          },
			          {
			            label: '1일 전',
			            data: [<c:out value="${second.map}"/>, <c:out value="${second.poly}"/>, <c:out value="${second.mabc}"/>, <c:out value="${second.phylogeny}"/>, <c:out value="${second.spec}"/>, <c:out value="${second.qtl}"/>, <c:out value="${second.ngs}"/>, <c:out value="${second.snp}"/>, <c:out value="${second.userresult}"/>],
			            borderColor: "#45BBE0",
			            fill: false,
			            lineTension: 0
			          },
			          {
			            label: '2일 전',
			            data: [<c:out value="${third.map}"/>, <c:out value="${third.poly}"/>, <c:out value="${third.mabc}"/>, <c:out value="${third.phylogeny}"/>, <c:out value="${third.spec}"/>, <c:out value="${third.qtl}"/>, <c:out value="${third.ngs}"/>, <c:out value="${third.snp}"/>, <c:out value="${third.userresult}"/>],
			            borderColor: "#FD9802",
			            fill: false,
			            lineTension: 0
			          },
			        ]
			    },
			    options: {
			    	   responsive: false,
			        legend: {display: false},
			        title: {display: false,},
			        scales: {
			            xAxes: [{
			                display: true,
			                scaleLabel: {
			                    display: false,
			                    labelString: 'Month'
			                }
			            }],
			            yAxes: [{
			                display: true,
			                ticks: {
			                	beginAtZero: true,
			                    suggestedMin: 0,
				                min : 0,
				                suggestedMax: 10
			                },
			                scaleLabel: {
			                    display: false,
			                    labelString: 'Amount'
			                },
			            }]
			        }
			    }
			});
		}
		drawLineChart();
		
		// 파이차트
		function drawPieChart()
		{
			new Chart(document.getElementById("pieChart"),
			{
				type: 'pie',
		        data: 
		        {
		        	labels: ["다운로드 완료", "다운로드 미완료"],
		        	datasets: [
		        	{
		        		data: [<c:out value="${file.download_file}"/>, <c:out value="${file.raw_file}"/>],
		        		backgroundColor:["#45BBE0", "#8892D6"],
		        		borderWidth: 1,
		        	}]
		        },
		        options: 
		        {
		        	responsive: true,
		        	legend: false,
		        	maintainAspectRatio : false,
		        	animation: false, 
		        	pieceLabel:
		        	{
		        		mode:"label",
		        		position:"outside", 
		        		fontSize: 11,
		        		fontStyle: 'bold'
		        	}
		        }
			});
		}
		
		drawPieChart();
		
		// 막대차트
		function drawStackChart()
		{
			if(!document.getElementById("stackChart"))
			{
				return;
			}
			
			// 스택 그래프 
			var ctx = document.getElementById("stackChart").getContext('2d');

			var myChart = new Chart(ctx,
			{
				type: 'bar',
				data: 
				{
					labels: ['분자표지맵', '다형성 분자표지', 'MABC 분석', '유사도 분석', '계통구분용 분자표지', 'QTL 분석', 'NGS MABC', 'SNP 분석','사용자결과데이터'],
					datasets: [
					{
						label: '분석수',
						backgroundColor: "#8892D6",
						data: [<c:out value="${total.map}"/>, <c:out value="${total.poly}"/>, <c:out value="${total.mabc}"/>, <c:out value="${total.phylogeny}"/>, <c:out value="${total.spec}"/>, <c:out value="${total.qtl}"/>, <c:out value="${total.ngs}"/>, <c:out value="${total.snp}"/>, <c:out value="${total.userresult}"/>]
					}],
				},
				options: 
				{
					responsive: false,
					tooltips: 
					{
						displayColors: true,
						callbacks:{mode: 'x'},
					},
					scales: 
					{
						xAxes: [
						{
							stacked: true,
							gridLines: {display: false}
						}],

						yAxes: [
						{
							stacked: true,
							ticks:
							{
								beginAtZero: true,
								suggestedMin: 0,
								min : 0,
								suggestedMax: 10
							},
							type: 'linear'
						}]
					},
					responsive: true,
					maintainAspectRatio: false,
					legend: { position: 'bottom' },
				}
			});
		}
		
		drawStackChart();
	</script>
</body>
</html>