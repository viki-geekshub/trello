document.querySelector('.addColumn').onkeydown = event => {
    if (event.key === "Enter") {
        document.querySelector('main').innerHTML += ` <div class="column">
                    <h2>${event.target.value}</h2>
                    <div class="tasks">
                    </div>
                    <input type="text">
                    </div>`

        event.target.value = '';
    }
}
// document.querySelector('.addColumn').addEventListener('keyup', event => {})