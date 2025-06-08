import React from 'react'
import Loader from './loader'

interface props{
    mainMsg:string
    subMsg:string
    loading:boolean
    onConfirm:()=>void
    onCancel:()=>void
}

const Confirm:React.FC<props> = ({mainMsg,subMsg,onCancel,onConfirm,loading})=> {
  return (
     <div className="p-3 fixed top-0 left-0 bg-white  items-center justify-center h-screen z-[999]">
   
               {/* edit overview form */}
      <div className="p-6 bg-white flex flex-col items-center justify-center gap-8 lg:mr-80 border shadow max-w-[450px] mx-5 mt-24">
       {/* Title */}
     {!loading &&  <div className="flex flex-col w-full h-full justify-between gap-3">
        <div className="text-lg">
        {mainMsg}
        </div>
        <div className="text-sm text-grey-600">
     <span className='text-error-500'>*</span>   {subMsg}
        </div>
       </div>    }
 {/* buttons */}
{!loading? <div className='flex justify-between w-full'>
     <button className='px-5 py-1 border rounded-lg cursor-pointer' onClick={onCancel}>
    No
</button>
<button className='px-5 py-1 bg-primary-500 text-black rounded-lg cursor-pointer' onClick={onConfirm}> 
    Yes
</button>
 </div>
 :
 <div>
     <div className=' bg-white  items-center justify-center w-full'><Loader /> </div>
 <div className='w-full text-center'>Procesing...</div>
 </div>}

 </div>
      </div>
  )
}

export default Confirm;