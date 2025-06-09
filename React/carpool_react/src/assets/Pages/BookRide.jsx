import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Headerwallet from '../components/Header2';
import Footer from '../components/Footer';
import { body,side} from '../Public/images.jsx';
import { searchRide,fetchAllRides } from '../Functions/functions.js';
import { bookRide,getUserAddress } from '../Functions/functions.js';
import { ethers } from 'ethers';
import { connectWallet1 } from '../Functions/functions.js';
import { CONTRACT_ABI } from '../abi/abi.js';
import { BrowserProvider,Contract } from 'ethers';


const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;


const BookRidePage = () => {

    const navigate = useNavigate();
    const [allRides, setAllRides] = useState([]);


    const [walletAddress, setWalletAddress] = useState("");

    useEffect(() => {
      const loadWallet = async () => {
        const address = await connectWallet1();
        if (address) setWalletAddress(address);
      };
      loadWallet();
    }, []);


    // Load all rides on page load
    useEffect(() => {
      const loadRides = async () => {
        try {
          const rides = await fetchAllRides();
          setAllRides(rides);
        } catch (error) {
          console.error('Error fetching all rides:', error);
        }
      };
      loadRides();
    }, []);

    const [formData, setFormData] = useState({
        origin: '',
        destination: '',
        departureTime: '',
        seats: '',
    });



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const rides = await searchRide(
        formData.origin,
        formData.destination,
        formData.departureTime,
        parseInt(formData.seats)
      );

      console.log("Filtered rides:", rides);
      
      navigate('/ridespages', {
        state: { searchCriteria: formData,rides }  // Pass rides data to the next page
      });
    } catch (err) {
      alert("Error while searching rides");
      console.error(err);
    }
  };

  const handleBookRide = async (ride) => {
    try {
          //  Add safety check here
      if (Number(ride.fare) > 1000000) {
        alert("Fare is too high! Please contact the ride owner to fix this.");
        return;
      }

      const rideId = ride.rideId;
      
      //  Prevent double booking
      const userAddress = await getUserAddress(); // gets connected wallet
      // 📦 Reconnect contract
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      
      const passengers = await contract.getPassengersForRide(rideId);

      const alreadyBooked = passengers
        .map(addr => addr.toLowerCase())
        .includes(userAddress.toLowerCase());

      if (alreadyBooked) {
        alert("You Have already booked this ride.");
        return;
      }
      
      
      const fareInWei = BigInt(ride.fare);
      const bookingSuccess = await bookRide(rideId, fareInWei); // pass fare in WEI

      if (bookingSuccess) {
        navigate(`/ridesdetails/${rideId}`);
        window.open(`https://sepolia.etherscan.io/tx/${bookingSuccess}`, "_blank");
      }
    } catch (error) {
      console.error("Error booking ride:", error);
      alert("Booking failed. Please try again.");
    }
  };


  return (
    <div
      className="flex flex-col min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${body})` }} // Ensure correct image path
    >
      <Headerwallet walletAddress={walletAddress} />

      <br />

      {/* Main Form Section */}
      <main className="flex-grow flex justify-center items-center px-4">
        <div className="flex flex-col md:flex-row items-center bg-gray-800 bg-opacity-80 text-white rounded-3xl p-10 shadow-xl">
          
          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col space-y-4 w-full max-w-sm mr-0 md:mr-10"
          >
            <h2 className="text-teal-300 text-2xl font-bold mb-2 text-center">Book a Ride</h2>
            
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
                min="1"
                required
                className="w-full px-3 py-2 rounded bg-gray-100 text-black"
              />
            </div>

            {/* Submit */}
            <div className="text-center mt-4">
              <button
                type="submit"
                className="px-6 py-2 rounded bg-pink-200 text-black font-semibold hover:bg-pink-300 transition"
              >
                Search
              </button>
            </div>
          </form>

          {/* Image */}
          <div className="mt-8 md:mt-0 md:ml-10">
            <img
              src={side}
              alt="Car Travel"
              className="w-64 h-64 rounded-xl object-cover"
            />
          </div>
        </div>

        




      </main>
      <br />

      {/* All Rides Section */}
        <section className="w-3/5  justify-center ml-[350px]  bg-gray-800 bg-opacity-80 rounded-3xl p-6 text-black shadow-lg">
          <h3 className="text-xl text-center text-teal-300 font-semibold mb-6">All Available Rides</h3>
          {allRides.length === 0 ? (
            <p className="text-center text-gray-500">No rides available.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {allRides.map((ride) => (
                <div
                  key={ride.rideId}
                  className="p-4 bg-gray-100 rounded-xl shadow border border-teal-300"
                >
                  <p><strong>From:</strong> {ride.origin}</p>
                  <p><strong>To:</strong> {ride.destination}</p>
                  <p><strong>Time:</strong> {ride.departureTime}</p>
                  <p><strong>Seats:</strong> {ride.seats}</p>

                  <p>
                    <strong>Fare:</strong> {ride.fare} Wei
                  </p>

                  <p><strong>Car:</strong> {ride.carModel} ({ride.carNumber})</p>

                  {/* Book button */}
                  <div className="mt-4 text-center">
                    <button
                      onClick={() => handleBookRide(ride)}
                      className="px-6 py-2 bg-teal-700 text-white rounded-lg hover:bg-teal-400"
                    >
                      Book
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}
        </section>
        <br />

      <Footer />
    </div>
  );
};

export default BookRidePage;