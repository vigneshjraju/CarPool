import { BrowserProvider, Contract, ethers } from "ethers";
import { CONTRACT_ABI } from "../abi/abi";
import { Web3Provider } from "@ethersproject/providers";


const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;


// export const getContract = async () => {

//   if (!window.ethereum) throw new Error("MetaMask not detected");

//   const provider = new BrowserProvider(window.ethereum);

//   const signer = provider.getSigner();

//   return new Contract(CONTRACT_ADDRESS,CONTRACT_ABI, signer);

// };


export const getContract = async (useSigner = true) => {
  if (!window.ethereum) throw new Error("MetaMask not detected");

  const provider = new BrowserProvider(window.ethereum);

  if (useSigner) {
    const signer = await provider.getSigner();
    return new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
  } else {
    return new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider); // <-- provider only
  }
};




export const getUserAddress = async () => {
  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return signer.address;
};





export const getUserPublishedRides = async () => {

  const provider = new BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = await provider.getSigner();
  const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

  const userAddress = await signer.address;
  const allRides = await contract.getActiveRides();
  const publishedRides = [];

  for (let ride of allRides) {
    const owner = await contract.rideOwner(ride.rideId);
    if (owner.toLowerCase() === userAddress.toLowerCase()) {
      publishedRides.push({
        rideId: ride.rideId,
        origin: ride.origin,
        destination: ride.destination,
        departureTime: new Date(Number(ride.departuretime) * 1000).toLocaleString(),
        fare: ride.fare.toString(), // plain Wei string
        seats: ride.seats,
        carModel: ride.carModel,
        carNumber: ride.carNumber
      });
    }
  }

  return publishedRides;
};






export const fetchBookedRides = async () => {

  const contract = await getContract(false);
  const userAddress = await getUserAddress();
  const allRides = await contract.getAllRides();

  const bookedRides = [];

  for (let ride of allRides) {

    const rideId = Number(ride.rideId);
    const passengers = await contract.getPassengersForRide(rideId);
    
    const passengerAddresses = passengers.map(addr => addr.toLowerCase());

    if (passengerAddresses.includes(userAddress.toLowerCase())) {
      bookedRides.push({
        rideId,
        origin: ride.origin,
        destination: ride.destination,
        seats: Number(ride.seats),
        fare: ride.fare.toString(), // plain Wei string
        departureTime: new Date(Number(ride.departuretime) * 1000).toLocaleString(),
        carModel: ride.carModel,
        carNumber: ride.carNumber,
      });
    }
  }
  return bookedRides;
};






export const fetchAllRides = async () => {

  try{

    const contract = await getProviderContract(); // use provider!
    const rides = await contract.getActiveRides();

    // console.log("Raw rides data:", rides);
    // return rides;

    return rides.map(ride => ({
      rideId: ride.rideId, // assume already a number
      origin: ride.origin,
      destination: ride.destination,
      departureTime: new Date(Number(ride.departuretime) * 1000).toLocaleString(),
      fare: ride.fare.toString(), // plain Wei string 
      seats: ride.seats,
      carModel: ride.carModel,
      carNumber: ride.carNumber,

    }));



  } catch (error) {
    console.error('Error fetching rides:', error);
    throw new Error('Unable to fetch rides. Please try again later.');
  }
    
};





export const getRideById = async (rideId) => {
  const contract = await getContract();
  const allRides = await contract.getAllRides();

  const ride = allRides.find(r => Number(r.rideId) === parseInt(rideId));

  if (!ride) throw new Error("Ride not found");

  return {
    rideId: Number(ride.rideId),
    origin: ride.origin,
    destination: ride.destination,
    departureTime: new Date(Number(ride.departuretime) * 1000).toLocaleString(),
    fare: ride.fare.toString(), 
    seats: Number(ride.seats),
    carModel: ride.carModel,
    carNumber: ride.carNumber,
  };
};






export const bookRide = async (rideId,fare) => {

  try{

    const signer = await getProviderOrSigner(true); // Ensure you pass `true` to get a signer
    const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    
    const tx = await contract.bookRide(rideId, {
      value: fare // value in WEI!
    });

    console.log(`⛓️ Track: https://sepolia.etherscan.io/tx/${tx.hash}`);
    window.open(`https://sepolia.etherscan.io/tx/${tx.hash}`, "_blank");


    const receipt = await tx.wait();
    console.log(" Booked! Block:", receipt.blockNumber);
    console.log("Confirmations:", receipt.confirmations); // NOT a function
    return true;

  } catch (err) {
    console.error("Error booking ride:", err);
    throw new Error("Booking failed: " + err.message);
  }

    
};


export const releasePaymentToRider = async (rideId) => {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

    const tx = await contract.releasePaymentToRider(rideId); // Call contract
    const receipt = await tx.wait();

    console.log("Ride payment released. Block:", receipt.blockNumber);
    return true;
  } catch (err) {
    console.error("Failed to release payment:", err);
    throw err;
  }
};

export const checkPaymentReleased = async (rideId) => {

  try{
    const provider = new BrowserProvider(window.ethereum);
    const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
    
    const isReleased = await contract.paymentReleased(rideId);
    return isReleased;

  } catch (error) {
    console.error("Error checking payment status:", error);
    return false;
  }
};





// For reading (view functions)
export const getProviderContract = async () => {
  const provider = new BrowserProvider(window.ethereum);
  return new ethers.Contract(CONTRACT_ADDRESS,CONTRACT_ABI,provider);
};





 export const getProviderOrSigner = async (needSigner = false) => {
    
      if (!window.ethereum) throw new Error("MetaMask is not installed");
    
      const provider = new BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const { chainId } = await provider.getNetwork();
      console.log("Current Chain ID:", chainId);  // Log the chainId for debugging
    
      if (String(chainId) !== "11155111") {
        alert("Please switch to the Sepolia network");
        throw new Error("Incorrect network");
      }
    
      if (needSigner) {
        const signer = provider.getSigner();
        return signer;
      }
      return provider;
    };





    // Utility to get connectWallet
   export const connectWallet = async () => {
    try {
        const signer = await getProviderOrSigner(true);  
        const userAddress = await signer.getAddress();  
        return {
        walletConnected: true,
        address: userAddress,
        };

      } catch (err) {
        console.error("Wallet connection failed:", err);
        return {
          walletConnected: false,
          address: "",
        }; 
      }
    };

    export const connectWallet1 = async () => {
    try {
        const signer = await getProviderOrSigner(true);   
        const address = await signer.getAddress();
        return address

      } catch (err) {
        console.error("Wallet connection failed:", err);
        return {
          walletConnected: false,
          address: "",
        }; 
      }
    };




export const checkUser = async (setRegisteredUser) => {
  try {
    const signer = await getProviderOrSigner(true);
    const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    const address = await signer.getAddress();
    const exists = await contract.userExists(address); 
    if (exists) setRegisteredUser(true);
  } catch (err) {
    console.error(err);
  }
};





  export const newRide = async (signer, contract, origin, destination, departureTime, fare, seats,carModel,carNumber) => {
    try {

      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(CONTRACT_ADDRESS,CONTRACT_ABI, signer);


      const weiFare = BigInt(fare); // direct number input in Wei
      const tx = await contract.createRide(origin, destination, departureTime, weiFare, seats, carModel, carNumber);
      
      const receipt = await tx.wait();

      // Extract rideId from the RideCreated event
      const event = receipt.logs.find(log => log.fragment?.name === "RideCreated"); // Ethers v6 way
      const rideId = event?.args?.rideId?.toString(); // optional chaining in case of undefined

      console.log("✅ Ride published with ID:", rideId);
      console.log("📦 Confirmations:", receipt.confirmations);

      console.log("Ride published with ID:", rideId);
      return rideId;
    } catch (err) {
        console.error(err);
        return null;
    }
  }




  export const fetchRides = async () => {
  try {
    const provider = await getProviderOrSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS,CONTRACT_ABI, provider);

    const rides = await contract.getAllRides(); // or getAvailableRides()
    return rides;
  } catch (err) {
    console.error("Error fetching rides:", err);
    return [];
  }
};






  //  export const publishRide = async () => {
  //         try {
  //             const signer = await getProviderOrSigner(true);
  //             const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
              
  //             newRide(signer, contract, origin, destination, departureTime, fare, seats);
              
  //         }
  //         catch (err) {
  //             console.error(err);
  //         }
  
  
  //     }


  

  export const searchRide = async (_origin, _destination, departureTime, _seats) => {
    try {
      const provider = await getProviderOrSigner();
      const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
      let rides = [];

      const rideCount = await contract.rideCount();


      // setLoading(true);

      for (let i = 0; i < rideCount; i++) {
        let ride = await contract.rides(i);
        if (
            ride.origin === _origin &&
            ride.destination === _destination &&
            ride.seats >= _seats &&
            ride.departuretime >= departureTime
          ) {
          rides.push(ride);
        }
      }

      return rides;
      // setLoading(false);
    }
    catch (err) {
      console.error(err);
      return [];
    }
  }


  

  export const _newUser = async(_name, _age, _gender) => {
    try {
      const signer = await getProviderOrSigner(true);
      const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      const tx = await contract.newUser(_name, _age, _gender);
      await tx.wait();
    }
    catch (err) {
      console.error(err);
    }
  }

  