import Sidebar from './Sidebar';
import Header from './Header';

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-stone-100 font-sans">
      <Sidebar />
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        <Header />
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}