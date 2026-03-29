import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import CartDrawer from '../cart/CartDrawer';
import ChatWidget from '../chat/ChatWidget';

export default function PublicLayout() {
  return (
    <>
      <Navbar />
      <CartDrawer />
      <main className="min-h-screen">
        <Outlet />
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}
