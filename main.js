const SMS = require("./modules/sms/sms");
const Todoist = require("./modules/Todoist/main");

//let tel = process.env.INDFR + process.env.TEL;
//SMS.SendSMS([tel], "Hello World !!");

Todoist.getItemsInProjectByName(process.env.TODOPROJECT).then((items) => {
    console.log(items);
});

Todoist.addItemsInProjectByName(process.env.TODOPROJECT, "Hello World !").then(() => {
    
})