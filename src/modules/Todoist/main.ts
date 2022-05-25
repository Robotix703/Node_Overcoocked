require('dotenv').config();
const Todoist = require('todoist').v8
const todoist = Todoist(process.env.TODOIST_API_KEY);

import { todoItem } from "../../models/todoItem";

export async function getItemsInProjectByName(name: string): Promise<todoItem[]>{
    await todoist.sync(["all"]);

    const projectID = todoist.projects.get().filter((e: any) => e.name == name)[0].id;
    const items = todoist.items.get();

    return items.filter((e: any) => e.project_id == projectID);
}

export async function addItemsInProjectByName(name: string, itemText: string): Promise<boolean>{
    await todoist.sync(["all"]);

    const projectID = todoist.projects.get().filter((e: any) => e.name == name)[0].id;

    let itemsToAdd = {
        content: itemText,
        project_id: projectID
    }

    return await todoist.items.add(itemsToAdd);
}

export async function updateItemInProjectByName(name: string, itemID: string, content: string): Promise<boolean>{
    await todoist.sync(["all"]);

    const projectID = todoist.projects.get().filter((e: any) => e.name == name)[0].id;

    let itemsToUpdate = {
        id: itemID,
        content: content,
        project_id: projectID
    }

    return await todoist.items.update(itemsToUpdate);
}

export async function deleteItemInProjectByName(name: string, itemID: string): Promise<boolean>{
    await todoist.sync(["all"]);

    const projectID = todoist.projects.get().filter((e: any) => e.name == name)[0].id;

    let itemsToDelete = {
        id: itemID,
        project_id: projectID
    }

    return await todoist.items.delete(itemsToDelete);
}
