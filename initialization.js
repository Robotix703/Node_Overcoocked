require('dotenv').config();

const checkTodoList = require("./worker/checkTodoList");
const handleScheduleTask = require("./worker/handleScheduleTask");
const smsSender = require("./worker/sendSMSToEverybody");
const dailyCheck = require("./worker/dailyCheck");

const todoSurvey = "todoSurvey";
const dailySurvey = "dailySurvey";

function initSMS(){
    smsSender.fetchPhoneNumber();
}

function createIntervalCronSettings(interval){
    return "*/" + interval + " * * * *";
}

function createDailyCronSettings(hour){
    return "* " + hour + " * * *";
}

function initTodoSurvey(){
    let cronInterval = createIntervalCronSettings(process.env.TODOCHECKINTERVAL);

    handleScheduleTask.addperiodicTask(
        checkTodoList.checkTodoList,
        cronInterval,
        todoSurvey
    )
}

function initDailyCheck(){
    let cronInterval = createDailyCronSettings(process.env.DAILYNOTIFICATIONHOUR);

    handleScheduleTask.addperiodicTask(
        dailyCheck.dailyCheck,
        cronInterval,
        dailySurvey
    )
}

exports.init = function(){
    initSMS();
    initTodoSurvey();
    initDailyCheck();
}