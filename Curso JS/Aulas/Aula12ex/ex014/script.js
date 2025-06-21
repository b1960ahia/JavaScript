
function carregar(){
    var msg = document.getElementById('msg')
    var img = document.getElementById('imagem')
    var data = new Date()
    //var hora = data.getHours()
    var hora = 13
    msg.innerHTML = `Agora são ${hora} horas`
    if( hora > 0 && hora < 12){
        img.src = 'manha.png'
        document.body.style.background = '#f3daa7'
        //Bom dia! 
    }else if( hora >= 12 && hora < 18){
        img.src='tarde.png'
        document.body.style.background = '#f6ac47'
        //Boa tarde!
    }else{
        img.src='noite.png'
        document.body.style.background = '#412937'
        //Boa noite!
    }    
}