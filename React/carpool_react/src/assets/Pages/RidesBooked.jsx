import React, { useEffect, useState } from 'react';
import Headerwallet from '../components/Header2';
import Footer from '../components/Footer';
import { body,side} from '../Public/images.jsx';
import { fetchBookedRides } from '../Functions/functions.js';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import { connectWallet1 } from '../Functions/functions.js';



const RidesBookedPage = () => {

  const [bookedRides, setBookedRides] = useState([]);
  const navigate = useNavigate();

  const [walletAddress, setWalletAddress] = useState("");

    useEffect(() => {
      const loadWallet = async () => {
        const address = await connectWallet1();
        if (address) setWalletAddress(address);
      };
      loadWallet();
    }, []);

  useEffect(() => {
    const loadRides = async () => {
      try {
        const rides = await fetchBookedRides();
        setBookedRides(rides);
      } catch (error) {
        console.error("Error fetching booked rides:", error);
      }
    };

    loadRides();
  }, []);

  const handleDetailsClick = (rideId) => {
    navigate(`/ridesdetails/${rideId}`);
  };


  return (
    <div
      className="flex flex-col min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${body})` }}
    >
      <Headerwallet walletAddress={walletAddress} />

      <main className="flex-grow flex justify-center items-center px-4 py-8">
        <div className="flex flex-col md:flex-row bg-gray-800 bg-opacity-80 text-white rounded-3xl p-10 shadow-xl">

          {/* Ride List */}
          <div className="w-full max-w-lg mr-0 md:mr-12">
            <h2 className="text-teal-300 text-2xl font-bold mb-6 text-center">Rides Booked</h2>

            <div className="space-y-4">

              {bookedRides.length === 0 ? (
                <p className="text-white text-center">No rides booked yet.</p>
              ) : (

                bookedRides.map((ride, index) => (
                <div
                  key={ride.rideId}
                  className="flex justify-between items-center bg-white bg-opacity-20 px-4 py-3 rounded-md text-sm md:text-base"
                >
                  <div className="text-black w-3/4">
                    <p>
                      <strong>From:</strong> {ride.origin}  
                      <strong> To:</strong> {ride.destination} 
                      <strong> Seats Booked:</strong> {ride.seats} 
                      
                      <strong> Fare:</strong> 
                        {ethers.formatEther(ride.fare)} ETH 
                      <span className="text-sm text-gray-200 ml-1">(₹{(ethers.formatEther(ride.fare) * 3000).toFixed(2)})</span>
                    
                    </p>
                    
                    <p className="mt-1"><strong>Time:</strong> {ride.departureTime}</p>
                  </div>

                  {/* Booked Button */}
                  <button
                    onClick={() => handleDetailsClick(ride.rideId)}
                    className="bg-pink-200 text-black font-semibold px-4 py-1 rounded-md cursor-not-allowed"
                  >
                    Booked
                  </button>
                </div>
              ))
            )}

            </div>
          </div>

          {/* Image */}
          <div className="mt-10 md:mt-0">
            <img
              src={side}
              alt="Woman travel art"
              className="w-64 h-64 object-cover rounded-xl"
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RidesBookedPage;