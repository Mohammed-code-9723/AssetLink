import React,{useState,useEffect} from 'react'
import { deleteWorkspace, workspacesData, projectsData } from '../features/SuperAdminSlice';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsersData } from '../features/UserSlice';
import { Panel, Placeholder, AutoComplete ,Notification,Message,SelectPicker,DatePicker} from 'rsuite';

import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';

import CardOverflow from '@mui/joy/CardOverflow';
import { Typography,Divider,Button, Sheet ,Stack, Chip,Textarea} from '@mui/joy';
import Grid from '@mui/joy/Grid';
import Modal from '@mui/joy/Modal';
import ModalClose from '@mui/joy/ModalClose';
import Site from './Site';
import { SiTestrail } from 'react-icons/si';
import { RiDeleteBin6Fill } from "react-icons/ri";
import { FaEye } from "react-icons/fa6";

import Breadcrumbs from '@mui/joy/Breadcrumbs';
import Link from '@mui/joy/Link';

import { FaMapLocationDot } from "react-icons/fa6";
import { FaDiagramProject } from "react-icons/fa6";
import { useTranslation } from 'react-i18next';

import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import DialogActions from '@mui/joy/DialogActions';
import ModalDialog from '@mui/joy/ModalDialog';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { FaCheck } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import { GrUpdate } from "react-icons/gr";
import { BiSolidAddToQueue } from "react-icons/bi";
import {hasPermission} from '../components/CheckPermissions';
import { MdDelete } from 'react-icons/md';
import dayjs from 'dayjs';


const Header = props => {
  const { title, ...rest } = props;
  return (
    <Stack {...rest} spacing={10} alignItems="flex-start" style={{
      background: 'linear-gradient(124deg, rgba(7,28,75,1) 0%, rgba(9,100,60,1) 100%)',
      padding: '10px',
      borderRadius: '5px',
      // width:'100%'
    }}>
      <Stack spacing={2} direction="column" alignItems="flex-start">
        <div style={{ color: 'white' }}>{title}</div>
      </Stack>
    </Stack>
  );
};



export default function WorkspacesSuperAdmin() {
  
  const dispatch=useDispatch();
  const token = localStorage.getItem('token');
  const userInfo=JSON.parse(localStorage.getItem('user'));

  const { users, status, error } = useSelector((state) => state.users);
  const { workspaces, statusWorkspaces , errorWorkspaces } = useSelector((state) => state.workspaces);
  const { projects, statusProjects , errorProjects } = useSelector((state) => state.projects);
  const { messageDeleteWorkspace, statusDeleteWorkspace , errorDeleteWorkspace } = useSelector((state) => state.deleteWorkspace);
  
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deletedWorkspace, setDeletedWorkspace] = useState(null);
  
  const [allUsers,setAllUsers]=useState([]);
  //!search states:
  const [search,setSearch]=useState("");
  const [filteredUsers,setFilteredUsers]=useState(null);

  const [openMoreDetails,setOpenMoreDetails]=useState(false);
  const [chosenWorkspace,setChosenWorkspace]=useState(null);
  const [chosenWorkspaceProjects,setChosenWorkspaceProjects]=useState([]);
  
  const [openUpdateWorkspace,setOpenUpdateWorkspace]=useState(false);

  const [chosenUser,setChosenUser]=useState(null);
  const [openAddWorkspace,setOpenAddWorkspace]=useState(false);
  
  const {t } = useTranslation();

  useEffect(() => {
    if (users) {
      setAllUsers(users.users);
    }
  }, [users]);

  useEffect(()=>{
    dispatch(fetchUsersData(token));
    dispatch(workspacesData(token));
    dispatch(projectsData(token));
    
  },[]);
  
  // console.log("projects: ",projects);

  useEffect(()=>{
    dispatch(fetchUsersData(token));
    dispatch(workspacesData(token));
    dispatch(projectsData(token));
  },[statusDeleteWorkspace]);

  useEffect(()=>{
    setFilteredUsers(allUsers.filter((user)=>user.name.includes(search)||user.email.includes(search)||user.role.includes(search)));
  },[search])

  const moreDetails=(workspace)=>{
    setOpenMoreDetails(true);
    setChosenWorkspaceProjects(workspaces?.find(w=>w.id===workspace.id)?.projects);
    setChosenWorkspace(workspace);
  }

  const deleteWorkspaceById=(workspace)=>{
    setDeletedWorkspace(workspace);
    setOpenDeleteModal(true);
  }

  const updateWorkspace=(workspace)=>{
    setOpenUpdateWorkspace(true);
    setChosenWorkspace(workspace);
  }

  const addWorkspace=(user)=>{
    setChosenUser(user);
    setOpenAddWorkspace(true );
  }
  const [openUpdateProject,setOpenUpdateProject]=useState(false);

  const [addPF,setAddPF]=useState(false);
  const [messageAddProject,setMessageAddProject]=useState(null);
  const [messageDeleteProject,setMessageDeleteProject]=useState(null);
  const [messageUpdateProject,setMessageUpdateProject]=useState(null);
  
  const [notif,setNotif]=useState(false);

  const addProject=async(event,workspace_id) => {
    event.preventDefault();
    setAddPF(false);
    setNotif(true);
    const formData = new FormData(event.target);

    // Extract the values
    const newProject= {
      name: formData.get('name'),
      description: formData.get('description'),
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/workspaces/${workspace_id}/addProject`, {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, 
        },
        body: JSON.stringify(newProject),
      });

      if (response.ok) {
        const result = await response.json();
        setMessageAddProject( result.message);
        dispatch(fetchUsersData(token));
        dispatch(workspacesData(token)).then(()=>{
          dispatch(projectsData(token));
          setChosenWorkspaceProjects([...chosenWorkspaceProjects,newProject]);
        });
      } else {
        const errorData = await response.json();
        console.error('Failed to add project:', errorData);
      }
    } catch (error) {
      console.error('Error occurred while adding project:', error);
    }
  }
  

  const [projectID,setProjectID]=useState(null);

  const handleUpdateProject=(e,project)=>{
    setProjectID(project);
    setOpenUpdateProject(true);
    
  }
  const submitUpdateProject=async(event)=>{
    event.preventDefault();
    setOpenUpdateProject(false);
    setNotif(true);
    const formData = new FormData(event.target);

    const newProject= {
      name: formData.get('name'),
      description: formData.get('description'),
    };
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/workspaces/${chosenWorkspace?.id}/Projects/${projectID&&projectID.id}`, {
        method: 'PUT', 
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, 
        },
        body: JSON.stringify(newProject),
      });

      if (response.ok) {
        const result = await response.json();
        setMessageUpdateProject( result.message);
        dispatch(fetchUsersData(token));
        dispatch(workspacesData(token)).then(()=>{
          dispatch(projectsData(token));
          setChosenWorkspaceProjects((prev)=>prev.map((item)=>{
            if(item.id===projectID?.id){
              return {...item, ...newProject};
            }
            return item;
          }));
        });
      } else {
        const errorData = await response.json();
        console.error('Failed to delete project:', errorData);
      }
    } catch (error) {
      console.error('Error occurred while deleting project:', error);
    }
  }


  const handleDeleteProject=async(event,project_id)=>{
    event.preventDefault();
    setAddPF(false);
    setNotif(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/workspaces/${chosenWorkspace?.id}/Projects/${project_id}`, {
        method: 'DELETE', 
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, 
        },
      });

      if (response.ok) {
        const result = await response.json();
        setMessageDeleteProject( result.message);
        dispatch(fetchUsersData(token));
        dispatch(workspacesData(token)).then(()=>{
          dispatch(projectsData(token));
          setChosenWorkspaceProjects((prev)=>prev.filter((p)=>p.id!==project_id));
        });
      } else {
        const errorData = await response.json();
        console.error('Failed to delete project:', errorData);
      }
    } catch (error) {
      console.error('Error occurred while deleting project:', error);
    }
  }

  const handleCloseU=()=>{
    setOpenUpdateProject(false)
  }
  
  useEffect(()=>{
    dispatch(workspacesData(token)).then(()=>{
      dispatch(projectsData(token));
      setChosenWorkspaceProjects(workspaces?.find(w=>w.id===chosenWorkspace?.id)?.projects);
    });
  },[messageAddProject,messageUpdateProject])

  useEffect(()=>{
    const intervalLoader=setTimeout(() => {
      setNotif(false);
    }, 5000);
    return ()=>clearTimeout(intervalLoader);
  },[notif]);


  
  const [message,setMessage]=useState('');
  const [openAddScenario,setOpenAddScenario]=useState(false);
  const [openDeleteScenario,setOpenDeleteScenario]=useState(false);
  const [openUpdateScenario,setOpenUpdateScenario]=useState(false);
  const [cScenario_id,setCscenario_id]=useState(null);
  const [cProject_id,setCproject_id]=useState(null);
  const [addPFS,setAddPFS]=useState(false);
  const [newScenario,setNewScenario]=useState({
    name:null,
    start_year:null,
    end_year:null,
    maintenance_strategy:null,
    budgetary_constraint:null,
    status:null,
    project_id:null,
  });
  const handleChange = (name, value) => {
    setNewScenario({
        ...newScenario,
        [name]: value
    });
};
  const handleOpenDelete=(scenario_id,project_id)=>{
    setCproject_id(project_id);
    setCscenario_id(scenario_id);
    setOpenDeleteScenario(true);
  }

  // const []
  const [addPFSU,setAddPFSU]=useState(false);
  const handleOpenUpdate=(scenario,project_id)=>{
    setAddPFSU(true);
    setNewScenario(scenario);
  }

  //!
//!add scenario
const handleAddScenario = async (event,project_id) => {
  event.preventDefault();
  // handleChange('project_id',cProject_id);
  newScenario.project_id=project_id;
  
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/workspaces/${chosenWorkspace?.id}/projects/${cProject_id}/scenarios/addScenario`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newScenario),
    });

    if (!response.ok) {
        throw new Error('Failed to add report');
    }

    const data = await response.json();
    setMessage(data.message);
    dispatch(projectsData(token));
    setAddPFS(false);
    setOpenAddScenario(false);
    setNewScenario({
      name:null,
      start_year:null,
      end_year:null,
      maintenance_strategy:null,
      budgetary_constraint:null,
      status:null,
      project_id:null,
    });
    return data;
  } catch (error) {
      console.error('Error adding report:', error);
      return Promise.reject(error.message);
  } 
};

//!update scenario:


const handleUpdateScenario= async (event) => {
  event.preventDefault();
  try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/workspaces/${chosenWorkspace?.id}/projects/${cProject_id}/scenarios/updateScenario`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newScenario),
      });

      if (!response.ok) {
          throw new Error('Failed to update report');
      }

      const data = await response.json();
      setMessage(data.message);
      dispatch(projectsData(token));
      setAddPFSU(false);
      setOpenUpdateScenario(false);
      setNewScenario({
        name:null,
        start_year:null,
        end_year:null,
        maintenance_strategy:null,
        budgetary_constraint:null,
        status:null,
        project_id:null,
      });
      return data;
  } catch (error) {
      console.error(error);
  }
};

//!delete scenario:

const handleDeleteScenario = async () => {
  
  try {
    // '{workspace}/projects/{project}/scenarios'
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/workspaces/${chosenWorkspace?.id}/projects/${cProject_id}/scenarios/deleteScenario`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body:JSON.stringify({id:cScenario_id}) 
      });

      if (!response.ok) {
          throw new Error('Failed to delete report');
      }

      const data = await response.json();
      setMessage(data.message);
      dispatch(projectsData(token));
      setOpenDeleteScenario(false);
      return data;
  } catch (error) {
      console.error('Error deleting report:', error);
      return Promise.reject(error.message);
  }
};

  //!
  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'start_year', headerName: 'Start Year', width: 130 },
    { field: 'end_year', headerName: 'End Year', width: 130 },
    { field: 'maintenance_strategy', headerName: 'Maintenance Strategy', width: 200 },
    { field: 'budgetary_constraint', headerName: 'Budgetary Constraint', width: 200 },
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
      renderCell: (params) => (
        <Chip
          variant="outlined"
          color={params.value === 'Active' ? 'success' : 'danger'}
          startDecorator={params.value==='Active'?<FaCheck />:<ImCross/>}
        >
          {params.value}
        </Chip>
      ),
    },
    { field: 'duration', headerName: 'Duration (years)', width: 150 },
    {
      field: 'action',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%' ,height:'fit-content', alignItems:'center' }}>
        <Button
          onClick={() => handleOpenUpdate(params.row,params.row.project_id)}
          style={{ marginRight: '10px', background: 'linear-gradient(265deg, rgba(5,127,83,1) 0%, rgba(95,5,138,1) 100%)', color: 'white',marginTop:'6px' }}
        >
          <GrUpdate/>
        </Button>
        <Button
          onClick={() => handleOpenDelete(params.row.id,params.row.project_id)}
          style={{marginRight: '10px', background: 'linear-gradient(265deg, rgba(5,127,83,1) 0%, rgba(95,5,138,1) 100%)', color: 'white' ,marginTop:'6px'}}
        >
          <MdDelete/>
        </Button>
      </div>
      ),
    },
  ];

  useEffect(()=>{
    if(message!==''){
      const intervalM=setTimeout(()=>{
        setMessage('');
      },5000);
      return ()=>clearTimeout(intervalM);
    }
  },[message]);

  return (
    <div>
      <Breadcrumbs separator=">" aria-label="breadcrumbs" size="sm">
        {[t('dashboard'),t('users.workspaces')].map((item) => (
        <Link key={item} color="neutral" href="#sizes">
            <h5>
                {item} 
            </h5>
        </Link>
        ))}
      </Breadcrumbs>
      {((messageDeleteWorkspace&&  messageDeleteWorkspace !== '' )&&notif)&& (
          <Notification type="success" header={`${messageDeleteWorkspace}`} closable style={{position:'relative',width:'100%'}}>
          </Notification>
      )}
      <center>
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
          <Button sx={{background:' linear-gradient(265deg, rgba(5,127,83,1) 0%, rgba(95,5,138,1) 100%)'}} onClick={()=>{setSearch("");setFilteredUsers(null)}}>{t('search.clear')}</Button>
        </div>
      </center>
      <div>
        <Grid container spacing={2} sx={{ flexGrow: 1,width:'100%',display:'flex',gap:'10px' ,justifyContent:'center'}}>
          {
            filteredUsers&&search!==""?(
              filteredUsers.map((user,index)=>(
                <Grid lg={5} xs={12} >
                  <Card variant="outlined"  key={index}>
                    <CardContent sx={{
                      background:'linear-gradient(124deg, rgba(7,28,75,1) 0%, rgba(9,100,60,1) 100%)',
                      margin:'-12px',
                      borderTopLeftRadius:'5px',                      
                      borderTopRightRadius:'5px',                      
                      padding:'10px'
                    }}>
                      <center>
                        <Typography level="title-lg" sx={{color:'white'}}>{user.name}</Typography>
                      </center>
                      <Typography level="body-sm" sx={{color:'rgb(231, 231, 230)'}}><strong>Email:</strong> {user.email}</Typography>
                      <Typography level="body-sm" sx={{color:'rgb(231, 231, 230)'}}><strong>Role: </strong>{user.role}</Typography>
                    </CardContent>
                    <CardOverflow variant="soft" sx={{ bgcolor: 'background.level1' }}>
                      <Divider inset="context" />
                      <CardContent orientation="horizontal" sx={{width:'100%',direction:t('workspaces.name')==="الاسم"?'rtl':'lfr'}}>
                          {t('users.nbrWorkspaces')}: <strong>{user.workspaces.length}</strong>
                        <Divider orientation="horizontal" />
                      </CardContent>
                      <CardContent>
                        <Panel header={<Header
                            title={t("users.workspaces")}
                          />} collapsible bordered 
                            style={{padding:'20px'}}
                          
                          >
                          {
                            user.workspaces.map((workspace,index)=>(
                              <Card key={index} sx={{marginBottom:'10px',
                                width:'100%',
                                marginLeft:'-10px'
                              }}>
                                <CardOverflow variant="soft" sx={{
                                  width:'100%'
                                  ,direction:t('workspaces.name')==="الاسم"?'rtl':'lfr'
                                }}>
                                  <b>{t('workspace')}: {index+1}</b>
                                  <p>{t('workspaces.name')}: {workspace.name} </p>
                                  <p>{t('workspaces.description')}: {workspace.description} </p>
                                </CardOverflow>
                                <CardOverflow
                                  variant="soft"
                                  sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    gap: 1,
                                    justifyContent: 'space-around',
                                    py: 1,
                                    borderTop: '1px solid',
                                    borderColor: 'divider',
                                  }}
                                >
                                  <Typography startDecorator={<FaDiagramProject color="danger" />} level="title-sm">
                                    {t('users.nbrProjects')}: 
                                    {(workspaces && workspaces.find(w => w.id === workspace.id)?.projects?.length) || 0}
                                  </Typography>
                                  <Divider orientation="vertical" />
                                  <Typography startDecorator={<FaMapLocationDot />} level="title-sm">
                                    {t('users.nbrSites')}: 
                                    {(workspaces && workspaces.find(w => w.id === workspace.id)?.sites?.length) || 0}
                                  </Typography>
                                </CardOverflow>
                                <CardContent sx={{
                                  width:'100%',
                                  display:'flex',
                                  flexWrap:'wrap'
                                }}>
                                  {
                                    (hasPermission(userInfo.permissions, 'sites', 'read')&&hasPermission(userInfo.permissions, 'projects', 'create'))&&(
                                      <Button  style={{width:'100%'}} onClick={()=>moreDetails(workspace)}>
                                        <span style={{width:'20%'}}>
                                          <FaEye/>
                                        </span>
                                        <span style={{width:'80%'}}>
                                          { t('users.showPS')}
                                        </span>
                                      </Button>
                                    )
                                  }
                                  {
                                    hasPermission(userInfo.permissions, 'workspaces', 'delete')&&(
                                      <Button style={{width:'100%'}} sx={{background:'red'}} onClick={()=>deleteWorkspaceById(workspace)}>
                                        <span style={{width:'20%'}}>
                                          <RiDeleteBin6Fill/>
                                        </span>
                                        <span style={{width:'80%'}}>
                                          {t('users.deleteW')}
                                        </span>
                                      </Button>
                                    )
                                  }
                                    {
                                      hasPermission(userInfo.permissions, 'workspaces', 'update')&&(
                                      <Button style={{width:'100%'}} sx={{background:'rgb(2, 148, 95)'}} onClick={()=>updateWorkspace(workspace)}>
                                        <span style={{width:'20%'}}>
                                          <GrUpdate/>
                                        </span>
                                        <span style={{width:'80%'}}>
                                          {t('users.updateW')}
                                        </span>
                                      </Button>
                                      )
                                    }
                                </CardContent>
                              </Card> 
                            ))
                          }
                        </Panel>
                      </CardContent>
                    </CardOverflow>
                    <Button style={{width:'100%'}} sx={{background:'linear-gradient(265deg, rgb(88, 5, 115) 0%, rgb(21, 107, 76) 50%, rgb(5, 48, 135) 100%)'}} onClick={()=>addWorkspace(user)}>
                      <span style={{width:'20%'}}>
                        <BiSolidAddToQueue/>
                      </span>
                      <span style={{width:'80%'}}>
                        {t('users.addW')}
                      </span>
                  </Button>
                  </Card>
                </Grid>
              ))
            ):(
              allUsers.map((user,i)=>(
                <Grid lg={5} xs={12} sx={{zIndex:i+1}}>
                  <Card variant="outlined"  key={i}>
                    <CardContent sx={{
                      background:'linear-gradient(124deg, rgba(7,28,75,1) 0%, rgba(9,100,60,1) 100%)',
                      margin:'-12px',
                      borderTopLeftRadius:'5px',                      
                      borderTopRightRadius:'5px',                      
                      padding:'10px'
                    }}>
                      <center>
                        <Typography level="title-lg" sx={{color:'white'}}>{user.name}</Typography>
                      </center>
                      <Typography level="body-sm" sx={{color:'rgb(231, 231, 230)'}}><strong>Email:</strong> {user.email}</Typography>
                      <Typography level="body-sm" sx={{color:'rgb(231, 231, 230)'}}><strong>Role: </strong>{user.role}</Typography>
                    </CardContent>
                    <CardOverflow variant="soft" sx={{ bgcolor: 'background.level1' }}>
                      <Divider inset="context" />
                      <CardContent orientation="horizontal" sx={{width:'100%',direction:t('workspaces.name')==="الاسم"?'rtl':'lfr'}}>
                          {t('users.nbrWorkspaces')}: <strong>{user.workspaces.length}</strong>
                        <Divider orientation="horizontal" />
                      </CardContent>
                      <CardContent>
                        <Panel header={<Header
                            title={t("users.workspaces")}
                          />} collapsible bordered 
                            style={{padding:'20px'}}
                          
                          >
                          {
                            user.workspaces.map((workspace,index)=>(
                              <Card key={index} sx={{marginBottom:'10px',
                                width:'100%',
                                marginLeft:'-10px'
                              }}>
                                <CardOverflow variant="soft" sx={{
                                  width:'100%'
                                  ,direction:t('workspaces.name')==="الاسم"?'rtl':'lfr'
                                }}>
                                  <b>{t('workspace')}: {index+1}</b>
                                  <p>{t('workspaces.name')}: {workspace.name} </p>
                                  <p>{t('workspaces.description')}: {workspace.description} </p>
                                </CardOverflow>
                                <CardOverflow
                                  variant="soft"
                                  sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    gap: 1,
                                    justifyContent: 'space-around',
                                    py: 1,
                                    borderTop: '1px solid',
                                    borderColor: 'divider',
                                  }}
                                >
                                  <Typography startDecorator={<FaDiagramProject color="danger" />} level="title-sm">
                                    {t('users.nbrProjects')}: 
                                    {(workspaces && workspaces.find(w => w.id === workspace.id)?.projects?.length) || 0}
                                  </Typography>
                                  <Divider orientation="vertical" />
                                  <Typography startDecorator={<FaMapLocationDot />} level="title-sm">
                                    {t('users.nbrSites')}: 
                                    {(workspaces && workspaces.find(w => w.id === workspace.id)?.sites?.length) || 0}
                                  </Typography>
                                </CardOverflow>
                                <CardContent sx={{
                                  width:'100%',
                                  display:'flex',
                                  flexWrap:'wrap'
                                }}>
                                  {
                                    (hasPermission(userInfo.permissions, 'sites', 'read')&&hasPermission(user.permissions, 'projects', 'create'))&&(
                                      <Button  style={{width:'100%'}} onClick={()=>moreDetails(workspace)}>
                                        <span style={{width:'20%'}}>
                                          <FaEye/>
                                        </span>
                                        <span style={{width:'80%'}}>
                                          { t('users.showPS')}
                                        </span>
                                      </Button>
                                    )
                                  }
                                  {
                                    hasPermission(userInfo.permissions, 'workspaces', 'delete')&&(
                                      <Button style={{width:'100%'}} sx={{background:'red'}} onClick={()=>deleteWorkspaceById(workspace)}>
                                        <span style={{width:'20%'}}>
                                          <RiDeleteBin6Fill/>
                                        </span>
                                        <span style={{width:'80%'}}>
                                          {t('users.deleteW')}
                                        </span>
                                      </Button>
                                    )
                                  }
                                    {
                                      hasPermission(userInfo.permissions, 'workspaces', 'update')&&(
                                      <Button style={{width:'100%'}} sx={{background:'rgb(2, 148, 95)'}} onClick={()=>updateWorkspace(workspace)}>
                                        <span style={{width:'20%'}}>
                                          <GrUpdate/>
                                        </span>
                                        <span style={{width:'80%'}}>
                                          {t('users.updateW')}
                                        </span>
                                      </Button>
                                      )
                                    }
                                </CardContent>
                              </Card> 
                            ))
                          }
                        </Panel>
                      </CardContent>
                      
                    </CardOverflow>
                    <Button style={{width:'100%'}} sx={{background:'linear-gradient(265deg, rgb(88, 5, 115) 0%, rgb(21, 107, 76) 50%, rgb(5, 48, 135) 100%)'}} onClick={()=>addWorkspace(user)}>
                      <span style={{width:'20%'}}>
                        <BiSolidAddToQueue/>
                      </span>
                      <span style={{width:'80%'}}>
                        {t('users.addW')}
                      </span>
                    </Button>
                  </Card>
                </Grid>
              ))
            )
          }
        </Grid>
      </div>
      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={openMoreDetails}
        onClose={() => {
          setOpenMoreDetails(false);
          setChosenWorkspaceProjects([]);
          setChosenWorkspace(null);
          }
        }
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <Sheet
          variant="outlined"
          sx={{
            width:'95%',
            height:'98vh',
            overflowY:'scroll',
            borderRadius: 'md',
            p: 3,
            boxShadow: 'lg',
            marginTop:'100px',
            marginLeft:'40px'
          }}
        >
          <ModalClose variant="plain" sx={{ m: 1 }} />
          <Typography
            component="h2"
            id="modal-title"
            level="h4"
            textColor="inherit"
            fontWeight="lg"
            textAlign="center"
            mb={1}
            sx={{
              width:'100%',
              display:'flex',
              justifyContent:'center',
              flexDirection:'column'
            }}
          >
            <h2>{t('workspace')} <span id='title_H2_2'>{chosenWorkspace&&chosenWorkspace.name}</span> {t('details')} </h2><br />
            <center>
              <Breadcrumbs separator=">" aria-label="breadcrumbs" size="sm" sx={{width:'100%'}}>
              {[t('users.workspaces'),`${t('workspace')} ${chosenWorkspace&&chosenWorkspace.name}`,`${t('sites')} && ${t('projects')}`].map((item) => (
              <Link className='Link_breadcrumbs' key={item} color="neutral" href="#sizes">
                <h5>
                  {item}
                </h5>
              </Link>
              ))}
              </Breadcrumbs>
            </center>
          </Typography>
          <div>
            <div className='title_image'>
              <h2 id='title_H2'><SiTestrail style={{color:'rgb(3, 110, 74)'}}/><span> {t('projects')} </span></h2>
              <img src="/assets/Sites.svg" alt="sites_img" />
            </div>
            <div>
              <Sheet
                variant="soft"
                sx={{
                  // width:'95%',
                  // height:'20vh',
                  // overflowY:'scroll',
                  borderRadius: 'md',
                  zIndex:1000,
                  p: 3,
                  boxShadow: 'lg',
                  boxShadow:'0 0 5px rgba(176, 175, 175, 0.786)',
                  marginBottom:'20px'
                }}
                color="neutral" 
              >
                { 
                  chosenWorkspaceProjects?.length===0?(
                    <center>
                      <h3>This workspace has no projects</h3>
                    </center> 
                  ):(
                    chosenWorkspaceProjects?.map((project, index) => (
                      <Panel key={index} header={
                        <Stack spacing={10}  style={{
                          background: 'linear-gradient(124deg, rgba(7,28,75,1) 0%, rgba(9,100,60,1) 100%)',
                          padding: '10px',
                          borderRadius: '5px',
                          width:'100%'
                        }}>
                          <Stack spacing={2} direction="column" >
                            <div style={{ color: 'white' ,alignItems:'flex-start'}}>{project.name}</div>
                            <div style={{ color: 'var(--rs-text-secondary)', fontSize: 12,width:'100%',display:'flex',justifyContent:'space-evenly',flexWrap:'wrap',position:'relative'}}>
                            {
                              hasPermission(userInfo.permissions, 'projects', 'delete')&&(
                                <Button style={{width:'30%'}} sx={{background:'red'}} onClick={(e)=>{
                                  e.stopPropagation();
                                  handleDeleteProject(e,project.id)
                                  
                                  }}>
                                  <span style={{width:'20%'}}>
                                    <RiDeleteBin6Fill/>
                                  </span>
                                  <span style={{width:'80%'}}>
                                    {t('users.delete')} {t('project')}
                                  </span>
                                </Button>
                              )
                            }
                            {
                              hasPermission(userInfo.permissions, 'projects', 'update')&&(
                                <Button style={{width:'30%'}} sx={{background:'blue'}} onClick={(e)=>{
                                  e.stopPropagation();
                                  handleUpdateProject(e,project)
                                  
                                  }} >
                                  <span style={{width:'20%'}}>
                                    <GrUpdate/>
                                  </span>
                                  <span style={{width:'80%'}}>
                                    {t('users.update')} {t('project')}
                                  </span>
                                </Button>
                              )
                            }
                            </div>
                          </Stack>
                        </Stack>
                      } collapsible bordered>
                        <div>
                          <p>
                            <strong>Project description:</strong> {project.description}
                          </p>
                          <p>
                            <strong>N° of Scenarios :</strong> {projects?.projectsBackData.find((p) => p.id === project.id)?.scenarios.length}
                          </p>
                        </div>
                        <br />
                        <h3>{t('users.allScenarios')}</h3>
                        <div>
                          {projects ? (
                            <>
                              <DataGrid 
                                rows={projects?.projectsBackData.find((p) => p.id === project.id)?.scenarios || []}
                                columns={columns}
                                pageSize={5}
                                rowsPerPageOptions={[5]}
                                autoHeight
                                slots={{ toolbar: GridToolbar }}
                              />
                                
                                
                            </>
                          ) : (
                            <p>No scenarios found</p>
                          )}
                          <div className='Add_container'>
                            <Button style={{width:'50%'}} sx={{background:'linear-gradient(265deg, rgb(88, 5, 115) 0%, rgb(21, 107, 76) 50%, rgb(5, 48, 135) 100%)'}} 
                            onClick={()=>setAddPFS(!addPFS)}>
                              <span style={{width:'20%'}}>
                                <BiSolidAddToQueue/>
                              </span>
                              <span style={{width:'80%'}}>
                                {t('addScenario')}
                              </span>
                            </Button>
                          </div>
                          {
                            message!==''&&(
                              <Message >
                                {message}
                              </Message>
                            )
                          }
                          <div style={{display:addPFS?'flex':'none',width:'100%',justifyContent:'center',alignItems:'center'}}>
                          <form
                            onSubmit={(e)=>handleAddScenario(e,project?.id)}
                            style={{width:'90%'}}
                          >
                            <Stack spacing={2}>
                              <center>
                                <h3>Add new Scenario</h3>
                              </center>
                            <FormControl>
                                <FormLabel>Name</FormLabel>
                                <Input
                                  name="name"
                                  autoFocus
                                  required
                                  placeholder='Scenario name'
                                  onChange={(e)=>handleChange('name',e.target.value)}
                                />
                              </FormControl>
                              <FormControl>
                                <FormLabel>Start year</FormLabel>
                                <DatePicker
                                  placeholder="Start Year"

                                  style={{ width: '100%' }}
                                  menuStyle={{zIndex:10000}}
                                  onChange={value => handleChange('start_year',dayjs(value).format('YYYY'))} 
                                  ranges={[]} 
                                  block
                                />
                              </FormControl>
                              <FormControl>
                                <FormLabel>End year</FormLabel>
                                <DatePicker
                                  placeholder="End Year"
                                  
                                  style={{ width: '100%' }}
                                  menuStyle={{zIndex:10000}}
                                  onChange={value => handleChange('end_year',dayjs(value).format('YYYY'))}
                                  ranges={[]} 
                                  block
                                />
                              </FormControl>
                              <FormControl>
                                <FormLabel>Maintenances strategy</FormLabel>
                                <Textarea
                                  name="maintenance_strategy"
                                  required
                                  minRow={6}
                                  placeholder='Maintenance strategy'
                                  onChange={(e)=>handleChange('maintenance_strategy',e.target.value)}
                                />
                              </FormControl>
                              <FormControl>
                                <FormLabel>Budgetary constraint</FormLabel>
                                <Textarea
                                  name="Budgetary constraint"
                                  required
                                  minRow={6}
                                  placeholder='Budgetary constraint'
                                  menuStyle={{zIndex:10000}}
                                  onChange={(e)=>handleChange('budgetary_constraint',e.target.value)}
                                />
                              </FormControl>
                              <FormControl>
                                <FormLabel>Status</FormLabel>
                                <SelectPicker
                                  data={[
                                    {label:'Active',value:'Active'},
                                    {label:'Inactive',value:'Inactive'},
                                  ]}
                                  name="status"
                                  required
                                  minRow={6}
                                  placeholder='status'
                                  menuStyle={{zIndex:10000}}
                                  onChange={(value)=>handleChange('status',value)}
                                />
                              </FormControl>
                              <div style={{width:'100%',display:'flex',justifyContent:'space-evenly'}}>
                                <Button type='submit'>{t('users.save')}</Button>
                                <Button onClick={()=>{
                                  setAddPFS(false);
                                  setNewScenario({
                                    name: null, 
                                    start_year: null, 
                                    end_year: null, 
                                    maintenance_strategy: null, 
                                    budgetary_constraint: null, 
                                    status: null, 
                                    project_id: null
                                  })
                                }}>{t('cancel')}</Button>
                              </div>
                            </Stack>
                          </form>
                        </div>

                        <div style={{display:addPFSU?'flex':'none',width:'100%',justifyContent:'center',alignItems:'center'}}>
                          <form
                            onSubmit={(e)=>handleUpdateScenario(e,project?.id)}
                            style={{width:'90%'}}
                          >
                            <Stack spacing={2}>
                              <center>
                                <h3>Update Scenario {newScenario.name}</h3>
                              </center>
                            <FormControl>
                                <FormLabel>Name</FormLabel>
                                <Input
                                  name="name"
                                  autoFocus
                                  required
                                  value={newScenario.name}
                                  placeholder='Scenario name'
                                  onChange={(e)=>handleChange('name',e.target.value)}
                                />
                              </FormControl>
                              <FormControl>
                                <FormLabel>Start year &nbsp;<span style={{textDecoration:'underline'}}>{newScenario.start_year}</span></FormLabel>
                                <DatePicker
                                  placeholder={newScenario.start_year}
                                  style={{ width: '100%' }}
                                  menuStyle={{zIndex:10000}}
                                  // defaultValue={dayjs().format('yyyy-MM-dd')}
                                  // renderValue={dayjs().format('yyyy-MM-dd')}
                                  onChange={value => handleChange('start_year',dayjs(value).format('YYYY'))} 
                                  ranges={[]} 
                                  block
                                />
                              </FormControl>
                              <FormControl>
                                <FormLabel>End year &nbsp;<span style={{textDecoration:'underline'}}>{newScenario.end_year}</span></FormLabel>
                                <DatePicker
                                  placeholder={newScenario.end_year}
                                  style={{ width: '100%' }}
                                  menuStyle={{zIndex:10000}}
                                  // defaultValue={dayjs().format('yyyy-MM-dd')}
                                  // renderValue={dayjs().format('yyyy-MM-dd')}
                                  onChange={value => handleChange('end_year',dayjs(value).format('YYYY'))}
                                  ranges={[]} 
                                  block
                                />
                              </FormControl>
                              <FormControl>
                                <FormLabel>Maintenances strategy</FormLabel>
                                <Textarea
                                  name="maintenance_strategy"
                                  required
                                  minRow={6}
                                  placeholder='Maintenance strategy'
                                  value={newScenario.maintenance_strategy}
                                  onChange={(e)=>handleChange('maintenance_strategy',e.target.value)}
                                />
                              </FormControl>
                              <FormControl>
                                <FormLabel>Budgetary constraint</FormLabel>
                                <Input
                                  name="Budgetary constraint"
                                  required
                                  minRow={6}
                                  placeholder='Budgetary constraint'
                                  menuStyle={{zIndex:10000}}
                                  value={newScenario.budgetary_constraint}
                                  onChange={(e)=>handleChange('budgetary_constraint',e.target.value)}
                                />
                              </FormControl>
                              <FormControl>
                                <FormLabel>Status</FormLabel>
                                <SelectPicker
                                  data={[
                                    {label:'Active',value:'Active'},
                                    {label:'Inactive',value:'Inactive'},
                                  ]}
                                  name="status"
                                  required
                                  minRow={6}
                                  placeholder='status'
                                  menuStyle={{zIndex:10000}}
                                  value={newScenario.status}
                                  onChange={(value)=>handleChange('status',value)}
                                />
                              </FormControl>
                              <div style={{width:'100%',display:'flex',justifyContent:'space-evenly'}}>
                                <Button type='submit'>{t('users.save')}</Button>
                                <Button onClick={()=>{
                                  setAddPFSU(false);
                                  setNewScenario({
                                    name: null, 
                                    start_year: null, 
                                    end_year: null, 
                                    maintenance_strategy: null, 
                                    budgetary_constraint: null, 
                                    status: null, 
                                    project_id: null
                                  })
                                }}>{t('cancel')}</Button>
                              </div>
                            </Stack>
                          </form>
                        </div>
                        </div>
                      </Panel>
                    ))
                  )
                }
                {((messageAddProject||messageDeleteProject||messageUpdateProject)&&notif)&& (
                    <Notification type="success" header={`${messageAddProject||messageDeleteProject||messageUpdateProject}`} closable style={{position:'relative',width:'100%'}}>
                    </Notification>
                )}
                <div style={{display:addPF?'flex':'none',justifyContent:'center',alignItems:'center'}}>
                  <form
                    onSubmit={(e)=>addProject(e,chosenWorkspace?.id)}
                  >
                    <Stack spacing={2}>
                    <FormControl>
                        <FormLabel>Name</FormLabel>
                        <Input
                          name="name"
                          autoFocus
                          required
                          placeholder='Project name'
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Description</FormLabel>
                        <Input
                          name="description"
                          required
                          placeholder='Project description'
                        />
                      </FormControl>
                      <Button type="submit">Submit</Button>
                    </Stack>
                  </form>
                </div>
                {
                  hasPermission(userInfo.permissions, 'projects', 'create')&&(
                    <div className='Add_container'>
                      <Button style={{width:'50%'}} sx={{background:'linear-gradient(265deg, rgb(88, 5, 115) 0%, rgb(21, 107, 76) 50%, rgb(5, 48, 135) 100%)'}} onClick={()=>setAddPF(!addPF)}>
                        <span style={{width:'20%'}}>
                          <BiSolidAddToQueue/>
                        </span>
                        <span style={{width:'80%'}}>
                          {t('addProject')}
                        </span>
                      </Button>
                    </div>
                  )
                }
              </Sheet>
            </div>
            {/* <Divider/> */}
            {
              hasPermission(userInfo.permissions, 'sites', 'read')&&(
                <Site workspace={chosenWorkspace} projects={chosenWorkspaceProjects}/>
              )
            }
          </div>
        </Sheet>
      </Modal>

      {/* Modal update project */}
      <Modal open={openUpdateProject} onClose={handleCloseU}>
        <ModalDialog>
          <DialogTitle>{t('users.update')} {t('project')} {projectID?.name}</DialogTitle>
          <DialogContent>Update the information of the project.</DialogContent>
          <form
            onSubmit={(e)=>submitUpdateProject(e)}
          >
            <Stack spacing={2}>
            <FormControl>
                <FormLabel>Name</FormLabel>
                <Input
                  name="name"
                  autoFocus
                  required
                  defaultValue={projectID?.name}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Input
                  name="description"
                  required
                  defaultValue={projectID?.description}
                />
              </FormControl>
              <Button type="submit">Submit</Button>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>

      <Modal open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
        <ModalDialog variant="outlined" role="alertdialog">
        <DialogTitle>
            <WarningRoundedIcon />
            Confirmation
        </DialogTitle>
        <Divider />
        <DialogContent>
            Are you sure you want to delete workspace {deletedWorkspace && deletedWorkspace.name} ?
        </DialogContent>
        <DialogActions>
            <Button variant="solid" color="danger" onClick={() => {dispatch(deleteWorkspace({ token, id:deletedWorkspace.id }));setOpenDeleteModal(false)}}>
            Confirm
            </Button>
            <Button variant="plain" color="neutral" onClick={() => setOpenDeleteModal(false)}>
            Cancel
            </Button>
        </DialogActions>
        </ModalDialog>
      </Modal>

      {/* Update workspace */}
      <Modal open={openUpdateWorkspace} onClose={() => setOpenUpdateWorkspace(false)}>
        <ModalDialog>
          <DialogTitle>{t('users.updateW')} {chosenWorkspace?.name}</DialogTitle>
          <DialogContent>Fill in the information of the workspace.</DialogContent>
          <form
            onSubmit={async(event) => {
              event.preventDefault();
              const formData = new FormData(event.target);

              // Extract the values
              const updatedWorkspace = {
                name: formData.get('name'),
                description: formData.get('description'),
              };

              try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/workspaces/${chosenWorkspace?.id}`, {
                  method: 'POST', // Or 'POST' depending on your backend logic
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // if you need to pass a token
                  },
                  body: JSON.stringify(updatedWorkspace),
                });

                if (response.ok) {
                  // Handle successful update, maybe refresh the data or close the modal
                  const result = await response.json();
                  alert( result.message);
                  dispatch(fetchUsersData(token));
                  dispatch(workspacesData(token));
                  dispatch(projectsData(token));
                  setOpenUpdateWorkspace(false);
                } else {
                  // Handle errors
                  const errorData = await response.json();
                  console.error('Failed to update workspace:', errorData);
                }
              } catch (error) {
                console.error('Error occurred while updating workspace:', error);
              }
            }}
          >
            <Stack spacing={2}>
            <FormControl>
                <FormLabel>Name</FormLabel>
                <Input
                  name="name"
                  autoFocus
                  required
                  defaultValue={chosenWorkspace?.name}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Input
                  name="description"
                  required
                  defaultValue={chosenWorkspace?.description}
                />
              </FormControl>
              <Button type="submit">Submit</Button>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>

      {/* add workspace */}
      <Modal open={openAddWorkspace} onClose={() => setOpenAddWorkspace(false)}>
        <ModalDialog>
          <DialogTitle>{t('users.addW')}</DialogTitle>
          <DialogContent>Fill in the information of the workspace.</DialogContent>
          <form
            onSubmit={async(event) => {
              event.preventDefault();
              const formData = new FormData(event.target);

              // Extract the values
              const addedWorkspace = {
                name: formData.get('name'),
                description: formData.get('description'),
              };

              try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/users/${chosenUser?.id}/addWorkspace`, {
                  method: 'POST', // Or 'POST' depending on your backend logic
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // if you need to pass a token
                  },
                  body: JSON.stringify(addedWorkspace),
                });

                if (response.ok) {
                  // Handle successful update, maybe refresh the data or close the modal
                  const result = await response.json();
                  alert( result.message);
                  dispatch(fetchUsersData(token));
                  dispatch(workspacesData(token));
                  dispatch(projectsData(token));
                  setOpenAddWorkspace(false);
                } else {
                  // Handle errors
                  const errorData = await response.json();
                  console.error('Failed to add workspace:', errorData);
                }
              } catch (error) {
                console.error('Error occurred while adding workspace:', error);
              }
            }}
          >
            <Stack spacing={2}>
            <FormControl>
                <FormLabel>Name</FormLabel>
                <Input
                  name="name"
                  autoFocus
                  required
                  // defaultValue={chosenWorkspace?.name}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Input
                  name="description"
                  required
                  // defaultValue={chosenWorkspace?.description}
                />
              </FormControl>
              <Button type="submit">Submit</Button>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>


      <Modal open={openDeleteScenario} onClose={() => setOpenDeleteScenario(false)} sx={{zIndex:1000000000000}}>
        <ModalDialog variant="outlined" role="alertdialog">
        <DialogTitle>
            <WarningRoundedIcon />
            Confirmation
        </DialogTitle>
        <Divider />
        <DialogContent>
            Are you sure you want to delete this scenario ?
        </DialogContent>
        <DialogActions>
            <Button variant="solid" color="danger" onClick={() => handleDeleteScenario()}>
            Confirm
            </Button>
            <Button variant="plain" color="neutral" onClick={() => setOpenDeleteScenario(false)}>
            Cancel
            </Button>
        </DialogActions>
        </ModalDialog>
      </Modal>
    </div>
  )
}
