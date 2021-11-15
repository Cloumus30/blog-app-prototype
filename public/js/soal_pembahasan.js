const pembahasan = document.querySelectorAll(".pembahasan");
for (let i = 0; i < pembahasan.length; i++) {
    pembahasan[i].classList.add('hidden');
    const childs = pembahasan[i].querySelectorAll('*');
    for (let i = 0; i < childs.length; i++) {
        // give background color and padding for children in pembahasan
        childs[i].style.backgroundColor = '#EEF4ED';
        // childs[i].style.padding = '25px';
    }
    
}

// show and hide pembahasan with button
function showPembahasan(obj={}){
    obj.nextElementSibling.classList.toggle('hidden');
    if(obj.innerHTML=='Sembunyikan'){
        obj.innerHTML = 'Lihat Pembahasan';
    }else{
        obj.innerHTML = 'Sembunyikan';
    }
}