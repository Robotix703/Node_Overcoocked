require('dotenv').config();
const Todoist = require('todoist').v8
const todoist = Todoist(process.env.TODOIST_API_KEY);


async function getItemsInProjectByName(name){
    await todoist.sync(["all"]);

    const projectID = todoist.projects.get().filter(e => e.name == name)[0].id;
    const items = todoist.items.get();

    return items.filter(e => e.project_id == projectID);
}

async function addItemsInProjectByName(name, items){
    await todoist.sync(["all"]);

    const projectID = todoist.projects.get().filter(e => e.name == name)[0].id;

    let itemsToAdd = {
        content: items,
        project_id: projectID
    }

    await todoist.items.add(itemsToAdd)
}

module.exports = {
    getItemsInProjectByName,
    addItemsInProjectByName
}