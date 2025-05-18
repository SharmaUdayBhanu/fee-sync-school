
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Set mobile viewport height correctly
const setAppHeight = () => {
  const doc = document.documentElement;
  doc.style.setProperty('--app-height', `${window.innerHeight}px`);
};

// Initialize app height and set listener for resizing
setAppHeight();
window.addEventListener('resize', setAppHeight);

createRoot(document.getElementById("root")!).render(<App />);
