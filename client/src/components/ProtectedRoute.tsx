import { Navigate, Outlet } from "react-router-dom"
import { initialState, reducer } from "../reducer/store";
import { useReducer } from "react";

export default function ProtectedRoute() {
    const [state, ] = useReducer(reducer, initialState)
console.log(state.user)
    if (state.user != null) {
        return <Outlet/> 
    } else {
        return <Navigate to="/login"/>
    }
}