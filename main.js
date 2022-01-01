const SMS = require("./sms/sms");
const Azure = require("./Azure/main");
const Todoist = require("./Todoist/main");


//let tel = process.env.INDFR + process.env.TEL;
//SMS.SendSMS([tel], "Hello World !!");

//Azure.GetTasks();

Todoist.getItemsInProjectByName(process.env.TODOPROJECT).then((items) => {
    console.log(items);
});

Todoist.addItemsInProjectByName(process.env.TODOPROJECT, "Hello World !").then(() => {
    
})