import { configureStore } from '@reduxjs/toolkit';
import {authReducer,usersReducer} from '../features/UserSlice';
import { workspaceReducer,siteReducer,buildingReducer,addUserReducer,deleteUserReducer,updateUserReducer,usersPermissionsReducer,activitiesReducer} from '../features/SuperAdminSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        users:usersReducer,
        workspaces:workspaceReducer,
        sites:siteReducer,
        buildings:buildingReducer,
        addUser:addUserReducer,
        deleteUser:deleteUserReducer,
        updateUser: updateUserReducer,
        usersPermissions:usersPermissionsReducer,
        activities:activitiesReducer
    },
});