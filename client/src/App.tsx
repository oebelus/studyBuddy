import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.min.css';

export default function App() {
  return (
    <div>
      <ToastContainer position="bottom-center" limit={4} />
      <Outlet />
    </div>
  )
}
