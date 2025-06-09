
# CarPool 🚗

CarPool is a decentralized Peer-to-Peer (P2P) carpooling DApp built on the Ethereum blockchain using **Solidity**, **Hardhat**, **React.js**, and **Ethers.js v6**. It allows users to publish and book rides in a trustless and transparent way, where ETH payments are handled directly via smart contracts.

## Features

- 🧾 **Register Users**: Users can register with name, age, and gender.
- 📤 **Publish a Ride**: Ride owners can publish rides with car details, fare, and available seats.
- 📥 **Book a Ride**: Users can book rides by paying ETH directly to the ride owner.
- 👥 **View Passengers**: Ride publishers can see a list of passengers for each ride.
- 🔍 **Search Rides**: Passengers can search for rides by origin, destination, and time.
- 🔒 **MetaMask Integration**: Wallet connection and authentication.
- 🧹 **Smart Contract Logic**: Validations for seat availability, ownership, and ETH transfer.

## Tech Stack

- **Frontend**: React.js, TailwindCSS
- **Blockchain**: Solidity, Hardhat
- **Ethereum Network**: Sepolia Testnet (via Alchemy)
- **Web3**: Ethers.js v6

## Setup Instructions

### Prerequisites

- Node.js & npm
- MetaMask Extension
- Git
- Hardhat (`npm install --save-dev hardhat`)
- Alchemy Account (for Sepolia testnet RPC URL)

### Smart Contract Deployment

```bash
cd blockchain
npx hardhat compile
npx hardhat run scripts/deploy.js --network sepolia
```

### Frontend

```bash
cd React
cd carpool_react
npm install
npm run dev
```

## Environment Variables

Create a `.env` file in the frontend directory:

```
VITE_CONTRACT_ADDRESS=your_contract_address_here
```

Create a `.env` file in the Hardhat (blockchain) directory:

```
PRIVATE_KEY=your_private_key
SEPOLIA_URL=https://eth-sepolia.g.alchemy.com/v2/sepolia_api-key
```


## License

MIT License