import React  from 'react';
import Headerwallet from '../components/Header2';
import Footer from '../components/Footer';
import { body,side} from '../Public/images.jsx';
import { useNavigate } from 'react-router-dom';
import { connectWallet1 } from '../Functions/functions.js';
import { useState,useEffect } from 'react';


const DashboardPage = () => {

    const navigate = useNavigate();
    
    const [walletAddress, setWalletAddress] = useState("");

    useEffect(() => {
      const loadWallet = async () => {
        const address = await connectWallet1();
        if (address) setWalletAddress(address);
      };
      loadWallet();
    }, []);

    const handleBookRide = () => {
        navigate('/bookride');
    };

    const handlePublishRide = () => {
        navigate('/publishride');
    };



  return (
    <div
      className="flex flex-col min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${body})` }} // Use correct image path
    >
      <Headerwallet walletAddress={walletAddress} />
      
      <main className="flex-grow flex justify-center items-center px-4">
        <div className="flex flex-col md:flex-row bg-white bg-opacity-60 p-10 rounded-lg shadow-lg">
          
          {/* Left Side: Options */}
          <div className="flex flex-col justify-center mr-10 md:mr-20 mb-6 md:mb-0">
            <button
              className="text-purple-900 text-xl font-semibold mb-6 text-left hover:underline"
              onClick={handleBookRide}
            >
              Book a Ride
            </button>
            <button
              className="text-purple-900 text-xl font-semibold text-left hover:underline"
              onClick={handlePublishRide}
            >
              Publish a Ride
            </button>
          </div>

          {/* Right Side: Image */}
          <div>
            <img
              src={side}
              alt="Ride Illustration"
              className="rounded-xl w-64 h-64 object-cover"
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default DashboardPage;