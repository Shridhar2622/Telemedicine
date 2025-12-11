import React from "react";
import logo from "../../../public/Logo.png";
import { Link } from "react-router-dom";
import ProfileMenu from "./ProfileMenu";

function Header({avtar}) {
  return (
    <header className="w-full h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 flex items-center justify-between sticky top-0 z-50">
      

      <Link to="/" className="flex items-center gap-2 cursor-pointer">
        <img
          src={logo}
          alt="App Logo"
          className="w-10 h-10 object-contain"
        />
        <span className="text-white font-semibold text-lg hidden sm:block">
          MedConnect
        </span>
      </Link>


      <div className="flex-1"></div>

      <div className="flex items-center gap-4">
        
       <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 21.5 21.5"
    width="26"
    height="26"
    className="fill-gray-600 hover:fill-blue-600 cursor-pointer transition"
  >
    <path
      fillRule="evenodd"
      d="M10.75 6C8.13 6 6 8.13 6 10.75s2.13 4.75 4.75 4.75 4.75-2.13 4.75-4.75S13.37 6 10.75 6ZM10.75 0c.41 0 .75.34.75.75v3c0 .41-.34.75-.75.75S10 4.16 10 3.75v-3c0-.41.34-.75.75-.75ZM10.75 17c.41 0 .75.34.75.75v3c0 .41-.34.75-.75.75s-.75-.34-.75-.75v-3c0-.41.34-.75.75-.75ZM0 10.75c0-.41.34-.75.75-.75h3c.41 0 .75.34.75.75s-.34.75-.75.75h-3c-.41 0-.75-.34-.75-.75ZM17 10.75c0-.41.34-.75.75-.75h3c.41 0 .75.34.75.75s-.34.75-.75.75h-3c-.41 0-.75-.34-.75-.75ZM3.15 18.35a.754.754 0 0 1 0-1.06l2.12-2.12c.29-.29.77-.29 1.06 0 .29.29.29.77 0 1.06l-2.12 2.12c-.29.29-.77.29-1.06 0ZM18.35 18.35c.29-.29.29-.77 0-1.06l-2.12-2.12c-.29-.29-.77-.29-1.06 0s-.29.77 0 1.06l2.12 2.12c.29.29.77.29 1.06 0ZM15.17 6.33a.754.754 0 0 1 0-1.06l2.12-2.12c.29-.29.77-.29 1.06 0 .29.29.29.77 0 1.06l-2.12 2.12c-.29.29-.77.29-1.06 0ZM6.33 6.33c.29-.29.29-.77 0-1.06L4.21 3.15a.754.754 0 0 0-1.06 0c-.29.29-.29.77 0 1.06l2.12 2.12c.29.29.77.29 1.06 0Z"
    />
  </svg>
        <ProfileMenu avtar={avtar} />
      </div>

    </header>
  );
}

export default Header;
