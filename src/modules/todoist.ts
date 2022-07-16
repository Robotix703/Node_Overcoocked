require('dotenv').config();
import { AddTaskArgs, GetTasksArgs, Project, Task, TodoistApi, UpdateTaskArgs } from '@doist/todoist-api-typescript'

const api = new TodoistApi(process.env.TODOIST_API_KEY)

export namespace Todoist {
    export async function getProjectID(name: string): Promise<number> {
        return api.getProjects()
            .then((projects : Project[]) => {
                return projects.find((e : Project) => e.name == name).id;
            })
    }
    
    export async function getItemsInProjectByName(name: string): Promise<Task[]>{
        let projectID : number = await getProjectID(name);
    
        let args : GetTasksArgs = {
            projectId: projectID
        }
    
        return api.getTasks(args);
    }
    
    export async function addItemsInProjectByName(projectName: string, itemText: string, description?: string, priority?: number): Promise<Task>{
        let projectID : number = await getProjectID(projectName);

        let args : AddTaskArgs = {
            projectId: projectID,
            content: itemText,
            dueLang: 'fr'
        };

        if(description) args.description = description;
        if(priority) args.priority = priority;
    
        return api.addTask(args);
    }
    
    export async function updateItem(itemID: number, content?: string, description?: string, priority?: number): Promise<boolean>{
        let updateArgs : UpdateTaskArgs = { };

        if(content) updateArgs.content = content;
        if(description) updateArgs.description = description;
        if(priority) updateArgs.priority = priority;

        return api.updateTask(itemID, updateArgs);
    }
    
    export async function deleteItem(itemID: number): Promise<boolean>{
        return api.deleteTask(itemID);
    }
}