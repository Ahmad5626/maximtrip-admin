import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/authContext';
import styles from './Profile.module.css'
// import ProfileUpload from './ProfileUpload/ProfileUpload';
import Loader from './Loader/Loader';

function Profile() {
    const [allUserData,setallUserData]=useState([]) 
    const [teacherdata,setTeacherData]=useState([]) 
  const id= localStorage.getItem("id")
//   console.log(id);
  useEffect(()=>{
   async function getData(){
    try{
      const role=  localStorage.getItem("role")
      if(role=="student"){
        const response=await fetch('http://localhost:4100/students')
        const data=await response.json()
        // console.log(data)
        setallUserData(data)
      }

      if(role=="tutor"){
        const response=await fetch('http://localhost:4100/alltutors')
        const data=await response.json()
        // console.log(data)
        setTeacherData(data)
      }
     
    }catch(err){
      console.log(err)
    }
   }
   getData()
  },[])
  console.log(allUserData);
  
    return (
        <>
            <section className="my-4">
              
                <div className="customContainer bg-white p-5 rounded-lg mx-auto shadow-sm">
                    <div className='flex justify-center'>
                        <div className="w-32 h-32 relative rounded-full grid">
                            <div className="grid place-items-center aspect-square h-32 border-4 border-blueClr rounded-[100vh] overflow-hidden">
                                <img
                                    className="object-cover h-full w-full"
                                    src='/img/default-avatar.jpg'
                                />
                            </div>
                            {/* <button htmlFor='profile' className={styles.browse} >
                                <div className={styles.browseFileImg}>
                                    <i className="fa-solid fa-pen"></i>
                                </div>
                            </button> */}
                        </div>
                    </div>
                    {allUserData.map((tutot) => {
                       if(tutot._id===id){
                           return (
                            <div className='mt-4 space-y-2'>
                        <div className='flex flex-col'>
                            <span className='font-semibold text-xs text-gray-400'>Full Name:</span>
                            <span>{tutot.name}</span>
                        </div>
                        <div className='flex flex-col'>
                            <span className='font-semibold text-xs text-gray-400'>Mobile:</span>
                            <span>{tutot.number}</span>
                        </div>
                       
                        <div className='flex flex-col'>
                            <span className='font-semibold text-xs text-gray-400'>Email:</span>
                            <span>{tutot.email}</span>
                        </div>
                       
                   

                    
                        <div className='flex flex-col'>
                            <span className='font-semibold text-xs text-gray-400'>role :</span>
                            <span>{tutot.role} </span>
                        </div>

                    </div>
                           )
                       }
                   })}
                   
                   {teacherdata.map((tutot) => {
                       if(tutot._id===id){
                           return (
                            <div className='mt-4 space-y-2'>
                        <div className='flex flex-col'>
                            <span className='font-semibold text-xs text-gray-400'>Full Name:</span>
                            <span>{tutot.name}</span>
                        </div>
                        <div className='flex flex-col'>
                            <span className='font-semibold text-xs text-gray-400'>Mobile:</span>
                            <span>{tutot.number}</span>
                        </div>
                       
                        <div className='flex flex-col'>
                            <span className='font-semibold text-xs text-gray-400'>Email:</span>
                            <span>{tutot.email}</span>
                        </div>
                       
                        <div className='flex flex-col'>
                            <span className='font-semibold text-xs text-gray-400'>Address</span>
                            <span>{tutot.address} </span>
                        </div>

                        <div className='flex flex-col'>
                            <span className='font-semibold text-xs text-gray-400'>Pan Card Number:</span>
                            <span>{tutot.pancardno} </span>
                        </div>
                        <div className='flex flex-col'>
                            <span className='font-semibold text-xs text-gray-400'>Adhar Card Number:</span>
                            <span>{tutot.adharcardno} </span>
                        </div>
                        <div className='flex flex-col'>
                            <span className='font-semibold text-xs text-gray-400'>role :</span>
                            <span>{tutot.role} </span>
                        </div>

                    </div>
                           )
                       }
                   })}
                    {/* <div className='mt-4 text-center'>
                        <Link to={"/overview/editProfile"} className='bg-blueClr text-white py-2 px-4 rounded-lg font-semibold text-sm'><i className="fa-solid fa-pen mr-1"></i>Edit Profile</Link>
                    </div> */}
                </div>
                {/* <div className="customContainer bg-white p-5 rounded-lg mx-auto mt-5 shadow-sm">
                    <h3 className="text-lg font-semibold col-span-2 border-neutral-200 pb-2">Defaulters data added by you</h3>
                    <div className="grid grid-cols-1 gap-3">
                       
                                    <div  className="border rounded-lg shadow-md lg:p-4 p-3 flex lg:flex-row md:flex-col flex-col lg:justify-between justify-start lg:*:items-center">
                                        <Link  className='grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 lg:gap-4 gap-0 lg:place-items-center'>
                                            <div>
                                                <p><span className="font-medium text-neutral-400 me-2">Name: </span>Ahmad raza</p>
                                                <p><span className="font-medium text-neutral-400 me-2">Mobile: </span>+91 78963478</p>
                                            </div>
                                            <div>
                                                <p><span className="font-medium text-neutral-400 me-2">Company name: </span>Grade Topper</p>
                                                <p><span className="font-medium text-neutral-400 me-2">GST: </span>32y49823y</p>
                                            </div>
                                        </Link>
                                        <div className=' lg:col-span-1 md:col-span-2 mt-2'>
                                            <button className="btn"> </button>
                                            <dialog id="my_modal_1" className="modal">
                                                <div className="modal-box p-4 roun">
                                                    <h3 className="font-bold text-lg">Are you sure?</h3>
                                                    <p className="py-4">You want to state this defaulter as cleared?</p>
                                                    <div className="modal-action">
                                                        <form method="dialog">
                                                            <button className="btn mr-1 bg-white">Cancel</button>
                                                            <button className="btn">Confirm</button>
                                                        </form>
                                                    </div>
                                                </div>
                                            </dialog>
                                        </div>
                                    </div>
                              
                    </div>
                </div> */}
            </section>
        </>
    )
}

export default Profile
