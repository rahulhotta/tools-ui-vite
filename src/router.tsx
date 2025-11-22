import { createBrowserRouter } from "react-router-dom";
import ImageConverter from "./Components/ImageConverter/ImageConverter";
import UrlShortener from "./Components/url-shortener/url-shortener";
import LandingPage from "./Components/home/Landing";
import Layout from "./layout";
import JsonEditor from "./Components/JSONeditor/JsonEditor";
import JwtDecoder from "./Components/JwtDecoder/JwtDecoder";
import QRCodeGenerator from "./Components/QRCodeGenerator/QRCodeGenerator";
import Base64Page from "./Components/Base64/Base64EncoderDecoder";

const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
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
            {
                path: 'jsons/json-editor',
                element: <JsonEditor />,
            },
            {
                path: 'jwt/jwt-decoder',
                element: <JwtDecoder />,
            },
            {
                path: 'others/qr-generator',
                element: <QRCodeGenerator />,
            },
            {
                path: 'base64/base64-enoderdecoder',
                element: <Base64Page />,
            }

            // Add more routes here
        ]
    }
])

export default router