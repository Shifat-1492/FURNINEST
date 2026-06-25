import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import axios from 'axios'

// Configure axios baseURL for API calls
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'https://furninest-bzdp.onrender.com'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
