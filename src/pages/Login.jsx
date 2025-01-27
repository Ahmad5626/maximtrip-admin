import { useEffect, useRef, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { toast, Toaster } from "sonner"
import { useAuth } from "../contexts/authContext"
import axios from "axios"

function Login() {
    
    const [showPassword, setShowPassword] = useState(false)
    const [emailValue, setEmailValue] = useState({
        email:"",
        password:""
    })
    
    const handleChange=(e)=>{
        const {name,value}=e.target
        setEmailValue({...emailValue,[name]: value })
    }
 
  
   
const VALUE_EMIAL=import.meta.env.VALUE_EMAIL
const VALUE_PASSWORD=import.meta.env.VALUE_PASSWORD



    useEffect(() => {
        document.title = "Login | Grade Topper"
      

       
    })

    const navigate = useNavigate()

   
    const handleloginDashboard=async (e)=>{
        e.preventDefault()
       try {
        const userlogindata=emailValue
        if(emailValue.email=="anuj@gmail.com" && emailValue.password=="Anuj@123###"){
                    navigate('/overview/home')
                    localStorage.setItem("role","admin")
                }
                if(!emailValue.checked){
                    const res=await fetch("https://gradetopper-2.onrender.com/login",{
                        method:"POST",
                        headers:{
                           "Content-Type":"application/Json"
                        },
                        body:JSON.stringify(userlogindata)
                     }).then(res=> res.json())
                     .then((data)=>{
             
                         console.log(data);
                         
                        if(data.success){
                           localStorage.setItem("role",data.user.role)
                           localStorage.setItem("id",data.user._id)
                           toast.success('Login Successfully ')
                           navigate('/overview/profile')
                        }else{
                           toast.error(data.message || "Loign failed")
                        }
                        
                     })
                }

                const res=await fetch("https://gradetopper-2.onrender.com/tutuorlogin",{
                    method:"POST",
                    headers:{
                       "Content-Type":"application/Json"
                    },
                    body:JSON.stringify(userlogindata)
                 }).then(res=> res.json())
                 .then((data)=>{
         
                     console.log(data);
                     
                    if(data.success){
                       localStorage.setItem("role",data.user.role)
                       localStorage.setItem("id",data.user._id)
                       toast.success('Login Successfully ')
                       navigate('/overview/profile')
                    }else{
                       toast.error(data.message || "Loign failed")
                    }   
                    
                 }) 
        
       
       } catch (error) {
        toast.error(error)
        console.log(error);
        
       }
     }
console.log(emailValue);

    return (
        <>
            <main className="h-[100dvh] flex items-center justify-center bg-[url('/img/login-cover.svg')] bg-cover bg-center px-4 sm:px-6 lg:px-8">
                <Toaster position="top-center" />
                <div className="w-[320px] min-h-96 px-8 py-6 text-left bg-gray-800 border border-gray-700 bg-opacity-70 backdrop-blur-lg rounded-xl shadow-lg">
                    <form onSubmit={handleloginDashboard}>
                        <div className="flex flex-col h-full select-none">
                            <div className="mb-5 flex justify-center">
                                <img src="/img/vyapar-logo.png" className="w-20" />
                            </div>
                            <div className="w-full flex flex-col gap-2">
                                <label className="font-semibold text-xs text-white tracking-wide">Email</label>
                                <input className="border rounded-lg px-3 py-2 mb-5 text-white text-sm w-full outline-none border-gray-600 bg-gray-600 bg-opacity-40 placeholder:text-gray-400" placeholder="example@mail.com" type="email" name="email" value={emailValue.email} onChange={handleChange} />
                            </div>
                        </div>
                        <div className="w-full flex flex-col gap-2">
                            <label className="font-semibold text-xs text-white tracking-wide">Password</label>
                            <div className="flex justify-between items-center border-gray-600 bg-gray-600 bg-opacity-40 border rounded-lg px-3 py-2 mb-3">
                                <input type={showPassword ? "text" : "password"} value={emailValue.password} onChange={handleChange} className="bg-transparent text-white text-sm w-full outline-none placeholder:text-gray-400" placeholder="••••••••" name="password" />
                                <button type="button" className="text-gray-400 text-sm" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <i className="fa-regular fa-eye text-white"></i> : <i className="fa-regular fa-eye-slash text-white"></i>}
                                </button>
                            </div>
                        </div>
                        <div className="w-full flex flex-col gap-2">
                                <label className="font-semibold text-xs text-white tracking-wide">Are you a Tutor</label>
                                <input className="border rounded-lg px-3 py-2 mb-5 text-white text-sm w-full outline-none border-gray-600 bg-gray-600 bg-opacity-40 placeholder:text-gray-400" placeholder="example@mail.com" type="checkbox" name="checked" value={emailValue.checked} onChange={handleChange} />
                            </div>
                      
                        <div>
                            <button type="submit" className="py-2 text-sm bg-blueClr focus:ring-offset-blue-200 text-white w-full transition ease-in duration-200 flex justify-center text-center font-semibold shadow-md focus:outline-none rounded-lg cursor-pointer select-none">
                            LOGIN
                            </button>
                        </div>
                    </form>
                   
                </div>
            </main>
        </>
    )
}

export default Login
