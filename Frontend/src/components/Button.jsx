import React from 'react'
function Button({ value, disabled }) {
  return (
    <button
    type='submit'
      disabled={disabled}
      className={`w-full text-[15px] bg-[#4F46E5] text-white h-10 rounded-2xl 
        ${disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-[#4338ca]"}`}
    >
      {value}
    </button>
  );
}


export default Button
