<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page import="java.util.*" %>      
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>디지털육종정보화시스템</title>
    <link rel="stylesheet" href="css/reset.css">
    <link rel="stylesheet" href="./css/common_header.css">
    <link rel="stylesheet" href="css/Register_result_data/common.css">
    <link rel="stylesheet" href="css/Register_result_data/result_data.css">
    <link rel="stylesheet" href="css/Register_result_data/media.css">
    <link rel="stylesheet" href="css/Register_result_data/result_media.css">
    <script src="vendor/jquery-3.6.0.js"></script>
    <script src="js/Register_result_data/common.js"></script>
    <script src="/js/nav.js"></script>
</head>
<body>
    <div id="wrap">
        <div class="tb_blank"></div>
        <header id="header">
            <div class="logo">
                <a href="#">
                    <img class="logo_img" src="images/logo.png" alt="로고">
                </a>
            </div>
            <nav id="nav">
				<ul class="out_list_wrap">
					<li class="out_list on">
						<p class="out_list_text">Digital breeding System</p>
						<ul class="inner_list_wrap">
							<li class="inner_list">
								<a href="karyotype_add">염색체 시각화 <span>[Draw karyotype]</span></a>
							</li>
							<li class="inner_list">
								<a href="map">마커 맵 <span>[Draw maker map]</span></a>
							</li>
							<li class="inner_list">
								<a href="polymorphic">다형성 마커 <span>[Polymorphic maker map]</span></a>
							</li>
							<li class="inner_list active">
								<a href="mabc_list">MABC 분석 <span>[MABC analysis]</span></a>
							</li>
							<li class="inner_list">
								<a href="">유사도 분석 <span>[Phylogeny analysis]</span></a>
							</li>
							<li class="inner_list">
								<a href="">계통구분용 마커 <span>[Line specific maker]</span></a>
							</li>
							<li class="inner_list">
								<a href="">QTL 분석 <span>[QTL analysis]</span></a>
							</li>
							<li class="inner_list">
								<a href="">NGS MABC <span>[NGS MABC]</span></a>
							</li>
							<li class="inner_list">
								<a href="">SNP 분석 <span>[SNP analysis]</span></a>
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
                    </c:if>
					<li class="out_list">
						<a href="./Register_result_data.html">
							<p class="out_list_text">System management</p>
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
                    <li class="ui_list">Admin</li>
                                        <li class="ui_list alarm">
                                        <li class="ui_list alarm">
                                        <li class="ui_list alarm">
                </ul>
            </div>
            <section class="data_table_section result_table_section">
                <h2 class="data_table_title">MABC 리스트</h2>
                
                <table class="dat_table result_data_table">
                    <thead>
                        <tr class="table_row_header">
                            <th class="table_head">No.</th>
                            <th class="table_head">
                                <span class="head_title">작물</span>
                            </th>
                            <th class="table_head">
                                <span class="head_title">유전체DB버전</span>
                            </th>
                            <th class="table_head">
                                <span class="head_title">전달 사항</span>
                            </th>
                            <th class="table_head">
                                <span class="head_title">메모</span>
                            </th>
                            <th class="table_head">
                                <span class="head_title">결과데이터</span>
                            </th>
                            <th class="table_head">
                                <span class="head_title">등록날짜</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                    	<c:forEach var="o" items="${outcome}" varStatus="status">
                        <tr>
                            <td class="item_num table_list">
                            	<a href="/mabc_detail?outcome_id=${o.outcome_id}">${status.count}</a>
                            </td>
                            <td class="item_name table_list">${o.marker_crop}</td>
                            <td class="item_version table_list">${o.marker_version}</td>
                            <td class="item_ex table_list">${o.outcome_comment}</td>
                            <td class="item_state table_list"></td>
                            <td class="item_date table_list">${o.outcome_origin_file}</td>
                            <td class="item_date table_list">${o.create_date}</td>
                        </tr>
                        </c:forEach>
                    </tbody>
                </table>
                <div class="table_page_wrap result_page_wrap">
                    <button class="table_prev_btn table_idx_btn">이전</button>
                    <ul class="table_idx">
                        <li class="table_idx_num active">
                            <!-- <a href="#">
                                1
                            </a> -->
                            <span class="idx_num">1</span>
                        </li>
                        <li class="table_idx_num">
                            <!-- <a href="#">
                                2
                            </a> -->
                            <span class="idx_num">2</span>
                        </li>
                        <li class="table_idx_num">
                            <!-- <a href="#">
                                3
                            </a> -->
                            <span class="idx_num">3</span>
                        </li>
                        <li class="table_idx_num">
                            <!-- <a href="#">
                                4
                            </a> -->
                            <span class="idx_num">4</span>
                        </li>
                        <li class="table_idx_num">
                            <!-- <a href="#">
                                5
                            </a> -->
                            <span class="idx_num">5</span>
                        </li>
                    </ul>
                    <button class="table_prev_btn table_idx_btn">다음</button> 
                </div>  
            </section>
        </main>
    </div>
    <script>
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
    </script>
</body>
</html>