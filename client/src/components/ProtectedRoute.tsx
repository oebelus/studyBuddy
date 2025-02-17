import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../hooks/useAuth";

export default function ProtectedRoute() {
    const { isAuthenticated } = useAuth();
    console.log("isAuthenticated", isAuthenticated)
    
    if (isAuthenticated) {
        return <Outlet/> 
    } else {
        return <Navigate to="/login"/>
    }
}