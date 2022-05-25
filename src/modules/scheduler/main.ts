const schedule = require("node-schedule");

export function createJob(callback : any, cronSettings : string){
    console.log("Job Created !");
    return schedule.scheduleJob(cronSettings, callback);
}

export function cancelJob(job : any){
    console.log("Job cancelled !");
    job.cancel();
}

process.on('SIGINT', function () {
    schedule.gracefulShutdown()
        .then(() => process.exit(0))
})