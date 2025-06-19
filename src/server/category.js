const baseAPI = "http://localhost:7000";

export const createCategory = async (data) => {
    try {
        const response = await fetch(`${baseAPI}/v1/api/create-category`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const deleteCategory = async (id) => {
    try {
        const response = await fetch(`${baseAPI}/v1/api/delete-category/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error(error);
        throw error;
    }
};