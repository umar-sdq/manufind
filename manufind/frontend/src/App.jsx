import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./Components/RootLayout/RootLayout.jsx";
import MainPage from "./Components/MainPage/MainPage.jsx";
import LoginForm from "./Components/LoginForm/LoginForm.jsx";
import SignUpForm from "./Components/SignupForm/SignupForm.jsx";
import ErrorPage from "./Components/Error/ErrorPage.jsx";
import Carte from "./Components/Map/map.jsx";
import ProfilePrestataire from "./Components/ProfilePrestataire/ProfilePrestataire.jsx";
import ProfileClient from "./Components/ProfileClient/ProfileClient.jsx";
import About from "./Components/About/About.jsx";
import Contact from "./Components/Contact/Contact.jsx";
import Services from "./Components/Services/Services.jsx";
import { AuthProvider } from "./Components/AuthContext/AuthContext.jsx";
import RequestCard from "./Components/RequestCard/RequestCard.jsx";
import RequestTab from "./Components/RequestTab/RequestTab.jsx";
import RequestClientTab from "./Components/RequestClientTab/RequestClientTab.jsx";
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute.jsx";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      errorElement: <ErrorPage />,
      children: [
        { path: "/", element: <About /> },
        { path: "/contact", element: <Contact /> },
        { path: "/services", element: <Services /> },
        { path: "/login", element: <LoginForm /> },
        { path: "/signup", element: <SignUpForm /> },

        {
          element: <ProtectedRoute allowedRoles={["client"]} />,
          children: [
            { path: "/profile-client", element: <ProfileClient /> },
            { path: "/requests-client", element: <RequestClientTab /> },
            { path: "/request-service", element: <RequestCard /> },
          ],
        },

        {
          element: <ProtectedRoute allowedRoles={["prestataire"]} />,
          children: [
            { path: "/profile-pres", element: <ProfilePrestataire /> },
            { path: "/requests", element: <RequestTab /> },
            { path: "/map", element: <Carte /> },
          ],
        },
      ],
    },
  ]);

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
