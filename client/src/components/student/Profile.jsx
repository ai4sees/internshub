import React from 'react'
import Education from './Education'

const Profile = () => {
  return (
    <div className='container mx-auto p-4 border border-black mt-[68px]'>
      <h1 className="text-2xl font-bold mb-4">Profile</h1>

      <section className="mb-8">
        <Education />
      </section>
    </div>
  )
}

export default Profile