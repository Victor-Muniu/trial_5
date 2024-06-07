import { createBrowserRouter, Navigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import LoginPage from "../pages/LoginPage";
import MainLayout from "../components/layout/MainLayout";
import Dashboard from "../pages/Dashboard";
import Bar from "../pages/Bar";
import Reststaurant2 from "../pages/Reststaurant2";
import Menu from "../pages/Menu";
import Menu2 from "../pages/Menu2";
import Bills from "../pages/Bills";


const checkAuth = (path) => {
    const isAuthenticated = localStorage.getItem("token");
    const isProtectedRoute = path === '/dashboard' || path === '/emails';
    
    if (isProtectedRoute && !isAuthenticated) {
      return '/';
    }
  
    return null;
  };



export const router = createBrowserRouter([
    {
        path: "/",
        element: <AppLayout />,
        children: [
          {
            index: true,
            element: <LoginPage />
          }
        ]
    },
    {
        path: "/dashboard",
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: <Dashboard />
          }
        ]
    },
    {
      path: '/bar',
      element: <MainLayout />,
      children: [
        {
          index: true,
          element:<Bar />
        }
      ]
    },
    {
      path: '/restaurant', 
      element: <MainLayout />,
      children: [
        {
          index: true,
          element: <Reststaurant2 />
        }
      ]
    },  
    {
      path: '/menu/:table_no',
      element: <MainLayout />,
      children: [
        {
          index: true,
          element: <Menu />
        }
      ]
    },
    {
      path: '/menu2/:table_no',
      element: <MainLayout />,
      children: [
        {
          index: true,
          element: <Menu2 />
        }
      ]
    },
    {
      path: '/bills',
      element: <MainLayout />, 
      children: [
        {
          index: true,
          element: <Bills />
        }
      ]
    },
    {
      path: "*",
      element: <Navigate to={checkAuth()} replace />, 
      
    }  
])