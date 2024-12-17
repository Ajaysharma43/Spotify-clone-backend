import React from 'react';
import AdminNavbar from '../../AdminNavbar/AdminNavbar';
import SongUpload from '../../SongUpload/SongUpload';

const DataUploadPage = () => {
  return (
    <>
      <AdminNavbar />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Data Upload Page</h1>
        <SongUpload />
        
      </div>
    </>
  );
};

export default DataUploadPage;
