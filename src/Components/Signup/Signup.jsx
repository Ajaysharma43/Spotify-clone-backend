import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast, Slide } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const linkUrl = import.meta.env.VITE_API_URL;

const Signup = ({ darkMode }) => {
  const Username = useRef(null);
  const Password = useRef(null);
  const Email = useRef(null);
  const navigate = useNavigate();

  const Setdata = async () => {

    const Name = Username.current.value;
    const password = Password.current.value;
    const email = Email.current.value;
    if(!Name && !password && !email)
      {
        toast.error("Name , password and email is missing", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Slide,
        });
      }
      else if(!Name && !password)
      {
        toast.error("Name and password is missing", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Slide,
        });
      }
      else if(!Name && !email)
        {
          toast.error("Name and email is missing", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Slide,
          });
        }
      else
      {
        try {
          const user = await axios.post(`${linkUrl}/SignUp`, { Name, password, email });
          console.log(user.data);
          
          if(user.data == 'existed')
          {
            toast.error("user already existed", {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
              transition: Slide,
            });
          }
          else
          {
            console.log("Data saved");
          }
        } catch (error) {
          console.error("Error saving data", error);
        }
      }
    
    
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`min-h-screen flex flex-col items-center justify-center ${
        darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'
      }`}
    >
      <div className="max-w-md w-full p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">Sign Up</h1>
          <div>
            <label htmlFor="name" className="block mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your name"
              ref={Username}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none"
              autoComplete="name"
            />
          </div>
          <div>
            <label htmlFor="email" className="block mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              ref={Email}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none"
              autoComplete="email"
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              ref={Password}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none"
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            onClick={()=>Setdata()}
            className={`w-full py-3 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none ${
              darkMode ? 'bg-opacity-75' : ''
            }`}
          >
            Sign Up
          </button>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          transition={Slide}
        />
      </div>
    </motion.div>
  );
};

export default Signup;
