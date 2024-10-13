import React from "react";
import { useAuth } from "../context/AuthProvider";
import teamMember1 from "../../public/team1.jpg"; // Replace with actual image paths
import teamMember2 from "../../public/team2.jpg";
import teamMember3 from "../../public/team3.jpg";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";

function AboutUs() {
  const [authUser] = useAuth();
  const navigate = useNavigate();
  return (
    <div className="max-w-screen-2xl mt-14 mx-auto md:px-20 px-4 mt-16 pt-5 min-h-screen">
      <div className="text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
          About Us
        </h1>
        <p className="text-lg md:text-2xl text-gray-300 mb-10">
          Empowering Knowledge & Building Community
        </p>
      </div>

      <div className="bg-gray-800 rounded-lg p-6 mb-10 shadow-lg">
        <h2 className="text-3xl font-semibold text-pink-500 mb-4">
          Our Mission
        </h2>
        <p className="text-md text-gray-300 mb-6">
          At our platform, we believe in the power of knowledge! Our mission is to provide access to a vast array of resources that inspire learning and personal growth. Join us in our journey to empower individuals and communities through education.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg transition-transform duration-300 hover:scale-105">
          <img src={teamMember1} alt="Team Member 1" className="rounded-full w-32 h-32 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white">John Doe</h3>
          <p className="text-gray-400">CEO & Founder</p>
          <p className="text-gray-300 mt-2">John is passionate about creating accessible learning opportunities for everyone.</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg transition-transform duration-300 hover:scale-105">
          <img src={teamMember2} alt="Team Member 2" className="rounded-full w-32 h-32 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white">Jane Smith</h3>
          <p className="text-gray-400">Chief Marketing Officer</p>
          <p className="text-gray-300 mt-2">Jane is dedicated to promoting the importance of education and lifelong learning.</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg transition-transform duration-300 hover:scale-105">
          <img src={teamMember3} alt="Team Member 3" className="rounded-full w-32 h-32 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white">Alice Johnson</h3>
          <p className="text-gray-400">Head of Community</p>
          <p className="text-gray-300 mt-2">Alice fosters connections and collaboration within our learning community.</p>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6 mb-10 shadow-lg">
        <h2 className="text-3xl font-semibold text-pink-500 mb-4">
          Join Our Community
        </h2>
        <p className="text-md text-gray-300 mb-6">
          We welcome learners from all backgrounds. Sign up today and be part of a vibrant community dedicated to sharing knowledge and experiences.
        </p>
        {!authUser && (
          <div className=" items-center justify-center ">
          <button className="btn btn-secondary mt-4" onClick={() => { navigate('/signup') }}>
            Sign Up Now
          </button>
          </div>
        )}
      </div>
      <Footer/>
    </div>
  );
}

export default AboutUs;
