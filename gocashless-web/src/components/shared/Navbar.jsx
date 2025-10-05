"use client";

import React, { useState, useEffect } from "react";
import UserProfile from "../user-profile";
import { QrCodeIcon } from "../ui/Icons";

const Navbar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("https://randomuser.me/api/");
        const data = await response.json();
        const userData = data.results[0];
        setUser({
          name: `${userData.name.first} ${userData.name.last}`,
          email: userData.email,
          picture: userData.picture.medium,
        });
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };

    fetchUser();
  }, []);

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <QrCodeIcon className="h-8 w-8 text-gray-700" />
          <span className="text-2xl font-bold text-gray-700">GoCashless</span>
        </div>
        <div className="flex items-center">
          <UserProfile user={user} />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
