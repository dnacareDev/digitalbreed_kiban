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

    const Input = document.querySelectorAll('.addMabcFile');

    Input.forEach((item) => {
        let itemParent = item.parentNode;
        let fileTextTag = itemParent.childNodes[3];
        console.log(fileTextTag, 'sdasd');
        // console.log(fileText, 'sdasd');

        item.addEventListener('change', function() {
            let fileName = item.files[0].name;
            console.log(itemParent);
            fileTextTag.setAttribute('placeholder', fileName);
        });
    });


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
    
    
    
    
    // 21-12-21 추가
    // 모달 탭 메뉴
    const modalTab = document.querySelectorAll('.modal_tab_menu > li');
    const modalSect = document.querySelector('.modal_table_data_wrap');

    modalTab.forEach(item => {
        
        item.addEventListener('click', () => {
            let id = item.getAttribute('data-modal');
            let _on = document.getElementById(id);
            let has = _on.parentNode;

            modalTab.forEach(items => {
                let id = items.getAttribute('data-modal');
                let _on = document.getElementById(id);
                let has = _on.parentNode;
                
                items.classList.remove('on');

                if(has === modalSect) {
                    has.style.display = 'none';
                    _on.style.display = 'none';
                } else {
                    _on.style.display = 'none';
                }

            });

            item.classList.add('on');

            if(has === modalSect) {
                has.style.display = 'block';
                _on.style.display = 'block';
            } else {
                _on.style.display = 'flex';
            };
        });


    });


};