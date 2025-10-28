
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
import RequestTab from "./Components/RequestTab/RequestsTab.jsx";
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
        { path: "/map", element: <Carte /> },
        { path: "/profile-client", element: <ProfileClient /> },
        { path: "/profile-pres", element: <ProfilePrestataire /> },
        { path: "/request-service", element: <RequestCard /> },
        { path: "/requests", element: <RequestTab /> }


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
