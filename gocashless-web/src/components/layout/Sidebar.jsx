
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Route,
  Bus,
  Ticket,
  User,
  Users,
  FileText,
  Settings,
  LogOut,
  ChevronFirst,
  ChevronLast,
} from 'lucide-react';
import { QrCodeIcon } from '@/components/ui/Icons';

const sidebarItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Routes',
    href: '/dashboard/routes',
    icon: Route,
  },
  {
    name: 'Bus Stops',
    href: '/dashboard/bus-stops',
    icon: Bus,
  },
  {
    name: 'Fares',
    href: '/dashboard/fares',
    icon: Ticket,
  },
  {
    name: 'Conductors',
    href: '/dashboard/conductors',
    icon: User,
  },
  {
    name: 'Passengers',
    href: '/dashboard/passengers',
    icon: Users,
  },
  {
    name: 'Transactions',
    href: '/dashboard/transactions',
    icon: FileText,
  },
  {
    name: 'Reports',
    href: '/dashboard/reports',
    icon: FileText,
  },
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
  },
  {
    name: 'Admin Management',
    href: '/dashboard/settings/admins',
    icon: User,
  },
];

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(true);
  const pathname = usePathname();

  return (
    <aside className={`h-screen sticky top-0 bg-white shadow-lg transition-all ${isExpanded ? 'w-64' : 'w-20'}`}>
      <div className="flex items-center justify-between p-4 border-b h-16">
        <div className={`flex items-center ${isExpanded ? '' : 'justify-center w-full'}`}>
          <QrCodeIcon className="h-8 w-8 text-gray-600" />
          {isExpanded && <span className="text-xl font-bold text-gray-700 ml-2">GoCashless</span>}
        </div>
        <button onClick={() => setIsExpanded((curr) => !curr)} className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100">
          {isExpanded ? <ChevronFirst /> : <ChevronLast />}
        </button>
      </div>

      <nav className="h-full flex flex-col">
        <ul className="flex-1 px-3">
          {sidebarItems.map((item) => (
            <li key={item.name}>
              <Link href={item.href}>
                <div
                  className={`
                    flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer
                    transition-colors group
                    ${
                      pathname === item.href
                        ? 'bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800'
                        : 'hover:bg-indigo-50 text-gray-600'
                    }
                  `}
                >
                  <item.icon size={20} />
                  <span className={`overflow-hidden transition-all ${isExpanded ? 'w-52 ml-3' : 'w-0'}`}>{item.name}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        <div className="border-t flex p-3">
          <div className="w-10 h-10 rounded-md bg-indigo-100 flex items-center justify-center">
            <User size={20} className="text-indigo-800" />
          </div>
          <div className={`flex justify-between items-center overflow-hidden transition-all ${isExpanded ? 'w-52 ml-3' : 'w-0'}`}>
            <div className="leading-4">
              <h4 className="font-semibold">Admin</h4>
              <span className="text-xs text-gray-600">admin@gocashless.com</span>
            </div>
            <LogOut size={20} className="cursor-pointer" />
          </div>
        </div>
      </nav>
    </aside>
  );
}
