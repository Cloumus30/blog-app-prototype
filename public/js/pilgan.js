tinymce.init({
    selector: '.pilgan',
    // relative_urls : false,
    // remove_script_host : false,
    // document_base_url : "http://localhost:3000/",
    convert_urls: false,
    toolbar: 'tiny_mce_wiris_formulaEditor image | bold italic underline fontselect fontsizeselect',
    menubar:false,
    plugins: 'advlist autolink lists link image charmap print preview hr anchor pagebreak autosave',
    autosave_interval:'4s',
    paste_data_images: true,
    height:300,
    width:500,
    automatic_uploads:false,
    external_plugins: {
        'tiny_mce_wiris' : 'https://www.wiris.net/demo/plugins/tiny_mce/plugin.js'
    },
    
    // toolbar_mode: 'floating',
    // image_class_list: [
    //     {title:'responsive', value:'img-responsive'}
    // ],
    images_upload_url: '/image-upload',

    images_upload_handler: uploadImage,

    setup: (ed)=>{
        // ed.on('keyDown',deleteImage);
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