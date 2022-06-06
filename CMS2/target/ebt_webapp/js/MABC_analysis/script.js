
// ------------------------------------------------------
//                         그래프
// ------------------------------------------------------
var xlsxData = {};
var graphWrap = document.querySelector(".graphWrap");
var chartDataArr = {};
var chrTotalData = {};
var chrTotalIndex = 0; 
var chrPercent = {};
var clickX = 0;
var clickY = 0;
var lengthData = [];
var lengthDataOrgin = [];
var today = new Date();
var orginMABCXlsx = null;

// # . 0 Len 파일 읽기
function onChangeLen(e){
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
        parseLenData(data);
        // var newLengthData = data.replace(/(\r\n|\n|\r)/gm, "-");
        // newLengthData = newLengthData.split("-");
        // lengthDataOrgin = [];
        // for(var i = 0 ; i < newLengthData.length ; i++){
        //     if(!newLengthData[i]){continue}
        //     var lengthEl = newLengthData[i].split(" ");


        //     let chr = lengthEl[0];
        //     if(chr[3] == "0"){
        //         chr = chr.split("");
        //         chr.splice(3, 1);
        //         chr = chr.join("");  
        //     }
            
        //     if(chr.substr(0, 3) == "Chr" || (chr.substr(0, 1) == "C" && typeof(chr.substr(0, 2)) == "number")){
        //         lengthDataOrgin.push({id:chr, pos:lengthEl[1]});
        //     }
        // }
    };
    reader.readAsBinaryString(input.files[0]);
}
function parseLenData(data){
    try{
        var newLengthData = data.replace(/(\r\n|\n|\r)/gm, "-");
        newLengthData = newLengthData.split("-");
        lengthDataOrgin = [];
        for(var i = 0 ; i < newLengthData.length ; i++){
            if(!newLengthData[i]){continue}
            var lengthEl = newLengthData[i].split(" ");
            
    
            let chr = lengthEl[0];
            // if(chr[3] == "0"){
            //     chr = chr.split("");
            //     chr.splice(3, 1);
            //     chr = chr.join("");  
            // }
            
            if(chr.substr(0, 3).toLowerCase() == "chr" || (chr.substr(0, 1).toLowerCase() == "c" && typeof(chr.substr(0, 2)) == "number")){
                lengthDataOrgin.push({id:chr.toLowerCase(), pos:lengthEl[1]});
            }
        }
    }catch{
        alert("잘못된 Len파일입니다.")
        console.error("parseLenData Error");
    }
}

// # . 1 엑셀 data 가져오기
function readExcel() {
    var input = event.target;
    var reader = new FileReader();
    reader.onload = function () {
        var fileForm = input.files[0].name.split(".")[1];
        if(fileForm !== "xlsx"){
            document.querySelector(".file_text").placeholder = "MABC xlsx파일을 넣어주세요.";
            alert(".xlsx 파일이 아닙니다.");
            event.target.value = null;
            return
        };
        document.querySelector(".file_text").value = input.files[0].name;
        var data = reader.result;
        var workBook = XLSX.read(data, { type: 'binary' });
        workBook.SheetNames.forEach(function (sheetName) {
            onClickInit(false)
            var rows = XLSX.utils.sheet_to_json(workBook.Sheets[sheetName]);
            xlsxData = JSON.parse(JSON.stringify(rows));
            orginMABCXlsx = input.files[0];
            parsingData(xlsxData);
        })
    };
    reader.readAsBinaryString(input.files[0]);
}

// # . 2 data 원하는 형태로 변환
function parsingData(xlsxData, isRun){

    try{
        for(var i = 0 ; i <  xlsxData.length ; i++){
    
            for(var key in xlsxData[i]){
                try{
                    if(xlsxData[i].pos.length == 1){continue;}
                    if(key == "f" || key == "m" || key == "id" || key == "pos" || key == " "){continue;}
        
                    chartDataArr[key] = chartDataArr[key] ? chartDataArr[key] : [];
                    chrPercent[key] = {};
                    chartDataArr[key].push({
                        type : xlsxData[i][key],
                        pos : xlsxData[i]["pos"],
                        chr : xlsxData[i]["id"],
                        name: xlsxData[i][" "]
                    });
                }catch{
                    console.error(i + "_index mabc parse Error")
                }
    
            }
            if(xlsxData[i].pos.length !== 1){
                chrTotalData[xlsxData[i]["id"]] = xlsxData[i]["pos"];
            }
            // 1229 backup
            // let currentId = "";
            // if(xlsxData[i]["chr"]){
            //     currentId = "chr";
            // }else{
            //     currentId = "c";
            // }
    
            // let chr = xlsxData[i][currentId];
            // if(chr[3] == "0"){
            //     chr = chr.split("");
            //     chr.splice(3, 1);
            //     chr = chr.join("");  
            // }
    
            // for(var key in xlsxData[i]){
            //     // if(typeof( xlsxData[i].pos )!=="number"){continue;}
            //     if(xlsxData[i].pos.length == 1){continue;}
            //     if(key == "f" || key == "m" || key == "id" || key == "pos" || key == currentId){continue;}
    
            //     chartDataArr[key] = chartDataArr[key] ? chartDataArr[key] : [];
            //     chrPercent[key] = {};
            //     chartDataArr[key].push({
            //         type : xlsxData[i][key],
            //         pos : xlsxData[i]["pos"],
            //         chr : chr,
            //         name: xlsxData[i]["id"]
            //     });
    
            // }
            // if(xlsxData[i].pos.length !== 1){
            //     chrTotalData[chr] = xlsxData[i]["pos"];
            // }
        }
        var chrSelectBox = document.querySelector(".chrSelectBox");

        if(lengthDataOrgin.length == 0){
            alert("잘못된 Len파일입니다.")
            console.error("lengthDataOrgin is empty");
            return;
        }

        try{
            var newLengthData = {};
            for(var i = 0 ; i < lengthDataOrgin.length ; i++){
                for(var key in chrTotalData){
                    if(key.toLowerCase() == lengthDataOrgin[i].id.toLowerCase()){
                        chrTotalIndex += Number(lengthDataOrgin[i].pos);
                        var chrSelectOption = document.createElement("option");
                        // chrSelectOption.innerText = Object.keys( chrTotalData )[i];
                        chrSelectOption.innerText = key;
                        chrSelectOption.classList.add("chrOption");
                        chrSelectBox.appendChild(chrSelectOption);
                        // newLengthData[  Object.keys( chrTotalData )[i] ] = Number(lengthDataOrgin[i].pos);
                        newLengthData[  key ] = Number(lengthDataOrgin[i].pos);
                    
                    }
                }
            }

        }catch{
            alert("잘못된 Len파일입니다.")
            console.error("newLengthData Error--- ")
            console.log(newLengthData)
            console.log(lengthDataOrgin);
            return;
        }

        lengthData = newLengthData;
        
        if(Object.keys(chartDataArr).length==0){
            alert("잘못된 MABC파일입니다.")
            console.error("chartDataArr empty");
            console.log(chartDataArr);
            return;
        }
        if(Object.keys(newLengthData).length==0){
            alert("잘못된 Len파일 혹은 MABC파일입니다.")
            console.error("newLengthData empty");
            console.log(newLengthData);
            return;
        }

        if(isRun){
            buildGraph();
        }

        return;
    }catch{
        alert("잘못된 MABC파일입니다.")
        console.error("MABC parsingData Error Catch");
    };
} 

// # . 3 그래프 생성
function buildGraph(){

    // 초기화
    var visualWrap = document.querySelector(".visualWrap");
    var visualWrapPosition = document.querySelector(".visualWrapPosition");
    visualWrap.remove();
    visualWrapPosition.innerHTML = "<div class='visualWrap'><div class='tableWrap' ><div class='tableContent'><table id='table' class='table'></table></div></div><div class='graphContainer'><div class='graphWrap'></div></div></div>"

    graphWrap = document.querySelector(".graphWrap");
    for(var key in chrPercent){
        chrPercent[key] = {}
    }

    // 부모 생성
    function makeParent(className){
        var graphElName = document.createElement('div');
        graphElName.classList.add("graphElName");
        var divEl = document.createElement('div');
        divEl.classList.add(className);
        
        var graphName = document.createElement('div');
        var text = "";
        if(className == "father"){
            text = "F";
        }else{
            text = "M";
        }
        graphName.innerText = text;
        graphName.classList.add("graphName");

        graphElName.appendChild( graphName ); 
        graphElName.appendChild( divEl ); 
        graphWrap.appendChild( graphElName ); 
    }


    var count = 0;

    // 클 틀 생성
    for(var key in chartDataArr){
        // 좌측 컬럼 이름, 엄마 아빠 
        if(count == 0){
            var chrNameBar = document.createElement('div');
            var chrNameDefault = document.createElement('div');
            var chrNameEl = document.createElement('div');
            chrNameDefault.classList.add("graphName");
            chrNameBar.appendChild( chrNameDefault ); 
            chrNameBar.classList.add("graphElName");
            chrNameEl.classList.add("graphElStackName");
            
            // 이름이름
            for(var keyChr in chrTotalData){
                if(typeof(chrTotalData[keyChr])=="number"){
                    var chrName = document.createElement('div');
                    // chrName.innerText = keyChr;
                    chrName.innerText = "";
                    chrName.classList.add("chrStackName");
                    chrName.style.height = (100/chrTotalIndex) * lengthData[keyChr] + "%";
                    chrNameEl.appendChild( chrName ); 
                }
            }
            
            chrNameBar.appendChild( chrNameEl ); 
            graphWrap.appendChild( chrNameBar ); 
            makeParent("father");
            makeParent("mother");
            count++;
        }

        var graphElName = document.createElement('div');
        graphElName.classList.add("graphElName");

        var divEl = document.createElement('div');
        divEl.setAttribute("data-column", key);
        divEl.classList.add("graphEl");

        var graphName = document.createElement('div');
        graphName.innerText = key;
        graphName.classList.add("graphName");

        graphElName.appendChild( graphName ); 
        graphElName.appendChild( divEl ); 
        graphWrap.appendChild( graphElName ); 
        

        for(var keySmall in lengthData){
            // if(typeof(chrTotalData[keySmall])!=="number"){continue;}
            var divElSmall = document.createElement('div');
            divElSmall.setAttribute("data-column", keySmall);
            divElSmall.classList.add("chrStack");
            divElSmall.style.height = (100/chrTotalIndex) * lengthData[keySmall] + "%";
            divEl.appendChild( divElSmall );
        }
        

        // 작은거 안에 작은거 생성 
        for(var i = 0 ; i < chartDataArr[key].length ; i++){
            var chrPos = chartDataArr[key][i]["pos"];
            
            var divElSmallStack = document.createElement('div');
            divElSmallStack.setAttribute("data-pos", chrPos);
            divElSmallStack.setAttribute("data-chr", chartDataArr[key][i]["chr"]);
            divElSmallStack.setAttribute("data-type", chartDataArr[key][i]["type"]);
            divElSmallStack.classList.add("chrStackSmall");

            // 높이값
            var gap = 0;
            if(i==0){
                // 제일 처음
                gap = chrPos + ( (chartDataArr[key][i+1]["pos"] - chrPos) / 2 );

                if(chartDataArr[key][i]["chr"] !== chartDataArr[key][i+1]["chr"] ){
                    gap = "full";
                }
            }else{
                // 제일 끝
                if(i == chartDataArr[key].length-1){
                    gap = (lengthData[chartDataArr[key][i]["chr"]] - chrPos) + ((chrPos - chartDataArr[key][i-1]["pos"]) / 2 )
                }else{

                    if((chartDataArr[key][i]["chr"] !== chartDataArr[key][i-1]["chr"]) && (chartDataArr[key][i]["chr"] !== chartDataArr[key][i+1]["chr"]) ){
                        gap = "full";
                    }else{
                        // 다음과 동일할때 
                        if(chartDataArr[key][i]["chr"] == chartDataArr[key][i+1]["chr"]){
                            // 이전과 동일할때
                            if(chartDataArr[key][i]["chr"] == chartDataArr[key][i-1]["chr"]){
                                gap = (( chrPos - chartDataArr[key][i-1]["pos"] ) / 2)+(( chartDataArr[key][i+1]["pos"] - chrPos ) / 2);
                            }else{
                                gap = chrPos + (chartDataArr[key][i+1]["pos"] - chrPos) / 2 ;
                            }
                        }else{
                            gap = (lengthData[chartDataArr[key][i]["chr"]] - chrPos) + ( (chrPos - chartDataArr[key][i-1]["pos"]) / 2 );
                        }
                    }
                }
            }

            var currentChr = chartDataArr[key][i]["chr"];
            var divElSmall = divEl.querySelector("[data-column=" +currentChr+ "]");

            chrPercent[key][currentChr] = chrPercent[key][currentChr] ? chrPercent[key][currentChr] : 0;
            if(gap == "full"){
                divElSmallStack.style.height = "100%";
            }else{
                divElSmallStack.style.height = (  100/lengthData[currentChr]  ) * gap + "%";
            }


            // 배경색
            if(chartDataArr[key][i]["type"] == "A"){
                chrPercent[key][currentChr] += (100/lengthData[chartDataArr[key][i]["chr"]]) * gap;
                // divElSmallStack.style.backgroundColor= "#FF9BBD"
                divElSmallStack.style.backgroundColor= "#ff6982"
            }else if(chartDataArr[key][i]["type"] == "B"){
                // divElSmallStack.style.backgroundColor= "#95CAFF"
                divElSmallStack.style.backgroundColor= "#6982ff"
            }else{
                // divElSmallStack.style.backgroundColor= "#FFE395"
                divElSmallStack.style.backgroundColor= "#a3a3a3"
            }
            if(divElSmall){
                divElSmall.appendChild( divElSmallStack );
            }
        }
    }    
    // 점선 추가
    var graphContainer = document.querySelector(".graphContainer");
    
    

    for(var key in lengthData){
        if(typeof(lengthData[key])=="number"){
            var dotEl = document.createElement('div');
            var dotName = document.createElement('div');
            var currentChr = document.querySelector("[data-column="+key+"]");
            var chtHeight = currentChr.getBoundingClientRect().bottom;

            dotEl.classList.add("dotline");
            dotEl.style.top = (chtHeight - graphContainer.getBoundingClientRect().top) + "px";
            dotEl.style.height = currentChr.offsetHeight + "px";
            
            // 점선에 이름 추가
            dotEl.style.lineHeight = currentChr.offsetHeight + "px";

            dotName.innerText = key;
            dotName.style.height = (currentChr.offsetHeight-1) + "px";
            dotName.classList.add("dotName");
            dotEl.appendChild(dotName);

            dotEl.style.transform = "translateY(-"+ currentChr.offsetHeight +"px)";
            graphContainer.appendChild( dotEl );
        }
    }
    var newChrPercent = chrPercent; 
    for(var key in chrPercent){
        var totalA = 0;
        for(var keySmall in chrPercent[key]){
            totalA += (chrPercent[key][keySmall] * lengthData[keySmall])/100;
        }
        newChrPercent[key]["total"] = totalA / chrTotalIndex * 100
    }

    chrPercent = newChrPercent;

    addGraphEvent();
    buildTable();
}

// 드래그&드롭, 더블클릭 이벤트 추가
function addGraphEvent(){
    if(window.innerWidth > 1000){
        var isMouseMove = false;
        var clickColumn = "";
        graphWrap.addEventListener("mousedown", function(e){
            if(e.path[0].classList.contains("chrStackSmall")){
                isMouseMove = true;
                clickColumn = e.path[2].dataset.column;
    
                var clickEl = document.querySelector("[data-column=" +clickColumn+ "]");
                clickY = e.clientY - clickEl.offsetTop;
                clickX = e.clientX - clickEl.offsetLeft;
                
                
                var clickElTable = document.querySelector("[data-column=" +clickColumn+ "_table]");
                var currentSelect = document.querySelectorAll(".activeClickAni");
                for(var i = 0 ; i < currentSelect.length ; i++){
                    currentSelect[i].classList.remove("activeClickAni");
                }

                $('.tableWrap').animate({scrollTop : clickElTable.offsetTop - $('.tableWrap')[0].offsetHeight/2 }, 500); 
                clickElTable.classList.add("activeClickAni");
    
            }
        });
    
        graphWrap.addEventListener("mousemove", function(e){
            if(!isMouseMove){return};
            var clickEl = document.querySelector("[data-column=" +clickColumn+ "]").parentNode;
            clickEl.style.position = "absolute";
            clickEl.style.top = `${e.clientY - clickY}px`;
            clickEl.style.left = `${e.clientX - clickX}px`;
            clickEl.style.pointerEvents = "none";
    
    
            // 그림자
            if(!e.path[2].dataset.column){return;}
            var currentEl = document.querySelector("[data-column=" +e.path[2].dataset.column+ "]").parentNode;
            var currentShadow = document.querySelector(".graphShadow");
            if(currentShadow){
                currentShadow.remove();
            }
    
            var shadowGraph = document.createElement('div');
            shadowGraph.classList.add("graphShadow");
    
            clickEl.parentNode.insertBefore(shadowGraph, currentEl)
    
        });
    
        graphWrap.addEventListener("mouseup", function(e){
            isMouseMove = false;
            if(!clickColumn){return;}
            var clickEl = document.querySelector("[data-column=" +clickColumn+ "]").parentNode;
            var currentShadow = document.querySelector(".graphShadow");
            if(!currentShadow){return}
    
            clickEl.style.position = "unset";
            clickEl.style.top = 0;
            clickEl.style.left = 0;
            clickEl.style.pointerEvents = "all";
    
            clickEl.parentNode.replaceChild(clickEl, currentShadow);
            console.log()
            sortGraphData();
        });
    
        graphWrap.addEventListener("dblclick", function(e){
            if(e.path[0].classList.contains("chrStackSmall")){
                var modalSelectOption = document.querySelectorAll(".modalSelectOption");
                if(modalSelectOption){
                    for(var i = 0 ; i < modalSelectOption.length ; i++){
                        modalSelectOption[i].remove();
                    }
                }
    
                var modal = document.querySelector(".modal");
                modal.style.display = "unset";
                drawModalGraph(e.path[2].dataset.column);
            }
        });
    }else{
        graphWrap.addEventListener("click", function(e){
            if(e.path[0].classList.contains("chrStackSmall")){
                var modalSelectOption = document.querySelectorAll(".modalSelectOption");
                if(modalSelectOption){
                    for(var i = 0 ; i < modalSelectOption.length ; i++){
                        modalSelectOption[i].remove();
                    }
                }
    
                var modal = document.querySelector(".modal");
                modal.style.display = "unset";
                drawModalGraph(e.path[2].dataset.column);
            }
        });
    }
}

// 그래프 정렬
function sortGraphData(){
    var newChrArr = [];
    var graphEls = document.querySelectorAll(".graphEl");

    for(var i = 0 ; i < graphEls.length ; i++){
        newChrArr.push(graphEls[i].dataset.column)
    }
    var newChrObj = {};

    for(var i = 0 ; i < newChrArr.length ; i++){
        newChrObj[newChrArr[i]] = chartDataArr[newChrArr[i]];
    }
    chartDataArr = newChrObj;
    buildTable();
}




// ------------------------------------------------------
//                         테이블
// ------------------------------------------------------
var isTable = false;
function buildTable(){
    var table = document.querySelector('.table');
    isTable = true;
    // 초기화
    var tableContent = document.querySelector('.tableContent');
    table.remove();

    var newTable = document.createElement('table');
    newTable.classList.add("table");
    

    // 머리
    var thead = document.createElement('thead');
    var theadTr = document.createElement('tr');
    var theadTh = document.createElement('th');
    theadTr.appendChild(theadTh);
    
    // var keyArr = Object.keys(chrTotalData);
    // var noKeyArr = [];
    // for(var i = 0 ; i < keyArr.length ; i++){
    //     if(Object.keys(lengthData).some(item => item == keyArr[i] )){
    //         var theadTh = document.createElement('th');
    //         theadTh.innerText = keyArr[i];
    //         theadTr.appendChild(theadTh);
    //     }else{
    //         noKeyArr.push(keyArr[i]);
    //     }
    // }

    //  --- 
    for(var key in chrTotalData){
        var theadTh = document.createElement('th');
        theadTh.innerText = key;
        theadTr.appendChild(theadTh);
    }
    var theadThTotla = document.createElement('th');
    theadThTotla.innerText = "Total";
    theadTr.appendChild(theadThTotla);

    thead.appendChild(theadTr);

    // console.log(noKeyArr);
    // console.log(chrPercent);


    // 몸통
    var tbody = document.createElement('tbody');
    for(var key in chartDataArr){
        var tbodyTr = document.createElement('tr');
        var tbodyTdName = document.createElement('td');
        tbodyTdName.innerText = key;
        tbodyTr.setAttribute("data-column", key + "_table");
        tbodyTr.appendChild(tbodyTdName);
        tbody.appendChild(tbodyTr);

        for(var keySmall in chrPercent[key]){
            
            var tbodyTd = document.createElement('td');
            var percentText = chrPercent[key][keySmall].toFixed(2);
            tbodyTd.innerText = percentText + "%";

            if(percentText >= 50){
                tbodyTd.style.backgroundColor = "hsl(355, 100%, " + (150 - percentText) + "%)";
            }else{
                tbodyTd.style.backgroundColor = "hsl(230, 100%, " + (50 + Number(percentText)) + "%)";
            }
            tbodyTr.appendChild(tbodyTd);
        }
    }

    
    newTable.appendChild(thead);
    newTable.appendChild(tbody);


    tableContent.appendChild(newTable);
    addTableEvent();
}
var tableWrap = document.querySelector('.tableWrap');
var clickTableColumn = "";
var hoverTableColumn = "";

// 테이블 정렬
function sortTableData(){
    var newChrArr = [];
    var tbodyChildren = document.querySelector("tbody").children;
    
    for(var i = 0 ; i < tbodyChildren.length ; i++){
        newChrArr.push(tbodyChildren[i].dataset.column.replace("_table", ""));
    }
    var newChrObj = {};
    for(var i = 0 ; i < newChrArr.length ; i++){
        newChrObj[newChrArr[i]] = chartDataArr[newChrArr[i]];
    }
    chartDataArr = newChrObj;

    buildGraph();
}

// 드래그&드롭 이벤트 추가
function addTableEvent(){
    var isMouseMove = false;
    var tableWrap = document.querySelector('.tableWrap');
    tableWrap.addEventListener("mousedown", function(e){
        if(!e.path[1].dataset.column){return};
        isMouseMove = true;
        clickTableColumn = e.path[1].dataset.column;
        var clickEl = document.querySelector("[data-column=" + clickTableColumn + "]");
        clickEl.style.opacity = "0.5";
        clickEl.style.border = "5px solid #000";

        var clickElGraph = document.querySelector("[data-column=" +clickTableColumn.replace("_table", "")+ "]");
        $('.graphWrap').animate({scrollLeft : clickElGraph.offsetLeft - $('.graphWrap')[0].offsetWidth/2 }, 500); 


        var currentSelect = document.querySelectorAll(".activeClickAni");
        for(var i = 0 ; i < currentSelect.length ; i++){
            currentSelect[i].classList.remove("activeClickAni");
        }
        
        clickElGraph.classList.add("activeClickAni");
    })
    tableWrap.addEventListener("mousemove", function(e){
        if(!isMouseMove){return;}
        if(!e.path[1].dataset.column){return};
    
        var currentShadow = document.querySelector(".tableShadow");
        if(currentShadow){
            currentShadow.remove();
        }
    
        hoverTableColumn = e.path[1].dataset.column;
        var hoverEl = document.querySelector("[data-column=" + hoverTableColumn + "]");
    
        var shadowGraph = document.createElement('div');
        shadowGraph.classList.add("tableShadow");
    
        hoverEl.parentNode.insertBefore(shadowGraph, hoverEl);
    })
    tableWrap.addEventListener("mouseup", function(e){
        if(!isMouseMove){return}
        isMouseMove = false;
        
        var clickEl = document.querySelector("[data-column=" + clickTableColumn + "]");
        clickEl.style.opacity = "1";
        clickEl.style.border = "0";

        var currentShadow = document.querySelector(".tableShadow");
        if(!currentShadow){return}
        clickEl.parentNode.replaceChild(clickEl, currentShadow);
        sortTableData();
    })
    
}


// ------------------------------------------------------
//                         사진찍기
// ------------------------------------------------------
// 그래프
function downloadGraphImg(e){
    var fileName = document.querySelector(".file_text").value;

    initAnimation();
    window.scrollTo(0,0);
    var cloneParent = document.createElement('div');
    cloneParent.classList.add("cloneParent")
    // var cloneEl = graphWrap.cloneNode(true);
    var cloneEl = document.querySelector(".graphContainer").cloneNode(true);

    var dotLineEls = cloneEl.querySelectorAll(".dotline");
    for(var i = 0 ; i < dotLineEls.length ; i++){
        dotLineEls[i].style.left = "unset";
        dotLineEls[i].style.width = "100%";
    }


    cloneEl.style.overflow = "unset";
    cloneEl.style.height = "unset";
    var graphElNameEls = document.querySelectorAll(".graphElName");
    cloneEl.style.width =((graphElNameEls.length * 37) + 50) + "px";

    cloneParent.appendChild(cloneEl);
    document.querySelector("body").appendChild(cloneParent);

    html2canvas(cloneEl).then(function(canvas){
        var myImage = canvas.toDataURL();
        downloadURI(myImage,  DateText(today) + "_mabc_map_"+fileName+".png") 
    });
    
}
// 테이블
function downloadTableImg(e){
    var fileName = document.querySelector(".file_text").value;
    var excelHandler = {
        getExcelFileName : function(){
            return DateText(today) + "_mabc_table_"+fileName + ".xlsx";	//파일명
        },
        getSheetName : function(){
            return "mabc_table";	//시트명
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
    return;

    var fileName = document.querySelector(".file_text").value;

    initAnimation();
    window.scrollTo(0,0);
    
    var cloneParent = document.createElement('div');
    cloneParent.classList.add("cloneParent")
    var originEl = document.querySelector(".table");
    var cloneEl = originEl.cloneNode(true);
    cloneParent.appendChild(cloneEl);
    document.querySelector("body").appendChild(cloneParent);

    html2canvas(cloneEl).then(function(canvas){
        var myImage = canvas.toDataURL();
        downloadURI(myImage,  DateText(today) + "_mabc_table_"+fileName+".png") 
    });
}
// 모달
function downloadModalImg(){
    var fileName = document.querySelector(".file_text").value;
    initAnimation();
    window.scrollTo(0,0);
    var modalGraph_scale = document.querySelector(".modalGraph_scale");
    modalGraph_scale.style.transform = "scale(1)";

    var cloneParent = document.createElement('div');
    cloneParent.classList.add("cloneParent")
    var originEl = document.querySelector(".modalGraph_Wrap");
    var cloneEl = originEl.cloneNode(true);
    var modalGraphEl = cloneEl.querySelectorAll(".modalGraphEl");
    for(var i = 0 ; i < modalGraphEl.length ; i++){
        modalGraphEl[i].style.overflow = "unset";
    }
    cloneEl.style.overflow = "unset";
    cloneEl.style.width = "unset";

    cloneParent.appendChild(cloneEl);
    document.querySelector("body").appendChild(cloneParent);


    html2canvas(cloneEl).then(function(canvas){
        var myImage = canvas.toDataURL();
        downloadURI(myImage,  DateText(today) + "_mabc_detail_map_"+fileName+".png");
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
    }else if(selectText == "샘플파일"){
        var link = document.createElement("a")
        link.href = "./dataFile/test_MABC.xlsx";
        document.body.appendChild(link);
        link.click();
    }else if(selectText == "map"){
        downloadGraphImg();
    }else if(selectText == "table"){
        downloadTableImg();
    }
}



// ------------------------------------------------------
//                         초기화
// ------------------------------------------------------
function onClickInit(isRender){
    // var addMabcFileEls = document.querySelectorAll(".addMabcFile")
    // for(var i = 0 ; i < addMabcFileEls.length ; i++){
    //     addMabcFileEls[i].value = "";
    // }

    document.querySelector(".file_text").placeholder = "MABC xlsx파일을 넣어주세요.";
    var visualWrap = document.querySelector(".visualWrap");
    var visualWrapPosition = document.querySelector(".visualWrapPosition");
    
    visualWrap.remove();
    visualWrapPosition.innerHTML = "<div class='visualWrap'><div class='tableWrap' ><div class='tableContent'><table id='table' class='table'></table></div></div><div class='graphContainer'><div class='dotline'></div><div class='graphWrap'></div></div></div>"
    
    var chrOptionBox = document.querySelectorAll(".chrOption");
    for(var i = 0 ; i < chrOptionBox.length; i++){
        chrOptionBox[i].remove();
    }

    // xlsxData = {};
    chartDataArr = {};
    chrTotalData = {};
    chrTotalIndex = 0; 
    chrPercent = {};
    clickX = 0;
    clickY = 0;
    // lengthData = [];
    clickTableColumn = "";
    hoverTableColumn = "";
    isTable = false;
    graphWrap = document.querySelector(".graphWrap");
    if(isRender){
        parsingData(xlsxData, true);
    }
}
function initAnimation(){
    var activeClickAniEls = document.querySelectorAll(".activeClickAni");
    for(var i = 0 ; i < activeClickAniEls.length ; i++){
        activeClickAniEls[i].classList.remove("activeClickAni");
    }
}




// ------------------------------------------------------
//                         모달
// ------------------------------------------------------
function drawModalGraph(_graphName){

    // 데이터 변환 작업
    var graphName = chartDataArr[_graphName];
    var modalGraph_scale = document.querySelector(".modalGraph_scale");
    modalGraph_scale.innerHTML = "";
    let modalGraphData = {};
    for(var i = 0 ; i < graphName.length ; i++){
        modalGraphData[graphName[i].chr] = modalGraphData[graphName[i].chr]?modalGraphData[graphName[i].chr]:[];
        modalGraphData[graphName[i].chr].push({
            pos:graphName[i].pos,
            name:graphName[i].name,
            type:graphName[i].type,
            chr:graphName[i].chr
        })
    }
    
    var bigLength = 0;

    for(var key in lengthData){
        if(bigLength < lengthData[key]){
            bigLength = lengthData[key];
        }
    }

    // 그래프 그리기 
    for(var key in modalGraphData){

        var modalGraphSection = document.createElement('div');
        modalGraphSection.classList.add("modalGraphSection");


        var modalGraph = document.createElement('div');
        var bigPercent = 100 / bigLength;
        modalGraph.classList.add("modalGraphEl");

        modalGraph.style.height = (lengthData[key] * bigPercent) + "%";
        

        
        var modalGraphElWrap = document.createElement('div');
        modalGraphElWrap.classList.add("modalGraphElWrap");
        
        var modalGraphName = document.createElement('div');
        modalGraphName.classList.add("modalGraphName");
        modalGraphName.innerText = key;

        
        for(var i = 0 ; i <  modalGraphData[key].length; i++){
            // 스택
            var modalGraphStack = document.createElement('div');
            modalGraphStack.classList.add("modalGraphElStack");
            modalGraphStack.setAttribute("data-column", key+"_modal");

            // 스택 이름
            var modalStackDesc = document.createElement('div');
            modalStackDesc.classList.add("modalStackDesc");
            modalStackDesc.setAttribute("data-column", key+"_modalDesc");
            modalStackDesc.innerHTML = modalGraphData[key][i]["name"];

            // 스택 이름
            var modalStackDescLine = document.createElement('div');
            modalStackDescLine.classList.add("modalStackDescLine");
            modalStackDescLine.setAttribute("data-column", key+"_modalDescLine");


            // 높이값
            var gap = 0;
            if(i==0){
                // 제일 처음
                if(modalGraphData[key].length == 1){
                    gap = "full";
                }else{
                    gap = modalGraphData[key][i]["pos"] + ( (  modalGraphData[key][i+1]["pos"] - modalGraphData[key][i]["pos"]) / 2 );
                }
            }else{
                // 제일 끝
                if(i == modalGraphData[key].length-1){
                    gap = (lengthData[modalGraphData[key][i]["chr"]] - modalGraphData[key][i]["pos"]) + ((modalGraphData[key][i]["pos"] - modalGraphData[key][i-1]["pos"]) / 2 );
                }else{
                    gap = (( modalGraphData[key][i]["pos"] - modalGraphData[key][i-1]["pos"] ) / 2)+(( modalGraphData[key][i+1]["pos"] - modalGraphData[key][i]["pos"] ) / 2);
                }
            }
            
            if(gap == "full"){
                modalGraphStack.style.height = "100%";
            }else{
                modalGraphStack.style.height = (  100/lengthData[key]  ) * gap + "%";
            }
            
            // // 배경색
            if(modalGraphData[key][i]["type"] == "A"){
                modalGraphStack.style.backgroundColor= "#ff6982"
            }else if(modalGraphData[key][i]["type"] == "B"){
                modalGraphStack.style.backgroundColor= "#6982ff"
            }else{
                modalGraphStack.style.backgroundColor= "#a3a3a3"
            }

            modalGraph.appendChild( modalStackDesc );
            modalGraph.appendChild( modalStackDescLine );
            modalGraph.appendChild( modalGraphStack );
        }

        modalGraphSection.appendChild(modalGraphName);
        modalGraphSection.appendChild(modalGraph);
        modalGraph_scale.appendChild( modalGraphSection );

        var stacEls = modalGraph.querySelectorAll("[data-column=" +key+"_modal"+ "]");
        var stackDescEls = modalGraph.querySelectorAll("[data-column=" +key+"_modalDesc"+ "]");
        var stackDescLineEls = modalGraph.querySelectorAll("[data-column=" +key+"_modalDescLine"+ "]");
        var marinLeft = 0;
        
        for(var i = 0 ; i < stackDescEls.length ; i++){
            // 탑
            // stackDescEls[i].style.top = stacEls[i].offsetTop + (stacEls[i].clientHeight/2) + "px";
            stackDescEls[i].style.top = stacEls[i].offsetTop + "px";
            stackDescLineEls[i].style.top = stacEls[i].offsetTop + "px"

            // 높이값 조정
            if(i !== 0){
                var offsetBottom = stackDescEls[i-1].offsetTop + stackDescEls[i-1].offsetHeight;
                if(offsetBottom > stackDescEls[i].offsetTop){
                    stackDescEls[i].style.top = offsetBottom + "px";
                }
            }

            // 마진
            if(marinLeft < stackDescEls[i].clientWidth){
                marinLeft = stackDescEls[i].clientWidth;
            }

            var lineX = stackDescLineEls[i].offsetLeft; 
            var lineY = stackDescLineEls[i].offsetTop; 

            var descX = stackDescEls[i].offsetLeft;
            var descY = stackDescEls[i].offsetTop + (stackDescEls[i].clientHeight/2);
            
            var x = descX - lineX;
            var y = descY - lineY;
            var radian = Math.atan2(y, x);
            var degree = radian * 180 / Math.PI // 라디안 -> 디그리 변환

            stackDescLineEls[i].style.transform = "rotate(" + degree + "deg)";
            stackDescLineEls[i].style.width = 
            Math.sqrt(
                Math.pow((descY - lineY), 2) + Math.pow((Math.abs(descX - lineX)), 2)
            ) - 4 + "px";

        }
        modalGraph.style.marginRight = marinLeft + 60 + "px";
    }

    var mabcModalSelect = document.querySelector(".mabcModalSelect");
    for(var key in chartDataArr){
        var selectOption = document.createElement('option');
        selectOption.innerText = key;
        selectOption.classList.add("modalSelectOption");
        if(_graphName == key){
            selectOption.setAttribute("selected", true);
        }
        mabcModalSelect.appendChild(selectOption);
    }

}
function closeMOdal(){
    var modal = document.querySelector(".modal");
    modal.style.display = "none";
}
function onChangeModalSelect(){
    var mabcModalSelect = document.querySelector(".mabcModalSelect");  
  

    drawModalGraph(mabcModalSelect.options[mabcModalSelect.selectedIndex].innerText)
}
function onClickZoom(isZoomIn){
    var modalGraph_scale = document.querySelector(".modalGraph_scale");
    var style = window.getComputedStyle(modalGraph_scale);
    var matrix = new WebKitCSSMatrix(style.transform);
    if(!isZoomIn && matrix.m11==0.4){return;}
    if(isZoomIn && matrix.m11==2.5){return;}
    var changeValue = matrix.m11 + (isZoomIn?0.3:-0.3)
    modalGraph_scale.style.transform = "scale(" + changeValue + ")"
    var modalSlider = document.querySelector(".modalSlider");
    modalSlider.value = Number(modalSlider.value) + (isZoomIn?1:-1)
}









// ------------------------------------------------------
//                         정렬
// ------------------------------------------------------
function onChangeChrSort(){
    var chrSelectBox = document.querySelector(".chrSelectBox");  
    var selectText = chrSelectBox.options[chrSelectBox.selectedIndex].innerText;
    var sortData = [];
    for(var key in chrPercent){
        sortData.push({name:key, percent: chrPercent[key][selectText]});
    };

    sortData.sort(function(a, b){
        return b.percent - a.percent;
    });

    var newChartDataArr = {}

    for(var i = 0 ; i < sortData.length ; i++){
        newChartDataArr[sortData[i].name] = chartDataArr[sortData[i].name];
    }

    chartDataArr = newChartDataArr;
    var allChrBtn = document.querySelector(".allchr");
    if(allChrBtn.classList.contains("active")){
        onClickAllChr(false);
    }else{
        buildGraph();
    }
}
function onClickAllChr(isClick){
    if(Object.keys( chartDataArr ).length == 0){
        alert("데이터를 넣어주세요.")
        return;
    }
    var allChrBtn = document.querySelector(".allchr");
    
    if(isClick){
        if(allChrBtn.classList.contains("active")){
            allChrBtn.classList.remove("active");
            return;
        }else{
            allChrBtn.classList.add("active");
        }
    }

    var chrSelectBox = document.querySelector(".chrSelectBox");  
    var selectText = chrSelectBox.options[chrSelectBox.selectedIndex];
    if(!selectText){return;}
    selectText = selectText.innerText;

    var sortData = [];
    
    for(var key in chrPercent){
        sortData.push({name:key, percent: chrPercent[key][selectText], totalPercent : chrPercent[key]["total"]});
    };

    sortData.sort(function(a, b){
        if(b.percent < a.percent) return -1; 
        if(b.percent > a.percent) return 1;
        if(b.totalPercent < a.totalPercent) return -1;
        if(b.totalPercent > a.totalPercent) return 1;
        return 0;        
    });

    var newChartDataArr = {}

    for(var i = 0 ; i < sortData.length ; i++){
        newChartDataArr[sortData[i].name] = chartDataArr[sortData[i].name];
    }

    chartDataArr = newChartDataArr;
    buildGraph();
}




// ------------------------------------------------------
//                         모달 슬라이드
// ------------------------------------------------------
function onChangeModalSlider(e){
    var modalGraph_scale = document.querySelector(".modalGraph_scale");
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
    modalGraph_scale.style.transform = "scale(" + changeValue + ")"
}





function onClickRun(){
    var dataSaveBtn = document.querySelector("#dataSaveBtn");
    if(dataSaveBtn){
        dataSaveBtn.style.display = "unset"
    }
    if(Object.keys(lengthData).length == 0){
        alert("잘못된 Len파일 혹은 MABC파일입니다.");
        console.error("onClickRun Error");
        return;
    }
    buildGraph();
}


function onChangeVersion(){
    xlsxData = {};
    graphWrap = document.querySelector(".graphWrap");
    chartDataArr = {};
    chrTotalData = {};
    chrTotalIndex = 0; 
    chrPercent = {};
    clickX = 0;
    clickY = 0;
    lengthData = [];
    lengthDataOrgin = [];
    today = new Date();
    onClickInit(false);
    readLenFile();
}


// ------------------------------------------------------
//                    로컬파일 읽어오기
// ------------------------------------------------------
function readLenFile()
{
	var file = document.querySelector(".lenPos").innerText;
    if(!file){console.error("readLenFile"); return};
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
                parseLenData(allText);
                // var newLengthData = allText.replace(/(\r\n|\n|\r)/gm, "-");
                // newLengthData = newLengthData.split("-");
                // lengthDataOrgin = [];
                // for(var i = 0 ; i < newLengthData.length ; i++){
                //     if(!newLengthData[i]){continue}
                //     var lengthEl = newLengthData[i].split(" ");
                //     if(lengthEl[0].substr(0, 3) == "Chr"){
                //         console.log(lengthDataOrgin);
                //         lengthDataOrgin.push(lengthEl[1]);
                //     }
                // }
            }
        }
    }
    rawFile.send(null);
}

function loadSaveDate(){
     // buildGraph()
     var outcome_id = $("#outcome_id").val();
     var data = {"outcome_id" : outcome_id};
     $.ajax(
     {
     url : 'selectOutcomeResult',
     method : "POST",
     dataType : 'json',
     data : data,
     success : function(result)
     {
         console.log(result);
         if(result){
             var serverData = result;
           
             chartDataArr = serverData.chartDataArr
             chrTotalData = serverData.chrTotalData
             chrTotalIndex = serverData.chrTotalIndex
             chrPercent = serverData.chrPercent
             lengthData = serverData.lengthData
             lengthDataOrgin = serverData.lengthDataOrgin
            
             setTimeout(buildGraph(), 10)
         }
        
        
        
     }
     });
    }

// loadSaveDate();


function InsertOutcome()
{
	var outcome_id = $("#outcome_id").val();
            
	var data = {"outcome_id" : outcome_id, "outcome_result" : JSON.stringify({chartDataArr,chrTotalData,chrTotalIndex,chrPercent,lengthData,lengthDataOrgin})};
	
	$.ajax(
	{
		url : "updateOutcomeResult",
		method : "POST",
		data : data,
		dataType : "JSON",
		success : function(result)
		{
			if(result == 0)
			{
				alert("저장에 실패하였습니다.");
			}
			else
			{
				alert("저장되었습니다.");
			}
		},
		error : function(e)
		{
			console.log(e);
		}
	});
}
    
function InsertOutcomeResult()
{
	var data = new FormData($("#insertForm")[0]);
	data.set("user_username", $("#user_username").val());
	data.set("marker_id", $("#genomic_information").val());
	data.set("outcome_type", 3);
	data.set("outcome_result", JSON.stringify({chartDataArr,chrTotalData,chrTotalIndex,chrPercent,lengthData,lengthDataOrgin}));
	
	$.ajax(
	{
		url : "insertOutcomeResult",
		method : "POST",
		data : data,
		cache : false,
		contentType : false,
		processData : false,
		success : function(result)
		{
			if(result == 0)
			{
				alert("저장에 실패하였습니다.");
			}
			else
			{
				alert("저장되었습니다.");
			}
		},
		error : function(e)
		{
			console.log(e);
		}
	});
}
	
    
    
readLenFile();