import React from 'react';
import { logo } from '../Public/images.jsx';

const Header = () => {
  return (
    <header className="bg-gray-800 text-white flex items-center p-4">
      <img src={logo} alt="Logo" className="h-12 mr-4" />
      <h1 className="text-2xl font-bold text-pink-200">Welcome to Carpooling</h1>
    </header>
  );
};

export default Header;