import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { setServicesAuthToken, getAllServices } from '../../Api/services.api';

const initialState = {
    currentService: null,
    services: [],
    uiStatus: 'idle',
    operationStatus: 'idle',
    operationError: null,
    operationType: null,
    filters: {},
    selectedServices: [],
    hasLoadedInitialServices: false,
    pagination: {
        page: 1,
        pages: 1,
        total: 0,
        limit: 10
    }
};

const serviceSlice = createSlice({
    name: 'service',
    initialState,
    reducers: {
        setCurrentService: (state, action) => {
            state.currentService = action.payload;
        },
        clearCurrentService: (state) => {
            state.currentService = null;
        },
        setOperationStatus: (state, action) => {
            state.operationStatus = action.payload;
        },
        setOperationError: (state, action) => {
            state.operationError = action.payload;
        },
        setOperationType: (state, action) => {
            state.operationType = action.payload;
        },
        setFilters: (state, action) => {
            state.filters = action.payload;
        },
        setServices: (state, action) => {
            // Handle different response formats
            if (Array.isArray(action.payload)) {
                state.services = action.payload;
            } else if (action.payload?.data) {
                state.services = action.payload.data;
                if (action.payload.pagination) {
                    state.pagination = action.payload.pagination;
                }
            } else {
                state.services = [];
            }
            state.hasLoadedInitialServices = true;
            state.uiStatus = 'succeeded';
        },
        setServicesLoading: (state) => {
            state.uiStatus = 'loading';
        },
        setServicesError: (state, action) => {
            state.uiStatus = 'failed';
            state.operationError = action.payload;
        },
        toggleServiceSelection: (state, action) => {
            const serviceId = action.payload;
            const index = state.selectedServices.indexOf(serviceId);
            if (index === -1) {
                state.selectedServices.push(serviceId);
            } else {
                state.selectedServices.splice(index, 1);
            }
        },
        clearSelectedServices: (state) => {
            state.selectedServices = [];
        },
        setServiceAuth: (state, action) => {
            setServicesAuthToken(action.payload);
        },
        resetServiceState: () => initialState,
    }
});

// Thunk action for fetching services with proper error handling
export const fetchServices = createAsyncThunk(
    'services/fetchAll',
    async (queryParams, { dispatch, rejectWithValue }) => {
        try {
            dispatch(setServicesLoading());
            const response = await getAllServices(queryParams);

            return dispatch(setServices(response));
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch services';
            dispatch(setServicesError(errorMessage));
            return rejectWithValue(errorMessage);
        }
    }
);

// Selectors
export const selectCurrentService = (state) => state.service.currentService;
export const selectServices = (state) => state.service.services;
export const selectUiStatus = (state) => state.service.uiStatus;
export const selectOperationStatus = (state) => state.service.operationStatus;
export const selectOperationError = (state) => state.service.operationError;
export const selectOperationType = (state) => state.service.operationType;
export const selectServiceFilters = (state) => state.service.filters;
export const selectSelectedServices = (state) => state.service.selectedServices;
export const selectHasLoadedInitialServices = (state) => state.service.hasLoadedInitialServices;
export const selectServicePagination = (state) => state.service.pagination;

export const {
    setCurrentService,
    clearCurrentService,
    setOperationStatus,
    setOperationError,
    setOperationType,
    setFilters,
    setServices,
    setServicesLoading,
    setServicesError,
    toggleServiceSelection,
    clearSelectedServices,
    setServiceAuth,
    resetServiceState,
} = serviceSlice.actions;

export default serviceSlice.reducer;