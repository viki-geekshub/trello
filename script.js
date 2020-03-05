const drag = (event, taskId) => {
    event.dataTransfer.setData("id", taskId);
}
const getLocalStorageColumns = () => localStorage.getItem('columns') ?
    JSON.parse(localStorage.getItem('columns')) : [];
//aquí leemos el localStorage por si hay columnas previas, en caso de no haber se convierte en null, y la variable columns para a ser array vacia [].
const columns = getLocalStorageColumns();
//renderizamos en el DOM columnas de haberlas en el localStorage.
columns.forEach(column => {
    let tasks = ``
    //iteramos a través de las tareas para ir concatenando los divs task por cada una de las tareas existentes en la columna
    column.tasks.forEach(task => {
        tasks += `<div class="task" id="${task.id}" draggable ondragstart ="drag(event,${task.id})" >
        <h5>${task.title}</h5>
        <i class="far fa-trash-alt" onclick="removeTask(${task.id})"></i>
    </div>`
    })
    document.querySelector('main').innerHTML += `<div class="column" 
        id="${column.id}">
                    <h2>${column.title}</h2>
                    <div class="tasks" ondragover="preventDefault(event)"  ondrop="drop(event)">
                    ${tasks}
                    </div>
                    <input type="text" onkeyup="addTask(event,${column.id})">
                    </div>`

});

const removeTask = (taskId) => {
    const currentColumnId = document.getElementById(taskId).parentElement.parentElement.id;
    const columns = getLocalStorageColumns();
    const currentColumn =columns.find(column => column.id == currentColumnId);
    const tasksFiltered =currentColumn.tasks.filter(task => task.id !== taskId);
    document.getElementById(taskId).remove();
    currentColumn.tasks =tasksFiltered;
    localStorage.setItem('columns', JSON.stringify(columns));
    // agregar que tambien se borren del local storage
}
// const removeTask = (event) =>{
//     event.target.parentElement
// }
const addTask = (event, columnId) => {
    if (event.key === 'Enter') {
        const taskId = Date.now();
        document.getElementById(columnId).children[1].innerHTML += `
        <div class="task" id="${taskId}" draggable ondragstart ="drag(event,${taskId})" >
            <h5>${event.target.value}</h5>
            <i class="far fa-trash-alt" onclick="removeTask(${taskId})"></i>
        </div>`

        const columns = getLocalStorageColumns();
        //buscamos la columna en la cual se este creando la tarea
        const currentColumn = columns.find(column => column.id === columnId);
        //añadimos la tarea al array tasks de la columna en la que estamos
        currentColumn.tasks.push({
            id: taskId,
            title: event.target.value
        });
        //sobreescribo todas las columnas porque las strings en JS son inmutables
        localStorage.setItem('columns', JSON.stringify(columns));
        event.target.value = '';
    }
}
const preventDefault = event => event.preventDefault();
const drop = event => {
    const taskId = event.dataTransfer.getData("id");
    const task = document.getElementById(taskId);
    if (event.target.classList.contains('tasks')) {
        event.target.appendChild(task)
    }
}
document.querySelector('.addColumn').onkeyup = event => {
    if (event.key === "Enter") {
        const columnId = Date.now();
        const title = event.target.value
        document.querySelector('main').innerHTML += ` <div class="column" 
        id="${columnId}">
                    <h2>${title}</h2>
                    <div class="tasks" ondragover="preventDefault(event)"  ondrop="drop(event)">
                    </div>
                    <input type="text" onkeyup="addTask(event,${columnId})">
                    </div>`
        const columns = getLocalStorageColumns();
        columns.push({
            id: columnId,
            title,
            tasks: []
        })
        localStorage.setItem('columns', JSON.stringify(columns))
        event.target.value = '';
    }
}
// document.querySelector('.addColumn').addEventListener('keyup', event => {})