
let num = document.querySelector('input#fnum')
let lista = document.querySelector('select#flista')
let res = document.querySelector('div#res')
let valores = [] 

function isNumero(n){
    if(Number(n)>=1 && Number(n)<=100){
        return true
    }else{
        return false
    }
}

function inLista(n,l){
    if(l.indexOf(Number(n)) != -1){
        return true
    }else{
        return false
    }
}

function adicionar(){
    if(isNumero(num.value) && !inLista(num.value, valores)){
        valores.push(Number(num.value))
        let item = document.createElement('option')
        item.text = `Valor ${num.value} adicionado`
        lista.appendChild(item)
        res.innerHTML = ''
    }else{
        window.alert('Valor invalido ou ja encontrado na lista')
    }
    num.value = ''//apaga o numero automaticamente no adicionar
    num.focus()
}
function finalizar(){
    if(valores.length == 0){
         window.alert('Adicione um numero antes de finalizar')
    }else{
        let tot = valores.length
        let menor = valores[0]
        let maior = valores[0]
        let soma = 0
        let media = 0
        for(let pos in valores){
            if(valores[pos] > menor)
                menor = valores[pos]
            if(valores[pos] < maior)
                maior = valores[pos] 
            soma += valores[pos]        
            
        }
        media = soma / tot
        res.innerHTML = ''
        res.innerHTML += `<p>Ao todo temos ${tot} numeros cadastrados.</p>`
        res.innerHTML += `<p>O maior valor encontrado é ${menor}.</p>`
        res.innerHTML += `<p>O menor valor encontrado é ${maior}.</p>`
        res.innerHTML += `<p>A soma dos valores encontrado é ${soma}.</p>`
        res.innerHTML += `<p>A media dos valores encontrados é ${media}.</p>`
    }
       
}