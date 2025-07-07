// src/routes/ClientProtectedRoutes/ProtectedEditRoute.jsx
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetBlogById } from "../../Hooks/Blog/blogHooks";
import { LoadingSpinner } from "../../Components/Ui";

const ProtectedEditRoute = ({ children }) => {
  const { blogId } = useParams();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.client.user);
  const { data: currentBlog, isLoading, error } = useGetBlogById(blogId);

  useEffect(() => {
    if (!isLoading && !error) {
      // Check if we have both user and blog data
      if (currentUser && currentBlog) {
        // Verify if current user is the author of the blog
        if (currentBlog.author?._id !== currentUser._id) {
          // If not the author, redirect to the blog view
          navigate(`/blog/${blogId}`, { replace: true });
        }
      }
    }
  }, [currentUser, currentBlog, blogId, navigate, isLoading, error]);

  if (isLoading) return <LoadingSpinner />;
  if (error) navigate(`/blog/${blogId}`, { replace: true });

  // Only render children if user is authorized
  return currentBlog?.author?._id === currentUser?._id ? children : null;
};

export default ProtectedEditRoute;
