import React from 'react'
import { Link } from 'react-router-dom'

const Help = () => {
  return (
    <div>
      <section className="flex items-center h-[100dvh] sm:p-16 bg-gray-900 text-gray-100">
                      <div className="container flex flex-col items-center justify-center px-5 mx-auto my-8 space-y-8 text-center sm:max-w-xl">
                         <img src="../img/fraud-icon.png"/>
                          <p className="text-2xl">Helplines are services that provide support, advice, or information to people who call. They can also be accessed via email, web, or SMS</p>
                          <a href="https://api.whatsapp.com/send?phone=6378824125" rel="noopener noreferrer" to="/login" className="px-6 py-3 font-semibold rounded bg-blueClr text-white"><i className="fa-solid fa-home mr-2"></i>Chat with Us</a>
                      </div>
                  </section>
    </div>
  )
}

export default Help
