import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../hooks/useAuth";

export default function ProtectedRoute() {
    const { isAuthenticated } = useAuth();
    
    if (isAuthenticated) {
        return <Outlet/> 
    } else {
        return <Navigate to="/login"/>
    }
}