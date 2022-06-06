
var parseData = {};
var lengthData = [];
var parseLengthData = {};
var parseGuestLengthData = {};
var isAdminUser = true;
var gffData = {};
var adminXlsxData = {};
var userXlsxData = {};
var userParseData = {};
var today = new Date();
var fileName = "";
var clickName = "";
var clickId = "";
var informationArr = [];
var parseSearchGffData = {};
var searchValue = [];
var containId = [];
var autoStatus = false;
var _url = "";

// sort
var chrSort = true; 
var idSort = true; 
var posSort = false; 
var moleSort = true; 

var _giffLoad = false;
var _lenLoad = false;
var _checkRenderInterval = null;

function isAdmin(){
    var out_list = document.querySelectorAll(".out_list");
    if(out_list.length == 4){
        isAdminUser = true;
    }else{
        var tbody = document.querySelector(".name_table tbody");
        if(tbody.querySelectorAll("tr")[4]){
            tbody.querySelectorAll("tr")[4].remove();
        }
        isAdminUser = false;
    }
    changePosText();
    console.log(isAdminUser)
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
   //var newData = data.replace(/(\t)/gm, "@");
    //newData = newData.replace(/(\r\n|\n|\r)/gm, "SJH11HI").split("SJH11HI");


    
    var splitLengthData = data.split("\n");
    var newLengthData = {};
    for(var i = 0 ; i < splitLengthData.length ; i++){

        //splitLengthData[i].indexOf("ID=") !== -1 && splitLengthData[i].indexOf("Name=") == -1 && 
        if(splitLengthData[i].indexOf("gene") !== -1 && splitLengthData[i] !== "" ){
            var newTextArr = splitLengthData[i].split(" ")[0].split("\t");
            var chr = newTextArr[0].split("\n");

            if(splitLengthData[i].split("ID=").length <= 1)
                continue;

            var id = splitLengthData[i].split("ID=")[1];

            //.split(":")[0]
            if(newLengthData[id.toUpperCase()]){
                continue;
            }else{
                newLengthData[id.toUpperCase()] = {
                    chr : chr[chr.length-1],
                    pos : newTextArr[4],
                    id : id.toUpperCase().split(";")[0]
                }
            }
        }
    }

    gffData = newLengthData;

/*
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

            if(sentenceArr[2]!=="gene"){continue};

            if( newGffData[id] ){
                continue;
            }else{
                newGffData[id] = {
                    chr : sentenceArr[0].toLowerCase(),
                    pos : sentenceArr[4],
                    id : id,
                }
            }
        }catch{console.err(i + "_ index _ gff parse Error"); return;}
    }

    if(Object.keys(newGffData).length == 0){
        alert("잘못된 Gff파일입니다.");
        console.error("newGffData empty");
    }
    gffData = newGffData;*/
}
// table pos 단위 설정
function changePosText(){
    var unit = isAdminUser?"(bp)":"";
    var tablePos = document.querySelectorAll(".tablePos");
    for(var i = 0 ; i < tablePos.length ; i++){
        tablePos[i].innerText = "Pos" + unit;
    }
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
        // workBook.SheetNames.forEach(function (sheetName) {
            var rows = XLSX.utils.sheet_to_json(workBook.Sheets[workBook.SheetNames[0]]);
            var xlsxData = JSON.parse(JSON.stringify(rows));
            adminXlsxData = xlsxData;
            
            parsingData(xlsxData);
        // })
    };
    reader.readAsBinaryString(input.files[0]);
}

/* 표시용위치 맥스값 찾기  */
function getMaxGuestMbNumber(data){
	var maxNum = 0;
	for(var key in data){ maxNum = maxNum > Number(data[key].guestPos) ? maxNum : Number(data[key].guestPos); }
	return maxNum;
}

function getExcelTitleFromData(data,search){
	for(var key in data){
		if(key.toLowerCase().includes(search)){
			return key;
		}
	}
	return search;
}

// # . 2 데이터 파싱
function parsingData(xlsxData){
    // 염색체 대분류 나누기
    let bigParseData = {}

    var test = "";
    for(var i = 0 ; i < xlsxData.length ; i++){

        var keyTitle = getExcelTitleFromData(xlsxData[i],"염색체");

        var currentCategory = xlsxData[i][keyTitle];
        
        if(currentCategory){test = currentCategory}

        for(var j = 0 ; j < lengthData.length ; j++){
            if(lengthData[j][0] == currentCategory){
                parseLengthData[currentCategory] = Number(lengthData[j][1]);
                parseData[currentCategory] = parseData[currentCategory]?parseData[currentCategory]:{};
                bigParseData[currentCategory] = bigParseData[currentCategory]?bigParseData[currentCategory]:[];
                bigParseData[currentCategory].push(xlsxData[i]);
            }
        }
    }

    parseLengthData = sortObj(parseLengthData)
    if(!test){
        alert("표준 유전체 등록 시 잘못 된 형식의 분자표지 데이터가 등록되었습니다.");
        return;
    }
    if(Object.keys(parseData).length==0){
        alert("잘못된 버전의 마커 세트입니다.");
        console.error("parseData {}");
        return;
    }


    for(var key in bigParseData){
		//alert("currentData : " + bigParseData[key].length);
        for(var i = 0 ; i < bigParseData[key].length ; i++){

            var currentData = bigParseData[key][i];            
			var excelTitle_1 = getExcelTitleFromData(currentData,"분자표지명");
            var excelTitle_2 = getExcelTitleFromData(currentData,"표시용위치");
            var excelTitle_3 = getExcelTitleFromData(currentData,"실제위치");
            var excelTitle_4 = getExcelTitleFromData(currentData,"용도");
            var excelTitle_5 = getExcelTitleFromData(currentData,"서열");

            parseData[key][currentData[excelTitle_1]] = {
                guestPos: currentData[excelTitle_2],
                adminPos: currentData[excelTitle_3],
                active : false,
                isAdmin : true,
                purpose: currentData[excelTitle_4],
                order: currentData[excelTitle_5],
                molecule: currentData["분자표지보유"]>=1?"O":"X"
            }
        }
        
        parseGuestLengthData[key] = getMaxGuestMbNumber(parseData[key]).toFixed(2);
    }

    // parseData = sortObj(parseData)
    for(let key in parseData){
        parseData[key] = Object.fromEntries(Object.entries(parseData[key]).sort(([,a], [,b]) => a.adminPos - b.adminPos))
    }

    // drawTable();
    // drawChart();
}
function sortObj(obj){
    return Object.fromEntries(Object.entries(obj).sort(([a,],[b,])=>  a.localeCompare(b)))
}

// ------------------------------------------------------
//                         유저
// ------------------------------------------------------
// # . 1 엑셀 data 가져오기
function readUserExcel(){
    var input = event.target;
    var reader = new FileReader();
    reader.onload = function () {
        var fileForm = input.files[0].name.split(".")[1];
        if(fileForm !== "xlsx"){
            alert(".xlsx 파일이 아닙니다.");
            event.target.value = null;
            return
        };

        document.querySelector(".file_text").value = input.files[0].name;        
        
        var data = reader.result;
        var workBook = XLSX.read(data, { type: 'binary' });
        // workBook.SheetNames.forEach(function (sheetName) {
            var rows = XLSX.utils.sheet_to_json(workBook.Sheets[workBook.SheetNames[0]]);
            var xlsxData = JSON.parse(JSON.stringify(rows));
            document.querySelector(".selectFirst").innerHTML = "<option disabled selected>부본 선택</option>";
            document.querySelector(".selectSecond").innerHTML = "<option disabled selected>모본 선택</option>";;
            userXlsxData = xlsxData;
            parsingUserData(xlsxData);
        // })
        
        // readMakerFile();
   		// initVisualWrap();
    };
    
		 reader.readAsBinaryString(input.files[0]);
}
// # . 2 데이터 파싱
function parsingUserData(xlsxData){
    let newUserParseData = {};
    for(var i = 0 ; i < xlsxData.length ; i++){
        for(var key in xlsxData[i]){
        	var title_1 = getExcelTitleFromData(xlsxData[i],"염색체명");
        	var title_2 = getExcelTitleFromData(xlsxData[i],"위치(bp)");
			var title_3 = getExcelTitleFromData(xlsxData[i],"분자표지명");
        	
            if(key !== title_1 && key !== title_2){
				if(xlsxData[i][key]=="A" || xlsxData[i][key]=="B" || xlsxData[i][key]=="H"){
			       newUserParseData[key]=newUserParseData[key]?newUserParseData[key]:[];
			       newUserParseData[key].push( xlsxData[i][key] );
				}
            }
        }
    }

    var adminMap = {};
    var titlePivot = getExcelTitleFromData(xlsxData[0],"분자표지명");
    
    for(var i = 0 ; i < adminXlsxData.length; i++){
        let curPivotTitle = getExcelTitleFromData(adminXlsxData[i],"분자표지명"); 
        adminMap[adminXlsxData[i][curPivotTitle]] = adminXlsxData[i]; 
    }

    // 염색체 대분류 나누기
    let bigParseData = {}

    var test = "";
    for(var i = 0 ; i < xlsxData.length ; i++){

        var keyTitle = getExcelTitleFromData(xlsxData[i],"염색체명");

        var currentCategory = xlsxData[i][keyTitle];
        
        if(currentCategory){test = currentCategory}

        for(var j = 0 ; j < lengthData.length ; j++){
            if(lengthData[j][0] == currentCategory){
                parseLengthData[currentCategory] = Number(lengthData[j][1]);
                parseData[currentCategory] = parseData[currentCategory]?parseData[currentCategory]:{};
                bigParseData[currentCategory] = bigParseData[currentCategory]?bigParseData[currentCategory]:[];
                bigParseData[currentCategory].push(xlsxData[i]);
            }
        }

        let curTitle = getExcelTitleFromData(adminMap[xlsxData[i][titlePivot]],"염색체");
        if(!currentCategory && adminMap[xlsxData[i][titlePivot]] && adminMap[xlsxData[i][titlePivot]][curTitle]){
            
            console.log(adminMap[xlsxData[i][titlePivot]][curTitle]);

            currentCategory = adminMap[xlsxData[i][titlePivot]][curTitle];
            for(var j = 0 ; j < lengthData.length ; j++){
                console.log(lengthData[j][0] + " " + currentCategory);
                if(lengthData[j][0] == currentCategory){
                    parseLengthData[currentCategory] = Number(lengthData[j][1]);
                    parseData[currentCategory] = parseData[currentCategory]?parseData[currentCategory]:{};
                    bigParseData[currentCategory] = bigParseData[currentCategory]?bigParseData[currentCategory]:[];
                    bigParseData[currentCategory].push(adminMap[xlsxData[i][titlePivot]]);
                }
            }
        }
    }

    for(var key in bigParseData){
		//alert("currentData : " + bigParseData[key].length);
        for(var i = 0 ; i < bigParseData[key].length ; i++){
			/*
            var currentData = bigParseData[key][i];            
			var excelTitle_1 = getExcelTitleFromData(currentData,"분자표지명");
            var excelTitle_2 = getExcelTitleFromData(currentData,"위치");
            var excelTitle_3 = getExcelTitleFromData(currentData,"실제위치");
            var excelTitle_4 = getExcelTitleFromData(currentData,"용도");
            var excelTitle_5 = getExcelTitleFromData(currentData,"서열");

            parseData[key][currentData[excelTitle_1]] = {
                guestPos: currentData[excelTitle_2],
                adminPos: currentData[excelTitle_2],
                active : false,
                isAdmin : true,
                purpose: currentData[excelTitle_4],
                order: currentData[excelTitle_5],
                molecule: "X"
            }		
			*/
            var currentData = bigParseData[key][i];            
			var excelTitle_1 = getExcelTitleFromData(currentData,"분자표지명");
            var excelTitle_2 = getExcelTitleFromData(currentData,"위치");
            var excelTitle_3 = getExcelTitleFromData(currentData,"위치");
            var excelTitle_4 = getExcelTitleFromData(currentData,"용도");
            var excelTitle_5 = getExcelTitleFromData(currentData,"서열");

            parseData[key][currentData[excelTitle_1]] = {
                guestPos: currentData[excelTitle_2]/1000000,
                adminPos: currentData[excelTitle_3],
                active : false,
                isAdmin : true,
                purpose: currentData[excelTitle_4],
                order: currentData[excelTitle_5],
                molecule: currentData["분자표지보유"]>=1?"O":"X"
            }


        }
        
        parseGuestLengthData[key] = getMaxGuestMbNumber(parseData[key]).toFixed(2);
    }

    parseData = sortObj(parseData)

    if(Object.keys(newUserParseData).length == 0){
        alert("잘못된 엑셀파일입니다.");
        console.error("parsingData newUserParseData empty")
        return;
    }

    userParseData = newUserParseData;
    drawOption();
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
    

    var _parseData = parseData;
    if(searchValue.length !== 0){
        _parseData = parseSearchGffData;
    }
    

    // 큰 틀 제작
    for(var key in parseLengthData){
        var chartElName = document.createElement('div');
        var chartEl = document.createElement('div');
        var chartName = document.createElement('div');
        chartElName.classList.add("chartElName")
        chartEl.classList.add("chartEl")
        chartName.classList.add("chartName")
        
        
        if(isAdminUser){
        	chartName.innerHTML = key + "<br /> (" + insertComma(parseLengthData[key]) + "bp)";
        }else{
        	chartName.innerHTML = key + "<br /> (" + insertComma(parseGuestLengthData[key]) + ")";
        }
        
        chartEl.style.height = parseLengthData[key] * highPercent + "%";
        var _key = key;
        if(key.replace(/[0-9]/g,"") == ""){
            _key = "ONELENGTH" + _key;
        }

        chartEl.setAttribute("data-column", _key.replaceAll(".", "_DOT_"));

        // 스택 제작
        var stackPercent = 100 / parseLengthData[key];
        for(var keyStack in _parseData[key]){

            var chartStack = document.createElement('div');
            chartStack.classList.add("chartStack");
            var newKeyStack = keyStack.replace("/", "slash");
            
            chartStack.setAttribute("data-stack", "DEVQWE"+newKeyStack + "_stack");
            // 높이
            chartStack.style.top = (stackPercent * _parseData[key][keyStack]["adminPos"])+ "%";
            
            if(_parseData[key][keyStack]["active"]){
                if(_parseData[key][keyStack]["isAdmin"]){
                    chartStack.style.backgroundColor = "#F75320";
                }else{
                    chartStack.style.backgroundColor = "#45BBE0";
                }
                chartStack.style.height = "3px"
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
        var divEl = document.querySelector("[data-column='" + _key.replaceAll(".", "_DOT_")+ "']");
        var stackPercent = 100 / parseLengthData[key];
        var highMarginR = 0;
        for(var keyStack in _parseData[key]){
            if(_parseData[key][keyStack]["active"]){
                // 이름
                var chartStackName = document.createElement('div');
                chartStackName.classList.add("chartStackName");
                chartStackName.setAttribute("data-stackname", _key.replaceAll(".", "_DOT_") + "_stackName"); // 컬럼 분기
                var newKeyStack = keyStack.replace("/", "slash");
                chartStackName.setAttribute("data-stacknamerow", newKeyStack + "_stackNameRow"); // 스택 분기
                if(isAdminUser){
                    chartStackName.innerHTML =keyStack+"<br />"+"("+insertComma(roundToTwo( _parseData[key][keyStack]["adminPos"] > 10000 ? _parseData[key][keyStack]["adminPos"] / 1000000 : _parseData[key][keyStack]["adminPos"] ))+"bp)";
                }else{
                    chartStackName.innerHTML =keyStack+"<br />"+"("+roundToTwo(_parseData[key][keyStack]["guestPos"])+")";
                }
                chartStackName.style.top = (stackPercent * _parseData[key][keyStack]["adminPos"])+ "%";
                
                if(clickId == newKeyStack){
                    chartStackName.style.border = "2px solid #000";
                    chartStackName.style.padding = "5px";
                }

                // 라인
                var chartStackLine = document.createElement('div');
                chartStackLine.classList.add("chartStackLine");
                chartStackLine.setAttribute("data-stackline", _key.replaceAll(".", "_DOT_") + "_stackLine");
                chartStackLine.style.top = (stackPercent * _parseData[key][keyStack]["adminPos"])+ "%";
                
                divEl.appendChild(chartStackLine);
                divEl.appendChild(chartStackName);
                
                // 최대 이름 길이
                if(highMarginR < chartStackName.offsetWidth){
                    highMarginR = chartStackName.offsetWidth;
                }
            }
        }

        if(highMarginR!==0){
            divEl.parentElement.style.marginRight = (highMarginR + 60) + "px";
        }

        var stackName = document.querySelectorAll("[data-stackname='" +_key.replaceAll(".", "_DOT_")+ "_stackName']"); 
        var stackLine = document.querySelectorAll("[data-stackline='" +_key.replaceAll(".", "_DOT_")+ "_stackLine']"); 
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
            // var stack = document.querySelector("[data-stack=" +row+ "_stack]");
            var stack = document.querySelector("[data-stack='DEVQWE" +row+ "_stack']");
            
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
    for(var key in parseData){
        for(var keyStack in parseData[key]){
            drawTableEl(key, keyStack)
        }
    }
    addClickEventTable();
}

// # . 3-1 정렬 테이블 그리기
function drawSortTable(type){
    initTable();
    var newParseData = [];
    for(var key in parseData){
        for(var keyStack in parseData[key]){
            var stackEl = parseData[key][keyStack];
            stackEl.keyStack = keyStack;
            stackEl.key = key;
            stackEl.adminPos = stackEl.adminPos ? stackEl.adminPos : 0 
            stackEl.guestPos = stackEl.guestPos ? stackEl.guestPos : 0
            
            newParseData.push(stackEl);
        }
    }
    if(type == "idSort"){
        newParseData.sort((a, b) => 
            idSort?
            a.keyStack.localeCompare(b.keyStack):
            b.keyStack.localeCompare(a.keyStack)
        );
        idSort = !idSort;
    }else if(type == "posSort"){
        newParseData.sort((a, b) => posSort? a.guestPos-b.guestPos : b.guestPos-a.guestPos  );
        posSort = !posSort;

    }else if(type=="moleSort"){
        newParseData.sort((a, b) => 
        moleSort?
            a.molecule.localeCompare(b.molecule):
            b.molecule.localeCompare(a.molecule)
        );
        moleSort = !moleSort;
    }

    for(var i = 0 ; i < newParseData.length ; i++){
        var key = newParseData[i].key;
        var keyStack = newParseData[i].keyStack;
        drawTableEl(key, keyStack)
    }
    addClickEventTable();
}
// # . 3-1 실질적으로 그리는 곳 
function drawTableEl(key, keyStack){
    var stackEl = parseData[key][keyStack];

    var tr = document.createElement('tr');
    var tdInputWrap = document.createElement('td');
    var tdInput = document.createElement('input');
    var tdChr = document.createElement('td');
    var trId = document.createElement('td');
    var trPos = document.createElement('td');
    var trMolecule = document.createElement('td');
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
        trPos.innerText = insertComma(stackEl["adminPos"]) != "undefined" ? 
        insertComma(roundToTwo(Number(stackEl["adminPos"]) > 10000 ? Number(stackEl["adminPos"]) / 1000000 : Number(stackEl["adminPos"]) ))
        : 
        roundToTwo(stackEl["guestPos"]) ? roundToTwo(stackEl["guestPos"]) : 0;
    }else{
        trPos.innerText = roundToTwo(stackEl["guestPos"]) ? roundToTwo(stackEl["guestPos"]) : 0;
    }
    // trMolecule.innerText = 
    if(clickId == keyStack){
        tr.classList.add("activeEl");
        // tr.style.border = "2px solid #000";
    }
    trMolecule.innerText = stackEl["molecule"];
    tdInputWrap.appendChild(tdInput);
    tr.appendChild(tdInputWrap);
    tr.appendChild(tdChr);
    tr.appendChild(trId);
    tr.appendChild(trPos);
    tr.appendChild(trMolecule);
    document.querySelector(".markerTbody").appendChild(tr);
}
// 차트 클릭 
function addClickEventChart(){
    var chartEls = document.querySelectorAll(".chartEl");
    for(var i = 0 ; i < chartEls.length ; i++){
        chartEls[i].addEventListener("dblclick", function(e){
            var currentTarget = e.target;        
            var currentColumn = "";     
            if(currentTarget.classList.contains("chartEl")){
                currentColumn = currentTarget.dataset.column.replaceAll("_DOT_", ".").replaceAll("ONELENGTH", "");
            }else{
                currentColumn = currentTarget.parentElement.dataset.column.replaceAll("_DOT_", ".").replaceAll("ONELENGTH", "");
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
            
            var currentChr = e.target.parentElement.dataset.column.replaceAll("_DOT_", ".").replaceAll("ONELENGTH", "");
            var clickData = e.target.dataset.stack.replace("_stack", "");
            
            clickId = clickData;

			if(parseData[currentChr][clickData]["active"] == true){
				parseData[currentChr][clickData]["active"] = false;
			}else 
				parseData[currentChr][clickData]["active"] = true;
            
            initChart();
            initTable();
            drawChart();
            drawTable();

            var newStack = document.querySelector("[data-stack='DEVQWE"+clickData+"_stack']");
            var newTable = document.querySelector("[data-tableid='"+clickData+"']");

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
            initGffData();
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
            
            var newStack = document.querySelector("[data-stack='DEVQWE"+id+"_stack']");
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

    if(e.value.length < 4){
        alert("검색어를 4글자 이상 입력해주세요");
    }
    
    if(!e.value){
        initGffData();
        initChart();
        initTable();
        drawChart();
        drawTable();
        return
    }

    searchValue = [];
    var searchCount = 0;
	var searchKey = e.value.toUpperCase();
    
    parseSearchGffData = {};
    for(var key in parseData){
        parseSearchGffData[key] = {};
    }

    for(var key in gffData){
        if(key.toUpperCase().includes(searchKey)){
            var _data = gffData[key];
            if(!parseSearchGffData[_data.chr]){continue}
            searchValue.push(key);
            parseSearchGffData[_data.chr][key] = {
                active:true,
                adminPos:Number(_data["pos"]) > 10000 ? Number(_data["pos"]) / 1000000 : Number(_data["pos"]) ,
                guestPos:_data["pos"] / 1000000,
                isAdmin:true,
                order:"",
                purpose:"",   
            }

            
            if(++searchCount > 100){
                break;
            }
        }
    }
    console.log(_searchValue);

    for(var key in parseSearchGffData){
        sliceObj(parseSearchGffData[key], 100, key);
    }

    if(searchValue.length == 0){
        initGffData();
        alert("검색결과가 없습니다.")
    }
    initChart();
    initTable();
    drawChart();
    drawTable();
}
// gff 초기화
function initGffData(){
    parseSearchGffData = {};
    searchValue = [];
    document.querySelector(".chartInput").value = "";
}
// obj 자르기
function sliceObj(_obj, sliceCount, key){
    let obj = _obj;
    
    if(Object.keys(obj).length == 0){return;}
    let keyArr = Object.keys(obj);
    if(sliceCount < keyArr.length){
      keyArr = keyArr.splice(sliceCount)
      keyArr.map(item => {
        delete obj[item];
      })
    };
    parseSearchGffData[key] = obj;
}



function checkIsUserMarkerValiable(xlsxData){
	let bigParseData = {}
    for(var i = 0 ; i < xlsxData.length ; i++){
    
    	let title = getExcelTitleFromData(xlsxData[i],"염색체");
        var currentCategory = xlsxData[i][title];
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
        alert("사용자 마커 세트를 추가해주세요.");
        return false;
    }
    return true;
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

	if(e.id == "toggleUser" && toggleUser.checked){
		if(Object.keys(userXlsxData).length  == 0)
	    {
	    	alert("파일을 업로드 해주세요.");
	    	toggleUser.checked = false;
	    	return;
	    }
   	}

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
    	alert("파일을 업로드 해주세요.");
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
            chartStack.style.height = "3px"
        }else{
            chartStack.style.backgroundColor = "#BFBFBF";
            chartStack.style.height = "1px";
        }
        chartEl.appendChild(chartStack);
    }

    var modalStackEls = document.querySelectorAll("[data-modalstack='" +key+ "_modalStack']"); 
    // 작은 스택 제작
    for(var key in parseData[currentColumn]){
        var currentData = parseData[currentColumn][key];
        if(currentData["active"]){
            var modalStackName = document.createElement("div");
            modalStackName.classList.add("chartStackName");
            modalStackName.setAttribute("data-modalname", "modalName");

            if(isAdminUser){
                modalStackName.innerHTML =key+"<br />"+"("+ insertComma( roundToTwo(( currentData["adminPos"] >= 10000 ? currentData["adminPos"] / 1000000 : currentData["adminPos"] ))) + "bp)";
            }else{
                modalStackName.innerHTML =key+"<br />"+"("+  Number(currentData["guestPos"]).toFixed(2) +")";
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
            tdPos.innerText = insertComma( roundToTwo(( parseData[currentColumn][key]["adminPos"] >= 10000 ? parseData[currentColumn][key]["adminPos"] / 1000000 : parseData[currentColumn][key]["adminPos"] )));
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
    var selectFirst  = document.querySelector(".selectFirst ").children;
    if(selectFirst.length == 1){return;}
    selectFirst = [...selectFirst];

    tbody.innerHTML = "";

    var trTitle = document.createElement("tr");
    trTitle.innerHTML = "<td></td>";
    for(var i = 1 ; i < selectFirst.length ; i++){
        var tdTitle = document.createElement("td");
        tdTitle.innerText = selectFirst[i].innerText;
        trTitle.appendChild(tdTitle);
    }

    

    var isFirst = true;
    for(var key in parseData[currentColumn]){
        if(parseData[currentColumn][key]["active"]){
            for(var i = 0 ; i < userXlsxData.length ; i++){
                if(userXlsxData[i]["분자표지명"] == key){
                    var trDesc = document.createElement("tr");
                    trDesc.innerHTML = `<td>${userXlsxData[i]["분자표지명"]}</td>`
                    for(var k in userXlsxData[i]){
                        if(k!=="번호" && k!=="분자표지명"){
                            var tdType = document.createElement('td');
                            tdType.innerText = userXlsxData[i][k];
                            trDesc.appendChild(tdType);
                        }
                    }
                    if(isFirst){
                        isFirst = false;
                        //tbody.appendChild(trTitle);
                    }
                    tbody.appendChild(trDesc);
                }
            }
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
    autoStatus = false;
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
//                         Select Box
// ------------------------------------------------------
// 옵션 추가
function drawOption(){
    var selectFirst = document.querySelector(".selectFirst");
    for(var key in userParseData){
        var newOption = document.createElement("option");
        newOption.innerText = key;
        selectFirst.appendChild(newOption);
    }
    var selectSecond = document.querySelector(".selectSecond");
    for(var key in userParseData){
        var newOption = document.createElement("option");
        newOption.innerText = key;
        selectSecond.appendChild(newOption);
    }

}
// 셀렉트 박스 변경 감지
function onchangeSelect(){
    var selectFirst = document.querySelector(".selectFirst");
    var currentOptionF = selectFirst.options[selectFirst.selectedIndex].innerText;

    var selectSecond = document.querySelector(".selectSecond");
    var currentOptionS = selectSecond.options[selectSecond.selectedIndex].innerText;

    if(currentOptionF == "부본 선택" || currentOptionS == "모본 선택"){
        return;
    }

    var containIndex = [];
    for(var i = 0 ; i < userParseData[currentOptionF].length ; i++){
        if(userParseData[currentOptionF][i] !== userParseData[currentOptionS][i]){
            containIndex.push(i);
        }
    } 

    
    var newContainId = [];
    for(var i = 0 ; i < containIndex.length ; i++){
        newContainId.push(userXlsxData[containIndex[i]]["분자표지명"]); 
    }
    containId = newContainId;

    for(var key in parseData){
        for(var keyStack in parseData[key]){
            parseData[key][keyStack]["active"] = containId.some(item => item == keyStack);
        }
    }

    initChart();
    initTable();
    drawChart();
    drawTable();
}

// ------------------------------------------------------
//                         체크박스
// ------------------------------------------------------
// 전체 체크박스 토글 
function onChangeAllCkBox (e) {
    initGffData();
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
    initGffData();
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
        captureFunc(".chartContainer", DateText(today) + "_polymorphic_table_"+fileName+".png", true, nameTop<400?null:nameTop + 100, nameRight);
    }else{
        captureFunc(".chartContainer", DateText(today) + "_polymorphic_table_"+fileName+".png", true);
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
    cloneEl.style.border = "1px solid #000";
    if(lastStackNameY > 634){
        cloneEl.style.height = (lastStackNameY+50) + "px";
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
    cloneEl.insertBefore(captureName ,cloneEl.firstChild);



    cloneParent.appendChild(cloneEl);
    document.querySelector("body").appendChild(cloneParent);
    html2canvas(cloneEl).then(function(canvas){
        var myImage = canvas.toDataURL();
        downloadURI(myImage, DateText(today) + "_polymorphic_modal_map_"+fileName+".png") 
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
    if(_height){
        cloneEl.style.height = _height + "px"
    }
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
    gffData = {};
    chrTotalData = {};
    chrTotalIndex = 0;
    parseLengthData = {};
    highLength = 0;

    userXlsxData = [];
    userParseData = {};
    containId = [];

    clickName = "";

    _giffLoad = false;
    _lenLoad = false;
    today = new Date();
    autoStatus = false;

    clickId = "";

    initChart()
    initTable()
    initModalChart()
    initModalModal()
    
    readLenFile();
    readGffFile();


    _checkRenderInterval = setInterval(function(){
        if(_giffLoad && _lenLoad){
            readMakerFile();
            clearInterval(_checkRenderInterval);
        }
    }, 500);

}

function onClickPolyRun(e)
{
    if(document.querySelector(".type_select").value == "작목 선택"){
        alert("작목과 유전체 DB 버전을 선택해 주세요."); return;
    }

    if(document.querySelector(".type_select_info").value == "none"){
        alert("작목과 유전체 DB 버전을 선택해 주세요."); return;
    }    

	if(Object.keys(userParseData).length == 0 ){
        alert("분석 데이터를 업로드 해 주세요."); return;
    }

    if(document.querySelector(".selectFirst").value == "부본 선택"){
        alert("부본을 선택해 주세요.");
        return;
    }
    
    if(document.querySelector(".selectSecond").value == "모본 선택"){
        alert("모본을 선택해 주세요.")
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
    
    $("#polySaveBtn").css('display','block');
    $('#memo').css('display','flex');
    $('.commonBtn').css('display','block');
    $('.export_btn').css('display','block'); 
    // readMakerFile();
    initVisualWrap();
    onchangeSelect()
    // initChart();
    // initTable();
    // drawChart();
    // drawTable();
    changePosText();
}
function initVisualWrap(){
    document.querySelector(".visualWrap").innerHTML = `
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
                    <!-- <div style="margin-right: auto; margin-left:10px;" class="commonBtn download" onclick="downloadGraphImg()">내려받기</div> -->
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
                        </th>
                        <th>
                            <label>Id</label>
                        </th>
                        <th>
                            <label class="tablePos">Pos</label>
                        </th>
                        <th>
                            <label>분자표지보유</label>
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
            <div class="chartContainer">
                <div class="chartWrap"></div>
            </div>
        </div>
    </div>
    `
    addSortEvent();
}


// ------------------------------------------------------
//                         자동 분석 클릭
// ------------------------------------------------------
function onClickanalytics(){

    var polyModalInput = document.querySelector("#polyModalInput");
    var _value = polyModalInput.value;
    var gapArr = [];


    // 자동분석 값이 없을때 
    if(!_value){
        var modalTableBody = document.querySelector(".modalTableBody");
        var trEls = modalTableBody.children;
        for(var i = 0 ; i < trEls.length ; i++){
            gapArr.push(trEls[i].children[1].innerText)
        }
    
    }else{ // 자동분석 값이 있을때
        var dataObj = parseData[clickName];
        var posArr = [];
        for(var key in dataObj){
            posArr.push({
                pos: dataObj[key].adminPos,
                id : key
            });
        };

        var high = Number(parseLengthData[clickName]);
        _value = Number(_value);
        
        for(var i = _value ; i < high ; i = i + _value){
            //for(var i = 0 ; i > _value ; i = i + _value){
            var nearId = "";
            var gap = 999999999999;
            var test = 0;

            for(var j = 0 ; j < posArr.length - 1; j++){
                if(posArr[j].pos <= i && posArr[j].pos >= i-_value){
                    var currentGap = Math.abs(posArr[j].pos - i);
                    if(currentGap < gap){
                        gap = currentGap;
                        nearId = posArr[j].id;
                        test = posArr[j].pos;
                    }
                }
            }
            if(nearId){
                gapArr.push(nearId)
            }
        }
    
    }

    
    var set = new Set(gapArr);
    var autoCount = 0;
    gapArr = [...set];
    autoStatus = true;


    var auto = setInterval(() => {
        if(gapArr.length == autoCount || !autoStatus){
            /*
            initModalChart();
            initModalModal();
            if(autoStatus){
                drawModalChart(clickName);
                drawModalTable(clickName);
            }*/

            autoCount = 0;
            clearInterval(auto);
            return;
        }


        for(var key in parseData[clickName]){
            parseData[clickName][key]["active"] = false;
        }

        for(let i = 0 ; i <= autoCount;i++){
            parseData[clickName][gapArr[i]]["active"] = true;
        }
        initModalChart();
        initModalModal();
        drawModalChart(clickName);
        drawModalTable(clickName);
        
    	autoCount++;
    }, 1000);
    
    
}

document.addEventListener("DOMContentLoaded", function(){
    document.querySelector("#crop_selection").addEventListener("change", function(e){
        document.querySelector(".file_text").value = "";
        document.querySelector("#input-file").value = "";
    })
    document.querySelector("#genomic_information").addEventListener("change", function(e){
        document.querySelector(".file_text").value = "";
        document.querySelector("#input-file").value = "";
    });
    addSortEvent();

});

// 정렬 ---- 
function addSortEvent(){
    var thEls = document.querySelector(".table thead tr").children;
    // Chr 정렬
    thEls[1].addEventListener("click", function(){
        parseData = chrSort?
            Object.fromEntries(Object.entries(parseData).sort().reverse()):
            Object.fromEntries(Object.entries(parseData).sort());

        chrSort = !chrSort;
        initTable();
        drawTable();
    });
    // Id 정렬
    thEls[2].addEventListener("click", function(){
        drawSortTable("idSort");
    })
    // Pos 정렬
    thEls[3].addEventListener("click", function(){
        drawSortTable("posSort");
    })
    // 분자표지보유 정렬
    thEls[4].addEventListener("click", function(){
        drawSortTable("moleSort");
    })

}

function readLenFile()
{

    // var file = 'digit/common/r/result/20211116203538/1637062538739.len';
    var file = document.getElementsByClassName("serverLen")[0].innerHTML;
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
                    _lenLoad = true;
                }
            }
        }
    }
    rawFile.send(null);
}
function readMakerFile()
{
    if(_url == document.getElementsByClassName("serverMaker")[0].innerHTML){return;}
    _url = document.getElementsByClassName("serverMaker")[0].innerHTML;
    if(!_url){console.error("serverMaker Empty"); return};
    // var _url = 'digit/common/r/result/20211116203538/1637062538884.xlsx';
    var _jsonData = {
      name: 'webisfree',
      url: 'webisfree.com'
    };
    
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        
        if(this.status == 404){
            alert("마커 세트를 찾을 수 없습니다.")
        }

      if (this.readyState == 4 && this.status == 200) {
        var _data = this.response;

        let file = new File([_data], "result.xlsx",{type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});    

            var reader = new FileReader();
            reader.onload = function () {
                var data = reader.result;
                var workBook = XLSX.read(data, { type: 'binary' });
                // workBook.SheetNames.forEach(function (sheetName) {
                    var rows = XLSX.utils.sheet_to_json(workBook.Sheets[workBook.SheetNames[0]]);
                    var xlsxData = JSON.parse(JSON.stringify(rows));
                    adminXlsxData = xlsxData;
                    parsingData(xlsxData);
                // })
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
    var file = document.getElementsByClassName("serverGff")[0].innerHTML;
    // var file = "digit/common/r/result/20211116203538/1637062538810.gff";
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

                    if(splitLengthData[i].indexOf("gene") !== -1 && splitLengthData[i].indexOf("ID=") !== -1 && splitLengthData[i].indexOf("Name=") == -1 && splitLengthData[i] !== ""){
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
                _giffLoad = true;
            }
        }
    }
    rawFile.send(null);
}

readLenFile();
readMakerFile();
readGffFile();

