const Scheduler = require("../modules/scheduler/main");

let activeTasks = [];

exports.addperiodicTask = function(task, cronSettings, taskName){
    let job = Scheduler.createJob(task, cronSettings);

    activeTasks.push({
        name: taskName,
        job: job,
        task: task
    });
}

exports.stopTask = function(taskName){
    let activeTask = activeTasks.find(e => e.name == taskName);

    if(activeTask){
        Scheduler.cancelJob(activeTask.job);
        activeTasks = activeTasks.filter(e => e.name != taskName);
        return true;
    }
    else{
        return false;
    }
}

exports.triggerTask = function(taskName){
    let activeTask = activeTasks.find(e => e.name == taskName);

    if(activeTask){
        activeTask.task();
        return true;
    }
    else{
        return false;
    }
}