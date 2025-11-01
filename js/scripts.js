let tempo = 0;
let intervalo;
let timerStatus = "paused";
let resetCounter = 0;

function startAndPauseTimer() {
    if (timerStatus === "paused") {
        timerStatus = "counting";
        document.getElementById("pauseStartIcon").className = "bi bi-pause";
        sessionStorage.setItem("lastTimeStarted", new Date())
        intervalo = setInterval(() => {
            let savedTime = new Date(sessionStorage.getItem("lastTimeStarted"))
            let currentTime = new Date();
            let seconds = Math.floor((currentTime - savedTime) / 1000);
            let miliSeconds = Math.floor((currentTime - savedTime) / 10) % 100;

            document.getElementById("tempoSec").textContent = `${seconds.toString().padStart(2, '0')}`;
            document.getElementById("tempoMiliSec").textContent = `${miliSeconds.toString().padStart(2, '0')}`;

            if (seconds >= 999) startAndPauseTimer()
        }, 10);
    } else if (timerStatus === "counting") {
        timerStatus = "paused";
        document.getElementById("pauseStartIcon").className = "bi bi-play-fill";
        clearInterval(intervalo);
    }
}

function continueTimer() {
    timerStatus = "counting";
    document.getElementById("pauseStartIcon").className = "bi bi-pause";
    let lastTimeStarted = sessionStorage.getItem("lastTimeStarted")
    intervalo = setInterval(() => {
        let savedTime = new Date(lastTimeStarted)
        let currentTime = new Date();
        let seconds = Math.floor((currentTime - savedTime) / 1000);
        let miliSeconds = Math.floor((currentTime - savedTime) / 10) % 100;

        document.getElementById("tempoSec").textContent = `${seconds.toString().padStart(2, '0')}`;
        document.getElementById("tempoMiliSec").textContent = `${miliSeconds.toString().padStart(2, '0')}`;

        if (seconds >= 999) startAndPauseTimer()
    }, 10);
}

function resetAllData() {
    timerStatus = "counting";
    startAndPauseTimer()
    // document.getElementById("pauseStartIcon").className = "bi bi-play-fill";

    resetCounter = 0;

    clearInterval(intervalo);

    tempo = 0;

    document.getElementById("counter").textContent = "00";
    document.getElementById("tempoSec").textContent = "00";
    document.getElementById("tempoMiliSec").textContent = "00";
    document.getElementById("excerciseName").value = ""
    document.getElementById("reps").value = 10
    document.getElementById("weight").value = 5

    localStorage.setItem("seriesqtd", 0);
    notificationSended = false;
}

function addRecounter() {
    let counter = parseInt(document.getElementById('counter').textContent)
    counter++
    document.getElementById('counter').textContent = counter < 10 ? `0${counter}` : counter
    tempo = 0;
    timerStatus = "counting";
    startAndPauseTimer()
    document.getElementById("tempoSec").textContent = "00";
    document.getElementById("tempoMiliSec").textContent = "00";
    saveSeries(counter)
    notificationSended = false;
}

function changeTheme() {
    let themes = [
        "theme-dark",
        "theme-light",
        "theme-solar",
        "theme-ocean",
        "theme-forest",
    ]
    let body = document.getElementsByTagName('body')[0]
    let indexBefore = themes.indexOf(body.className)
    let index = indexBefore + 1
    if (index >= themes.length) {
        index = 0
    };

    body.className = themes[index]
    for (const element of document.getElementsByTagName('button')) {
        element.classList.remove(themes[indexBefore])
        element.classList.add(themes[index])
    }

}

function changeFontSize(option) {
    if (option == '+') {
        document.getElementById("tempoSec").style.fontSize = `${parseInt(document.getElementById("tempoSec").style.fontSize) + 10}dvw`
    } else if (option == '-') {
        document.getElementById("tempoSec").style.fontSize = `${parseInt(document.getElementById("tempoSec").style.fontSize) - 10}dvw`
    }
}

function saveSeries(counter) {
    localStorage.setItem("seriesqtd", counter);
}

function loadAllData() {
    let series_bd = localStorage.getItem("seriesqtd");
    if (series_bd != null) {
        document.getElementById("counter").textContent = series_bd < 10 ? `0${series_bd}` : series_bd
    }
}

function populateExcercisesList() {
    let excercisesNames = Excercise.getAllExcercisesNames()
    let excercisesList_element = document.getElementById('excercisesList')
    for (const name of excercisesNames) {
        let option = document.createElement('option')
        option.value = name
        excercisesList_element.appendChild(option)
    }
}

function autoCompleteWeight() {
    let excerciseNameElement = document.getElementById("excerciseName")
    let weight = document.getElementById("weight")
    let excercise = Excercise.getExcerciseByName(excerciseNameElement.value)
    if (excercise != null)
        weight.value = excercise.weight

}

function saveSessionStorage() {
    let excerciseName = document.getElementById('excerciseName').value
    let reps = document.getElementById('reps').value
    let weight = document.getElementById('weight').value
    let seconds = document.getElementById('tempoSec').textContent
    let miliSeconds = document.getElementById('tempoMiliSec').textContent

    sessionStorage.setItem('timerStatus', timerStatus)
    sessionStorage.setItem('resetCounter', resetCounter)
    sessionStorage.setItem('excerciseName', excerciseName)
    sessionStorage.setItem('reps', reps)
    sessionStorage.setItem('weight', weight)
}

function loadSessionStorage() {
    let sessionTimerStatus = sessionStorage.getItem('timerStatus', timerStatus)
    let sessionResetCounter = sessionStorage.getItem('resetCounter', resetCounter)
    let excerciseName = sessionStorage.getItem('excerciseName')
    let reps = sessionStorage.getItem('reps')
    let weight = sessionStorage.getItem('weight')

    if (sessionTimerStatus != null) {
        timerStatus = sessionTimerStatus
        if (sessionTimerStatus == 'counting') continueTimer()
    }
    if (sessionResetCounter != null) resetCounter = sessionResetCounter
    if (excerciseName != null) document.getElementById('excerciseName').value = excerciseName
    if (reps != null) document.getElementById('reps').value = reps
    if (weight != null) document.getElementById('weight').value = weight
}

function cleanSessionStorage() {
    sessionStorage.clear()
}

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

function saveExcercise() {
    let excercise = new Excercise(
        document.getElementById("excerciseName").value,
        document.getElementById("weight").value,
        document.getElementById("counter").textContent,
        document.getElementById("reps").value,
    )
    excercise.saveExcercise()
    alert("Salvo")
    resetAllData()
}