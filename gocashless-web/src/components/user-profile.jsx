"use client";

import React from "react";
import Image from "next/image";
import { ChevronDownIcon } from "./ui/Icons";

const UserProfile = ({ user, onLogout }) => {
  if (!user) return null;

  return (
    <div className="flex items-center justify-between w-full p-4 bg-white shadow-md">
      <div className="flex items-center space-x-4">
        <Image
          src={user.picture || "/default-avatar.png"}
          alt={user.name || "User Avatar"}
          width={40}
          height={40}
          className="rounded-full"
        />
        <div>
          <p className="font-semibold text-gray-800">{user.name}</p>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
      </div>
      <div className="relative">
        <button className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100">
          <ChevronDownIcon className="h-5 w-5 text-gray-600" />
        </button>
        {/* Dropdown for logout, settings, etc. can be added here */}
      </div>
    </div>
  );
};

export default UserProfile;
