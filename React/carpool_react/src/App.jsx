import { useState } from 'react'
import Connect from './assets/Pages/Connect_metamask.jsx';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import RegisterPage from './assets/Pages/Register.jsx';
import DashboardPage from './assets/Pages/Dashboard.jsx';
import BookRidePage from './assets/Pages/BookRide.jsx';
import AvailableRidesPage from './assets/Pages/RidesPage.jsx';
import RidesBookedPage from './assets/Pages/RidesBooked.jsx';
import RideDetailsPage from './assets/Pages/RidesDetails.jsx';
import PublishRidePage from './assets/Pages/PublishRide.jsx';
import BookedPassengersPage from './assets/Pages/BookedPassenger.jsx';
import PassengerDetailsPage from './assets/Pages/PassengerDetails.jsx';

function App() {
  

  return (
    
      <BrowserRouter>
      <Routes>
          <Route path='/' element={<Navigate to="/connect" />} />
          {/* <Route path="/login" element={<Login />} /> */}
          <Route path='/connect' element={<Connect/>} />
          <Route path='/register' element={<RegisterPage/>} />
          <Route path='/dashboard' element={<DashboardPage/>} />     
          <Route path='/bookride' element={<BookRidePage/>} />               
          <Route path='/ridespages' element={<AvailableRidesPage/>} />  
          <Route path='/ridesbooked' element={<RidesBookedPage/>} />                            
          <Route path='/ridesdetails/:rideId' element={<RideDetailsPage/>} />                            
          <Route path='/publishride' element={<PublishRidePage/>} />                          
          <Route path='/bookedpassenger/:rideId' element={<BookedPassengersPage/>} />                
          <Route path='/passengerdetails/:rideId/:address' element={<PassengerDetailsPage/>} />                                            


      </Routes>
    </BrowserRouter>
    
  )
}

export default App
