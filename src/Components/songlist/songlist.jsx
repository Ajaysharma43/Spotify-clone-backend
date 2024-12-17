import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeSong } from "../../features/songs/songslice";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaRegHeart, FaSun, FaMoon } from "react-icons/fa";
import LoadingBar from "react-top-loading-bar";
import axios from "axios";

const linkUrl = import.meta.env.VITE_API_URL;

function Likedsongs() {
  const songs = useSelector((state) => state.songs.likedSongs);
  const dispatch = useDispatch();
  const [darkMode, setDarkMode] = useState(false);
  const [userData, setUserData] = useState(null);
  const [progress,setprogress] = useState();
  const navigate = useNavigate();
  const cardRefs = useRef([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const Username = sessionStorage.getItem("Username");
        const Password = sessionStorage.getItem("Password");
        const response = await axios.post(`${linkUrl}/GetUserData`, {
          Username,
          Password,
        });
        setprogress(60)
        setUserData(response.data);
        setprogress(100)
        console.log(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, []);

  const removeSongHandler = async (song) => {
    const id = song.id;
    const name = song.name;
    const data = song.Song;
    const Username = sessionStorage.getItem("Username");
    const Password = sessionStorage.getItem("Password");
    setprogress(0);
  
    try {
      // Make an API call to remove the song
      const response = await axios.post(`${linkUrl}/RemoveLikedSongs`, {
        id,
        name,
        data,
        Username,
        Password,
      });
      setprogress(30);
  
      console.log(response.data);
  
      if (response.data === "removed") {
        // Filter out the song from the list
        const updatedSongs = userData.Likedsongs.filter((item) => item.id !== id);
  
        // Update the state with the new song list
        setUserData((prevData) => ({
          ...prevData,
          Likedsongs: updatedSongs,
        }));
  
        console.log("Updated Songs List: ", updatedSongs);
      }
    } catch (error) {
      console.error("Error removing song:", error);
    } finally {
      setprogress(100);
    }
  };
  
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
        darkMode
          ? "bg-gradient-to-br from-gray-900 to-black"
          : "bg-gradient-to-br from-purple-600 to-indigo-600"
      }`}
    >
      <LoadingBar 
      color="green"
      progress={progress}
      height={4}
      shadow={true}
      background="blue"
      />
      <div className="max-w-7xl w-full mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg transition-all duration-500">
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
        <h1
          className={`text-3xl font-bold ${
            darkMode ? "text-black" : "text-gray-800"
          } mb-6`}
        >
          Your Liked Songs
        </h1>
        <AnimatePresence>
          {userData && userData.Likedsongs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {userData.Likedsongs.map((item, index) => (
                <motion.div
                  key={item.id}
                  ref={(el) => (cardRefs.current[index] = el)}
                  className={`p-4 rounded-lg shadow-md transition-all duration-500 ${
                    darkMode
                      ? "bg-gradient-to-t from-gray-700 to-gray-900"
                      : "bg-gradient-to-t from-white to-gray-200"
                  }`}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link to={`/single/${item.id}`} className="block mb-2">
                    <motion.img
                      src={item.Image}
                      className="w-48 h-48 object-cover rounded-lg shadow-lg transform transition duration-500 hover:scale-105 hover:shadow-2xl"
                      alt={item.name}
                      whileHover={{ scale: 1.05 }}
                    />
                    <h2
                      className={`text-xl font-semibold ${
                        darkMode ? "text-white" : "text-gray-800"
                      }`}
                    >
                      {item.name}
                    </h2>
                  </Link>

                  <motion.button
                    onClick={() => removeSongHandler(item)}
                    className={`bg-red-500 transition duration-300 hover:bg-red-600 text-white py-2 px-4 rounded-lg focus:outline-none flex items-center mt-2 ${
                      darkMode ? "bg-opacity-75" : ""
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FaRegHeart className="mr-2" />
                    Remove
                  </motion.button>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`text-lg ${darkMode ? "text-black" : "text-gray-800"}`}
            >
              {userData && userData.Likedsongs.length === 0
                ? "You haven't liked any songs yet."
                : "Loading..."}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default Likedsongs;
