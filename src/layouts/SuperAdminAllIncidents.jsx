import React,{useState,useEffect} from 'react'
import { SiTestrail } from 'react-icons/si'
import Breadcrumbs from '@mui/joy/Breadcrumbs';
import Link from '@mui/joy/Link';

import { BsLayersFill } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import { IoFilter } from "react-icons/io5";
import { MdAdd } from "react-icons/md";

import { Cascader } from 'rsuite';
import Grid from '@mui/joy/Grid';
import Table from '@mui/joy/Table';

import { Pagination ,Notification} from 'rsuite';
import { Divider, Textarea } from '@mui/joy';

import Sheet from '@mui/joy/Sheet';
import Button from '@mui/joy/Button';

import '../styles/Building.css';

import Chip from '@mui/joy/Chip';
import { Avatar,Toggle, DateRangePicker,Loader,Whisper,Tooltip} from 'rsuite';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import dayjs from 'dayjs';

import { MdOutlineEventBusy } from "react-icons/md";
import Modal from '@mui/joy/Modal';
import ModalClose from '@mui/joy/ModalClose';
import Typography from '@mui/joy/Typography';
import { FaCheck } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import Input from '@mui/joy/Input';


import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';



import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import DialogActions from '@mui/joy/DialogActions';
import ModalDialog from '@mui/joy/ModalDialog';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import { useTranslation } from 'react-i18next';
import { useDispatch,useSelector } from 'react-redux';
import { incidentsData ,componentsData,buildingsData,sitesData } from '../features/SuperAdminSlice';
import { fetchUsersData } from '../features/UserSlice';
import LoaderComponent from './LoaderComponent';
import { hasPermission } from '../components/CheckPermissions';

export default function SuperAdminAllIncidents() {

    const [activePage, setActivePage] = React.useState(1);
    const [open, setOpen] = React.useState(false);
    const [addBuilding, setAddBuilding] = React.useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [isDirty, setIsDirty] = useState(false);
    const [newBuilding,setNewBuilding]=useState({Name:'',Activity:'',Code:'',Site:'',ConstructionYear:'',LevelCount:'',Correlation_Code:'',Address:'',Country:'',Zipcode:'',Region_State:'',City:'',Department:'',Floor_ares:'',Comment:''});
    const [openDelete, setOpenDelete] = React.useState(false);
    const [deletedRow,setDeletedRow]=useState({});
    const [LoaderState,setLoaderState]=useState(false);
    const [notif,setNotif]=useState(false);
    const [message,setMessage]=useState('');

    const {t } = useTranslation();
    const dispatch=useDispatch();

    const { sites, statusSites , errorSites } = useSelector((state) => state.sites);
    const { buildings, statusBuildings , errorBuildings } = useSelector((state) => state.buildings);
    const { components, statusComponents , errorComponents } = useSelector((state) => state.components);
    const { users, status, error } = useSelector((state) => state.users);  
    const { incidents, statusIncidents, errorIncidents } = useSelector((state) => state.incidents);  

    const [alLIncidents,setAllIncidents]=useState([]);
    const [itemsPerPage] = useState(10);
    const startIndex = (activePage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const [parentBuilding,setParentBuilding]=useState({});

    const token=localStorage.getItem('token');
    const userInfo = JSON.parse(localStorage.getItem('user'));


    useEffect(()=>{
        dispatch(incidentsData(token)).then(()=>{
            dispatch(buildingsData(token));
            dispatch(componentsData(token));
            dispatch(sitesData(token));
            dispatch(fetchUsersData(token));
            setAllIncidents(incidents?.allIncidents)
            setBuildingSite(sites?.find((site)=>site.id===parentBuilding.site_id));
        });
    },[incidents]);

    useEffect(()=>{
        const intervalLoader=setTimeout(() => {
            setLoaderState(false);
        }, 3000);
        return ()=>clearTimeout(intervalLoader);
    },[LoaderState]);
    
    useEffect(()=>{
        const intervalLoader=setTimeout(() => {
        setNotif(false);
        setMessage(null);
        }, 8000);
        return ()=>clearTimeout(intervalLoader);
    },[notif]);

    //!unique users:
    const formatCascaderDataUsers = (users) => {
        const uniqueUsers = [];
        
        for (let i = 0; i < users?.users?.length; i++) {
            let elem = users?.users[i]?.name;
            
            if (!uniqueUsers.some(comp => comp.name === elem)) {
                uniqueUsers.push({name: elem,id:users?.users[i]?.id});
            }
        }
    
        return uniqueUsers.map((comp) => ({
            label: `${comp.name}`,
            value: comp.id,
        }));
    };
    const cascaderDataUsers = formatCascaderDataUsers(users);

    //!unique status:
    const formatCascaderDataStatus = (incidents) => {
        const uniqueStatus = [];
        
        for (let i = 0; i < incidents?.length; i++) {
            let elem = incidents[i]?.status;
            
            if (!uniqueStatus.some(inci => inci.status === elem)) {
                uniqueStatus.push({status: elem,id:incidents[i]?.id});
            }
        }
    
        return uniqueStatus.map((comp) => ({
            label: `${comp.status}`,
            value: comp.status,
        }));
    };
    const cascaderDataStatus = formatCascaderDataStatus(incidents?.allIncidents);

    //!unique buildings:
    const formatCascaderDataBuildings = (buildings) => {
        // Extract unique building IDs from incidents
        const findBuildings = [...new Set(incidents?.allIncidents?.map((incident) => incident.building_id))];
        
        // Filter buildings based on unique IDs and map them to the desired format
        const bL = buildings
            ?.filter((building) => findBuildings.includes(building.id))
            ?.map((building) => ({
                id: building.id,
                name: building.name,
                code: building.code
            }));

        // Format buildings for cascader
        return bL?.map((building) => ({
            label: `${building.code} - ${building.name}`,
            value: building.id,
        }));
    };
    const cascaderDataBuildings = formatCascaderDataBuildings(buildings?.buildings);
    
    const formatCascaderDataComponents = (allComponents, incidents, userInfo) => {
        const uniqueComponents = [];
    
        // Iterate over all components
        for (let i = 0; i < allComponents?.length; i++) {
            const component = allComponents[i];
            const componentId = component?.id;
            const componentName = component?.name;
    
            // Check if this component is already added to the uniqueComponents array
            const isComponentUnique = uniqueComponents.some(comp => comp.name === componentName);
    
            // If the component is unique, proceed to check if it should be added based on the role and incidents
            if (!isComponentUnique) {
                // For superadmin, admin, manager roles, add the component directly
                if (userInfo.role === 'superadmin' || userInfo.role === 'admin' || userInfo.role === 'manager') {
                    uniqueComponents.push({ name: componentName, id: componentId });
                } else {
                    // For other roles, add the component only if it's associated with an incident
                    const isComponentInIncident = incidents?.allIncidents?.some(incident => incident.component_id === componentId);
                    if (isComponentInIncident) {
                        uniqueComponents.push({ name: componentName, id: componentId });
                    }
                }
            }
        }
    
        // Map the unique components to the format required by the cascader
        return uniqueComponents.map(comp => ({
            label: comp.name,
            value: comp.id,
        }));
    };
    
    const cascaderDataComponents = formatCascaderDataComponents(components?.allComponents, incidents, userInfo);
    

    const HandleShowIncidents=(row)=>{
        setSelectedRow(row);
        setIncidentsModal(true);
        setParentBuilding(buildings?.buildings?.find((building)=>building.id===row.building_id));
    }
    
    const getStatusColor=(status)=>{
        if(status==='Open'){
            return 'success';
        }else if(status==='InProgress'){
            return 'warning';
        }else{
            return 'danger'; 
        }
    }

    const getUserName=(id)=>{
        const findUserName=users?.users?.find((user)=>user.id===id)?.name;
        return findUserName;
    }

    const [buildingSite,setBuildingSite]=useState({});

    useEffect(()=>{
        setBuildingSite(sites?.find((site)=>site.id===parentBuilding.site_id));
    },[parentBuilding,sites]);

    const [isEditIncident,setIsEditIncident]=useState(false);
    const [incidentID,setIncidentID]=useState(null);
    const handleUpdateIncidentInputs=(id)=>{
        setIsEditIncident(true);
        setIncidentID(id);
    }

    //!add incident:
    const [newIncident,setNewIncident]=useState({title:null,description:null,status:null,user_id:null,component_id:null,building_id:null,created_at:null,updated_at:null});
    const handleAddIncidentInputs=(field,value)=>{
    setNewIncident((prevState) => ({
        ...prevState,
        [field]: value,
    }));
    }
    const [filterByStatus,setFilterStatus]=useState(null);
    const [filterByBuilding,setFilterBuilding]=useState(null);
    const [filterByComponent,setFilterComponent]=useState(null);
    const [filterByUser,setFilterUser]=useState(null);

    const [filteredIncidents,setFilteredIncidents]=useState([]);
    const [openModalNewIncident,setOenModalNewIncident]=useState(false);
    const [IncidentsModal,setIncidentsModal]=useState(false);


    const handleFilter=()=>{
        // console.log("filterByUser")
        // console.log(filterByUser)
        // console.log("filterByBuilding")
        // console.log(filterByBuilding)
        // console.log("filterByComponent")
        // console.log(filterByComponent)
        // const findBuildingID=buildings?.buildings?.find((building)=>building.id===filterByBuilding)?.id;
        // const findComponentID=components?.allComponents?.find((component)=>component.id===filterByComponent)?.id;
        // const findUserID=users?.users?.find((user)=>user.id===filterByUser)?.id;
        if(filterByUser){
            setFilteredIncidents(incidents?.allIncidents.filter((incident)=> incident.user_id===filterByUser));
        }else if(filterByBuilding){
            setFilteredIncidents(incidents?.allIncidents.filter((incident)=>incident.building_id===filterByBuilding ));
        }else if(filterByStatus){
            setFilteredIncidents(incidents?.allIncidents.filter((incident)=>incident.status===filterByStatus));
        }else if(filterByComponent){
            setFilteredIncidents(incidents?.allIncidents.filter((incident)=>incident.component_id===filterByComponent));
        }else if(filterByBuilding&&filterByComponent){
            setFilteredIncidents(incidents?.allIncidents.filter((incident)=>(incident.component_id===filterByComponent)&&(incident.building_id===filterByBuilding)));
        }else if(filterByBuilding&&filterByUser){
            setFilteredIncidents(incidents?.allIncidents.filter((incident)=>(incident.user_id===filterByUser)&&(incident.building_id===filterByBuilding)));
        }else if(filterByComponent&&filterByUser){
            setFilteredIncidents(incidents?.allIncidents.filter((incident)=>(incident.component_id===filterByComponent)&&(incident.building_id===filterByBuilding)));
        }else{
            setFilteredIncidents(incidents?.allIncidents);
        }
    }

    const handleClearFilter =()=>{
        setFilterStatus(null);
        setFilterBuilding(null);
        setFilterComponent(null);
        setFilterUser(null);
        setFilteredIncidents([]);
    }

    const emptyFields=()=>{
        setNewBuilding({Name:'',Activity:'',Code:'',Site:'',ConstructionYear:'',LevelCount:'',Correlation_Code:'',Address:'',Country:'',Zipcode:'',Region_State:'',City:'',Department:'',Floor_ares:'',Comment:''});
    }

    const handleRowClick = (row) => {
        setSelectedRow(row);
        setOpen(true);
        setIsDirty(false);
        setIncidentsModal(false);
    };

    
    const handleAddIncident=async()=>{
        console.log(newIncident);
        try {
          setOenModalNewIncident(false);
          // setIncidentsModal(false);
          setLoaderState(true);
      
        //   const workspace_id = buildingSite?.workspace_id;
        //   const building_id = parentComponent?.building_id;
      
          const response = await fetch(
            `http://127.0.0.1:8000/api/workspaces/incidents/addIncident`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
              },
              body:JSON.stringify(newIncident)
            },
          );
      
          const result = await response.json();
      
          if (response.ok) {
            setNotif(true);
            setMessage(result.message);
  
  
            setAllIncidents([...alLIncidents,newIncident]);
      
            dispatch(incidentsData(token)).then(()=>{
                setAllIncidents(incidents?.allIncidents)
            });
            setIncidentID(null);
          } else {
            console.error('Failed to deleting the incident:', result);
            alert(`Failed to deleting the incident: ${result.error || 'Unknown error'}`);
          }
        } catch (error) {
          console.error('Error:', error);
          alert('An error occurred while deleting the incident.');
        }
      }
  
      //!update incident:
    const handleSaveIncident = async (IncidentData) => {
        // console.log("newIncident");
        // console.log(newIncident);
        // console.log("buildingSite");
        // console.log(buildingSite);
        // console.log("IncidentData");
        // console.log(IncidentData);
    //     //             const workspace_id = buildingSite?.workspace_id;
    //     //     const building_id = selectedRow?.building_id;

    //     // alert( `http://127.0.0.1:8000/api/workspaces/${workspace_id}/buildings/${building_id}/components/${selectedRow?.id}/incidents/${incidentID}`)
    //     // const workspace_id = buildingSite?.workspace_id;
    //     // const building_id = selectedRow?.building_id;
    //     // const component_id = components?.allComponents?.find((component)=>component.building_id===building_id)?.id;
    //     // alert(`http://127.0.0.1:8000/api/workspaces/${workspace_id}/buildings/${building_id}/components/${component_id}/incidents/updatedIncident`);

            setIncidentsModal(false);
            setLoaderState(true);
            // const workspace_id = buildingSite?.workspace_id;
            // const building_id = selectedRow?.building_id;
            // const component_id = components?.allComponents?.find((component)=>component.building_id===building_id)?.id;
            // alert(`http://127.0.0.1:8000/api/workspaces/${workspace_id}/buildings/${building_id}/components/${component_id}/incidents/updatedIncident`);
            const updatedIncidentData = {
                id: IncidentData?.id,
                title: newIncident.title || IncidentData?.title,
                description: newIncident.description || IncidentData?.description,
                status: newIncident.status || IncidentData?.status,
                user_id: newIncident.user_id || IncidentData?.user_id,
                component_id: newIncident.component_id || IncidentData?.component_id,
                building_id: newIncident.building_id || IncidentData?.building_id,
                created_at: newIncident.created_at || IncidentData?.created_at,
                updated_at: newIncident.updated_at || IncidentData?.updated_at
            };
            console.log("updatedIncidentData")
            console.log(updatedIncidentData)
            const response = await fetch(
            `http://127.0.0.1:8000/api/workspaces/incidents/${IncidentData?.id}`,
            {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(updatedIncidentData),
            }
            );
        
            const result = await response.json();
            
        if (response.ok) {
            setNotif(true);
            setMessage(result.message);

            // Update the incidents array in the selected component
            setAllIncidents(
                incidents?.allIncidents?.map((incident) => 
                    incident?.id === IncidentData?.id
                    ? { ...incident, ...updatedIncidentData }
                    : incident
                )
            );


            setIncidentsModal(false);
            setIncidentID(null);
            setLoaderState(false);
            setNewIncident({
                title: null,
                description: null,
                status: null,
                user_id: null,
                component_id: null,
                building_id: null,
                created_at: null,
                updated_at: null,
            });
        } else {
        console.error('Failed to update the component:', result);
        alert(`Failed to update the component: ${result.error || 'Unknown error'}`);
        setLoaderState(false);
        }

    };
    
    //!delete incident:
    const [parentComponent,setParentComponent]=useState(null);
    const [deleteIncident,setOpenDeleteIncident]=useState(false);

    const HandleDeleteIncident=(row,id)=>{
        setOpenDeleteIncident(true);
        setIncidentID(id);
        setParentBuilding(buildings?.buildings?.find((building)=>building.id===row.building_id));
        setParentComponent(components?.allComponents?.find((component)=>component.id===row.component_id));
    }
    
    const confirmDeleteIncident=async()=>{
        // const workspace_id = buildingSite?.workspace_id;
        // const building_id = parentComponent?.building_id;
        // alert(`http://127.0.0.1:8000/api/workspaces/${workspace_id}/buildings/${building_id}/components/${selectedRow?.id}/incidents/${incidentID}`);

        try {
            setOpenDeleteIncident(false);
          // setIncidentsModal(false);
            setLoaderState(true);
    
            // const workspace_id = buildingSite?.workspace_id;
            // const building_id = parentComponent?.building_id;
    
            const response = await fetch(
                `http://127.0.0.1:8000/api/workspaces/deleteIncident`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body:JSON.stringify({id:incidentID})
                },
            ); 
        
            const result = await response.json();
        
            if (response.ok) {
                setNotif(true);
                setMessage(result.message);

                setSelectedRow({});

                setAllIncidents(alLIncidents?.filter((incident) => incident.id !== incidentID));
        
                dispatch(componentsData(token));
                setIncidentID(null);
            } else {
                console.error('Failed to deleting the incident:', result);
                alert(`Failed to deleting the incident: ${result.error || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while deleting the incident.');
        }
    }
    
    const HandleDelete=(row)=>{
        setOpenDelete(true);
        setDeletedRow(row);
    }
    return (
        <div>
            <Breadcrumbs separator=">" aria-label="breadcrumbs" size="sm">
            {[t('dashboard'),t('users.workspaces'),t('users.allIncidents')].map((item) => (
                <Link key={item} color="neutral" href="#sizes">
                <h5>
                {item}
                </h5>
            </Link>
            ))}
            </Breadcrumbs>
        <div>
            <div className='title_image'>
                <h2 id='title_H2'><SiTestrail style={{color:'rgb(3, 110, 74)'}}/><span> {t('Incidents')} </span></h2>
                <img src="/assets/Components.svg" alt="comp_img" />
            </div>
            {
            (message&&notif)&&(
                <Notification style={{width:'100%',zIndex: 100000 }} showIcon type="success" color='success' closable>
                <strong><FaCheck/></strong> {message && message}.
                </Notification>
            )
            }
            <Sheet variant="soft" color="neutral" sx={{ marginTop:'10px',p: 4,borderRadius:'5px',boxShadow:'0 0 5px rgba(176, 175, 175, 0.786)' }}>
            
            <div className='Cascader_container'>
                <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                <Grid xs={12} lg={(userInfo.role==='superadmin'||userInfo.role==='admin'||userInfo.role==='manager')?3:4} sm={12} md={12}>
                    <Cascader
                        data={cascaderDataStatus}
                        className='Cascader_comp'
                        placeholder="Status" 
                        columnWidth={200}
                        popupStyle={{width:'12%'}}
                        onChange={(value)=>setFilterStatus(value)}  
                    />
                </Grid>
                <Grid xs={12} lg={(userInfo.role==='superadmin'||userInfo.role==='admin'||userInfo.role==='manager')?3:4} sm={12} md={12}>
                    <Cascader
                        data={cascaderDataBuildings}
                        className='Cascader_comp'
                        placeholder="Building" 
                        columnWidth={200}
                        popupStyle={{width:'12%'}}
                        onChange={(value)=>setFilterBuilding(value)}  
                    />
                </Grid>
                <Grid xs={12} lg={(userInfo.role==='superadmin'||userInfo.role==='admin'||userInfo.role==='manager')?3:4} sm={12} md={12}>
                    <Cascader
                        data={cascaderDataComponents}
                        className='Cascader_comp'
                        placeholder="Component" 
                        columnWidth={200}
                        popupStyle={{width:'12%'}}
                        onChange={(value)=>setFilterComponent(value)}  
                    />

                </Grid>
                {
                    (userInfo.role==='superadmin'||userInfo.role==='admin'||userInfo.role==='manager')&&(
                        <Grid xs={12} lg={3} sm={12} md={12}>
                            <Cascader
                                data={cascaderDataUsers}
                                className='Cascader_comp'
                                placeholder="Users" 
                                columnWidth={200}
                                popupStyle={{width:'12%'}}
                                onChange={(value)=>setFilterUser(value)}  
                            />
                        </Grid>
                    )
                }
                <Grid xs={12} lg={12} sm={12} md={12}>
                    <center>
                    <Button className='apply_Button' sx={{width:'50%'}} onClick={handleFilter}><IoFilter size={22}/>&nbsp;&nbsp;{t('filter')}</Button>
                    </center>
                </Grid>
                <Grid sx={{display:filteredIncidents.length>0?'grid':'none'}} xs={12} lg={12} sm={12} md={12}>
                    <center>
                    <Button className='apply_Button' sx={{width:'50%'}} onClick={handleClearFilter}><IoFilter size={22}/>&nbsp;&nbsp;{('search.clear')}</Button>
                    </center>
                </Grid>
                </Grid>
            </div>
            {
                hasPermission(userInfo.permissions,'incidents','create')&&(
                    <div className='Add_container'>
                        <Button className='add_Button' onClick={()=> setOenModalNewIncident(true)}><MdAdd size={22}/>&nbsp;&nbsp;{t('addIncident')}</Button>
                    </div>
                )
            }
            <div className='table_container'>
                <Table hoverRow 
                sx={{
                overflowX:'scroll',
                textAlign:'center'
                }}>
                <thead>
                    <tr>
                    <th  style={{width:'50px',textAlign:'center'}}>ID</th>
                    <th style={{width:'150px',textAlign:'center'}}>Title</th>
                    <th style={{width:'660px',textAlign:'center',paddingRight:'190px'}}>Description</th>
                    <th  style={{width:'150px',textAlign:'center'}}>Status</th>
                    <th  style={{width:'150px',textAlign:'center'}}>Parent building</th>
                    <th  style={{width:'70px',textAlign:'center'}}>parent Component</th>
                    <th  style={{width:'100px',textAlign:'center'}}>Created by</th>
                    <th  style={{width:'70px',textAlign:'center'}}>Created at</th>
                    <th  style={{width:'150px',textAlign:'center'}}>Updated at</th>
                    {/* <th style={{width:'100px',textAlign:'center',position:'absolute',right:'150px',display:'flex',justifyContent:'center',alignItems:'center',marginBottom:'-10px'}}>Incidents</th> */}
                    {
                        hasPermission(userInfo.permissions,'incidents','delete')&&(
                            <th style={{width:'100px',textAlign:'center',position:'absolute',right:0,display:'flex',justifyContent:'center',alignItems:'center',marginBottom:'-10px'}}>Action</th>
                        )
                    }
                    </tr>
                </thead>
                <tbody>
                {
                    alLIncidents&&alLIncidents.length>0?(

                    filteredIncidents.length>0?(
                        filteredIncidents.slice(startIndex, endIndex).map((row) => (
                            row && (
                                <tr key={row.id} className='table_row' onClick={() => HandleShowIncidents(row)}>
                                    <td>{row.id}</td>
                                    <td>{row.title}</td>
                                    <td>{row.description}</td>
                                    <td>
                                        <Chip
                                            variant='solid'
                                            color={row.status ? (row.status === "InProgress" ? 'warning' : (row.status === "Open") ? 'success' : 'danger') : 'neutral'}
                                            sx={{ width: '100%', height: '30px' }}
                                        >
                                            {row.status}
                                        </Chip>
                                    </td>
                                    <td>{buildings && buildings?.buildings?.find((building) => building.id === row.building_id)?.name}</td>
                                    <td>{components && components?.allComponents?.find((component) => component.id === row.component_id)?.name}</td>
                                    <td>{getUserName(row.user_id)}</td>
                                    <td>{dayjs(row.created_at).format('MM/DD/YYYY')}</td>
                                    <td>{dayjs(row.updated_at).format('MM/DD/YYYY')}</td>
                                    {
                                        hasPermission(userInfo.permissions,'incidents','delete')&&(
                                            <td style={{ width: '100px', textAlign: 'center', position: 'absolute', right: 0 }}>
                                                <Button sx={{ background: 'linear-gradient(265deg, rgba(5,127,83,1) 0%, rgba(95,5,138,1) 100%)' }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        HandleDeleteIncident(row, row?.id);
                                                    }}>
                                                    <MdDelete size={22} />
                                                </Button>
                                            </td>
                                        )
                                    }
                                </tr>
                            )
                        ))
                    ):(
                        alLIncidents&&alLIncidents.slice(startIndex, endIndex).map((row) => (
                            row && (
                                <tr key={row.id} className='table_row' onClick={() => HandleShowIncidents(row)}>
                                    <td>{row.id}</td>
                                    <td>{row.title}</td>
                                    <td>{row.description}</td>
                                    <td>
                                        <Chip
                                            variant='solid'
                                            color={row.status ? (row.status === "InProgress" ? 'warning' : (row.status === "Open") ? 'success' : 'danger') : 'neutral'}
                                            sx={{ width: '100%', height: '30px' }}
                                        >
                                            {row.status}
                                        </Chip>
                                    </td>
                                    <td>{buildings && buildings?.buildings?.find((building) => building.id === row.building_id)?.name}</td>
                                    <td>{components && components?.allComponents?.find((component) => component.id === row.component_id)?.name}</td>
                                    <td>{getUserName(row.user_id)}</td>
                                    <td>{dayjs(row.created_at).format('MM/DD/YYYY')}</td>
                                    <td>{dayjs(row.updated_at).format('MM/DD/YYYY')}</td>
                                    {
                                        hasPermission(userInfo.permissions,'incidents','delete')&&(
                                            <td style={{ width: '100px', textAlign: 'center', position: 'absolute', right: 0 }}>
                                                <Button sx={{ background: 'linear-gradient(265deg, rgba(5,127,83,1) 0%, rgba(95,5,138,1) 100%)' }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        HandleDeleteIncident(row, row?.id);
                                                    }}>
                                                    <MdDelete size={22} />
                                                </Button>
                                            </td>
                                        )
                                    }
                                </tr>
                            )
                        ))
                    )
                    ):(
                    <Loader content="Loading..." />
                    )
                }
                </tbody>
                </Table>
            </div>
            <center>
                <Divider sx={{width:'80%',marginTop:'30px'}}/>
            </center>
            <div className='pagination_container'>
                <Pagination
                className='pagination_comp'
                prev
                last
                next
                first
                size="md"
                total={filteredIncidents?.length > 0 ? filteredIncidents?.length : alLIncidents?.length}
                limit={itemsPerPage}
                activePage={activePage}
                onChangePage={setActivePage}
                />
            </div>
            </Sheet>
        </div>

        {/* selected component Incidents  */}
        <Modal
            aria-labelledby="modal-title"
            aria-describedby="modal-desc"
            open={IncidentsModal}
            onClose={() =>{
            setIncidentsModal(false);
            setIsEditIncident(false);
            setNewIncident({title:null,description:null,status:null,user_id:null,component_id:null,building_id:null,created_at:null,updated_at:null});
            setSelectedRow({});
            }}
            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' ,mt: 5,paddingLeft:'60px' ,height:'100%',width:'100%'}}
        >
            <Sheet
            variant="outlined"
            sx={{
                width: '100%',
                height: '100%',
                borderRadius: 'md',
                p: 3,
                pt: 4, 
                marginTop:'80px',
                boxShadow: 'lg',
                overflowY: 'scroll',
                overflowX: 'hidden',
                background:'transparent'
                // background:'linear-gradient(124deg, rgba(7, 29, 75, 0.673) 0%, rgba(9, 100, 61, 0.673) 100%)',

            }}
            >
            <ModalClose variant="plain" sx={{ m: 1 }} />
            <div style={{
                width:'92%',
                display:'flex',
                justifyContent:'center',
                alignItems:'center',
                background:'white',
                marginLeft:'30px',
                marginBottom:'20px',
                borderRadius:'10px',
                boxShadow:'0px 0 2px rgb(1, 138, 143)'
                }}>
                <Breadcrumbs separator=">" aria-label="breadcrumbs" size="sm">
                    {[t('buildings'),buildings?.buildings?.find((b)=>b.id===selectedRow?.building_id)?.name,t('components'),selectedRow?.title].map((item) => (
                    <Link className='Link_breadcrumbs' key={item} color="neutral" href="#sizes">
                        <h5>
                        {item}
                        </h5>
                    </Link>
                    ))}
                </Breadcrumbs>
            </div>
            <div style={{
                width:'100%',
                height:'100%',
                textAlign:'center',
                // flexWrap:'wrap',
                overflowY: 'scroll',
                overflowX: 'hidden',
                paddingBottom: '100px',
                paddingLeft:'30px'
            }}>
            {selectedRow ? (
                    <Card variant="outlined" sx={{ width: '90%' ,height:'118vh',mb:3}}>
                    <Sheet variant="outlined" color="neutral" sx={{ p: 1,height:'118vh',borderRadius:'10px',boxShadow:'0px 0 2px rgb(1, 138, 143)' }}>
                    <CardContent>
                        <center>
                        <h5>{t('Incident')}</h5>
                    </center>
                    <center>
                            {
                            isEditIncident&&(incidentID===selectedRow?.id)?(
                                <>
                                <h5 style={{ mb: 2 ,
                                background:'linear-gradient(124deg, rgb(6, 51, 147) 0%, rgb(8, 106, 63) 50%, rgb(128, 25, 117)100%)',
                                width: 'fit-content',
                                color:'transparent',
                                backgroundClip: 'text',
                                webkitBackgroundClip: 'text',
                                transition: '0.3s'
                                }}>
                                Title
                                </h5>
                                <Input
                                sx={{width:'100%'}}
                                defaultValue={selectedRow?.title}
                                onChange={(e)=>handleAddIncidentInputs('title',e.target.value)}  
                                />
                                </>
                            ):(
                                <h3 style={{ mb: 2 ,
                                background:'linear-gradient(124deg, rgb(6, 51, 147) 0%, rgb(8, 106, 63) 50%, rgb(128, 25, 117)100%)',
                                width: 'fit-content',
                                color:'transparent',
                                backgroundClip: 'text',
                                webkitBackgroundClip: 'text',
                                transition: '0.3s'
                                }}>
                                {selectedRow.title}
                                </h3> 
                            )
                            }
                    </center>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                        <center>
                        <h5 
                        style={{ mb: 2 ,
                            background:'linear-gradient(124deg, rgb(6, 51, 147) 0%, rgb(8, 106, 63) 50%, rgb(128, 25, 117)100%)',
                            width: 'fit-content',
                            color:'transparent',
                            backgroundClip: 'text',
                            webkitBackgroundClip: 'text',
                            transition: '0.3s'
                            }}>Description:</h5>
                        </center>
                        
                        <br />
                        <span >
                        {
                            isEditIncident&&(incidentID===selectedRow?.id)?(
                            <Textarea
                            defaultValue={selectedRow?.description}
                            minRows={5}
                            onChange={(e)=>handleAddIncidentInputs('description',e.target.value)}
                            />
                            ):(
                            selectedRow?.description
                            )
                        }
                        </span>
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                        <center>
                        <h5 
                        style={{ mb: 2 ,
                            background:'linear-gradient(124deg, rgb(6, 51, 147) 0%, rgb(8, 106, 63) 50%, rgb(128, 25, 117)100%)',
                            width: 'fit-content',
                            color:'transparent',
                            backgroundClip: 'text',
                            webkitBackgroundClip: 'text',
                            transition: '0.3s'
                            }}>Status:</h5> 
                        </center>
                        
                        <br />
                        {
                        isEditIncident&&(incidentID===selectedRow?.id)?(
                            <Typography component='div' sx={{
                            width:'100%',
                            display:'flex',
                            justifyContent:'space-around',
                            alignItems:'center'
                            }}>
                            <Chip
                            variant='solid'
                            color={newIncident?.status?(newIncident?.status==="Open"?'success':'neutral'):(selectedRow?.status==="Open"?'success':'neutral')}
                            onClick={()=>setNewIncident({...newIncident,status:'Open'})}
                            sx={{
                                width:'300px',
                                height:'30px'
                            }}
                            >
                                {(newIncident?.status==="Open")&&<FaCheck/>}&nbsp;&nbsp;Open
                            </Chip>
                            <Chip
                            variant='solid'
                            color={newIncident?.status?(newIncident?.status==="InProgress"?'warning':'neutral'):(selectedRow?.status==="InProgress"?'warning':'neutral')}
                            onClick={()=>setNewIncident({...newIncident,status:'InProgress'})}
                            sx={{
                                width:'300px',
                                height:'30px'
                            }}
                            >
                                {(newIncident?.status==="InProgress")&&<FaCheck/>}&nbsp;&nbsp;In progress
                            </Chip>
                            <Chip
                            variant='solid'
                            color={newIncident?.status?(newIncident?.status==="Closed"?'danger':'neutral'):(selectedRow?.status==="Closed"?'danger':'neutral')}
                            onClick={()=>setNewIncident({...newIncident,status:'Closed'})}
                            sx={{
                                width:'300px',
                                height:'30px'
                            }}
                            >
                                {(newIncident?.status==="Closed")&&<FaCheck/>}&nbsp;&nbsp;Closed
                            </Chip>
                            </Typography>
                        ):(
                            <Chip
                            variant='solid'
                            color={getStatusColor(selectedRow?.status)}
                            >
                            {selectedRow?.status}
                            </Chip>
                        )
                        }
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                        <center>
                        <h5 
                        style={{ mb: 2 ,
                            background:'linear-gradient(124deg, rgb(6, 51, 147) 0%, rgb(8, 106, 63) 50%, rgb(128, 25, 117)100%)',
                            width: 'fit-content',
                            color:'transparent',
                            backgroundClip: 'text',
                            webkitBackgroundClip: 'text',
                            transition: '0.3s'
                            }}>Created by:</h5>
                        </center>
                        
                        <br />
                        {
                        isEditIncident&&(incidentID===selectedRow?.id)?(
                            <Cascader
                                data={cascaderDataUsers}
                                defaultValue={cascaderDataUsers.find((user)=>user.value===selectedRow?.user_id)?.value}
                                placeholder="Users" 
                                columnWidth={1250}
                                style={{width:'100%'}}
                                popupStyle={{width:'84%',zIndex:100000}}
                                onChange={(value)=>handleAddIncidentInputs('user_id',value)}
                            />
                        ):(
                            <p>
                            {getUserName(selectedRow?.user_id)}
                            </p>
                        )
                        }
                    </Typography>
                    {
                        isEditIncident&&(incidentID===selectedRow?.id)?(
                            <DateRangePicker
                            character=' - '
                            style={{width:'100%',zIndex:10000}}
                            menuStyle={{zIndex:10000}}
                            placement='top'
                            defaultValue={[dayjs(selectedRow?.created_at).format('yyyy-MM-dd'), dayjs(selectedRow?.updated_at).format('yyyy-MM-dd')]}
                            onChange={(value)=>setNewIncident({...newIncident,created_at:dayjs(value[0]).format('MM/DD/YYYY'),updated_at:dayjs(value[1]).format('MM/DD/YYYY')})}
                            />
                        ):(
                        <>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                            <center>
                            <h5 
                            style={{ mb: 2 ,
                                background:'linear-gradient(124deg, rgb(6, 51, 147) 0%, rgb(8, 106, 63) 50%, rgb(128, 25, 117)100%)',
                                width: 'fit-content',
                                color:'transparent',
                                backgroundClip: 'text',
                                webkitBackgroundClip: 'text',
                                transition: '0.3s'
                                }}>Date Reported:</h5>
                            </center>
                            
                            <br />
                            {
                                new Date(selectedRow?.created_at).toLocaleDateString()
                            }
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                            <center>
                            <h5 
                            style={{ mb: 2 ,
                                background:'linear-gradient(124deg, rgb(6, 51, 147) 0%, rgb(8, 106, 63) 50%, rgb(128, 25, 117)100%)',
                                width: 'fit-content',
                                color:'transparent',
                                backgroundClip: 'text',
                                webkitBackgroundClip: 'text',
                                transition: '0.3s'
                                }}>Last Updated:</h5>
                            </center>
                            
                            <br />
                            {
                                new Date(selectedRow?.updated_at).toLocaleDateString()
                            }
                        </Typography>
                        </>
                        )
                    }
                    <Typography variant="body2" sx={{ mb: 2 }}>
                        <center>
                        <h5 
                        style={{ mb: 2 ,
                            background:'linear-gradient(124deg, rgb(6, 51, 147) 0%, rgb(8, 106, 63) 50%, rgb(128, 25, 117)100%)',
                            width: 'fit-content',
                            color:'transparent',
                            backgroundClip: 'text',
                            webkitBackgroundClip: 'text',
                            transition: '0.3s'
                            }}>Parent building:</h5>
                        </center>
                        
                        <br />
                        {
                            isEditIncident&&(incidentID===selectedRow?.id)?(
                            <Cascader
                                data={cascaderDataBuildings}
                                defaultValue={cascaderDataBuildings.find((b)=>b.value===selectedRow?.building_id)?.value}
                                placeholder="Buildings" 
                                columnWidth={1250}
                                style={{width:'100%'}}
                                popupStyle={{width:'84%',zIndex:100000}}
                                onChange={(value)=>handleAddIncidentInputs('building_id',value)}
                            />
                            ):(
                            cascaderDataBuildings.find((b)=>b.value===selectedRow?.building_id)?.label
                            )
                        }
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                        <center>
                        <h5 
                        style={{ mb: 2 ,
                            background:'linear-gradient(124deg, rgb(6, 51, 147) 0%, rgb(8, 106, 63) 50%, rgb(128, 25, 117)100%)',
                            width: 'fit-content',
                            color:'transparent',
                            backgroundClip: 'text',
                            webkitBackgroundClip: 'text',
                            transition: '0.3s'
                            }}>Parent component:</h5>
                        </center>
                        
                        <br />
                        {
                            isEditIncident&&(incidentID===selectedRow?.id)?(
                            <Cascader
                                data={cascaderDataComponents}
                                defaultValue={cascaderDataComponents.find((b)=>b.value===selectedRow?.component_id)?.value}
                                placeholder="Components" 
                                columnWidth={1250}
                                style={{width:'100%'}}
                                popupStyle={{width:'84%',zIndex:100000}}
                                onChange={(value)=>handleAddIncidentInputs('component_id',value)}
                            />
                            ):(
                                cascaderDataComponents.find((b)=>b.value===selectedRow?.component_id)?.label
                            )
                        }
                    </Typography>
                    </CardContent>
                        <CardContent orientation="horizontal" sx={{width:'100%',display:'flex',justifyContent:'space-around',position:'absolute',bottom:'10px'}}>
                        {
                            hasPermission(userInfo.permissions,'incidents','update')&&(
                                isEditIncident&&(incidentID===selectedRow?.id)?(
                                <Button color='info' level="body-xs" onClick={()=>handleSaveIncident(selectedRow)}>{t('users.save')}</Button>
                                ):(
                                <Button color='info' level="body-xs" onClick={()=>handleUpdateIncidentInputs(selectedRow?.id)}>{t('users.update')}</Button>
                                )
                            )
                        }
                        <Divider orientation="vertical"/>
                        {
                            hasPermission(userInfo.permissions,'incidents','delete')&&(
                                <Button color='info' level="body-xs" onClick={()=>HandleDeleteIncident(selectedRow,selectedRow?.id)}>{t('users.delete')}</Button>
                            )
                        }
                        </CardContent>
                    </Sheet>
                    </Card>
                ) : (
                <Typography>No incident selected</Typography>
                )}
                </div>
            </Sheet>
        </Modal>
        
        {/* Modal delete incident */}
        <Modal open={deleteIncident} onClose={() => setOpenDeleteIncident(false)}>
            <ModalDialog variant="outlined" role="alertdialog">
            <DialogTitle>
                <WarningRoundedIcon />
                Confirmation
            </DialogTitle>
            <Divider />
            <DialogContent>
                Are you sure you want to delete this incident?
            </DialogContent>
            <DialogActions>
                <Button variant="solid" color="danger" onClick={confirmDeleteIncident}>
                Confirm
                </Button>
                <Button variant="plain" color="neutral" onClick={() =>{ setOpenDeleteIncident(false);setDeletedRow({})}}>
                Cancel
                </Button>
            </DialogActions>
            </ModalDialog>
        </Modal>

        {/*add Incident*/}
        <Modal
            aria-labelledby="modal-title"
            aria-describedby="modal-desc"
            open={openModalNewIncident}
            onClose={() => setOenModalNewIncident(false)}
            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' ,zIndex:1000000}}
        >
            <Card variant="outlined" sx={{ width: '95%' ,height:'100%',background:'rgba(255, 255, 255, 0.529)',marginTop:'30px',overflowY:'scroll'}}>
            <ModalClose variant="plain" sx={{ m: 1 }} />
            <CardContent>
                <center>
                <h5>{t('addIncident')} </h5>
            </center>
            <center>
                <h4 style={{ mb: 2 ,
                background:'linear-gradient(124deg, rgb(6, 51, 147) 0%, rgb(8, 106, 63) 50%, rgb(128, 25, 117)100%)',
                width: 'fit-content',
                color:'transparent',
                backgroundClip: 'text',
                webkitBackgroundClip: 'text',
                transition: '0.3s'
                }}>
                Title
                </h4>
                <Input
                sx={{width:'100%'}}
                onChange={(e)=>handleAddIncidentInputs('title',e.target.value)}  
                />
            </center>
            <Typography variant="body2" sx={{ mb: 2 }}>
                <center>
                <h4 
                style={{ mb: 2 ,
                    background:'linear-gradient(124deg, rgb(6, 51, 147) 0%, rgb(8, 106, 63) 50%, rgb(128, 25, 117)100%)',
                    width: 'fit-content',
                    color:'transparent',
                    backgroundClip: 'text',
                    webkitBackgroundClip: 'text',
                    transition: '0.3s'
                    }}>Description:</h4>
                </center>
                
                <br />
                <span >
                
                    <Textarea
                    minRows={5}
                    onChange={(e)=>handleAddIncidentInputs('description',e.target.value)}
                    />
                    
                </span>
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
                <center>
                <h4 
                style={{ mb: 2 ,
                    background:'linear-gradient(124deg, rgb(6, 51, 147) 0%, rgb(8, 106, 63) 50%, rgb(128, 25, 117)100%)',
                    width: 'fit-content',
                    color:'transparent',
                    backgroundClip: 'text',
                    webkitBackgroundClip: 'text',
                    transition: '0.3s'
                    }}>Status:</h4> 
                </center>
                
                <br />
                
                    <Typography component='div' sx={{
                    width:'100%',
                    display:'flex',
                    justifyContent:'space-around',
                    alignItems:'center'
                    }}>
                    <Chip
                    variant='solid'
                    color={newIncident?.status&&(newIncident?.status==="Open"?'success':'neutral')}
                    onClick={()=>setNewIncident({...newIncident,status:'Open'})}
                    sx={{
                        width:'300px',
                        height:'30px'
                    }}
                    >
                        {(newIncident?.status==="Open")&&<FaCheck/>}&nbsp;&nbsp;Open
                    </Chip>
                    <Chip
                    variant='solid'
                    color={newIncident?.status&&(newIncident?.status==="InProgress"?'warning':'neutral')}
                    onClick={()=>setNewIncident({...newIncident,status:'InProgress'})}
                    sx={{
                        width:'300px',
                        height:'30px'
                    }}
                    >
                        {(newIncident?.status==="InProgress")&&<FaCheck/>}&nbsp;&nbsp;In progress
                    </Chip>
                    <Chip
                    variant='solid'
                    color={newIncident?.status&&(newIncident?.status==="Closed"?'danger':'neutral')}
                    onClick={()=>setNewIncident({...newIncident,status:'Closed'})}
                    sx={{
                        width:'300px',
                        height:'30px'
                    }}
                    >
                        {(newIncident?.status==="Closed")&&<FaCheck/>}&nbsp;&nbsp;Closed
                    </Chip>
                    </Typography>
                
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
                <center>
                <h4 
                style={{ mb: 2 ,
                    background:'linear-gradient(124deg, rgb(6, 51, 147) 0%, rgb(8, 106, 63) 50%, rgb(128, 25, 117)100%)',
                    width: 'fit-content',
                    color:'transparent',
                    backgroundClip: 'text',
                    webkitBackgroundClip: 'text',
                    transition: '0.3s'
                    }}>Created by:</h4>
                </center>
                
                <br />
                    <Cascader
                        data={cascaderDataUsers}
                        placeholder="Users" 
                        columnWidth={1250}
                        style={{width:'100%'}}
                        popupStyle={{width:'84%',zIndex:100000000}}
                        onChange={(value)=>handleAddIncidentInputs('user_id',value)}
                    />
            </Typography>
                <DateRangePicker
                character=' - '
                style={{width:'100%',zIndex:1000000}}
                menuStyle={{zIndex:10000000,width:'100%',overflowY:'scroll'}}
                placement='top'
                onChange={(value)=>setNewIncident({...newIncident,created_at:dayjs(value[0]).format('MM/DD/YYYY'),updated_at:dayjs(value[1]).format('MM/DD/YYYY')})}
                />
            <Typography variant="body2" sx={{ mb: 2 }}>
                <center>
                <h4 
                style={{ mb: 2 ,
                    background:'linear-gradient(124deg, rgb(6, 51, 147) 0%, rgb(8, 106, 63) 50%, rgb(128, 25, 117)100%)',
                    width: 'fit-content',
                    color:'transparent',
                    backgroundClip: 'text',
                    webkitBackgroundClip: 'text',
                    transition: '0.3s'
                    }}>Parent building:</h4>
                </center> <br />
                <Cascader
                data={cascaderDataBuildings}
                placeholder="Buildings" 
                columnWidth={1250}
                style={{width:'100%'}}
                placement='top'
                popupStyle={{width:'84%',zIndex:10000000}}
                onChange={(value)=>handleAddIncidentInputs('building_id',value)}
                />
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
                <center>
                <h4 
                style={{ mb: 2 ,
                    background:'linear-gradient(124deg, rgb(6, 51, 147) 0%, rgb(8, 106, 63) 50%, rgb(128, 25, 117)100%)',
                    width: 'fit-content',
                    color:'transparent',
                    backgroundClip: 'text',
                    webkitBackgroundClip: 'text',
                    transition: '0.3s'
                    }}>Parent component:</h4>
                </center>
                
                <br />
                <Cascader
                data={cascaderDataComponents}
                placeholder="Components" 
                columnWidth={1250}
                placement='top'
                style={{width:'100%',marginBottom:'30px'}}
                popupStyle={{width:'84%',zIndex:10000000}}
                onChange={(value)=>handleAddIncidentInputs('component_id',value)} 
                />
            </Typography>
            </CardContent>
            <CardContent orientation="horizontal" sx={{width:'100%',display:'flex',justifyContent:'space-around',marginBottom:'20px'}}>
                <Button color='info' level="body-xs" onClick={handleAddIncident} 
                sx={{
                background:' linear-gradient(124deg, rgba(12,46,96,1) 0%, rgba(38,86,17,1) 46%, rgba(9,46,100,1) 100%)',
                width:'90%',
                borderRadius:'20px',
                color:'white',
                '&:hover':{
                    boxShadow:'0 0 6px rgb(128, 25, 117)',
                    transition:'0.3s'
                }
                }}
                >{t('users.save')}</Button>
                <Divider orientation="vertical"/>
                <Button color='info' level="body-xs" onClick={()=>setOenModalNewIncident(false)} 
                sx={{
                    background:' linear-gradient(124deg, rgba(12,46,96,1) 0%, rgba(38,86,17,1) 46%, rgba(9,46,100,1) 100%)',
                    width:'90%',
                    borderRadius:'20px',
                    color:'white',
                    '&:hover':{
                    boxShadow:'0 0 6px rgb(128, 25, 117)',
                    transition:'0.3s'
                    }
                }}
                >{t('cancel')}</Button>
            </CardContent>
            </Card>
        </Modal>

        {/*Loader component */}
        <Modal
            aria-labelledby="modal-title"
            aria-describedby="modal-desc"
            open={LoaderState}
            onClose={() => setLoaderState(false)}
            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
            <LoaderComponent/>
        </Modal>

        </div>
    )
}
