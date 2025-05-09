import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import { App, Dashboard, FlashcardsPage, Home, LoginPage, ProtectedRoute, Quiz, QuizPage, RegisterPage, Settings } from "./imports";
import { HelmetProvider } from 'react-helmet-async';
import './index.css';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route path='/' element={<Home />} />
      <Route element={<ProtectedRoute reverse={true} />}>
        <Route path='login' element={<LoginPage />} />
        <Route path='register' element={<RegisterPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path='dashboard' element={<Dashboard />} />
        <Route path='quiz' element={<QuizPage />} />
        <Route path='quiz/:id' element={<Quiz />} />
        <Route path='/quiz-sample' element={<Quiz />} />
        <Route path='flashcards' element={<FlashcardsPage />} />
        <Route path='settings' element={<Settings />} />
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <RouterProvider router={router} />
    </HelmetProvider>
  </React.StrictMode>,
);
