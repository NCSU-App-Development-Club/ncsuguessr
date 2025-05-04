import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AuthContextProvider } from './contexts/AuthContextProvider.tsx'
import ErrorPage from './components/ErrorPage.tsx'
import Login from './components/Login.tsx'
import Home from './components/Home.tsx'

const router = createBrowserRouter([
  { path: '/', errorElement: <ErrorPage />, element: <Login /> },
  { path: '/home', errorElement: <ErrorPage />, element: <Home /> },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthContextProvider>
      <RouterProvider router={router} />
    </AuthContextProvider>
  </StrictMode>
)
