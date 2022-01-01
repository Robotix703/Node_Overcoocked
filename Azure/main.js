require('dotenv').config();

const fetch = require('./fetch');

const todo = '/v1.0/me/todo/lists';
const users = '/v1.0/users';

async function GetTasks(accessToken) {
    try {
        const tasks = await fetch.callApi(process.env.GRAPH_ENDPOINT + todo, accessToken);
        console.log(tasks);
    } catch (error) {
        console.error(error);
    }
}

async function AddTasks() {

}

module.exports = {GetTasks, AddTasks}