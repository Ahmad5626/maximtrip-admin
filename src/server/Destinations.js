import { baseApi } from "../utils/constant";

export const createDestinations = async (formData) => {
    try {
        const data = await fetch(`${baseAPI}/v1/api/create-destination`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });
        const res = await data.json();
        return res;
    } catch (error) {
        return error;
    }
}

export const getDestinations = async () => {
    try {
        const data = await fetch(`${baseApi}/v1/api/get-destination`);
        const res = await data.json();
        return res;
    } catch (error) {
        return error;
    }
}
export const deleteDestinations = async (id) => {
    try {
        const data = await fetch(`${baseAPI}/v1/api/delete-Destination/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const res = await data.json();
        return res;
    } catch (error) {
        return error;
    }
}