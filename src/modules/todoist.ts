require('dotenv').config();
import { GetTasksArgs, TodoistApi } from '@doist/todoist-api-typescript'

const api = new TodoistApi(process.env.TODOIST_API_KEY)

export namespace Todoist {
    export async function getProjectID(name: string): Promise<number> {
        return api.getProjects()
            .then((projects : any[]) => {
                return projects.find((e : any) => e.name == name).id;
            })
    }
    
    export async function getItemsInProjectByName(name: string): Promise<any>{
        let projectID = await getProjectID(name);
    
        let args : GetTasksArgs = {
            projectId: projectID
        }
    
        return api.getTasks(args);
    }
    
    export async function addItemsInProjectByName(name: string, itemText: string): Promise<any>{
        let projectID = await getProjectID(name);
    
        return api.addTask({
            projectId: projectID,
            content: itemText,
            dueLang: 'fr'
        });
    }
    
    export async function updateItem(itemID: number, content: string): Promise<any>{
        return api.updateTask(itemID, {
            content: content
        });
    }
    
    export async function deleteItem(itemID: number): Promise<boolean>{
        return api.deleteTask(itemID);
    }
}