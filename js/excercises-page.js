function loadExcercises() {
    cleanExcercisesElement()
    let excercisesList = localStorage.getItem("excercisesList")
    let excercisesElement = document.getElementById("excercises")
    let excerciseListInverted = Excercise.invertList(Excercise.excercises)
    
    for (const key in excerciseListInverted) {
        let finalElement = createExcerciseElement(excerciseListInverted, key, excerciseListInverted[key])
        excercisesElement.appendChild(finalElement)
    }

    return null
}

function createExcerciseElement(excercisesListJson, key, data) {
    let finalElement = document.createElement('div')
    finalElement.className = 'border border-2 rounded border-dark p-2 my-3 fundo1'

    let divDate = document.createElement('div')
    divDate.className = 'd-flex justify-content-between mb-2'

    let spanDate = document.createElement('div')
    let date = formatarDataComDiaSemana(key)
    spanDate.textContent = `${date.toUpperCase()}`

    let strong = document.createElement('strong')
    strong.appendChild(spanDate)

    let iTrashFill = document.createElement('i')
    iTrashFill.className = 'bi bi-trash-fill'
    iTrashFill.textContent = ' delete day'

    let buttonDeleteDay = document.createElement('button')
    buttonDeleteDay.className = 'btn btn-sm btn-danger'
    buttonDeleteDay.appendChild(iTrashFill)
    buttonDeleteDay.onclick = () => deleteDay(excercisesListJson, key)

    divDate.appendChild(strong)
    divDate.appendChild(buttonDeleteDay)
    finalElement.appendChild(divDate)

    for (const excercise of data) {
        // Excercise Name Div
        let divExcerciseName = document.createElement('div')
        divExcerciseName.className = 'd-flex justify-content-between mb-1 align-items-center'

        let spanExcerciseName = document.createElement('span')
        spanExcerciseName.textContent = `> ${excercise.name}`

        let iTrash = document.createElement('i')
        iTrash.className = 'bi bi-trash'

        let buttonDeleteItem = document.createElement('button')
        buttonDeleteItem.className = 'btn btn-sm btn-danger'
        buttonDeleteItem.appendChild(iTrash)
        buttonDeleteItem.onclick = () => deleteExcercise(excercisesListJson, key, excercise)

        divExcerciseName.appendChild(spanExcerciseName)
        divExcerciseName.appendChild(buttonDeleteItem)

        // Excercise Data Div
        let divExcerciseData = document.createElement('div')
        divExcerciseData.className = 'd-flex justify-content-between mb-1'

        let spanLeftSpacing = document.createElement('span') 
        let spanWeight = document.createElement('span')
        let spanSeries = document.createElement('span')
        let spanReps = document.createElement('span')
        let spanRightSpacing = document.createElement('span')

        spanWeight.textContent = `${excercise.weight} kg`
        spanSeries.textContent = `${parseInt(excercise.series)} series`
        spanReps.textContent = `${excercise.reps} reps`

        divExcerciseData.appendChild(spanLeftSpacing)
        divExcerciseData.appendChild(spanWeight)
        divExcerciseData.appendChild(spanSeries)
        divExcerciseData.appendChild(spanReps)
        divExcerciseData.appendChild(spanRightSpacing)       
        
        finalElement.appendChild(divExcerciseName)
        finalElement.appendChild(divExcerciseData)
    }

    return finalElement
}

function deleteDay(excercisesListJson, key) {
    delete Excercise.excercises[key]
    Excercise.dataBaseSaveExcercise()
    loadExcercises()
}

function deleteExcercise(excercisesListJson, key, item) {
    const index = Excercise.excercises[key].indexOf(item);
    if (index > -1) {
        Excercise.excercises[key].splice(index, 1);
    }
    Excercise.dataBaseSaveExcercise()
    loadExcercises()
}

function cleanExcercisesElement() {
    let excercisesElement = document.getElementById("excercises")
    while (excercisesElement.hasChildNodes()) {
        excercisesElement.removeChild(excercisesElement.firstChild)
    }
}

function formatarDataComDiaSemana(dataString) {
    const partes = dataString.split('/');
    const dataFormatadaParaDate = `${partes[1]}/${partes[0]}/${partes[2]}`;
    const data = new Date(dataFormatadaParaDate);
    if (isNaN(data.getTime())) {
        return "Data inválida";
    }
    const options = {
        weekday: 'short', // 'Seg', 'Ter', etc.
        day: '2-digit',   // '27'
        month: '2-digit', // '10'
        year: 'numeric'   // '2025' - embora não vá aparecer no final
    };
    const dataFormatada = data.toLocaleDateString('pt-BR', options);
    const diaSemanaAbreviado = data.toLocaleDateString('pt-BR', { weekday: 'short' });
    const dataNumerica = `${partes[0]}/${partes[1]}/${partes[2]}`;
    const diaSemanaLimpo = diaSemanaAbreviado.replace('.', ''); // Remove o ponto se houver
    const stringFinal = `${diaSemanaLimpo} - ${partes[0]}/${partes[1]}/${partes[2]}`;
    
    return stringFinal;
}