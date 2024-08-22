import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCaretRight,faFile} from '@fortawesome/free-solid-svg-icons'
import {useStudent} from './context/studentContext'
import Spinner from '../common/Spinner'

const Sidebar = ({student}) => {
  
  
  return (
    <div className=' w-[28%] h-[180vh] relative top-16 pt-10 px-8 bg-slate-100'>
      <h1 className='text-4xl font-bold p-3 mt-5'>Welcome back,{student.firstname}</h1>
      <h1 className='text-lg px-3'>Let’s help you land your dream career.....</h1>
      <div className=' p-6 border-b-2'>
        <h1 className='text-lg'>Assignments Pending</h1>
        <div className='flex flex-col items-center p-3 space-y-4'>
        
        <div className='  h-[70px] w-[75%]  rounded-lg border-b-4  flex flex-col items-center hover:cursor-pointer hover:scale-105 duration-300'>
        <div className='font-bold flex space-x-3 items-center'>
        <FontAwesomeIcon icon={faFile} className='text-blue-400'/>
          <p >Company 1</p>
          <FontAwesomeIcon icon={faCaretRight} className='text-blue-400'/>
        </div>
        <p className='text-red-500'>4 Days remaining</p>
        </div>

        <div className='  h-[70px] w-[75%]  rounded-lg border-b-4 flex flex-col items-center hover:cursor-pointer hover:scale-105 duration-300'>
        <div className='font-bold flex space-x-3 items-center'>
        <FontAwesomeIcon icon={faFile} className='text-blue-400'/>
          <p >Company 2</p>
          <FontAwesomeIcon icon={faCaretRight} className='text-blue-400'/>
        </div>
        <p className='text-red-500'>1 Days remaining</p>
        </div>

        <div className='  h-[70px] w-[75%]  rounded-lg border-b-4 flex flex-col items-center hover:cursor-pointer hover:scale-105 duration-300'>
        <div className='font-bold flex space-x-3 items-center'>
        <FontAwesomeIcon icon={faFile} className='text-blue-400'/>
          <p >Company 3</p>
          <FontAwesomeIcon icon={faCaretRight} className='text-blue-400'/>
        </div>
        <p className='text-red-500'>6 Days remaining</p>
        </div>

        <div className='  h-[70px] w-[75%]  rounded-lg border-b-4 flex flex-col items-center hover:cursor-pointer hover:scale-105 duration-300'>
        <div className='font-bold flex space-x-3 items-center'>
        <FontAwesomeIcon icon={faFile} className='text-blue-400'/>
          <p >Company 4</p>
          <FontAwesomeIcon icon={faCaretRight} className='text-blue-400'/>
        </div>
        <p className='text-red-500'>2 Days remaining</p>
        </div>



       
        </div>
      </div>
    </div>
  )
}

export default Sidebar