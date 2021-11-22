//public Id is term for name in cloudinary
function getPublicId(src=''){
    src = decodeURI(src);
    let arrString = src.split('/');
    let nameFormated = arrString[arrString.length-1].split('.');
    let justName = nameFormated[0].toString();
    // console.log(justName);

    return justName;
}

// Delete image from the post in cloudinary
function deleteImage(){
    const img = document.querySelectorAll('img');
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

// Delete Images and Post
const deleteBtn = document.getElementById('btn-delete');
deleteBtn.addEventListener('click',(e)=>{
    if(confirm('yakin ingin menghapus post?')){
        // Delete Images
        deleteImage();
        // Delete Post
        const postId =  document.getElementById('id-post').value.trim();
                const formData = new FormData();
                formData.append('id',postId);
                fetch(`/post-delete/${postId}`,{
                    method:'DELETE',
                    body:formData
                })
                .then(response=>{response.json()})
                .then(result=>{
                    // alert(`post berhasil dihapus`);
                    
                    window.location.href='/blog';
                })
                .catch(err=>{console.log(err)});
    }
});

