import axios from 'axios';
import React, { useRef } from 'react';

const SongUpload = () => {
  const url  = import.meta.env.VITE_API_URL;

  const SongRef = useRef(null);
  const SongImageRef = useRef(null);
  const SongNameRef = useRef(null);
  const SongArtistRef = useRef(null);
  const SongGenreRef = useRef(null);


  const Upload = async() =>{
    const Song = SongRef.current.value;
    const SongImage = SongImageRef.current.value;
    const SongName = SongNameRef.current.value;
    const SongArtist = SongArtistRef.current.value;
    const SongGenre = SongGenreRef.current.value;
    console.log(SongName);

    await axios.post(`${url}/SongUpload`,{Song,SongImage,SongName,SongArtist,SongGenre});
  }


  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-6">User Dashboard</h1>
        <form action="">
          <div className="mb-4">
            <label className="block text-gray-700" >Song Name</label>
            <input type="text" className="w-full p-2 border border-gray-300 rounded mt-1" ref={SongNameRef}/>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700" >Address</label>
            <input type="text" className="w-full p-2 border border-gray-300 rounded mt-1" ref={SongRef}/>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700" >Artist Name</label>
            <input type="text" className="w-full p-2 border border-gray-300 rounded mt-1" ref={SongArtistRef}/>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700" >Genre</label>
            <input type="text" className="w-full p-2 border border-gray-300 rounded mt-1" ref={SongGenreRef}/>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700" >Song Image URL</label>
            <input type="text" className="w-full p-2 border border-gray-300 rounded mt-1" ref={SongImageRef}/>
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded mt-4" onClick={()=>Upload()}>Submit</button>
          </form>
      </div>
    </div>
  );
};

export default SongUpload;
