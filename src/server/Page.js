
import { baseAPI } from "../utils";
export const createPage = async (formData) => {
    try {
        const data = await fetch(`${baseAPI}/v1/api/create-page`, {
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

export const getPage = async () => {
    try {
        const data = await fetch(`${baseAPI}/v1/api/get-page`);
        const res = await data.json();
        return res;
    } catch (error) {
        return error;
    }
}
export const deletePage = async (id) => {
    try {
        const data = await fetch(`${baseAPI}/v1/api/delete-page/${id}`, {
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