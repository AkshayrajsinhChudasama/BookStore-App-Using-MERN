import React, { useContext } from "react";
import Navbar from "../components/Navbar";
import Banner from "../components/Banner";
import Freebook from "../components/Freebook";
import Footer from "../components/Footer";
import { AuthContext, useAuth } from "../context/AuthProvider";

function Home() {
  const [authUser] = useAuth();

  return (
    <>
      <Navbar />
      <Banner />
      {authUser && <Freebook />}      
      <Footer />
    </>
  );
}

export default Home;