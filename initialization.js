require('dotenv').config();

const checkTodoList = require("./worker/checkTodoList");
const handleScheduleTask = require("./worker/handleScheduleTask");

const todoSurvey = "todoSurvey";

function createIntervalCronSettings(interval){
    return "*/" + interval + " * * * *"
}

function initTodoSurvey(){
    let cronInterval = createIntervalCronSettings(process.env.TODOCHECKINTERVAL);

    handleScheduleTask.addperiodicTask(
        checkTodoList.checkTodoList,
        cronInterval,
        todoSurvey
    )
}

exports.init = function(){
    initTodoSurvey();
}