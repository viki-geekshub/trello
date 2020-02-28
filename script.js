const drag = (event, taskId) => {
    event.dataTransfer.setData("id", taskId);
}
const addTask = (event, columnId) => {
    if (event.key === 'Enter') {
        const taskId = Date.now();
        document.getElementById(columnId).children[1].innerHTML += `
        <div class="task" id="${taskId}" draggable ondragstart ="drag(event,${taskId})" >
            <h5>${event.target.value}</h5>
        </div>`

        const columns = localStorage.getItem('columns') ?
            JSON.parse(localStorage.getItem('columns')) : [];
        const currentColumn = columns.find(column => column.id === columnId);
        console.log(currentColumn)
        event.target.value = '';
    }
}
const preventDefault = event => event.preventDefault();
const drop = event => {
    const taskId = event.dataTransfer.getData("id");
    const task = document.getElementById(taskId)
    event.target.appendChild(task)
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
        const columns = localStorage.getItem('columns') ?
            JSON.parse(localStorage.getItem('columns')) : [];
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