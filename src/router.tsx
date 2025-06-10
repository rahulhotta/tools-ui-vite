import { createBrowserRouter } from "react-router-dom";
import ImageConverter from "./Components/ImageConverter/ImageConverter";
import NavBar from "./Components/navBar/navBar";
import UrlShortener from "./Components/url-shortener/url-shortener";
import LandingPage from "./Components/home/Landing";
const router = createBrowserRouter([
    {
        path:'/',
        element:<NavBar />,
         children: [
            {
                 path: '/',
            element: <LandingPage />,
            },
        {
            path: 'images/image-converter',
            element: <ImageConverter />,
        },
        {
            path: 'links/url-shortener',
            element: <UrlShortener />,
        },
      // Add more routes here
    ]
    }
])

export default router