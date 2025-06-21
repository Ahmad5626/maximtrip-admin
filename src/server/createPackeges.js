import { baseApi } from "../utils/constant";

export const createPackeges = async (data) => {
    try {
        const response = await fetch(`${baseApi}/v1/api/create-packeges`, {
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

export const deletePackeges = async (id) => {
    try {
        const response = await fetch(`${baseAPI}/v1/api/delete-packeges/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const responseData = await response.json();
        
        return responseData
    } catch (error) {
        console.error(error);
        throw error;
    }
};
