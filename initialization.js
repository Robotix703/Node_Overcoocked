require('dotenv').config();

const checkTodoList = require("./worker/checkTodoList");
const handleScheduleTask = require("./worker/handleScheduleTask");
const smsSender = require("./worker/sendSMSToEverybody");

const todoSurvey = "todoSurvey";

function initSMS(){
    smsSender.fetchPhoneNumber();
}

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
    initSMS();
    initTodoSurvey();
}