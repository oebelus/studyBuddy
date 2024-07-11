import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, createRoutesFromElements,Route, RouterProvider } from "react-router-dom";
import { App, Dashboard, Home, LoginPage, ProtectedRoute, QuizPage, RegisterPage } from "./imports"
import { HelmetProvider } from 'react-helmet-async';
import './index.css'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route path='/' element={<Home/>} />
      <Route path='login' element={<LoginPage/>} />
      <Route path='register' element={<RegisterPage/>} />
      <Route path='dashboard' element={<Dashboard/>} />
      <Route path='' element={<ProtectedRoute/>}>
        <Route path='/quiz' element={<QuizPage/>} />
      </Route>
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
