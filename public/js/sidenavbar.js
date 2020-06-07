let innerWidth = window.innerWidth
window.addEventListener('resize', ()=>{
    innerWidth = window.innerWidth
    console.log(innerWidth)
    animateNavBar()
})

function animateNavBar(){
    if(innerWidth > 767){
    
    }else{
        var sidebarBox = document.querySelector('.sidenav');
        var sidebarBtn = document.querySelector('#btn');
        var pageWrapper = document.querySelector('.main');
    
        sidebarBtn.addEventListener('click', function(event) {
    
            if (this.classList.contains('active')) {
                    this.classList.remove('active');
                    sidebarBox.classList.remove('active');
            } else {
                    this.classList.add('active');
                    sidebarBox.classList.add('active');
            }
        });
    
        pageWrapper.addEventListener('click', function(event) {
    
            if (sidebarBox.classList.contains('active')) {
                    sidebarBtn.classList.remove('active');
                    sidebarBox.classList.remove('active');
            }
        });
    }
}

animateNavBar()