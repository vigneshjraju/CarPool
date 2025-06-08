import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Headerwallet from '../components/Header2';
import Footer from '../components/Footer';
import { body,side} from '../Public/images.jsx';
import { CONTRACT_ABI } from '../abi/abi.js';
import { BrowserProvider, Contract, ethers } from "ethers";
import { useNavigate } from 'react-router-dom';
import { connectWallet1 } from '../Functions/functions.js';

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;


const BookedPassengersPage = () => {


  const [walletAddress, setWalletAddress] = useState("");

    useEffect(() => {
      const loadWallet = async () => {
        const address = await connectWallet1();
        if (address) setWalletAddress(address);
      };
      loadWallet();
	}, []);

  const { rideId } = useParams();
  const [passengers, setPassengers] = useState([]);
  const navigate = useNavigate();

   useEffect(() => {

      const fetchPassengers = async () => {

          if (window.ethereum) {
            const provider = new BrowserProvider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            const signer = await provider.getSigner();
            const contract = new Contract(CONTRACT_ADDRESS,CONTRACT_ABI,signer);

            // 1. Get passenger addresses
            const addresses = await contract.getPassengersForRide(rideId);

            // 2. For each address, get user details
            const passengerList = await Promise.all(addresses.map(async (addr) => {
              const [name, age, genderBool] = await contract.getUserDetails(addr);
              return {
                address: addr,
                name,
                age: Number(age),
                gender: genderBool ? "Male" : "Female"
              };
            }));

            setPassengers(passengerList);
          } else {
            alert("Please install MetaMask.");
          }

      };

        fetchPassengers();
    }, [rideId]);


  return (
    <div className="flex flex-col min-h-screen bg-cover bg-center" style={{ backgroundImage: `url(${body})` }}>
      <Headerwallet walletAddress={walletAddress} />

      <main className="flex-grow flex justify-center items-center px-4 py-8">
        <div className="flex flex-col md:flex-row bg-gray-800 bg-opacity-80 text-white rounded-3xl p-10 shadow-xl">
          
          {/* Passenger Details */}
          <div className="w-full max-w-lg mr-0 md:mr-12">
            <h2 className="text-teal-300 text-2xl font-bold mb-6 text-center">Booked Passengers</h2>

            <div className="space-y-4">
                {passengers.length === 0 ? (
                <p className="text-center text-gray-300">No passengers booked yet.</p>
              ) :(

                  passengers.map((passenger, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center bg-white bg-opacity-20 px-4 py-3 rounded-md text-sm md:text-base"
                    >
                      <div className="text-black w-3/4 flex flex-col md:flex-row md:justify-between">
                        <p><strong>Name:</strong> {passenger.name}</p>
                        <p className="mt-1 md:mt-0"><strong>Gender:</strong> {passenger.gender}</p>
                      </div>
                      <button
                        onClick={() => navigate(`/passengerdetails/${rideId}/${passenger.address}`)}
                        className="bg-pink-200 text-black font-semibold px-4 py-1 rounded-md cursor-not-allowed"
                      >
                        Booked
                      </button>
                    </div>
              ))
            )}
            </div>
          </div>

          {/* Right image */}
          <div className="mt-10 md:mt-0">
            <img
              src={side}
              alt="Traveler"
              className="w-64 h-64 object-cover rounded-xl"
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BookedPassengersPage;