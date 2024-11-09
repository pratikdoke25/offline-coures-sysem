import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // This should match the CSS file where you added the Tailwind directives

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
