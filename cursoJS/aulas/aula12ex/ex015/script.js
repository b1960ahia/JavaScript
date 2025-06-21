function verificar(){
    var data = new Date()
    var ano = data.getFullYear()
    var fano = document.getElementById('txtano')
    var res = document.querySelector('div#res')
    if(fano.value.lenght == 0 || fano.value > ano){
        window.alert('[ERRO] Verifique o dados e tente novamente')
    }else{
       var fsex = document.getElementsByName('radsex')
       var idade = ano - (fano.value)
       var genero = ''
       var img = document.createElement('img')
       img.setAttribute('id','foto')
       if (fsex[0].checked) {
        genero = 'homem'
        if(idade >= 0 && idade <= 10){
            //criança
            img.setAttribute('src', 'criança mas.png')
        }else if(idade < 21){
            //jovem
            img.setAttribute('src', 'adolecente mas.png')
        }else if(idade >=21 && idade <50){
            //adulto
            img.setAttribute('src', 'adulto mas.png')
        }else{
            //idoso
            img.setAttribute('src', 'Joao.png')
        }
       }else if(fsex[1] . checked){
        genero = "mulher"
        if(idade >= 0 && idade <= 10){
            //criança
            img.setAttribute('src', 'criança fem.png')        
        }else if (idade <21){
            //jovem
            img.setAttribute('src', 'adolecente fem.png')
        }else if(idade >= 21 && idade <50){
            //adulto
            img.setAttribute('src', 'Carol.png')
        }else{
            //idoso
            img.setAttribute('src', 'Leda.png')
        }

       }
       res.style.textAlign = 'center'
       res.innerHTML = `Detectamos genero ${genero} com ${idade} anos`
       res.appendChild(img)
        
    }
}