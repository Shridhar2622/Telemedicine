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

 
      <div className="flex items-center gap-3">
        <ProfileMenu avtar={avtar} />
      </div>

    </header>
  );
}

export default Header;
