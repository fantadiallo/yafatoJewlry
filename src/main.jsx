if (typeof window !== "undefined" && import.meta.env.PROD) {
  const origFetch = window.fetch;
  window.fetch = (...args) => {
    const url = String(args[0] || "");
    if (url.includes("/api/subscribe")) {
      return Promise.resolve(
        new Response("{}", { status: 200, headers: { "Content-Type": "application/json" } })
      );
    }
    return origFetch(...args);
  };
}

import "./bootstrap-supabase-fetch";
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/main.scss';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
