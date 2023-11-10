const btnAdd = document.getElementById("add");
const taskTxt = document.getElementById("txt");
const toDoListContainer = document.getElementById("to-do-list-container");

getTasksFromLocalStorage();

function addTask()
{
    let task = taskTxt.value;
    if(task === "") return;

    toDoListContainer.innerHTML += `
        <div class='task-container'>
            <p>${task}</p>
            <button class="edit">EDIT</button>
            <button class="delete">DELETE</button>
        </div>
    `;

    addEventToTask();

    taskTxt.value = "";

    saveInLocalStorage();
}

function addEventToTask()
{
    let taskContainerList = [...document.getElementsByClassName("task-container")];
    taskContainerList.forEach(container => {
        let btnEdit = container.getElementsByClassName("edit")[0];
        let btnDelete = container.getElementsByClassName("delete")[0];
        btnEdit.onclick = (e) => editTask(container, e.currentTarget);
        btnDelete.onclick = () => deleteTask(container);
        // btnEdit.onclick = (e) => editTask(e.currentTarget.parentElement);
        // btnDelete.onclick = (e) => deleteTask(e.currentTarget.parentElement);
    });
}

function editTask(parent, btnEdit)
{ 
    if(btnEdit.textContent !== "OK")
    {
        const newInput = document.createElement("input");
        const p = parent.getElementsByTagName("p")[0];
        
        newInput.type = "text";
        newInput.placeholder = "Type new text";
       
        newInput.value = p.textContent;
        parent.replaceChild(newInput, p);
        p.remove();

        btnEdit.style.backgroundColor = "rgb(179, 255, 0)";
        btnEdit.style.color = "rgb(0, 0, 0)";
        btnEdit.textContent = "OK";
    }
    else
    {
       setEditChanges(parent, btnEdit);
       saveInLocalStorage();
    }

   
    // p.replaceWith(newInput)
}

function setEditChanges(parent, btnEdit)
{
    const newInput = parent.getElementsByTagName("input")[0];

    if(newInput !== undefined)
    {
        const p = document.createElement("p");
    
        p.textContent = newInput.value;
        if(p.textContent === "") p.textContent = "No task";

        parent.replaceChild(p, newInput);

        newInput.remove();
        btnEdit.style.backgroundColor = "rgb(231, 138, 203)";
        btnEdit.style.color = "#fff";
        btnEdit.textContent = "EDIT";
    }
}

function deleteTask(parent)
{
    const newParent = parent.parentElement;
    newParent.removeChild(parent);
    saveInLocalStorage();
}

taskTxt.onfocus = () => {
        let taskContainerList = [...document.getElementsByClassName("task-container")];

        taskContainerList.forEach(parent => {
            let btnEdit = parent.getElementsByClassName("edit")[0];
            setEditChanges(parent, btnEdit);
        });    
};

function saveInLocalStorage()
{
    const taskContainerList = [...document.getElementsByClassName("task-container")];
    const taskList = [];
    taskContainerList.forEach(container => {
        let p = container.getElementsByTagName("p")[0];
        taskList.push(p.textContent);
    });

    localStorage.setItem("taskList", JSON.stringify(taskList));
}

function getTasksFromLocalStorage()
{
    const taskList = JSON.parse(localStorage.getItem("taskList"));

    if(taskList?.length > 0)
    {
        taskList.forEach(task => {
            toDoListContainer.innerHTML += `
                <div class='task-container'>
                    <p>${task}</p>
                    <button class="edit">EDIT</button>
                    <button class="delete">DELETE</button>
                </div>
            `;
        });
    }

    addEventToTask();
}

btnAdd.onclick = addTask;

document.onkeydown = (e) => {if(e.key === "Enter") addTask()};