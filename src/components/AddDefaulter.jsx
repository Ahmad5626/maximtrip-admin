import axios from "axios";
import { toast, Toaster } from "sonner";
import { useEffect, useState } from "react";
import { Country, State, City } from "country-state-city";
import { useAuth } from "../contexts/authContext";

function AddDefaulter() {

const {handleChange,tutordata,tutorCreate}=useAuth()
 
 

  return (
    <>
      <section className="customContainer bg-white p-5 rounded-lg mb-5 shadow-sm">
      <Toaster  position='top-center'   toastOptions={{
          style: {
            borderRadius: "10px",
            padding: "15px",
          },
        }} />
        <div className="rounded-xl">
          <img src="/img/fraud.png" alt="" className="w-20" />
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-800 md:text-2xl">
            Add New Teacher
          </h1>
          <form onSubmit={tutorCreate} encType="multipart/form-data">
            <div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-x-4 mt-5">
              <div>
                <div className="flex flex-col gap-2">
                  <label className="font-semibold text-xs text-gray-500 ">
                    Name
                  </label>
                  <input
                    type="text"
                    className="border rounded-lg px-3 py-2 mb-4 text-black text-sm w-full outline-none border-gray-300 bg-gray-100"
                    placeholder="John Doe"
                    name="name"
                    value={tutordata.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-semibold text-xs text-gray-500 ">
                    Email
                  </label>
                  <input
                    type="email"
                    className="border rounded-lg px-3 py-2 mb-4 text-black text-sm w-full outline-none border-gray-300 bg-gray-100"
                    placeholder="TqNlX@example.com"
                    name="email"
                    value={tutordata.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-semibold text-xs text-gray-500 ">
                    Mobile
                  </label>
                  <input
                    type="text"
                    className="border rounded-lg px-3 py-2 mb-4 text-black text-sm w-full outline-none border-gray-300 bg-gray-100"
                    placeholder="9876543210"
                    name="number"
                    value={tutordata.number}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 lg:gap-3 md:gap-3 gap-0">
                  <div className="flex flex-col gap-2">
                    <label className="font-semibold text-xs text-gray-500 ">
                      PAN Card No.
                    </label>
                    <input
                      type="text"
                      className="border rounded-lg px-3 py-2 mb-4 text-black text-sm w-full outline-none border-gray-300 bg-gray-100"
                      placeholder=""
                      name="pancardno"
                      value={tutordata.pancardno}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-semibold text-xs text-gray-500 ">
                      Aadhar Card No.
                    </label>
                    <input
                      type="text"
                      className="border rounded-lg px-3 py-2 mb-4 text-black text-sm w-full outline-none border-gray-300 bg-gray-100"
                      placeholder=""
                      name="adharcardno"
                      onChange={handleChange}
                      value={tutordata.adharcardno}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-semibold text-xs text-gray-500 ">
                    Address
                  </label>
                  <input
                    type="text"
                    className="border rounded-lg px-3 py-2 mb-4 text-black text-sm w-full outline-none border-gray-300 bg-gray-100"
                    placeholder=""
                    name="address"
                    value={tutordata.address}
                    onChange={handleChange}
                  />
                </div>
              
              </div>
              <div>
                <div className="flex flex-col gap-2">
                  <label className="font-semibold text-xs text-gray-500 ">
                    description
                  </label>
                  <textarea
                    rows={5}
                    className="border rounded-lg px-3 py-2 mb-4 text-black text-sm w-full outline-none border-gray-300 bg-gray-100"
                    placeholder="Message"
                    name="description"
                    value={tutordata.description}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-semibold text-xs text-gray-500 ">
                    Subject
                  </label>
                  <input
                    type="text"
                    className="border rounded-lg px-3 py-2 mb-4 text-black text-sm w-full outline-none border-gray-300 bg-gray-100"
                    placeholder="Subject"
                    name="subject"
                    value={tutordata.subject}
                    onChange={handleChange}
                  />
                </div>
                {/* <div className="flex flex-col gap-2">
                  <label className="font-semibold text-xs text-gray-500 ">
                    Country
                  </label>
                  <select
                    className="border rounded-lg px-3 py-2 mb-4 text-black text-sm outline-none border-gray-300 bg-gray-100 w-full"
                    name="country"
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    value={selectedCountry}
                  >
                    {countries.map((country) => (
                      <option key={country.isoCode} value={country.isoCode}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div> */}
                <div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 lg:gap-3 md:gap-3 gap-0">
                  {/* <div className="flex flex-col gap-2">
                    <label className="font-semibold text-xs text-gray-500 ">
                      State
                    </label>
                    <select
                      className="border rounded-lg px-3 py-2 mb-4 text-black text-sm outline-none border-gray-300 bg-gray-100 w-full"
                      name="state"
                      onChange={(e) => setSelectedState(e.target.value)}
                      value={selectedState}
                      disabled={!selectedCountry}
                    >
                      <option value="">Select State</option>
                      {states.map((state) => (
                        <option key={state.isoCode} value={state.isoCode}>
                          {state.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-semibold text-xs text-gray-500 ">
                      City/District
                    </label>
                    <select
                      className="border rounded-lg px-3 py-2 mb-4 text-black text-sm outline-none border-gray-300 bg-gray-100 w-full"
                      name="city"
                      disabled={!selectedState}
                      value={tutordata.City}
                      onChange={handleChange}
                    >
                      <option value="">Select City</option>
                      {cities.map((city) => (
                        <option key={city.name} value={city.name}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                  </div> */}
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-semibold text-xs text-gray-500 ">
                    Password
                  </label>
                  <input
                    type="password"
                    className="border rounded-lg px-3 py-2 mb-4 text-black text-sm w-full outline-none border-gray-300 bg-gray-100"
                    placeholder="Password"
                    name="password"
                    value={tutordata.password}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="w-full flex justify-center items-center text-white bg-blueClr hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-semibold rounded-lg text-sm px-5 py-2.5 text-center hover:bg-primary-700 focus:ring-primary-800"
              >
                {/* {loading ? (
                  <l-mirage size="86" speed="4" color="white"></l-mirage>
                ) : (
                  "POST"
                )} */}
                POST
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}

export default AddDefaulter;
