
const api = 'http://localhost:8000/api/login'
const areaErrorMessage = document.querySelector('#errors')


const formLogin = document.querySelector('#login')
const formResgiter = document.querySelector('#register')

formLogin.addEventListener('submit',async(e)=>{
    e.preventDefault()
    try{
        const formData = new FormData(formLogin)
        const {data} = await axios.post(api,formData,{
                Headers:{
                "Accept":"application/json",
            }
        })
        console.log(data)
        if(data.token){
            localStorage.setItem('auth-token',data.token)
            window.location.href = "todo.html";
        }
      
        if( data.data.hasOwnProperty('email') || data.data.hasOwnProperty('password')){
            areaErrorMessage.style.display = 'block'
            areaErrorMessage.innerHTML = 'Todos los campos son Requeridos!'
        }

        
       

    }catch({response})
    {   
        if(response.data.msg){
            areaErrorMessage.style.display = 'block'
            areaErrorMessage.innerHTML = 'Usuario o Contraseña Invalidos'
        }
       
        
    }
        
})





 