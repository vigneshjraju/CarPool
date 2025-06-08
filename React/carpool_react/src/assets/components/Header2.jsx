// src/components/Header.js
import React from 'react';
import { logo } from '../Public/images';

const Headerwallet = ({ walletAddress }) => {
  return (
    <header className="bg-gray-800 text-white flex items-center justify-between p-4">
      <div className="flex items-center">
        <img src={logo} alt="Logo" className="h-12 mr-4" />
      </div>
      {walletAddress && (
        <div className="text-right text-teal-400">
          <p className="font-bold">Address :</p>
          <p className="text-xs md:text-sm break-all">{walletAddress}</p>
        </div>
      )}
    </header>
  );
};

export default Headerwallet;