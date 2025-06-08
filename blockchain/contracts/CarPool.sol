// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract carpooling {
    struct Human {
        string name;
        uint8 age;
        bool gender; // false = female, true = male
    }

    struct Ride {
        uint rideId;
        string origin;
        string destination;
        uint departuretime;
        uint fare;
        uint seats;
        string carModel;
        string carNumber;
        bool isActive;
    }

    mapping(address => Human) public addressDetails;
    mapping(uint => address) public rideOwner;
    mapping(uint => address[]) public passengersByRide;

    Ride[] public rides;
    uint public rideCount = 0;

    // Events
    event RideCreated(
        uint rideId,
        string origin,
        string destination,
        uint departuretime,
        uint fare,
        uint seats,
        string carModel,
        string carNumber
    );

    event RideBooked(
        uint rideId,
        address passenger
    );

    // Register a new user
    function newUser(string memory _name, uint8 _age, bool _gender) public {
        addressDetails[msg.sender] = Human(_name, _age, _gender);
    }

    // Create a new ride
    function createRide(
        string memory _origin,
        string memory _destination,
        uint _departuretime,
        uint _fare,
        uint _seats,
        string memory _carModel,
        string memory _carNumber
    ) public {
        rides.push(Ride(
            rideCount,
            _origin,
            _destination,
            _departuretime,
            _fare,
            _seats,
            _carModel,
            _carNumber,
            true // <-- Set isActive = true
        ));

        rideOwner[rideCount] = msg.sender;

        emit RideCreated(
            rideCount,
            _origin,
            _destination,
            _departuretime,
            _fare,
            _seats,
            _carModel,
            _carNumber
        );

        rideCount++;
    }

    function deleteRide(uint rideId) public {
        require(rideId < rides.length, "Invalid ride ID");
        require(msg.sender == rideOwner[rideId], "Only ride owner can delete the ride");

        rides[rideId].isActive = false; // You can add an `isActive` boolean to Ride struct
    }

    function getActiveRides() public view returns (Ride[] memory) {
        uint total = 0;

        // Count active
        for (uint i = 0; i < rides.length; i++) {
            if (rides[i].isActive) total++;
        }

        Ride[] memory activeRides = new Ride[](total);
        uint index = 0;

        for (uint i = 0; i < rides.length; i++) {
            if (rides[i].isActive) {
                activeRides[index] = rides[i];
                index++;
            }
        }

        return activeRides;
    }


    // Check if user exists
    function userExists(address _user) public view returns (bool) {
        return bytes(addressDetails[_user].name).length > 0;
    }


    // Events
    event RidePaid(address indexed from, address indexed to, uint amount);

    // Book a ride
    function bookRide(uint _rideId) public payable {
        require(_rideId < rides.length, "Ride does not exist");
        require(rides[_rideId].seats > 0, "No seats available");

        Ride storage ride = rides[_rideId];
        require(msg.value == ride.fare, "Incorrect fare sent");

        ride.seats--; 
        passengersByRide[_rideId].push(msg.sender);

        // Transfer the fare to the ride owner
        payable(rideOwner[_rideId]).transfer(msg.value);

        emit RidePaid(msg.sender, rideOwner[_rideId], msg.value);

        emit RideBooked(_rideId, msg.sender);
    }


    // Get all rides
    function getAllRides() public view returns (Ride[] memory) {
        return rides;
    }

    // Get passenger addresses for a specific ride
    function getPassengersForRide(uint _rideId) public view returns (address[] memory) {
        return passengersByRide[_rideId];
    }

    // Get human info for a given user address
    function getUserDetails(address _user) public view returns (string memory, uint8, bool) {
        Human memory h = addressDetails[_user];
        return (h.name, h.age, h.gender);
    }

    function getPassengerDetails(uint rideId, address passenger) public view returns (
        string memory name,
        uint8 age,
        bool gender,
        string memory origin,
        string memory destination,
        uint departureTime,
        uint fare,
        uint seats
    ) {
        Human memory h = addressDetails[passenger];
        Ride memory r = rides[rideId];
        return (
            h.name,
            h.age,
            h.gender,
            r.origin,
            r.destination,
            r.departuretime,
            r.fare,
            r.seats
        );
    }




}



