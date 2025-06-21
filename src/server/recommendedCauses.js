import { baseApi } from "../utils/constant";

export const createRecommendedCauses = async (data) => {
    try {
        const response = await fetch(`${baseApi}/v1/api/recommendedCauses/create-recommended-couses`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        const responseData = await response.json();
        
        return responseData
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getAllRecommendedCauses=async()=>{
 try {
    const res=await fetch(`${baseAPI}/v1/api/recommendedCauses/get-recommended-couses`,{
     method:"GET",
     headers:{
       "Content-Type": "application/json",
     }
    })
    const data=await res.json();
    console.log(data);
    
    return data

 } catch (error) {
    console.log(error);
    return error
    
 }
  
 
}
export const updateRecommendedCauses=async(id,data)=>{
    try {
        const res=await fetch(`${baseAPI}/v1/api/recommendedCauses/update-inspiring-institutes/${id}`,{
            method:"PUT",
            headers:{
                "Content-Type": "application/json",
            },
            body:JSON.stringify(data)
        })
        const data=await res.json();
        return data
    } catch (error) {
        console.log(error);
        return error
        
    }
}
export const deleteRecommendedCauses=async(id)=>{
    try {
        const res=await fetch(`${baseAPI}/v1/api/recommendedCauses/delete-recommended-couses/${id}`,{
            method:"DELETE",
            headers:{
                "Content-Type": "application/json",
            }
        })
        const data=await res.json();
        return data
    } catch (error) {
        console.log(error);
        return error
        
    }
}
// export default {createRecommendedCauses,getAllRecommendedCauses}