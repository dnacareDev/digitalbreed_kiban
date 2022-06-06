document.addEventListener('DOMContentLoaded', () => {
    const alram = document.querySelector('.alarm');
        if(alram !== null) {
            alram.addEventListener('click', () => {
                let has = alram.classList.contains('on');
                has ? alram.classList.remove('on') : alram.classList.add('on');
            });
        };
});

$(window).bind("pageshow", function(event)
{
	if(event.originalEvent.persisted || (window.performance && window.performance.navigation.type == 2))
	{
		location.reload();
	}
});

$(document).ready(function()
{
	CheckLogin();
})

function CheckLogin()
{
	$.ajax(
	{
		url : "check_login",
		method : "POST",
		dataType : "JSON",
		success : function(result)
		{
			if(result == 1)
			{
				location.href = "/digit/login";
			}
		}
	});
}