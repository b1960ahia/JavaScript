function Contar(){
    let ini = document.getElementById('txtini')
    let fim = document.getElementById('txtfim')
    let pas = document.getElementById('txtpas')
    let res = document.getElementById('res')
    if (ini.value.length == 0 || fim.value.length == 0 || pas.value.length == 0){
        window.alert('Faltam dados')
    } else{
        res.innerHTML = 'Contando: <br>'
        let i = Number(ini.value)
        let f = Number(fim.value)
        let p = Number(pas.value)
        if( i < f){
            //contagem crescente
           for(let c = i; c <= f; c += p){
                res.innerHTML += ` ${c} 👉` 
            }
            // ** res.innerHTML += `🏴`        
        }else {
            //contagem decrescente
            for(let c = i; c >= f; c -= p){
                res.innerHTML += ` ${c} 👉`
            }
            // ** res.innerHTML += `🏴`
        }
        res.innerHTML += `🏴` // ** iguais   
        
    }   
        
}

