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

    // table idx 선택 기능
    const tableIdx = document.querySelectorAll('.idx_num');
    // console.log(tableIdx[1].parentNode);
    
    tableIdx.forEach((item) => {
        item.addEventListener('click', function() {
            tableIdx.forEach((items) => {
                items.parentNode.classList.remove('active');
            });
            item.parentNode.classList.add('active');
        });
    });

    const Input = document.querySelectorAll('.file_in');
    console.log(Input);

    Input.forEach((item) => {
        let itemParent = item.parentNode;
        let className = itemParent.classList.contains('new_data_box');

        item.addEventListener('change', function() {
            if(className) {
                let fileName = item.files[0].name;
                itemParent.firstElementChild.innerText = fileName;
                console.log(itemParent.firstElementChild, '111111');
            } else {
                let fileName = item.files[0].name;
                if(item.nextElementSibling !== null) {
	                if(item.nextElementSibling.tagName !== 'P') {
		                item.nextElementSibling.setAttribute('value', fileName);
	                } else {
	                 	item.nextElementSibling.innerText = fileName;
	                };
                
                } else {
	                item.previousElementSibling.setAttribute('value', fileName);
	                console.log(item.previousElementSibling);
                };
            }
        });
    });


    // dimm 화면 on/off 구현
    const dimm = document.querySelectorAll('.dimm');
    const newCreateBtn = document.querySelector('.new_btn');
    const closeDimmBtn = document.querySelector('.win_close');
    
	if(newCreateBtn !== null) {
	    newCreateBtn.addEventListener('click', function() {
	        let dimmCheck = document.querySelector('.dimm');
	        let dimmHas = dimmCheck.classList.contains('on');
	        if(!dimmHas) {
	            dimmCheck.classList.add('on');
	        };
	    });
	};
	
	// if(closeDimmBtn !== null) {
	   // closeDimmBtn.addEventListener('click', function() {
	       // let dimmCheck = document.querySelector('.dimm');
	       // let dimmHas = dimmCheck.classList.contains('on');
	       // if(dimmHas) {
	           // dimmCheck.classList.remove('on');
	       // };
	   // });
	// };
	
	if(dimm.length > 0) {
		 dimm.forEach(item => {
		    item.addEventListener('click', function(e) {
		        let dimmHas = item.classList.contains('on');
		        let target = e.target;
		        let curr = e.currentTarget;
	
		        if(target === curr) {item.classList.remove('on')};
		    });
	    });
	};
	
	

    // file - 드롭다운 파일첨부
    const dorpDownWin = document.querySelectorAll('.file_title');
    console.log(dorpDownWin[3]);


};