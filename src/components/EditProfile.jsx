import { useEffect, useState } from "react";
import { useAuth } from "../contexts/authContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, Toaster } from "sonner";
import Loader from "./Loader/Loader";
import { City, State } from "country-state-city";

function EditProfile() {
    const { userData, refreshUserData, userLoading } = useAuth();
    const [states, setStates] = useState([])
    const [cities, setCities] = useState([]);
    const [initialValues, setInitialValues] = useState({});
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        user_name: '',
        mobile_no: '',
        address: '',
        firm_name: '',
        gst_no: '',
        pan_no: '',
    });
    const id = localStorage.getItem('userId');
    const navigate = useNavigate();

    useEffect(() => {
        setFormData({
            user_name: userData.user_name,
            mobile_no: userData.mobile_no,
            address: userData.address,
            firm_name: userData.firm_name,
            gst_no: userData.gst_no,
            pan_no: userData.pan_no,
        });
        setInitialValues({
            user_name: userData.user_name,
            mobile_no: userData.mobile_no,
            address: userData.address,
            firm_name: userData.firm_name,
            gst_no: userData.gst_no,
            pan_no: userData.pan_no,
        });
        const fetchStates = () => {
            const statesList = State.getStatesOfCountry("IN")
            setStates(statesList);
        };
        fetchStates()
    }, [userData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    const isFormChanged = JSON.stringify(initialValues) == JSON.stringify(formData);
    const finalData = { ...formData, user_id: id };

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        if (isFormChanged) {
            toast.error("No changes made", { description: "Please make changes before saving" }, { duration: 3000 });
            setLoading(false);
            return
        }
        try {
            await axios.post(`${import.meta.env.VITE_BASE_URL}/userEditById/${id}`, finalData).then(res => {
                if (res.data.status) {
                    toast.success("Profile updated successfully", { duration: 3000 });
                    setLoading(false);
                    navigate('/overview/profile')
                    refreshUserData();
                }
            })
        } catch (error) {
            console.log(error)
            setLoading(false);
        }
    };

    const handleStateChange = (event) => {
        const stateCode = event.target.value;
        fetchCities(stateCode);
    };

    const fetchCities = (stateCode) => {
        const citiesList = City.getCitiesOfState("IN", stateCode);
        setCities(citiesList);
    };

    return (
        <>
            <section className="my-4">
                <Toaster position="top-right" />
                {userLoading && <Loader />}
                <form className="customContainer bg-white p-5 rounded-lg mx-auto shadow-sm" >
                    <div className="flex items-center gap-2 border-b pb-3">
                        <button type="button" onClick={() => navigate('/overview/profile')}><i className="fa-solid fa-angle-left text-sm"></i></button>
                        <h2 className="flex items-center gap-2 text-2xl font-semibold border-neutral-200">
                            Edit Profile
                        </h2>
                    </div>
                    <div className='space-y-3 my-4'>
                        <div className="w-full flex flex-col gap-2">
                            <label className="font-semibold text-xs text-gray-500 ">Full Name</label>
                            <input type="text" className="border rounded-lg px-3 py-2 text-sm w-full outline-none border-gray-200 bg-gray-100" placeholder="John Doe" name="user_name" onChange={e => handleInputChange(e)} value={formData.user_name} />
                        </div>
                        <div className="w-full flex flex-col gap-2">
                            <label className="font-semibold text-xs text-gray-500 ">Mobile</label>
                            <input type="number" className="border rounded-lg px-3 py-2 text-sm w-full outline-none border-gray-200 bg-gray-100" placeholder="9876543210" name="mobile_no" onChange={e => handleInputChange(e)} value={formData.mobile_no} />
                        </div>
                        <div className="w-full flex flex-col gap-2">
                            <label className="font-semibold text-xs text-gray-500 ">Address</label>
                            <input type="text" className="border rounded-lg px-3 py-2 text-sm w-full outline-none border-gray-200 bg-gray-100" name="mobile_no" onChange={e => handleInputChange(e)} value={formData.address} />
                        </div>
                        <div className="w-full flex flex-col gap-2">
                            <label className="font-semibold text-xs text-gray-500 ">State</label>
                            <select className="border rounded-lg px-3 py-2 text-black text-sm outline-none border-gray-200 bg-gray-100 w-full" name="state" onChange={(e) => handleStateChange(e)}>
                                <option hidden>Select State</option>
                                {states.map((state, index) => <option value={state.isoCode} key={index}>{state.name}</option>)}
                            </select>
                        </div>
                        <div className="w-full flex flex-col gap-2">
                            <label className="font-semibold text-xs text-gray-500 ">City</label>
                            <select className="border rounded-lg px-3 py-2 text-black text-sm outline-none border-gray-200 bg-gray-100 w-full" name="city">
                                <option hidden>Select City</option>
                                {cities.length === 0
                                    ? <option disabled>Select State first</option>
                                    : cities.map((city, index) => <option value={city.isoCode} key={index}>{city.name}</option>)
                                }
                            </select>
                        </div>
                    </div>
                    <hr />
                    <div className='space-y-3 my-4'>
                        <div className="w-full flex flex-col gap-2">
                            <label className="font-semibold text-xs text-gray-500 ">Firm Name</label>
                            <input type="text" className="border rounded-lg px-3 py-2 text-sm w-full outline-none border-gray-200 bg-gray-100" placeholder="Company name" name="firm_name" onChange={e => handleInputChange(e)} value={formData.firm_name} />
                        </div>
                        <div className="w-full flex flex-col gap-2">
                            <label className="font-semibold text-xs text-gray-500 ">GST No.</label>
                            <input type="text" className="border rounded-lg px-3 py-2 text-sm w-full outline-none border-gray-200 bg-gray-100" placeholder="789456123456" name="gst_no" onChange={e => handleInputChange(e)} value={formData.gst_no} />
                        </div>
                        <div className="w-full flex flex-col gap-2">
                            <label className="font-semibold text-xs text-gray-500 ">PAN Card No.</label>
                            <input type="text" className="border rounded-lg px-3 py-2 text-sm w-full outline-none border-gray-200 bg-gray-100" placeholder="DSKPA123456" name="pan_no" onChange={e => handleInputChange(e)} value={formData.pan_no} />
                        </div>
                    </div>
                    <div className='mt-4'>
                        <button type="submit" className='lg:w-auto md:w-auto w-full flex items-center justify-center bg-blueClr text-white p-2 px-5 rounded-lg font-semibold text-sm' disabled={loading} onClick={handleSubmit}>
                            {loading
                                ? <l-mirage size="86" speed="4" color="white"></l-mirage>
                                : "SAVE & UPDATE"}
                        </button>
                    </div>
                </form>
            </section>
        </>
    )
}

export default EditProfile
