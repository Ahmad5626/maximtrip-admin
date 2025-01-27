import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [studentdata,setStudentData]=useState([]) 
 

   


// Student Registration data
    useEffect(()=>{
        async function getData(){
         try{
           const response=await fetch('https://gradetopper-2.onrender.com/students')
           const data=await response.json()
           // console.log(data)
           setStudentData(data)
         }catch(err){
           console.log(err)
         }
        }
        getData()
       },[])

       const deleteUser=async(id)=>{
        try {
            const res=await fetch(`https://gradetopper-2.onrender.com/deleteUser/${id}`,{
                method:"DELETE",
    
            }).then(data=> data.json())
            .then((data)=>{
                if(data.success){
                    setStudentData((studentdata.filter((tutot) => tutot._id !== id)))
                    toast.success("User deleted successfully");
                }
                else {
                    toast.error(data.message || "Failed to delete User");
                }
            })
        } catch (error) {
            console.error("Error deleting User:", error.message);
            toast.error("Something went wrong!");
        }
    }  

    
// add teacher
const [tutordata, setTutordata] = useState({
    name: "",
    email: "",
    mobile: "",
    pancardno: "",
    adharcardno: "",
    address: "",
    subject: "",
    description: "",
    Country: "",
    State: "",
    City: "",
    password: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTutordata({ ...tutordata, [name]: value });
  };


//   create Tutor
const tutorCreate = async (e) => {
    e.preventDefault();
    const alltutordata = tutordata;
    const res = await fetch("https://gradetopper-2.onrender.com/tutorcreate", {
      method: "POST",
      headers: {
        "Content-Type": "application/Json",
      },
      body: JSON.stringify(alltutordata),
    })
      .then((res) => res.json())
      .then((data) => {
        //  localStorage.setItem("usertoken", data.usertoken)
        window.location.href = "/overview/teacher";
        toast("Add Tutor Successfully")
      })
      .catch((err) => {
        console.log(err);
        toast(err.message)
      });
  };
  

// Delete Tutor
  const deleteTutor=async(id)=>{
    try {
        const res=await fetch(`https://gradetopper-2.onrender.com/deletetutor/${id}`,{
            method:"DELETE",

        }).then(data=> data.json())
        .then((data)=>{
            if(data.success){
                setTutordatalist((tutordatalist.filter((tutot) => tutot._id !== id)))
                toast.success("Tutor deleted successfully");
            }
            else {
                toast.error(data.message || "Failed to delete tutor");
            }
        })
    } catch (error) {
        console.error("Error deleting tutor:", error.message);
        toast.error("Something went wrong!");
    }
}

const [tutordatalist, setTutordatalist] = useState([]);

// get all tutor data

useEffect(()=>{
    async function getData(){
      try{
        const response=await fetch('https://gradetopper-2.onrender.com/alltutors')
        const data=await response.json()
        // console.log(data)
        setTutordatalist(data)
      }catch(err){
        console.log(err)
      }
    }
    getData()
  },[tutordatalist])

//   Course data 
const [courseData, setCourseData]=useState([]);

useEffect(() => {
       const getCourseData=async()=>{
           const response=await fetch("https://gradetopper-2.onrender.com/allcourses");
           const data=await response.json();
           setCourseData(data);
          //  console.log(data);
           
       }
       getCourseData();
      }, [courseData]);

// Delete Course Data
const deleteCourseData=async(id)=>{
  try {
      const res=await fetch(`https://gradetopper-2.onrender.com/deletecourse/${id}`,{
          method:"DELETE",

      }).then(data=> data.json())
      .then((data)=>{
          if(data.success){
            setCourseData((courseData.filter((tutot) => courseData._id !== id)))
              toast.success("Course deleted successfully");
          }
          else {
              toast.error(data.message || "Failed to delete tutor");
          }
      })
  } catch (error) {
      console.error("Error deleting Course:", error.message);
      toast.error("Something went wrong!");
  }
}
     const [ZoomMeeting, setZoomMeeting] = useState([]);
// Get zoom meeting
useEffect(() => {
    const getZoomMeeting = async () => {
      try {
        const response = await fetch('https://gradetopper-2.onrender.com/getzoommeeting');
        const data = await response.json();
        setZoomMeeting(data);
      } catch (error) {
        console.error('Error fetching zoom meeting:', error);
      }
    };
    getZoomMeeting();
},[]);
    return (
        <AuthContext.Provider value={
            {
                studentdata,
                deleteUser ,
                tutordata,
                handleChange,
                tutorCreate,
                deleteTutor,
                tutordatalist,
                courseData,
                deleteCourseData,
                ZoomMeeting
               
                }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
