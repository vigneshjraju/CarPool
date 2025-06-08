import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Headerwallet from '../components/Header2';
import Footer from '../components/Footer';
import { body,side} from '../Public/images.jsx';
import { CONTRACT_ABI } from '../abi/abi.js';
import { BrowserProvider, Contract, ethers } from "ethers";
import { connectWallet1 } from '../Functions/functions.js';

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

const PassengerDetailsPage = () => {

    const [walletAddress, setWalletAddress] = useState("");

    useEffect(() => {
      const loadWallet = async () => {
        const address = await connectWallet1();
        if (address) setWalletAddress(address);
      };
      loadWallet();
	}, []);

    const { rideId, address } = useParams();
    const [passenger, setPassenger] = useState(null);

    useEffect(() => {
      const fetchPassenger = async () => { 

        if (window.ethereum) {

          const provider = new BrowserProvider(window.ethereum);
          await provider.send("eth_requestAccounts", []);
          const signer = await provider.getSigner();
          const contract = new Contract(CONTRACT_ADDRESS,CONTRACT_ABI, signer);

    

          // Get passenger info
          const [name, age, genderBool] = await contract.getUserDetails(address);
          const gender = genderBool ? "Male" : "Female";


          // Get ride info
          const ride = await contract.rides(rideId); // assuming rides is public array
          const from = ride.origin;
          const to = ride.destination;
          const time = new Date(Number(ride.departuretime) * 1000).toLocaleTimeString(); // assuming it's a UNIX timestamp
          const fare = Number(ride.fare);


          setPassenger({
            name,
            age: Number(age),
            gender,
            from,
            to,
            time,
            seats: 1, // assuming each passenger books 1 seat
            fare,
            status: "Booked"
          });

        } else {
        alert("Please install MetaMask.");
        };

      };

      fetchPassenger();
    }, [rideId, address]);

  if (!passenger) return <div className="text-white text-center mt-10">Loading...</div>;


  return (
    <div className="flex flex-col min-h-screen bg-cover bg-center" style={{ backgroundImage: `url(${body})` }}>
      <Headerwallet walletAddress={walletAddress} />

      <main className="flex-grow flex justify-center items-center px-4 py-8">
        <div className="flex flex-col md:flex-row bg-gray-800 bg-opacity-80 text-white rounded-3xl p-10 shadow-xl">
          
          {/* Passenger Info Card */}
          <div className="w-full max-w-lg mr-0 md:mr-12">
            <h2 className="text-teal-300 text-2xl font-bold mb-6 text-center">Passenger Details</h2>

            <div className="bg-gray-100 text-black rounded-xl px-6 py-6">
              <div className="flex justify-center mb-4">
                <span className="bg-pink-200 text-black font-semibold px-4 py-1 rounded-md cursor-not-allowed">
                  {passenger.status}
                </span>
              </div>

              <p className="text-center font-semibold text-lg mb-2">Name: {passenger.name}</p>
              <p className="text-center text-md text-gray-700 mb-6">
                Age : {passenger.age}<br />
                Gender : {passenger.gender}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-4 text-sm md:text-base">
                <p><strong>From:</strong> {passenger.from}</p>
                <p><strong>To:</strong> {passenger.to}</p>
                <p><strong>Time:</strong> {passenger.time}</p>
                <p><strong>Seats Booked:</strong> {passenger.seats}</p>
              </div>

              <div className="text-center mt-6">

                <p className="text-2xl font-bold text-rose-800">

                  Paid: {passenger.fare} Wei

                </p>

              </div>
            </div>
          </div>

          {/* Image */}
          <div className="mt-10 md:mt-0">
            <img
              src={side}
              alt="Passenger background"
              className="w-64 h-64 object-cover rounded-xl"
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PassengerDetailsPage;