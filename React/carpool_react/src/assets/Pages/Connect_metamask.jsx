import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header1.jsx';
import Footer from '../components/Footer.jsx';
import { meta,body,side1 } from '../Public/images.jsx';
import { connectWallet,checkUser } from '../Functions/functions.js';


function Connect() {

  const [walletConnected, setWalletConnected] = useState(false);
  const [address, setAddress] = useState('');
  const navigate = useNavigate();

  const handleConnect = async () => {
    const { walletConnected, address } = await connectWallet();
    setWalletConnected(walletConnected);
    setAddress(address);

    if (walletConnected && address) {
      const checkIfRegistered = async () => {
        let registered = false;

        await checkUser((isRegistered) => {
          registered = isRegistered;
        });

        if (registered) {
          navigate('/dashboard'); 
        } else {
          navigate('/register');
        }
      };

      await checkIfRegistered();
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-cover" style={{
      backgroundImage: `url(${body})`, // Replace with actual bg path
    }}>
      <Header />

      <main className="flex-grow flex items-center justify-center">
        <div className="flex flex-col md:flex-row bg-white bg-opacity-70 p-8 rounded-lg shadow-lg">
          {/* Left Side */}
          <div className="flex flex-col items-center mr-6 mb-6 md:mb-0">
            <p className="text-red-900 text-lg font-semibold mb-4 text-center">
              Connect your wallet to start sharing or booking rides on the blockchain.
            </p>
            <img src={meta} alt="MetaMask" className="w-24 mb-4" />
            <button
              onClick={handleConnect}
              className="bg-teal-300 hover:bg-teal-400 text-black font-semibold py-2 px-4 border border-black rounded"
            >
              Connect to Metamask
            </button>
          </div>

          {/* Right Side Image */}
          <div>
            <img src={side1} alt="Car Scene" className="w-64 h-64 rounded-xl object-cover" />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Connect;
