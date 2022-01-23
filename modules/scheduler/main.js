const schedule = require('node-schedule');

exports.createJob = function(callback, cronSettings){
    console.log("Job Created !");
    return schedule.scheduleJob(cronSettings, callback);
}

exports.cancelJob = function(job){
    console.log("Job cancelled !");
    job.cancel();
}

process.on('SIGINT', function () {
    schedule.gracefulShutdown()
        .then(() => process.exit(0))
})