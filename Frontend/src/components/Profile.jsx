import React, { useEffect, useState } from "react";
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setError("No authentication token found. Please login.");
      return;
    }
    
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data);
      } catch (err) {
        setError("Session expired. Please login again.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [token]);

  if (loading) {
    return (
      <div className="max-w-lg mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
        <div className="flex items-center justify-center py-12">
          <svg className="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-lg mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-6">
          <p className="text-red-700">{error}</p>
        </div>
        <button 
          onClick={() => window.location.href = "/login"} 
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto mt-8 bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
        <h2 className="text-white text-xl font-bold">User Profile</h2>
      </div>
      
      {user && (
        <div className="p-6">
          <div className="flex items-center mb-6">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <svg className="h-12 w-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800">{user.name || "User"}</h3>
              <p className="text-gray-600">{user.email || "No email provided"}</p>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            <h4 className="text-lg font-medium text-gray-700 mb-3">Profile Details</h4>
            <div className="bg-gray-50 rounded-lg p-4 overflow-auto max-h-96">
              {Object.entries(user).map(([key, value]) => (
                <div key={key} className="py-2 flex border-b border-gray-100 last:border-0">
                  <span className="font-medium text-gray-600 w-32">{key}:</span>
                  <span className="text-gray-800">
                    {typeof value === 'object' 
                      ? JSON.stringify(value) 
                      : value.toString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-6">
            <button 
              onClick={() => {
                localStorage.removeItem("token");
                window.location.reload();
              }}
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;