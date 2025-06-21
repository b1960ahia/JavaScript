let num = [5,8,2,9,3]
num.sort //nessa posição acrecenta o push no fim
num.push(4)
//num.sort()nessa posiçao coloca o psuh em ordem cresc
console.log(num)
console.log(`O vetor tem ${num.length} posições`)
console.log(`O terceiro valor do vetor é ${num[3]}`)
let pos = num.indexOf(6)
if (pos == -1){
    console.log('Ó valor não foi encontrado')
} else {
    console.log(`O valor esta na posição ${pos}`)

}
