document.addEventListener('DOMContentLoaded', () => {
    const outList = document.querySelectorAll('.out_list');
    const navList = document.querySelectorAll('.list_link');

	function getStrTitleNameList(str)
	{
		switch(str)
		{
			case "karyotype_list" : return ['karyotype_list','karyotype_detail'];
			case "map" : return ['map','map_detail', 'map_add'];
			case "polymorphic" : return ['polymorphic', 'polymorphic_detail', 'polymorphic_add'];
			case "mabc_list" : return ['mabc_list', 'mabc_detail', 'mabc_add'];
			case "marker_list" : return ['marker_list'];
			case "result_list" : return ['result_list'];
			case "phylogeny" : return ['phylogeny', 'phylogeny_detail' , 'phylogeny_add'];
			case "specificmaker" : return ['specificmaker', 'specificmaker_detail' , 'specificmaker_add'];
			case "qtl" : return ['qtl', 'qtl_detail' , 'qtl_add'];
			case "ngs_list" : return ['ngs_list', 'ngs_add', 'ngs_detail'];
			case "snp_list" : return ['snp_list', 'snp_add', 'snp_detail'];
			
			default : [];
		}
	}

    function headerActive()
    {
        // 현재 HTML 이름 + 확장자
        let thisHTMLName = document.URL.substring(document.URL.lastIndexOf('/') + 1, document.URL.length).split('?')[0];
    
        navList.forEach((item) => {
            let link = item.getAttribute('href');
            let linkName = link.split('/');
            
            let strArray = getStrTitleNameList(linkName[2]);
            
            try
            {
	            strArray.map((value)=>{
	            	if(value == thisHTMLName)
	            	{
	            	 	item.parentNode.parentNode.parentNode.classList.add('on');
	                	item.parentNode.classList.add('active');
	            	}
	            });
         	}
         	catch(e)
         	{
         		console.log("error");
         	}
        });
    };
    
    headerActive();
});