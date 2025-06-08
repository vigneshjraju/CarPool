import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Headerwallet from '../components/Header2';
import Footer from '../components/Footer';
import { body} from '../Public/images.jsx';
import { _newUser } from '../Functions/functions.js';


const RegisterPage = () => {

  const [formData, setFormData] = useState({ name: '', age: '', gender: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const { name, age, gender } = formData;

    // Validate gender input
    const genderBool = gender.toLowerCase() === "male" ? true : false;

    try {

      setLoading(true);
      await _newUser(name, parseInt(age), genderBool); // Call contract function
      alert('User registered successfully!');
      navigate('/dashboard');

    } catch (error) {

      console.error("Registration error:", error);
      alert("Error registering user.");
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex flex-col min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${body})` }} // Replace with correct path if different
    >
      <Headerwallet walletAddress="Connected" />
      <main className="flex-grow flex justify-center items-center px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-gray-800 bg-opacity-90 text-white p-8 rounded-3xl w-full max-w-md shadow-lg"
        >
          <h2 className="text-teal-400 text-2xl font-bold mb-6 text-center">Register User</h2>

          {/* Name */}
          <div className="mb-4">
            <label className="block text-gray-300 mb-1">Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 rounded bg-gray-100 text-black"
            />
          </div>

          {/* Age */}
          <div className="mb-4">
            <label className="block text-gray-300 mb-1">Age</label>
            <input
              name="age"
              type="number"
              value={formData.age}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 rounded bg-gray-100 text-black"
            />
          </div>

          {/* Gender */}
          <div className="mb-6">
            <label className="block text-gray-300 mb-1">Gender (Male/Female)</label>
            <input
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 rounded bg-gray-100 text-black"
            />
          </div>

          {/* 🔘 Register Button */}
          <div className="text-center">
            <button
              type="submit"
              className="bg-teal-400 hover:bg-teal-500 text-black font-semibold px-6 py-2 rounded-md transition-colors duration-200"
                disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default RegisterPage;