
document.addEventListener('DOMContentLoaded', () => {
    const alram = document.querySelector('.alarm');
        
        if(alram !== null) {
            alram.addEventListener('click', () => {
                let has = alram.classList.contains('on');
                has ? alram.classList.remove('on') : alram.classList.add('on');
            });
        };
});