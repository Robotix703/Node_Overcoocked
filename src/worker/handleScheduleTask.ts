const Scheduler = require("../modules/scheduler/main");

let activeTasks : any = [];

exports.addperiodicTask = function(task : any, cronSettings : string, taskName : string){
    const job = Scheduler.createJob(task, cronSettings);

    activeTasks.push({
        name: taskName,
        job: job,
        task: task
    });
}

exports.stopTask = function(taskName : string){
    const activeTask = activeTasks.find((e : any) => e.name == taskName);

    if(activeTask){
        Scheduler.cancelJob(activeTask.job);
        activeTasks = activeTasks.filter((e : any) => e.name != taskName);
        return true;
    }
    return false;
}

exports.triggerTask = function(taskName : string){
    const activeTask = activeTasks.find((e : any) => e.name == taskName);

    if(activeTask){
        activeTask.task();
        return true;
    }
    return false;
}