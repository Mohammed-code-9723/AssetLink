import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

//! all workspaces:

export const workspacesData = createAsyncThunk('workspaces/workspacesData', async (token) => {
    const user=JSON.parse(localStorage.getItem('user'));
    const url=(user?.role==='superadmin'||user?.role==='admin'||user?.role==='manager')?
    'http://127.0.0.1:8000/api/workspaces/allWorkspaces'
    :
    'http://127.0.0.1:8000/api/workspaces';

    const response = await fetch(url, {
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

export const sitesData = createAsyncThunk('sites/sitesData', async ({token,value}) => {
    const user=JSON.parse(localStorage.getItem('user'));
    const url=(user?.role==='superadmin'||user?.role==='admin'||user?.role==='manager')?
    'http://127.0.0.1:8000/api/workspaces/allSites'
    :
    `http://127.0.0.1:8000/api/workspaces/${value}/sites`;

    const response = await fetch(url, {
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

//! all projects:

export const projectsData = createAsyncThunk('projects/projectsData', async (token) => {

    const response = await fetch('http://127.0.0.1:8000/api/workspaces/allProjects', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });
    const data = await response.json();
    
    return data;
});

const projectsSlice = createSlice({
    name: 'projects',
    initialState: {
        projects: null,
        statusProjects: 'idle',
        errorProjects: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(projectsData.pending, (state) => {
                state.statusProjects = 'loading';
            })
            .addCase(projectsData.fulfilled, (state, action) => {
                state.statusProjects = 'succeeded';
                state.projects = action.payload;
            })
            .addCase(projectsData.rejected, (state, action) => {
                state.statusProjects = 'failed';
                state.errorProjects = action.error.message;
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


//!delete workspace:
export const deleteWorkspace = createAsyncThunk('delWorkspace/deleteWorkspace', async ({ token, id }) => {
    try {
        const response = await fetch(`http://127.0.0.1:8000/api/auth/workspaces/${id}`, {
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


const deleteWorkspaceSlice = createSlice({
    name: 'delWorkspace',
    initialState: {
        messageDeleteWorkspace: '',
        statusDeleteWorkspace: 'idle',
        errorDeleteWorkspace: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(deleteWorkspace.pending, (state) => {
                state.statusDeleteWorkspace = 'loading';
            })
            .addCase(deleteWorkspace.fulfilled, (state, action) => {
                state.statusDeleteWorkspace = 'succeeded';
                state.messageDeleteWorkspace = action.payload.message ;
            })
            .addCase(deleteWorkspace.rejected, (state, action) => {
                state.statusDeleteWorkspace = 'failed';
                state.errorDelete = action.error.message;
            });
    },
});


//!delete site:
export const deleteSite = createAsyncThunk('delSite/deleteSite', async ({ token, id }) => {
    try {
        const response = await fetch(`http://127.0.0.1:8000/api/auth/sites/${id}`, {
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


const deleteSiteSlice = createSlice({
    name: 'delSite',
    initialState: {
        messageSiteDelete: '',
        statusSiteDelete: 'idle',
        errorSiteDelete: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(deleteSite.pending, (state) => {
                state.statusSiteDelete = 'loading';
            })
            .addCase(deleteSite.fulfilled, (state, action) => {
                state.statusSiteDelete = 'succeeded';
                state.messageSiteDelete = action.payload.message ;
            })
            .addCase(deleteSite.rejected, (state, action) => {
                state.statusSiteDelete = 'failed';
                state.errorSiteDelete = action.error.message;
            });
    },
});

//!add site:
export const addSiteAsync = createAsyncThunk('newSite/addSiteAsync', async ({ token, newSite,workspace }) => {
    try {
        const response = await fetch(`http://127.0.0.1:8000/api/auth/${workspace}/addSite`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(newSite)
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


const addSiteSlice = createSlice({
    name: 'newSite',
    initialState: {
        messageAddSite: '',
        statusAddSite: 'idle',
        errorAddSite: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addSiteAsync.pending, (state) => {
                state.statusAddSite = 'loading';
            })
            .addCase(addSiteAsync.fulfilled, (state, action) => {
                state.statusAddSite = 'succeeded';
                state.messageAddSite = action.payload.message ;
            })
            .addCase(addSiteAsync.rejected, (state, action) => {
                state.statusAddSite = 'failed';
                state.errorAddSite = action.error.message;
            });
    },
});



//!update site:
export const updateSite = createAsyncThunk(
    'site/updateSite',
    async ({updatedSite,  token }) => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/auth/update_site', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify(updatedSite)
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

const updateSiteSlice = createSlice({
name: 'site',
initialState: {
    messageUpdateSite:'',
    statusUpdateSite: 'idle',
    errorUpdateSite: null
},
reducers: {},
extraReducers: (builder) => {
    builder
    .addCase(updateSite.pending, (state) => {
        state.statusUpdateSite = 'loading';
    })
    .addCase(updateSite.fulfilled, (state, action) => {
        state.statusUpdateSite = 'succeeded';
        state.messageUpdateSite = action.payload.message;
    })
    .addCase(updateSite.rejected, (state, action) => {
        state.statusUpdateSite = 'failed';
        state.errorUpdateSite = action.payload;
    });
}
});

//! all components:

export const componentsData = createAsyncThunk('components/componentsData', async ({token,building_id,workspace_id,site_id}) => {

    const user=JSON.parse(localStorage.getItem('user'));
    const url=(user?.role==='superadmin'||user?.role==='admin'||user?.role==='manager')?
    'http://127.0.0.1:8000/api/auth/Components'
    :
    `http://127.0.0.1:8000/api/workspaces/${workspace_id}/sites/${site_id}/buildings/${building_id}/components`;

    const method=(user?.role==='superadmin'||user?.role==='admin'||user?.role==='manager')?
    {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    }:
    {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body:JSON.stringify({building_id:building_id})
    };
    const response = await fetch(url, method);
    const data = await response.json();
    
    return data;
});

const componentsSlice = createSlice({
    name: 'components',
    initialState: {
        components: null,
        statusComponents: 'idle',
        errorComponents: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(componentsData.pending, (state) => {
                state.statusComponents = 'loading';
            })
            .addCase(componentsData.fulfilled, (state, action) => {
                state.statusComponents = 'succeeded';
                state.components = action.payload;
            })
            .addCase(componentsData.rejected, (state, action) => {
                state.statusComponents = 'failed';
                state.errorComponents = action.error.message;
            });
    },
});


//! all incidents:

export const incidentsData = createAsyncThunk('incidents/incidentsData', async (token) => {

    const user=JSON.parse(localStorage.getItem('user'));

    const url=(user?.role==='superadmin'||user?.role==='admin'||user?.role==='manager')?(
        'http://127.0.0.1:8000/api/auth/allIncidents'
    ):(
        'http://127.0.0.1:8000/api/workspaces/usersIncidents'
    )
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });
    const data = await response.json();
    
    return data;
});

const incidentsSlice = createSlice({
    name: 'incidents',
    initialState: {
        incidents: null,
        statusIncidents: 'idle',
        errorIncidents: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(incidentsData.pending, (state) => {
                state.statusIncidents = 'loading';
            })
            .addCase(incidentsData.fulfilled, (state, action) => {
                state.statusIncidents = 'succeeded';
                state.incidents = action.payload;
            })
            .addCase(incidentsData.rejected, (state, action) => {
                state.statusIncidents = 'failed';
                state.errorIncidents = action.error.message;
            });
    },
});


export const componentsReducer= componentsSlice.reducer;
export const incidentsReducer= incidentsSlice.reducer;
export const addSiteReducer= addSiteSlice.reducer;
export const activitiesReducer=activitiesSlice.reducer;
export const projectsReducer=projectsSlice.reducer;
export const usersPermissionsReducer=usersPermissionsSlice.reducer;
export const workspaceReducer= workspacesSlice.reducer;
export const siteReducer= sitesSlice.reducer;
export const buildingReducer= buildingsSlice.reducer;
export const addUserReducer= addUserSlice.reducer;
export const deleteUserReducer= deleteUserSlice.reducer;
export const deleteWorkspaceReducer= deleteWorkspaceSlice.reducer;
export const deleteSiteReducer= deleteSiteSlice.reducer;
export const updateUserReducer= updateUserSlice.reducer;
export const updateSiteReducer= updateSiteSlice.reducer;
