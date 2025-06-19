import { useEffect, useState } from "react";
import { useAuth } from "../contexts/authContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, Toaster } from "sonner";
import Loader from "./Loader/Loader";
import { City, State } from "country-state-city";

function RecommendedCauses() {
    const {buttonData,handleChange,updateHandlesubmit}=useAuth()
   
    return (
        <>
            <section className="my-4">
                <Toaster position="top-center" />
             
                <form className="customContainer bg-white p-5 rounded-lg mx-auto shadow-sm" onSubmit={updateHandlesubmit}>
                    <div className="flex items-center gap-2 border-b pb-3">
                        <button type="button" ><i className="fa-solid fa-angle-left text-sm"></i></button>
                        <h2 className="flex items-center gap-2 text-2xl font-semibold border-neutral-200">
                            Recommended causes
                        </h2>
                    </div>
                    <div className='space-y-3 my-4'>
                        <div className="w-full flex flex-col gap-2">
                            <label className="font-semibold text-xs text-gray-500 ">livelihoodforUlama</label>
                            <input type="text" className="border rounded-lg px-3 py-2 text-sm w-full outline-none border-gray-200 bg-gray-100" placeholder="https://www.google.com" name="livelihoodforUlama"
                            value={buttonData.heroSectionButton}
                            onChange={handleChange} />
                        </div>
                        <div className="w-full flex flex-col gap-2">
                            <label className="font-semibold text-xs text-gray-500 ">constructionSupportforMadrasas</label>
                            <input type="text" className="border rounded-lg px-3 py-2 text-sm w-full outline-none border-gray-200 bg-gray-100" placeholder="https://www.google.com" name="honorTheirButton"
                            value={buttonData.honorTheirButton}
                            onChange={handleChange}  />
                        </div>
                        <div className="w-full flex flex-col gap-2">
                            <label className="font-semibold text-xs text-gray-500 ">studentEducation</label>
                            <input type="text" className="border rounded-lg px-3 py-2 text-sm w-full outline-none border-gray-200 bg-gray-100" placeholder="https://www.google.com" name="fundraiseWithFaithButton"
                            value={buttonData.fundraiseWithFaithButton} onChange={handleChange} />
                        </div>
                        <div className="w-full flex flex-col gap-2">
                            <label className="font-semibold text-xs text-gray-500 ">helpPoor</label>
                            <input type="text" className="border rounded-lg px-3 py-2 text-sm w-full outline-none border-gray-200 bg-gray-100" placeholder="https://www.google.com" name="fundraiseWithFaithButton"
                            value={buttonData.fundraiseWithFaithButton} onChange={handleChange} />
                        </div>
                        <div className="w-full flex flex-col gap-2">
                            <label className="font-semibold text-xs text-gray-500 ">helpOrphans</label>
                            <input type="text" className="border rounded-lg px-3 py-2 text-sm w-full outline-none border-gray-200 bg-gray-100" placeholder="https://www.google.com" name="fundraiseWithFaithButton"
                            value={buttonData.fundraiseWithFaithButton} onChange={handleChange} />
                        </div>
                        <div className="w-full flex flex-col gap-2">
                            <label className="font-semibold text-xs text-gray-500 ">medicalRelief</label>
                            <input type="text" className="border rounded-lg px-3 py-2 text-sm w-full outline-none border-gray-200 bg-gray-100" placeholder="https://www.google.com" name="fundraiseWithFaithButton"
                            value={buttonData.fundraiseWithFaithButton} onChange={handleChange} />
                        </div>
                        <div className="w-full flex flex-col gap-2">
                            <label className="font-semibold text-xs text-gray-500 ">constructionSupportforMasjids</label>
                            <input type="text" className="border rounded-lg px-3 py-2 text-sm w-full outline-none border-gray-200 bg-gray-100" placeholder="https://www.google.com" name="fundraiseWithFaithButton"
                            value={buttonData.fundraiseWithFaithButton} onChange={handleChange} />
                        </div>
                       
                        
                    </div>
                 
                    <div className='mt-4'>
                        <button type="submit" className='px-8 py-3 bg-gradient-to-r from-amber-500 to-yellow-400 text-white font-medium rounded-full hover:shadow-lg transition-all duration-300 hover:from-amber-600 hover:to-yellow-500  text-white p-2 px-5 rounded-lg font-semibold text-sm' >
                           SAVE & UPDATE
                        </button>
                    </div>
                </form>
            </section>
        </>
    )
}

export default RecommendedCauses
