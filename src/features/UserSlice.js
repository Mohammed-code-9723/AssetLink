import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';


//! all users:

export const fetchUsersData = createAsyncThunk('users/fetchUsersData', async (token) => {

    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/refresh/api/auth/all`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });
    const data = await response.json();
    console.log("response: ");
    console.log(data);
    return data;
});

const usersSlice = createSlice({
    name: 'users',
    initialState: {
        users: null,
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsersData.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchUsersData.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.users = action.payload;
            })
            .addCase(fetchUsersData.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});


export const refreshToken = createAsyncThunk('auth/refreshToken', async (_, { getState }) => {
    const { auth } = getState();
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/refresh`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${auth.token}`,
        },
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || 'Token refresh failed');
    }
    return data;
});

//! login:
export const login = createAsyncThunk('auth/login', async ({ email, password }) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Login failed');
    }
    return data;
});

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        token: null,
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(login.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload.user;
                state.token = action.payload.token;
            })
            .addCase(login.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(refreshToken.fulfilled, (state, action) => {
                state.token = action.payload.token;
                state.user = action.payload.user;
            })
            .addCase(refreshToken.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

// export const userReducer= userSlice.reducer;
export const usersReducer= usersSlice.reducer;
export const authReducer = authSlice.reducer;