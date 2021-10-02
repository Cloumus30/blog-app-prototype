
//Global variable
let imageUploadList = [];

// Setutp tinymce wysiswyg editor
tinymce.init({
    selector: 'textarea',
    // relative_urls : false,
    // remove_script_host : false,
    // document_base_url : "http://localhost:3000/",
    convert_urls: false,
    toolbar: 'tiny_mce_wiris_formulaEditor',
    plugins: 'advlist autolink lists link image charmap print preview hr anchor pagebreak autosave paste',
    autosave_interval:'4s',
    paste_data_images: true,
    height:500,
    automatic_uploads:false,
    external_plugins: {
        'tiny_mce_wiris' : 'https://www.wiris.net/demo/plugins/tiny_mce/plugin.js'
    },
    
    // toolbar_mode: 'floating',
    images_upload_url: '/image-upload',

    images_upload_handler: uploadImage,

    setup: (ed)=>{
        // ed.on('keyDown',deleteImage);
        ed.on('NodeChange',cancelInputImage);
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
    // console.log('Success:', result);
    imageUploadList.push(result.location);
    success(result.location);
    // console.log('images')
    // console.log(imageUploadList);
    })
    .catch(error => {
    console.error('Error:', error);
    failure('cannot upload');
    });
}

function cancelInputImage(e){
    // console.log(e.element)
    // console.info(e);
}

// Image Delete from editor and server
// function deleteImage (e){
//     const formData = new FormData();
//     if ((e.keyCode == 8 || e.keyCode == 46) && tinymce.activeEditor.selection) { // delete & backspace keys

//         var selectedNode = tinymce.activeEditor.selection.getNode(); // get the selected node (element) in the editor

//         if (selectedNode && selectedNode.nodeName == 'IMG') {
//             // console.log(selectedNode.src); // A callback that will let me invoke the deletion of the image on the server if appropriate for the image source.
//             const data = {"pathFile":selectedNode.src};
//             fetch('/image-delete',{
//                 method:'DELETE',
//                 headers: {
//                     'Content-Type': 'application/json'
//                     // 'Content-Type': 'application/x-www-form-urlencoded',
//                 },
//                 body:JSON.stringify(data)
//             }).then(response=>response.json())
//             .then(result=>{
//                 // console.log('success delete',result);
//             })
//             .catch(error=>{
//                 console.error('Error: ',error);
//             });
//         }
//     }
// }

const form = document.querySelector("form");

form.onsubmit=(e)=>{
    // e.preventDefault()
    // let imgActiveList = [];
    // let editorBody = document.getElementById("mce_0_ifr").contentWindow.document.body;
    // if(editorBody.querySelector('img')){
    //     const images = editorBody.querySelectorAll('img');
    //     images.forEach(el => {
    //         imgActiveList.push(el.getAttribute('src'));

    //     });
    // }
    // console.log(imgActiveList);
    tinymce.activeEditor.uploadImages((success)=>{
        console.log('sukses');
        document.forms[0].submit();
        //  console.log(tinymce.activeEditor.getContent());
    });
    setTimeout(()=>{
    //  console.log(tinymce.activeEditor.getContent());
     
    },1000)
    return false;
    
}








