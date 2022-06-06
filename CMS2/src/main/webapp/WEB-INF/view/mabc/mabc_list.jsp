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
    <link rel="stylesheet" href="/digit/css/Register_result_data/mabc_list.css">
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
    <div id="wrap_old">
        <main id="main">
              <section class="data_table_section result_table_section">
                <h2 class="data_tqqable_title">MABC 분석 [MABC analysis]</h2>
                <div id="list_grid"></div>
                <div class="btn_wrap result_btn_wrap">
                    <a href="mabc_add"><button class="new_btn same_btn">신규등록</button></a>
                </div>
            </section>
        </main>
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
		$(document).ready(function(){
			Grid();
		})
	
		function Grid()
		{
			var header = [
				{'header' : '작목', 'name' : 'marker_crop', 'sortable' : true, 'filter' : {type: 'text', showApplyBtn: true, showClearBtn: true}, minWidth: 120},
				{'header' : '유전체 DB 버전', 'name' : 'marker_version', 'sortable' : true, 'filter' : {type: 'text', showApplyBtn: true, showClearBtn: true}, minWidth: 160},
				{'header' : '메모', 'name' : 'outcome_comment', 'sortable' : true, 'filter' : {type: 'text', showApplyBtn: true, showClearBtn: true}, minWidth:180},
				{'header' : '결과 데이터', 'name' : 'outcome_origin_file', 'sortable' : true, 'filter' : {type: 'text', showApplyBtn: true, showClearBtn: true}, minWidth:210},
				{'header' : '등록날짜', 'name' : 'create_date', 'sortable' : true, 'filter' : {type: 'text', showApplyBtn: true, showClearBtn: true}, minWidth: 210}
			]
			
			$.ajax(
			{
				url : "SelectList",
				method : "POST",
				data : {"type" : 3},
				dataType : "JSON",
				success : function(result)
				{
					console.log(result)
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
							location.href = "/digit/mabc_detail?outcome_id=" + list_grid.getRow(ev.rowKey).outcome_id;
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