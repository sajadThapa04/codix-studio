import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
    createBlog,
    getAllBlogs,
    getBlogById,
    updateBlog,
    deleteBlog,
    toggleLike,
    uploadCoverImage,
    getBlogsByAuthor,
    setBlogAuthToken
} from '../../Api/blog.api';

// Async thunks
export const fetchAllBlogs = createAsyncThunk(
    'blog/fetchAll',
    async (queryParams, { rejectWithValue }) => {
        try {
            const response = await getAllBlogs(queryParams);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const fetchBlogById = createAsyncThunk(
    'blog/fetchById',
    async (blogId, { rejectWithValue }) => {
        try {
            console.log('Fetching blog with ID:', blogId); // Add this
            const response = await getBlogById(blogId);
            console.log('API Response:', response); // Add this
            return response;
        } catch (error) {
            console.error('Error fetching blog:', error); // Add this
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const addNewBlog = createAsyncThunk(
    'blog/create',
    async (blogData, { rejectWithValue }) => {
        try {
            const response = await createBlog(blogData);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const editBlog = createAsyncThunk(
    'blog/update',
    async ({ blogId, updateData }, { rejectWithValue }) => {
        try {
            const response = await updateBlog(blogId, updateData);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const removeBlog = createAsyncThunk(
    'blog/delete',
    async (blogId, { rejectWithValue }) => {
        try {
            const response = await deleteBlog(blogId);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const likeBlog = createAsyncThunk(
    'blog/like',
    async (blogId, { rejectWithValue }) => {
        try {
            const response = await toggleLike(blogId);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const uploadBlogCoverImage = createAsyncThunk(
    'blog/uploadCover',
    async ({ blogId, imageFile, altText }, { rejectWithValue }) => {
        try {
            const response = await uploadCoverImage(blogId, imageFile, altText);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const fetchAuthorBlogs = createAsyncThunk(
    'blog/fetchByAuthor',
    async ({ authorId, queryParams }, { rejectWithValue }) => {
        try {
            const response = await getBlogsByAuthor(authorId, queryParams);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const initialState = {
    blogs: [],
    currentBlog: null,
    authorBlogs: [],
    pagination: {
        page: 1,
        pages: 1,
        total: 0,
        limit: 10
    },
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    operationStatus: 'idle', // For create/update/delete operations
    operationError: null,
    operationType: null,

};

const blogSlice = createSlice({
    name: 'blog',
    initialState,
    reducers: {
        resetBlogState: (state) => {
            state.status = 'idle';
            state.error = null;
            state.operationStatus = 'idle';
            state.operationError = null;

        },
        clearCurrentBlog: (state) => {
            state.currentBlog = null;
        },
        setBlogAuth: (state, action) => {
            setBlogAuthToken(action.payload);
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch all blogs
            .addCase(fetchAllBlogs.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchAllBlogs.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.blogs = action.payload.blogs;
                state.pagination = {
                    page: action.payload.page,
                    pages: action.payload.pages,
                    total: action.payload.total,
                    limit: action.payload.limit || 10
                };
            })
            .addCase(fetchAllBlogs.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })

            // Fetch blog by ID
            .addCase(fetchBlogById.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchBlogById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.currentBlog = action.payload;
            })
            .addCase(fetchBlogById.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })

            // Create blog
            .addCase(addNewBlog.pending, (state) => {
                state.operationStatus = 'loading';
                state.operationError = null;
            })
            .addCase(addNewBlog.fulfilled, (state, action) => {
                state.operationStatus = 'succeeded';
                state.blogs.unshift(action.payload);
            })
            .addCase(addNewBlog.rejected, (state, action) => {
                state.operationStatus = 'failed';
                state.operationError = action.payload;
            })

            // Update blog
            .addCase(editBlog.pending, (state) => {
                state.operationStatus = 'loading';
                state.operationError = null;
            })
            .addCase(editBlog.fulfilled, (state, action) => {
                state.operationStatus = 'succeeded';
                const index = state.blogs.findIndex(blog => blog._id === action.payload._id);
                if (index !== -1) {
                    state.blogs[index] = action.payload;
                }
                if (state.currentBlog?._id === action.payload._id) {
                    state.currentBlog = action.payload;
                }
            })
            .addCase(editBlog.rejected, (state, action) => {
                state.operationStatus = 'failed';
                state.operationError = action.payload;
            })

            // Delete blog
            .addCase(removeBlog.pending, (state) => {
                state.operationStatus = 'loading';
                state.operationError = null;
            })
            .addCase(removeBlog.fulfilled, (state, action) => {
                state.operationStatus = 'succeeded';
                state.blogs = state.blogs.filter(blog => blog._id !== action.meta.arg);
                if (state.currentBlog?._id === action.meta.arg) {
                    state.currentBlog = null;
                }
            })
            .addCase(removeBlog.rejected, (state, action) => {
                state.operationStatus = 'failed';
                state.operationError = action.payload;
            })

            // Toggle like
            .addCase(likeBlog.pending, (state) => {
                state.operationStatus = 'loading';
                state.operationError = null;
            })
            .addCase(likeBlog.fulfilled, (state, action) => {
                state.operationStatus = 'succeeded';
                if (state.currentBlog) {
                    state.currentBlog.likes = action.payload.likes;
                }
                const blogIndex = state.blogs.findIndex(b => b._id === action.meta.arg);
                if (blogIndex !== -1) {
                    state.blogs[blogIndex].likes = action.payload.likes;
                }
            })
            .addCase(likeBlog.rejected, (state, action) => {
                state.operationStatus = 'failed';
                state.operationError = action.payload;
            })

            // Upload cover image
            .addCase(uploadBlogCoverImage.pending, (state) => {
                state.operationStatus = 'loading';
                state.operationError = null;
            })
            .addCase(uploadBlogCoverImage.fulfilled, (state, action) => {
                state.operationStatus = 'succeeded';
                if (state.currentBlog) {
                    state.currentBlog.coverImage = action.payload.coverImage;
                }
                const blogIndex = state.blogs.findIndex(b => b._id === action.meta.arg.blogId);
                if (blogIndex !== -1) {
                    state.blogs[blogIndex].coverImage = action.payload.coverImage;
                }
            })
            .addCase(uploadBlogCoverImage.rejected, (state, action) => {
                state.operationStatus = 'failed';
                state.operationError = action.payload;
            })

            // Fetch blogs by author
            .addCase(fetchAuthorBlogs.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchAuthorBlogs.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.authorBlogs = action.payload.blogs;
                state.pagination = {
                    page: action.payload.page,
                    pages: action.payload.pages,
                    total: action.payload.total,
                    limit: action.payload.limit || 10
                };
            })
            .addCase(fetchAuthorBlogs.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    }
});

export const { resetBlogState, clearCurrentBlog, setBlogAuth } = blogSlice.actions;

// Selectors
export const selectAllBlogs = (state) => state.blog.blogs;
export const selectCurrentBlog = (state) => state.blog.currentBlog;
export const selectAuthorBlogs = (state) => state.blog.authorBlogs;
export const selectBlogStatus = (state) => state.blog.status;
export const selectBlogError = (state) => state.blog.error;
export const selectBlogPagination = (state) => state.blog.pagination;
export const selectBlogOperationStatus = (state) => state.blog.operationStatus;
export const selectBlogOperationError = (state) => state.blog.operationError;

export default blogSlice.reducer;