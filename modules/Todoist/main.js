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

    return await todoist.items.add(itemsToAdd);
}

async function updateItemInProjectByName(name, itemID, content){
    await todoist.sync(["all"]);

    const projectID = todoist.projects.get().filter(e => e.name == name)[0].id;

    let itemsToUpdate = {
        id: itemID,
        content: content,
        project_id: projectID
    }

    return await todoist.items.update(itemsToUpdate);
}

async function deleteItemInProjectByName(name, itemID){
    await todoist.sync(["all"]);

    const projectID = todoist.projects.get().filter(e => e.name == name)[0].id;

    let itemsToDelete = {
        id: itemID,
        project_id: projectID
    }

    return await todoist.items.delete(itemsToDelete);
}

module.exports = {
    getItemsInProjectByName,
    addItemsInProjectByName,
    updateItemInProjectByName,
    deleteItemInProjectByName
}