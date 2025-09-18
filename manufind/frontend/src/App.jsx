import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import RootLayout from "./Components/RootLayout/RootLayout.jsx";
import MainPage from './Components/MainPage/MainPage.jsx';
import LoginForm from './Components/LoginForm/LoginForm.jsx';
import SignUpForm from './Components/SignupForm/SignUpForm.jsx';
import ErrorPage from './Components/Error/ErrorPage.jsx';
import Contact from './Components/Contact/Contact.jsx';
import About from './Components/About/About.jsx';
import Services from './Components/Services/Services.jsx';
function App() {
  const router = createBrowserRouter([{
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,

    children: [
      { path: "/", element: <MainPage /> },
      { path: "/login", element: <LoginForm /> },
      { path: "/signup", element: <SignUpForm /> },
      { path: "/contact", element: <Contact /> },
      { path: "/about", element: <About /> },
      { path: "/services", element: <Services /> },
    ]
  }
  ]);
  return (
    <RouterProvider router={router} />
  )
}

export default App
