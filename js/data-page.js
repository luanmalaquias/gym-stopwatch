function loadData(){
    let dataElement = document.getElementById('dataElement')
    let excercisesList = localStorage.getItem("excercises")
    dataElement.textContent = excercisesList
}

function saveData(){
    let dataValue = document.getElementById('dataElement').value
    try {
        JSON.parse(dataValue)
        localStorage.setItem("excercises", dataValue)
        window.alert("Salvo")
    } catch (error) {
        window.alert("Erro, formato inválido (apenas JSON aceitável)")
    }
}