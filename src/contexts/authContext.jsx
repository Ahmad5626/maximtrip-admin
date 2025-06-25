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
        rating : '0 star',
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
        
      });
      const [uploadingHero, setUploadingHero] = useState(false)
    const [createCategoryFormData, setCreateCategoryFormData]=useState(initialCreateCategoryData)
    const [createBlogFormData, setCreateBlogFormData]=useState(initialCreateBlogData)
    const [createDestinationsFormData, setCreateDestinationsFormData]=useState(initialCreateBlogData)
    const [createPageFormData, setCreatePageFormData]=useState(initialCreateBlogData)

 async function getData(){
         try{
           const response=await fetch(`${baseApi}/v1/api/get-enquiry`)
           const data=await response.json()
          
          
           setAllUserData(data.data)
         }catch(err){
           console.log(err)
         }
        }

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
     getData()
    }

  } catch (err) {
    console.log(err); // ✅ catches any fetch errors
  }finally {
    getData()
  }
};
   




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
 
 const getPackegesData=async()=>{
          const data= await fetch(`${baseApi}/v1/api/get-packeges`)
          if(data){
            const res=await data.json()
            setPackegesData(res.data)
            
          }
        }
const handleSubmitCreatePackeges=async()=>{
 
  const data =await createPackeges(formData)
 try {
   if(data.success){
    toast.success("Packeges Created successfully");
    getPackegesData()
  }
  else{
    toast.error("Packeges update failed");
    console.log(data);
    
  }
 } catch (error) {
  
 }finally{
  getPackegesData()
 }
}


  const handleDeletePackeges=async(id)=>{
          const data=await deletePackeges(id)
        try {
            if(data.success){
            toast.success("Packeges deleted successfully");
            getPackegesData()
          }
          else{
            toast.error("Packeges deletion failed");
            console.log(data);
            
          }
        } catch (error) {
          
        }finally{
          getPackegesData()
         }}
        

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
 
 const getCategoryData=async()=>{
          const data= await fetch(`${baseApi}/v1/api/get-category`)
          if(data){
            const res=await data.json()
            setCategoryData(res.data)
            
          }
        }
const handleSubmitCreateCategory=async(e)=>{
  e.preventDefault();
  const data =await createCategory(createCategoryFormData)
  try {
    if(data.success){
 toast.success("Category Created successfully");
 getCategoryData()
  }
  else{
    toast.error("Category update failed");
    console.log(data);
    
  }
  } catch (error) {
    
  }finally{
    getCategoryData()
  }
}

const handleDeletecategory=async(id)=>{
 const data=await deleteCategory(id)
try {
   if(data.success){
  toast.success("Category deleted successfully");
  getCategoryData()
}
else{
  toast.error("Category deletion failed");
  console.log(data);
  
}
} catch (error) {
  
}finally{
  getCategoryData()
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
   
const getBlogData=async()=>{
  const data= await getBlog()
  if(data){
    
    setBlogData(data.data)
    
  }
}
const handleSubmitCreateBlog=async(e)=>{
  e.preventDefault();
  const data =await createBlog(createBlogFormData)
try {
    if(data.success){
    toast.success("Blog Created successfully");
    getBlogData()
  }
  else{
    toast.error("Blog update failed");
    console.log(data);
    
  }
} catch (error) {
  
}finally{
  getBlogData()
}
}


   
const handleDeleteBlog=async(id)=>{
  const isConfirmed = window.confirm("Are you sure you want to delete this destinations? This action cannot be undone.")
  if(isConfirmed){
    
    const data=await deleteBlog(id)
  }
 try {
   if(data.success){
    toast.success("Blog deleted successfully");
    getBlogData()
  }
  else{
    toast.error("Blog deletion failed");
    console.log(data);
    
  }
 } catch (error) {
  
 }finally{
  getBlogData()
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
  const getDestinationsData=async()=>{
  const data= await getDestinations()
  if(data){
    
    setDestinationsData(data.data)
    
  }
}       
const handleSubmitCreateDestinations=async(e)=>{
  e.preventDefault();
  const data =await createDestinations(createDestinationsFormData)
 try {
   if(data.success){
    toast.success("destinations Created successfully");
    getDestinationsData()
  }
  else{
    toast.error("destinations update failed");
    console.log(data);
    
  }
 } catch (error) {
  
 }finally{
  getDestinationsData()
 }
}


   
const handleDeleteDestinations=async(id)=>{
  const isConfirmed = window.confirm("Are you sure you want to delete this destinations? This action cannot be undone.")

  if (isConfirmed) {
    const data=await deleteDestinations(id)
  }
  
try {
    if(data.success){
    toast.success("destinations deleted successfully");
    getDestinationsData()
  }
  else{
    toast.error("destinations deletion failed");
    console.log(data);
    
  }
} catch (error) {
  
}finally{
  getDestinationsData()
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
    
const getPageData=async()=>{
  const data= await getPage()
  if(data){
    
    setPageData(data.data)
    
  }
}
const handleSubmitCreatePage=async(e)=>{
  e.preventDefault();
  const data =await createPage(createPageFormData)
try {
    if(data.success){
    toast.success("Page Created successfully");
    getPageData()
  }
  else{
    toast.error("Page update failed");
    console.log(data);
    
  }
} catch (error) {
  
}finally{
  getPageData()
}
}


   
const handleDeletePage=async(id)=>{
   const isConfirmed = window.confirm("Are you sure you want to delete this Page? This action cannot be undone.")
if(isConfirmed){
  
  const data=await deletePage(id)
}
 try {
   if(data.success){
    toast.success("Page deleted successfully");
    getPageData()
  }
  else{
    toast.error("Page deletion failed");
    console.log(data);
    
  }
 } catch (error) {
  
 }finally{
  getPageData()
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

