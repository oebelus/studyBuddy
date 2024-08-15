import { Navigate, Outlet } from "react-router-dom"
import { initialState, reducer } from "../reducer/store";
import { useReducer } from "react";

export default function ProtectedRoute() {
    const [state, ] = useReducer(reducer, initialState)

    if (state.user) {
        return <Outlet/> 
    } else {
        return <Navigate to="/login"/>
    }
}