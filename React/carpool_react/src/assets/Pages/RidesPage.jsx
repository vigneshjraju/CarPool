import React, { useEffect, useState } from 'react';
import Headerwallet from '../components/Header2';
import { useLocation, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import { body,side} from '../Public/images.jsx';
import { fetchAllRides,bookRide } from '../Functions/functions.js';
import { ethers } from 'ethers';
import { connectWallet1 } from '../Functions/functions.js';



const AvailableRidesPage = () => {


    const { state } = useLocation();
    const navigate = useNavigate();
    const [rides, setRides] = useState([]);


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
        const allRides = await fetchAllRides();
        const { origin, destination } = state.searchCriteria;
        const filtered = allRides.filter(
          ride =>
            ride.origin.toLowerCase() === origin.toLowerCase() &&
            ride.destination.toLowerCase() === destination.toLowerCase()
        );
        setRides(filtered);
    };

      if (state?.searchCriteria) loadRides();
    }, [state]);


    const handleBook = async (ride) => {
      try {

        const fareInWei = BigInt(ride.fare); // already in Wei
        await bookRide(ride.rideId, fareInWei); // using Wei
        console.log("Booking with Fare (WEI):", ride.fare);
        alert("Ride booked!");
        navigate("/ridesbooked");
        } catch (err) {
        alert("Booking failed: " + err.message);
        }
    };

  
  return (
    <div
      className="flex flex-col min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${body})` }}
    >
      <Headerwallet walletAddress={walletAddress} />

      <main className="flex-grow flex justify-center items-center px-4 py-8">
        <div className="flex flex-col md:flex-row bg-gray-800 bg-opacity-80 text-white rounded-3xl p-10 shadow-xl">

          {/* Rides List */}
          <div className="w-full max-w-lg mr-0 md:mr-12">
            <h2 className="text-teal-300 text-2xl font-bold mb-6 text-center">Available Rides</h2>

            <div className="space-y-4">
              {rides.map((ride, index) => (
                <div
                  key={ride.rideId}
                  className="flex justify-between items-center bg-white bg-opacity-20 px-4 py-3 rounded-md text-sm md:text-base"
                >
                  <div className="text-black w-3/4">
                    <p>
                      <strong>From:</strong> {ride.origin}  
                      <strong>To:</strong> {ride.destination}  
                      <strong>Seats:</strong> {ride.seats}  
                      <strong>Fare:</strong> {ride.fare} Wei
                    </p>
                    <p className="mt-1"><strong>Time:</strong> {ride.departureTime}</p>
                  </div>
                  <button
                    onClick={() => handleBook(ride)}
                    className="bg-pink-200 hover:bg-pink-300 text-black font-semibold px-4 py-1 rounded-md"
                  >
                    Book
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Image right side */}
          <div className="mt-10 md:mt-0">
            <img
              src={side}
              alt="Travel art"
              className="w-64 h-64 object-cover rounded-xl"
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AvailableRidesPage;