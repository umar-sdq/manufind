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
import Carte from './Components/Map/map.jsx';
function App() {
  const router = createBrowserRouter([{
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,

    children: [
      { path: "/", element: <MainPage /> },
      { path: "/login", element: <LoginForm /> },
      { path: "/signup", element: <SignUpForm /> },
      {path:"/map", element:<Carte/>} 
    ]
  }
  ]);
  return (
    <RouterProvider router={router} />
  )
}

export default App
