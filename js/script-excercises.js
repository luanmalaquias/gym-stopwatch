function changeReps(operation, element) {
    if (operation == '+') {
        element.value++
    } else if (operation == '-') {
        element.value--
        if (element.value <= 0) {
            element.value = 0
        }
    }
}

function changeWeight(operation, element) {
    if (operation == '+') {
        element.value = parseInt(element.value) + 5
    } else if (operation == '-') {
        element.value = parseInt(element.value) - 5
        if (element.value <= 0) {
            element.value = 0
        }
    }
}

function saveExcercise(excerciseName, reps, weigth, series) {
    let excercisesList = localStorage.getItem("excercisesList")
    const today = new Date();
    const day = today.getDate().toString().padStart(2, '0');
    const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Janeiro = 0
    const year = today.getFullYear();
    let dateToday = `${day}/${month}/${year}`;
    let excercisesListJson = JSON.parse(excercisesList)
    if (excercisesListJson == null || Object.keys(excercisesListJson).length == 0) {
        let currentExcercise = { [dateToday]: [{ "eN": excerciseName, "rp": reps, "wgt": weigth, "srs": series }] }
        let currentExcerciseToString = JSON.stringify(currentExcercise);
        localStorage.setItem("excercisesList", currentExcerciseToString);
    } else {
        let currentExcercise = { "eN": excerciseName, "rp": reps, "wgt": weigth, "srs": series }
        if (excercisesListJson[dateToday]) {
            excercisesListJson[dateToday].push(currentExcercise)
        } else {
            excercisesListJson[dateToday] = [currentExcercise]
        }
        let excercisesListToString = JSON.stringify(excercisesListJson);
        localStorage.setItem("excercisesList", excercisesListToString);
    }
    window.alert("Excercício salvo")
}

function loadExcercises() {
    cleanExcercisesElement()
    let excercisesList = localStorage.getItem("excercisesList")
    let excercisesElement = document.getElementById("excercises")
    if (excercisesList != null) {
        let excercisesListJson = JSON.parse(excercisesList)
        let excercisesListJsonInverted = invertList(excercisesListJson)
        for (const key in excercisesListJsonInverted) {
            let finalElement = createExcerciseElement(excercisesListJsonInverted, key, excercisesListJsonInverted[key])
            excercisesElement.appendChild(finalElement)
        }
    }

    return null
}

function createExcerciseElement(excercisesListJson, key, data) {
    let finalElement = document.createElement('div')
    finalElement.className = 'border border-2 rounded border-dark p-2 my-3 fundo1'

    let divDate = document.createElement('div')
    divDate.className = 'd-flex justify-content-between mb-2'

    let spanDate = document.createElement('div')
    spanDate.textContent = `${key}`

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

    for (const item of data) {
        let divExcercise = document.createElement('div')
        divExcercise.className = 'd-flex justify-content-between mb-1'

        let spanData = document.createElement('span')
        spanData.textContent = `${item['eN']} | ${item['srs']} series | ${item['rp']} reps | ${item['wgt']} kg`

        let iTrash = document.createElement('i')
        iTrash.className = 'bi bi-trash'  

        let buttonDeleteItem = document.createElement('button')
        buttonDeleteItem.className = 'btn btn-sm btn-danger'
        buttonDeleteItem.appendChild(iTrash)
        buttonDeleteItem.onclick = () => deleteExcercise(excercisesListJson, key, item)

        
        divExcercise.appendChild(spanData)
        divExcercise.appendChild(buttonDeleteItem)
        finalElement.appendChild(divExcercise)
    }

    return finalElement
}

function deleteDay(excercisesListJson, key) {
    delete excercisesListJson[key]
    excercisesListJsonInverted = invertList(excercisesListJson)
    let excercisesListToString = JSON.stringify(excercisesListJsonInverted);
    localStorage.setItem("excercisesList", excercisesListToString);
    loadExcercises()
}

function deleteExcercise(excercisesListJson, key, item) {
    const index = excercisesListJson[key].indexOf(item);
    if (index > -1) {
        excercisesListJson[key].splice(index, 1);
    }
    excercisesListJsonInverted = invertList(excercisesListJson)
    let excercisesListToString = JSON.stringify(excercisesListJsonInverted);
    localStorage.setItem("excercisesList", excercisesListToString);
    loadExcercises()
}

function cleanExcercisesElement() {
    let excercisesElement = document.getElementById("excercises")
    while (excercisesElement.hasChildNodes()) {
        excercisesElement.removeChild(excercisesElement.firstChild)
    }
}

function invertList(list){
    const chaves = Object.keys(list);
    chaves.reverse();
    const dadosInvertidos = {};
    chaves.forEach(chave => {
        dadosInvertidos[chave] = list[chave];
    });
    return dadosInvertidos;
}