import React from 'react';
import { Link } from 'react-router-dom';

const AdminNavbar = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white font-bold text-xl">Admin Dashboard</div>
        <ul className="flex space-x-4">
          <li>
            <Link to="/dashboard" className="text-white hover:text-gray-300">Dashboard</Link>
          </li>
          <li>
            <Link to="/users" className="text-white hover:text-gray-300">Users</Link>
          </li>
          <li>
            <Link to="/settings" className="text-white hover:text-gray-300">Settings</Link>
          </li>
          <li>
            <Link to="/profile" className="text-white hover:text-gray-300">Profile</Link>
          </li>
          <li>
            <Link to="/logout" className="text-white hover:text-gray-300">Logout</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default AdminNavbar;
