import { configureStore } from '@reduxjs/toolkit';
import {authReducer,usersReducer} from '../features/UserSlice';
import { 
    workspaceReducer,
    siteReducer,
    buildingReducer,
    addUserReducer,
    deleteUserReducer,
    updateUserReducer,
    usersPermissionsReducer,
    activitiesReducer,
    deleteWorkspaceReducer,
    projectsReducer,
    deleteSiteReducer,
    addSiteReducer,
    updateSiteReducer
} from '../features/SuperAdminSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        users:usersReducer,
        workspaces:workspaceReducer,
        sites:siteReducer,
        buildings:buildingReducer,
        addUser:addUserReducer,
        deleteUser:deleteUserReducer,
        deleteSiteRe:deleteSiteReducer,
        updateUser: updateUserReducer,
        usersPermissions:usersPermissionsReducer,
        activities:activitiesReducer,
        deleteWorkspace:deleteWorkspaceReducer,
        projects:projectsReducer,
        addSiteRe:addSiteReducer,
        updateSiteRe:updateSiteReducer
    },
});