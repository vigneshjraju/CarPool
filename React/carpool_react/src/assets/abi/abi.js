 const CONTRACT_ABI = [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "rideId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "passenger",
          "type": "address"
        }
      ],
      "name": "RideBooked",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "rideId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "origin",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "destination",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "departuretime",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "fare",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "seats",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "carModel",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "carNumber",
          "type": "string"
        }
      ],
      "name": "RideCreated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "RidePaid",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "rideId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "rider",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "RidePaymentReleased",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "addressDetails",
      "outputs": [
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "uint8",
          "name": "age",
          "type": "uint8"
        },
        {
          "internalType": "bool",
          "name": "gender",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_rideId",
          "type": "uint256"
        }
      ],
      "name": "bookRide",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_origin",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_destination",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "_departuretime",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_fare",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_seats",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "_carModel",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_carNumber",
          "type": "string"
        }
      ],
      "name": "createRide",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "rideId",
          "type": "uint256"
        }
      ],
      "name": "deleteRide",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getActiveRides",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "rideId",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "origin",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "destination",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "departuretime",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "fare",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "seats",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "carModel",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "carNumber",
              "type": "string"
            },
            {
              "internalType": "bool",
              "name": "isActive",
              "type": "bool"
            }
          ],
          "internalType": "struct carpooling.Ride[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getAllRides",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "rideId",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "origin",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "destination",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "departuretime",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "fare",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "seats",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "carModel",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "carNumber",
              "type": "string"
            },
            {
              "internalType": "bool",
              "name": "isActive",
              "type": "bool"
            }
          ],
          "internalType": "struct carpooling.Ride[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "rideId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "passenger",
          "type": "address"
        }
      ],
      "name": "getPassengerDetails",
      "outputs": [
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "uint8",
          "name": "age",
          "type": "uint8"
        },
        {
          "internalType": "bool",
          "name": "gender",
          "type": "bool"
        },
        {
          "internalType": "string",
          "name": "origin",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "destination",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "departureTime",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "fare",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "seats",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_rideId",
          "type": "uint256"
        }
      ],
      "name": "getPassengersForRide",
      "outputs": [
        {
          "internalType": "address[]",
          "name": "",
          "type": "address[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_user",
          "type": "address"
        }
      ],
      "name": "getUserDetails",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        },
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8"
        },
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_name",
          "type": "string"
        },
        {
          "internalType": "uint8",
          "name": "_age",
          "type": "uint8"
        },
        {
          "internalType": "bool",
          "name": "_gender",
          "type": "bool"
        }
      ],
      "name": "newUser",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "passengerPayments",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "passengersByRide",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "paymentReleased",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "rideId",
          "type": "uint256"
        }
      ],
      "name": "releasePaymentToRider",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "rideCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "rideOwner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "rides",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "rideId",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "origin",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "destination",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "departuretime",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "fare",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "seats",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "carModel",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "carNumber",
          "type": "string"
        },
        {
          "internalType": "bool",
          "name": "isActive",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_user",
          "type": "address"
        }
      ],
      "name": "userExists",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]

  export {CONTRACT_ABI}