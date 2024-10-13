import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import Navbar from "./Navbar";
import { useAuth } from "../context/AuthProvider";

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const [authUser,setAuthUser] = useAuth();
  const onSubmit = async (data) => {
    const userInfo = {
      email: data.email,
      password: data.password,
    };
    await axios
      .post("http://localhost:4001/user/login", userInfo)
      .then((res) => {
        console.log(res.data);
        if (res.data) {
          toast.success("Logged in Successfully");
          localStorage.setItem("user", JSON.stringify(res.data.user));
          setAuthUser(res.data.user);
          navigate('/');
        }
      })
      .catch((err) => {
        if (err.response) {
          console.log(err);
          toast.error("Error: " + err.response.data.message);
          setTimeout(() => {}, 2000);
        }
      });
  };

  return (
    <>
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-gray-800 p-8 shadow-md rounded-md">
        <h3 className="font-bold text-lg text-center mb-6">Login</h3>

        <form onSubmit={handleSubmit(onSubmit)}>
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

          {/* Button */}
          <div className="flex justify-between items-center mt-6">
            <button
              type="submit"
              className="bg-pink-500 text-white rounded-md px-4 py-2 hover:bg-pink-700 duration-200"
            >
              Login
            </button>
            <p>
              Not registered?{" "}
              <Link to="/signup" className="underline text-blue-500">
                Signup
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
    </>
  );
}

export default Login;
