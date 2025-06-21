function tabuada(){
    let num = document.getElementById('txtn')
    let tabuada = document.getElementById('seltab')

    if (num.value.lenght == 0){
        window.alert = ('Por favor digite um numero')
    } else{
        let n = Number(num.value)
        let c = 1
        tabuada.innerHTML = ''
        for(let c = 1; c <= 10; c++){
            let item = document.createElement('option')
            item.text = `${n} x ${c} = ${n*c}`
            /*item.value = `tab${c}`*/
            tabuada.appendChild(item)
        }
        /*while(c <= 10){
            let item = document.createElement('option')
            item.text = `${n} x ${c} = ${n*c}`
            tabuada.appendChild(item)
            c++
            
        } */      
    }
    
}