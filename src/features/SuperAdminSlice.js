import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

//! all workspaces:

export const workspacesData = createAsyncThunk('workspaces/workspacesData', async (token) => {

    const response = await fetch('http://127.0.0.1:8000/api/workspaces/allWorkspaces', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });
    const data = await response.json();
    
    return data;
});

const workspacesSlice = createSlice({
    name: 'workspaces',
    initialState: {
        workspaces: null,
        statusWorkspaces: 'idle',
        errorWorkspaces: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(workspacesData.pending, (state) => {
                state.statusWorkspaces = 'loading';
            })
            .addCase(workspacesData.fulfilled, (state, action) => {
                state.statusWorkspaces = 'succeeded';
                state.workspaces = action.payload;
            })
            .addCase(workspacesData.rejected, (state, action) => {
                state.statusWorkspaces = 'failed';
                state.errorWorkspaces = action.error.message;
            });
    },
});

//! all sites:

export const sitesData = createAsyncThunk('sites/sitesData', async (token) => {

    const response = await fetch('http://127.0.0.1:8000/api/workspaces/allSites', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });
    const data = await response.json();
    
    return data;
});

const sitesSlice = createSlice({
    name: 'sites',
    initialState: {
        sites: null,
        statusSites: 'idle',
        errorSites: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(sitesData.pending, (state) => {
                state.statusSites = 'loading';
            })
            .addCase(sitesData.fulfilled, (state, action) => {
                state.statusSites = 'succeeded';
                state.sites = action.payload;
            })
            .addCase(sitesData.rejected, (state, action) => {
                state.statusSites = 'failed';
                state.errorSites = action.error.message;
            });
    },
});


//! all buildings:

export const buildingsData = createAsyncThunk('buildings/buildingsData', async (token) => {

    const response = await fetch('http://127.0.0.1:8000/api/workspaces/allBuildings', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });
    const data = await response.json();
    
    return data;
});

const buildingsSlice = createSlice({
    name: 'buildings',
    initialState: {
        buildings: null,
        statusBuildings: 'idle',
        errorBuildings: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(buildingsData.pending, (state) => {
                state.statusBuildings = 'loading';
            })
            .addCase(buildingsData.fulfilled, (state, action) => {
                state.statusBuildings = 'succeeded';
                state.buildings = action.payload;
            })
            .addCase(buildingsData.rejected, (state, action) => {
                state.statusBuildings = 'failed';
                state.errorBuildings = action.error.message;
            });
    },
});


//!add user:
export const addUser = createAsyncThunk('newUser/addUser', async ({ token, newUser }) => {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(newUser)
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        return Promise.reject(error.message);
    }
});


const addUserSlice = createSlice({
    name: 'newUser',
    initialState: {
        message: '',
        statusAdd: 'idle',
        errorAdd: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addUser.pending, (state) => {
                state.statusAdd = 'loading';
            })
            .addCase(addUser.fulfilled, (state, action) => {
                state.statusAdd = 'succeeded';
                state.message = action.payload.message ;
            })
            .addCase(addUser.rejected, (state, action) => {
                state.statusAdd = 'failed';
                state.errorAdd = action.error.message;
            });
    },
});

//!delete user:
export const deleteUser = createAsyncThunk('delUser/deleteUser', async ({ token, id }) => {
    try {
        const response = await fetch(`http://127.0.0.1:8000/api/auth/users/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        return Promise.reject(error.message);
    }
});


const deleteUserSlice = createSlice({
    name: 'delUser',
    initialState: {
        messageDelete: '',
        statusDelete: 'idle',
        errorDelete: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(deleteUser.pending, (state) => {
                state.statusDelete = 'loading';
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.statusDelete = 'succeeded';
                state.messageDelete = action.payload.message ;
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.statusDelete = 'failed';
                state.errorDelete = action.error.message;
            });
    },
});

//!refresh the token: 
const refreshToken = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        return null;
    }

    try {
        const response = await fetch('http://127.0.0.1:8000/api/auth/refresh', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to refresh token');
        }

        const data = await response.json();
        localStorage.setItem('token', data.token);
        return data.token;
    } catch (error) {
        console.error('Token refresh error:', error);
        return null;
    }
};
export default refreshToken;


//!update user:
export const updateUser = createAsyncThunk('updateUser/updateUser',async ({ token, updateUserState }) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/auth/update_user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updateUserState),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            return Promise.reject(error.message);
        }
    }
);

const updateUserSlice = createSlice({
    name: 'updateUser',
    initialState: {
        messageUpdate:'',
        statusUpdate: 'idle',
        errorUpdate: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(updateUser.pending, (state) => {
                state.statusUpdate = 'loading';
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.statusUpdate = 'succeeded';
                state.messageUpdate = action.payload.message ;
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.statusUpdate = 'failed';
                state.errorUpdate = action.payload;
            });
    }
});

//!update users permissions:
export const updateUsersPermissions = createAsyncThunk(
    'permissions/updateUsers',
    async ({updatedUsers,  token }) => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/auth/update_permissions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({ usersPermissions: updatedUsers })
            });
    
            if (!response.ok) {
            throw new Error('Network response was not ok');
            }
    
            const data = await response.json();
            return data;
        } catch (error) {
            return Promise.reject(error.message);
        }
    }
);

const usersPermissionsSlice = createSlice({
name: 'permissions',
initialState: {
    message:'',
    statusPermissions: 'idle',
    errorPermissions: null
},
reducers: {},
extraReducers: (builder) => {
    builder
    .addCase(updateUsersPermissions.pending, (state) => {
        state.statusPermissions = 'loading';
    })
    .addCase(updateUsersPermissions.fulfilled, (state, action) => {
        state.statusPermissions = 'succeeded';
        state.message = action.payload.message;
    })
    .addCase(updateUsersPermissions.rejected, (state, action) => {
        state.statusPermissions = 'failed';
        state.errorPermissions = action.payload;
    });
}
});


//!users activities:
export const activitiesData = createAsyncThunk('activities/activitiesData', async (token) => {

    const response = await fetch('http://127.0.0.1:8000/api/auth/activities', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });
    const data = await response.json();
    
    return data;
});

const activitiesSlice = createSlice({
    name: 'activities',
    initialState: {
        activities: null,
        statusActivities: 'idle',
        errorActivities: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(activitiesData.pending, (state) => {
                state.statusActivities = 'loading';
            })
            .addCase(activitiesData.fulfilled, (state, action) => {
                state.statusActivities = 'succeeded';
                state.activities = action.payload;
            })
            .addCase(activitiesData.rejected, (state, action) => {
                state.statusActivities = 'failed';
                state.errorActivities = action.error.message;
            });
    },
});

export const activitiesReducer=activitiesSlice.reducer;
export const usersPermissionsReducer=usersPermissionsSlice.reducer;
export const workspaceReducer= workspacesSlice.reducer;
export const siteReducer= sitesSlice.reducer;
export const buildingReducer= buildingsSlice.reducer;
export const addUserReducer= addUserSlice.reducer;
export const deleteUserReducer= deleteUserSlice.reducer;
export const updateUserReducer= updateUserSlice.reducer;
