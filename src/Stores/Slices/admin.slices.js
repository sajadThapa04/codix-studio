import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
    initSuperadmin,
    loginAdmin,
    refreshAdminToken,
    logoutAdmin,
    createAdmin,
    deleteAdmin,
    changePassword,
    requestPasswordReset,
    resetPassword,
    setAuthToken
} from '../../Api/admin.api';

// Helper function for safe JSON parsing
const safeJsonParse = (str) => {
    try {
        return JSON.parse(str);
    } catch (e) {
        return null;
    }
};

// Async Thunks
export const initializeSuperadmin = createAsyncThunk(
    'admin/initSuperadmin',
    async (adminData, { rejectWithValue }) => {
        try {
            const response = await initSuperadmin(adminData);
            const { accessToken, refreshToken, admin } = response.data;

            setAuthToken(accessToken);
            localStorage.setItem('adminAuthToken', accessToken);
            localStorage.setItem('adminRefreshToken', refreshToken);
            localStorage.setItem('adminData', JSON.stringify(admin));

            return { accessToken, refreshToken, admin };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const adminLogin = createAsyncThunk(
    'admin/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await loginAdmin(credentials);
            const { accessToken, refreshToken, admin } = response.data;

            setAuthToken(accessToken);
            localStorage.setItem('adminAuthToken', accessToken);
            localStorage.setItem('adminRefreshToken', refreshToken);
            localStorage.setItem('adminData', JSON.stringify(admin));

            return { accessToken, refreshToken, admin };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const adminLogout = createAsyncThunk(
    'admin/logout',
    async (_, { rejectWithValue }) => {
        try {
            await logoutAdmin();
            setAuthToken(null);

            ['adminAuthToken', 'adminRefreshToken', 'adminData'].forEach(key => {
                localStorage.removeItem(key);
            });

            return null;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const refreshAdminAuthToken = createAsyncThunk(
    'admin/refreshToken',
    async (_, { getState, rejectWithValue }) => {
        try {
            const refreshToken = getState().admin.refreshToken || localStorage.getItem('adminRefreshToken');
            if (!refreshToken) throw new Error('No refresh token available');

            const response = await refreshAdminToken(refreshToken);
            const { accessToken, refreshToken: newRefreshToken } = response.data;

            setAuthToken(accessToken);
            localStorage.setItem('adminAuthToken', accessToken);
            localStorage.setItem('adminRefreshToken', newRefreshToken);

            return { accessToken, refreshToken: newRefreshToken };
        } catch (error) {
            ['adminAuthToken', 'adminRefreshToken', 'adminData'].forEach(key => {
                localStorage.removeItem(key);
            });
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const initializeAdminAuth = createAsyncThunk(
    'admin/initialize',
    async (_, { dispatch, rejectWithValue }) => {
        try {
            const refreshToken = localStorage.getItem('adminRefreshToken');
            if (refreshToken) {
                await dispatch(refreshAdminAuthToken()).unwrap();
            }
            return null;
        } catch (error) {
            return rejectWithValue(error.payload || error.message);
        }
    }
);

export const addAdmin = createAsyncThunk(
    'admin/create',
    async (adminData, { getState, rejectWithValue }) => {
        try {
            const { accessToken } = getState().admin;
            if (!accessToken) throw new Error('Authentication required');

            const response = await createAdmin(adminData, accessToken);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const removeAdmin = createAsyncThunk(
    'admin/delete',
    async (adminId, { getState, rejectWithValue }) => {
        try {
            const { accessToken } = getState().admin;
            if (!accessToken) throw new Error('Authentication required');

            await deleteAdmin(adminId, accessToken);
            return adminId;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const updateAdminPassword = createAsyncThunk(
    'admin/changePassword',
    async ({ currentPassword, newPassword }, { getState, rejectWithValue }) => {
        try {
            const { accessToken } = getState().admin;
            if (!accessToken) throw new Error('Authentication required');

            const response = await changePassword({ currentPassword, newPassword }, accessToken);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const requestAdminPasswordReset = createAsyncThunk(
    'admin/requestPasswordReset',
    async (email, { rejectWithValue }) => {
        try {
            const response = await requestPasswordReset(email);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const resetAdminPassword = createAsyncThunk(
    'admin/resetPassword',
    async ({ token, newPassword }, { rejectWithValue }) => {
        try {
            const response = await resetPassword(token, newPassword);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Initial State
const initialState = {
    currentAdmin: null,
    admins: [],
    accessToken: null,
    refreshToken: null,
    status: 'idle',
    error: null,
    operationStatus: 'idle',
    operationError: null,
    isSuperadminInitialized: false,
    isInitialized: false,
    passwordReset: {
        status: 'idle',
        error: null
    }
};

// Slice Definition
const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        resetAdminState: (state) => {
            state.status = 'idle';
            state.error = null;
            state.operationStatus = 'idle';
            state.operationError = null;
        },
        clearAdminAuth: (state) => {
            state.currentAdmin = null;
            state.accessToken = null;
            state.refreshToken = null;
            state.status = 'idle';
            state.error = null;
        },
        loadFromStorage: (state) => {
            const token = localStorage.getItem('adminAuthToken');
            const refreshToken = localStorage.getItem('adminRefreshToken');
            const adminData = safeJsonParse(localStorage.getItem('adminData'));

            if (token && refreshToken && adminData) {
                state.currentAdmin = adminData;
                state.accessToken = token;
                state.refreshToken = refreshToken;
                state.status = 'succeeded';
                setAuthToken(token);
            }
            state.isInitialized = true;
        }
    },
    extraReducers: (builder) => {
        builder
            // Auth Initialization
            .addCase(initializeSuperadmin.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(initializeSuperadmin.fulfilled, (state, action) => {
                state.currentAdmin = action.payload.admin;
                state.accessToken = action.payload.accessToken;
                state.refreshToken = action.payload.refreshToken;
                state.status = 'succeeded';
                state.isSuperadminInitialized = true;
                state.isInitialized = true;
            })
            .addCase(initializeSuperadmin.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
                state.isInitialized = true;
            })

            // Login
            .addCase(adminLogin.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(adminLogin.fulfilled, (state, action) => {
                state.currentAdmin = action.payload.admin;
                state.accessToken = action.payload.accessToken;
                state.refreshToken = action.payload.refreshToken;
                state.status = 'succeeded';
                state.error = null;
                state.isInitialized = true;
            })
            .addCase(adminLogin.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
                state.isInitialized = true;
            })

            // Logout
            .addCase(adminLogout.pending, (state) => {
                state.operationStatus = 'loading';
                state.operationError = null;
            })
            .addCase(adminLogout.fulfilled, (state) => {
                state.currentAdmin = null;
                state.accessToken = null;
                state.refreshToken = null;
                state.operationStatus = 'succeeded';
                state.status = 'idle';
            })
            .addCase(adminLogout.rejected, (state, action) => {
                state.operationStatus = 'failed';
                state.operationError = action.payload;
            })

            // Token Refresh
            .addCase(refreshAdminAuthToken.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(refreshAdminAuthToken.fulfilled, (state, action) => {
                state.accessToken = action.payload.accessToken;
                state.refreshToken = action.payload.refreshToken;
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(refreshAdminAuthToken.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
                state.currentAdmin = null;
                state.accessToken = null;
                state.refreshToken = null;
            })

            // Auth Initialization
            .addCase(initializeAdminAuth.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(initializeAdminAuth.fulfilled, (state) => {
                state.status = 'succeeded';
                state.isInitialized = true;
            })
            .addCase(initializeAdminAuth.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
                state.isInitialized = true;
            })

            // Admin Management
            .addCase(addAdmin.pending, (state) => {
                state.operationStatus = 'loading';
                state.operationError = null;
            })
            .addCase(addAdmin.fulfilled, (state, action) => {
                state.operationStatus = 'succeeded';
                state.admins.push(action.payload.admin);
            })
            .addCase(addAdmin.rejected, (state, action) => {
                state.operationStatus = 'failed';
                state.operationError = action.payload;
            })

            .addCase(removeAdmin.pending, (state) => {
                state.operationStatus = 'loading';
                state.operationError = null;
            })
            .addCase(removeAdmin.fulfilled, (state, action) => {
                state.operationStatus = 'succeeded';
                state.admins = state.admins.filter(admin => admin._id !== action.payload);
            })
            .addCase(removeAdmin.rejected, (state, action) => {
                state.operationStatus = 'failed';
                state.operationError = action.payload;
            })

            // Password Management
            .addCase(updateAdminPassword.pending, (state) => {
                state.operationStatus = 'loading';
                state.operationError = null;
            })
            .addCase(updateAdminPassword.fulfilled, (state) => {
                state.operationStatus = 'succeeded';
            })
            .addCase(updateAdminPassword.rejected, (state, action) => {
                state.operationStatus = 'failed';
                state.operationError = action.payload;
            })

            .addCase(requestAdminPasswordReset.pending, (state) => {
                state.passwordReset.status = 'loading';
                state.passwordReset.error = null;
            })
            .addCase(requestAdminPasswordReset.fulfilled, (state) => {
                state.passwordReset.status = 'succeeded';
            })
            .addCase(requestAdminPasswordReset.rejected, (state, action) => {
                state.passwordReset.status = 'failed';
                state.passwordReset.error = action.payload;
            })

            .addCase(resetAdminPassword.pending, (state) => {
                state.passwordReset.status = 'loading';
                state.passwordReset.error = null;
            })
            .addCase(resetAdminPassword.fulfilled, (state) => {
                state.passwordReset.status = 'succeeded';
            })
            .addCase(resetAdminPassword.rejected, (state, action) => {
                state.passwordReset.status = 'failed';
                state.passwordReset.error = action.payload;
            });
    }
});

// Actions
export const { resetAdminState, clearAdminAuth, loadFromStorage } = adminSlice.actions;

// Selectors
export const selectCurrentAdmin = (state) => state.admin.currentAdmin;
export const selectAdminToken = (state) => state.admin.accessToken;
export const selectAdminRefreshToken = (state) => state.admin.refreshToken;
export const selectAdminStatus = (state) => state.admin.status;
export const selectAdminError = (state) => state.admin.error;
export const selectAllAdmins = (state) => state.admin.admins;
export const selectAdminOperationStatus = (state) => state.admin.operationStatus;
export const selectAdminOperationError = (state) => state.admin.operationError;
export const selectIsSuperadminInitialized = (state) => state.admin.isSuperadminInitialized;
export const selectIsAdminInitialized = (state) => state.admin.isInitialized;
export const selectPasswordResetStatus = (state) => state.admin.passwordReset;

export default adminSlice.reducer;