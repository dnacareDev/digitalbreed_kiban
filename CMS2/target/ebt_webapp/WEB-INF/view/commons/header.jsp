<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
	<div class="logo">
		<a href="">
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
							<a href="marker_list">MABC 분석 <span>[MABC analysis]</span></a>
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
				<li class="out_list">
					<p class="out_list_text">Data management</p>
					<ul class="inner_list_wrap">
						<li class="inner_list">
							<a href="marker_list">유전체 및 마커정보 데이터 베이스 관리</a>
						</li>
						<li class="inner_list">
							<a href="result_list">결과 데이터 등록</a>
						</li>
					</ul>
				</li>
				<li class="out_list">
					<a href="./Register_result_data.html">
						<p class="out_list_text">System management</p>
					</a>
				</li>
			</ul>
		</nav>
	<link rel="stylesheet" href="/../css/common_header.css">
	<style>
    .dim{
        position:fixed;
        left:0;
        top:0;
        width:100%;
        height:100vh;
        background-color:rgba(0,0,0,0.3);
        z-index: 9;
    }
    #alert, #confirm{
        width:100%;
        position:fixed;
        left:0;
        top:0;
        width:100%;
        height:100vh;
        z-index: 9999999999999999999999999;
    }
    #alert .alert_table, #confirm .alert_table{
        display: table;
        width:100%;
        height: 100%;

    }
    #alert .alert_table .alert_inner, #confirm .alert_table .alert_inner{
        display:table-cell;
        vertical-align:middle;
    }
    #alert .alert_table .alert_inner .alert_cover, #confirm .alert_table .alert_inner .alert_cover{
        max-width:550px;
        margin:0 auto;
        padding: 50px;
        text-align:center;
        background-color: #fff;
        border-radius: 10px;
    }
    #alert .alert_table .alert_inner .alert_cover .title_text, #confirm .alert_table .alert_inner .alert_cover .title_text{
        color: #222222;
        font-size: 20px;
        font-weight: 500;
    }
    #alert .alert_table .alert_inner .alert_cover button[type="button"], #confirm .alert_table .alert_inner .alert_cover button[type="button"]{
        padding: 10px 30px;
        color: #fff;
        background-color:#217566;
        border-radius: 5px;
        margin-top:30px;
        border: none;
    }
    #confirm .alert_table .alert_inner .alert_cover button[type="button"]{
        float:left;
    }
    #confirm .alert_table .alert_inner .alert_cover button[type="button"]:last-child{
        background-color: #ddd;
        color: #222;
        margin-left: 10px;
    }
    #confirm .alert_table .alert_inner .alert_cover .btn_box{
        display:inline-block;
        margin: 0 auto;
    }
</style>
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
<script type="text/javascript">

    //해당 페이지 탭 active css 주기
    var pathname = window.location.pathname;
    var pathArray = pathname.split("/");
    $("#"+pathArray[1]).addClass("active");
    if(pathArray[2] != null){
        $("."+pathArray[2]).addClass("active");
    }

    function Alert(text){ //popup

        $("#alert").show();
        $(".dim").show();
        $("#alert .title_text").text(text);

        $("#alert button").click(function(){
        	$("#alert, .dim").hide();
		 
            return location.reload();
        });
        return false;
    }

    function Alert1(text){ //popup

        $("#alert").show();
        $(".dim").show();
        $("#alert .title_text").text(text);

        $("#alert button").click(function(){
            $("#alert, .dim").hide();
        });
    }

</script>