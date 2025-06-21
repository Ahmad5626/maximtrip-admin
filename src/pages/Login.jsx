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
        document.title = "Login | GiveUmmah"
      })

    const navigate = useNavigate()

   
    const handleloginDashboard=async (e)=>{
        e.preventDefault()
       try {
        console.log("yes");
        
        if(emailValue.email=="maximtrip@gmail.com" && emailValue.password=="maximtrip@123"){
                    navigate('/overview/home')
                    localStorage.setItem("role","admin")
                }
              
               } catch (error) {
        toast.error(error)
        console.log(error);
        
       }
     }
console.log(emailValue);

    return (
        <>
            <main className="h-[100dvh] flex items-center justify-center  bg-center px-4 sm:px-6 lg:px-8">
                <Toaster position="top-center" />
                <div className="w-[320px] min-h-96 px-8 py-6 text-left bg-[#ffffff] border bg-opacity-100 backdrop-blur-lg rounded-xl shadow-2xl">
                    <form onSubmit={handleloginDashboard}>
                        <div className="flex flex-col h-full select-none">
                            <div className="mb-2 flex justify-center">
                                <img src="/img/maximtrip-logo.png" className="w-[200px]" style={{ fllter: "brightness(10)" }} />
                            </div>
                            <div className="w-full flex flex-col gap-2">
                                <label className="font-semibold text-xs text-white tracking-wide">Email</label>
                                <input className="border rounded-lg px-3 py-2 mb-5 text-black text-sm w-full outline-none border-gray-300  bg-opacity-100 placeholder:text-gray-600" placeholder="example@mail.com" type="email" name="email" value={emailValue.email} onChange={handleChange} />
                            </div>
                        </div>
                        <div className="w-full flex flex-col gap-2">
                            <label className="font-semibold text-xs text-white tracking-wide">Password</label>
                            <div className="flex justify-between items-center border rounded-lg px-3 py-2 mb-5 text-black text-sm w-full  border-gray-300  bg-opacity-100 placeholder:text-gray-600">
                                <input type={showPassword ? "text" : "password"} value={emailValue.password} onChange={handleChange} className="bg-transparent text-black text-sm w-full outline-none placeholder:text-gray-400" placeholder="••••••••" name="password" />
                                <button type="button" className="text-black text-sm" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <i className="fa-regular fa-eye text-black"></i> : <i className="fa-regular fa-eye-slash text-black"></i>}
                                </button>
                            </div>
                        </div>
                       
                      
                        <div>
                            <button type="submit" className="py-2 my-4 text-sm bg-[#ce3c3d] focus:ring-offset-blue-200 text-white w-full transition ease-in duration-200 flex justify-center text-center font-semibold shadow-md focus:outline-none rounded-lg cursor-pointer select-none">
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
