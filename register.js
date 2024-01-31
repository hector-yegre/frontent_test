
const api = 'http://127.0.0.1:8000/api/register'
const areaErrorMessage = document.querySelector('#errors')


const formLogin = document.querySelector('#register')
 
formLogin.addEventListener('submit',async(e)=>{
    e.preventDefault()
    try{
        const formData = new FormData(formLogin)
        const {data} = await axios.post(api,formData,{
                Headers:{
                "Accept":"application/json",
            }
        })
        // console.log(data)
        // if(data.token){
        //     localStorage.setItem('auth-token',data.token)
        //     window.location.href = "todo.html";
        // }
        console.log(data)

        if( !data.error){
            areaErrorMessage.classList.remove('alert-danger')
            areaErrorMessage.classList.add('alert-success');
            areaErrorMessage.style.display = 'block'
            areaErrorMessage.innerHTML = data.message
        }

        if( data.success === false){
            areaErrorMessage.style.display = 'block'
            areaErrorMessage.innerHTML = 'Todos los campos son Requeridos!'
        }

       

        
       

    }catch({response})
    {   
        if( response.data.data){
            areaErrorMessage.style.display = 'block'
            areaErrorMessage.innerHTML =  response.data.message
            console.log("asdasdasdasd",response)
        }
        
    }
        
})





 