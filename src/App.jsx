import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import MainLayout from "./Components/Layouts/MainLayout/MainLayout";
import HomeCard from "./Components/Features/HomeCard/HomeCard";
import {
  LoginPage,
  SignUpPage,
  AdminLogin,
  CreateBlog,
  DisplayBlogById,
  UpdateBlog,
  ContactForm,
  AboutUs,
  NotFoundPage,
  AdminDashboard,
  ServicePage,
  FrontendServicePage,
  ClientAccountPage,
  EditServicePage,
  ClientPage,
} from "./Pages";
import AdminLayout from "./Components/Layouts/Admin/AdminLayout";
import "./App.css";
import AdminProtectedRoute from "./routes/AdminProtectedRoutes/AdminProtectedRoute";
import BlogPage from "./Components/Features/BlogCard/BlogPage";
import ClientProtectedRoutes from "./routes/ClientProtectedRoutes/ClientProtectedRoutes";
import ProtectedEditRoute from "./routes/ClientProtectedRoutes/ProtectedEditRoute";
import {
  initializeAuth,
  selectIsAuthInitialized,
} from "./Stores/Slices/client.slices";
import Portfolio from "./Pages/Portfolio/Portfolio";
import {
  loadFromStorage,
  initializeAdminAuth,
  selectIsAdminInitialized,
} from "./Stores/Slices/admin.slices";

function AuthInitializer({ children }) {
  const dispatch = useDispatch();
  const isClientInitialized = useSelector(selectIsAuthInitialized);
  const isAdminInitialized = useSelector(selectIsAdminInitialized);

  useEffect(() => {
    // Load admin auth from localStorage immediately
    dispatch(loadFromStorage());

    // Initialize both auth flows
    dispatch(initializeAuth());
    dispatch(initializeAdminAuth());
  }, [dispatch]);

  if (!isClientInitialized || !isAdminInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-lg font-medium">Loading application...</p>
        </div>
      </div>
    );
  }

  return children;
}

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,
      children: [
        {
          index: true,
          element: <HomeCard />,
        },
        {
          path: "login",
          element: <LoginPage />,
        },
        {
          path: "signup",
          element: <SignUpPage />,
        },
        // Move ClientProtectedRoutes outside of blog
        {
          element: <ClientProtectedRoutes />,
          children: [
            {
              path: "account",
              element: <ClientAccountPage />,
            },
            // Other protected routes can go here
          ],
        },
        {
          path: "blog",
          children: [
            {
              index: true,
              element: <BlogPage />,
            },
            {
              path: ":blogId",
              element: <DisplayBlogById />,
            },

            {
              element: <ClientProtectedRoutes />,
              children: [
                {
                  path: "create",
                  element: <CreateBlog />,
                },
                {
                  path: ":blogId/edit",
                  element: (
                    <ProtectedEditRoute>
                      <UpdateBlog />
                    </ProtectedEditRoute>
                  ),
                },
              ],
            },
          ],
        },
        {
          path: "contact",
          element: <ContactForm />, // Add contact route
        },
        {
          path: "About",
          element: <AboutUs />,
        },
        {
          path: "portfolio",
          element: <Portfolio />,
        },
        {
          path: "services",
          element: <FrontendServicePage />,
        },
      ],
    },
    {
      path: "/admin",
      children: [
        {
          path: "login",
          element: <AdminLogin />,
        },
        {
          element: <AdminProtectedRoute />,
          children: [
            {
              element: <AdminLayout />,
              children: [
                {
                  index: true, // This will match /admin
                  element: <Navigate to="/admin" replace />,
                },
                {
                  path: "dashboard",
                  element: <AdminDashboard />,
                },
                {
                  path: "services",
                  element: <ServicePage />,
                },
                {
                  path: "clients",
                  element: <ClientPage />,
                },
                {
                  path: "services/edit/:serviceId",
                  element: <EditServicePage />,
                },
              ],
            },
          ],
        },
      ],
    },
    // Add this catch-all route at the end
    {
      path: "*",
      element: <NotFoundPage />,
    },
  ]);

  return (
    <AuthInitializer>
      <RouterProvider router={router} />
    </AuthInitializer>
  );
}

export default App;
