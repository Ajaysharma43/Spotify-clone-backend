import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { FaSun, FaMoon } from "react-icons/fa";

const linkUrl = import.meta.env.VITE_API_URL;

function Single() {
  const [Data, SetData] = useState([]);
  const [single, setSingle] = useState({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioState, setAudioState] = useState("Play");
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [like, setLike] = useState("Unliked");

  const { id } = useParams();
  const [newId, setId] = useState(id);

  const audioControl = useRef(null);
  const audioRange = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {

    // const UpdateHistory = async () => {
    //   const response = await axios.get(`${linkUrl}/SongsData/${id}`);
    //     console.log(response.data);

    //     let Songid = response.data.data._id;
    //     let Songname = response.data.data.Song_Name;
    //     let Song = response.data.data.Song;
    //     let SongImage = response.data.data.Song_Image;
    //     let username = sessionStorage.getItem("Username");
    //     let password = sessionStorage.getItem("Password");

    //     const result = await axios.post(`${linkUrl}/UpdateHistory`,{Songid,Songname,Song,SongImage,username,password})
    // }
    const History = async () => {
      try {
        const response = await axios.get(`${linkUrl}/SongsData/${id}`);
        console.log(response.data.data);

        let Songid = response.data.data._id;
        let Songname = response.data.data.Song_Name;
        let Song = response.data.data.Song;
        let SongImage = response.data.data.Song_Image;
        let username = sessionStorage.getItem("Username");
        let password = sessionStorage.getItem("Password");

        const result = await axios.post(`${linkUrl}/History`,{Songid,Songname,Song,SongImage,username,password})
      } catch (error) {}
    };

    const getSingle = async () => {
      try {
        const response = await axios.get(`${linkUrl}/SongsData/${id}`);
        setSingle(response.data.data);
        console.log(response.data.data);
        // Load audio control (if needed) here
      } catch (error) {
        console.error("Error fetching single:", error);
        // Display an error message to the user (e.g., set an error state)
      }
    };

    const GetData = async () => {
      try {
        const response = await axios.get(`${linkUrl}/GetAllSongs`);
        console.log(response.data.data);
        SetData(response.data.data);
      } catch (error) {
        console.error("error fetching data: ", error);
      }
    };
    
    // UpdateHistory();
    History();
    getSingle();
    GetData();
  }, [id]);

  useEffect(() => {
    const checkLikedStatus = async () => {
      try {
        const username = sessionStorage.getItem("Username");
        const password = sessionStorage.getItem("Password");

        const result = await axios.post(`${linkUrl}/Liked`, {
          username,
          password,
        });

        console.log(result.data.data);

        const likedSongs = result.data.data.Likedsongs;
        console.log("Liked songs:", likedSongs);

        const isLiked = likedSongs.some(
          (song) => song.name === single.Song_Name
        );
        console.log(isLiked);
        setLike(isLiked ? "Liked" : "Unliked");
        console.log("Song liked status:", like);
      } catch (error) {
        console.error("Error fetching liked songs:", error);
      }
    };

    if (single.Song_Name) {
      checkLikedStatus();
    }
  }, [single]);

  async function fetchSingleAndUpdate(id) {
    try {
      const response = await axios.get(`${linkUrl}/${id}`);
      setSingle(response.data);
      setId(id);
      audioControl.current.load();
      audioControl.current.play();
    } catch (error) {
      console.error("Error fetching single:", error);
    }
  }

  useEffect(() => {
    const audio = audioControl.current;

    const updateCurrentTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener("timeupdate", updateCurrentTime);
    audio.addEventListener("loadedmetadata", updateDuration);

    return () => {
      audio.removeEventListener("timeupdate", updateCurrentTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
    };
  }, []);

  const handleProgressClick = (e) => {
    const progressBar = audioRange.current;
    const clickPosition =
      (e.pageX - progressBar.getBoundingClientRect().left) /
      progressBar.offsetWidth;
    const newTime = clickPosition * duration;
    audioControl.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleRangeChange = (e) => {
    const newTime = (e.target.value / 100) * duration;
    audioControl.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const togglePlayPause = () => {
    const audio = audioControl.current;
    if (audio.paused) {
      audio.play();
      setIsPlaying(true);
      setAudioState("Pause");
    } else {
      audio.pause();
      setIsPlaying(false);
      setAudioState("Play");
    }
  };

  const playNext = () => {
    const current = Data.findIndex((single) => single._id === id);
    console.log(current);
    const next = (current + 1) % Data.length;
    console.log(next);

    navigate(`/Single/${Data[next]._id}`, { replace: true });
    navigate(0);
  };

  const playPrevious = () => {
    const current = Data.findIndex((single) => single._id === id);
    console.log(current);
    const previous = (current - 1 + Data.length) % Data.length;
    console.log(previous);

    navigate(`/Single/${Data[previous]._id}`, { replace: true });
    navigate(0);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleLiked = async (name, song, id, image) => {
    const username = sessionStorage.getItem("Username");
    const password = sessionStorage.getItem("Password");

    const result = await axios.post(`${linkUrl}/UpdateLiked`, {
      username,
      password,
      name,
      song,
      id,
      image,
    });

    console.log(result.data);
    if (result.data === "added") {
      setLike("Liked");
    } else {
      setLike("Unliked");
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.5 }}
        className={`min-h-screen flex flex-col items-center justify-center transition-all duration-500 ${
          darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
        }`}
      >
        <div className="flex justify-end w-full p-4">
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
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h1 className="text-4xl font-bold mb-2">{single.Song_Name}</h1>
          <p className="text-xl text-gray-400">{single.artist}</p>
        </motion.div>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="w-64 h-64 mb-4"
        >
          <img
            src={single.Song_Image}
            alt="Album Cover"
            className="w-full h-full object-cover rounded-lg shadow-lg"
          />
        </motion.div>
        <audio
          controls
          src={single.Song}
          ref={audioControl}
          className="hidden"
        />
        <motion.input
          type="range"
          value={(currentTime / duration) * 100 || 0}
          onChange={handleRangeChange}
          onClick={handleProgressClick}
          ref={audioRange}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className={`w-3/4 h-2 rounded-full appearance-none ${
            darkMode ? "bg-gray-700" : "bg-gray-300"
          }`}
        />
        <div className="flex space-x-4 mt-4">
          <motion.button
            onClick={togglePlayPause}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`px-6 py-2 rounded-md shadow-md focus:outline-none ${
              darkMode
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            {audioState}
          </motion.button>
          <motion.button
            onClick={playPrevious}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`px-6 py-2 rounded-md shadow-md focus:outline-none ${
              darkMode
                ? "bg-gray-700 text-white hover:bg-gray-600"
                : "bg-gray-500 text-white hover:bg-gray-400"
            }`}
          >
            Previous
          </motion.button>
          <motion.button
            onClick={playNext}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`px-6 py-2 rounded-md shadow-md focus:outline-none ${
              darkMode
                ? "bg-gray-700 text-white hover:bg-gray-600"
                : "bg-gray-500 text-white hover:bg-gray-400"
            }`}
          >
            Next
          </motion.button>
          <motion.button
            onClick={() =>
              handleLiked(
                single.Song_Name,
                single.Song,
                single._id,
                single.Song_Image
              )
            }
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`px-6 py-2 rounded-full shadow-md focus:outline-none ${
              darkMode
                ? "bg-gray-700 text-white hover:bg-gray-600"
                : "bg-gray-500 text-white hover:bg-gray-400"
            }`}
          >
            {like}
          </motion.button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default Single;
