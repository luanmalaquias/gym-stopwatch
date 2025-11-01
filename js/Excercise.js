class Excercise {
    static excercises = {}

    constructor(name, weight, series, reps) {
        this.name = name
        this.weight = weight
        this.series = series
        this.reps = reps
    }

    toList(){
        return {
            "name": this.name,
            "weight": this.weight,
            "series": this.series,
            "reps": this.reps
        }
    }

    saveExcercise(){
        let date = this.getDateTodayFormatted()
        // save excercise on local list
        if (!Excercise.excercises[date]) Excercise.excercises[date] = []
        Excercise.excercises[date].push(this.toList())
        Excercise.dataBaseSaveExcercise()
    }

    static dataBaseSaveExcercise(){
        let excercises_json = JSON.stringify(Excercise.excercises);
        localStorage.setItem("excercises", excercises_json);
    }

    static loadDataBaseExcercises(){
        let dataBaseExcercises_list = localStorage.getItem("excercises")
        if (dataBaseExcercises_list != null) {
            let dataBaseExcercises_json = JSON.parse(dataBaseExcercises_list)
            Excercise.excercises = dataBaseExcercises_json
        }
    }

    getDateTodayFormatted(){
        const today = new Date();
        const day = today.getDate().toString().padStart(2, '0');
        const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Janeiro = 0
        const year = today.getFullYear();
        let dateToday = `${day}/${month}/${year}`;
        return dateToday;
    }

    static getAllExcercisesNames(){
        let names = []
        for (const date in Excercise.excercises) {
            for (const excercise of Excercise.excercises[date]) {
                if (!names.includes(excercise.name))
                    names.push(excercise.name)
            }
        }
        return names
    }

    static getExcerciseByName(name){
        let invertedList = Excercise.invertList(Excercise.excercises)
        for (const date in invertedList) {
            for (const excercise of invertedList[date]) {
                if (excercise.name == name)
                    return excercise
            }
        }
    }

    static invertList(list){
        const chaves = Object.keys(list);
        chaves.sort((a, b) => {
            const converterData = (dataStr) => {
                const [dia, mes, ano] = dataStr.split('/');
                return new Date(`${ano}-${mes}-${dia}`); // Cria um objeto Date
            };

            const dataA = converterData(a);
            const dataB = converterData(b);

            if (dataA < dataB) {
                return 1; // Coloca B antes de A
            }
            if (dataA > dataB) {
                return -1; // Coloca A antes de B
            }
            return 0;
        });
        const listOrdenated = {};
        chaves.forEach(chave => {
            listOrdenated[chave] = list[chave];
        });
        return listOrdenated
    }

}