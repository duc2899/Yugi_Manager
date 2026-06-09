import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import App from 'App';
import { AuthProvider } from 'context/AuthContext';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { MaterialUIControllerProvider } from 'context';
import AlertProvider from './context/AlertContext';

const container = document.getElementById('app');
const root = createRoot(container);
const isElectron = window.navigator.userAgent.includes('Electron');
const Router = isElectron ? HashRouter : BrowserRouter;
const queryClient = new QueryClient();

root.render(
    <QueryClientProvider client={queryClient}>
        <AlertProvider>
            <AuthProvider>
                    <Router>
                        <MaterialUIControllerProvider>
                            <App />
                        </MaterialUIControllerProvider>
                    </Router>
            </AuthProvider>
        </AlertProvider>
    </QueryClientProvider>
);
