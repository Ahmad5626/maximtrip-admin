import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { initialCreateBlogData, initialCreateCategoryData, initialCreatePackegesData, initialInspiringInstitutes, initialRecommendedCauses, initialUpdateButton } from '../config';

import { uploadFile } from '../server/uploadImg';
import { createRecommendedCauses, deleteRecommendedCauses, getAllRecommendedCauses } from '../server/recommendedCauses';
import { createPackeges, deletePackeges } from '../server/createPackeges';
import { createCategory, deleteCategory } from '../server/category';
import { createBlog, deleteBlog, getBlog } from '../server/Blog';
import { get } from 'mongoose';
import { createPage, deletePage, getPage } from '../server/Page';
import { createDestinations, deleteDestinations, getDestinations } from '../server/Destinations';
import { TrendingUpDown } from 'lucide-react';
import { baseApi } from '../utils/constant';
// import getCampaignData from '../server/capmaign';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [allUserData, setAllUserData]=useState([]) 
    const [packegesData, setPackegesData]=useState([])
    const [categoryData, setCategoryData]=useState([])
    const [blogData, setBlogData]=useState([])
    const [destinationsData, setDestinationsData]=useState([])
    const [pageData, setPageData]=useState([])
     const [formData, setFormData] = useState({
        headline: '',
        days: '',
        address: '',
        overview: '',
        heroImage: '',
        multipleImages: [],
        price: '',
        originalPrice: '',
        category: '',
        duration: {
          days: '',
          nights: ''
        },
        itinerary: [],
        inclusions: [''],
        exclusions: [''],
        termsAndConditions: [''],
        highlights: [''],
    
       
        groupSize: {
          min: 1,
          max: 20
        },
        
        tags: [''],
        location: {
          country: '',
          state: '',
          city: '',
          coordinates: {
            latitude: '',
            longitude: ''
          }
        }
      });
      const [uploadingHero, setUploadingHero] = useState(false)
    const [createCategoryFormData, setCreateCategoryFormData]=useState(initialCreateCategoryData)
    const [createBlogFormData, setCreateBlogFormData]=useState(initialCreateBlogData)
    const [createDestinationsFormData, setCreateDestinationsFormData]=useState(initialCreateBlogData)
    const [createPageFormData, setCreatePageFormData]=useState(initialCreateBlogData)



const deleteUser = async (id) => {
  try {
    const res = await fetch(`${baseApi}/v1/api/delete-enquiry/${id}`, {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json(); // ✅ assumes server returns valid JSON

    if (data.success) {
      toast.success(data.message);
      window.location.reload(); // ✅ reloads page after success
    }

  } catch (err) {
    console.log(err); // ✅ catches any fetch errors
  }
};
   
 async function getData(){
         try{
           const response=await fetch(`${baseApi}/v1/api/get-enquiry`)
           const data=await response.json()
          
          
           setAllUserData(data.data)
         }catch(err){
           console.log(err)
         }
        }



// Create Packeges

const handleChangeCraetePackeges=async(e)=>{
  const {name, value,files} = e.target;
  setCreatePackegesFormData((prevData) => ({
    ...prevData,
    [name]: value,
  }))
 // If files exist (image upload)
  if (files && files.length > 0) {
    const uploadedUrls = [];

    for (let i = 0; i < files.length; i++) {
      const uploadedUrl = await uploadFile(files[i]); // 👈 Your file upload function
      uploadedUrls.push(uploadedUrl);
    }

    setCreatePackegesFormData((prevData) => ({
      ...prevData,
      [name]: files.length === 1 ? uploadedUrls[0] : uploadedUrls,
    }));
  }
}
 
const handleSubmitCreatePackeges=async()=>{
 
  const data =await createPackeges(formData)
  if(data.success){
    toast.success("Packeges Created successfully");
  }
  else{
    toast.error("Packeges update failed");
    console.log(data);
    
  }
}
 const getPackegesData=async()=>{
          const data= await fetch(`${baseApi}/v1/api/get-packeges`)
          if(data){
            const res=await data.json()
            setPackegesData(res.data)
            
          }
        }

  const handleDeletePackeges=async(id)=>{
          const data=await deletePackeges(id)
          if(data.success){
            toast.success("Packeges deleted successfully");
          }
          else{
            toast.error("Packeges deletion failed");
            console.log(data);
            
          }
         }
        

// create Cateory

const handleChangeCraeteCategory=async(e)=>{
  const {name, value,files} = e.target;
  setCreateCategoryFormData((prevData) => ({
    ...prevData,
    [name]: value,
  }))
 try {
  setUploadingHero(true)
   if (files && files[0]) {
    const file = files[0];
    const uploadedUrl = await uploadFile(file);
    setCreateCategoryFormData((prevData) => ({
      ...prevData,
      [name]: uploadedUrl,
    }));
  }
 } catch (error) {
  return error
 }
 finally{
  setUploadingHero(false)
 }
}
 
const handleSubmitCreateCategory=async(e)=>{
  e.preventDefault();
  const data =await createCategory(createCategoryFormData)
  if(data.success){

    
    toast.success("Category Created successfully");
  }
  else{
    toast.error("Category update failed");
    console.log(data);
    
  }
}

const handleDeletecategory=async(id)=>{
 const data=await deleteCategory(id)
 if(data.success){
  toast.success("Category deleted successfully");
}
else{
  toast.error("Category deletion failed");
  console.log(data);
  
}
}

 const getCategoryData=async()=>{
          const data= await fetch(`${baseApi}/v1/api/get-category`)
          if(data){
            const res=await data.json()
            setCategoryData(res.data)
            
          }
        }

// create blog

const handleChangeCreateBlog=async(e)=>{
  const {name, value,files} = e.target;
  setCreateBlogFormData((prevData) => ({
    ...prevData,
    [name]: value,
  }))
 try {
  setUploadingHero(true)
   if (files && files[0]) {
    const file = files[0];
    const uploadedUrl = await uploadFile(file);
    setCreateBlogFormData((prevData) => ({
      ...prevData,
      [name]: uploadedUrl,
    }));
  }
 } catch (error) {
  return error
 }finally{
  setUploadingHero(false)
 }
}
         
const handleSubmitCreateBlog=async(e)=>{
  e.preventDefault();
  const data =await createBlog(createBlogFormData)
  if(data.success){
    toast.success("Blog Created successfully");
  }
  else{
    toast.error("Blog update failed");
    console.log(data);
    
  }
}

const getBlogData=async()=>{
  const data= await getBlog()
  if(data){
    
    setBlogData(data.data)
    
  }
}
   
const handleDeleteBlog=async(id)=>{
  const data=await deleteBlog(id)
  if(data.success){
    toast.success("Blog deleted successfully");
  }
  else{
    toast.error("Blog deletion failed");
    console.log(data);
    
  }
}


// create destinations

const handleChangeCreateDestinations=async(e)=>{
  const {name, value,files} = e.target;
  setCreateDestinationsFormData((prevData) => ({
    ...prevData,
    [name]: value,
  }))
try {
  setUploadingHero(TrendingUpDown)
    if (files && files[0]) {
    const file = files[0];
    const uploadedUrl = await uploadFile(file);
    setCreateDestinationsFormData((prevData) => ({
      ...prevData,
      [name]: uploadedUrl,
    }));
  }
} catch (error) {
  return error
}finally{
  setUploadingHero(false)
}
}
         
const handleSubmitCreateDestinations=async(e)=>{
  e.preventDefault();
  const data =await createDestinations(createDestinationsFormData)
  if(data.success){
    toast.success("destinations Created successfully");
  }
  else{
    toast.error("destinations update failed");
    console.log(data);
    
  }
}

const getDestinationsData=async()=>{
  const data= await getDestinations()
  if(data){
    
    setDestinationsData(data.data)
    
  }
}
   
const handleDeleteDestinations=async(id)=>{
  const data=await deleteDestinations(id)
  if(data.success){
    toast.success("destinations deleted successfully");
  }
  else{
    toast.error("destinations deletion failed");
    console.log(data);
    
  }
}

// create Page

const handleChangeCreatePage=async(e)=>{
  const {name, value,files} = e.target;
  setCreatePageFormData((prevData) => ({
    ...prevData,
    [name]: value,
  }))
  try {
    setUploadingHero(true)
    if (files && files[0]) {
    const file = files[0];
    const uploadedUrl = await uploadFile(file);
    setCreatePageFormData((prevData) => ({
      ...prevData,
      [name]: uploadedUrl,
    }));
  }
  } catch (error) {
    return error
  }finally{
    setUploadingHero(false)
  }
}
         
const handleSubmitCreatePage=async(e)=>{
  e.preventDefault();
  const data =await createPage(createPageFormData)
  if(data.success){
    toast.success("Page Created successfully");
  }
  else{
    toast.error("Page update failed");
    console.log(data);
    
  }
}

const getPageData=async()=>{
  const data= await getPage()
  if(data){
    
    setPageData(data.data)
    
  }
}
   
const handleDeletePage=async(id)=>{
  const data=await deletePage(id)
  if(data.success){
    toast.success("Page deleted successfully");
  }
  else{
    toast.error("Page deletion failed");
    console.log(data);
    
  }
}


// Student Registration data
    useEffect(()=>{
      
        getData()
        getPackegesData()
        getCategoryData()
        getBlogData()
        getPageData()
        getDestinationsData()
        },[])


console.log(blogData);




    return (
        <AuthContext.Provider value={
            {
                allUserData,
                deleteUser,
                
                handleChangeCraetePackeges,
                handleSubmitCreatePackeges,
                packegesData,
                createCategoryFormData,
                handleChangeCraeteCategory,
                handleSubmitCreateCategory,
                categoryData,
                handleDeletecategory,
                handleDeletePackeges,
                createBlogFormData,
                handleChangeCreateBlog,
                handleSubmitCreateBlog,
                blogData,
                handleDeleteBlog,
                formData,
                setFormData,
                createPageFormData,
                handleChangeCreatePage,
                handleSubmitCreatePage,
                pageData,
                handleDeletePage,
                createDestinationsFormData,
                handleChangeCreateDestinations,
                handleSubmitCreateDestinations,
                destinationsData,
                handleDeleteDestinations,
                uploadingHero,
                 setUploadingHero

                }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

