import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react'
import { Toaster, toast } from 'sonner';
import { useAuth } from '../contexts/authContext';  
const Request = () => {
    const {courseData,tutordatalist,deleteCourseData}=useAuth();
    const [isOpen, setIsOpen] = useState(false);
    
    
    const reverseCourseData = courseData.slice().reverse();

    
    
//  request user cousre data
const [requestCourseData, setRequestCourseData] = useState([]);

    // which is send to teacher
    const [sendCourseData, setSendCourseData] = useState([])

    

   



  // Function to toggle popup visibility and send data get
  const togglePopup = (couserid) => {
    setIsOpen(!isOpen);
   
  {courseData.map((course,index) => {
    if(course._id == couserid){
      setRequestCourseData(course);
    }
  })}
    
    
    
  };
//  share data to tutor
  const selectTutor=async(tutorid)=>{
    // console.log(tutorid);
    {tutordatalist.map((tutor,index) => {
      if(tutor._id == tutorid){
        setSendCourseData(tutor);
    
}
    
    })}
    const requestCourseDataId = requestCourseData._id
  //  const res = await fetch(`http://localhost:4100/sharecourse/${tutorid}`, {
   const res = await fetch(`http://localhost:4100/sharecourse/${tutorid}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ coursedata: requestCourseDataId }), // Convert to JSON string
          })
          
          .then(async (response) => {
            const data = await response.json();
            console.log(data);
            if (response.ok) {
              // Handle success response
          toast.success('Data sent successfully');
            } else {
              // Handle failure response
              toast.error(data.message);
            }
          })
          .catch((err) => {
            console.log(`Error: ${err.message}`);
          });
}

 
      
  return (
    <div>
       <Toaster  position='top-center'   toastOptions={{
          style: {
            borderRadius: "10px",
            padding: "15px",
          },
            }}
            /> 
       <main>
                
                
                <section className="my-4">
                   
                    <div className="customContainer bg-white lg:p-5 md:p-5 p-3 rounded-lg mx-auto shadow-sm">
                        <p className="text-lg font-semibold mb-3 col-span-2">Requset Classes</p>
                        <div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-3">
                           {reverseCourseData.map((course,index) => {
                            return(
                                <div key={index} className="bg-gradient-to-br hover:bg-gradient-to-bl from-white to-blue-50 inline-block border rounded-lg p-3 shadow-md hover:scale-105 hover:shadow-xl duration-200" >
                                        <div className="flex justify-between items-center border-b pb-1">
                                            <div>
                                                <p className="text-xl font-semibold">{course.subject}</p>
                                                <p className="text-xs font-semibold text-gray-500">{course.name}</p>
                                            </div>
                                            <div>
                                                <img src="/img/no-data.png" className="h-16 w-16" alt="" />
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2 py-3 mb-2 border-b" >
                                            <div className="flex items-center gap-2">
                                                <p className="text-xs text-blueClr font-semibold border rounded-full p-1 py-2">Email</p>
                                                <p className="font-medium text-sm text-gray-700 capitalize">{course.email}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <i className="fa-solid fa-phone text-blueClr border p-2 rounded-full"></i>
                                                <p className="font-medium text-sm text-gray-700">{course.number}</p>
                                            </div>
                                           
                                            <div className="flex items-center justify-between gap-2 pt-4">
                                            <button className="text-xs text-red-500 font-semibold border rounded-full p-1 py-2 hover:text-red-700" onClick={() => deleteCourseData(course._id)}>Delete</button>
                                                <button className="text-xs text-blueClr font-semibold border rounded-full p-1 py-2 hover:text-blue-700" onClick={() => togglePopup(course._id)}>Share</button>
                                            </div>
                                            
                                            
                                        </div>
                                        <div>
                                            
                                        </div>
                                    </div>  
                            )
                            
                           }
                          )}
                                    

                                   
                                    
                                   
                          {isOpen && (
        <div className="popup-overlay">
          <div className="popup">
            <h2 className='my-5 text-xl font-semibold'>Your Teachers</h2>
            <ul className='flex flex-col gap-2'>
               
               {tutordatalist.map((item,index)=>{
                return(
                    <li key={index} className='bg-gradient-to-br hover:bg-gradient-to-bl from-white to-blue-50 inline-block border rounded-lg p-3 shadow-md hover:scale-105 hover:shadow-xl duration-200 ' onClick={() => selectTutor(item._id)}>{item.name}</li>
                )
               })}
            </ul>

            <div className='flex justify-center gap-10'>
            <button className="close-popup-btn " onClick={togglePopup}>
              Close
            </button>
          
            </div>
          </div>
        </div>
      )}
                                    
                               

                            
                        </div>
                     
                    </div>
                </section>

            </main>
    </div>
  )

  
}

export default Request
