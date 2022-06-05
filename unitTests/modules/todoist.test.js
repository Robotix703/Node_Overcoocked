const todoist = require("../../build/modules/todoist");

let taskText = "TEST";
let taskID;

test('Get project name', async () => {
    let projectName = await todoist.getProjectID("CoursesDev");
    expect(projectName).toBe(2283408337);
});

test('Get tasks', async () => {
    let tasks = await todoist.getItemsInProjectByName("CoursesDev");
    expect(tasks.length).toBe(3);
});

test('Add tasks', async () => {
    let task = await todoist.addItemsInProjectByName("CoursesDev", taskText);
    taskID = task.id;
    expect(task.created.length).not.toBe(0);
});

test('Update tasks', async () => {
    let task = await todoist.updateItem(taskID, taskText + "New");
    expect(task).toBe(true);
});

test('Delete tasks', async () => {
    let task = await todoist.deleteItem(taskID);
    expect(task).toBe(true);
});