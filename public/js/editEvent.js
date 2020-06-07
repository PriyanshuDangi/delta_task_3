function link() {
    var url = prompt("Enter the URL");
    document.execCommand("createLink", false, url);
}

function getImage() {
  var file = document.querySelector("input[type=file]").files[0];
  console.log(file)
  if(!file){
    return ;
  }
  if(!file.name.match(/\.(jpg|png|jpeg)$/)){
    return alert("only jpg, png and jpeg are accepted");
  }
  if(file.size > 1048576){
    return alert("File is too big! Must be less then 1 mb");
    // this.value = "";
 };
  var reader = new FileReader();

  let dataURI;

  reader.addEventListener(
    "load",
    function() {
      dataURI = reader.result;

      const img = document.createElement("img");
      img.src = dataURI;
      $editor.appendChild(img);
    },
    false
  );

  if (file) {
    console.log("s");
    reader.readAsDataURL(file);
  }
}

function changeColor() {
  var color = prompt("Enter your color in hex ex :#212f31");
  document.execCommand("foreColor", false, color);
}

function fontName() {
  var fontstyle = prompt("Enter your font style ex: Arial");
  document.execCommand("fontName", false, fontstyle);
}

function fontSize() {
  var fontSize = prompt("Enter your fontsize in range (1-7)");
  document.execCommand("fontSize", false, fontSize);
}

const $editor = document.getElementById('editor')
const $title = document.getElementById('title')
var $header = document.querySelector('header')
var $footer = document.querySelector('footer')
const id = document.getElementById('id').textContent
const $datetime = document.getElementById('datetime')
const $deadline = document.getElementById('deadline')

// document.querySelector('#submit').addEventListener('click', (e)=>{
  document.querySelector('#form').addEventListener('submit', (e)=>{
    e.preventDefault()
    console.log('hey')
    var header = $header.innerHTML
    var content = $editor.innerHTML
    var footer = $footer.innerHTML
    var title = $title.value
    var datetime = $datetime.value
    var deadline = $deadline.value
    // var date= document.querySelector('#date').value
    // var header = 
    // console.log(content)
    fetch(`/event/edit/${id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title,
            header,
            content,
            footer,
            datetime,
            deadline
            // date 
        })
    }).then((response)=>{
      if(response.status == 200){
        window.location.href = `/event/invite/${id}`
      } else{
        // alert('unable to edit article')
        window.location.href = `/dashboard`
      }
    }).catch(error=>{
      console.log(error)
    })
})