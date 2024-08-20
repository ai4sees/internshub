import React from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import RightSide from './RightSide'


const Home = () => {
  return (
    <div className='Home'>
      {/* <Navbar/> */}
      <Sidebar/>
      <RightSide/>
      
    </div>
  )
}

export default Home