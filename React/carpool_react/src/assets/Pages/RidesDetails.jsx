import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Headerwallet from '../components/Header2';
import Footer from '../components/Footer';
import { body,side} from '../Public/images.jsx';
import { getRideById } from '../Functions/functions.js';
import { ethers } from 'ethers';
import { connectWallet1,confirmRideCompleted,checkIfPassengerConfirmed } from '../Functions/functions.js';

const RideDetailsPage = () => {

  const { rideId } = useParams();
  const [ride, setRide] = useState(null);
  const [hasConfirmed, setHasConfirmed] = useState(false);

  const [walletAddress, setWalletAddress] = useState("");

    useEffect(() => {
      const loadWallet = async () => {
        const address = await connectWallet1();
        if (address) setWalletAddress(address);
      };
      loadWallet();
    }, []);



    useEffect(() => {
      const fetchRide = async () => {
        try {
          const data = await getRideById(rideId);
          setRide(data);
        } catch (err) {
          console.error("Error fetching ride:", err);
        }
      };
      fetchRide();
    }, [rideId]);


    useEffect(() => {
      const checkRideCompletion = async () => {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const userAddress = signer.address;

          const confirmed = await checkIfPassengerConfirmed(rideId, userAddress);
          setHasConfirmed(confirmed);
        } catch (err) {
          console.error("Error checking ride confirmation:", err);
        }
      };

      checkRideCompletion();
    }, [rideId]);




    const handleConfirmRide = async () => {
      try {
        const tx = await confirmRideCompleted(ride.rideId);
        // await tx.wait();

        setHasConfirmed(true);
        alert(" Ride marked as completed!");
        
      } catch (err) {
        alert(" Failed to confirm ride.");
        console.error(err);
      }
    };



  if (!ride) return <div className="text-white text-center py-20">Loading Ride Details...</div>;
  

  return (
    <div
      className="flex flex-col min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${body})` }}
    >
      <Headerwallet walletAddress={walletAddress} />

      <main className="flex-grow flex justify-center items-center px-4 py-8">
        <div className="flex flex-col md:flex-row bg-gray-800 bg-opacity-80 text-white rounded-3xl p-10 shadow-xl">

          {/* Left Side: Ride Box */}
          <div className="w-full max-w-lg mr-0 md:mr-12">
            <h2 className="text-teal-300 text-2xl font-bold mb-6 text-center">Rides Details</h2>

            <div className="bg-gray-100 text-black rounded-xl px-6 py-6">
              <div className="flex justify-center mb-4">
                <span className="bg-pink-200 text-black font-semibold px-4 py-1 rounded-md cursor-not-allowed">
                  Confirmed
                </span>
              </div>

              <p className="text-center font-semibold text-lg">
                Car Model : <span className="font-bold">{ride.carModel}</span>
              </p>
              <p className="text-center text-sm mb-6 text-gray-600">
                Car Number : {ride.carNumber}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-2">
                <p><strong>From:</strong> {ride.origin}</p>
                <p><strong>To:</strong> {ride.destination}</p>
                <p><strong>Time:</strong> {ride.departureTime}</p>
              </div>

              <div className="text-center mt-6">

                <p className="text-2xl font-bold text-rose-800">
                    Fare: {ride.fare} Wei 
                    
                </p>

              </div>

                {hasConfirmed ? (
                  <p className="text-green-800 mt-2">✔ Ride marked as completed</p>
                ) : (
                  <button
                    onClick={handleConfirmRide}
                    className="bg-green-600 text-white px-4 py-2 rounded mt-4 hover:bg-green-700"
                  >
                    ✔ Mark Ride as Completed
                  </button>
                )}


            </div>
          </div>

          {/* Right Side Image */}
          <div className="mt-10 md:mt-0">
            <img
              src={side}
              alt="Car Travel Art"
              className="w-64 h-64 object-cover rounded-xl"
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RideDetailsPage;