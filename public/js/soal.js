//public Id is term for name in cloudinary
function getPublicId(src=''){
    src = decodeURI(src);
    let arrString = src.split('/');
    let nameFormated = arrString[arrString.length-1].split('.');
    let justName = nameFormated[0].toString();
    // console.log(justName);

    return justName;
}


function deleteImage(id){
    const divSoal = document.getElementById(`soal-${id}`);
    const img = divSoal.querySelectorAll('img');
    let imgName = [];
    img.forEach((el)=>{
        imgName.push(getPublicId(el.src));
        // getPublicId(el.src);
        // imgName.push(el.src);
    })
    const formData = new FormData;
        formData.append('images',imgName);
        fetch('/image-delete', {
            method: 'DELETE',
            body: formData
        })
            .then(response => response.json())
            .then(result => {
                
        })
            .catch(error => {
            console.error('Error:', error);
            // failure('cannot upload');
        });
}

function deleteSoal (obj={}){
    if(confirm('Yakin ingin menghapus soal? ')){
        deleteImage(obj.getAttribute('data-id-soal'));
        obj.parentElement.submit();
    }
};
