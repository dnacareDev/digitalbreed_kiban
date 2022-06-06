


// var xlsxData = [];
var parseData = {};
var lengthData = [];
var gffData = {};
var chrTotalData = {};
var chrTotalIndex = 0;
var parseLengthData = {};
var highLength = 0;

var userXlsxData = [];
var userParseData = {};
var containId = [];

var clickName = "";

var today = new Date();
var autoStatus = false;

var clickId = "";

var modalInfoArr = [];


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

    if(Object.keys(newGffData).length == 0){
        alert("잘못된 Gff파일입니다.")
        console.error("newGffData empty");
        return;
    }

    gffData = newGffData;
}



// ------------------------------------------------------
//                         어드민
// ------------------------------------------------------
// # . 1 엑셀 data 가져오기
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
            parsingData(xlsxData);
        })
    };
    reader.readAsBinaryString(input.files[0]);
}
// # . 2 데이터 파싱
function parsingData(xlsxData){
    var newXlsxData = {};

    for(var i = 0 ; i < xlsxData.length ; i++){
        for(var key in xlsxData[i]){
            // if(key!=="ID"&&key!=="pos"&&key!=="chr"&&key!=="f"&&key!=="m"){
            if(key!=="ID"&&key!=="pos"&&key!=="chr"){
                var currentData = xlsxData[i];
                if(currentData["pos"]!=="-"){
                    newXlsxData[key] = newXlsxData[key]?newXlsxData[key]:{};
                    newXlsxData[key][currentData["chr"]]=newXlsxData[key][currentData["chr"]]?newXlsxData[key][currentData["chr"]]:{};

                    newXlsxData[key][currentData["chr"]][currentData["ID"]] = {
                        type: currentData[key],
                        pos : currentData["pos"],
                        chr : currentData["chr"],
                    }
                    chrTotalData[currentData["chr"]]=0;
                }
            }
        }
    }

    if(Object.keys(newXlsxData).length == 0){
        alert("잘못된 엑셀파일입니다.");
        console.error("parsingData newXlsxData empty")
        return;
    }

    // len 데이터 나누기
    for(var key in chrTotalData){
        for(var i = 0 ; i < lengthData.length ; i++){
            if( lengthData[i][0].toUpperCase() ==key.toUpperCase()){
                parseLengthData[key] = lengthData[i][1]
            }
        }
    }

    var newHighLength = 0;
    // len 총 합
    for(var key in parseLengthData){
        if(newHighLength < Number(parseLengthData[key])){
            newHighLength = Number(parseLengthData[key])
        }
        chrTotalIndex += Number(parseLengthData[key]);
    }
    highLength = newHighLength;
    parseData = newXlsxData;
    // drawChart();
    // drawTable();
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
        workBook.SheetNames.forEach(function (sheetName) {
            var rows = XLSX.utils.sheet_to_json(workBook.Sheets[sheetName]);
            var xlsxData = JSON.parse(JSON.stringify(rows));
            document.querySelector(".selectFirst").innerHTML = "<option disabled selected>부본 선택</option>";
            document.querySelector(".selectSecond").innerHTML = "<option disabled selected>모본 선택</option>";;
            userXlsxData = xlsxData;
            parsingUserData(xlsxData);
        })
        
        readMakerFile();
   		// initVisualWrap();
    };
    
    reader.readAsBinaryString(input.files[0]);
}
// # . 2 데이터 파싱
function parsingUserData(xlsxData){
    let newUserParseData = {};
    for(var i = 0 ; i < xlsxData.length ; i++){
        for(var key in xlsxData[i]){
            if(key!=="번호"&&key!=="분자표지명"){
                newUserParseData[key]=newUserParseData[key]?newUserParseData[key]:[];
                newUserParseData[key].push( xlsxData[i][key] );
            }
        }
    }

    if(Object.keys(newUserParseData).length == 0){
        alert("잘못된 엑셀파일입니다.");
        console.error("parsingData newUserParseData empty")
        return;
    }

    userParseData = newUserParseData;
    drawOption();
}



// ------------------------------------------------------
//                         차트 & 테이블
// ------------------------------------------------------
// # . 3 차트 그리기
function drawChart(){
    // if(containId.length!==0){
    //     console.log("containId 존재")
    // }
    // console.log("-----------------------------------------")
    // console.log("-----------------------------------------")
    // console.log("-----------------------------------------")
    // console.log("parseData -- ");
    // console.log(parseData);
    // console.log("lengthData -- ")
    // console.log(lengthData);
    // console.log("parseLengthData -- ")
    // console.log(parseLengthData)
    // console.log("chrTotalData -- ")
    // console.log(chrTotalData);
    // console.log("chrTotalIndex -- ");
    // console.log(chrTotalIndex);
    // console.log("highLength -- ");
    // console.log(highLength);
    // console.log("containId -- ");
    // console.log(containId);


    var percent = 100 / highLength;
    var chartWrap = document.querySelector(".chartWrap");

    var chrPosData = parseData[Object.keys(parseData)[0]];

    // 큰 틀
    for(var key in parseLengthData){
        var chartElName = document.createElement("div");
        var chartName = document.createElement("div");
        var chartEl = document.createElement("div");
        chartElName.classList.add("chartElName");
        chartName.classList.add("chartName");
        chartEl.classList.add("chartEl");
        chartEl.setAttribute("data-column", key);
        chartName.innerHTML = key + " <br /> (" + insertComma(parseLengthData[key]) + "bp)";
        chartEl.style.height = (Number(parseLengthData[key]) * percent) + "%";
        
        // 스택
        for(var keyStack in chrPosData[key]){
            var chartStack = document.createElement("div");
            chartStack.classList.add("chartStack");
            
            var currnetData = chrPosData[key][keyStack];
            chartStack.style.top = (( currnetData["pos"]/Number(parseLengthData[key]) ) * 100) + "%";
            chartStack.setAttribute("data-id", keyStack);
            
            // 타입 다른거 체크
            if(containId.length!==0){
                for(var i = 0 ; i < containId.length ; i++){
                    if(containId[i] == keyStack){

                        chartStack.style.backgroundColor = "#F75320";
                        chartStack.style.height = "2px";
                        chartStack.setAttribute("data-activetack", "active");

                        var chartStackName = document.createElement("div");
                        var chartStackLine = document.createElement("div");
                        chartStackName.classList.add("chartStackName");
                        chartStackName.style.top = (( currnetData["pos"]/Number(parseLengthData[key]) ) * 100) + "%";
                        chartStackName.setAttribute("data-stackname", key+"_stackname");
                        
                        chartStackLine.classList.add("chartStackLine");
                        chartStackLine.setAttribute("data-stackline", key+"_stackline");
                        chartStackLine.style.top = (( currnetData["pos"]/Number(parseLengthData[key]) ) * 100) + "%";
                        
                        // chartStackName.innerText = keyStack;
                        chartStackName.innerHTML = `${keyStack}<br />${insertComma(chrPosData[key][keyStack]["pos"]) }`;

                        if(keyStack == clickId){
                            chartStackName.style.padding = "5px";
                            chartStackName.classList.add("activeEl")
                        }

                        chartEl.appendChild(chartStackLine);
                        chartEl.appendChild(chartStackName);
                    }
                }
            }
            chartEl.appendChild(chartStack);
        }

        chartElName.appendChild(chartName);
        chartElName.appendChild(chartEl);
        chartWrap.appendChild(chartElName);



        var stackNameEls = document.querySelectorAll("[data-stackname="+key+"_stackname]");
        var stackLineEls = document.querySelectorAll("[data-stackline="+key+"_stackline]");
        

        var marginRight = 0;
        // 이름 top값 조정
        for(var i = 0 ; i < stackNameEls.length ; i++){
            if(i !== 0  || stackNameEls.length==1){

                if(stackNameEls.length!==1){
                    var currentEl = stackNameEls[i];
                    var prevEl = stackNameEls[i-1];
                    var offsetBottom = prevEl.offsetTop + prevEl.offsetHeight;
                    // 탑값
                    if(currentEl.offsetTop < offsetBottom){
                        stackNameEls[i].style.top = offsetBottom + "px";
                    }
                    // 마진값
                    if(currentEl.offsetLeft + currentEl.offsetWidth > marginRight){
                        marginRight = currentEl.offsetLeft + currentEl.offsetWidth;
                    }
                }else{
                    var currentEl = stackNameEls[i];
                    marginRight = currentEl.offsetLeft + currentEl.offsetWidth;
                }

            }

            // 설명 x, y 좌표
            var nameX = stackNameEls[i].offsetLeft;
            var nameY = stackNameEls[i].offsetTop + (stackNameEls[i].offsetHeight/2);

            // var row = stackNameEls[i].dataset.stackname.replace("_stackname", "");
            // var stack = document.querySelector("[data-id=" +row+ "_stack]");
            
            // 스택 x, y 좌표
            var stackX = stackLineEls[i].offsetLeft + stackLineEls[i].offsetWidth;
            var stackY = stackLineEls[i].offsetTop + (stackLineEls[i].offsetHeight/2);

            // 각도구하기
            var x = nameX - stackX;
            var y = nameY - stackY;
            var radian = Math.atan2(y, x);
            var degree = radian * 180 / Math.PI // 라디안 -> 디그리 변환
            stackLineEls[i].style.transform = "rotate(" + degree + "deg)";

            // 가로길이 구하기
            stackLineEls[i].style.width = 
            Math.sqrt(
                Math.pow((nameY - stackY), 2) + Math.pow((Math.abs(nameX - stackX)), 2)
            ) - 10 + "px";

        }

        // 이름에 따른  그래프 간격 조절 (marginRight)
        if(marginRight!==0){
            var columnWrap = document.querySelector("[data-column="+key+"]");
            columnWrap.parentElement.style.marginRight = marginRight + "px"
        }

    }
    addClickEvChart();
}
// # . 3 테이블 그리기
function drawTable(){

    var markerTbody = document.querySelector(".markerTbody");
     
    var firstData = parseData[Object.keys(parseData)[0]];

    for(var keyChr in firstData){
        for(var keyId in firstData[keyChr]){
            var tr = document.createElement('tr');
            var trCheck = document.createElement('td');
            var input = document.createElement('input');
            var tdChr = document.createElement('td');
            var trId = document.createElement('td');
            var trPos = document.createElement('td');

            input.type = "checkbox";
            input.classList.add("tableInput");
            input.setAttribute("onchange", "onChangeTableInput(this)")
            tdChr.innerText = keyChr;
            trId.innerText = keyId;
            trPos.innerText = insertComma(firstData[keyChr][keyId]["pos"]);

            for(var i = 0 ; i < containId.length ; i++){
                if(keyId == containId[i]){
                    tr.style.backgroundColor = "#F75320";
                    input.checked = true;
                }
            }
            trId.setAttribute("data-tableid" , keyId);

            if(clickId == keyId){
                tr.classList.add("activeEl")    
            }
            trCheck.appendChild(input);
            tr.appendChild(trCheck);
            tr.appendChild(tdChr);
            tr.appendChild(trId);
            tr.appendChild(trPos);
            markerTbody.appendChild(tr)
        }
    }
    
    addClickEventTable();
}
// 차트 클릭 & 모달 차트/표 그리기
function addClickEvChart(){
    var chartEls = document.querySelectorAll(".chartEl")



    // 더블 클릭
    for(var i = 0 ; i < chartEls.length ; i++){
        chartEls[i].addEventListener("dblclick", function(e){
            var currentEl = null;
            if(e.path[0].classList.contains("chartEl")){
                currentEl = e.path[0];
            }else{
                currentEl = e.path[1];
            }


            // 모달 활성화
            var modalWrap = document.querySelector(".modalWrap");
            modalWrap.style.display = "flex";

            // 차트 복사
            // var cloneEl = currentEl.cloneNode(true);
            // cloneEl.style.width = "36px";
            // document.querySelector(".modalChart").appendChild(cloneEl);
            
            clickName = currentEl.dataset.column;
            document.querySelector(".modalTitle").innerText = clickName + " 상세";
            drawModalTable(clickName);
            drawModalChart(clickName);
            drawModalInformation(clickName, true);
        })
    }

    // 클릭
    var chartStackEls = document.querySelectorAll('.chartStack');
    for(var i = 0 ; i < chartStackEls.length ; i++){
        chartStackEls[i].addEventListener("click", function(e){
            var currentId = e.target.dataset.id;
            var isContain = false;

            for(var j = 0 ; j < containId.length ; j++){
                if(containId[j] == currentId){
                    isContain = true;
                }
            }


            if(!isContain){
                console.log("x")
                containId.push(currentId);
            }else{
                console.log("o")
                containId = containId.filter(item => item !== currentId);
            }
            
            clickId = currentId;
            initChart();
            initTable();
            drawChart();
            drawTable();

            var newStack = document.querySelector("[data-id="+currentId+"]");
            var newTableStack = document.querySelector("[data-tableid="+currentId+"]");
            if(newStack){
                $('.chartWrap').animate({scrollLeft : newStack.parentElement.offsetLeft}, 0);
                // $('.markerTbody').animate({scrollTop : newTable.offsetTop - 25}, 0); 
            }
            if(newTableStack){
                $('.markerTbody').animate({scrollTop : newTableStack.offsetTop - 25}, 0); 
            }

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
            // var chr = "";
            if(e.target.classList.contains("tableInput")){
                id = e.path[2].children[2].innerText;
                // chr = e.path[2].children[1].innerText;
                e.path[2].classList.add("activeEl");
                e.path[2].children[0].children[0].checked = e.path[2].children[0].children[0].checked;
            }else{
                id = e.path[1].children[2].innerText;
                // chr = e.path[1].children[1].innerText;
                e.path[1].classList.add("activeEl");
                e.path[1].children[0].children[0].checked = !e.path[1].children[0].children[0].checked;
            }

            var isContain = false;
            for(var i = 0 ; i < containId.length ; i++){
                if(containId[i] == id){
                    isContain = true;
                }
            }

            clickId = id;

            var bgColor = "";
            if(!isContain){
                containId.push(id);
                bgColor = "#F75320";
            }else{
                containId = containId.filter(item => item !== id);
                bgColor = "#fff";
            }

            if(e.target.classList.contains("tableInput")){
                e.path[2].style.backgroundColor = bgColor;
            }else{
                e.path[1].style.backgroundColor = bgColor
            }

            initChart();
            drawChart();

            // var clickText = e.parentElement.parentElement.children[2].innerText
            // if(e.checked){
            //     e.parentElement.parentElement.style.backgroundColor = "#F75320";
            //     containId.push(clickText); 
            // }else{
            //     containId = containId.filter(e=>e!==clickText);
            //     e.parentElement.parentElement.style.backgroundColor = "#fff";
            // }

            var newStack = document.querySelector("[data-id="+id+"]");
            if(newStack){
                $('.chartWrap').animate({scrollLeft : newStack.parentElement.offsetLeft}, 0);
            }
            
            // initTable();
            // drawTable();
            // var newTable = document.querySelector("[data-tableid="+id+"]");
            // $('.markerTbody').animate({scrollTop : newTable.offsetTop - 25}, 0); 
            
        })
    }
}
// 모달 차트 그리기
function drawModalChart(currentEl){
    var modalChart = document.querySelector(".modalChart");

    var chartEl = document.createElement("div");
    chartEl.classList.add("chartEl");
    var orginChrEl = document.querySelector("[data-column="+currentEl+"]");

    chartEl.style.width = "36px";
    chartEl.style.height = orginChrEl.offsetHeight + "px";

    var percent =  100/parseLengthData[currentEl];

    var clickChrObj = parseData[Object.keys(parseData)[0]][currentEl];
    for(var key in clickChrObj){
        var chartStack = document.createElement("div");
        chartStack.classList.add("chartStack");
        chartStack.style.top = (percent * clickChrObj[key]["pos"]) + "%";
        chartStack.setAttribute("data-modalid", key);

        // // 타입 다른거 체크
        if(containId.length!==0){
            for(var i = 0 ; i < containId.length ; i++){
                if(containId[i] == key){
                    chartStack.style.backgroundColor = "#F75320";
                    chartStack.style.height = "2px";
                    chartStack.setAttribute("data-activetack", "active");

                    var chartStackName = document.createElement("div");
                    var chartStackLine = document.createElement("div");
                    chartStackName.classList.add("chartStackName");
                    chartStackName.style.top = (( clickChrObj[key]["pos"]/Number(parseLengthData[currentEl]) ) * 100) + "%";
                    chartStackName.setAttribute("data-stackname", "modalstackname");
                    
                    chartStackLine.classList.add("chartStackLine");
                    chartStackLine.setAttribute("data-stackline", "modalstackline");
                    chartStackLine.style.top = (( clickChrObj[key]["pos"]/Number(parseLengthData[currentEl]) ) * 100) + "%";
                    
                    chartStackName.innerText = key;

                    chartEl.appendChild(chartStackLine);
                    chartEl.appendChild(chartStackName);
                }
            }
        }
        chartEl.appendChild(chartStack);
    }
    modalChart.appendChild(chartEl);

    var stackNameEls = document.querySelectorAll("[data-stackname=modalstackname]");
    var stackLineEls = document.querySelectorAll("[data-stackline=modalstackline]");

    // 이름 top값 조정
    for(var i = 0 ; i < stackNameEls.length ; i++){
        if(i !== 0  || stackNameEls.length==1){

            if(stackNameEls.length!==1){
                var currentEl = stackNameEls[i];
                var prevEl = stackNameEls[i-1];
                var offsetBottom = prevEl.offsetTop + prevEl.offsetHeight;
                // 탑값
                if(currentEl.offsetTop < offsetBottom){
                    stackNameEls[i].style.top = offsetBottom + "px";
                }
            }else{
                var currentEl = stackNameEls[i];
            }

        }

        // 설명 x, y 좌표
        var nameX = stackNameEls[i].offsetLeft;
        var nameY = stackNameEls[i].offsetTop + (stackNameEls[i].offsetHeight/2);

        // 스택 x, y 좌표
        var stackX = stackLineEls[i].offsetLeft + stackLineEls[i].offsetWidth;
        var stackY = stackLineEls[i].offsetTop + (stackLineEls[i].offsetHeight/2);

        // 각도구하기
        var x = nameX - stackX;
        var y = nameY - stackY;
        var radian = Math.atan2(y, x);
        var degree = radian * 180 / Math.PI // 라디안 -> 디그리 변환
        stackLineEls[i].style.transform = "rotate(" + degree + "deg)";

        // 가로길이 구하기
        stackLineEls[i].style.width = 
        Math.sqrt(
            Math.pow((nameY - stackY), 2) + Math.pow((Math.abs(nameX - stackX)), 2)
        ) - 10 + "px";

    }

    addEventStack();
}
// 모달 표 그리기
function drawModalTable(currentEl){
    var chrData = parseData[Object.keys(parseData)[0]][currentEl];
    var modalTableBody = document.querySelector(".modalTableBody");
    for(var key in chrData ){
        var tr = document.createElement("tr");
        var tdCheck = document.createElement("td");
        var input = document.createElement("input");
        var tdId = document.createElement("td");
        var tdPos = document.createElement("td");

        input.type = "checkbox";
        tdId.innerText = key;
        tdPos.innerText = insertComma(chrData[key]["pos"]);

        if(containId.length!==0){
            for(var i = 0 ; i < containId.length ; i++){
                if(containId[i] == key){
                    input.checked = true;
                    tr.style.backgroundColor = "#F75320"
                }
            }
        }

        input.setAttribute("onchange", "onChangeModalInput(this)")
        tdCheck.appendChild(input);
        tr.appendChild(tdCheck);
        tr.appendChild(tdId);
        tr.appendChild(tdPos);
        modalTableBody.appendChild(tr);
    }
}
// 모달 아래 정보 그리기
function drawModalInformation(currentEl, isFirst){
    if(isFirst){
        modalInfoArr = [];
        var currentArr = document.querySelectorAll("[data-stackname = "+currentEl+"_stackname]");
        for(var i = 0 ; i < currentArr.length ; i++){
            var currentHTML =  currentArr[i].innerHTML;
            currentHTML = currentHTML.split("<br>")[0];
            modalInfoArr.push(currentHTML);
        }
    }

    var tbody = document.querySelector(".name_table tbody");
    tbody.innerHTML = "";
    if(modalInfoArr.length == 0){return;}

    var currentId = modalInfoArr[modalInfoArr.length-1];



    var trTitle = document.createElement('tr');
    var trDesc = document.createElement('tr');
    for(var key in parseData){
        var tdTitle = document.createElement('td');
        var tdDesc = document.createElement('td');
        // tdTitle.style.width="50px";
        // tdDesc.style.width="50px";
        tdTitle.innerText = key;
        tdDesc.innerText = parseData[key][currentEl][currentId]["type"];
        
        trTitle.appendChild(tdTitle);
        trDesc.appendChild(tdDesc);
    }
    tbody.appendChild(trTitle);
    tbody.appendChild(trDesc);
}



// ------------------------------------------------------
//                         GFF 검색
// ------------------------------------------------------
function onChangeGff(e){
    if(!e.value){return}

    var searchValue = [];

    for(var key in gffData){
        if(key.includes(e.value)){
            if(!containId.some(item => item == key)){
                searchValue.push(key);
            }
        }
    }

    if(searchValue.length !== 0){
        for(var i = 0 ; i < searchValue.length ; i++){
            var searchStack = document.querySelector("[data-id="+searchValue[i]+"]");
            if(searchStack){
                containId.push(searchValue[i]);
            }
        }
        initChart();
        initTable();
        drawChart();
        drawTable();
    }

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

    if(currentOptionF == "첫번째 유전자 선택" || currentOptionS == "두번째 유전자 선택"){
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
    // var containId = [];
    // for(var key in parseData[currentOptionF]){
    //     for(var keySamll in parseData[currentOptionF][key]){
    //         if(parseData[currentOptionF][key][keySamll]["type"] !== parseData[currentOptionS][key][keySamll]["type"]){
    //             containId.push(keySamll);
    //         }
    //     }
    // }
    initChart();
    initTable();
    drawChart();
    drawTable();
}



// ------------------------------------------------------
//                         Check Box
// ------------------------------------------------------
// 체크박스 토글
function onChangeTableInput(e){
    return;

    var clickText = e.parentElement.parentElement.children[2].innerText
    if(e.checked){
        e.parentElement.parentElement.style.backgroundColor = "#F75320";
        containId.push(clickText); 
    }else{
        containId = containId.filter(e=>e!==clickText);
        e.parentElement.parentElement.style.backgroundColor = "#fff";
    }

    initChart();
    drawChart();
}
// 모달 체크박스 토글
function onChangeModalInput(e){
    var clickText = e.parentElement.parentElement.children[1].innerText;

    var bgColor = "#fff";
    if(e.checked){
        containId.push(clickText);
        modalInfoArr.push(clickText);
        bgColor = "#F75320"
    }else{
        containId = containId.filter(item => item!==clickText);
        modalInfoArr = modalInfoArr.filter(item => item!==clickText);
    };
    e.parentElement.parentElement.style.backgroundColor = bgColor;

    initModalChart();
    // initModalTable();
    drawModalChart(clickName);
    // drawModalTable(clickName);
    drawModalInformation(clickName);
}
// 전체 체크박스 토글
function onChangeAllCkBox (e) {

    var tableInputEls = document.querySelectorAll(".tableInput");
    containId = [];
    for(var i = 0 ; i < tableInputEls.length ; i++){
        tableInputEls[i].checked = e.checked;
        var bgColor = "";
        
        if(e.checked){
            bgColor = "#F75320";
        }else{
            bgColor = "#fff";
        }

        tableInputEls[i].parentElement.parentElement.style.backgroundColor = bgColor;
        if(e.checked){
            containId.push(tableInputEls[i].parentElement.parentElement.children[2].innerText);
        }
    }

    initChart();
    drawChart();
}
// 모달 전체 체크박스 토글
function onChangeModalAllCkBox(e){
    var modalTableBody = document.querySelector(".modalTableBody");
    var inputEls = modalTableBody.querySelectorAll("input");
    containId = [];
    for(var i = 0 ; i < inputEls.length ; i++){
        inputEls[i].checked = e.checked;
        if(e.checked){
            containId.push(inputEls[i].parentElement.parentElement.children[1].innerText)
        }

        if(e.checked){
            bgColor = "#F75320";
        }else{
            bgColor = "#fff";
        }
        inputEls[i].parentElement.parentElement.style.backgroundColor = bgColor;
    }
    modalInfoArr = containId;
    initModalChart();
    drawModalChart(clickName);
    drawModalInformation(clickName);
}



// ------------------------------------------------------
//                         모달
// ------------------------------------------------------
function onClickModalBg(){
    if(autoStatus){containId=[];}
    autoStatus = false;
    var modalWrap = document.querySelector(".modalWrap");
    modalWrap.style.display = "none";
    document.querySelector(".modalChart").innerHTML = "";
    document.querySelector(".modalTableBody").innerHTML = "";
    initChart();
    initTable();
    initModalChart();
    initModalTable()
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
function addEventStack(){
    var modalChart = document.querySelector(".modalChart");
    var chartStackEls = modalChart.querySelectorAll(".chartStack");
    chartStackEls = Array.prototype.slice.call(chartStackEls);

    for(var i = 0 ; i < chartStackEls.length-1 ; i++){
        chartStackEls[i].addEventListener("click", function(e){
            let index = chartStackEls.indexOf(e.target);
            var _id = chartStackEls[index].dataset.modalid;

            if(containId.some(item => item == _id)){
                containId = containId.filter(item => item !== _id);
            }else{
                containId.push(_id);
            }
            
            initModalChart();
            initModalTable();
            drawModalChart(clickName);
            drawModalTable(clickName);
        })
    }


}


// ------------------------------------------------------
//                         초기화
// ------------------------------------------------------
function initChart(){
    document.querySelector(".chartWrap").innerHTML = "";
}
function initTable(){
    document.querySelector(".markerTbody").innerHTML = "";
}
function initModalChart(){
    document.querySelector(".modalChart").innerHTML = "";
}
function initModalTable(){
    document.querySelector(".modalTableBody").innerHTML = "";
}



// ------------------------------------------------------
//                         이미지 캡쳐
// ------------------------------------------------------
function downloadTableImg(){
    var fileName = document.querySelector(".file_text").value;
    var name = DateText(today)+ "_polymorphic_maker_table_"+fileName;
    var excelHandler = {
        getExcelFileName : function(){
            return `${name}.xlsx`;	//파일명
        },
        getSheetName : function(){
            return "polymorphic_maker_table";	//시트명
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

    // var fileName = document.querySelector(".file_text").value;
    // captureFunc(".table", DateText(today)+ "_polymorphic_maker_table_"+fileName+".png");
}
function downloadGraphImg(){
    var fileName = document.querySelector(".file_text").value;

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
    
        captureFunc(".chartContainer", DateText(today)+ "_polymorphic_maker_map_"+fileName+".png", false, nameTop, nameRight);
    }else{
        captureFunc(".chartContainer", DateText(today)+ "_polymorphic_maker_map_"+fileName+".png", true);
    }
}
function downloadModalImg(){
    document.querySelector(".modalChart").style.transform = "scale(1)";
    document.querySelector(".modalSlider").value = 3;
    
    var fileName = document.querySelector(".file_text").value;

    var modalChartWrap = document.querySelector(".modalChartWrap");
    
    var chartStackNameEls = modalChartWrap.querySelectorAll(".chartStackName");

    var leftWidth = 100;
    if(chartStackNameEls.length !==0){
        leftWidth = chartStackNameEls[0].offsetLeft + chartStackNameEls[0].offsetWidth;
        
        for(var i = 1 ; i < chartStackNameEls.length ; i++){
            if(chartStackNameEls[i].offsetLeft + chartStackNameEls[i].offsetWidth > leftWidth){
                leftWidth = chartStackNameEls[i].offsetLeft + chartStackNameEls[i].offsetWidth
            };
        }

    }

    captureFunc(".modalChartWrap", DateText(today)+ "_polymorphic_maker_map_detail_"+fileName+".png", null, null, null, leftWidth + 40, true)
}
function captureFunc(className, imgName, isOverflow, _height, _widthUnset, _width, isModal){
    window.scrollTo(0,0);
    var cloneParent = document.createElement('div');
    cloneParent.classList.add("cloneParent");
    var cloneEl = document.querySelector(className).cloneNode(true);
    if(isOverflow){
        cloneEl.style.width = "unset"
        cloneEl.style.height = "unset"
        cloneEl.children[0].style.overflow = "unset"
    }
    // if(_height){
    //     cloneEl.style.height = _height + "px"
    // }
    if(_widthUnset){
        cloneEl.style.width = "unset"
    }
    if(_width){
        cloneEl.style.width = _width + "px"
    }

    if(isModal){
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

    today = new Date();
    autoStatus = false;

    clickId = "";

    initChart()
    initTable()
    initModalChart()
    initModalTable()
    
    readLenFile();
    readMakerFile();
}

function onClickPolyRun(e)
{
	if(Object.keys(userParseData).length == 0 )
	{
        alert("엑셀파일을 첨부해주세요.");
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
    $('.commonBtn').css('display','block');
    $('.export_btn').css('display','block'); 
    
    readMakerFile();
    initVisualWrap();
    drawChart();
    drawTable();
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
                            <label>Pos</label>
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
}


// ------------------------------------------------------
//                         자동 분석 클릭
// ------------------------------------------------------

  
       var autoCount = 0;
function onClickanalytics(){

    var polyModalInput = document.querySelector("#polyModalInput");
    var _value = polyModalInput.value;
    var gapArr = [];


    // 자동분석 값이 있을때 
    if(!_value){
        var modalTableBody = document.querySelector(".modalTableBody");
        var trEls = modalTableBody.children;
        for(var i = 0 ; i < trEls.length ; i++){
            gapArr.push(trEls[i].children[1].innerText)
        }
    
    }else{ // 자동분석 값이 없을때
        var dataObj = parseData[Object.keys(parseData)[0]][clickName];
        var posArr = [];
        for(var key in dataObj){
            posArr.push({pos:dataObj[key].pos, id : key});
        }

        var high = Number(parseLengthData[clickName]);
        _value = Number(_value);

        for(var i = _value ; i < high ; i = i + _value){
            var near = 0;
            var gap = 999999999999;
            for(var j = 0 ; j < posArr.length ; j++){
                if(posArr[j].pos >= i){
                    var currentGap = Math.abs(i - posArr[j].pos);
                    if(gap > currentGap){
                        near = posArr[j];
                        gap = currentGap;
                    }
                }
            }
            gapArr.push(near.id)
        }
    }
    
    var set = new Set(gapArr);
    gapArr = [...set];
    autoStatus = true;
 
    
    //var auto = setTimeout(() => {
        if(gapArr.length == autoCount || !autoStatus){
            containId=[];
            initModalChart();
            initModalTable();
            if(autoStatus){
                drawModalChart(clickName);
                drawModalTable(clickName);
            }
            autoCount = 0;
            //clearInterval(auto);
        }

        containId = [gapArr[autoCount]];
        initModalChart();
        initModalTable();
        drawModalChart(clickName);
        drawModalTable(clickName);
        
    	autoCount++;
    //}, 500);
    
    
}



function readLenFile()
{
    var file = document.querySelector(".serverLen").innerText;
    if(!file){return};

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
    if(!_url){return};
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
                parcingGff(allText);
            }
        }
    }
    rawFile.send(null);
}
readGffFile()
readLenFile();

