import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AuthContextProvider } from './contexts/AuthContextProvider.tsx'
import ErrorPage from './components/ErrorPage.tsx'
import Login from './components/Login.tsx'
import Home from './components/Home.tsx'
import Images from './components/Images.tsx'
import Games from './components/Games.tsx'

const router = createBrowserRouter([
  { path: '/', errorElement: <ErrorPage />, element: <Login /> },
  { path: '/home', errorElement: <ErrorPage />, element: <Home /> },
  {
    path: '/images',
    errorElement: <ErrorPage />,
    element: <Images />,
  },
  {
    path: '/games',
    errorElement: <ErrorPage />,
    element: <Games />,
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthContextProvider>
      <RouterProvider router={router} />
    </AuthContextProvider>
  </StrictMode>
)
