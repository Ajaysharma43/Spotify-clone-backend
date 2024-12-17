import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Navbar = () => {
  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex justify-between items-center py-4 px-8 bg-gray-100 text-gray-800 shadow-md"
    >
      <Link to="/" className="text-2xl font-bold">
        Your App Name
      </Link>
      <div className="flex items-center space-x-4">
        <Link
          to="/login"
          className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition duration-300"
        >
          Logout
        </Link>
        <Link
          to="/signup"
          className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600 transition duration-300"
        >
          Sign Up
        </Link>
        <Link
          to="/songs"
          className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition duration-300"
        >
          Liked Songs
        </Link>
      </div>
    </motion.nav>
  );
};

export default Navbar;
