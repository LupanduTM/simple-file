'use client';

import { Search, User } from 'lucide-react';

export default function Header() {
  return (
    <header className="flex items-center justify-between p-4 bg-white border-b h-16 sticky top-0">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <input
          type="search"
          placeholder="Search..."
          className="pl-8 pr-4 py-2 w-64 rounded-lg border bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <div>
        <User size={24} className="cursor-pointer" />
      </div>
    </header>
  );
}
