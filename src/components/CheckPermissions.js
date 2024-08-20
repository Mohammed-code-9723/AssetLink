export const hasPermission = (permissionsJson, resource, action) => {
    if (!permissionsJson) {
        return false;
    }

    let permissions;
    try {
        permissions = JSON.parse(permissionsJson);
    } catch (error) {
        console.error('Invalid JSON format for permissions:', error);
        return false;
    }

    if (!permissions[resource]) {
        return false;
    }

    return permissions[resource].includes(action);
};