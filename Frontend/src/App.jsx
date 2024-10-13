import React from "react";
import Home from "./home/Home";
import { Navigate, Route, Routes } from "react-router-dom";
import Courses from "./courses/Courses";
import Signup from "./components/Signup";
import { Toaster } from "react-hot-toast";
import { useAuth } from "./context/AuthProvider";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Database from "./components/Database";
import AboutUs from "./components/About";
import ContactUs from "./components/Contact";
import ExperimentalAI from "./components/ExperimentalAI";

function App() {
  const [authUser, setAuthUser] = useAuth();
  console.log(authUser);
  return (
    <>
      <div className="dark:bg-slate-900 dark:text-white">
        <Navbar/>
        <Routes>
          <Route path="/" element={<Home />} />
          {authUser && authUser.level === 'admin' &&(
            <Route path="/database" element={<Database />} />)
          }
           <Route
              path="/about"
              element={<AboutUs />}
            />
          {authUser &&
          <>
           
            <Route
              path="/contact"
              element={<ContactUs />}
            />
             <Route
              path="/experimental-ai"
              element={<ExperimentalAI />}
            />
          </>
          }
          {!authUser && (
            <>
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
            </>
          )}
          {/* Redirect all unmatched routes to home */}
          {/* <Route path="*" element={<Navigate to="/" />} /> */}
        </Routes>
        <Toaster />
      </div>
    </>
  );
}

export default App;
