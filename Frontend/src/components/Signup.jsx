import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import Navbar from "./Navbar";

function Signup() {
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || "/";
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const userInfo = {
      fullname: data.fullname,
      email: data.email,
      password: data.password,
    };

    await axios
      .post("http://localhost:4001/user/signup", userInfo)
      .then((res) => {
        console.log(res.data);
        if (res.data) {
          toast.success("Signup Successful");
          localStorage.setItem("Users", JSON.stringify(res.data.user));
          navigate(from, { replace: true });
        }
      })
      .catch((err) => {
        if (err.response) {
          console.log(err);
          toast.error("Error: " + err.response.data.message);
        }
      });
  };

  return (
    <>
    <div className="min-h-screen flex items-center justify-center ">
      <div className="w-full max-w-md bg-gray-800 p-8 shadow-md rounded-md">
        <h3 className="font-bold text-lg text-center mb-6">Signup</h3>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Fullname */}
          <div className="mt-4 space-y-2">
            <label>Fullname</label>
            <input
              type="text"
              placeholder="Enter your fullname"
              className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register("fullname", { required: true })}
            />
            {errors.fullname && (
              <span className="text-sm text-red-500">
                This field is required
              </span>
            )}
          </div>

          {/* Email */}
          <div className="mt-4 space-y-2">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register("email", { required: true })}
            />
            {errors.email && (
              <span className="text-sm text-red-500">
                This field is required
              </span>
            )}
          </div>

          {/* Password */}
          <div className="mt-4 space-y-2">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register("password", { required: true })}
            />
            {errors.password && (
              <span className="text-sm text-red-500">
                This field is required
              </span>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-between items-center mt-6">
            <button
              type="submit"
              className="bg-pink-500 text-white rounded-md px-4 py-2 hover:bg-pink-700 duration-200"
            >
              Signup
            </button>
            <p>
              Have an account?{" "}
              <button
                className="underline text-blue-500 cursor-pointer"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
    </>
  );
}

export default Signup;
