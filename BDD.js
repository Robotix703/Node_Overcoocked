const mongoose = require('mongoose');
require('dotenv').config()

let user, pwd, host, name;
if (process.env.NODE_ENV === "production") {
    name = process.env.DB_PROD_NAME;
    host = process.env.DB_HOST;
    user = process.env.DB_PROD_USER;
    pwd = process.env.DB_PROD_PASS;
}else{
    name = process.env.DB_DEV_NAME;
    host = process.env.DB_IP;
    user = process.env.DB_DEV_USER;
    pwd = process.env.DB_DEV_PASS;
}

exports.connectToDataBase = async function(){
    return mongoose.connect(
        "mongodb://" + user + ":" + pwd + "@" + host + "/" + name, 
        { useNewUrlParser: true, useUnifiedTopology: true }
    )
}