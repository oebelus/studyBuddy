import InnerLayout from "../components/dashboard/layout/InnerLayout";
import InnerNavbar from "../components/dashboard/layout/InnerNavbar";
import LargeSidebar from "../components/dashboard/layout/LargeSidebar";
import SmallSidebar from "../components/dashboard/layout/SmallSidebar";
import Navbar from "../components/dashboard/Navbar";

export default function Dashboard() {
  return (
    <div>
      <Navbar />
      <div className="flex w-screen h-screen text-gray-700">
        <SmallSidebar />
        <LargeSidebar />
        <div className="flex flex-col flex-grow">
          <InnerNavbar />
          <InnerLayout />
        </div>
      </div>
    </div>
  )
}
