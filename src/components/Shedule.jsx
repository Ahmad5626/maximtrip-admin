import React, { useEffect, useState } from 'react'
import { useAuth } from '../contexts/authContext'
import { Link } from 'react-router-dom';

const Shedule = () => {
  const id=localStorage.getItem("id");
  const [zoomMeetingData,setZoomMeetingData]=useState()
  const {tutordatalist,studentdata}=useAuth()
  
  useEffect(() => { 

    {tutordatalist.map((zoom,index)=>{
     
      if(zoom._id==id){
        
        const ZoomMeetingReverse=zoom.meeting.slice().reverse();
        setZoomMeetingData(ZoomMeetingReverse)
      }
    })}

{studentdata.map((student,index)=>{
     
  if(student._id==id){
    
    const ZoomMeetingReverse=student.meeting.slice().reverse();
    setZoomMeetingData(ZoomMeetingReverse)
  }
})}
  }, [zoomMeetingData])

  

  
  return (
    <div>
      <main>
        <section className="my-4">
          <div className="customContainer bg-white lg:p-5 md:p-5 p-3 rounded-lg mx-auto shadow-sm">
            <p className="text-lg font-semibold mb-3 col-span-2">
              Shedule Classes
            </p>
            <div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-3">
            {zoomMeetingData?.map((zoom,index)=>{
              return(
                <div key={index} className="bg-gradient-to-br hover:bg-gradient-to-bl from-white to-blue-50 inline-block border rounded-lg p-3 shadow-md hover:scale-105 hover:shadow-xl duration-200">
                <div className="flex justify-between items-center border-b pb-1">
                  <div>
                    <p className="text-xl font-semibold">{zoom.topic}</p>
                    <p className="text-xs font-semibold text-gray-500">
                     <Link to={zoom.meetingLink}>{zoom.meetingLink}</Link>
                    </p>
                  </div>
                  <div>
                    {/* <img src="/img/no-data.png" className="h-16 w-16" alt="" /> */}
                  </div>
                </div>
                <div className="flex flex-col gap-2 py-3 mb-2 border-b">
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-blueClr font-semibold border rounded-full p-1 py-2">
                      Start Timing
                    </p>
                    <p className="font-medium text-sm text-gray-700 capitalize">
                      {zoom.startTime}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                  <p className="text-xs text-blueClr font-semibold border rounded-full p-1 py-2">
                      Duration
                    </p>
                    <p className="font-medium text-sm text-gray-700">
                      {zoom.duration}
                    </p>
                  </div>
                  
                </div>
                <div></div>
              </div>
              )
            })}
            </div>
          </div>

          
        </section>
      </main>
    </div>
  )
}

export default Shedule
