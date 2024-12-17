import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { addSong, removeSong } from "../../features/songs/songslice";
import { FaHeart, FaRegHeart, FaSun, FaMoon } from "react-icons/fa";
import LoadingBar from "react-top-loading-bar";

const url  = import.meta.env.VITE_API_URL;

function NewData() {
  const [data, setData] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [progress, setprogress] = useState(null);
  const dispatch = useDispatch();
  const likedSongs = useSelector((state) => state.songs.likedSongs);

  useEffect(() => {
    const getData = async () => {
      setprogress(10);
      const response = await axios.get(`${url}/SongsData`);
      setprogress(40);
      setData(response.data.data);
      setprogress(100);
    };
    getData();
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      exit={{ opacity: 0 }}
      className={`min-h-screen flex flex-col items-center justify-center transition-all duration-500 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <LoadingBar 
      color="green"
      progress={progress}
      height={4}
      shadow={true}
      background="blue"
      />
      <div className="container mx-auto py-8">
        <div className="flex justify-end mb-4">
          <motion.button
            onClick={toggleDarkMode}
            className={`px-4 py-2 rounded-lg ${
              darkMode ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-800"
            } hover:bg-opacity-75 focus:outline-none`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
          </motion.button>
        </div>
        <h1 className="text-3xl font-bold text-center mb-8">
          Your Music Collection
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((item, index) => (
            <motion.div
              key={item._id}
              className={`rounded-lg overflow-hidden shadow-lg ${
                darkMode
                  ? "bg-gray-800 hover:shadow-xl"
                  : "bg-white hover:shadow-md"
              } relative transition-all duration-500`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              drag="x"
            >
              <div className="relative">
                <img
                  className="h-48 w-full object-cover"
                  src={item.Song_Image}
                  alt="Music Icon"
                />
                <div
                  className={`absolute inset-0 ${
                    darkMode
                      ? "bg-gradient-to-r from-gray-700 to-gray-900"
                      : "bg-gradient-to-l from-purple-600 to-blue-500"
                  } opacity-75`}
                ></div>
              </div>
              <div className="p-4">
                <Link to={`/Single/${item._id}`}>
                  <h1
                    className={`text-xl font-bold mb-2 truncate ${
                      darkMode ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {item.Song_Name}
                  </h1>
                </Link>
                <div className="flex justify-between items-center mb-4">
                  <span
                    className={`px-2 py-1 rounded-lg ${
                      darkMode
                        ? "bg-gray-700 text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {item.Genre}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default NewData;