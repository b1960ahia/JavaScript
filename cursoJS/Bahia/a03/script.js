function adicionarTarefas(){
    let mensagem = "tarefa adicionada com sucesso";
   
    let inputTarefa = document.getElementById('inputTarefa')
    let tarefa = inputTarefa.value
    document.getElementById("mensagem").textContent= mensagem;

    let listaTarefas = document.getElementById("listaTarefas")
    let novaTarefa = document.createElement("li")

    novaTarefa.textContent = tarefa

    listaTarefas.appendChild(novaTarefa)

    inputTarefa.value = ""
    
}