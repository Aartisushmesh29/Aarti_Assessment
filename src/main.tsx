import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { PrimeReactProvider } from 'primereact/api';
import 'primereact/resources/themes/lara-light-indigo/theme.css';  // Theme
import 'primereact/resources/primereact.min.css';                   // Core CSS
import 'primeicons/primeicons.css';                                 // Icons
import 'primeflex/primeflex.css';                                   // Flex utilities


createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <PrimeReactProvider> 
        <App />
      </PrimeReactProvider>
  </StrictMode>,
)
