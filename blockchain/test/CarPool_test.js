const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CarPool Smart Contract", function () {
  let carpool;
  let owner;
  let user1;
  let user2;

  beforeEach(async () => {
    // Get signers (accounts)
    [owner, user1, user2] = await ethers.getSigners();

    // Deploy the contract
    const CarPool = await ethers.getContractFactory("carpooling");
    carpool = await CarPool.deploy();
    await carpool.deployed();
  });

  it("should register a new user", async () => {
    await carpool.connect(user1).newUser("Alice", 25, true);
    const userDetails = await carpool.addressDetails(user1.address);
    expect(userDetails.name).to.equal("Alice");
    expect(userDetails.age).to.equal(25);
    expect(userDetails.gender).to.equal(true); // true = male
  });

  it("should create a new ride", async () => {
    await carpool.connect(user1).createride("CityA", "CityB", 1717500000, 1, 3);
    const ride = await carpool.rides(0);
    expect(ride.origin).to.equal("CityA");
    expect(ride.destination).to.equal("CityB");
    expect(ride.departuretime).to.equal(1717500000);
    expect(ride.fare).to.equal(1);
    expect(ride.seats).to.equal(3);
  });

  it("should allow booking a ride", async () => {
    await carpool.connect(user1).createride("CityA", "CityB", 1717500000, 1, 2);

    const rideBefore = await carpool.rides(0);
    expect(rideBefore.seats).to.equal(2);

    await carpool.connect(user2).bookRide(0);

    const rideAfter = await carpool.rides(0);
    expect(rideAfter.seats).to.equal(1);
  });

  it("should map rider to a ride correctly", async () => {
    await carpool.connect(user1).createride("CityA", "CityB", 1717500000, 1, 1);
    await carpool.connect(user2).bookRide(0);

    const rider = await carpool.rideToRider(0, 1); // 1 is the remaining seat count after booking
    expect(rider).to.equal(user2.address);
  });
});

