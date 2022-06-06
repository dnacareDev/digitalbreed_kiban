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
    <link rel="stylesheet" href="/digit/css/Genome_and_marker_management/common.css">
    <link rel="stylesheet" href="/digit/css/Genome_and_marker_management/media.css">
    <link rel="stylesheet" href="/digit/css/style.css">
    <link rel="stylesheet" href="/digit/css/alarm.css">
    <link rel="stylesheet" href="/digit/tui/tui-pagination/dist/tui-pagination.css">
    <link rel="stylesheet" href="/digit/tui/tui-grid/dist/tui-grid.css">
    <link rel="stylesheet" href="/digit/tui/tui-date-picker/dist/tui-date-picker.css">
    <link rel="stylesheet" href="/digit/tui/tui-time-picker/dist/tui-time-picker.css">
    <script src="/digit/vendor/jquery-3.6.0.js"></script>
    <script src="/digit/js/Genome_and_marker_management/common.js"></script>
    <script src="/digit/js/nav.js"></script>
    <script src="/digit/js/alarm.js"></script>
    <script src="/digit/tui/tui-pagination/dist/tui-pagination.js"></script>
    <script src="/digit/tui/tui-date-picker/dist/tui-date-picker.js"></script>
    <script src="/digit/tui/tui-time-picker/dist/tui-time-picker.js"></script>
    <script src="/digit/tui/tui-grid/dist/tui-grid.js"></script>
    <style>
    	#wrap #main {height: 100%;}
		.blueText{color: #4287f5 !important; position: relative; display: block;}
		/* .blueText::before{position: absolute; content: ""; width: 100%; height: 1px; bottom: 0; background-color: #4287f5;} */
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
            <section class="data_table_section">
                <h2 class="data_table_title">유전체 및 분자표지정보 데이터 베이스 관리</h2>
                <div id="list_grid"></div>
                <div class="btn_wrap">
                    <button class="new_btn same_btn">신규등록</button>
                </div>
            </section>
        </main>
    </div>
    
    <div class="dimm"> 
        <div class="new_win_box">
            <!-- <button class="win_close">닫기</button> -->
            <h2 class="new_win_title">유전체 및 분자표지정보 데이터 베이스 신규입력</h2>
            <form action="insertMarker" class="new_data_form modal_form" id="insert_form" method="POST" enctype="multipart/form-data">
                <div class="data_form_box">
                    <div class="data_left_box data_box">
                        <div class="new_data_box left_fist_box">
                            <label for="crops_select" class="select_arrow">작목 선택</label>
                            <select id="crops_select" name="marker_crop">
                            	<c:forEach var="crop" items="${crop}">
	                                <option value="<c:out value='${crop.crop}'/>"><c:out value="${crop.crop}"/></option>
                                </c:forEach>
                                <option value="new">신규등록</option>
                            </select>
                            <input type="text" id="new_crop" style="display: none;">
                        </div>
                        <div class="new_data_box">
                            <div class="input_box">
                                <p class="form_title">유전체 데이터</p>
                                <p class="form_ex"><a download href="upload/sampleFile/marker_sample.fa">샘플파일다운</a></p>
                                <input type="file" id="flie_1" class="file_in" name="fasta_file">
                                <p class="file_title"></p>
                            </div>
                            <label for="flie_1" class="file_btn">파일첨부</label>
                        </div>
                        <div class="new_data_box">
                            <div class="input_box">
                                <p class="form_title">Anno. 데이터</p>
                                <p class="form_ex"><a download href="upload/sampleFile/marker_sample.gff">샘플파일다운</a></p>
                                <input type="file" id="flie_3" class="file_in" name="gff_file">
                                <p class="file_title">Gff file</p>
                            </div>
                            <label for="flie_3" class="file_btn">파일첨부</label>
                        </div> 
                        <div class="new_data_box">
                            <label for="credit" >크래딧</label>
                           <input type="text" class="credit_input" id="credit" name="marker_credit">
                        </div>
                    </div>
                    <div class="data_right_box data_box">
                        <div class="new_data_box right_first_box">
                            <label for="form_version">유전체 DB 버전</label>
                           <input type="text" id="form_version" name="marker_version" placeholder="-">
                        </div>
                        <div class="new_data_box">
                            <div class="input_box">
                                <p class="form_title">Length 데이터</p>
                                <p class="form_ex"><a download href="upload/sampleFile/marker_sample.len">샘플파일다운</a></p>
                                <input type="file" id="flie_2" class="file_in" name="length_file">
                                <p class="file_title"></p>
                            </div>
                            <label for="flie_2" class="file_btn length_btn">파일첨부</label>
                        </div>
                        <div class="new_data_box">
                            <div class="input_box">
                                <p class="form_title">분자표지 데이터</p>
                                <p class="form_ex"><a download href="upload/sampleFile/marker_sample.xlsx">샘플파일다운</a></p>
                                <input type="file" id="flie_4" class="file_in" name="marker_file">
                                <p class="file_title"></p>
                            </div>
                            <label for="flie_4" class="file_btn marker_btn">파일첨부</label>
                        </div> 
                        <div class="new_data_box">
                            <label for="use_or_not" class="select_arrow">사용여부</label>
                            <select id="use_or_not" name="marker_status">
                                <option value="1">사용</option>
                                <option value="0">비사용</option>
                            </select>
                        </div>
                    </div>
                    <div class="data_bottom_box data_box">
                     <div class="new_data_box">
                         <label for="form_Explanation">설명</label>
						<textarea id="form_Explanation" name="marker_contents" placeholder="-"></textarea>
                     </div>
                    </div>
                </div>
	            <div class="canel_save_btn">
	                <button type="button" class="save" onclick="InsertMarker();">저장</button>
	            </div>
            </form>
        </div>
    </div>
    
	<div class="dimm dimm_modify">
		<div class="new_win_box">
			<!-- <button class="win_close" onclick="CloseModify()">닫기</button> -->
			<h2 class="new_win_title">유전체 및 분자표지정보 데이터 베이스</h2>
			<form action="updateMarker" class="new_data_form modal_form" id="update_form" method="POST" enctype="multipart/form-data">
				<div class="data_form_box">
					<div class="data_left_box data_box">
						<div class="new_data_box left_fist_box">
							<label for="crops_select" class="select_arrow">작물 정보</label>
							<input type="text" id="modify_crop" name="marker_crop" readonly="readonly">
						</div>
						<div class="new_data_box">
							<div class="input_box">
								<p class="form_title">유전체 데이터</p>
								<input type="file" id="modify_file_1" class="file_in" name="fasta_file">
								<u class="file_title blueText" id="modify_fasta">-</u>
							</div>
							<label for="modify_file_1" class="file_btn">파일첨부</label>
						</div>
						<div class="new_data_box">
							<div class="input_box">
								<p class="form_title">Anno. 데이터</p>
								<input type="file" id="modify_file_3" class="file_in" name="gff_file">
								<u class="file_title blueText" id="modify_gff" onclick="DownloadModify(this);">-</u>
							</div>
							<label for="modify_file_3" class="file_btn">파일첨부</label>
						</div> 
						<div class="new_data_box">
							<label for="credit" >크래딧</label>
							<input type="text" class="credit_input" id="modify_credit" name="marker_credit" placeholder="-">
						</div>
					</div>
					<div class="data_right_box data_box">
						<div class="new_data_box">
							<label for="form_version">버전</label>
							<input type="text" id="modify_version" name="marker_version">
						</div>
						<div class="new_data_box">
							<div class="input_box">
								<p class="form_title">Length 데이터</p>
								<input type="file" id="modify_file_2" class="file_in" name="length_file">
								<u class="file_title blueText" id="modify_length">-</u>
							</div>
							<label for="modify_file_2" class="file_btn length_btn">파일첨부</label>
						</div>
						<div class="new_data_box">
							<div class="input_box">
								<p class="form_title">분자표지 데이터</p>
								<input type="file" id="modify_file_4" class="file_in" name="marker_file">
								<u class="file_title blueText" id="modify_marker">-</u>
							</div>
							<label for="modify_file_4" class="file_btn marker_btn">파일첨부</label>
						</div> 
						<div class="new_data_box">
							<label for="use_or_not" class="select_arrow">사용여부</label>
							<select id="modify_status" name="marker_status">
								<option value="1">사용</option>
								<option value="0">미사용</option>
							</select>
						</div>
					</div>
					<div class="data_bottom_box data_box">
						<div class="new_data_box">
							<label for="form_Explanation">설명</label>
							<textarea id="modify_contents" name="marker_contents" placeholder="-"></textarea>
						</div>
					</div>
				</div>
				<input type="hidden" id="modify_id" name="marker_id">
				<div class="canel_save_btn">
					<button type="button" class="save" onclick="UpdateMarker();">수정</button>
				</div>
			</form>
		</div>
	</div>
	
	<a download href="" id="download_file" style="display: none;"></a>
    
	<div class="load_wrap">
	    <div class="load">
	        <h2>잠시만 기다려주세요</h2>
	        <div class="loader"></div>
	    </div>
	</div>
</body>
<script type="text/javascript">
	$("#crops_select").change(function()
	{
		var crop = $("#crops_select").val();
		
		if(crop == "new")
		{
			$("#new_crop").css("display", "block");
			$('.right_first_box').addClass('on');
		}
		else
		{
			$("#new_crop").css("display", "none");
			$('.right_first_box').removeClass('on');
		}
	});

	function InsertMarker()
	{
		var crop = $("#crops_select").val();
		var data = new FormData($("#insert_form")[0]);
		
		var loading = document.querySelector('.load_wrap');
		
		if(crop == "new")
		{
			var new_crop = $("#new_crop").val();
			
			$.ajax(
			{
				url : "insertCrop",
				type : "POST",
				data : {"new_crop" : new_crop},
				success : function(result)
				{
					if(result == 0)
					{
						alert("작물 등록에 실패하였습니다.");
					}
					else if(result == 2)
					{
						alert("이미 등록된 작물입니다.");
					}
					else
					{
						data.set("marker_crop", new_crop);
						
						loading.classList.add('on');
						
						$.ajax(
						{
							url : "insertMarker",
							type : "POST",
							data : data,
							cache : false,
							contentType : false,
							processData : false,
							xhr: function()
							{
								var xhr = $.ajaxSettings.xhr();
								
								xhr.upload.onprogress = function(e)
								{
									//progress 이벤트 리스너 추가
									var percent = parseInt(e.loaded * 100 / e.total);
									
									document.getElementsByClassName("load")[0].children[0].innerHTML = "잠시만 기다려주세요.<br/>" + percent + "% 진행중입니다.";
								};
								
								return xhr;
							},
							success : function(result)
							{
								loading.classList.remove('on');
								
								location.reload();
							},
							error : function(e)
							{
								loading.classList.remove('on');
								
								console.log(e);
							}
						});
					}
				}
			});
		}
		else
		{
			loading.classList.add('on');
			
			$.ajax(
			{
				url : "insertMarker",
				type : "POST",
				data : data,
				cache : false,
				contentType : false,
				processData : false,
				xhr: function()
				{
					var xhr = $.ajaxSettings.xhr();
					
					xhr.upload.onprogress = function(e)
					{
						//progress 이벤트 리스너 추가
						var percent = parseInt(e.loaded * 100 / e.total);
						
						document.getElementsByClassName("load")[0].children[0].innerHTML = "잠시만 기다려주세요.<br/>" + percent + "% 진행중입니다.";
					};
					
					return xhr;
				},
				success : function(result)
				{
					loading.classList.remove('on');
					
					location.reload();
				},
				error : function(e)
				{
					loading.classList.remove('on');
					
					console.log(e);
				}
			});
		}
	}
	
	function ModifyBtn(e)
	{
		$.ajax(
		{
			url : "selectMarkerDetail",
			type : "POST",
			data : {"marker_id" : e},
			success : function(result)
			{
				$("#modify_id").val(result.marker.marker_id);
				$("#modify_crop").val(result.marker.marker_crop);
				$("#modify_version").val(result.marker.marker_version);
				$("#modify_credit").val(result.marker.marker_credit);
				$("#modify_status").val(result.marker.marker_status).prop("selected", true);
				$("#modify_contents").text(result.marker.marker_contents);
				
				for(var i = 0; i < result.file.length; i++)
				{
					if(result.file[i].marker_file_type == 0)
					{
						$("#modify_fasta").text(result.file[i].marker_origin_file);
						$("#modify_fasta").attr("onclick", "DownloadModify('" + result.file[i].marker_file + "', '" + result.file[i].marker_origin_file + "')");
					}
					else if(result.file[i].marker_file_type == 1)
					{
						$("#modify_length").text(result.file[i].marker_origin_file.split(".")[0] + ".len"  );
						$("#modify_length").attr("onclick", "DownloadModify('" + result.file[i].marker_file + "', '" + result.file[i].marker_origin_file.split(".")[0] + ".len')");
					}
					else if(result.file[i].marker_file_type == 2)
					{
						$("#modify_gff").text(result.file[i].marker_origin_file);
						$("#modify_gff").attr("onclick", "DownloadModify('" + result.file[i].marker_file + "', '" + result.file[i].marker_origin_file + "')");
					}
					else if(result.file[i].marker_file_type == 3)
					{
						$("#modify_marker").text(result.file[i].marker_origin_file);
						$("#modify_marker").attr("onclick", "DownloadModify('" + result.file[i].marker_file + "', '" + result.file[i].marker_origin_file + "')");
					}
				}
				
		        let dimmCheck = document.querySelector('.dimm_modify');
		        let dimmHas = dimmCheck.classList.contains('on');
		        
		        if(!dimmHas)
		        {
		            dimmCheck.classList.add('on');
		        };
			}
		});
	}
	
	function CloseModify()
	{
        let dimmCheck = document.querySelector('.dimm_modify');
        let dimmHas = dimmCheck.classList.contains('on');
        
        if(dimmHas)
        {
            dimmCheck.classList.remove('on');
        };
	}
	
	function UpdateMarker()
	{
		var data = new FormData($("#update_form")[0]);
		
		var loading = document.querySelector('.load_wrap');
		loading.classList.add('on');
		
		$.ajax(
		{
			url : "updateMarker",
			type : "POST",
			data : data,
			cache : false,
			contentType : false,
			processData : false,
			xhr: function()
			{
				var xhr = $.ajaxSettings.xhr();
				
				xhr.upload.onprogress = function(e)
				{
					//progress 이벤트 리스너 추가
					var percent = parseInt(e.loaded * 100 / e.total);
					
					document.getElementsByClassName("load")[0].children[0].innerHTML = "잠시만 기다려주세요.<br/>" + percent + "% 진행중입니다.";
				};
				
				return xhr;
			},
			success : function(result)
			{
				loading.classList.remove('on');
				
				location.reload();
			},
			error : function(e)
			{
				loading.classList.remove('on');
				
				console.log(e);
			}
		});
	}
	
	function DownloadModify(e, fileName)
	{
		$("#download_file").attr("download", fileName);
		$("#download_file").attr("href", e);
		$("#download_file").get(0).click();
	}
	
	$(document).ready(function()
	{
		Grid();
	})

	function Grid()
	{
		var header = [
			{'header' : '작목', 'name' : 'marker_crop', 'sortable' : true, 'filter' : {type: 'text', showApplyBtn: true, showClearBtn: true}, minWidth: 120},
			{'header' : '유전체 DB 버전', 'name' : 'marker_version', 'sortable' : true, 'filter' : {type: 'text', showApplyBtn: true, showClearBtn: true}, minWidth: 160},
			{'header' : '설명', 'name' : 'marker_contents', 'sortable' : true, 'filter' : {type: 'text', showApplyBtn: true, showClearBtn: true}, minWidth: 230},
			{'header' : '등록날짜', 'name' : 'create_date', 'sortable' : true, 'filter' : {type: 'text', showApplyBtn: true, showClearBtn: true}, minWidth: 210}
		]
		
		$.ajax(
		{
			url : "SelectList",
			method : "POST",
			data : {"type" : 0},
			dataType : "JSON",
			success : function(result)
			{
				list_grid = new tui.Grid(
				{
					el : document.getElementById("list_grid"),
					scrollX : true,
					scrollY : false,
					data : result.marker,
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
				
				var marker_list = [];
				
				for(var i = 0; i < result.marker.length; i++)
				{
					var item = {"marker_id" : result.marker[i].marker_id,
								"marker_crop" : result.marker[i].marker_crop,
								"marker_version" : result.marker[i].marker_version,
								"marker_contents" : result.marker[i].marker_contents,
								"create_date" : result.marker[i].create_date};
					
					marker_list.push(item);
				}
				
				list_grid.setColumns(header);
				list_grid.resetData(marker_list);
				
				// 클릭 이벤트
				list_grid.on('click', (ev) => {
					//if(ev.targetType == "rowHeader")
					//{
						ModifyBtn(list_grid.getRow(ev.rowKey).marker_id);
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
</html>