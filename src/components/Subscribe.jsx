function Subscribe() {
    return (
        <>
            <section className="my-4">
                <div className="customContainer bg-white p-5 rounded-lg mx-auto shadow-sm">
                    <div className="mb-5 text-left">
                        <span className="font-bold tracking-wider uppercase text-blueClr">Pricing</span>
                        <h2 className="text-2xl font-bold">Choose your best plan</h2>
                    </div>
                    <div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-4 px-4 -mx-4">
                        <div className="flex mb-8 lg:mb-0">
                            <div className="flex flex-grow flex-col p-6 space-y-6 rounded shadow sm:p-8 bg-gray-100 border border-gray-300">
                                <div className="space-y-2">
                                    <h4 className="text-2xl font-bold"></h4>
                                    <span className="text-6xl font-bold">₹199
                                        <span className="text-sm tracking-wide">/</span>
                                    </span>
                                </div>
                                <p className="mt-3 leading-relaxed text-gray-600">Etiam ac , eget euismod dolor.</p>
                                <ul className="flex-1 mb-6 text-gray-500">
                                    <li className="flex items-center mb-2 space-x-2">
                                        <i className="fa-solid fa-circle-check text-blueClr"></i>
                                        <span>Add Defaulters</span>
                                    </li>
                                    <li className="flex items-center mb-2 space-x-2">
                                        <i className="fa-solid fa-circle-xmark"></i>
                                        <span className="line-through">Search for Defaulters</span>
                                    </li>
                                    <li className="flex items-center mb-2 space-x-2">
                                        <i className="fa-solid fa-circle-xmark"></i>
                                        <span className="line-through">24/7 </span>
                                    </li>
                                </ul>
                                <button type="button" className="inline-block px-5 py-3 font-semibold tracking-wider text-center rounded bg-blueClr text-white">SUBSCRIBE</button>
                            </div>
                        </div>
                        <div className="flex mb-8 lg:mb-0">
                            <div className="flex flex-grow flex-col p-6 space-y-6 rounded shadow sm:p-8 bg-blueClr text-white">
                                <div className="space-y-2">
                                    <h4 className="text-2xl font-bold">Pro</h4>
                                    <span className="text-6xl font-bold">₹499
                                        <span className="text-sm tracking-wide"></span>
                                    </span>
                                </div>
                                <p className="leading-relaxed">Morbi cursus ut sapien sit amet consectetur.</p>
                                <ul className="flex-1 space-y-2">
                                    <li className="flex items-center mb-2 space-x-2">
                                        <i className="fa-solid fa-circle-check text-white"></i>
                                        <span>Add Defaulters</span>
                                    </li>
                                    <li className="flex items-center mb-2 space-x-2">
                                        <i className="fa-solid fa-circle-check text-white"></i>
                                        <span>Search for </span>
                                    </li>
                                    <li className="flex items-center mb-2 space-x-2">
                                        <i className="fa-solid fa-circle-xmark text-white"></i>
                                        <span className="line-through">24/7 Support</span>
                                    </li>
                                </ul>
                                <a rel="noopener noreferrer" href="#" className="inline-block w-full px-5 py-3 font-bold tracking-wider text-center rounded bg-white text-blueClr">SUBSCRIBE</a>
                            </div>
                        </div>
                        <div className="flex mb-8 lg:mb-0">
                            <div className="flex flex-grow flex-col p-6 space-y-6 rounded shadow sm:p-8 bg-gray-100 border border-gray-300">
                                <div className="space-y-2">
                                    <h4 className="text-2xl font-bold"></h4>
                                    <span className="text-6xl font-bold">₹999
                                        <span className="text-sm tracking-wide">12months</span>
                                    </span>
                                </div>
                                <p className="leading-relaxed text-gray-600">Phaselh in vehicula.</p>
                                <ul className="space-y-2 text-gray-500">
                                    <li className="flex items-center mb-2 space-x-2">
                                        <i className="fa-solid fa-circle-check text-blueClr"></i>
                                        <span>Add Defaulters</span>
                                    </li>
                                    <li className="flex items-center mb-2 space-x-2">
                                        <i className="fa-solid fa-circle-check text-blueClr"></i>
                                        <span>Search for </span>
                                    </li>
                                    <li className="flex items-center mb-2 space-x-2">
                                        <i className="fa-solid fa-circle-check text-blueClr"></i>
                                        <span>24/7 Support</span>
                                    </li>
                                    <li className="flex items-center mb-2 space-x-2">
                                        <i className="fa-solid fa-circle-check text-blueClr"></i>
                                        <span>Super saving plan</span>
                                    </li>
                                </ul>
                                <a rel=" noreferrer" href="#" className="inline-block w-full px-5 py-3 font-semibold tracking-wider text-center rounded bg-blueClr text-white">SUBSCRIBE</a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Subscribe
