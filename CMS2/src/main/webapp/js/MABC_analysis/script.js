
// ------------------------------------------------------
//                         그래프

// ------------------------------------------------------
var curLoadedData = {};
var xlsxData = {};
var graphWrap = document.querySelector(".graphWrap");
var chartDataArr = {};
var chrTotalData = {};
var chrTotalIndex = 0;
var chrTotalCount = {};
var chrTotalAllCount = {};
var chrPercent = {};
var clickX = 0;
var clickY = 0;
var lengthData = [];
var lengthDataOrgin = [];
var today = new Date();
var orginMABCXlsx = null;
var sortType = 0;
var parseData = {};

// # . 0 Len 파일 읽기
function onChangeLen(e) {
    var input = event.target;
    var fileForm = input.files[0].name.split(".")[1];
    if (fileForm !== "len") {
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
function parseLenData(data) {
    try {
        var newLengthData = data.replace(/(\r\n|\n|\r)/gm, "-");
        newLengthData = newLengthData.split("-");
        lengthDataOrgin = [];
        for (var i = 0; i < newLengthData.length; i++) {
            if (!newLengthData[i]) { continue }
            var lengthEl = newLengthData[i].split(" ");


            let chr = lengthEl[0];
            // if(chr[3] == "0"){
            //     chr = chr.split("");
            //     chr.splice(3, 1);
            //     chr = chr.join("");  
            // }

            //if(chr.substr(0, 3).toLowerCase() == "chr" || (chr.substr(0, 1).toLowerCase() == "c" && /^[0-9]*$/g.test( chr.substr(1) ) )){
            lengthDataOrgin.push({ id: chr.toLowerCase(), pos: lengthEl[1] });
            //}
        }
    } catch {
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
        if (fileForm !== "xlsx") {
            document.querySelector(".file_text").placeholder = "MABC xlsx파일을 넣어주세요.";
            alert(".xlsx 파일이 아닙니다.");
            event.target.value = null;
            return
        };
        document.querySelector(".file_text").value = input.files[0].name;
        var data = reader.result;
        var workBook = XLSX.read(data, { type: 'binary' });

        console.log(workBook.SheetNames)

        for (var i = 0; i < workBook.SheetNames.length; i++) {
            if (i != 0)
                continue;

            onClickInit(false)
            var rows = XLSX.utils.sheet_to_json(workBook.Sheets[workBook.SheetNames[i]]);
            xlsxData = JSON.parse(JSON.stringify(rows));
            orginMABCXlsx = input.files[0];
            parsingData(xlsxData);

        }
    };
    reader.readAsBinaryString(input.files[0]);
}

// # . 1-1 마커맵 엑셀
/* 표시용위치 맥스값 찾기  */
function getMaxGuestMbNumber(data) {
    var maxNum = 0;
    for (var key in data) { maxNum = maxNum > Number(data[key].guestPos) ? maxNum : Number(data[key].guestPos); }
    return maxNum;
}
function getExcelTitleFromData(data, search) {
    for (var key in data) {
        if (key.toLowerCase().includes(search)) {
            return key;
        }
    }
    return search;
}
function parsingDataMaker(xlsxData) {
    // 염색체 대분류 나누기
    let bigParseData = {}

    for (var i = 0; i < xlsxData.length; i++) {

        var keyTitle = getExcelTitleFromData(xlsxData[i], "염색체");
        var keyPivotTitle = getExcelTitleFromData(xlsxData[i], "분자표지명");

        var currentCategory = xlsxData[i][keyTitle];
        curLoadedData[xlsxData[i][keyPivotTitle]] = xlsxData[i];

        if (currentCategory) {
            bigParseData[currentCategory] = bigParseData[currentCategory] ? bigParseData[currentCategory] : [];
            bigParseData[currentCategory].push(xlsxData[i]);
        }
    }
    for (var key in bigParseData) {
        for (var i = 0; i < bigParseData[key].length; i++) {
            var currentData = bigParseData[key][i];
            var excelTitle_1 = getExcelTitleFromData(currentData, "분자표지명");
            var excelTitle_3 = getExcelTitleFromData(currentData, "위치");

            parseData[currentData[excelTitle_1]] = currentData[excelTitle_3];
        }
    }
}


// # . 2 data 원하는 형태로 변환
function parsingData(xlsxData, isRun) {

    var checkMap = {};

    try {
        for (var i = 0; i < xlsxData.length; i++) {

            var keyArr = Object.keys(xlsxData[i]);


            for (var key in xlsxData[i]) {

                if (!key.includes("MAB"))
                    continue;


                try {

                    var _pos = Number(xlsxData[i][keyArr[1]]);
                    //if(xlsxData[i][keyArr[1]].length == 1){continue;}

                    if (curLoadedData[xlsxData[i]["분자표지명"]] && curLoadedData[xlsxData[i]["분자표지명"]]["염색체"]) {

                        let posPivotTitle = getExcelTitleFromData(curLoadedData[xlsxData[i]["분자표지명"]], "실제");
                        let geneTitle = getExcelTitleFromData(curLoadedData[xlsxData[i]["분자표지명"]], "염색체");


                        // keyArr[2] = "분자표지명";
                        try {
                            xlsxData[i]["염색체"] = curLoadedData[xlsxData[i]["분자표지명"]][geneTitle];
                            // xlsxData[i][keyArr[0]] = curLoadedData[xlsxData[i]["분자표지명"]][geneTitle];
                            // xlsxData[i][keyArr[2]] = curLoadedData[xlsxData[i]["분자표지명"]][mabTitle];

                        }
                        catch (e) {
                            console.log(e);
                        }


                        _pos = curLoadedData[xlsxData[i]["분자표지명"]][posPivotTitle];

                    }
                    else {

                        _pos = xlsxData[i][getExcelTitleFromData(xlsxData[i], "위치")];
                        /*
                        if(parseData[xlsxData[i][getExcelTitleFromData( xlsxData[i], "위치")]]){
                            _pos = parseData[xlsxData[i][getExcelTitleFromData( xlsxData[i], "위치")]];
                        }
                        else if(xlsxData[i][getExcelTitleFromData( xlsxData[i], "위치")])
                            _pos = 0;*/
                    }

                    if (!key.includes("MAB"))
                        continue;

                    let gene = xlsxData[i][getExcelTitleFromData(xlsxData[i], "염색체")];
                    if (!gene)
                        continue;

                    //if(currentIndex === 0){


                    if (!checkMap[xlsxData[i]["분자표지명"] + "_" + gene]) {
                        // chrTotalCount[gene] = chrTotalCount[gene] ? chrTotalCount[gene] + 2 :2;
                        checkMap[xlsxData[i]["분자표지명"] + "_" + gene] = true;
                    }


                    //if(currentIndex < 5){continue;}
                    // if(key == "f" || key == "m" || key == "id" || key == "pos" || key == " "){continue;}


                    chartDataArr[key] = chartDataArr[key] ? chartDataArr[key] : [];
                    chrPercent[key] = {};
                    var type = "";

                    if (xlsxData[i][key] == xlsxData[i]["Recurrent"]) {
                        type = "B";
                        chrTotalCount[key + "_" + gene] = chrTotalCount[key + "_" + gene] ? chrTotalCount[key + "_" + gene] + 2 : 2;
                    } else if (xlsxData[i][key] == xlsxData[i]["Donor"]) {
                        type = "A";
                        chrTotalCount[key + "_" + gene] = chrTotalCount[key + "_" + gene] ? chrTotalCount[key + "_" + gene] : 0;
                    } else if (xlsxData[i][key] == "H") {
                        type = "H";
                        chrTotalCount[key + "_" + gene] = chrTotalCount[key + "_" + gene] ? chrTotalCount[key + "_" + gene] + 1 : 1;
                    } else {
                        type = "-";
                        chrTotalCount[key + "_" + gene] = chrTotalCount[key + "_" + gene] ? chrTotalCount[key + "_" + gene] : 0;
                    }

                    chrTotalAllCount[key + "_" + gene] = chrTotalAllCount[key + "_" + gene] ? chrTotalAllCount[key + "_" + gene] + 1 : 1;




                    chartDataArr[key].push({
                        // type : xlsxData[i][key],
                        type: type,
                        pos: _pos,
                        chr: xlsxData[i][getExcelTitleFromData(xlsxData[i], "염색체")],
                        name: xlsxData[i][getExcelTitleFromData(xlsxData[i], "분자표지명")]
                        // pos : xlsxData[i]["pos"],
                        // chr : xlsxData[i]["id"],
                        // name: xlsxData[i][" "]
                    });



                } catch {
                    console.error(i + "_index mabc parse Error")
                }

            }


            if (curLoadedData[xlsxData[i]["분자표지명"]] && curLoadedData[xlsxData[i]["분자표지명"]]["염색체"]) {

                xlsxData[i][keyArr[0]] = curLoadedData[xlsxData[i]["분자표지명"]][keyArr[0]];
                xlsxData[i][keyArr[2]] = curLoadedData[xlsxData[i]["분자표지명"]][keyArr[2]];
                let posPivotTitle = getExcelTitleFromData(curLoadedData[xlsxData[i]["분자표지명"]], "염색체");
                let posTitle = getExcelTitleFromData(curLoadedData[xlsxData[i]["분자표지명"]], "실제");

                chrTotalData[curLoadedData[xlsxData[i]["분자표지명"]][posPivotTitle]] = curLoadedData[xlsxData[i]["분자표지명"]][posTitle];

            }
            else if (xlsxData[i][keyArr[1]].length !== 1) {
                chrTotalData[xlsxData[i][getExcelTitleFromData(xlsxData[i], "염색체")]] = xlsxData[i][getExcelTitleFromData(xlsxData[i], "위치")];
            }
        }


        var chrSelectBox = document.querySelector(".chrSelectBox");
        chrSelectBox.innerHTML = "<option disabled selected>회복율정렬 선택</option><option>정렬 해제</option>"
        if (lengthDataOrgin.length == 0) {
            alert("잘못된 버전의 Len파일입니다.")
            console.error("lengthDataOrgin is empty");
            return;
        }

        for (var k in lengthDataOrgin) {

            if (lengthDataOrgin[k].id == "name")
                continue;
            for (var key in chartDataArr) {

                let isIn = false;
                for (var i = 0; i < chartDataArr[key].length; i++) {
                    if (chartDataArr[key][i].chr == lengthDataOrgin[k].id) {
                        isIn = true;
                        break;
                    }
                }

                if (isIn == false) {
                    chrTotalData[lengthDataOrgin[k].id] = Number(lengthDataOrgin[k].pos);
                    chartDataArr[key].push({ type: 'B', pos: lengthDataOrgin[k].pos, chr: lengthDataOrgin[k].id, name: '' });
                    chrPercent[key][lengthDataOrgin[k].id] = 100;
                }

            }
        }

        try {
            var newLengthData = {};
            for (var i = 0; i < lengthDataOrgin.length; i++) {
                for (var key in chrTotalData) {
                    if (key.toLowerCase() == lengthDataOrgin[i].id.toLowerCase()) {
                        chrTotalIndex = (chrTotalIndex ? chrTotalIndex : 0) + Number(lengthDataOrgin[i].pos);
                        var chrSelectOption = document.createElement("option");
                        // chrSelectOption.innerText = Object.keys( chrTotalData )[i];
                        chrSelectOption.innerText = key;

                        if (sortType == key) {
                            chrSelectOption.setAttribute("selected", true);
                        };

                        chrSelectOption.classList.add("chrOption");
                        chrSelectBox.appendChild(chrSelectOption);
                        // newLengthData[  Object.keys( chrTotalData )[i] ] = Number(lengthDataOrgin[i].pos);
                        newLengthData[key] = Number(lengthDataOrgin[i].pos);

                    }
                }
            }

        } catch {
            alert("잘못된 Len파일입니다.")
            console.error("newLengthData parse Error")
            return;
        }

        lengthData = newLengthData;


        console.log(lengthData);
        console.log(lengthDataOrgin);
        console.log(chrTotalData);


        if (Object.keys(chartDataArr).length == 0) {
            //alert("잘못된 MABC파일입니다.");
            console.error("chartDataArr empty")
            return;
        }

        console.log(newLengthData);

        if (Object.keys(newLengthData).length == 0) {
            var errorChr = Object.keys(chrTotalData)[0].replace(/[0-9]/g, "");
            //alert("잘못된 버전의 MABC파일입니다. " +errorChr+"이(가) len파일에 없습니다.");
            alert("시스템에 등록 된 염색체 이름과 업로드 화일의 염색체 이름이 일치하지 않습니다.");
            console.error("newLengthData empty")
            return;
        }

        if (isRun) {
            buildGraph();
        }
        return;
    } catch {
        alert("잘못된 MABC파일입니다.")
        console.error("MABC parsingData Error Catch");
    };


}

// # . 3 그래프 생성
function buildGraph() {

    // 초기화
    var visualWrap = document.querySelector(".visualWrap");
    var visualWrapPosition = document.querySelector(".visualWrapPosition");
    visualWrap.remove();
    visualWrapPosition.innerHTML = "<div class='visualWrap'><div class='tableWrap' ><div class='tableContent'><table id='table' class='table'></table></div></div><div class='graphContainer'><div class='graphWrap'></div></div></div>"

    graphWrap = document.querySelector(".graphWrap");
    for (var key in chrPercent) {
        chrPercent[key] = {}
    }

    // 부모 생성
    function makeParent(className) {
        var graphElName = document.createElement('div');
        graphElName.classList.add("graphElName");
        var divEl = document.createElement('div');
        divEl.classList.add(className);

        var graphName = document.createElement('div');
        var text = "";

        if (className == "mother") {
            text = "Recurrent";
        } else {
            text = "Donor";
        }
        graphName.innerText = text;
        graphName.classList.add("graphName");

        graphElName.appendChild(graphName);
        graphElName.appendChild(divEl);
        graphWrap.appendChild(graphElName);
    }

    var count = 0;

    // 클 틀 생성
    for (var key in chartDataArr) {
        if (count == 0) {
            var chrNameBar = document.createElement('div');
            var chrNameDefault = document.createElement('div');
            var chrNameEl = document.createElement('div');
            chrNameDefault.classList.add("graphName");
            chrNameBar.appendChild(chrNameDefault);
            chrNameBar.classList.add("graphElName");
            chrNameEl.classList.add("graphElStackName");

            // 이름이름
            for (var keyChr in chrTotalData) {
                if (typeof (chrTotalData[keyChr]) == "number") {
                    var chrName = document.createElement('div');
                    // chrName.innerText = keyChr;
                    chrName.innerText = "";
                    chrName.classList.add("chrStackName");

                    chrName.style.height = (100 / chrTotalIndex) * lengthData[keyChr] + "%";
                    chrNameEl.appendChild(chrName);
                }
            }

            chrNameBar.appendChild(chrNameEl);
            graphWrap.appendChild(chrNameBar);
            makeParent("mother");
            makeParent("father");
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

        graphElName.appendChild(graphName);
        graphElName.appendChild(divEl);
        graphWrap.appendChild(graphElName);


        for (var keySmall in lengthData) {
            // if(typeof(chrTotalData[keySmall])!=="number"){continue;}
            var divElSmall = document.createElement('div');
            divElSmall.setAttribute("data-column", keySmall);
            divElSmall.classList.add("chrStack");
            divElSmall.style.height = (100 / chrTotalIndex) * lengthData[keySmall] + "%";
            divEl.appendChild(divElSmall);
        }


        // 작은거 안에 작은거 생성 
        for (var i = 0; i < chartDataArr[key].length; i++) {
            var chrPos = chartDataArr[key][i]["pos"];

            var divElSmallStack = document.createElement('div');
            divElSmallStack.setAttribute("data-pos", chrPos);
            divElSmallStack.setAttribute("data-chr", chartDataArr[key][i]["chr"]);
            divElSmallStack.setAttribute("data-type", chartDataArr[key][i]["type"]);
            divElSmallStack.classList.add("chrStackSmall");


            // 높이값
            var gap = 0;
            if (i == 0) {
                // 제일 처음
                gap = chrPos + ((chartDataArr[key][i + 1]["pos"] - chrPos) / 2);

                if (chartDataArr[key][i]["chr"] !== chartDataArr[key][i + 1]["chr"]) {
                    gap = "full";
                }
            } else {
                // 제일 끝
                if (i == chartDataArr[key].length - 1) {
                    gap = (lengthData[chartDataArr[key][i]["chr"]] - chrPos) + ((chrPos - chartDataArr[key][i - 1]["pos"]) / 2)
                } else {

                    if ((chartDataArr[key][i]["chr"] !== chartDataArr[key][i - 1]["chr"]) && (chartDataArr[key][i]["chr"] !== chartDataArr[key][i + 1]["chr"])) {
                        gap = "full";
                    } else {
                        // 다음과 동일할때 
                        if (chartDataArr[key][i]["chr"] == chartDataArr[key][i + 1]["chr"]) {
                            // 이전과 동일할때
                            if (chartDataArr[key][i]["chr"] == chartDataArr[key][i - 1]["chr"]) {
                                gap = ((chrPos - chartDataArr[key][i - 1]["pos"]) / 2) + ((chartDataArr[key][i + 1]["pos"] - chrPos) / 2);
                            } else {
                                gap = chrPos + (chartDataArr[key][i + 1]["pos"] - chrPos) / 2;
                            }
                        } else {
                            gap = (lengthData[chartDataArr[key][i]["chr"]] - chrPos) + ((chrPos - chartDataArr[key][i - 1]["pos"]) / 2);
                        }
                    }
                }
            }

            var currentChr = chartDataArr[key][i]["chr"];
            var divElSmall = divEl.querySelector("[data-column='" + currentChr + "']");

            chrPercent[key][currentChr] = chrPercent[key][currentChr] ? chrPercent[key][currentChr] : 0;

            // if(currentChr == "chr12"){
            //     console.log(gap);
            //     console.log( chrPos);
            //     console.log( chartDataArr[key][i]);
            //     console.log( lengthData[chartDataArr[key][i]["chr"]]);


            // }

            if (gap == "full") {
                divElSmallStack.style.height = "100%";
            } else if (gap < 0) {
                divElSmallStack.style.height = "100%";
            }
            else {
                divElSmallStack.style.height = (100 / lengthData[currentChr]) * gap + "%";
            }

            // 배경색
            if (chartDataArr[key][i]["type"] == "A") {
                divElSmallStack.style.backgroundColor = "#6982ff"
                chrPercent[key][currentChr]++;
            } else if (chartDataArr[key][i]["type"] == "B") {
                chrPercent[key][currentChr] = chrPercent[key][currentChr] + 2;
                divElSmallStack.style.backgroundColor = "#ff6982"
            } else {
                divElSmallStack.style.backgroundColor = "#a3a3a3"
            }

            if (divElSmall) {
                divElSmall.appendChild(divElSmallStack);
            }

        }
    }
    // 점선 추가
    var graphContainer = document.querySelector(".graphContainer");
    for (var key in lengthData) {
        if (typeof (lengthData[key]) == "number") {
            var dotEl = document.createElement('div');
            var dotName = document.createElement('div');
            var currentChr = document.querySelector("[data-column='" + key + "']");
            var chtHeight = currentChr.getBoundingClientRect().bottom;

            dotEl.classList.add("dotline");
            dotEl.style.top = (chtHeight - graphContainer.getBoundingClientRect().top) + "px";
            dotEl.style.height = currentChr.offsetHeight + "px";

            // 점선에 이름 추가
            dotEl.style.lineHeight = currentChr.offsetHeight + "px";

            dotName.innerText = key;
            dotName.style.height = (currentChr.offsetHeight - 1) + "px";
            dotName.classList.add("dotName");
            dotEl.appendChild(dotName);

            dotEl.style.transform = "translateY(-" + currentChr.offsetHeight + "px)";
            graphContainer.appendChild(dotEl);
        }
    }

    // 새로운 퍼센트 20220303
    for (var key in chrPercent) {
        for (var keySmall in chrPercent[key]) {
            chrPercent[key][keySmall] = (chrTotalCount[key + "_" + keySmall] / (2 * chrTotalAllCount[key + "_" + keySmall])) * 100;
        }
    }

    // 토탈식
    var chrTotalLength = Object.keys(lengthData).length;
    for (var key in chrPercent) {
        var totalA = parseFloat("0");

        for (var keySmall in chrPercent[key]) {
            chrPercent[key][keySmall] = chrPercent[key][keySmall] ? chrPercent[key][keySmall] : 100;
            totalA += chrPercent[key][keySmall];
        }

        chrPercent[key]["total"] = totalA / chrTotalLength;
    }

    // var newChrPercent = chrPercent; 
    // for(var key in chrPercent){
    //     var totalA = 0;
    //     for(var keySmall in chrPercent[key]){
    //         totalA += (chrPercent[key][keySmall] * lengthData[keySmall])/100;
    //     }
    //     newChrPercent[key]["total"] = totalA / chrTotalIndex * 100
    // }

    // 토탈 맨 앞으로 
    for (var key in chrPercent) {
        chrPercent[key] = Object.entries(chrPercent[key])
        chrPercent[key].unshift(chrPercent[key][chrPercent[key].length - 1]);
        chrPercent[key].pop();
        chrPercent[key] = Object.fromEntries(chrPercent[key]);
    }

    // var chrSelectBox = document.querySelector(".chrSelectBox");
    // for (var i = 0; i < lengthDataOrgin.length; i++) {
    //     for (var key in chrTotalData) {
    //         if (key.toLowerCase() == lengthDataOrgin[i].id.toLowerCase()) {
    //             var chrSelectOption = document.createElement("option");
    //             // chrSelectOption.innerText = Object.keys( chrTotalData )[i];
    //             chrSelectOption.innerText = key;
    //             if (sortType == key) {
    //                 chrSelectOption.setAttribute("selected", true);
    //             }


    //             chrSelectOption.classList.add("chrOption_this2");
    //             chrSelectBox.appendChild(chrSelectOption);
    //             console.log(chrSelectOption, 'this');
    //         }
    //     }
    // }


    // chrPercent = newChrPercent;

    addGraphEvent();
    buildTable();
}

// 드래그&드롭, 더블클릭 이벤트 추가
function addGraphEvent() {
    if (window.innerWidth > 1000) {
        var isMouseMove = false;
        var clickColumn = "";
        graphWrap.addEventListener("mousedown", function (e) {
            if (e.path[0].classList.contains("chrStackSmall")) {
                isMouseMove = true;
                clickColumn = e.path[2].dataset.column;

                var clickEl = document.querySelector("[data-column='" + clickColumn + "']");
                clickY = e.clientY - clickEl.offsetTop;
                clickX = e.clientX - clickEl.offsetLeft;


                var clickElTable = document.querySelector("[data-column='" + clickColumn + "_table']");
                var currentSelect = document.querySelectorAll(".activeClickAni");
                for (var i = 0; i < currentSelect.length; i++) {
                    currentSelect[i].classList.remove("activeClickAni");
                }

                $('.tableWrap').animate({ scrollTop: clickElTable.offsetTop - $('.tableWrap')[0].offsetHeight / 2 }, 500);
                clickElTable.classList.add("activeClickAni");

            }
        });

        graphWrap.addEventListener("mousemove", function (e) {
            if (!isMouseMove) { return };
            var clickEl = document.querySelector("[data-column='" + clickColumn + "']").parentNode;
            clickEl.style.position = "absolute";
            clickEl.style.top = `${e.clientY - clickY}px`;
            clickEl.style.left = `${e.clientX - clickX}px`;
            clickEl.style.pointerEvents = "none";


            // 그림자
            if (!e.path[2].dataset.column) { return; }
            var currentEl = document.querySelector("[data-column='" + e.path[2].dataset.column + "']").parentNode;
            var currentShadow = document.querySelector(".graphShadow");
            if (currentShadow) {
                currentShadow.remove();
            }

            var shadowGraph = document.createElement('div');
            shadowGraph.classList.add("graphShadow");

            clickEl.parentNode.insertBefore(shadowGraph, currentEl)

        });

        graphWrap.addEventListener("mouseup", function (e) {
            isMouseMove = false;
            if (!clickColumn) { return; }
            var clickEl = document.querySelector("[data-column='" + clickColumn + "']").parentNode;
            var currentShadow = document.querySelector(".graphShadow");
            if (!currentShadow) { return }

            clickEl.style.position = "unset";
            clickEl.style.top = 0;
            clickEl.style.left = 0;
            clickEl.style.pointerEvents = "all";

            clickEl.parentNode.replaceChild(clickEl, currentShadow);
            console.log()
            sortGraphData();
        });

        graphWrap.addEventListener("dblclick", function (e) {
            if (e.path[0].classList.contains("chrStackSmall")) {
                var modalSelectOption = document.querySelectorAll(".modalSelectOption");
                if (modalSelectOption) {
                    for (var i = 0; i < modalSelectOption.length; i++) {
                        modalSelectOption[i].remove();
                    }
                }

                var modal = document.querySelector(".modal");
                modal.style.display = "unset";
                drawModalGraph(e.path[2].dataset.column);
            }
        });
    } else {
        graphWrap.addEventListener("click", function (e) {
            if (e.path[0].classList.contains("chrStackSmall")) {
                var modalSelectOption = document.querySelectorAll(".modalSelectOption");
                if (modalSelectOption) {
                    for (var i = 0; i < modalSelectOption.length; i++) {
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
function sortGraphData() {
    var newChrArr = [];
    var graphEls = document.querySelectorAll(".graphEl");

    for (var i = 0; i < graphEls.length; i++) {
        newChrArr.push(graphEls[i].dataset.column)
    }
    var newChrObj = {};

    for (var i = 0; i < newChrArr.length; i++) {
        newChrObj[newChrArr[i]] = chartDataArr[newChrArr[i]];
    }
    chartDataArr = newChrObj;
    buildTable();
}




// ------------------------------------------------------
//                         테이블
// ------------------------------------------------------
var isTable = false;
function buildTable() {
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
    var theadThTotla = document.createElement('th');
    theadThTotla.innerText = "Total";
    theadTr.appendChild(theadThTotla);




    // for(var key in chrTotalData){
    for (var key in lengthDataOrgin) {

        if (lengthDataOrgin[key].id == "name")
            continue;

        var theadTh = document.createElement('th');
        theadTh.innerText = lengthDataOrgin[key].id;
        theadTr.appendChild(theadTh);
    }

    thead.appendChild(theadTr);

    // 몸통
    var tbody = document.createElement('tbody');
    for (var key in chartDataArr) {

        //alert(key);
        var tbodyTr = document.createElement('tr');
        var tbodyTdName = document.createElement('td');
        tbodyTdName.innerText = key;
        tbodyTr.setAttribute("data-column", key + "_table");
        tbodyTr.appendChild(tbodyTdName);
        tbody.appendChild(tbodyTr);

        for (var keySmall in chrPercent[key]) {
            var tbodyTd = document.createElement('td');

            var percentText = Number(chrPercent[key][keySmall] ? chrPercent[key][keySmall] : 100).toFixed(2);
            if (Math.ceil(percentText) == percentText) {
                percentText = Math.ceil(percentText);
            }
            tbodyTd.className = "txt";
            tbodyTd.innerText = percentText.toString();//+ "%";

            if (percentText >= 50) {
                //$(tbodyTd).attr('style', "mso-number-format:'\@'; background-color : hsl(355, 100%, " + (150-Number(percentText)) + "%);");
                tbodyTd.setAttribute("style", "mso-number-format:'\@'; background-color : hsl(355, 100%, " + (150 - Number(percentText)) + "%);");

            } else {
                // $(tbodyTd).attr('style', "mso-number-format:'\@';background-color : hsl(230, 100%, " + (120-Number(percentText)) + "%);");
                tbodyTd.setAttribute("style", "mso-number-format:'\@'; background-color : hsl(355, 100%, " + (150 - Number(percentText)) + "%);");
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
function sortTableData() {
    var newChrArr = [];
    var tbodyChildren = document.querySelector("tbody").children;

    for (var i = 0; i < tbodyChildren.length; i++) {
        newChrArr.push(tbodyChildren[i].dataset.column.replace("_table", ""));
    }
    var newChrObj = {};
    for (var i = 0; i < newChrArr.length; i++) {
        newChrObj[newChrArr[i]] = chartDataArr[newChrArr[i]];
    }
    chartDataArr = newChrObj;

    buildGraph();
}

// 드래그&드롭 이벤트 추가
function addTableEvent() {
    var isMouseMove = false;
    var tableWrap = document.querySelector('.tableWrap');
    tableWrap.addEventListener("mousedown", function (e) {
        if (!e.path[1].dataset.column) { return };
        isMouseMove = true;
        clickTableColumn = e.path[1].dataset.column;
        var clickEl = document.querySelector("[data-column='" + clickTableColumn + "']");
        clickEl.style.opacity = "0.5";
        clickEl.style.border = "5px solid #000";

        var clickElGraph = document.querySelector("[data-column='" + clickTableColumn.replace("_table", "") + "']");
        $('.graphWrap').animate({ scrollLeft: clickElGraph.offsetLeft - $('.graphWrap')[0].offsetWidth / 2 }, 500);


        var currentSelect = document.querySelectorAll(".activeClickAni");
        for (var i = 0; i < currentSelect.length; i++) {
            currentSelect[i].classList.remove("activeClickAni");
        }

        clickElGraph.classList.add("activeClickAni");
    })
    tableWrap.addEventListener("mousemove", function (e) {
        if (!isMouseMove) { return; }
        if (!e.path[1].dataset.column) { return };

        var currentShadow = document.querySelector(".tableShadow");
        if (currentShadow) {
            currentShadow.remove();
        }

        hoverTableColumn = e.path[1].dataset.column;
        var hoverEl = document.querySelector("[data-column='" + hoverTableColumn + "']");

        var shadowGraph = document.createElement('div');
        shadowGraph.classList.add("tableShadow");

        hoverEl.parentNode.insertBefore(shadowGraph, hoverEl);
    })
    tableWrap.addEventListener("mouseup", function (e) {
        if (!isMouseMove) { return }
        isMouseMove = false;

        var clickEl = document.querySelector("[data-column='" + clickTableColumn + "']");
        clickEl.style.opacity = "1";
        clickEl.style.border = "0";

        var currentShadow = document.querySelector(".tableShadow");
        if (!currentShadow) { return }
        clickEl.parentNode.replaceChild(clickEl, currentShadow);
        sortTableData();
    })

}


// ------------------------------------------------------
//                         사진찍기
// ------------------------------------------------------
// 그래프
function downloadGraphImg(e) {
    var fileName = document.querySelector(".file_text").value;

    initAnimation();
    window.scrollTo(0, 0);
    var cloneParent = document.createElement('div');
    cloneParent.classList.add("cloneParent")
    // var cloneEl = graphWrap.cloneNode(true);
    var cloneEl = document.querySelector(".graphContainer").cloneNode(true);

    var dotLineEls = cloneEl.querySelectorAll(".dotline");
    for (var i = 0; i < dotLineEls.length; i++) {
        dotLineEls[i].style.left = "unset";
        dotLineEls[i].style.width = "100%";
    }


    cloneEl.style.overflow = "unset";
    cloneEl.style.height = "unset";
    var graphElNameEls = document.querySelectorAll(".graphElName");
    cloneEl.style.width = ((graphElNameEls.length * 37) + 50) + "px";

    cloneParent.appendChild(cloneEl);
    document.querySelector("body").appendChild(cloneParent);

    html2canvas(cloneEl).then(function (canvas) {
        var myImage = canvas.toDataURL();
        downloadURI(myImage, DateText(today) + "_mabc_map_" + fileName + ".png")
    });

}
// 테이블
function downloadTableImg(e) {
    var fileName = document.querySelector(".file_text").value;
    var excelHandler = {
        getExcelFileName: function () {
            return DateText(today) + "_mabc_table_" + fileName + ".xlsx";	//파일명
        },
        getSheetName: function () {
            return "mabc_table";	//시트명
        },
        getExcelData: function () {
            return document.querySelector('.table'); 	//TABLE id
        },
        getWorksheet: function () {
            return XLSX.utils.table_to_sheet(this.getExcelData());
        }
    }

    function s2ab(s) {
        var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
        var view = new Uint8Array(buf);  //create uint8array as viewer
        for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
        return buf;
    }

    function exportExcel() {
        // step 1. workbook 생성
        var wb = XLSX.utils.book_new();

        // step 2. 시트 만들기 
        var newWorksheet = excelHandler.getWorksheet();

        // step 3. workbook에 새로만든 워크시트에 이름을 주고 붙인다.  
        XLSX.utils.book_append_sheet(wb, newWorksheet, excelHandler.getSheetName());

        // step 4. 엑셀 파일 만들기 
        var wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

        // step 5. 엑셀 파일 내보내기 
        saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), excelHandler.getExcelFileName());
    }
    exportExcel();
    return;

    var fileName = document.querySelector(".file_text").value;

    initAnimation();
    window.scrollTo(0, 0);

    var cloneParent = document.createElement('div');
    cloneParent.classList.add("cloneParent")
    var originEl = document.querySelector(".table");
    var cloneEl = originEl.cloneNode(true);
    cloneParent.appendChild(cloneEl);
    document.querySelector("body").appendChild(cloneParent);

    html2canvas(cloneEl).then(function (canvas) {
        var myImage = canvas.toDataURL();
        downloadURI(myImage, DateText(today) + "_mabc_table_" + fileName + ".png")
    });
}
// 모달
function downloadModalImg() {
    var fileName = document.querySelector(".file_text").value;
    initAnimation();
    window.scrollTo(0, 0);
    var modalGraph_scale = document.querySelector(".modalGraph_scale");
    modalGraph_scale.style.transform = "scale(1)";

    var cloneParent = document.createElement('div');
    cloneParent.classList.add("cloneParent")
    var originEl = document.querySelector(".modalGraph_Wrap");
    var cloneEl = originEl.cloneNode(true);
    var modalGraphEl = cloneEl.querySelectorAll(".modalGraphEl");
    for (var i = 0; i < modalGraphEl.length; i++) {
        modalGraphEl[i].style.overflow = "unset";
    }
    cloneEl.style.overflow = "unset";
    cloneEl.style.width = "unset";

    cloneParent.appendChild(cloneEl);
    document.querySelector("body").appendChild(cloneParent);


    html2canvas(cloneEl).then(function (canvas) {
        var myImage = canvas.toDataURL();
        downloadURI(myImage, DateText(today) + "_mabc_detail_map_" + fileName + ".png");
    });
}
function downloadURI(uri, name) {
    var link = document.createElement("a")
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.querySelector(".cloneParent").remove();
}
// 날짜 변환
function DateText(date) {
    var month = String(date.getMonth() + 1);
    var _date = String(date.getDate());

    if (month.length == 1) {
        month = "0" + String(date.getMonth() + 1);
    }
    if (_date.length == 1) {
        _date = "0" + String(date.getDate());
    }

    return (date.getFullYear() + month + _date)
}
function onClickDownload() {
    var downloadSelectBox = document.querySelector(".downloadSelectBox");
    var selectText = downloadSelectBox.options[downloadSelectBox.selectedIndex].innerText;

    if (selectText == "파일 선택") {
        alert("옵션을 선택해주세요.")
    } else if (selectText == "샘플파일") {
        var link = document.createElement("a")
        link.href = "./dataFile/test_MABC.xlsx";
        document.body.appendChild(link);
        link.click();
    } else if (selectText == "map") {
        downloadGraphImg();
    } else if (selectText == "table") {
        downloadTableImg();
    }
}



// ------------------------------------------------------
//                         초기화
// ------------------------------------------------------
function onClickInit(isRender) {
    // var addMabcFileEls = document.querySelectorAll(".addMabcFile")
    // for(var i = 0 ; i < addMabcFileEls.length ; i++){
    //     addMabcFileEls[i].value = "";
    // }

    //document.querySelector(".file_text").placeholder = "MABC xlsx파일을 넣어주세요.";
    var visualWrap = document.querySelector(".visualWrap");
    var visualWrapPosition = document.querySelector(".visualWrapPosition");

    visualWrap.remove();
    visualWrapPosition.innerHTML = "<div class='visualWrap'><div class='tableWrap' ><div class='tableContent'><table id='table' class='table'></table></div></div><div class='graphContainer'><div class='dotline'></div><div class='graphWrap'></div></div></div>"

    var chrOptionBox = document.querySelectorAll(".chrOption");
    for (var i = 0; i < chrOptionBox.length; i++) {
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

    if (isRender) {
        if (Object.keys(lengthData).length == 0) {
            document.querySelector(".file_text").value = "";
            document.querySelector("#input-file").value = "";
        } else {
            parsingData(xlsxData, true);
        }
    }

    // if(isRender){
    //     parsingData(xlsxData, true);
    // }
}
function initAnimation() {
    var activeClickAniEls = document.querySelectorAll(".activeClickAni");
    for (var i = 0; i < activeClickAniEls.length; i++) {
        activeClickAniEls[i].classList.remove("activeClickAni");
    }
}




// ------------------------------------------------------
//                         모달
// ------------------------------------------------------
function drawModalGraph(_graphName) {


    // 데이터 변환 작업
    var graphName = chartDataArr[_graphName];
    var modalGraph_scale = document.querySelector(".modalGraph_scale");
    modalGraph_scale.innerHTML = "";
    let modalGraphData = {};


    for (var i = 0; i < graphName.length; i++) {
        modalGraphData[graphName[i].chr] = modalGraphData[graphName[i].chr] ? modalGraphData[graphName[i].chr] : [];
        modalGraphData[graphName[i].chr].push({
            pos: graphName[i].pos,
            name: graphName[i].name,
            type: graphName[i].type,
            chr: graphName[i].chr
        })
    }

    for (var key in lengthData) {
        lengthData[key] = 0;
    }

    for (let key in modalGraphData) {
        modalGraphData[key].sort(function (a, b) { return a.pos - b.pos; });
        for (var i = 0; i < modalGraphData[key].length; i++) {
            lengthData[key] = lengthData[key] > modalGraphData[key][i].pos ? lengthData[key] : modalGraphData[key][i].pos;
        }
    }

    var bigLength = 0;

    for (var key in lengthData) {
        if (bigLength < lengthData[key]) {
            bigLength = lengthData[key];
        }
    }

    // 그래프 그리기 
    for (var key in modalGraphData) {

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


        for (var i = 0; i < modalGraphData[key].length; i++) {



            // 스택
            var modalGraphStack = document.createElement('div');
            modalGraphStack.classList.add("modalGraphElStack");
            modalGraphStack.setAttribute("data-column", key + "_modal");

            // 스택 이름
            var modalStackDesc = document.createElement('div');
            modalStackDesc.classList.add("modalStackDesc");
            modalStackDesc.setAttribute("data-column", key + "_modalDesc");
            modalStackDesc.innerHTML = "".padStart(modalGraphData[key][i]["name"].length, "A");

            // 스택 이름
            var modalStackDescLine = document.createElement('div');
            modalStackDescLine.classList.add("modalStackDescLine");
            modalStackDescLine.setAttribute("data-column", key + "_modalDescLine");


            // 높이값
            var gap = 0;

            if (i == 0) {
                // 제일 처음
                if (modalGraphData[key].length == 1) {
                    gap = "full";
                } else {
                    gap = modalGraphData[key][i]["pos"] + ((modalGraphData[key][i + 1]["pos"] - modalGraphData[key][i]["pos"]) / 2);
                }
            } else {
                // 제일 끝
                if (i == modalGraphData[key].length - 1) {
                    gap = (lengthData[modalGraphData[key][i]["chr"]] - modalGraphData[key][i]["pos"]) + ((modalGraphData[key][i]["pos"] - modalGraphData[key][i - 1]["pos"]) / 2);
                } else {
                    //gap = modalGraphData[key][i]["pos"] + ( (  modalGraphData[key][i+1]["pos"] - modalGraphData[key][i]["pos"]) / 2 );
                    gap = ((modalGraphData[key][i]["pos"] - modalGraphData[key][i - 1]["pos"]) / 2) + ((modalGraphData[key][i + 1]["pos"] - modalGraphData[key][i]["pos"]) / 2);
                }
            }

            if (gap == "full") {
                modalGraphStack.style.height = "100%";
            } else {
                modalGraphStack.style.height = (100 / lengthData[key]) * gap + "%";
            }

            // // 배경색
            if (modalGraphData[key][i]["type"] == "A") {
                modalGraphStack.style.backgroundColor = "#6982ff"
            } else if (modalGraphData[key][i]["type"] == "B") {
                modalGraphStack.style.backgroundColor = "#ff6982"
            } else {
                modalGraphStack.style.backgroundColor = "#a3a3a3"
            }



            modalGraph.appendChild(modalStackDesc);
            modalGraph.appendChild(modalStackDescLine);
            modalGraph.appendChild(modalGraphStack);
        }

        modalGraphSection.appendChild(modalGraphName);
        modalGraphSection.appendChild(modalGraph);
        modalGraph_scale.appendChild(modalGraphSection);

        var stacEls = modalGraph.querySelectorAll("[data-column=" + key + "_modal" + "]");
        var stackDescEls = modalGraph.querySelectorAll("[data-column=" + key + "_modalDesc" + "]");
        var stackDescLineEls = modalGraph.querySelectorAll("[data-column=" + key + "_modalDescLine" + "]");
        var marinLeft = 0;





        for (var i = 0; i < stackDescEls.length; i++) {


            console.log(modalGraphData[key][i]["name"]);
            if (modalGraphData[key][i]["name"].length == 0) {
                stackDescLineEls[i].style.display = "none";
                continue;
            }


            // 탑
            // stackDescEls[i].style.top = stacEls[i].offsetTop + (stacEls[i].clientHeight/2) + "px";
            stackDescEls[i].style.top = (stacEls[i].offsetTop) + "px";
            stackDescLineEls[i].style.top = stacEls[i].offsetTop + "px"


            // 높이값 조정
            if (i !== 0) {
                var offsetBottom = stackDescEls[i - 1].offsetTop + stackDescEls[i - 1].offsetHeight;
                if (offsetBottom > stackDescEls[i].offsetTop)
                    stackDescEls[i].style.top = offsetBottom + "px";
            }

            // 마진
            if (marinLeft < stackDescEls[i].clientWidth) {
                marinLeft = stackDescEls[i].clientWidth;
            }

            var lineX = stackDescLineEls[i].offsetLeft;
            var lineY = stackDescLineEls[i].offsetTop;

            var descX = stackDescEls[i].offsetLeft;
            var descY = stackDescEls[i].offsetTop + (stackDescEls[i].clientHeight / 2);


            var x = descX - lineX;
            var y = descY - lineY;

            var radian = Math.atan2(y, x);
            var degree = radian * 180 / Math.PI // 라디안 -> 디그리 변환

            stackDescLineEls[i].style.transform = "rotate(" + degree + "deg)";
            stackDescLineEls[i].style.width =
                Math.sqrt(
                    Math.pow((descY - lineY), 2) + Math.pow((Math.abs(descX - lineX)), 2)
                ) - 4 + "px";

            stackDescEls[i].innerHTML = modalGraphData[key][i]["name"];
        }
        modalGraph.style.marginRight = marinLeft + 60 + "px";
    }

    var mabcModalSelect = document.querySelector(".mabcModalSelect");
    for (var key in chartDataArr) {
        var selectOption = document.createElement('option');
        selectOption.innerText = key;
        selectOption.classList.add("modalSelectOption");
        if (_graphName == key) {
            selectOption.setAttribute("selected", true);
        }
        mabcModalSelect.appendChild(selectOption);
    }

}
function closeMOdal() {
    var modal = document.querySelector(".modal");
    modal.style.display = "none";
}
function onChangeModalSelect() {
    var mabcModalSelect = document.querySelector(".mabcModalSelect");


    drawModalGraph(mabcModalSelect.options[mabcModalSelect.selectedIndex].innerText)
}
function onClickZoom(isZoomIn) {
    var modalGraph_scale = document.querySelector(".modalGraph_scale");
    var style = window.getComputedStyle(modalGraph_scale);
    var matrix = new WebKitCSSMatrix(style.transform);
    if (!isZoomIn && matrix.m11 == 0.4) { return; }
    if (isZoomIn && matrix.m11 == 2.5) { return; }
    var changeValue = matrix.m11 + (isZoomIn ? 0.3 : -0.3)
    modalGraph_scale.style.transform = "scale(" + changeValue + ")"
    var modalSlider = document.querySelector(".modalSlider");
    modalSlider.value = Number(modalSlider.value) + (isZoomIn ? 1 : -1)
}









// ------------------------------------------------------
//                         정렬
// ------------------------------------------------------
function onChangeChrSort() {
    var chrSelectBox = document.querySelector(".chrSelectBox");
    var selectText = chrSelectBox.options[chrSelectBox.selectedIndex].innerText;

    sortType = selectText;

    var sortData = [];
    for (var key in chrPercent) {
        sortData.push({ name: key, percent: chrPercent[key][selectText] });
    };

    sortData.sort(function (a, b) {
        return b.percent - a.percent;
    });

    var newChartDataArr = {}

    for (var i = 0; i < sortData.length; i++) {
        newChartDataArr[sortData[i].name] = chartDataArr[sortData[i].name];
    }

    chartDataArr = newChartDataArr;
    var allChrBtn = document.querySelector(".allchr");
    if (allChrBtn.classList.contains("active")) {
        onClickAllChr(false);
    } else {
        buildGraph();
    }
}
function onClickAllChr(isClick) {
    if (Object.keys(chartDataArr).length == 0) {
        alert("데이터를 넣어주세요.")
        return;
    }
    var allChrBtn = document.querySelector(".allchr");

    if (isClick) {
        if (allChrBtn.classList.contains("active")) {
            allChrBtn.classList.remove("active");
            return;
        } else {
            allChrBtn.classList.add("active");
        }
    }

    var chrSelectBox = document.querySelector(".chrSelectBox");
    var selectText = chrSelectBox.options[chrSelectBox.selectedIndex];
    if (!selectText) { return; }
    selectText = selectText.innerText;

    var sortData = [];

    for (var key in chrPercent) {
        sortData.push({ name: key, percent: chrPercent[key][selectText], totalPercent: chrPercent[key]["total"] });
    };

    sortData.sort(function (a, b) {
        if (b.percent < a.percent) return -1;
        if (b.percent > a.percent) return 1;
        if (b.totalPercent < a.totalPercent) return -1;
        if (b.totalPercent > a.totalPercent) return 1;
        return 0;
    });

    var newChartDataArr = {}

    for (var i = 0; i < sortData.length; i++) {
        newChartDataArr[sortData[i].name] = chartDataArr[sortData[i].name];
    }

    chartDataArr = newChartDataArr;
    buildGraph();
}




// ------------------------------------------------------
//                         모달 슬라이드
// ------------------------------------------------------
function onChangeModalSlider(e) {
    var modalGraph_scale = document.querySelector(".modalGraph_scale");
    var changeValue = 1;
    if (e.value == 1) {
        changeValue = 0.4;
    } else if (e.value == 2) {
        changeValue = 0.7;
    } else if (e.value == 3) {
        changeValue = 1;
    } else if (e.value == 4) {
        changeValue = 1.3;
    } else if (e.value == 5) {
        changeValue = 1.6;
    } else if (e.value == 6) {
        changeValue = 1.9;
    } else if (e.value == 7) {
        changeValue = 2.2;
    } else if (e.value == 8) {
        changeValue = 2.5;
    } else {
        changeValue = 1;
    }
    modalGraph_scale.style.transform = "scale(" + changeValue + ")"
}





function onClickRun() {

    if (document.querySelector(".type_select").value == "작목 선택") {
        alert("작목과 유전체 DB 버전을 선택해 주세요."); return;
    }

    if (document.querySelector(".type_select_info").value == "0") {
        alert("작목과 유전체 DB 버전을 선택해 주세요."); return;
    }

    if (Object.keys(xlsxData).length == 0) {
        alert("분석 데이터를 업로드 해 주세요.");
        return;
    }

    if (Object.keys(lengthData).length == 0) {
        alert("잘못된 Len파일 혹은 MABC파일입니다.");
        console.error("onClickRun Error");
        return;
    }

    var dataSaveBtn = document.querySelector("#dataSaveBtn");
    var memo = document.querySelector("#memo");
    if (dataSaveBtn) {
        dataSaveBtn.style.display = "unset";
        memo.style.display = "flex";
    }

    console.log(Object.keys(xlsxData));

    buildGraph();
}


function onChangeVersion() {
    xlsxData = {};
    graphWrap = document.querySelector(".graphWrap");
    chartDataArr = {};
    chrTotalData = {};
    chrTotalIndex = 0;
    chrTotalCount = {};
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
function readLenFile() {
    var file = document.getElementsByClassName("lenPos")[0].innerHTML;

    if (!file) { console.error("readLenFile"); return };
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4) {
            if (rawFile.status == 404) {
                alert("Len파일을 찾을 수 없습니다.")
                console.error("Len file 404");
                return;
            }
            if (rawFile.status === 200 || rawFile.status == 0) {
                var allText = rawFile.responseText;
                parseLenData(allText);
                readMakerFile();

                // var newLengthData = allText.replace(/(\r\n|\n|\r)/gm, "-");
                // newLengthData = newLengthData.split("-");
                // lengthDataOrgin = [];
                // for(var i = 0 ; i < newLengthData.length ; i++){
                //     if(!newLengthData[i]){continue}
                //     var lengthEl = newLengthData[i].split(" ");
                //     if(lengthEl[0].substr(0, 3) == "Chr"){
                //         lengthDataOrgin.push(lengthEl[1]);
                //     }
                // }
            }
        }
    }
    rawFile.send(null);
}

function readMakerFile(files) {
    var _url = "";
    if (files) {
        files.map(item => {
            if (item.marker_file_type == 3) {
                _url = item.marker_file;
            }
        })
    } else {
        // var serverFile = document.getElementsByClassName("serverFile")[0].innerHTML;
        _url = document.getElementsByClassName("serverFile")[0].innerHTML;
    }

    if (!_url) { console.error("serverMaker Empty"); return };
    var _jsonData = {
        name: 'webisfree',
        url: 'webisfree.com'
    };

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {

        if (this.status == 404) {
            alert("마커 세트를 찾을 수 없습니다.")
        }

        if (this.readyState == 4 && this.status == 200) {
            var _data = this.response;

            let file = new File([_data], "result.xlsx", { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

            var reader = new FileReader();
            reader.onload = function () {
                var data = reader.result;
                var workBook = XLSX.read(data, { type: 'binary' });
                workBook.SheetNames.forEach(function (sheetName) {
                    var rows = XLSX.utils.sheet_to_json(workBook.Sheets[sheetName]);
                    var xlsxData = JSON.parse(JSON.stringify(rows));
                    adminXlsxData = xlsxData;
                    parsingDataMaker(xlsxData);
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

function loadSaveDate() {
    // buildGraph()
    var outcome_id = $("#outcome_id").val();
    var data = { "outcome_id": outcome_id };
    $.ajax(
        {
            url: 'selectOutcomeResult',
            method: "POST",
            dataType: 'json',
            data: data,
            success: function (result) {
                if (result) {
                    var serverData = result;

                    chartDataArr = serverData.chartDataArr;
                    chrTotalData = serverData.chrTotalData;
                    chrTotalIndex = serverData.chrTotalIndex;
                    chrPercent = serverData.chrPercent;
                    chrTotalCount = serverData.chrTotalCount;
                    chrTotalAllCount = serverData.chrTotalAllCount;
                    lengthData = serverData.lengthData;
                    lengthDataOrgin = serverData.lengthDataOrgin;
                    sortType = serverData.sortType;
                    setTimeout(buildGraph(), 10)
                }



            }
        });
}

// loadSaveDate();


function InsertOutcome() {
    var outcome_id = $("#outcome_id").val();

    var data = { "outcome_id": outcome_id, "outcome_result": JSON.stringify({ chartDataArr, chrTotalData, chrTotalIndex, chrPercent, lengthData, lengthDataOrgin, chrTotalCount, chrTotalAllCount, sortType: sortType }) };

    $.ajax(
        {
            url: "updateOutcomeResult",
            method: "POST",
            data: data,
            dataType: "JSON",
            success: function (result) {
                if (result == 0) {
                    alert("저장에 실패하였습니다.");
                }
                else {
                    alert("저장되었습니다.");
                }
            },
            error: function (e) {
                console.log(e);
            }
        });
}

function InsertOutcomeResult() {
    var data = new FormData($("#insertForm")[0]);
    data.set("user_username", $("#user_username").val());
    data.set("marker_id", $("#genomic_information").val());
    data.set("outcome_type", 3);
    data.set("outcome_result", JSON.stringify({ chartDataArr, chrTotalData, chrTotalIndex, chrPercent, lengthData, lengthDataOrgin }));
    data.set("outcome_comment", $("#outcome_comment").val());

    $.ajax(
        {
            url: "insertOutcomeResult",
            method: "POST",
            data: data,
            cache: false,
            contentType: false,
            processData: false,
            success: function (result) {
                if (result == 0) {
                    alert("저장에 실패하였습니다.");
                }
                else {
                    alert("저장되었습니다.");

                    location.href = "/digit/mabc_list";
                }
            },
            error: function (e) {
                console.log(e);
            }
        });
}


setTimeout(function () {
    readLenFile();
}, 1000);

document.addEventListener("DOMContentLoaded", function () {
    document.querySelector("#crop_selection").addEventListener("change", function (e) {
        document.querySelector(".file_text").value = "";
        document.querySelector("#input-file").value = "";
    })
    document.querySelector("#genomic_information").addEventListener("change", function (e) {
        document.querySelector(".file_text").value = "";
        document.querySelector("#input-file").value = "";
    })
})
