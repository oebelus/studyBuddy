import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../hooks/useAuth";

export default function ProtectedRoute({ reverse = false }) {
    const { isAuthenticated } = useAuth();
    
    if (reverse) {
        return isAuthenticated ? <Navigate to="/dashboard"/> : <Outlet/>
    }
    return isAuthenticated ? <Outlet/> : <Navigate to="/login"/>
}