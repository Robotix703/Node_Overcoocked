const todoist = require("../../build/modules/todoist");

let taskText = "TEST";
let taskID;

test.skip('Get project name', async () => {
    let projectName = await todoist.Todoist.getProjectID("CoursesDev");
    expect(projectName).toBe(2283408337);
});

test.skip('Get tasks', async () => {
    let tasks = await todoist.Todoist.getItemsInProjectByName("CoursesDev");
    expect(tasks.length).toBe(3);
});

test.skip('Add tasks', async () => {
    let task = await todoist.Todoist.addItemsInProjectByName("CoursesDev", taskText);
    taskID = task.id;
    expect(task.created.length).not.toBe(0);
});

test.skip('Update tasks', async () => {
    let task = await todoist.Todoist.updateItem(taskID, taskText + "New");
    expect(task).toBe(true);
});

test.skip('Delete tasks', async () => {
    let task = await todoist.Todoist.deleteItem(taskID);
    expect(task).toBe(true);
});