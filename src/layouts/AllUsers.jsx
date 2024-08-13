import React, { useEffect, useState } from 'react';
import Table from '@mui/joy/Table';
import Button from '@mui/joy/Button';
import Sheet from '@mui/joy/Sheet';
import { MdAdd, MdDeleteSweep } from 'react-icons/md';
import { fetchUsersData } from '../features/UserSlice';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { PiUserSwitchBold } from "react-icons/pi";

// Modal:
import Modal from '@mui/joy/Modal';
import ModalClose from '@mui/joy/ModalClose';
import Typography from '@mui/joy/Typography';
import { Form, ButtonToolbar, Radio, RadioGroup, Notification, Checkbox, CheckboxGroup,Divider } from 'rsuite';
import { addUser, deleteUser, updateUser } from '../features/SuperAdminSlice';

import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import DialogActions from '@mui/joy/DialogActions';
import ModalDialog from '@mui/joy/ModalDialog';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';

import { useTranslation } from 'react-i18next';
import { Breadcrumbs,Link } from '@mui/joy';
import { AutoComplete } from 'rsuite';


export default function AllUsers() {
    const dispatch = useDispatch();
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    const { users, status, error } = useSelector((state) => state.users);
    const { message, statusAdd, errorAdd } = useSelector((state) => state.addUser);
    const { messageDelete, statusDelete, errorDelete } = useSelector((state) => state.deleteUser);
    const { messageUpdate, statusUpdate, errorUpdate } = useSelector((state) => state.updateUser);

    const [userRow, setUserRow] = useState(null);
    const [openUserModal, setOpenUserModal] = useState(false);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openUpdateModal, setOpenUpdateModal] = useState(false);

    //!fix this tomorrow:
    const [checkboxDashboard,setCheckboxDashboard]=useState([]);
    const [checkboxWorkspaces,setCheckboxWorkspaces]=useState([]);
    const [checkboxProjects,setCheckboxProjects]=useState([]);
    const [checkboxSites,setCheckboxSites]=useState([]);
    const [checkboxBuildings,setCheckboxBuildings]=useState([]);
    const [checkboxComponents,setCheckboxComponents]=useState([]);
    const [checkboxIncidents,setCheckboxIncidents]=useState([]);
    const [checkboxReports,setCheckboxReports]=useState([]);
    const [checkboxUserManagement,setCheckboxUserManagement]=useState([]);
    const [checkboxSettings,setCheckboxSettings]=useState([]);

    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        password: '',
        role: '',
        permissions: {
            dashboard: checkboxDashboard,
            workspaces: checkboxWorkspaces,
            projects: checkboxProjects,
            sites: checkboxSites,
            buildings: checkboxBuildings,
            components: checkboxComponents,
            incidents: checkboxIncidents,
            reports: checkboxReports,
            user_management:checkboxUserManagement,
            settings: checkboxSettings
        }
    });
    const [updateUserState, setUpdateUserState] = useState({ id: '', name: '', email: '', password: '', role: '' });

    useEffect(() => {
        dispatch(fetchUsersData(token));
    }, [dispatch, token]);

    useEffect(() => {
        if (statusAdd === 'succeeded' || statusDelete === 'succeeded' || statusUpdate === 'succeeded') {
            dispatch(fetchUsersData(token));
        }
    }, [statusAdd, statusDelete, statusUpdate, dispatch, token]);

    useEffect(() => {
        setNewUser((prevState) => ({
            ...prevState,
            permissions: {
                dashboard: checkboxDashboard,
                workspaces: checkboxWorkspaces,
                projects: checkboxProjects,
                sites: checkboxSites,
                buildings: checkboxBuildings,
                components: checkboxComponents,
                incidents: checkboxIncidents,
                reports: checkboxReports,
                user_management: checkboxUserManagement,
                settings: checkboxSettings
            }
        }));
    }, [checkboxDashboard, checkboxWorkspaces, checkboxProjects, checkboxSites, checkboxBuildings, checkboxComponents, checkboxIncidents, checkboxReports, checkboxUserManagement, checkboxSettings]);

    const {t } = useTranslation();
    
    const [search,setSearch]=useState("");
    const [filteredUsers,setFilteredUsers]=useState(null);
    const [allUsers,setAllUsers]=useState([]);

    useEffect(() => {
        if (users) {
            setAllUsers(users.users);
        }
    }, [users]);

    useEffect(()=>{
        setFilteredUsers(allUsers.filter((user)=>user.name.includes(search)||user.email.includes(search)||user.role.includes(search)));
    },[search])

    if (!token) {
        return <Navigate to="/" />;
    }

    const handleRow = (user) => {
        setUserRow(user);
        setOpenUserModal(true);
    };

    const handleAddUser = (e) => {
        e.stopPropagation();
        setOpenAddModal(true);
    };

    const handleDeleteUser = (user) => {
        setUserRow(user);
        setOpenDeleteModal(true);
    };

    const handleUpdateUser = (user) => {
        setUpdateUserState({ id: user.id, name: user.name, email: user.email, password: '', role: user.role });
        setOpenUpdateModal(true);
    };

    

    
    const handleDashboardPermissions = (permission) => {
        // alert(permission)
        if (checkboxDashboard.includes(permission)) {
            setCheckboxDashboard(checkboxDashboard.filter(item => item !== permission));
        } else {
            setCheckboxDashboard(permission);
        }
    };

    const handleWorkspacesPermissions = (permission) => {
        if (checkboxWorkspaces.includes(permission)) {
            setCheckboxWorkspaces(checkboxWorkspaces.filter(item => item !== permission));
        } else {
            setCheckboxWorkspaces(permission);
        }
    };

    const handleProjectsPermissions = (permission) => {
        if (checkboxProjects.includes(permission)) {
            setCheckboxProjects(checkboxProjects.filter(item => item !== permission));
        } else {
            setCheckboxProjects(permission);
        }
    };

    const handleSitesPermissions = (permission) => {
        if (checkboxSites.includes(permission)) {
            setCheckboxSites(checkboxSites.filter(item => item !== permission));
        } else {
            setCheckboxSites(permission);
        }
    };

    const handleBuildingsPermissions = (permission) => {
        if (checkboxBuildings.includes(permission)) {
            setCheckboxBuildings(checkboxBuildings.filter(item => item !== permission));
        } else {
            setCheckboxBuildings(permission);
        }
    };

    const handleComponentsPermissions = (permission) => {
        if (checkboxComponents.includes(permission)) {
            setCheckboxComponents(checkboxComponents.filter(item => item !== permission));
        } else {
            setCheckboxComponents(permission);
        }
    };

    const handleIncidentsPermissions = (permission) => {
        if (checkboxIncidents.includes(permission)) {
            setCheckboxIncidents(checkboxIncidents.filter(item => item !== permission));
        } else {
            setCheckboxIncidents(permission);
        }
    };

    const handleReportsPermissions = (permission) => {
        if (checkboxReports.includes(permission)) {
            setCheckboxReports(checkboxReports.filter(item => item !== permission));
        } else {
            setCheckboxReports(permission);
        }
    };

    const handleUserManagementPermissions = (permission) => {
        if (checkboxUserManagement.includes(permission)) {
            setCheckboxUserManagement(checkboxUserManagement.filter(item => item !== permission));
        } else {
            setCheckboxUserManagement(permission);
        }
    };

    const handleSettingsPermissions = (permission) => {
        if (checkboxSettings.includes(permission)) {
            setCheckboxSettings(checkboxSettings.filter(item => item !== permission));
        } else {
            setCheckboxSettings(permission);
        }
    };    
    

    //! Add new user:
    const handleAddNewUser = () => {
        if (newUser.name === '' || newUser.email === '' || newUser.password === '' || newUser.role === '' || Object.values(newUser.permissions).flat().length === 0) {
            alert('All fields are required.');
            return;
        }

        dispatch(addUser({ token, newUser }));
    
        setNewUser({
            name: '',
            email: '',
            password: '',
            role: '',
            permissions: {
                dashboard: checkboxDashboard,
                workspaces: checkboxWorkspaces,
                projects: checkboxProjects,
                sites: checkboxSites,
                buildings: checkboxBuildings,
                components: checkboxComponents,
                incidents: checkboxIncidents,
                reports: checkboxReports,
                user_management: checkboxUserManagement,
                settings: checkboxSettings
            }
        });

        setCheckboxDashboard([]);
        setCheckboxWorkspaces([]);
        setCheckboxProjects([]);
        setCheckboxSites([]);
        setCheckboxBuildings([]);
        setCheckboxComponents([]);
        setCheckboxIncidents([]);
        setCheckboxReports([]);
        setCheckboxUserManagement([]);
        setCheckboxSettings([]);

        setOpenAddModal(false);
    };
    

    //! Update user:
    const handleUpdateExistingUser = () => {
        dispatch(updateUser({ token,updateUserState }));
        // console.log("updated user: ",updateUserState);
        setOpenUpdateModal(false);
    };

    const handleInputChange = (value, name) => {
        setNewUser({ ...newUser, [name]: value });
    };

    const handleInputChangeUpdate = (value, name) => {
        setUpdateUserState({ ...updateUserState, [name]: value });
    };


    return (
        <div>
            <Breadcrumbs separator=">" aria-label="breadcrumbs" size="sm">
                {[t('dashboard'),t('users.users'),t('users.allUsers')].map((item) => (
                <Link key={item} color="neutral" href="#sizes">
                    <h5>
                        {item} 
                    </h5>
                </Link>
                ))}
            </Breadcrumbs>
            {(messageUpdate || messageDelete || message) && (message !== '' || messageDelete !== ''|| messageUpdate !== '') && (
                <Notification type="success" header={`${messageUpdate || messageDelete || message}`} closable style={{position:'relative',width:'100%'}}>
                </Notification>
            )}
            <div style={{width:'100%',display:'flex',justifyContent:'space-evenly',margin:'20px 0',flexWrap:'wrap'}}>
                <AutoComplete data={allUsers.map((user)=>user.name)} style={{ width: '30%' }} 
                    placeholder={t('search.name')}
                    onChange={(value)=>setSearch(value)}  
                />
                <AutoComplete data={allUsers.map((user)=>user.email)} style={{ width: '30%' }} 
                    placeholder={t('search.email')}
                    onChange={(value)=>setSearch(value)}  
                />
                <AutoComplete data={allUsers.map((user)=>user.role)} style={{ width: '30%' }} 
                    placeholder={t('search.role')}
                    onChange={(value)=>setSearch(value)}  
                />
                <Button sx={{background:'linear-gradient(265deg, rgba(226,49,96,1) 0%, rgba(115,5,5,1) 100%)'}} onClick={()=>{setSearch("");setFilteredUsers(null)}}>{t('search.clear')}</Button>
            </div>
            <Sheet variant="outlined" color="neutral" sx={{ marginTop: '20px', p: 4, borderRadius: '10px' }}>
                <center>
                    <Button
                        sx={{
                            background: 'linear-gradient(124deg, rgba(7,28,75,1) 0%, rgba(9,100,60,1) 100%)',
                            width: '20%',
                        }}
                        onClick={handleAddUser}
                    >
                        <MdAdd size={22} />&nbsp;&nbsp;{t('users.addUsers')}
                    </Button>
                </center>
                <div className='table_container'>
                    <Table 
                        hoverRow 
                        sx={{
                            overflowX:'scroll'
                        }}
                    >
                        <thead>
                            <tr>
                                <th style={{width: 'var(--Table-firstColumnWidth)', textAlign: 'center' }}>ID</th>
                                <th style={{ width: '30%',textAlign: 'center' }}>{t('users.name')}</th>
                                <th style={{ width: '30%',textAlign: 'center' }}>{t('email')}</th>
                                {/* <th style={{ width: '30%',textAlign: 'center' }}>Password</th> */}
                                <th style={{ width: '30%',textAlign: 'center' }}>{t('users.role')}</th>
                                <th 
                                style={{ width: '30%' , textAlign: 'center' }}>
                                    {t('users.actions')}
                                </th>
                            </tr>
                        </thead>
                        <tbody >
                            {
                                filteredUsers&&search!==""?(
                                    filteredUsers.map((user,index)=>(
                                        <tr
                                        key={index}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRow(user);
                                            }}
                                        >
                                            <td style={{ textAlign: 'center' }}>{user.id}</td>
                                            <td style={{ textAlign: 'center' }}>{user.name}</td>
                                            <td style={{ textAlign: 'center' }}>{user.email}</td>
                                            <td style={{ textAlign: 'center' }}>{user.role}</td>
                                            <td style={{ display: 'flex', gap: '2px', justifyContent: 'center',flexWrap:'wrap' }}>
                                                <Button
                                                    sx={{ background: 'linear-gradient(265deg, rgba(226,49,96,1) 0%, rgba(115,5,5,1) 100%)' }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteUser(user);
                                                    }}
                                                >
                                                    <MdDeleteSweep size={18} />&nbsp;{t('users.delete')}
                                                </Button>
                                                <Button
                                                    sx={{ background: 'linear-gradient(265deg, rgba(49,153,226,1) 0%, rgba(21,31,51,1) 100%)' }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleUpdateUser(user);
                                                    }}
                                                >
                                                    <PiUserSwitchBold size={18} />&nbsp;{t('users.update')}
                                                </Button>
                                            </td>
                                        </tr>
                                    )
                                )):(users &&
                                users.users.map((user, index) => (
                                    <tr
                                    key={index}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRow(user);
                                        }}
                                    >
                                        <td style={{ textAlign: 'center' }}>{user.id}</td>
                                        <td style={{ textAlign: 'center' }}>{user.name}</td>
                                        <td style={{ textAlign: 'center' }}>{user.email}</td>
                                        <td style={{ textAlign: 'center' }}>{user.role}</td>
                                        <td style={{ display: 'flex', gap: '2px', justifyContent: 'center',flexWrap:'wrap' }}>
                                            <Button
                                                sx={{ background: 'linear-gradient(265deg, rgba(226,49,96,1) 0%, rgba(115,5,5,1) 100%)' }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteUser(user);
                                                }}
                                            >
                                                <MdDeleteSweep size={18} />&nbsp;{t('users.delete')}
                                            </Button>
                                            <Button
                                                sx={{ background: 'linear-gradient(265deg, rgba(49,153,226,1) 0%, rgba(21,31,51,1) 100%)' }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleUpdateUser(user);
                                                }}
                                            >
                                                <PiUserSwitchBold size={18} />&nbsp;{t('users.update')}
                                            </Button>
                                        </td>
                                    </tr>
                                )))
                            }
                        </tbody>
                    </Table>
                </div>
            </Sheet>

            {/* User Details Modal */}
            {userRow && (
                <Modal
                    aria-labelledby="modal-title"
                    aria-describedby="modal-desc"
                    open={openUserModal}
                    onClose={() => setOpenUserModal(false)}
                    sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                >
                    <Sheet
                        variant="outlined"
                        sx={{
                            width:'60%',
                            borderRadius: 'md',
                            p: 3,
                            boxShadow: 'lg',
                        }}
                    >
                        <ModalClose variant="plain" sx={{ m: 1 }} />
                        <Typography
                            component="h2"
                            id="modal-title"
                            level="h4"
                            textColor="inherit"
                            fontWeight="lg"
                            mb={1}
                        >
                            {userRow.name}'s information:
                        </Typography>
                        <Typography id="modal-desc" textColor="text.tertiary">
                            {userRow && (
                                <ul>
                                    <li>
                                        <strong>ID:</strong> {userRow.id}
                                    </li>
                                    <li>
                                        <strong>Email:</strong> {userRow.email}
                                    </li>
                                    <li>
                                        <strong>Password:</strong> {userRow.password_confirmation}
                                    </li>
                                    <li>
                                        <strong>Role:</strong> {userRow.role}
                                    </li>
                                </ul>
                            )}
                        </Typography>
                    </Sheet>
                </Modal>
            )}

            {/* Add User Modal */}
            <Modal
                aria-labelledby="modal-title"
                aria-describedby="modal-desc"
                open={openAddModal}
                onClose={() => setOpenAddModal(false)}
                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
                <Sheet
                    variant="outlined"
                    sx={{
                        width:'50%',
                        borderRadius: 'md',
                        p: 3,
                        boxShadow: 'lg',
                        height:'90%',
                        overflowY:'scroll'
                    }}
                >
                    <ModalClose variant="plain" sx={{ m: 1 }} />
                    <Typography
                        component="h2"
                        id="modal-title"
                        level="h4"
                        textColor="inherit"
                        fontWeight="lg"
                        mb={1}
                    >
                        Add new user:
                    </Typography>
                    <Form fluid>
                        <Form.Group controlId="name">
                            <Form.ControlLabel>Name</Form.ControlLabel>
                            <Form.Control
                                name="name"
                                value={newUser.name}
                                onChange={(value) => handleInputChange(value, 'name')}
                            />
                        </Form.Group>
                        <Form.Group controlId="email">
                            <Form.ControlLabel>Email</Form.ControlLabel>
                            <Form.Control
                                name="email"
                                value={newUser.email}
                                onChange={(value) => handleInputChange(value, 'email')}
                            />
                        </Form.Group>
                        <Form.Group controlId="password">
                            <Form.ControlLabel>Password</Form.ControlLabel>
                            <Form.Control
                                name="password"
                                type="password"
                                value={newUser.password}
                                onChange={(value) => handleInputChange(value, 'password')}
                            />
                        </Form.Group>
                        <Form.Group controlId="role">
                            <Form.ControlLabel>Role</Form.ControlLabel>
                            <RadioGroup
                                name="role"
                                inline
                                appearance='picker'
                                value={newUser.role}
                                onChange={(value) => handleInputChange(value, 'role')}
                                style={{width:'100%',display:'flex',justifyContent:'space-evenly'}}
                            >
                                <Radio value="Admin">Admin</Radio>
                                <Radio value="Manager">Manager</Radio>
                                <Radio value="Ingenieur">Ingenieur</Radio>
                                <Radio value="Technicien">Technicien</Radio>
                            </RadioGroup>
                        </Form.Group>
                        <Form.Group controlId="permissions">
                            <Form.ControlLabel>Permissions</Form.ControlLabel>
                            <Divider>Dashboard</Divider>
                            <CheckboxGroup
                                inline
                                // value={newUser.permissions.dashboard}
                                onChange={(value) => handleDashboardPermissions(value)}
                                style={{
                                    width:'100%',
                                    display:'flex',
                                    justifyContent:'space-evenly'
                                }}
                            >
                                <Checkbox value="read">Read</Checkbox>
                                <Checkbox value="create">Create</Checkbox>
                                <Checkbox value="update">Update</Checkbox>
                                <Checkbox value="delete">Delete</Checkbox>
                            </CheckboxGroup>
                            <Divider>Workspace</Divider>
                            <CheckboxGroup
                                inline
                                // value={newUser.permissions.workspaces}
                                onChange={(value) => handleWorkspacesPermissions(value)}
                                style={{
                                    width:'100%',
                                    display:'flex',
                                    justifyContent:'space-evenly'
                                }}
                            >
                                <Checkbox value="read">Read</Checkbox>
                                <Checkbox value="create">Create</Checkbox>
                                <Checkbox value="update">Update</Checkbox>
                                <Checkbox value="delete">Delete</Checkbox>
                            </CheckboxGroup>
                            <Divider>Projects</Divider>
                            <CheckboxGroup
                                inline
                                // value={newUser.permissions.projects}
                                onChange={(value) => handleProjectsPermissions(value)}
                                style={{
                                    width:'100%',
                                    display:'flex',
                                    justifyContent:'space-evenly'
                                }}
                            >
                                <Checkbox value="read">Read</Checkbox>
                                <Checkbox value="create">Create</Checkbox>
                                <Checkbox value="update">Update</Checkbox>
                                <Checkbox value="delete">Delete</Checkbox>
                            </CheckboxGroup>
                            <Divider>sites</Divider>
                            <CheckboxGroup
                                inline
                                // value={newUser.permissions.sites}
                                onChange={(value) => handleSitesPermissions(value)}
                                style={{
                                    width:'100%',
                                    display:'flex',
                                    justifyContent:'space-evenly'
                                }}
                            >
                                <Checkbox value="read">Read</Checkbox>
                                <Checkbox value="create">Create</Checkbox>
                                <Checkbox value="update">Update</Checkbox>
                                <Checkbox value="delete">Delete</Checkbox>
                            </CheckboxGroup>
                            <Divider>Buildings</Divider>
                            <CheckboxGroup
                                inline
                                // value={newUser.permissions.buildings}
                                onChange={(value) => handleBuildingsPermissions(value)}
                                style={{
                                    width:'100%',
                                    display:'flex',
                                    justifyContent:'space-evenly'
                                }}
                            >
                                <Checkbox value="read">Read</Checkbox>
                                <Checkbox value="create">Create</Checkbox>
                                <Checkbox value="update">Update</Checkbox>
                                <Checkbox value="delete">Delete</Checkbox>
                            </CheckboxGroup>
                            <Divider>Components</Divider>
                            <CheckboxGroup
                                inline
                                // value={newUser.permissions.components}
                                onChange={(value) => handleComponentsPermissions(value)}
                                style={{
                                    width:'100%',
                                    display:'flex',
                                    justifyContent:'space-evenly'
                                }}
                            >
                                <Checkbox value="read">Read</Checkbox>
                                <Checkbox value="create">Create</Checkbox>
                                <Checkbox value="update">Update</Checkbox>
                                <Checkbox value="delete">Delete</Checkbox>
                            </CheckboxGroup>
                            <Divider>Incidents</Divider>
                            <CheckboxGroup
                                inline
                                // value={newUser.permissions.incidents}
                                onChange={(value) => handleIncidentsPermissions(value)}
                                style={{
                                    width:'100%',
                                    display:'flex',
                                    justifyContent:'space-evenly'
                                }}
                            >
                                <Checkbox value="read">Read</Checkbox>
                                <Checkbox value="create">Create</Checkbox>
                                <Checkbox value="update">Update</Checkbox>
                                <Checkbox value="delete">Delete</Checkbox>
                            </CheckboxGroup>
                            <Divider>Reports</Divider>
                            <CheckboxGroup
                                inline
                                // value={newUser.permissions.reports}
                                onChange={(value) => handleReportsPermissions(value)}
                                style={{
                                    width:'100%',
                                    display:'flex',
                                    justifyContent:'space-evenly'
                                }}
                            >
                                <Checkbox value="read">Read</Checkbox>
                                <Checkbox value="create">Create</Checkbox>
                                <Checkbox value="update">Update</Checkbox>
                                <Checkbox value="delete">Delete</Checkbox>
                            </CheckboxGroup>
                            <Divider>Users management</Divider>
                            <CheckboxGroup
                                inline
                                // value={newUser.permissions.user_management}
                                onChange={(value) => handleUserManagementPermissions(value)}
                                style={{
                                    width:'100%',
                                    display:'flex',
                                    justifyContent:'space-evenly'
                                }}
                            >
                                <Checkbox value="read">Read</Checkbox>
                                <Checkbox value="create">Create</Checkbox>
                                <Checkbox value="update">Update</Checkbox>
                                <Checkbox value="delete">Delete</Checkbox>
                            </CheckboxGroup>
                            <Divider>Settings</Divider>
                            <CheckboxGroup
                                inline
                                // value={newUser.permissions.settings}
                                onChange={(value) => handleSettingsPermissions(value)}
                                style={{
                                    width:'100%',
                                    display:'flex',
                                    justifyContent:'space-evenly'
                                }}
                            >
                                <Checkbox value="read">Read</Checkbox>
                                <Checkbox value="create">Create</Checkbox>
                                <Checkbox value="update">Update</Checkbox>
                                <Checkbox value="delete">Delete</Checkbox>
                            </CheckboxGroup>
                        </Form.Group>
                        <ButtonToolbar style={{
                            width:'100%',
                            display:'flex',
                            justifyContent:'space-evenly'
                        }}>
                            <Button appearance="primary" onClick={handleAddNewUser} 
                            style={{
                                width:'30%'
                            }}
                            >
                                Add
                            </Button>
                            <Button appearance="danger" onClick={() => setOpenAddModal(false)} 
                                style={{
                                    width:'30%'
                                }}
                                >
                                Cancel
                            </Button>
                        </ButtonToolbar>
                    </Form>
                </Sheet>
            </Modal>

            {/* Update User Modal */}
            <Modal
                aria-labelledby="modal-title"
                aria-describedby="modal-desc"
                open={openUpdateModal}
                onClose={() => setOpenUpdateModal(false)}
                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
                <Sheet
                    variant="outlined"
                    sx={{
                        maxWidth: 500,
                        borderRadius: 'md',
                        p: 3,
                        boxShadow: 'lg',
                    }}
                >
                    <ModalClose variant="plain" sx={{ m: 1 }} />
                    <Typography
                        component="h2"
                        id="modal-title"
                        level="h4"
                        textColor="inherit"
                        fontWeight="lg"
                        mb={1}
                    >
                        Update user:
                    </Typography>
                    <Form fluid>
                        <Form.Group controlId="name">
                            <Form.ControlLabel>Name</Form.ControlLabel>
                            <Form.Control
                                name="name"
                                value={updateUserState.name}
                                onChange={(value) => handleInputChangeUpdate(value, 'name')}
                            />
                        </Form.Group>
                        <Form.Group controlId="email">
                            <Form.ControlLabel>Email</Form.ControlLabel>
                            <Form.Control
                                name="email"
                                value={updateUserState.email}
                                onChange={(value) => handleInputChangeUpdate(value, 'email')}
                            />
                        </Form.Group>
                        <Form.Group controlId="password">
                            <Form.ControlLabel>Password</Form.ControlLabel>
                            <Form.Control
                                name="password"
                                type="password"
                                value={updateUserState.password}
                                onChange={(value) => handleInputChangeUpdate(value, 'password')}
                            />
                        </Form.Group>
                        <Form.Group controlId="role">
                            <Form.ControlLabel>Role</Form.ControlLabel>
                            <RadioGroup
                                name="role"
                                inline
                                appearance='picker'
                                value={updateUserState.role}
                                onChange={(value) => handleInputChangeUpdate(value, 'role')}
                            >
                                <Radio value="admin">Admin</Radio>
                                <Radio value="manager">Manager</Radio>
                                <Radio value="ingenieur">Ingenieur</Radio>
                                <Radio value="technicien">Technicien</Radio>
                            </RadioGroup>
                        </Form.Group>
                        <ButtonToolbar>
                            <Button appearance="primary" onClick={handleUpdateExistingUser}>
                                Update
                            </Button>
                            <Button appearance="default" onClick={() => setOpenUpdateModal(false)}>
                                Cancel
                            </Button>
                        </ButtonToolbar>
                    </Form>
                </Sheet>
            </Modal>

            {/* Delete User Modal */}
            <Modal open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
                <ModalDialog variant="outlined" role="alertdialog">
                <DialogTitle>
                    <WarningRoundedIcon />
                    Confirmation
                </DialogTitle>
                <Divider />
                <DialogContent>
                    Are you sure you want to delete user {userRow && userRow.name} ?
                </DialogContent>
                <DialogActions>
                    <Button variant="solid" color="danger" onClick={() => {dispatch(deleteUser({ token, id: userRow.id }));setOpenDeleteModal(false)}}>
                    Confirm
                    </Button>
                    <Button variant="plain" color="neutral" onClick={() => setOpenDeleteModal(false)}>
                    Cancel
                    </Button>
                </DialogActions>
                </ModalDialog>
            </Modal>
        </div>
    );
}
