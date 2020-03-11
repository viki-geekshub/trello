// //***************  FUNCION DRAGCOLUMN (para que se pueda arrastrar) **************/ 
// const dragColumn = (event, columnId) => { 
//     event.dataTransfer.setData("id", columnId); 
// }

// //***************  FUNCION DROPCOLUMN (para que se pueda soltar) **************/ 
// const dropColumn = event => {
//     const columnId = event.dataTransfer.getData("id"); 
//     const column = document.getElementById(columnId);
//     if (event.target.classList.contains('main')) { 
//         event.target.appendChild(column) 
//     }
// }

//  Localstorage 
const renderColumns = (columns) => {
    document.querySelector('main').innerHTML = '';
    columns.forEach(column => {
        if(!column) return;
        let tasks = ``
        //iteramos a través de las tareas para ir concatenando los divs task por cada una de las tareas existentes en la columna
        column.tasks.forEach(task => {
            tasks += `<div class="task" id="${task.id}" draggable ondragstart ="drag(event,${task.id})" >
            <h5>${task.title}</h5>
            <i class="far fa-trash-alt" onclick="removeTask(${task.id})"></i>
        </div>`
        })
        document.querySelector('main').innerHTML += `<div class="column" 
            id="${column.id}" draggable='true' ondragstart='dragColumn(event);'>
                    <div class="papelera">
                        <h2 contentEditable onkeydown="preventEnter(event)" onkeyup="changeColumnTitleEnter(event,${column.id})" onBlur="changeColumnTitleBlur(event,${column.id})">${column.title}</h2>
                        <i class="far fa-trash-alt" onclick="removeColumn(${column.id})"></i>
                    </div>
                        <div class="tasks" ondragover="preventDefault(event)"  ondrop="drop(event)">
                        ${tasks}
                        </div>
                        <input type="text" onkeyup="addTask(event,${column.id})">
                        </div>`
    });
    Array.from(document.getElementsByClassName("column")).forEach(restoreOpacity)
    Array.from(document.getElementsByClassName("task")).forEach(restoreOpacity)
    return columns
}
// //***************  FUNCION DRAGCOLUMN (para que se pueda arrastrar) **************/
const dragColumn = (event) => {
    event.dataTransfer.setData('number', event.target.id);
    
    //event.target.style.transform = "rotate(20deg)";
}
// //***************  FUNCION DROPCOLUMN (para que se pueda soltar) **************/ 
const dropColumn = (evento) => {
    
    if (event.target.classList.contains("main")) {
        const id = event.dataTransfer.getData('number', event.target.id);
        const draggableElement = document.getElementById(id);
        const position = Math.floor(evento.pageX / 226.8); //determinamos la posición final de la columna a mover diviendo por el tamañao + el margin
        const columns = getLocalStorageColumns(); //obtenemos las columnas del localStorage
        const currentColumn = columns.find(column => column.id === +id); //buscamos la columna que estamos moviendo
        const updatedColumns = columns.filter(column => column.id !== +id); //quitamos la columna a mover
        updatedColumns.splice(position, 0, currentColumn); //insertamos la columna movida en la posición donde cae
        localStorage.setItem('columns', JSON.stringify(updatedColumns)); //guardamos cambios en localStorage
        renderColumns(updatedColumns); //actualizamos el DOM
    }
}

//***************  preventDefault **************/ 
const preventDefault = event => event.preventDefault();

//***************  FUNCION DRAG (para que se pueda arrastrar) **************/ 
const drag = (event, taskId) => { 
    event.dataTransfer.setData("id", taskId); 
}

//***************  FUNCION DROP (para que se pueda soltar) **************/ 
const drop = event => {
    const taskId = event.dataTransfer.getData("id"); 
    const task = document.getElementById(taskId);
    if (event.target.classList.contains('tasks')) { 
        event.target.appendChild(task) 
    }
}
//*************** HACER EL TITULO DE LA COLUMNA EDITABLE ***************/
const changeTitleLocalStorage = (title, columnId) => {
    const columns = getLocalStorageColumns();
    const currentColumn = columns.find(column => columnId === column.id);
    currentColumn.title = title;
    localStorage.setItem('columns', JSON.stringify(columns));
}
const changeColumnTitleBlur = (event, columnId) => {
    changeTitleLocalStorage(event.target.innerText, columnId)
}
const changeColumnTitleEnter = (event, columnId) => {
    if (event.key === 'Enter') {
        changeTitleLocalStorage(event.target.value, columnId);
        event.target.blur();
    }
}
//************************ preventEnter **************************/
const preventEnter = event => event.key === 'Enter' ? event.preventDefault() : '';


//**  Sacar la información que haya en el localStorage y mostrarla en el documento al cargar la página **************/
const getLocalStorageColumns = () => localStorage.getItem('columns') ?
    JSON.parse(localStorage.getItem('columns')) : [];
const columns = getLocalStorageColumns();
columns.forEach(column => {
    let tasks = ``
    column.tasks.forEach(task => {
        tasks += `<div class="task" id="${task.id}" draggable ondragstart ="drag(event,${task.id})" >
        <h5>${task.title}</h5>
        <i class="far fa-trash-alt" onclick="removeTask(${task.id})"></i>
    </div>`
    })
    document.querySelector('main').innerHTML += `<div class="column" 
        id="${column.id}" draggable ondragstart ="dragColumn(event,${column.id})"> 
        <div class="papelera" id="${column.id}">
        <h2 contentEditable onkeydown="preventEnter(event)" onkeyup="changeColumnTitleEnter(event,${column.id})" onBlur="changeColumnTitleBlur(event,${column.id})">${column.title}</h2>
        <i class="far fa-trash-alt" onclick="removeColumn(${column.id})"></i>
    </div>
                    <div class="tasks" ondragover="preventDefault(event)"  ondrop="drop(event)">
                    ${tasks}
                    </div>
                    <input type="text" onkeyup="addTask(event,${column.id})">
                    </div>`
}); 

//***************  Borrar tareas del localStorage  **************/
const removeTaskFromLocalStorage = (taskId, columnId) => { 
    const columns = getLocalStorageColumns(); 
    const currentColumn = columns.find(column => column.id == columnId); 
    const tasksFiltered = currentColumn.tasks.filter(task => task.id !== taskId);
    currentColumn.tasks = tasksFiltered; 
    localStorage.setItem('columns', JSON.stringify(columns)); 
}

//******  Borrar las tareas en el documento con el botón de borrar (que hemos añadido como icono) **************/
const removeTask = (taskId) => { 
    const currentColumnId = document.getElementById(taskId).parentElement.parentElement.id; 
    removeTaskFromLocalStorage(taskId, currentColumnId) 
    document.getElementById(taskId).remove(); 
}

//***************  Borrar columnas del localStorage  **************/

const removeColumnFromLocalStorage = (columnId) => { 
    const columns = getLocalStorageColumns(); 
    const currentColumn = columns.find(column => column.id == columnId);
    const columnsFiltered = columns.filter(column => column.id !== currentColumn.id);
    localStorage.setItem('columns', JSON.stringify(columnsFiltered)); 
}

//******  Borrar las columnas en el documento con el botón de borrar (que hemos añadido como icono) **************/

const removeColumn = (columnId) => { 
    removeColumnFromLocalStorage(columnId)
    document.getElementById(columnId).remove(); 
}

//***************  Añadir tareas nuevas **************/
const addTask = (event, columnId) => { 
    if (event.key === 'Enter') { 
        const taskId = Date.now(); 
        document.getElementById(columnId).children[1].innerHTML += ` 
        <div class="task" id="${taskId}" draggable ondragstart ="drag(event,${taskId})" >
            <h5>${event.target.value}</h5>
            <i class="far fa-trash-alt" onclick="removeTask(${taskId})"></i>
        </div>`
        const columns = getLocalStorageColumns(); 
        const currentColumn = columns.find(column => column.id === columnId); 
        
        currentColumn.tasks.push({ 
            id: taskId,
            title: event.target.value
        });
        localStorage.setItem('columns', JSON.stringify(columns));
        event.target.value = ''; 
    }
}
//***************  Añadir columnas nuevas ***************/
document.querySelector('.addColumn').onkeyup = event => { 
    if (event.key === "Enter") { 
        const columnId = Date.now(); 
        const title = event.target.value 
        document.querySelector('main').innerHTML += ` <div class="column" 
        id="${columnId}" draggable ondragstart ="dragColumn(event,${columnId})">
                <div class="papelera" id="${columnId}">
                    <h2 contentEditable onkeydown="preventEnter(event)" onkeyup="changeColumnTitleEnter(event,${columnId})" onBlur="changeColumnTitleBlur(event,${columnId})">${title}</h2>
                    <i class="far fa-trash-alt" onclick="removeColumn(${columnId})"></i>
                </div>
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
