const Scheduler = require("../modules/scheduler");

let activeTasks : any = [];

export namespace handleScheduleTask {
    export function addperiodicTask(task : any, cronSettings : string, taskName : string) : void {
        const job = Scheduler.createJob(task, cronSettings);
    
        activeTasks.push({
            name: taskName,
            job: job,
            task: task
        });
    }
    
    export function stopTask(taskName : string) : boolean {
        const activeTask = activeTasks.find((e : any) => e.name == taskName);
    
        if(activeTask){
            Scheduler.cancelJob(activeTask.job);
            activeTasks = activeTasks.filter((e : any) => e.name != taskName);
            return true;
        }
        return false;
    }
    
    export function triggerTask(taskName : string) : boolean {
        const activeTask = activeTasks.find((e : any) => e.name == taskName);
    
        if(activeTask){
            activeTask.task();
            return true;
        }
        return false;
    }
}