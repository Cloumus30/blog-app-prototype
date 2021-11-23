// Setutp tinymce wysiswyg editor
tinymce.init({
    selector: 'textarea',
    // relative_urls : false,
    // remove_script_host : false,
    // document_base_url : "http://localhost:3000/",
    convert_urls: false,
    toolbar: 'tiny_mce_wiris_formulaEditor | image | alignleft aligncenter alignright alignjustify bold italic underline fontselect fontsizeselect | styleselect | numlist bullist | code',
    plugins: 'advlist autolink lists link image charmap print preview hr anchor pagebreak autosave code',
    autosave_interval:'4s',
    content_style: 'div { border:2px solid black; backgroundColor:#EEF4ED; padding: 3px; } ',
    paste_data_images: true,
    height:700,
    automatic_uploads:false,
    external_plugins: {
        'tiny_mce_wiris' : 'https://www.wiris.net/demo/plugins/tiny_mce/plugin.js'
    },
    
    // toolbar_mode: 'floating',
    image_class_list: [
        {title:'responsive', value:'img-responsive'}
    ],
    images_upload_url: '/image-upload',

    images_upload_handler: uploadImage,

    setup: (ed)=>{
        ed.on('keyDown',deleteImage);
        // ed.on('NodeChange',cancelInputImage);
    }
    
});

// Image upload Handler
function uploadImage(blobInfo, success, failure, progress){
    const formData = new FormData();
    // console.log(blobInfo.filename());
    formData.append('image', blobInfo.blob());

    fetch('/image-upload', {
    method: 'POST',
    body: formData
    })
    .then(response => response.json())
    .then(result => {
    
        success(result.location);
    })
    .catch(error => {
        console.error('Error:', error);
        failure('cannot upload');
    });
}

// Upload Images first then Submit the Form
const form = document.querySelector("form");
form.onsubmit=(e)=>{
    const submitBtn = document.getElementById('form-button');
    submitBtn.innerHTML = 'Loading...';
    submitBtn.classList.add('disabled');
    tinymce.activeEditor.uploadImages((success)=>{
        console.log('sukses');
        document.forms[0].submit();
        
    });
    setTimeout(()=>{
    //  console.log(tinymce.activeEditor.getContent());
     
    },3000)
    return false;
    
}
//public Id is term for name in cloudinary


// Image Delete from editor and server
function deleteImage (e){
    const formData = new FormData();
    if ((e.keyCode == 8 || e.keyCode == 46) && tinymce.activeEditor.selection) { // delete & backspace keys
        
        var selectedNode = tinymce.activeEditor.selection.getNode(); // get the selected node (element) in the editor
        if (selectedNode && selectedNode.nodeName == 'IMG') {
            // console.log(selectedNode.src); // A callback that will let me invoke the deletion of the image on the server if appropriate for the image source.
            const data = {"pathFile":selectedNode.src};
            fetch('/image-delete',{
                method:'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                },
                body:JSON.stringify(data)
            }).then(response=>response.json())
            .then(result=>{
                // console.log('success delete',result);
            })
            .catch(error=>{
                console.error('Error: ',error);
            });
        }
        
    }
}
