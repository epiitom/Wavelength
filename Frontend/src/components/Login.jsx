import React, { useState } from "react";
import axios from "axios";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    try {
      const response = await axios.post("http://localhost:5000/api/login", { email, password });
      localStorage.setItem("token", response.data.token);
      onLogin(); // Call parent function to update UI
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
        <h2 className="text-white text-xl font-bold">Welcome Back</h2>
        <p className="text-blue-100 text-sm">Please login to your account</p>
      </div>
      
      <div className="px-6 py-8">
        {error && (
          <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-medium mb-2">Password</label>
          <input
            type="password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        
        <button
          onClick={handleLogin}
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Logging in...
            </span>
          ) : (
            "Login"
          )}
        </button>
        
        <div className="mt-4 text-center">
          <a href="#" className="text-sm text-blue-600 hover:text-blue-800">Forgot password?</a>
        </div>
      </div>
    </div>
  );
};

export default Login;