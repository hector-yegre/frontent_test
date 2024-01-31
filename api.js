
const apiBase = 'http://localhost:8000/api'
const areaErrorMessage = document.querySelector('#errors')
const buscador = document.querySelector('#buscador')
const formUpdate = document.querySelector('#formUpdate')
const closeSecionBn = document.querySelector('#salir')

closeSecionBn.addEventListener('click',()=>{
    localStorage.clear()
    window.location.href = 'login.html'

})

buscador.addEventListener('keyup', (e) => {
    const keyCode = e.keyCode;
    if (keyCode == 13) {
        getTareas(1, buscador.value)
    }

    if (buscador.value.length <= 0) {
        getTareas()
    }
    
})

//instancia de axios
const apiTask = axios.create({
    baseURL: apiBase,
    headers: {
        'Accept': 'application/json',
    }
})

//mandamos el toen en los j¿header
apiTask.defaults.headers.common = {
    'Authorization': `Bearer ${localStorage.getItem('auth-token')}`,
}

//para una salida rapida verificamos si esta el token
if (!localStorage.getItem('auth-token')) {
    localStorage.clear()
    window.location.href = "login.html";
}
//vemos si esta autenticado el usuario por token en el bakend
apiTask.post(`/sheck`).then(({ data }) => {
    console.log(data)
}).catch((err) => {
    localStorage.clear()
    window.location.href = "login.html";
})

const formCreate = document.querySelector('#formCreate')
formCreate.addEventListener('submit', (e) => {
    e.preventDefault()
    crearTarea()

})


const getTareas = async (page = 1, title = '') => {
    try {
        console.log(title)
        const { data: { data } } = await apiTask.get(`/task?page=${page}&title=${title}`)
        renderTareas(data)

    } catch (err) {
        console.log(err)
    }
}


const renderTareas = ({ data }) => {
    const contenedorDeTareas = document.querySelector('#taskContainer')
    contenedorDeTareas.innerHTML = ''

    if (data.length <= 0) {
        contenedorDeTareas.innerHTML = `<h3>Lista de tareas</h3>
                                         <p id="textoEncriptado">No tiene tareas disponibles</p>`
    } else {

        data.map(task => {

            contenedorDeTareas.innerHTML += `<div class="card mt-4">
                                                <div class="card-body">
                                                    <span>${(task.task_status == 1) ? 'Pendiente' : 'Completado'}</span>
                                                    <span>Fecha:${task.created_at}</span>
                                                    <h5 class="card-title">${task.task_name}</h5>
                                                    <p class="card-text">${task.task_description}</p>
                                                    <span class="btn btn-warning"onClick="updateTask(${task.id})">Editar</span>
                                                    <span class="btn btn-danger" onClick="deleteTask(${task.id})">Eliminar</span>
                                                    <a href="#" class="btn  btn-success" onCLick="cambiarStatus(${task.id})">Completar</a>
                                                </div>
                                            </div>`
        });

    }
}


const deleteTask = async (id) => {
    try {

        const { data: { data } } = await apiTask.delete(`/task/${id}`)
        console.log(data)
        getTareas()

    } catch (err) {
        console.log(err)
    }
}


//formulariode update
formUpdate.addEventListener('submit',async(e)=>{
    e.preventDefault()

    const formUserUpdate = new FormData(formUpdate)
    console.log(formUserUpdate.get('task_name'))
    let taskData = {}
    taskData.task_name = formUserUpdate.get('task_name')
    taskData.task_description = formUserUpdate.get('task_description')
    console.log(taskData)

    const { data } = await apiTask.put(`task/${localStorage.getItem('auth-token')}`,taskData)
    console.log(data)
    getTareas()

    

})


const updateTask = async (id) => {

    formCreate.style.display = "none"
    formUpdate.style.display = 'block'

    try {

        const { data: { data } } = await apiTask.get(`/task/${id}`)
        const inputTitle = document.querySelector('#taskTitleUpdate')
        const textArea   = document.querySelector('#taskDescriptionUpdate').value = (!data.task_description)? '': data.task_description
        inputTitle.value = data.task_name
        textArea.value   = data.task_description
        // inputTitle.setAttribute("id", data.id);
        localStorage.setItem('id-update',data.id)
    
    } catch (err) {
        console.log(err)
    }

}

const crearTarea = async () => {
    try {

        const dataTask = new FormData(formCreate)
        const { data } = await apiTask.post('task', dataTask)

        if (data.error == false) {
            areaErrorMessage.classList.remove('alert-danger')
            areaErrorMessage.classList.add('alert-success');
            areaErrorMessage.style.display = 'block'
            areaErrorMessage.innerHTML = data.message
            getTareas()
        }

        if (data.success === false) {
            areaErrorMessage.style.display = 'block'
            areaErrorMessage.classList.remove('alert-success')
            areaErrorMessage.classList.add('alert-danger');
            areaErrorMessage.innerHTML = 'El titulo es requerido'
        }


    } catch (err) {
        console.log(err)
    }
}


const saveUpdate = async (task,id) => {
    try {
        const { data } = await apiTask.put(`task/${id}`,task)
        console.log(data)
        if (data.error == false) {
            areaErrorMessage.classList.remove('alert-danger')
            areaErrorMessage.classList.add('alert-success');
            areaErrorMessage.style.display = 'block'
            areaErrorMessage.innerHTML = data.message
            getTareas()
        }

        if (data.success === false) {
            areaErrorMessage.style.display = 'block'
            areaErrorMessage.classList.remove('alert-success')
            areaErrorMessage.classList.add('alert-danger');
            areaErrorMessage.innerHTML = 'El titulo es requerido'
        }
    } catch (err) {
        console.log(err)
    }
}

const cambiarStatus = async (id) =>{
    try {
        const { data: { data } } = await apiTask.put(`/task/filled/${id}`)
        console.log(data)
        getTareas()

    } catch (err) {
        console.log(err)
    }
}
getTareas()

