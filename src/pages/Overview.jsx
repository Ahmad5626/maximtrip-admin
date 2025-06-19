import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/authContext";
import { useEffect } from "react";

function Overview() {
  const [role, setrole] = useState();
useEffect(() => {
 

    if(!localStorage.getItem('role')){
        window.location.href = "/";
    }
    const roledata= localStorage.getItem('role')

    setrole(roledata)
},[])
 

    
    function handleSideBar2(){
        localStorage.removeItem('role')
    }

 

    return (
        <>
            <main>
            {/* admin */}
                {role == "admin" &&
                    <>
                <div className="drawer lg:drawer-open ">
                    <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
                    <div className="drawer-content ">
                        <div className="lg:pt-5 md:pt-5 sm:pt-5 pt-3 mb-3">
                            <div className="customContainer py-2 flex items-center lg:justify-end justify-between">
                                <div className="flex gap-4 items-center">
                                   
                                    <Link to={'/'} className="lg:hidden block bg-white p-1 h-14 w-14 rounded-[100vh] overflow-hidden lg:order-2 order-1">
                                        <img className="w-full h-full object-cover" src="/img/maximtrip-logo.png" alt="" />
                                    </Link>
                                    <label htmlFor="my-drawer-2" className="drawer-button lg:hidden w-[36px] cursor-pointer">
                                    <img src="/img/bars.svg" alt="" />
                                </label>
                                   
                                </div>
                               
                            </div>
                        </div>
                        <Outlet />
                    </div>
                    <div className="drawer-side h-fit ">
                        <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
                        <ul className="menu py-4 px-2 w-[240px] bg-[#ce3c3d] h-[100dvh] lg:h-[100dvh] text-white text-[15px]">
                            <li>
                                <img src="/img/maximtrip-logo.png" className="w-48 h-32 object-contain" alt="" />
                            </li>
                            <div className="ml-4">
                                <p className="font-semibold text-md tracking-widest mb-2">Dashboard</p>
                            </div>
                            <li className="hover:translate-x-2 duration-200 "><NavLink to={'/overview/home'}  className="text-md">
                              <i className=" fa-solid fa-user me-1 font-sm text-"></i>All Enquiries</NavLink>
                            </li>
                            <li className="hover:translate-x-2 duration-200 "><NavLink to={'/overview/campaigns'}  className="text-md">
                                <i className="fa-solid fa-home me-1 font-sm text-gray-100"></i>Packeges </NavLink>
                            </li>
                             <li className="hover:translate-x-2 duration-200 "><NavLink to={'/overview/createpackeges'}  className="text-md">
                                <i className="fa-solid fa-plus me-1 font-sm text-gray-100"></i>Create Packeges</NavLink>
                            </li>
                             <li className="hover:translate-x-2 duration-200 "><NavLink to={'/overview/createcategory'}  className="text-md">
                                <i className="fa-solid fa-plus me-1 font-sm text-gray-100"></i>Category </NavLink>
                            </li>

                            <li className="hover:translate-x-2 duration-200 "><NavLink to={'/overview/destinations'}  className="text-md">
                                <i className="fa-solid fa-plus me-1 font-sm text-gray-100"></i> Destinations </NavLink>
                            </li>
                             <li className="hover:translate-x-2 duration-200 "><NavLink to={'/overview/Createblogs'}  className="text-md">
                                <i className="fa-solid fa-plus me-1 font-sm text-gray-100"></i>Blogs </NavLink>
                            </li>
                            <li className="hover:translate-x-2 duration-200 "><NavLink to={'/overview/createpage'}  className="text-md">
                                <i className="fa-solid fa-plus me-1 font-sm text-gray-100"></i>Add Pages </NavLink>
                            </li>
                           
                           <li className="hover:translate-x-2 duration-200"><NavLink to={'/'} onClick={handleSideBar2}  className="text-md font-semibold">
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
                                   
                                   
                                    
                                </div>
                            
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
                           
                            
                           
                           
                            {/* <li className="hover:translate-x-2 duration-200 "><NavLink to={'/overview/pastclass'}  className="text-md">
                                <i className="fa-solid fa-plus me-1 font-sm text-gray-100"></i>Past Class</NavLink>
                            </li> */}
                            <li className="hover:translate-x-2 duration-200 "><NavLink to={'/overview/shedule'}  className="text-md">
                                <i className="fa-solid fa-plus me-1 font-sm text-gray-100"></i>Schedule class</NavLink>
                            </li>



                            <li className="hover:translate-x-2 duration-200 "><NavLink to={'/overview/help'}  className="text-md">
                                <i className="fa-solid fa-plus me-1 font-sm text-gray-100"></i>help</NavLink>
                            </li>
                            
                            <li className="hover:translate-x-2 duration-200"><NavLink to={'/overview/profile'}  className="text-md">
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
