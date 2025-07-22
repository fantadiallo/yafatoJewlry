import { Outlet } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Layout() {
  return (
    <>
      <Header />
      <main className="container my-5">
        <Outlet />
      </main>
      <Footer />
      <ToastContainer position="top-center" autoClose={5000} />
    </>
  );
}
