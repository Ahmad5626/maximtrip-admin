import { baseApi } from "../utils/constant";

export const createBlog = async (formData) => {
    try {
        const data = await fetch(`${baseApi}/v1/api/create-blog`, {
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

export const getBlog = async () => {
    try {
        const data = await fetch(`${baseApi}/v1/api/get-blog`);
        const res = await data.json();
        return res;
    } catch (error) {
        return error;
    }
}
export const deleteBlog = async (id) => {
    try {
        const data = await fetch(`${baseApi}/v1/api/delete-blog/${id}`, {
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