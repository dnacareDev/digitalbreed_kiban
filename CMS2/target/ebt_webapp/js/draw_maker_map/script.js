
var parseData = {};
var lengthData = [];
var parseLengthData = {};
var isAdminUser = true;
var gffData = {};
var adminXlsxData = {};
var userXlsxData = {};
var today = new Date();
var fileName = "";
var clickName = "";
var clickId = "";
var informationArr = [];

function isAdmin(){
    var out_list = document.querySelectorAll(".out_list");
    if(out_list.length==3){
        isAdminUser = true;
    }else{
        var tbody = document.querySelector(".name_table tbody");
        tbody.querySelectorAll("tr")[4].remove();
        isAdminUser = false;
    }
}
isAdmin();

// # . 0 Gff 파일 읽기
function readGff () {
    var input = event.target;
    var fileForm = input.files[0].name.split(".")[1];
    if(fileForm !== "gff"){
        alert(".gff 파일이 아닙니다.");
        event.target.value = null;
        return
    };

    var reader = new FileReader();
    reader.onload = function () {
        var data = reader.result;
        parcingGff(data);
    };
    reader.readAsBinaryString(input.files[0]);
}
// # . 0 Len 파일 읽기
function readLen () {
    var input = event.target;
    var fileForm = input.files[0].name.split(".")[1];
    if(fileForm !== "len"){
        alert(".len 파일이 아닙니다.");
        event.target.value = null;
        return
    };

    var reader = new FileReader();
    reader.onload = function () {
        var data = reader.result;
        var newLengthData = data.replace(/(\r\n|\n|\r)/gm, "-");
        newLengthData = newLengthData.split("-");
        lengthData = [];
        for(var i = 0 ; i < newLengthData.length ; i++){
            if(!newLengthData[i]){continue}
            var lengthEl = newLengthData[i].split(" ");
            lengthData.push([lengthEl[0], lengthEl[1]]);
        }
    };
    reader.readAsBinaryString(input.files[0]);
}
function parcingGff(data){
    var newData = data.replace(/(\t)/gm, "@");
    newData = newData.replace(/(\r\n|\n|\r)/gm, "SJH11HI").split("SJH11HI");

    var newGffData = {};
    for(var i = 0 ; i < newData.length ; i++){
        if(newData[i] ==""){continue};
        if(newData[i][0]=="#"){continue};
        if(!newData[i].split("ID=")[1]){continue}
        

        try{
            var id = "";

            // 분기처리
            if(!newData[i].split("ID=")[1].split(":")[1]){
                id = newData[i].split("ID=")[1].split(";")[0];
            }else{
                if(newData[i].split("ID=")[1].split(":")[0].split(";")[1]){
                    id = newData[i].split("ID=")[1].split(":")[0].split(";")[0];
                }else{
                    id = newData[i].split("ID=")[1].split(":")[0];
                }
            }
            var sentenceArr = newData[i].split("@") ;
    
            if( newGffData[id] ){
                continue;
            }else{
                newGffData[id] = {
                    chr : sentenceArr[0],
                    pos : sentenceArr[4],
                    id : id
                }
            }
        }catch{console.err(i + "_ index _ gff parse Error"); return;}
    }

    if(Object.keys(newGffData).length){
        alert("잘못된 Gff파일입니다.");
        console.log("newGffData empty");
    }
    gffData = newGffData;
}



// 어드민 -------------------------------
// # . 1 어드민 엑셀 data 가져오기
function readAdminExcel() {
    var input = event.target;
    var reader = new FileReader();
    reader.onload = function () {
        
        var fileForm = input.files[0].name.split(".")[1];
        if(fileForm !== "xlsx"){
            alert(".xlsx 파일이 아닙니다.");
            event.target.value = null;
            return
        };

        var data = reader.result;
        var workBook = XLSX.read(data, { type: 'binary' });
        workBook.SheetNames.forEach(function (sheetName) {
            var rows = XLSX.utils.sheet_to_json(workBook.Sheets[sheetName]);
            var xlsxData = JSON.parse(JSON.stringify(rows));
            adminXlsxData = xlsxData;
            
            parsingData(xlsxData);
        })
    };
    reader.readAsBinaryString(input.files[0]);
}
// # . 2 데이터 파싱
function parsingData(xlsxData){

    // 염색체 대분류 나누기
    let bigParseData = {}
    for(var i = 0 ; i < xlsxData.length ; i++){
        var currentCategory = xlsxData[i][" 염색체 "];

        for(var j = 0 ; j < lengthData.length ; j++){
            if(lengthData[j][0] == currentCategory){
                parseLengthData[currentCategory] = Number(lengthData[j][1]);
                parseData[currentCategory] = parseData[currentCategory]?parseData[currentCategory]:{};
                bigParseData[currentCategory] = bigParseData[currentCategory]?bigParseData[currentCategory]:[];
                bigParseData[currentCategory].push(xlsxData[i]);
            }
        }
    }

    if(Object.keys(parseData).length==0){
        alert("잘못된 마커 세트입니다.")
        console.error("parseData {}");
        return;
    }

    for(var key in bigParseData){
        for(var i = 0 ; i < bigParseData[key].length ; i++){
            var currentData = bigParseData[key][i];
            parseData[key][currentData["분자표지명"]] = {
                guestPos: currentData[" 표시용위치(mb) "],
                adminPos: currentData[" 실제위치(bp) "],
                active : false,
                isAdmin : true,
                purpose: currentData["용도"],
                order: currentData["서열"],
            }
        }
    }

            console.log(parseData);
    drawTable();
    drawChart();
}




// 유저 -------------------------------
// # . 1 유저 엑셀 data 가져오기
function readUserExcel() {
    var input = event.target;
    var reader = new FileReader();
    reader.onload = function () {
        
        var fileForm = input.files[0].name.split(".")[1];
        fileName = input.files[0].name.split(".")[0];
        if(fileForm !== "xlsx"){
            alert(".xlsx 파일이 아닙니다.");
            event.target.value = null;
            return
        };

        var data = reader.result;

        var workBook = XLSX.read(data, { type: 'binary' });
        workBook.SheetNames.forEach(function (sheetName) {
            var rows = XLSX.utils.sheet_to_json(workBook.Sheets[sheetName]);
            var xlsxData = JSON.parse(JSON.stringify(rows));
            userXlsxData = xlsxData;
            // parsingUserData(xlsxData);
        })
    };
    reader.readAsBinaryString(input.files[0]);
}
// # . 2 데이터 파싱
function parsingUserData(xlsxData){

    // 염색체 대분류 나누기
    let bigParseData = {}
    for(var i = 0 ; i < xlsxData.length ; i++){
        var currentCategory = xlsxData[i][" 염색체 "];
        for(var j = 0 ; j < lengthData.length ; j++){
            if(lengthData[j][0] == currentCategory){
                parseLengthData[currentCategory] = Number(lengthData[j][1]);
                parseData[currentCategory] = parseData[currentCategory]?parseData[currentCategory]:{};
                bigParseData[currentCategory] = bigParseData[currentCategory]?bigParseData[currentCategory]:[];
                bigParseData[currentCategory].push(xlsxData[i]);
            }
        }
    }

    if(Object.keys(bigParseData).length==0){
        console.error("bigParseData {}");
        alert("잘못된 사용자 마커 세트입니다.");
        return;
    }
    
    for(var key in bigParseData){
        for(var i = 0 ; i < bigParseData[key].length ; i++){
            var currentData = bigParseData[key][i];
            parseData[key][currentData["분자표지명"]] = {
                guestPos: currentData[" 표시용위치(mb) "],
                adminPos: currentData[" 표시용위치(mb) "],
                adminPos: currentData[" 실제위치(bp) "],
                active : false,
                isAdmin : false,
            }
            
        }
    }

    initChart();
    initTable();
    drawTable();
    drawChart();
}




// # . 3 차트그리기
function drawChart(){

    // 기준 높이 측정
    var highLength = 0;
    for(var key in parseLengthData){
        if(highLength < parseLengthData[key]){
            highLength = parseLengthData[key]
        }
    }
    var highPercent = 100 / highLength;
    var chartWrap = document.querySelector(".chartWrap");
    
    // 큰 틀 제작
    for(var key in parseLengthData){
        var chartElName = document.createElement('div');
        var chartEl = document.createElement('div');
        var chartName = document.createElement('div');
        chartElName.classList.add("chartElName")
        chartEl.classList.add("chartEl")
        chartName.classList.add("chartName")
        
        chartName.innerHTML = key + "<br /> (" + insertComma(parseLengthData[key]) + "bp)";
        chartEl.style.height = parseLengthData[key] * highPercent + "%";
        chartEl.setAttribute("data-column", key);

        // 스택 제작
        var stackPercent = 100 / parseLengthData[key];
        for(var keyStack in parseData[key]){

            var chartStack = document.createElement('div');
            chartStack.classList.add("chartStack");
            var newKeyStack = keyStack.replace("/", "slash");
            
            chartStack.setAttribute("data-stack", newKeyStack + "_stack");
            // 높이
            chartStack.style.top = (stackPercent * parseData[key][keyStack]["adminPos"])+ "%";
            
            if(parseData[key][keyStack]["active"]){
                if(parseData[key][keyStack]["isAdmin"]){
                    chartStack.style.backgroundColor = "#F75320";
                }else{
                    chartStack.style.backgroundColor = "#45BBE0";
                }
            }else{
                chartStack.style.backgroundColor = "#BFBFBF";
                chartStack.style.height = "1px";
            }
            chartEl.appendChild(chartStack);
        }

        chartElName.appendChild(chartName); // 이름 넣기 
        chartElName.appendChild(chartEl); // 큰틀넣기 
        chartWrap.appendChild( chartElName ); // 큰틀 묶음 넣기 


        // 이름, 라인 넣기
        var divEl = document.querySelector("[data-column=" +key+ "]");
        var stackPercent = 100 / parseLengthData[key];
        var highMarginR = 0;
        for(var keyStack in parseData[key]){
            if(parseData[key][keyStack]["active"]){
                // 이름
                var chartStackName = document.createElement('div');
                chartStackName.classList.add("chartStackName");
                chartStackName.setAttribute("data-stackname", key + "_stackName"); // 컬럼 분기
                var newKeyStack = keyStack.replace("/", "slash");
                chartStackName.setAttribute("data-stacknamerow", newKeyStack + "_stackNameRow"); // 스택 분기
                if(isAdminUser){
                    chartStackName.innerHTML =keyStack+"<br />"+"("+insertComma(parseData[key][keyStack]["adminPos"])+"bp)";
                }else{
                    chartStackName.innerHTML =keyStack+"<br />"+"("+roundToTwo(parseData[key][keyStack]["guestPos"])+"mb)";
                }
                chartStackName.style.top = (stackPercent * parseData[key][keyStack]["adminPos"])+ "%";
                
                if(clickId == newKeyStack){
                    chartStackName.style.border = "2px solid #000";
                    chartStackName.style.padding = "5px";
                }

                // 라인
                var chartStackLine = document.createElement('div');
                chartStackLine.classList.add("chartStackLine");
                chartStackLine.setAttribute("data-stackline", key + "_stackLine");
                chartStackLine.style.top = (stackPercent * parseData[key][keyStack]["adminPos"])+ "%";
                
                divEl.appendChild(chartStackLine);
                divEl.appendChild(chartStackName);
                
                // 최대 이름 길이
                if(highMarginR < chartStackName.offsetWidth){
                    highMarginR = chartStackName.offsetWidth;
                }
            }
        }

        divEl.parentElement.style.marginRight = (highMarginR + 80) + "px";

        var stackName = document.querySelectorAll("[data-stackname=" +key+ "_stackName]"); 
        var stackLine = document.querySelectorAll("[data-stackline=" +key+ "_stackLine]"); 
        for(var i = 0 ; i < stackName.length ; i++){
            if(i!==0){
                var offsetBottom = stackName[i-1].offsetTop + stackName[i-1].offsetHeight;
                if(stackName[i].offsetTop < offsetBottom){
                    stackName[i].style.top = offsetBottom + "px";
                }
            }

            // 설명 x, y 좌표
            var nameX = stackName[i].offsetLeft;
            var nameY = stackName[i].offsetTop + (stackName[i].offsetHeight/2);

            var row = stackName[i].dataset.stacknamerow.replace("_stackNameRow", "");
            var stack = document.querySelector("[data-stack=" +row+ "_stack]");
            
            // 스택 x, y 좌표
            var stackX = stack.offsetLeft + stack.offsetWidth;
            var stackY = stack.offsetTop + (stack.offsetHeight/2);

            // 각도구하기
            var x = nameX - stackX;
            var y = nameY - stackY;
            var radian = Math.atan2(y, x);
            var degree = radian * 180 / Math.PI // 라디안 -> 디그리 변환
            stackLine[i].style.transform = "rotate(" + degree + "deg)";

            // 가로길이 구하기
            stackLine[i].style.width = 
            Math.sqrt(
                Math.pow((nameY - stackY), 2) + Math.pow((Math.abs(nameX - stackX)), 2)
            ) - 10 + "px";
        }
    }
    addClickEventChart();
}
// # . 3 테이블 그리기
function drawTable(){

    var markerTbody = document.querySelector(".markerTbody");

    for(var key in parseData){
        for(var keyStack in parseData[key]){
            var stackEl = parseData[key][keyStack];

            var tr = document.createElement('tr');
            var tdInputWrap = document.createElement('td');
            var tdInput = document.createElement('input');
            var tdChr = document.createElement('td');
            var trId = document.createElement('td');
            var trPos = document.createElement('td');
            tdInput.setAttribute("type", "checkbox");
            tdInput.setAttribute("onclick", "onChangeCheckBox(this)");
            tdInput.setAttribute("data-table", keyStack);
            tdInput.classList.add("tableInput");
            if(stackEl["active"]){
                tdInput.checked = true;
                if(stackEl["isAdmin"]){
                    tr.style.backgroundColor = "#F75320";
                }else{
                    tr.style.backgroundColor = "#45BBE0";
                }
            }

            tdChr.innerText = key;
            trId.innerText = keyStack;
            trId.setAttribute("data-tableid" , keyStack);
            tdInput.setAttribute('id', keyStack);
            if(isAdminUser){
                trPos.innerText = insertComma(stackEl["adminPos"]);
            }else{
                trPos.innerText = roundToTwo(stackEl["guestPos"]);
            }
            if(clickId == keyStack){
                tr.classList.add("activeEl");
                // tr.style.border = "2px solid #000";
            }

            tdInputWrap.appendChild(tdInput);
            tr.appendChild(tdInputWrap);
            tr.appendChild(tdChr);
            tr.appendChild(trId);
            tr.appendChild(trPos);
            markerTbody.appendChild(tr);
        }
    }
    addClickEventTable();
}
// 차트 클릭 
function addClickEventChart(){
    var chartEls = document.querySelectorAll(".chartEl");
    for(var i = 0 ; i < chartEls.length ; i++){
        chartEls[i].addEventListener("dblclick", function(e){
            var currentTarget = e.target;        
            var currentColumn = "";     
            if(currentTarget.classList.contains("chartEl")){
                currentColumn = currentTarget.dataset.column;
            }else{
                currentColumn = currentTarget.parentElement.dataset.column;
            }
            clickName = currentColumn;

            var modalWrap = document.querySelector(".modalWrap");
            modalWrap.style.display = "flex";
            drawModalChart(currentColumn);
            drawModalTable(currentColumn);
        })
    }

    var chartStack = document.querySelectorAll(".chartStack");
    for(var i = 0 ; i < chartStack.length ; i++){
        chartStack[i].addEventListener("click", function(e){
            var currentChr = e.target.parentElement.dataset.column;
            var clickData = e.target.dataset.stack.replace("_stack", "");

            clickId = clickData;

            parseData[currentChr][clickData]["active"] = true;
            initChart();
            initTable();
            drawChart();
            drawTable();

            var newStack = document.querySelector("[data-stack="+clickData+"_stack]");
            var newTable = document.querySelector("[data-tableid="+clickData+"]");

            $('.chartWrap').animate({scrollLeft : newStack.parentElement.offsetLeft}, 0); 
            $('.markerTbody').animate({scrollTop : newTable.offsetTop - 25}, 0); 
        })
    }
}
// 테이블 클릭
function addClickEventTable(){
    var markerTbody = document.querySelector(".markerTbody");
    var trEls = markerTbody.children;
    for(var i = 0 ; i < trEls.length ; i++){
        trEls[i].addEventListener("click", function(e){
            if(e.target.tagName == "LABEL"){return}
            var activeEls = document.querySelectorAll(".activeEl");
            for(var j = 0 ; j < activeEls.length ; j++){
                activeEls[j].classList.remove("activeEl");
            }

            var id = "";
            var chr = "";
            if(e.target.classList.contains("tableInput")){
                id = e.path[2].children[2].innerText;
                chr = e.path[2].children[1].innerText;

                e.path[2].classList.add("activeEl");

                var bgColor = "";
                if(parseData[chr][id]["active"]){
                    bgColor = "#fff"
                }else{
                    if(parseData[chr][id]["isAdmin"]){
                        bgColor = "#F75320"
                    }else{
                        bgColor = "#45BBE0"
                    }
                }
                e.path[2].style.backgroundColor = bgColor;

                // e.path[2].style.backgroundColor = parseData[chr][id]["active"]?"#fff":"salmon";
                
                e.path[2].children[0].children[0].checked = e.path[2].children[0].children[0].checked;
            }else{
                id = e.path[1].children[2].innerText;
                chr = e.path[1].children[1].innerText;
                
                e.path[1].classList.add("activeEl");
                var bgColor = "";
                if(parseData[chr][id]["active"]){
                    bgColor = "#fff"
                }else{
                    if(parseData[chr][id]["isAdmin"]){
                        bgColor = "#F75320"
                    }else{
                        bgColor = "#45BBE0"
                    }
                }
                e.path[1].style.backgroundColor = bgColor;
                // e.path[1].style.backgroundColor = parseData[chr][id]["active"]?"#fff":"salmon";

                e.path[1].children[0].children[0].checked = !e.path[1].children[0].children[0].checked;
            }

            clickId = id;
            
            parseData[chr][id]["active"] = !parseData[chr][id]["active"];

            initChart();
            drawChart();
            // initTable();
            // drawTable();
            
            var newStack = document.querySelector("[data-stack="+id+"_stack]");
            // var newTable = document.querySelector("[data-tableid="+id+"]");
            $('.chartWrap').animate({scrollLeft : newStack.parentElement.offsetLeft}, 0); 
            // $('.markerTbody').animate({scrollTop : newTable.offsetTop - 25}, 0); 
        })
    }
}


function roundToTwo(num) {
    return +(Math.round(num + "e+2")  + "e-2");
}



// ------------------------------------------------------
//                         GFF 검색
// ------------------------------------------------------
function onChangeGff(e){

    if(!e.value){return}

    // C1_1191
    var searchValue = [];
	var searchKey = e.value.toUpperCase();
    for(var key in gffData){
        if(key.toUpperCase().includes(searchKey)){
            searchValue.push(key);
        }
    }

    if(searchValue.length !== 0){

        for(var i = 0 ; i < searchValue.length ; i++){
            var searchStack = document.querySelector("[data-stack="+searchValue[i]+"_stack]");
            if(searchStack){
                var columnName = searchStack.parentElement.dataset.column;
                parseData[columnName][searchValue[i]]["active"] = true;
            }
        }

        initChart();
        initTable();
        drawChart()
        drawTable()
        for(var i = 0 ; i < searchValue.length ; i++){
            var newSearchStack = document.querySelector("[data-stack="+searchValue[i]+"_stack]");
            newSearchStack.classList.add("stackAni");
        }



    }else{
        alert("검색결과가 없습니다.")
    }
}



// ------------------------------------------------------
//                         토글
// ------------------------------------------------------
function onChangeToggle(e){
    // 데이터 초기화
    initChart();
    initTable();
    parseData = {};
    parseLengthData = {};
    var allCkBox = document.getElementById("allCkBox");
    allCkBox.checked = false;

    var toggleAdmin = document.getElementById("toggleAdmin");
    var toggleUser = document.getElementById("toggleUser");

      // 모두 체크
    if(toggleAdmin.checked && toggleUser.checked){
        parsingData(adminXlsxData);
        parsingUserData(userXlsxData);
    } // 어드민만 체크
    else if(toggleAdmin.checked && !toggleUser.checked){
        parsingData(adminXlsxData);
    } // 유저만 체크
    else if(!toggleAdmin.checked && toggleUser.checked){
        parsingUserData(userXlsxData);
    }
}

function onClickView(e)
{
    if(Object.keys(userXlsxData).length  == 0)
    {
    	alert("사용자 마커 데어터를 업로드 해주세요.");
    	return;
    }
    
	$.ajax(
	{
		url : "insertAnalysis",
		method : "POST",
		dataType : "json",
		data : {"type" : e},
		success : function()
		{
		}
	});
	
    $('#analSaveBtn').css('display','block');
    $('.export_btn').css('display','block');
    parsingUserData(userXlsxData);
    document.getElementById("toggleUser").checked = true;
}


// ------------------------------------------------------
//                         모달
// ------------------------------------------------------
function drawModalChart(currentColumn){
    var modalTitle = document.querySelector(".modalTitle");
    modalTitle.innerText = currentColumn + "상세";
    
    var modalChart = document.querySelector(".modalChart");
    var chartElName = document.createElement("div");
    var chartEl = document.createElement("div");
    chartElName.classList.add("chartElName");
    chartEl.classList.add("modalChartEl");


    // 큰 틀 제작
    var percent = 100 / parseLengthData[currentColumn]
    for(var key in parseData[currentColumn]){
        var currentData = parseData[currentColumn][key];
        var chartStack = document.createElement("div");
        chartStack.classList.add("chartStack");
        chartStack.setAttribute("data-modalstackname", key + "_modalStackName");
        chartStack.setAttribute("data-modalstack", currentColumn + "_modalStack");
        chartStack.style.top = (percent * currentData.adminPos) + "%";

        if(parseData[currentColumn][key]["active"]){
            if(parseData[currentColumn][key]["isAdmin"]){
                chartStack.style.backgroundColor = "#F75320";
            }else{
                chartStack.style.backgroundColor = "#45BBE0";
            }
        }else{
            chartStack.style.backgroundColor = "#BFBFBF";
            chartStack.style.height = "1px";
        }
        chartEl.appendChild(chartStack);
    }

    var modalStackEls = document.querySelectorAll("[data-modalstack=" +key+ "_modalStack]"); 
    // 작은 스택 제작
    for(var key in parseData[currentColumn]){
        var currentData = parseData[currentColumn][key];
        if(currentData["active"]){
            var modalStackName = document.createElement("div");
            modalStackName.classList.add("chartStackName");
            modalStackName.setAttribute("data-modalname", "modalName");

            if(isAdminUser){
                modalStackName.innerHTML =key+"<br />"+"("+insertComma(currentData["adminPos"])+"bp)";
            }else{
                modalStackName.innerHTML =key+"<br />"+"("+roundToTwo(currentData["guestPos"])+"mb)";
            }
            modalStackName.style.top = (percent * currentData["adminPos"])+ "%";
            
            var chartStackLine = document.createElement('div');
            chartStackLine.classList.add("chartStackLine");
            chartStackLine.setAttribute("data-modalline", "modalLine");
            chartStackLine.style.top = (percent * currentData["adminPos"])+ "%";
            
            chartEl.appendChild(modalStackName);
            chartEl.appendChild(chartStackLine);
        }



    }
    chartElName.appendChild(chartEl);
    modalChart.appendChild(chartElName);

    // 설명, 라인 제작
    var stackName = document.querySelectorAll("[data-modalname=modalName]"); 
    var stackLine = document.querySelectorAll("[data-modalline=modalLine]"); 
    for(var i = 0 ; i < stackName.length ; i++){
        if(i!==0){
            var offsetBottom = stackName[i-1].offsetTop + stackName[i-1].offsetHeight;
            if(stackName[i].offsetTop < offsetBottom){
                stackName[i].style.top = offsetBottom + "px";
            }
        }

        // 설명 x, y 좌표
        var nameX = stackName[i].offsetLeft;
        var nameY = stackName[i].offsetTop + (stackName[i].offsetHeight/2);

        var stack = stackLine[i];
        
        // 스택 x, y 좌표
        var stackX = stack.offsetLeft + stack.offsetWidth;
        var stackY = stack.offsetTop + (stack.offsetHeight/2);

        // 각도구하기
        var x = nameX - stackX;
        var y = nameY - stackY;
        var radian = Math.atan2(y, x);
        var degree = radian * 180 / Math.PI // 라디안 -> 디그리 변환
        stackLine[i].style.transform = "rotate(" + degree + "deg)";

        // 가로길이 구하기
        stackLine[i].style.width = 
        Math.sqrt(
            Math.pow((nameY - stackY), 2) + Math.pow((Math.abs(nameX - stackX)), 2)
        ) - 10 + "px";

    }

    addEventStack(currentColumn)
}
function drawModalTable(currentColumn){
    var modalTableBody = document.querySelector(".modalTableBody");
    informationArr = [];
    for(var key in parseData[currentColumn]){
        var tr = document.createElement("tr");
        var tdInput = document.createElement("td");
        var tdId = document.createElement("td");
        var tdPos = document.createElement("td");
        var input = document.createElement("input");
        input.type = "checkbox";
        input.classList.add("modalTableInput");
        input.setAttribute("onclick", "onChangeModalCkBox(this, '"+currentColumn+"')");
        tdId.innerText = key;
        input.setAttribute('id', '_'+ key);
        if(isAdminUser){
            tdPos.innerText = insertComma(parseData[currentColumn][key]["adminPos"]);
        }else{
            tdPos.innerText = roundToTwo(parseData[currentColumn][key]["guestPos"]);
        }
        if(parseData[currentColumn][key]["active"]){
            input.checked=true;
            informationArr.push(key);
            tr.style.backgroundColor = "#F75320";
        }
        tdInput.appendChild(input);
        tr.appendChild(tdInput);
        tr.appendChild(tdId);
        tr.appendChild(tdPos);
        modalTableBody.appendChild(tr);
    }

    drawModalInformation(currentColumn);
}
function drawModalInformation(currentColumn){
    var _modalData = document.querySelector("#_modalData");
    var tbody = _modalData.querySelector("tbody");
    var tdEls = tbody.querySelectorAll("td");

    if(informationArr.length == 0){
        tdEls[1].innerText = "";
        tdEls[3].innerText = "";
        tdEls[5].innerText = "";
        tdEls[7].innerText = "";
        if(isAdminUser){
            tdEls[9].innerText = "";
        }
    }else{
        var currentInfo = informationArr[informationArr.length-1];
        var data = parseData[currentColumn][currentInfo];
        tdEls[1].innerText = currentInfo;
        tdEls[3].innerText = currentColumn;
        tdEls[5].innerText = data.guestPos + "bp";
        tdEls[7].innerText = data.purpose;
        if(isAdminUser){
            tdEls[9].innerText = data.order;
        }
    }
}
function addEventStack(currentColumn){
    var modalChart = document.querySelectorAll("[data-modalname='modalName']");
    for(var i = 0 ; i < modalChart.length ; i++){
        modalChart[i].addEventListener("click", function(e){
            var modalClickName = document.querySelectorAll(".modalClickName");
            for(var i = 0 ; i < modalClickName.length ; i++){
                modalClickName[i].classList.remove("modalClickName");
            }
            
            var innerT = e.target.innerText.replace(/(\r\n|\n|\r)/gm, "").split("(")[0];
            e.target.classList.add("modalClickName");


        })
    }

    var modalChartEl = document.querySelector(".modalChartEl");
    var chartStackEls = modalChartEl.querySelectorAll(".chartStack");
    for(var i = 0 ; i < chartStackEls.length ; i++){
        chartStackEls[i].addEventListener("click", function(e){
            var stackName = e.path[0].dataset.modalstackname.replace("_modalStackName", "");
            
            parseData[currentColumn][stackName]["active"] = !parseData[currentColumn][stackName]["active"];
            initModalChart();
            initModalModal();
            drawModalChart(currentColumn);
            drawModalTable(currentColumn);
        })
    }
}
function onClickModalBg(){
    document.querySelector(".modalWrap").style.display = "none";
    document.querySelector(".modalAllInput").checked=false;
    document.querySelector(".modalChart").style.transform = "scale(1)";
    document.querySelector(".modalSlider").value = 3;
    initModalChart();
    initModalModal();
    initChart();
    initTable();
    drawChart();
    drawTable();
}
function onClickZoom(isZoomIn){
    var modalChart = document.querySelector(".modalChart");
    var style = window.getComputedStyle(modalChart);
    var matrix = new WebKitCSSMatrix(style.transform);
    if(!isZoomIn && matrix.m11==0.4){return;}
    if(isZoomIn && matrix.m11==2.5){return;}
    var changeValue = matrix.m11 + (isZoomIn?0.3:-0.3)
    modalChart.style.transform = "scale(" + changeValue + ")"
    var modalSlider = document.querySelector(".modalSlider");
    modalSlider.value = Number(modalSlider.value) + (isZoomIn?1:-1)
}
function onChangeModalSlider(e){
    var modalChart = document.querySelector(".modalChart");
    var changeValue = 1;
    if(e.value == 1){
        changeValue = 0.4;
    }else if (e.value == 2){
        changeValue = 0.7;
    }else if (e.value == 3){
        changeValue = 1;
    }else if (e.value == 4){
        changeValue = 1.3;
    }else if (e.value == 5){
        changeValue = 1.6;
    }else if (e.value == 6){
        changeValue = 1.9;
    }else if (e.value == 7){
        changeValue = 2.2;
    }else if (e.value == 8){
        changeValue = 2.5;
    }else{
        changeValue = 1;
    }
    modalChart.style.transform = "scale(" + changeValue + ")"
}




// ------------------------------------------------------
//                         체크박스
// ------------------------------------------------------
// 전체 체크박스 토글 
function onChangeAllCkBox (e) {

    var tableInputEls = document.querySelectorAll(".tableInput");
    for(var i = 0 ; i < tableInputEls.length ; i++){
        tableInputEls[i].checked = e.checked;
    }
    for(var key in parseData){
        for(var keyStack in parseData[key]){
            parseData[key][keyStack]["active"] = e.checked;
        }
    }

    initChart();
    drawChart();


}
// 개별 체크박스 토글 
function onChangeCheckBox (e) { 
    return;

    if(!e.dataset.table){return};
    
    var columnName = e.parentElement.parentElement.children[1].innerText;

    var chartColoumn = document.querySelector("[data-column=" +columnName + "]");

    var selectStack = chartColoumn.querySelector("[data-stack=" +e.dataset.table+ "_stack]");
    var column = selectStack.parentElement.dataset.column;

    initChart();
    parseData[column][e.dataset.table]["active"] = e.checked;
    drawChart();
}
// 모달 개별 체크박스 토글
function onChangeModalCkBox(e, column){
    var stackName = e.parentElement.parentElement.children[1].innerText;

    var bgColor = "#fff";
    parseData[column][stackName]["active"] = e.checked;
    if(e.checked){
        informationArr.push(stackName);
        bgColor = "#F75320"
    }else{
        informationArr = informationArr.filter(item => item !== stackName)
    }

    e.parentElement.parentElement.style.backgroundColor = bgColor;


    initModalChart();
    drawModalChart(column);
    drawModalInformation(column);
}
// 모달 전체 체크박스 토글
function onChangeModalAllCkBox(e){
    var modalTitle = document.querySelector(".modalTitle").innerText;
    var column = modalTitle.replace("상세", "");
    var modalTableInput = document.querySelectorAll(".modalTableInput");
    
    informationArr = [];

    for(var key in parseData[column]){
        parseData[column][key]["active"] = e.checked;
        if(e.checked){ informationArr.push(key); }
    }
    var bgColor = "#fff";
    if(e.checked){
        bgColor = "#F75320"
    }
    for(var i = 0 ; i < modalTableInput.length ; i++){
        modalTableInput[i].checked = e.checked;
        modalTableInput[i].parentElement.parentElement.style.backgroundColor = bgColor;
    }

    initModalChart();
    drawModalChart(column);
    drawModalInformation(column);
}




// ------------------------------------------------------
//                         사진찍기
// ------------------------------------------------------
function downloadTableImg(){
    var excelHandler = {
        getExcelFileName : function(){
            return DateText(today) + "_maker_map_"+fileName+".xlsx";	//파일명
        },
        getSheetName : function(){
            return 'maker_map';	//시트명
        },
        getExcelData : function(){
            return document.querySelector('.table'); 	//TABLE id
        },
        getWorksheet : function(){
            return XLSX.utils.table_to_sheet(this.getExcelData());
        }
    }

    function s2ab(s) { 
        var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
        var view = new Uint8Array(buf);  //create uint8array as viewer
        for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
        return buf;    
    }
    
    function exportExcel(){ 
        // step 1. workbook 생성
        var wb = XLSX.utils.book_new();

        // step 2. 시트 만들기 
        var newWorksheet = excelHandler.getWorksheet();

        // step 3. workbook에 새로만든 워크시트에 이름을 주고 붙인다.  
        XLSX.utils.book_append_sheet(wb, newWorksheet, excelHandler.getSheetName());

        // step 4. 엑셀 파일 만들기 
        var wbout = XLSX.write(wb, {bookType:'xlsx',  type: 'binary'});

        // step 5. 엑셀 파일 내보내기 
        saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), excelHandler.getExcelFileName());
    }
    exportExcel();

    // captureFunc(".table", DateText(today) + "_maker_map_"+fileName+".png")
}
function downloadGraphImg(){
    var chartStackNameEls = document.querySelectorAll(".chartStackName");
    var nameTop = 0;
    var nameRight = 0;

    if(chartStackNameEls.length!==0){
        for(var i = 0 ; i < chartStackNameEls.length ; i++){
            if(nameTop < chartStackNameEls[i].offsetTop){
                nameTop = chartStackNameEls[i].offsetTop;
            }
            if(nameRight < chartStackNameEls[i].offsetLeft + chartStackNameEls[i].offsetWidth){
                nameRight = chartStackNameEls[i].offsetLeft + chartStackNameEls[i].offsetWidth
            }
        }
    
        captureFunc(".chartContainer", DateText(today) + "_maker_table_"+fileName+".png", true, nameTop + 100, nameRight);
    }else{
        captureFunc(".chartContainer", DateText(today) + "_maker_table_"+fileName+".png", true);
    }

    // for(var i = 0 ; i < chartStackNameEls.length ; i++){
    //     if(nameTop < chartStackNameEls[i].offsetTop){
    //         nameTop = chartStackNameEls[i].offsetTop;
    //     }
    //     if(nameRight < chartStackNameEls[i].offsetLeft + chartStackNameEls[i].offsetWidth){
    //         nameRight = chartStackNameEls[i].offsetLeft + chartStackNameEls[i].offsetWidth
    //     }
    // }

    // captureFunc(".chartContainer", "마커맵 그래프", true, nameTop + 100, nameRight);
}
function downloadModalImg(){
    document.querySelector(".modalChart").style.transform = "scale(1)";
    document.querySelector(".modalSlider").value = 3;
    var modalChartWrap = document.querySelector(".modalChartWrap"); 
    var modalChartEl = document.querySelector(".modalChartEl");
    var chartStackNameEls = modalChartEl.querySelectorAll(".chartStackName");
    if(chartStackNameEls.length !== 0){
        var lastStackName = chartStackNameEls[chartStackNameEls.length-1]
        var lastStackNameY = lastStackName.offsetTop+lastStackName.offsetHeight;
    }
    
    window.scrollTo(0,0);
    var cloneParent = document.createElement('div');
    cloneParent.classList.add("cloneParent");
    var cloneEl = document.querySelector(".modalChartWrap").cloneNode(true);
    
    if(lastStackNameY > 634){
        cloneEl.style.height = (lastStackNameY+10) + "px";
    }
    cloneEl.style.width = (modalChartWrap.offsetWidth + 40) + "px";

    var captureName = document.createElement('div');
    captureName.innerHTML = `
        <div>
            ${clickName} <br />
            ${insertComma(parseLengthData[clickName])}
        </div>
    `
    cloneEl.style.display = "flex";
    cloneEl.style.flexDirection = "column";
    cloneEl.insertBefore(captureName ,cloneEl.firstChild) 

    cloneParent.appendChild(cloneEl);
    document.querySelector("body").appendChild(cloneParent);
    html2canvas(cloneEl).then(function(canvas){
        var myImage = canvas.toDataURL();
        downloadURI(myImage, DateText(today) + "_maker_modal_map_"+fileName+".png") 
    });

}
function captureFunc(className, imgName, isOverflow, _height, _width, isModal){
    window.scrollTo(0,0);
    var cloneParent = document.createElement('div');
    cloneParent.classList.add("cloneParent");
    var cloneEl = document.querySelector(className).cloneNode(true);
    // if(isOverflow){
    //     cloneEl.children[0].style.overflow = "unset"
    //     cloneEl.style.height = _height + "px"
    //     cloneEl.style.width = "unset"
    // }
    
    if(isOverflow){
        cloneEl.style.width = "unset"
        cloneEl.style.height = "unset"
        cloneEl.children[0].style.overflow = "unset"
    }
    // if(_height){
    //     cloneEl.style.height = _height + "px"
    // }
    if(_width){
        cloneEl.style.width = "unset"
    }


    cloneParent.appendChild(cloneEl);
    document.querySelector("body").appendChild(cloneParent);
    html2canvas(cloneEl).then(function(canvas){
        var myImage = canvas.toDataURL();
        downloadURI(myImage, imgName) 
    });
}
function downloadURI(uri, name){
	var link = document.createElement("a")
	link.download = name;
	link.href = uri;
	document.body.appendChild(link);
	link.click();
    document.querySelector(".cloneParent").remove();
}
// 날짜 변환
function DateText(date){
    var month = String(date.getMonth()+1);
    var _date = String(date.getDate());
    
    if(month.length == 1){
        month = "0"+String(date.getMonth()+1);
    }
    if(_date.length == 1){
        _date = "0"+String(date.getDate());
    }

    return (date.getFullYear() + month + _date)
}
function onClickDownload(){
    var downloadSelectBox = document.querySelector(".downloadSelectBox");  
    var selectText = downloadSelectBox.options[downloadSelectBox.selectedIndex].innerText;
    if(selectText == "파일 선택"){
        alert("옵션을 선택해주세요.")
    }else if(selectText == "map"){
        downloadGraphImg();
    }else if(selectText == "table"){
        downloadTableImg();
    }
}



// ------------------------------------------------------
//                         초기화
// ------------------------------------------------------
function initChart(){
    var chartContainer = document.querySelector(".chartContainer");
    chartContainer.innerHTML = '<div class="chartWrap"></div>';
}
function initTable(){
    var markerTbody = document.querySelector(".markerTbody");
    markerTbody.innerHTML = "";
}
function initModalChart(){
    var modalChart = document.querySelector(".modalChart");
    modalChart.innerHTML = "";
}
function initModalModal(){
    var modalTableBody = document.querySelector(".modalTableBody");
    modalTableBody.innerHTML = "";
}


// ------------------------------------------------------
//                         공통
// ------------------------------------------------------
function insertComma(int){
    return (String(int).replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,'))
}


function onChangeVersion(){
    parseData = {};
    lengthData = [];
    parseLengthData = {};
    isAdminUser = true;
    gffData = {};
    adminXlsxData = {};
    userXlsxData = {};
    today = new Date();
    fileName = "";

    clickId = "";

    initChart();
    initTable();
    initModalChart();
    initModalModal();

    readLenFile();
    readMakerFile();
    readGffFile();
}



function readLenFile()
{
    // var file = 'http://112.169.63.197:8893/common/r/result/20211116203538/1637062538739.len';
    var file = document.querySelector(".serverLen").innerText;
    if(!file){console.error("serverLen Empty"); return;};

    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status == 404){
                alert("Len파일을 찾을 수 없습니다.")
                console.error("Len file 404");
                return;
            }

            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                var newLengthData = allText.replace(/(\r\n|\n|\r)/gm, "-");
                newLengthData = newLengthData.split("-");
                lengthData = [];
                for(var i = 0 ; i < newLengthData.length ; i++){
                    if(!newLengthData[i]){continue}
                    var lengthEl = newLengthData[i].split(" ");
                    lengthData.push([lengthEl[0], lengthEl[1]]);
                }
            }
        }
    }
    rawFile.send(null);
}
function readMakerFile()
{
    var _url = document.querySelector(".serverMaker").innerText;
    if(!_url){console.error("serverMaker Empty"); return};
    // var _url = 'http://112.169.63.197:8893/common/r/result/20211116203538/1637062538884.xlsx';
    var _jsonData = {
      name: 'webisfree',
      url: 'webisfree.com'
    };
    
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        
      if (this.readyState == 4 && this.status == 200) {
        var _data = this.response;

        let file = new File([_data], "result.xlsx",{type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});    

            var reader = new FileReader();
            reader.onload = function () {
                var data = reader.result;
                var workBook = XLSX.read(data, { type: 'binary' });
                workBook.SheetNames.forEach(function (sheetName) {
                    var rows = XLSX.utils.sheet_to_json(workBook.Sheets[sheetName]);
                    var xlsxData = JSON.parse(JSON.stringify(rows));
                    adminXlsxData = xlsxData;
                    parsingData(xlsxData);
                })
            };
            reader.readAsBinaryString(file);

      };
    };
    
    xhr.open('POST', _url);
    xhr.responseType = 'blob';
    xhr.setRequestHeader('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    xhr.send(_jsonData);

}
function readGffFile()
{
    var file = document.querySelector(".serverGff").innerText;
    // var file = "http://112.169.63.197:8893/common/r/result/20211116203538/1637062538810.gff";
    if(!file){console.error("serverGff Empty"); return};
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status == 404){
                alert("Gff파일을 찾을 수 없습니다.")
                console.error("Gff file 404");
                return;
            }

            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                var splitLengthData = allText.split(";");

                var newLengthData = {};
                for(var i = 0 ; i < splitLengthData.length ; i++){

                    if(splitLengthData[i].indexOf("ID=") !== -1 && splitLengthData[i].indexOf("Name=") == -1 && splitLengthData[i] !== ""){
                        var newTextArr = splitLengthData[i].split(" ")[0].split("\t");
                        var chr = newTextArr[0].split("\n");
                        var id = newTextArr[newTextArr.length-1].replace("ID=", "");
                        if(newLengthData[id.split(":")[0]]){
                            continue;
                        }else{
                            newLengthData[id.split(":")[0]] = {
                                chr : chr[chr.length-1],
                                pos : newTextArr[4],
                                id : id.split(":")[0]
                            }
                        }
                    }
                }
                gffData = newLengthData;
            }
        }
    }
    rawFile.send(null);
}

readLenFile();
readMakerFile();
readGffFile();