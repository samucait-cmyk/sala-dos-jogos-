import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
import { AuthProvider } from './context/AuthContext';
import { PostProvider } from './context/PostContext';
import { ThemeProvider } from './context/ThemeContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <PostProvider>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </PostProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);