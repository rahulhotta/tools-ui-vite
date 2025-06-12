import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.scss'
import App from './App.tsx';

// import  Providers  from './Utils/Redux/provider.jsx';
import Providers from './Utils/Redux/provider.js';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <Providers>
        <App />
      </Providers>
  </StrictMode>,
)
