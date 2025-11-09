import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import { PlayerProvider } from './context/PlayerContext';
import { CatalogProvider } from './context/CatalogContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <CatalogProvider>
        <PlayerProvider>
          <App />
        </PlayerProvider>
      </CatalogProvider>
    </BrowserRouter>
  </React.StrictMode>
);
