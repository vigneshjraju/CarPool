import React from 'react';
import { logo } from '../Public/images.jsx';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-center text-white py-4 mt-auto">
      <img src={logo} alt="Logo" className="h-10 mx-auto mb-2" />
      <p className="text-teal-300">©2025 Carpooling</p>
    </footer>
  );
};

export default Footer;