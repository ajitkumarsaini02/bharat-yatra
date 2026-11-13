import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Ensure clean light-mode-only initialization across all browser sessions
try {
  document.documentElement.classList.remove('dark');
  document.documentElement.removeAttribute('data-theme');
  localStorage.removeItem('bharat_yatra_theme');
} catch (e) {
  // Ignore in non-browser environments
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
