import React from 'react'

interface props{
    mainMsg:string
    subMsg:string
    onConfirm:()=>void
    onCancel:()=>void
}

const Confirm:React.FC<props> = ({mainMsg,subMsg,onCancel,onConfirm})=> {
  return (
     <div className="p-3 bg-white w-full fixed items-center justify-center h-screen ">
   
               {/* edit overview form */}
      <div className="p-6 bg-white w-full flex flex-col items-center justify-center gap-8 lg:mr-80 border shadow max-w-[450px] mx-5 mt-24">
       {/* Title */}
       <div className="flex flex-col w-full h-full justify-between gap-3">
        <div className="text-lg">
        {mainMsg}
        </div>
        <div className="text-sm text-grey-600">
     <span className='text-error-500'>*</span>   {subMsg}
        </div>
       </div>    
 {/* buttons */}
 <div className='flex justify-between w-full'>
     <button className='px-5 py-1 border rounded-lg cursor-pointer' onClick={onCancel}>
    No
</button>
<button className='px-5 py-1 bg-primary-500 text-black rounded-lg cursor-pointer' onClick={onConfirm}> 
    Yes
</button>
 </div>

 </div>
      </div>
  )
}

export default Confirm;