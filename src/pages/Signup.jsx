import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast, Toaster } from "sonner"
import axios from "axios"
import { City, State } from "country-state-city"

function Signup() {
    const [loading, setLoading] = useState(false)
    const [number, setNumber] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [confirmPassword, setConfirmPassword] = useState('')
    const [states, setStates] = useState([])
    const [cities, setCities] = useState([]);
    const navigate = useNavigate()

    useEffect(() => {
        document.title = "Signup | Vyapar Score"
        const fetchStates = () => {
            const statesList = State.getStatesOfCountry("IN")
            setStates(statesList);
        };
        fetchStates()
    }, [])


    const handleNumber = (e) => {
        const input = e.target.value;
        if (/^\d{0,10}$/.test(input)) {
            setNumber(input);
        }
    };

    async function handleSubmit(e) {
        e.preventDefault()
        setLoading(true)
        const formData = new FormData(e.target)
        const data = Object.fromEntries(formData)
        if (data.mobile_no.length !== 10) {
            setLoading(false)
            toast.error('Please enter a valid mobile number!', { duration: 3000 })
            return
        }

        if (data.password.length < 8) {
            setLoading(false)
            toast.error('Password must be at least 8 characters long!', { duration: 3000 })
            return
        }

        if (data.password !== confirmPassword) {
            setLoading(false)
            toast.error('Password does not match!', { description: 'Please type your password correctly' }, { duration: 3000 })
            return
        }

        try {
            await axios.post(`${import.meta.env.VITE_BASE_URL}/register`, data).then(res => {
                console.log(res.data)
                if (res.data.status) {
                    setLoading(false)
                    navigate('/login', { state: { signedUp: 1, email: data.email } })
                }
            })
        } catch (error) {
            console.error('Error:', error.response ? error.response.data : error.message);
            if (error.response.data.msg === "All field are Required") {
                setLoading(false)
                toast.error('All fields are required!', { description: 'Please fill up all the related fields' }, { duration: 3000 })
            } else if (error.response.data.msg === "Email already Exists Please Try another email") {
                setLoading(false)
                toast.error('User Already Exists!', { description: 'Please Log in to continue or try another email' }, { duration: 3000 })
            }
        }
    }

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
            <main className="bg-[url('/img/login-cover.svg')] bg-cover bg-center grid place-items-center h-full">
                <Toaster position="top-center" />
                <div className="lg:w-[50%] md:w-[75%] sm:w-[85%] w-[95%] mx-auto my-5 bg-gray-800 border border-gray-700 bg-opacity-70 backdrop-blur-lg lg:p-6 md:p-5 p-4 rounded-xl">
                    <h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl text-white">
                        <img className="w-16 h-16 mr-2 object-contain" src="/img/vyapar-logo.png" alt="logo" />
                        Create an account
                    </h1>
                    <form onSubmit={handleSubmit}>
                        <div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-x-4 mt-5" >
                            <div>
                                <div className="w-full flex flex-col gap-2">
                                    <label className="font-semibold text-xs text-white tracking-wide ">Full Name</label>
                                    <input type="text" className="border rounded-lg px-3 py-2 mb-4 text-white text-sm w-full outline-none border-gray-600 bg-gray-600 bg-opacity-40 placeholder:text-gray-400" placeholder="John Doe" name="user_name" />
                                </div>
                                <div className="w-full flex flex-col gap-2">
                                    <label className="font-semibold text-xs text-white tracking-wide ">Mobile</label>
                                    <input type="number" className="border rounded-lg px-3 py-2 mb-4 text-white text-sm w-full outline-none border-gray-600 bg-gray-600 bg-opacity-40 placeholder:text-gray-400" placeholder="9876543210" name="mobile_no" value={number} onChange={handleNumber} maxLength="10" />
                                </div>
                                <div className="w-full flex flex-col gap-2">
                                    <label className="font-semibold text-xs text-white tracking-wide ">Email</label>
                                    <input type="email" className="border rounded-lg px-3 py-2 mb-4 text-white text-sm w-full outline-none border-gray-600 bg-gray-600 bg-opacity-40 placeholder:text-gray-400" placeholder="example@mail.com" name="email" />
                                </div>
                                <div className="w-full flex flex-col gap-2">
                                    <label className="font-semibold text-xs text-white tracking-wide ">Password</label>
                                    <div className="flex items-center w-full mb-4 border border-gray-600 bg-gray-600 bg-opacity-40 placeholder:text-gray-400 rounded-lg px-3 py-2">
                                        <input type={showPassword ? "text" : "password"} className="bg-transparent text-white text-sm outline-none flex-1" placeholder="••••••••" name="password" />
                                        <button type="button" className="text-white tracking-wide text-sm" onClick={() => setShowPassword(!showPassword)}>
                                            {showPassword ? <i className="fa-regular fa-eye-slash"></i> : <i className="fa-regular fa-eye"></i>}
                                        </button>
                                    </div>
                                </div>
                                <div className="w-full flex flex-col gap-2">
                                    <label className="font-semibold text-xs text-white tracking-wide ">Confirm Password</label>
                                    <input type="password" className="border rounded-lg px-3 py-2 mb-4 text-white text-sm w-full outline-none border-gray-600 bg-gray-600 bg-opacity-40 placeholder:text-gray-400" placeholder="••••••••" onChange={(e) => setConfirmPassword(e.target.value)} />
                                </div>
                            </div>
                            <div>
                                <div className="w-full flex flex-col gap-2">
                                    <label className="font-semibold text-xs text-white tracking-wide ">Country</label>
                                    <select className="border rounded-lg px-3 py-2 mb-4 text-white text-sm outline-none border-gray-600 bg-gray-600 bg-opacity-40 w-full" name="country" disabled>
                                        <option value={"india"}>India</option>
                                    </select>
                                </div>
                                <div className="w-full flex flex-col gap-2">
                                    <label className="font-semibold text-xs text-white tracking-wide ">State</label>
                                    <select className="border rounded-lg px-3 py-2 mb-4 text-white text-sm outline-none border-gray-600 bg-gray-600 bg-opacity-40 w-full" name="state" onChange={(e) => handleStateChange(e)}>
                                        <option hidden>Select State</option>
                                        {states.map((state, index) => <option value={state.isoCode} key={index}>{state.name}</option>)}
                                    </select>
                                </div>
                                <div className="w-full flex flex-col gap-2">
                                    <label className="font-semibold text-xs text-white tracking-wide ">City/District</label>
                                    <select className="border rounded-lg px-3 py-2 mb-4 text-white text-sm outline-none border-gray-600 bg-gray-600 bg-opacity-40 w-full" name="city">
                                        <option hidden>Select City</option>
                                        {cities.length === 0
                                            ? <option disabled>Select State first</option>
                                            : cities.map((city, index) => <option value={city.isoCode} key={index}>{city.name}</option>)
                                        }
                                    </select>
                                </div>
                                <div className="w-full flex flex-col gap-2">
                                    <label className="font-semibold text-xs text-white tracking-wide ">Firm Name</label>
                                    <input type="text" className="border rounded-lg px-3 py-2 mb-4 text-white text-sm w-full outline-none border-gray-600 bg-gray-600 bg-opacity-40 placeholder:text-gray-400" placeholder="Organization" name="firm_name" />
                                </div>
                                <div className="w-full flex flex-col gap-2">
                                    <label className="font-semibold text-xs text-white tracking-wide ">GST No.</label>
                                    <input className="border rounded-lg px-3 py-2 mb-4 text-white text-sm w-full outline-none border-gray-600 bg-gray-600 bg-opacity-40 placeholder:text-gray-400" placeholder="" name="gst_no" />
                                </div>
                                <div className="w-full flex flex-col gap-2">
                                    <label className="font-semibold text-xs text-white tracking-wide ">PAN Card No.</label>
                                    <input type="text" className="border rounded-lg px-3 py-2 mb-4 text-white text-sm w-full outline-none border-gray-600 bg-gray-600 bg-opacity-40 placeholder:text-gray-400" placeholder="" name="pan_no" />
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center mb-2">
                                <div>
                                    <input id="terms" aria-describedby="terms" type="checkbox" required className="w-3 h-3 border rounded bg-gray-700 border-gray-600" />
                                </div>
                                <div className="ml-2 text-xs">
                                    <label htmlFor="terms" className="font-light text-gray-300">I accept the <a className="font-medium text-primary-600 hover:underline text-white" href="#">Terms and Conditions</a></label>
                                </div>
                            </div>
                            <button type="submit" className="flex justify-center w-full text-sm text-white bg-blueClr hover:bg-primary-700 focus:outline-none font-semibold rounded-lg px-5 py-2 text-center hover:bg-primary-700">
                                {loading ? <l-mirage
                                    size="80"
                                    speed="4"
                                    color="white"
                                ></l-mirage> : 'SIGN UP'}
                            </button>
                            <p className="text-xs font-extralight text-white tracking-wide mt-3">
                                Already have an account? <Link to="/login" className="font-semibold text-blueClr hover:underline">Login </Link>
                                here!
                            </p>
                        </div>
                    </form>
                </div>
            </main>
        </>
    )
}

export default Signup
