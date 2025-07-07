import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
    loginClient,
    registerClient,
    logoutClient,
    getCurrentClient,
    refreshClientToken,
    updateClientDetails,
    uploadClientProfileImage,
    setClientAuthToken
} from '../../Api/client.api';

// Async thunks
export const loginUser = createAsyncThunk(
    'client/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await loginClient(credentials);
            setClientAuthToken(response.data.accessToken);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// In your client slice
export const initializeAuth = createAsyncThunk(
    'client/initialize',
    async (_, { dispatch, rejectWithValue }) => {
        try {
            // First try to get current user (which will fail if token is invalid)
            const userResponse = await dispatch(fetchCurrentUser());
            return userResponse.payload;
        } catch (error) {
            // If that fails, try silent refresh
            try {
                await dispatch(silentRefresh());
                // Then try to get user again
                const userResponse = await dispatch(fetchCurrentUser());
                return userResponse.payload;
            } catch (refreshError) {
                // If both fail, clear auth state
                dispatch(clearAuthState());
                return rejectWithValue(refreshError);
            }
        }
    }
);

export const registerUser = createAsyncThunk(
    'client/register',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await registerClient(userData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const fetchCurrentUser = createAsyncThunk(
    'client/fetchCurrentUser',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getCurrentClient();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const silentRefresh = createAsyncThunk(
    'client/silentRefresh',
    async (_, { rejectWithValue }) => {
        try {
            const response = await refreshClientToken();
            setClientAuthToken(response.data.accessToken);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const logoutUser = createAsyncThunk(
    'client/logout',
    async (_, { rejectWithValue }) => {
        try {
            await logoutClient();
            setClientAuthToken(null);
            return null;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const updateUserDetails = createAsyncThunk(
    'client/updateDetails',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await updateClientDetails(userData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const updateProfileImage = createAsyncThunk(
    'client/updateProfileImage',
    async (imageFile, { rejectWithValue }) => {
        try {
            const response = await uploadClientProfileImage(imageFile);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const initialState = {
    user: null,
    accessToken: null,
    status: 'idle',
    error: null,
    isInitialized: false
};

const clientSlice = createSlice({
    name: 'client',
    initialState,
    reducers: {
        resetAuthState: (state) => {
            state.status = 'idle';
            state.error = null;
        },
        setAccessToken: (state, action) => {
            state.accessToken = action.payload;
        },
        clearAuthState: (state) => {
            state.user = null;
            state.accessToken = null;
            state.status = 'idle';
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Initialize auth
            .addCase(initializeAuth.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(initializeAuth.fulfilled, (state) => {
                state.status = 'succeeded';
                state.isInitialized = true;
                state.error = null;
            })
            .addCase(initializeAuth.rejected, (state, action) => {
                state.status = 'failed';
                state.isInitialized = true;
                state.error = action.payload;
            })

            // Login
            .addCase(loginUser.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload.client;
                state.accessToken = action.payload.accessToken;
                state.error = null;
                state.isInitialized = true;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })

            // Silent refresh
            .addCase(silentRefresh.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(silentRefresh.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.accessToken = action.payload.accessToken;
                state.error = null;
            })
            .addCase(silentRefresh.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
                state.accessToken = null;
                state.user = null;
            })

            // Logout
            .addCase(logoutUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.status = 'idle';
                state.user = null;
                state.accessToken = null;
                state.error = null;
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })

            // Fetch current user
            .addCase(fetchCurrentUser.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchCurrentUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload;
                state.error = null;
            })
            .addCase(fetchCurrentUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })

            // Update user details
            .addCase(updateUserDetails.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(updateUserDetails.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload;
                state.error = null;
            })
            .addCase(updateUserDetails.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })

            // Update profile image
            .addCase(updateProfileImage.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(updateProfileImage.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user.profileImage = action.payload.profileImage;
                state.error = null;
            })
            .addCase(updateProfileImage.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    }
});

export const { resetAuthState, setAccessToken, clearAuthState } = clientSlice.actions;

// Selectors
export const selectCurrentUser = (state) => state.client.user;
export const selectAuthToken = (state) => state.client.accessToken;
export const selectAuthStatus = (state) => state.client.status;
export const selectAuthError = (state) => state.client.error;
export const selectIsAuthInitialized = (state) => state.client.isInitialized;

export default clientSlice.reducer;