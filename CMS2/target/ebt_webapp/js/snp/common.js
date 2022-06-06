window.onload = function() {

    // header 기능
    const outList = document.querySelectorAll('.out_list');
    
    // popup
    $('.tb_menu_btn').click(function() {
        $('#header').addClass('on');
        $('.tb_blank').addClass('on');
    });

    $('.tb_blank').click(function() {
        $(this).removeClass('on');
        $('#header').removeClass('on');
    });

    outList.forEach((item) => {
        // 드롭 다운 메뉴
        let _outList = item.firstElementChild;
        
        _outList.addEventListener('click', function() {
            let has = item.classList.contains('on');
            let on = has ? item.classList.remove('on') : item.classList.add('on');
        });

        // 안쪽 버튼 active
        let innerList = item.lastElementChild.childNodes;
        innerList.forEach((_item) => {
            if(_item.nodeName !== "#text") {
                _item.addEventListener('click', function() {
                    outList.forEach((items) => {
                        let _innerList = items.lastElementChild.childNodes;
                        _innerList.forEach((_items) => {
                            if(_items.nodeName !== "#text") {
                                _items.classList.remove('active');
                            };
                        });
                    });
                    _item.classList.add('active');
                });
            };
        });
    });

    // // table idx 선택 기능
    // const tableIdx = document.querySelectorAll('.idx_num');
    // console.log(tableIdx[1].parentNode);
    
    // tableIdx.forEach((item) => {
    //     item.addEventListener('click', function() {
    //         tableIdx.forEach((items) => {
    //             items.parentNode.classList.remove('active');
    //         });
    //         item.parentNode.classList.add('active');
    //     });
    // });
	
	function fileNameFnc() {
	    const Input = document.querySelectorAll('.addMabcFile');
	
	    Input.forEach((item) => {
	        let itemParent = item.parentNode;
	
	        item.addEventListener('change', function() {
	            let fileName = item.files[0].name;
	            item.previousElementSibling.setAttribute('value', fileName);
	        });
	    });
	};
	
	fileNameFnc();

    // const newCreateBtn = document.querySelector('.new_btn');
    // const closeDimmBtn = document.querySelector('.win_close');
    

    // newCreateBtn.addEventListener('click', function() {
    //     let dimmCheck = document.querySelector('.dimm');
    //     let dimmHas = dimmCheck.classList.contains('on');
    //     if(!dimmHas) {
    //         dimmCheck.classList.add('on');
    //     };
    // });

    // closeDimmBtn.addEventListener('click', function() {
    //     let dimmCheck = document.querySelector('.dimm');
    //     let dimmHas = dimmCheck.classList.contains('on');
    //     if(dimmHas) {
    //         dimmCheck.classList.remove('on');
    //     };
    // });



    // snp 분석 sample 업로드 클론
    //const sampleBox = document.querySelector('.mab_bar_right');
    const sampleBox = document.querySelector('.mab_bar_right');
    const addSampleBtn = document.querySelector('.sample_add');
    const reSampleBtn = document.querySelector('.sample_remove');

    addSampleBtn.addEventListener('click', () => {
        let sample = addSampleBtn.parentNode.previousElementSibling;
        let par = addSampleBtn.parentNode;

        let sampleClone = sample.cloneNode(true);
        let cloneFile1 = sampleClone.querySelector(".file1");
        let cloneFile2 = sampleClone.querySelector(".file2");
        let cloneName1 = sampleClone.querySelector(".name1");
        let cloneName2 = sampleClone.querySelector(".name2");
        cloneFile1.id = cloneFile1.id + 1;
        cloneFile2.id = cloneFile2.id + 2;
        cloneName1.setAttribute("for", cloneFile1.id);
        cloneName2.setAttribute("for", cloneFile2.id);
        
        cloneFile1.previousElementSibling.setAttribute('value', '');
		cloneFile2.previousElementSibling.setAttribute('value', '');
		
        sampleBox.append(sampleClone, par);
        fileNameFnc();
    });
    
    
     reSampleBtn.addEventListener('click', () => {
        let sampleLeng = addSampleBtn.parentNode.parentNode.querySelectorAll('.add_file_box');
        let sample = addSampleBtn.parentNode.previousElementSibling;

        if(sampleLeng.length === 1) {
            return
        } else {
            sample.remove();
        }
    });
	
	
	
	
	

};