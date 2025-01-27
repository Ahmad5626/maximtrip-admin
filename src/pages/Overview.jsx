import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/authContext";
import { useEffect } from "react";

function Overview() {
  const [role, setrole] = useState();
useEffect(() => {
    // localStorage.setItem('role',"student")  

    if(!localStorage.getItem('role')){
        window.location.href = "/login";
    }
    const roledata= localStorage.getItem('role')

    setrole(roledata)
},[])
 

    function handleSideBar() {
        document.getElementById("my-drawer-2").checked = false
    }
    function handleSideBar2(){
        localStorage.removeItem('role')
    }

    // function handleLogout() {
       
    //     navigate('/login');
    // }

    return (
        <>
            <main>
            {/* admin */}
                {role == "admin" &&
                    <>
                <div className="drawer lg:drawer-open">
                    <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
                    <div className="drawer-content">
                        <div className="lg:pt-5 md:pt-5 sm:pt-5 pt-3 mb-3">
                            <div className="customContainer py-2 flex items-center lg:justify-end justify-between">
                                <div className="flex gap-4 items-center">
                                    {/* <Link to={'/overview/editProfile'} className="lg:block hidden text-gray-600 text-md lg:order-1 order-2">
                                        <i className="fa-solid fa-gear"></i>
                                    </Link> */}
                                    {/* <Link to={'/overview/teacher'} className="lg:block hidden text-gray-600 text-lg lg:order-1 order-2 border-r pr-3">
                                        <i className="fa-solid fa-magnifying-glass"></i>
                                    </Link> */}
                                    <Link to={'/overview/profile'} className="lg:block hidden h-12 w-12 rounded-[100vh] overflow-hidden lg:order-2 order-1">
                                        <img className="w-full h-full object-cover" src="/" onError={(e) => e.target.src = "/img/default-avatar.jpg"} alt="" />
                                    </Link>
                                    <Link to={'/'} className="lg:hidden block bg-white p-1 h-14 w-14 rounded-[100vh] overflow-hidden lg:order-2 order-1">
                                        <img className="w-full h-full object-cover" src="/img/vyapar-logo.png" alt="" />
                                    </Link>
                                </div>
                                <label htmlFor="my-drawer-2" className="drawer-button lg:hidden w-[36px] cursor-pointer">
                                    <img src="/img/bars.svg" alt="" />
                                </label>
                            </div>
                        </div>
                        <Outlet />
                    </div>
                    <div className="drawer-side h-fit">
                        <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
                        <ul className="menu py-4 px-2 w-80 bg-gray-800 h-[100dvh] lg:h-[100dvh] text-gray-100">
                            <li>
                                <img src="/img/vyapar-logo.png" className="w-32 h-32 object-contain" alt="" />
                            </li>
                            <div className="ml-4">
                                <p className="font-semibold text-md tracking-widest mb-2">OVERVIEW</p>
                            </div>
                            <li className="hover:translate-x-2 duration-200 "><NavLink to={'/overview/home'} onClick={handleSideBar} className="text-md">
                                <i className="fa-solid fa-home me-1 font-sm text-gray-100"></i>Students</NavLink>
                            </li>
                            <li className="hover:translate-x-2 duration-200 "><NavLink to={'/overview/addDefaulter'} onClick={handleSideBar} className="text-md">
                                <i className="fa-solid fa-plus me-1 font-sm text-gray-100"></i>Add Teachers</NavLink>
                            </li>
                            <li className="hover:translate-x-2 duration-200 "><NavLink to={'/overview/teacher'} onClick={handleSideBar} className="text-md">
                                <img src="/img/fraud-icon.png" className="h-5" alt="" />
                               Teachers </NavLink>
                            </li>
                           
                            <li className="hover:translate-x-2 duration-200 "><NavLink to={'/overview/request'} onClick={handleSideBar} className="text-md">
                                <i className="fa-solid fa-plus me-1 font-sm text-gray-100"></i>Requset Class</NavLink>
                            </li>
                          


{/* 
                            <li className="hover:translate-x-2 duration-200 "><NavLink to={'/overview/help'} onClick={handleSideBar} className="text-md">
                                <i className="fa-solid fa-plus me-1 font-sm text-gray-100"></i>help</NavLink>
                            </li> */}
                            
                            
                            
                            <li className="hover:translate-x-2 duration-200"><NavLink to={'/login'} onClick={handleSideBar2}  className="text-md font-semibold">
                                <i className="fa-solid fa-right-from-bracket me-1 font-sm text-gray-100"></i>Logout</NavLink>
                            </li>
                        </ul>
                    </div>
                </div>
                </>
              
              }

                {/* user */}
                {role == "student" &&
                    <>
                <div className="drawer lg:drawer-open">
                    <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
                    <div className="drawer-content">
                        <div className="lg:pt-5 md:pt-5 sm:pt-5 pt-3 mb-3">
                            <div className="customContainer py-2 flex items-center lg:justify-end justify-between">
                                <div className="flex gap-4 items-center">
                                    {/* <Link to={'/overview/editProfile'} className="lg:block hidden text-gray-600 text-md lg:order-1 order-2">
                                        <i className="fa-solid fa-gear"></i>
                                    </Link> */}
                                    {/* <Link to={'/overview/teacher'} className="lg:block hidden text-gray-600 text-lg lg:order-1 order-2 border-r pr-3">
                                        <i className="fa-solid fa-magnifying-glass"></i>
                                    </Link> */}
                                    <Link to={'/overview/profile'} className="lg:block hidden h-12 w-12 rounded-[100vh] overflow-hidden lg:order-2 order-1">
                                        <img className="w-full h-full object-cover" src="/" onError={(e) => e.target.src = "/img/default-avatar.jpg"} alt="" />
                                    </Link>
                                    <Link to={'/'} className="lg:hidden block bg-white p-1 h-14 w-14 rounded-[100vh] overflow-hidden lg:order-2 order-1">
                                        <img className="w-full h-full object-cover" src="/img/vyapar-logo.png" alt="" />
                                    </Link>
                                </div>
                                <label htmlFor="my-drawer-2" className="drawer-button lg:hidden w-[36px] cursor-pointer">
                                    <img src="/img/bars.svg" alt="" />
                                </label>
                            </div>
                        </div>
                        <Outlet />
                    </div>
                    <div className="drawer-side h-fit">
                        <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
                        <ul className="menu py-4 px-2 w-80 bg-gray-800 h-[100dvh] lg:h-[100dvh] text-gray-100">
                            <li>
                                <img src="/img/vyapar-logo.png" className="w-32 h-32 object-contain" alt="" />
                            </li>
                            <div className="ml-4">
                                <p className="font-semibold text-md tracking-widest mb-2">OVERVIEW</p>
                            </div>
                           
                            
                           
                            <li className="hover:translate-x-2 duration-200 "><NavLink to={'/overview/shedule'} onClick={handleSideBar} className="text-md">
                                <i className="fa-solid fa-plus me-1 font-sm text-gray-100"></i>Schedule class</NavLink>
                            </li>
                            {/* <li className="hover:translate-x-2 duration-200 "><NavLink to={'/overview/pastclass'} onClick={handleSideBar} className="text-md">
                                <i className="fa-solid fa-plus me-1 font-sm text-gray-100"></i>Past Class</NavLink>
                            </li> */}



                            <li className="hover:translate-x-2 duration-200 "><NavLink to={'/overview/help'} onClick={handleSideBar} className="text-md">
                                <i className="fa-solid fa-plus me-1 font-sm text-gray-100"></i>help</NavLink>
                            </li>
                            
                            <li className="hover:translate-x-2 duration-200"><NavLink to={'/overview/profile'} onClick={handleSideBar} className="text-md">
                                <i className="fa-solid fa-user me-1 font-sm text-gray-100"></i>Profile</NavLink>
                            </li>
                            
                            <li className="hover:translate-x-2 duration-200"><NavLink to={'/login'} onClick={handleSideBar2}  className="text-md font-semibold">
                                <i className="fa-solid fa-right-from-bracket me-1 font-sm text-gray-100"></i>Logout</NavLink>
                            </li>
                        </ul>
                    </div>
                </div>
                </>
              }

                {/* tutor */}
                {role == "tutor" &&
                    <>
                <div className="drawer lg:drawer-open">
                    <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
                    <div className="drawer-content">
                        <div className="lg:pt-5 md:pt-5 sm:pt-5 pt-3 mb-3">
                            <div className="customContainer py-2 flex items-center lg:justify-end justify-between">
                                <div className="flex gap-4 items-center">
                                    {/* <Link to={'/overview/editProfile'} className="lg:block hidden text-gray-600 text-md lg:order-1 order-2">
                                        <i className="fa-solid fa-gear"></i>
                                    </Link> */}
                                    {/* <Link to={'/overview/teacher'} className="lg:block hidden text-gray-600 text-lg lg:order-1 order-2 border-r pr-3">
                                        <i className="fa-solid fa-magnifying-glass"></i>
                                    </Link> */}
                                    <Link to={'/overview/profile'} className="lg:block hidden h-12 w-12 rounded-[100vh] overflow-hidden lg:order-2 order-1">
                                        <img className="w-full h-full object-cover" src="/" onError={(e) => e.target.src = "/img/default-avatar.jpg"} alt="" />
                                    </Link>
                                    <Link to={'/'} className="lg:hidden block bg-white p-1 h-14 w-14 rounded-[100vh] overflow-hidden lg:order-2 order-1">
                                        <img className="w-full h-full object-cover" src="/img/vyapar-logo.png" alt="" />
                                    </Link>
                                </div>
                                <label htmlFor="my-drawer-2" className="drawer-button lg:hidden w-[36px] cursor-pointer">
                                    <img src="/img/bars.svg" alt="" />
                                </label>
                            </div>
                        </div>
                        <Outlet />
                    </div>
                    <div className="drawer-side h-fit">
                        <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
                        <ul className="menu py-4 px-2 w-80 bg-gray-800 h-[100dvh] lg:h-[100dvh] text-gray-100">
                            <li>
                                <img src="/img/vyapar-logo.png" className="w-32 h-32 object-contain" alt="" />
                            </li>
                            <div className="ml-4">
                                <p className="font-semibold text-md tracking-widest mb-2">OVERVIEW</p>
                            </div>
                           
                            
                           
                            <li className="hover:translate-x-2 duration-200 "><NavLink to={'/overview/upcommingclass'} onClick={handleSideBar} className="text-md">
                                <i className="fa-solid fa-plus me-1 font-sm text-gray-100"></i>Upcomming Class</NavLink>
                            </li>
                            {/* <li className="hover:translate-x-2 duration-200 "><NavLink to={'/overview/pastclass'} onClick={handleSideBar} className="text-md">
                                <i className="fa-solid fa-plus me-1 font-sm text-gray-100"></i>Past Class</NavLink>
                            </li> */}
                            <li className="hover:translate-x-2 duration-200 "><NavLink to={'/overview/shedule'} onClick={handleSideBar} className="text-md">
                                <i className="fa-solid fa-plus me-1 font-sm text-gray-100"></i>Schedule class</NavLink>
                            </li>



                            <li className="hover:translate-x-2 duration-200 "><NavLink to={'/overview/help'} onClick={handleSideBar} className="text-md">
                                <i className="fa-solid fa-plus me-1 font-sm text-gray-100"></i>help</NavLink>
                            </li>
                            
                            <li className="hover:translate-x-2 duration-200"><NavLink to={'/overview/profile'} onClick={handleSideBar} className="text-md">
                                <i className="fa-solid fa-user me-1 font-sm text-gray-100"></i>Profile</NavLink>
                            </li>
                            
                            <li className="hover:translate-x-2 duration-200"><NavLink to={'/login'} onClick={handleSideBar2}  className="text-md font-semibold">
                                <i className="fa-solid fa-right-from-bracket me-1 font-sm text-gray-100"></i>Logout</NavLink>
                            </li>
                        </ul>
                    </div>
                </div>
                </>
              }
            </main>
        </>
    )
}

export default Overview
