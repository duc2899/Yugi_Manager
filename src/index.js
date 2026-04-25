import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from 'App';
import { AuthProvider } from 'context/AuthContext';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Material Dashboard 2 React Context Provider
import { MaterialUIControllerProvider } from 'context';

const container = document.getElementById('app');
const root = createRoot(container);

const queryClient = new QueryClient();

root.render(
    <QueryClientProvider client={queryClient}>
        <AuthProvider>
            <BrowserRouter>
                <MaterialUIControllerProvider>
                    <App />
                </MaterialUIControllerProvider>
            </BrowserRouter>
        </AuthProvider>
    </QueryClientProvider>
);
