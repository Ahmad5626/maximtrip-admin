import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/authContext";
import Login from "./pages/Login";

import Overview from "./pages/Overview";


import PageNotFound from "./pages/PageNotFound";
import Profile from "./components/Profile";
import Home from "./components/Home";

import MoneyBlockerFinder from "./components/MoneyBlockerFinder";
import CreatePackeges from "./components/CreatePackeges";



import PastClass from "./components/PastClass";


import Upcommingclass from "./components/Upcommingclass";
import Request from "./components/Request";
import Shedule from "./components/Shedule";
import Campaigns from "./components/Campaigns";
import EditButtons from "./components/EditButtons";
import RecommendedCauses from "./components/CreateCategory";
import CreateBlogs from "./components/CreateBlogs";
import CreatePages from "./components/CreatePages";
import CreateDestinations from "./components/CreateDestinations";

function App() {
  
  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
           
            <Route path="/" element={<Login/>} />
           <Route
              path="overview"
              element={<Overview/>}
            >
             
              <Route path="home" element={<Home />} />
              <Route path="campaigns" element={<Campaigns  />} />
              <Route path="profile" element={<Profile />} />
              <Route path="editbuttons" element={<EditButtons />} />
              <Route path="createpackeges" element={<CreatePackeges />} />
              <Route path="createcategory" element={<RecommendedCauses />} />
              <Route path="Createblogs" element={<CreateBlogs />} /> 
              <Route path="createpage" element={<CreatePages />} /> 
              <Route path="destinations" element={<CreateDestinations/>} /> 
            
            </Route>
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  );
}

export default App;
