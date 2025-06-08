import React, { useEffect,useState } from 'react';
import { newRide,getUserPublishedRides } from '../Functions/functions.js';
import Headerwallet from '../components/Header2';
import Footer from '../components/Footer';
import { body,side} from '../Public/images.jsx';
import {  Contract, ethers } from "ethers";
import { Web3Provider } from "@ethersproject/providers";
import { CONTRACT_ABI } from '../abi/abi.js';
import { useNavigate } from 'react-router-dom';
import { connectWallet1 } from '../Functions/functions.js';


const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

const PublishRidePage = () => {

  const [walletAddress, setWalletAddress] = useState("");

    useEffect(() => {
      const loadWallet = async () => {
        const address = await connectWallet1();
        if (address) setWalletAddress(address);
      };
      loadWallet();
	}, []);
 

  const [contract, setContract] = useState(null);
  const [signer, setSigner] = useState(null);
  const navigate = useNavigate();

  const [publishedRides, setPublishedRides] = useState([]);

  useEffect(() => {
    
    const fetchPublishedRides = async () => {
      if (contract && signer) {
        try {
          const rides = await getUserPublishedRides(signer, contract);
          setPublishedRides(rides);
        } catch (err) {
          console.error("Error loading published rides:", err);
        }
      }
    };

    fetchPublishedRides();

  }, [contract, signer]);



  const [formData, setFormData] = useState({
    carModel: '',
    carNumber: '',
    origin: '',
    destination: '',
    departureTime: '',
    fare: '',
    seats: ''
  });


  useEffect(() => {
    const loadBlockchain = async () => {
      if (window.ethereum) {
        const provider = new Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signerInstance = provider.getSigner();
        const contractInstance = new Contract(CONTRACT_ADDRESS,CONTRACT_ABI, signerInstance);
        setSigner(signerInstance);
        setContract(contractInstance);
      } else {
        alert("Install MetaMask");
      }
    };
    loadBlockchain();
  }, []);




  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
      e.preventDefault();
      const { carModel, carNumber, origin, destination, departureTime, seats, fare } = formData;

      const timestamp = Math.floor(new Date(departureTime).getTime() / 1000); // Convert to UNIX

      if (!contract || !signer) {
        alert("Blockchain not ready");
        return;
      }

      try{

          
          const weiFare = BigInt(formData.fare); // keep as Wei

          const rideId = await newRide(
            signer,
            contract,
            origin,
            destination,
            timestamp,
            weiFare,
            parseInt(seats),
            carModel,
            carNumber
          );

          if (rideId === null) {
            throw new Error("Ride ID not returned");
          }

          alert("Ride published successfully!");

            setFormData({
              carModel: '',
              carNumber: '',
              origin: '',
              destination: '',
              departureTime: '',
              seats: '',
              fare: ''
          });

          navigate(`/bookedpassenger/${rideId}`);

      } 
      
    catch (error) {
        console.error("Error in publishing ride:", error);
        alert("Failed to publish ride. Please try again.");
      }
  };

  const handleDeleteRide = async (rideId) => {

      if (!contract || !signer) {
        alert("Blockchain not ready");
        return;
      }

      try {
        console.log("Deleting ride:", rideId);
        const tx = await contract.deleteRide(rideId);
        
        const receipt = await tx.wait(); // ⏳ Wait until it's mined
        console.log("🧾 Transaction confirmed in block:", receipt.blockNumber);

        alert(`Ride ${rideId} deleted successfully`);
        
        // Refresh published rides
        const updatedRides = await getUserPublishedRides(signer, contract);
        setPublishedRides(updatedRides);
      } catch (err) {
        console.error("Failed to delete ride:", err);
        alert("Failed to delete ride. You must be the owner.");
      }
  };


    


  return (
    <div
      className="flex flex-col min-h-screen bg-cover bg-center"
      style={{ backgroundImage:  `url(${body})` }}
    >
      <Headerwallet walletAddress={walletAddress} />

      <main className="flex-grow flex justify-center items-center px-4 py-8">
        <div className="flex flex-col md:flex-row bg-gray-800 bg-opacity-80 text-white rounded-3xl p-10 shadow-xl">

          {/* Form Section */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col space-y-4 w-full max-w-md mr-0 md:mr-12"
          >
            <h2 className="text-teal-300 text-2xl font-bold mb-2 text-center">Publish a Ride</h2>

            {/* Ride Fields */}
            <div>
              <label className="block text-teal-300 mb-1">Car Model</label>
              <input
                type="text"
                name="carModel"
                value={formData.carModel}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 rounded bg-gray-100 text-black"
              />
            </div>

            <div>
              <label className="block text-teal-300 mb-1">Car Number</label>
              <input
                type="text"
                name="carNumber"
                value={formData.carNumber}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 rounded bg-gray-100 text-black"
              />
            </div>

            <div>
              <label className="block text-teal-300 mb-1">Origin</label>
              <input
                type="text"
                name="origin"
                value={formData.origin}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 rounded bg-gray-100 text-black"
              />
            </div>

            <div>
              <label className="block text-teal-300 mb-1">Destination</label>
              <input
                type="text"
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 rounded bg-gray-100 text-black"
              />
            </div>

            <div>
              <label className="block text-teal-300 mb-1">Departure Time</label>
              <input
                type="datetime-local"
                name="departureTime"
                value={formData.departureTime}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 rounded bg-gray-100 text-black"
              />
            </div>

            <div>
              <label className="block text-teal-300 mb-1">Seats</label>
              <input
                type="number"
                name="seats"
                value={formData.seats}
                onChange={handleChange}
                required
                min={1}
                className="w-full px-3 py-2 rounded bg-gray-100 text-black"
              />
            </div>

            <div>
              <label className="block text-teal-300 mb-1">Fare</label>
              <input
                type="number"
                name="fare"
                min={1}
                value={formData.fare}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 rounded bg-gray-100 text-black"
                placeholder="Fare in Wei (e.g., 1)"
              />
            </div>

            {/* Submit Button */}
            <div className="text-center pt-2">
              <button
                type="submit"
                className="bg-pink-200 hover:bg-pink-300 text-black font-semibold px-6 py-2 rounded-md"
              >
                Register
              </button>
            </div>
          </form>

          {/* Image Section */}
          <div className="mt-10 md:mt-0">
            <img
              src={side}
              alt="Carpooling Image"
              className="w-64 h-64 object-cover rounded-xl"
            />
          </div>
        </div>
      </main>

      {/* Published Rides Section */}
        {publishedRides.length > 0 && (
          <section className="w-3/5 justify-center ml-[350px] bg-gray-800 bg-opacity-80 rounded-3xl p-6 text-black shadow-lg mt-8">
            <h3 className="text-xl text-center text-teal-300 font-semibold mb-6">Your Published Rides</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {publishedRides.map((ride) => (
                <div
                  key={ride.rideId}
                  className="p-4 bg-gray-100 rounded-xl shadow border border-teal-300"
                >
                  <p><strong>Ride ID:</strong> {ride.rideId}</p>
                  <p><strong>From:</strong> {ride.origin}</p>
                  <p><strong>To:</strong> {ride.destination}</p>
                  <p><strong>Departure:</strong> {ride.departureTime}</p>
                 
                  <p><strong>Fare:</strong> {ride.fare} WEI</p>

                  <p><strong>Seats Left:</strong> {ride.seats}</p>

                  {/* View Passengers button */}
                  <div className="mt-4 text-center">
                    <button
                      onClick={() => navigate(`/bookedpassenger/${ride.rideId}`)}
                      className="px-6 py-2 bg-teal-700 text-white rounded-lg hover:bg-teal-400"
                    >
                      View Passengers
                    </button>
                    
                  </div>

                  <div className="mt-4 text-center">
                    <button
                      onClick={() => handleDeleteRide(ride.rideId)}
                      className="mt-2 px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Delete Ride
                    </button>

                    
                  </div>

                </div>
              ))}
            </div>
          </section>
        )}

        <br />


      <Footer />
    </div>
  );
};

export default PublishRidePage;