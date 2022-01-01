require('dotenv').config();

const fetch = require('./fetch');
const auth = require('./auth');

const todo = '/v1.0/me/todo/lists';
const users = '/v1.0/users';
const app = '/v1.0/applications'
const messages = '/v1.0/users/29fb0d84-fef7-4198-8006-77633f579614/messages'

async function GetTasks() {
    try {
        const authResponse = await auth.getToken(auth.tokenRequest);
        console.log(authResponse)

        const tasks = await fetch.callApi(process.env.GRAPH_ENDPOINT + users, authResponse.accessToken);
        console.log(tasks);
    } catch (error) {
        console.error(error);
    }
}

async function AddTasks() {

}

module.exports = {GetTasks, AddTasks}