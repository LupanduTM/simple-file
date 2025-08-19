
import Navbar from '@/components/shared/Navbar';

export default function DashboardLayout({ children }) {
  // Here you would add logic to protect this route
  // For now, it just provides a layout with a navbar
  return (
    <section>
      <Navbar />
      {children}
    </section>
  );
}
