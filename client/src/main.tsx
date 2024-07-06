import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { App, Home, LoginPage, RegisterPage } from "./imports"
import './index.css'
import { HelmetProvider } from 'react-helmet-async';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route path='home' element={<Home/>} />
      <Route path='login' element={<LoginPage/>} />
      <Route path='register' element={<RegisterPage/>} />
    </Route>
  )
)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <RouterProvider router={router} />
    </HelmetProvider>
  </React.StrictMode>,
)
