import React, { useEffect, useState } from "react";
import axios from "axios";
import { Toaster, toast } from "sonner";
import { useAuth } from "../contexts/authContext";
const Upcommingclass = () => {
  const { allUserData } = useAuth();
  const [tutordata, setTutordata] = useState([]);
  // console.log(tutordata);
  const [meetingallUserData, setMeetingallUserData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    const id = localStorage.getItem("id");
    const getCourseData = async () => {
      const courseData = await fetch("http://localhost:4100/allcourses");
      const courseData2 = await courseData.json();
      const Tutordata = await fetch("http://localhost:4100/alltutors");
      const Tutordata2 = await Tutordata.json();
      {
        Tutordata2.map((Tutordata2, index) => {
          if (Tutordata2._id == id) {
            // console.log(Tutordata2.courseData);

            {
              Tutordata2.courseData.map((Tutordata2) => {
                {
                  console.log(courseData2);
                  
                  courseData2.map((courseData2) => {
                    if (courseData2._id == Tutordata2) {
                      setTutordata(courseData2);
                      // console.log(courseData2);
                      
                    }
                  });
                }
              });
            }
          }
        });
      }

      //   setCourseData(courseData2);
    };
    getCourseData();
  }, []);

useEffect(() => {
  {allUserData.map((allUserData, index) => {
    if(allUserData.email==tutordata.email){
      setMeetingallUserData(tutordata)
    }else{
      // console.log("not found");
      
    }
    
  })}
}, [tutordata]);

 

  const [topic, setTopic] = useState("");
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState("");
  const [meetingLink, setMeetingLink] = useState("");

  // Ensure startTime is formatted as ISO 8601

  const handleCreateMeeting = async (e) => {
    e.preventDefault();

    try {
      // Check if startTime is valid
      if (!startTime) {
        toast("Start Time is required");
      }

      const parsedDate = new Date(startTime);

      if (isNaN(parsedDate)) {
        toast("Invalid Start Time");
      }

      // Format startTime to ISO 8601

      // Ensure the date is adjusted for IST (Indian Standard Time)
      const offsetIST = 5.5 * 60 * 60 * 1000; // IST offset in milliseconds
      const istDate = new Date(parsedDate.getTime() + offsetIST);
  
      const formattedStartTime = istDate.toISOString();
      

      const id = localStorage.getItem("id");
      const response = await fetch("http://localhost:4100/create-meeting", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic,
          startTime: formattedStartTime,
          duration: parseInt(duration),
          meetingLink,
          courserEmail:tutordata.email,
          id,
        }),
      });

      if (!response.ok) {
        toast(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

     toast("Meeting created successfully");

      setMeetingLink(data.join_url);
      setIsOpen(!isOpen);
    } catch (error) {
      toast("Error creating meeting:", error);
      toast("Failed to create meeting");
    }
  };

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            borderRadius: "10px",
            padding: "15px",
          },
        }}
      />
      <main>
        <section className="my-4">
          <div className="customContainer bg-white lg:p-5 md:p-5 p-3 rounded-lg mx-auto shadow-sm">
            <p className="text-lg font-semibold mb-3 col-span-2">
              Upcomming Classes
            </p>
            <div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-3">
              <div className="bg-gradient-to-br hover:bg-gradient-to-bl from-white to-blue-50 inline-block border rounded-lg p-3 shadow-md hover:scale-105 hover:shadow-xl duration-200">
                <div className="flex justify-between items-center border-b pb-1">
                  <div>
                    <p className="text-xl font-semibold">{tutordata.subject}</p>
                    <p className="text-xs font-semibold text-gray-500">
                      {tutordata.name}
                    </p>
                  
                  </div>
                  <div>
                    <img src="/img/no-data.png" className="h-16 w-16" alt="" />
                  </div>
                </div>
                <div className="flex flex-col gap-2 py-3 mb-2 border-b">
                  {/* <div className="flex items-center gap-2">
                    <p className="text-xs text-blueClr font-semibold border rounded-full p-1 py-2">
                      Email
                    </p>
                    <p className="font-medium text-sm text-gray-700 capitalize">
                      {tutordata.email}
                    </p>
                  </div> */}
                  {/* <div className="flex items-center gap-2">
                    <i className="fa-solid fa-phone text-blueClr border p-2 rounded-full"></i>
                    <p className="font-medium text-sm text-gray-700">
                      {tutordata.number}
                    </p>
                  </div> */}
                  <div className="flex items-center justify-end gap-2">
                    <button
                      className="text-xs text-blueClr font-semibold border rounded-full p-1 py-2"
                      onClick={() => setIsOpen(true)}
                    >
                      Accept
                    </button>
                  </div>
                </div>
                <div></div>
              </div>
            </div>
          </div>

          {isOpen && (
            <div className="popup-overlay">
              <div className="popup">
                <ul className="flex flex-col gap-2">
                  <div>
                    <h1 className="font-bold my-3">Create Zoom Meeting</h1>
                    <form onSubmit={handleCreateMeeting}>
                      <div>
                        <label>Meeting Topic:</label>
                        <input
                          type="text"
                          value={topic}
                          className="w-full border-2 m-2 p-2"
                          onChange={(e) => setTopic(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label>Start Time:</label>
                        <input
                          type="datetime-local"
                          value={startTime}
                          className="w-full border-2 m-2 p-2"
                          onChange={(e) => setStartTime(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label>Duration (minutes):</label>
                        <input
                          type="number"
                          value={duration}
                          className="w-full border-2 m-2 p-2"
                          onChange={(e) => setDuration(e.target.value)}
                          required
                        />
                      </div>
                      <button type="submit" className="send-popup-btn">
                        Create Meeting
                      </button>
                    </form>
                  </div>
                </ul>

                <div className="flex justify-center gap-10">
                  <button className="close-popup-btn " onClick={togglePopup}>
                    Close
                  </button>
                  {/* <button className="send-popup-btn" onClick={togglePopup}>
              Send
            </button> */}
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Upcommingclass;
