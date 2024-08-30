import React,{useEffect, useState} from 'react'
import Breadcrumbs from '@mui/joy/Breadcrumbs';
import Link from '@mui/joy/Link';
import Sheet from '@mui/joy/Sheet';
import Button from '@mui/joy/Button';
import Input from '@mui/joy/Input';

import { SiTestrail } from "react-icons/si";
import { BsLayersFill } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import { IoFilter } from "react-icons/io5";
import { MdAdd } from "react-icons/md";
import Chip from '@mui/joy/Chip';

import { Cascader,Avatar,Toggle, DateRangePicker} from 'rsuite';
import Grid from '@mui/joy/Grid';
import Table from '@mui/joy/Table';

import { Pagination ,Loader, Notification , Uploader, Whisper,Tooltip} from 'rsuite'; 
import { Divider, Textarea } from '@mui/joy';
import { MdOutlineEventBusy } from "react-icons/md";

import Modal from '@mui/joy/Modal';
import ModalClose from '@mui/joy/ModalClose';
import Typography from '@mui/joy/Typography';
import { FaCheck } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { IoMdCreate } from "react-icons/io";
import { IoIosInformationCircle } from "react-icons/io";


import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import DialogActions from '@mui/joy/DialogActions';
import ModalDialog from '@mui/joy/ModalDialog';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';

import { componentsData, buildingsData,sitesData } from '../features/SuperAdminSlice';
import { useDispatch,useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import LoaderComponent from './LoaderComponent';

import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { fetchUsersData } from '../features/UserSlice';
// import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import dayjs from 'dayjs';
import { hasPermission } from '../components/CheckPermissions';


export default function SuperAdminAllComponents() {

  const [activePage, setActivePage] = React.useState(1);
  const [itemsPerPage] = useState(10);
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const [selectedRow, setSelectedRow] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [deletedRow,setDeletedRow]=useState({});
  
  const [allComponents,setAllComponents]=useState([]);

  const [LoaderState,setLoaderState]=useState(false);
  const [openAddComponent,setOpenAddComponent]=useState(false);

  const [notif,setNotif]=useState(false);
  const [message,setMessage]=useState('');
  const [buildingSite,setBuildingSite]=useState({});
  
  const { buildings, statusBuildings , errorBuildings } = useSelector((state) => state.buildings);
  const { components, statusComponents , errorComponents } = useSelector((state) => state.components);
  const { sites, statusSites , errorSites } = useSelector((state) => state.sites);
  const { users, status, error } = useSelector((state) => state.users);
  const [IncidentsModal,setIncidentsModal]=useState(false);
  
  const [newComponent,setNewComponent]=useState({code:null,name:null, quantity:null,condition:null,building_id:null,last_rehabilitation_year:null,risk_level:null,severity_max:null,description:null,severity_safety:null,severity_operations:null,severity_work_conditions:null,severity_environment:null,characteristics:null,severity_image:null,unit:null});

  const token=localStorage.getItem('token');
  const userInfo=JSON.parse(localStorage.getItem('user'));
  const dispatch = useDispatch();
  const {t}=useTranslation();

  const [parentBuilding,setParentBuilding]=useState({});



  useEffect(()=>{
    dispatch(buildingsData(token));
    dispatch(componentsData({token}));
    dispatch(sitesData(token));
    dispatch(fetchUsersData(token));
  },[]);

  useEffect(()=>{
    if(components){
      setAllComponents(components.allComponents);
    }
  },[components,dispatch]);

  const HandleDelete=(row)=>{
    setOpenDelete(true);
    setDeletedRow(row);
    setParentBuilding(buildings?.buildings?.find((building)=>building.id===row.building_id));
  }

  const handleRowClick = (row) => {
    setSelectedRow(row);
    setOpen(true);
    setIsDirty(false);
    setParentBuilding(buildings?.buildings?.find((building)=>building.id===row.building_id));
  };

  const HandleShowIncidents=(row)=>{
    setSelectedRow(row);
    setIncidentsModal(true);
    setParentBuilding(buildings?.buildings?.find((building)=>building.id===row.building_id));
  }

  useEffect(()=>{
    setBuildingSite(sites?.find((site)=>site.id===parentBuilding.site_id));
  },[parentBuilding]);

  const handleInputChange = (field, value) => {
    setSelectedRow((prevState) => ({
      ...prevState,
      [field]: value,
    }));
    setIsDirty(true);
  };

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

  const confirmDelete = async () => { 
    // alert(`http://127.0.0.1:8000/api/workspaces/${workspace_id}/buildings/${deletedRow?.building_id}/components/${deletedRow?.id}`)
    try {
          setLoaderState(true);
          setOpenDelete(false);
          // api/workspaces/{workspace}/buildings/{building}/components/{component} 
      const workspace_id  = buildingSite.workspace_id; 
        const response = await fetch(`http://127.0.0.1:8000/api/workspaces/${workspace_id}/buildings/${deletedRow?.building_id}/components/deleteComponent`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body:JSON.stringify({id:deletedRow?.id})
        });

        const result = await response.json();

        if (response.ok) {
            setNotif(true);
            setMessage(result.message);
            setAllComponents(allComponents.filter((b)=>b.id!==deletedRow.id));
            dispatch(buildingsData(token));
            dispatch(componentsData({token}));
            setSelectedRow({})
        } else {
            console.error('Failed to delete the component:', result);
            alert('Failed to delete the component.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while deleting the component.');
    }
};


const handleUpdateComponent = async () => {

  try {
    setLoaderState(true); 

    const workspace_id  = buildingSite?.workspace_id; 
    const building_id =  selectedRow?.building_id; 
    const response = await fetch(`http://127.0.0.1:8000/api/workspaces/${workspace_id}/buildings/${building_id}/components/${selectedRow?.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(selectedRow), 
    });

    const result = await response.json();

    if (response.ok) {
      setNotif(true);
      setMessage(result.message);
      setAllComponents(allComponents.map((component) => {
        if (component.id === selectedRow.id) {
          return { ...component, ...selectedRow };
        }
        return component;
      }));
      dispatch(componentsData({token}));
      setOpen(false);
      setLoaderState(false); 
      setSelectedRow({})
    } else {
      console.error('Failed to update the component:', result);
      alert(`Failed to update the component: ${result.error || 'Unknown error'}`);
    }
  }catch (error) {
    console.error('Error:', error); 
    alert('An error occurred while updating the component.');
  }
};

const emptyFields=()=>{
    setNewComponent({code:null,name:null, quantity:null,condition:null,building_id:null,last_rehabilitation_year:null,risk_level:null,severity_max:null,description:null,severity_safety:null,severity_operations:null,severity_work_conditions:null,severity_environment:null,characteristics:null,severity_image:null,unit:null});
    setOpenAddComponent(false);
  }

  const [imageURL, setImageURL] = useState('');

  const handleFileUpload = (fileList) => {
    if (fileList && fileList.length > 0) {
      const file = fileList[0].blobFile;
      const fileName = file.name;
      // console.log("file: ");
      // console.log(file);
      // console.log("fileName: ");
      // console.log(fileName);
      setNewComponent({...newComponent,severity_image:file});

      const imageURL = URL.createObjectURL(file);
      setImageURL(imageURL);
      // console.log("imageURL: ");
      // console.log(imageURL);
    }
  };

const handleAddComponent = async () => {
  console.log(newComponent);

  try {
    setLoaderState(true); 

    const workspace_id  = buildingSite?.workspace_id; 
    const building_id =  selectedRow?.building_id; 
    const formData = new FormData();

    // Append each property from newComponent to the formData
    Object.keys(newComponent).forEach(key => {
      formData.append(key, newComponent[key]);
    });

    // Send the formData in the request body
    const response = await fetch(`http://127.0.0.1:8000/api/workspaces/${workspace_id}/buildings/${building_id}/components/addComponent`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`, // Authorization token if needed
      },
      body: formData, // Sending FormData instead of JSON
    }); 

    const result = await response.json();

    if (response.ok) {
      setNotif(true);
      setMessage(result.message);
      setAllComponents([...allComponents,newComponent]);
      dispatch(buildingsData(token));
      setOpenAddComponent(false);
      setLoaderState(false); 
      setNewComponent({code:null,name:null, quantity:null,condition:null,building_id:null,last_rehabilitation_year:null,risk_level:null,severity_max:null,description:null,severity_safety:null,severity_operations:null,severity_work_conditions:null,severity_environment:null,characteristics:null,severity_image:null,unit:null});
    } else {
      console.error('Failed to add the component:', result);
      alert(`Failed to add the component: ${result.error || 'Unknown error'}`);
    }
  }catch (error) {
    console.error('Error:', error); 
    alert('An error occurred while adding the component.');
  }
};

  

  const formatCascaderDataBuildings = (buildings) => {
    const bL = [...new Set(buildings?.map((building) =>({id:building.id,name: building.name,code:building.code})))];
    
    return bL.map((building) => ({
      label: `${building.code} - ${building.name}`,
      value: building.id,
    }));
  };
  const cascaderDataBuildings = formatCascaderDataBuildings(buildings?.buildings);

  const formatCascaderDataComponentsType = (allComponents) => {
    const uniqueTypes = [];

    for (let i = 0; i < allComponents?.length; i++) {
      let elem = allComponents[i]?.name;
      
      if (!uniqueTypes.some(comp => comp.name === elem)) {
        uniqueTypes.push({type: elem});
      }
    }

    return uniqueTypes.map((comp) => ({
      label: `${comp.type}`,
      value: comp.type,
    }));
  };
  const cascaderDataComponentsType = formatCascaderDataComponentsType(allComponents);

  const formatCascaderDataComponentsCharacteristics = (allComponents) => {
    const uniqueCharacteristics = [];

    for (let i = 0; i < allComponents?.length; i++) {
      let elem = allComponents[i]?.characteristics;
      
      if (!uniqueCharacteristics.some(comp => comp.characteristics === elem)) {
        uniqueCharacteristics.push({characteristics: elem});
      }
    }

    return uniqueCharacteristics.map((comp) => ({
      label: `${comp.characteristics}`,
      value: comp.characteristics,
    }));
  };
  const cascaderDataComponentsCharacteristics = formatCascaderDataComponentsCharacteristics(allComponents);

  const formatCascaderDataComponentsCondition = (allComponents) => {
    const uniqueConditions = [];

    for (let i = 0; i < allComponents?.length; i++) {
      let elem = allComponents[i]?.condition;
      
      if (!uniqueConditions.some(condition => condition.condition === elem)) {
        uniqueConditions.push({ condition: elem });
      }
    }

    return uniqueConditions.map((comp) => ({
      label: `${comp.condition}`,
      value: comp.condition,
    }));
  };
  const cascaderDataComponentsCondition = formatCascaderDataComponentsCondition(allComponents);

  const formatCascaderDataComponentsRisk = (allComponents) => {
    const uniqueRisks = [];

    for (let i = 0; i < allComponents?.length; i++) {
      let elem = allComponents[i]?.risk_level;
      
      if (!uniqueRisks.some(comp => comp.risk === elem)) {
        uniqueRisks.push({ risk: elem });
      }
    }
    
    return uniqueRisks.map((comp) => ({
      label: `${comp.risk}`,
      value: comp.risk,
    }));
  };
  const cascaderDataComponentsRisk = formatCascaderDataComponentsRisk(allComponents);


  const formatCascaderDataComponentsUnit = (allComponents) => {
    const uniqueUnits = [];

    for (let i = 0; i < allComponents?.length; i++) {
      let elem = allComponents[i]?.unit;
      
      if (!uniqueUnits.some(comp => comp.unit === elem)) {
        uniqueUnits.push({ unit: elem });
      }
    }
    
    return uniqueUnits.map((comp) => ({
      label: `${comp.unit}`,
      value: comp.unit,
    }));
  };
  const cascaderDataComponentsUnit = formatCascaderDataComponentsUnit(allComponents);


  const [filteredComponents,setFilteredComponents]=useState([]);

  const [filterByCode,setFilterCode]=useState(null);
  const [filterByType,setFilterType]=useState(null);
  const [filterByRisk,setFilterRisk]=useState(null);
  const [filterCondition,setFilterCondition]=useState(null);
  
  const handleFilter=()=>{
    const findBuildingID=buildings?.buildings?.find((building)=>building.id===filterByCode)?.id;
    setFilteredComponents(components?.allComponents?.filter((comp)=> comp.name===filterByType || comp.condition===filterCondition || comp.risk_level===filterByRisk || comp.building_id===findBuildingID));
    }
  const handleClearFilter =()=>{
      setFilterType(null);
      setFilterCode(null);
      setFilterCondition(null);
      setFilteredComponents([]);
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
    const [openModalNewIncident,setOenModalNewIncident]=useState(false);

    const handleAddIncident=async()=>{
      // console.log(newIncident);
      try {
        setOenModalNewIncident(false);
        // setIncidentsModal(false);
        setLoaderState(true);
    
        const workspace_id = buildingSite?.workspace_id;
        const building_id = parentComponent?.building_id;
    
        const response = await fetch(
          `http://127.0.0.1:8000/api/workspaces/${workspace_id}/buildings/${building_id}/components/${selectedRow?.id}/incidents/addIncident`,
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

          setSelectedRow({...selectedRow,incidents: [...selectedRow?.incidents,newIncident]});

          setAllComponents((allComponents) =>
            allComponents.map((component) => {
              if (component.id === selectedRow.id) {
                return {
                  ...component,
                  incidents: [...component?.incidents,newIncident]
                };
              }
              return component;
            })
          );
    
          dispatch(componentsData({token}));
          setIncidentID(null);
        } else {
          console.error('Failed to add the incident:', result);
          alert(`Failed to add the incident: ${result.error || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while deleting the incident.');
      }
    }

    //!update incident:
    const handleSaveIncident = async () => {
      // console.log(newIncident);
      try {
        setLoaderState(true);
    
        const workspace_id = buildingSite?.workspace_id;
        const building_id = selectedRow?.building_id;
    
        const response = await fetch(
          `http://127.0.0.1:8000/api/workspaces/${workspace_id}/buildings/${building_id}/components/${selectedRow?.id}/incidents/updateIncident`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({newIncident:newIncident,id:incidentID}),
          }
        );
    
        const result = await response.json();
    
        if (response.ok) {
          setNotif(true);
          setMessage(result.message);
    
          // Update the incidents array in the selected component
          setAllComponents((allComponents) =>
            allComponents.map((component) => {
              if (component.id === selectedRow.id) {
                return {
                  ...component,
                  incidents: component.incidents.map((incident) =>
                    incident.id === incidentID
                      ? { ...incident, ...newIncident } 
                      : incident
                  ),
                };
              }
              return component;
            })
          );
    
          dispatch(componentsData({token}));
    
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
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while updating the component.');
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
      setParentComponent(allComponents?.find((component)=>component.id===row.component_id));
    }
    
    const confirmDeleteIncident=async()=>{
      // const workspace_id = buildingSite?.workspace_id;
      // const building_id = parentComponent?.building_id;
      // alert(`http://127.0.0.1:8000/api/workspaces/${workspace_id}/buildings/${building_id}/components/${selectedRow?.id}/incidents/${incidentID}`);

      try {
        setOpenDeleteIncident(false);
        // setIncidentsModal(false);
        setLoaderState(true);
    
        const workspace_id = buildingSite?.workspace_id;
        const building_id = parentComponent?.building_id;
    
        const response = await fetch(
          `http://127.0.0.1:8000/api/workspaces/${workspace_id}/buildings/${building_id}/components/${selectedRow?.id}/incidents/deleteIncident`,
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

          setSelectedRow({...selectedRow,incidents: selectedRow?.incidents?.filter((incident) => incident.id !== incidentID)});

          setAllComponents((allComponents) =>
            allComponents.map((component) => {
              if (component.id === selectedRow.id) {
                return {
                  ...component,
                  incidents: component.incidents.filter(
                    (incident) => incident.id !== incidentID
                  ),
                };
              }
              return component;
            })
          );
    
          dispatch(componentsData({token}));
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

    const formatCascaderDataComponents = (allComponents) => {
      const uniqueTypes = [];
  
      for (let i = 0; i < allComponents?.length; i++) {
        let elem = allComponents[i]?.name;
        
        if (!uniqueTypes.some(comp => comp.name === elem)) {
          uniqueTypes.push({type: elem,id:allComponents[i]?.id});
        }
      }
  
      return uniqueTypes.map((comp) => ({
        label: `${comp.type}`,
        value: comp.id,
      }));
    };
    const cascaderDataComponents = formatCascaderDataComponents(allComponents);

  return (
    <div>
      <Breadcrumbs separator=">" aria-label="breadcrumbs" size="sm">
          {[t('dashboard'),t('users.workspaces'),t('buildings'),t('components')].map((item) => (
          <Link  key={item} color="neutral" href="#sizes">
            <h5>
              {item}
            </h5>
          </Link>
          ))}
      </Breadcrumbs>
      <div>
        <div className='title_image'>
          <h2 id='title_H2'><SiTestrail style={{color:'rgb(3, 110, 74)'}}/><span> {t('components')} </span></h2>
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
          
          {/* <div className='action_bottons'>
            <h6><BsLayersFill size={22}/>&nbsp;&nbsp;<span>Current</span></h6>
            <h6><MdDelete size={22}/>&nbsp;&nbsp;<span>Recently deleted</span></h6>
          </div> */}
          
          <div className='Cascader_container'>
            <Grid container spacing={2} sx={{ flexGrow: 1 }}>
              <Grid xs={12} lg={3} sm={12} md={12}>
                  <Cascader
                      data={cascaderDataComponentsRisk}
                      className='Cascader_comp'
                      placeholder="Risk level" 
                      columnWidth={200}
                      popupStyle={{width:'12%'}}
                      onChange={(value)=>setFilterRisk(value)}  
                  />
              </Grid>
              <Grid xs={12} lg={3} sm={12} md={12}>
                  <Cascader
                      data={cascaderDataBuildings}
                      className='Cascader_comp'
                      placeholder="Building" 
                      columnWidth={200}
                      popupStyle={{width:'12%'}}
                      onChange={(value)=>setFilterCode(value)}  
                  />
              </Grid>
              <Grid xs={12} lg={3} sm={12} md={12}>
                <Cascader
                      data={cascaderDataComponentsType}
                      className='Cascader_comp'
                      placeholder="Component Type" 
                      columnWidth={200}
                      popupStyle={{width:'12%'}}
                      onChange={(value)=>setFilterType(value)}  
                  />

              </Grid>
              <Grid xs={12} lg={3} sm={12} md={12}>
                  <Cascader
                      data={cascaderDataComponentsCondition}
                      className='Cascader_comp'
                      placeholder="Ageing Condition" 
                      columnWidth={200}
                      popupStyle={{width:'12%'}}
                      onChange={(value)=>setFilterCondition(value)}  
                  />
              </Grid>
              <Grid xs={12} lg={12} sm={12} md={12}>
                <center>
                  <Button className='apply_Button' sx={{width:'50%'}} onClick={handleFilter}><IoFilter size={22}/>&nbsp;&nbsp;{t('filter')}</Button>
                </center>
              </Grid>
              <Grid sx={{display:filteredComponents.length>0?'grid':'none'}} xs={12} lg={12} sm={12} md={12}>
                <center>
                  <Button className='apply_Button' sx={{width:'50%'}} onClick={handleClearFilter}><IoFilter size={22}/>&nbsp;&nbsp;{('search.clear')}</Button>
                </center>
              </Grid>
            </Grid>
          </div>
          {
            hasPermission(userInfo.permissions,'components','create')&&(
              <div className='Add_container'>
                <Button className='add_Button' onClick={()=> setOpenAddComponent(true)}><MdAdd size={22}/>&nbsp;&nbsp;{t('addComponent')}</Button>
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
                  <th  style={{width:'50px',textAlign:'center'}}>{t('componentsPage.code')}</th>
                  <th style={{width:'150px',textAlign:'center'}}>{t('componentsPage.name')}</th>
                  <th  style={{width:'150px',textAlign:'center'}}>{t('componentsPage.quantity')}</th>
                  <th  style={{width:'150px',textAlign:'center'}}>{t('componentsPage.unit')}</th>
                  <th  style={{width:'150px',textAlign:'center'}}>{t('componentsPage.last_rehabilitation_year')}</th>
                  <th  style={{width:'70px',textAlign:'center'}}>{t('componentsPage.condition')}</th>
                  <th  style={{width:'100px',textAlign:'center'}}>{t('componentsPage.severity_max')}</th>
                  <th  style={{width:'70px',textAlign:'center'}}>{t('componentsPage.risk_level')}</th>
                  <th  style={{width:'150px',textAlign:'center'}}>{t('building')}</th>
                  <th style={{width:'660px',textAlign:'center',paddingRight:'190px'}}>{t('componentsPage.description')}</th>
                  {
                    hasPermission(userInfo.permissions,'incidents','read')&&(
                      <th style={{width:'100px',textAlign:'center',position:'absolute',right:'150px',display:'flex',justifyContent:'center',alignItems:'center',marginBottom:'-10px'}}>{t('Incidents')}</th>
                    )
                  }
                  {
                    hasPermission(userInfo.permissions,'components','delete')&&(
                      <th style={{width:'100px',textAlign:'center',position:'absolute',right:0,display:'flex',justifyContent:'center',alignItems:'center',marginBottom:'-10px'}}>{t('buildingsPage.action')}</th>
                    )
                  }
                </tr>
              </thead>
              <tbody>
              {
                allComponents.length>0?(

                  filteredComponents.length>0?(
                    filteredComponents.slice(startIndex, endIndex).map((row) => (
                      <tr key={row.code} className='table_row' onClick={()=>handleRowClick(row)}>
                        <td>{row.code}</td>
                        <td>{row.name}</td>
                        <td>{row.quantity}</td>
                        <td>{row.unit}</td>
                        <td>{row.last_rehabilitation_year}</td>
                        <td>
                          <Avatar circle style={{ background: row.condition==='C1'?'green':(row.condition==='C2')?'rgb(250, 218, 9)':(row.condition==='C3')?'orange':'red' }}>{row.condition}</Avatar>
                        </td>
                        <td>
                          <Avatar circle style={{ background: row.severity_max==='S1'?'green':(row.severity_max==='S2')?'rgb(250, 218, 9)':(row.severity_max==='S3')?'orange':'red' }}>{row.severity_max}</Avatar>
                        </td>
                        <td>
                          <Avatar circle style={{ background: row.risk_level==='R1'?'green':(row.risk_level==='R2')?'rgb(250, 218, 9)':(row.risk_level==='R3')?'orange':'red' }}>{row.risk_level}</Avatar>
                        </td>
                        <td>{buildings?.buildings?.find((building)=>building.id===row?.building_id)?.name}</td>
                        <td>{row.description}</td> 
                        {
                          hasPermission(userInfo.permissions,'incidents','read')&&(
                            <td style={{width:'100px',textAlign:'center',position:'absolute',right:'150px'}}>
                              <Button
                              sx={{
                                background:'linear-gradient(265deg, rgba(5,127,83,1) 0%, rgba(95,5,138,1) 100%)'
                              }}
                              onClick={(e)=>{
                                e.stopPropagation(); 
                                HandleShowIncidents(row)
                              }}
                              ><MdOutlineEventBusy/></Button>
                            </td>
                          )
                        }
                        {
                          hasPermission(userInfo.permissions,'components','delete')&&(
                            <td style={{width:'100px',textAlign:'center',position:'absolute',right:0}}>
                              <Button sx={{
                                background:'linear-gradient(265deg, rgba(5,127,83,1) 0%, rgba(95,5,138,1) 100%)'
                              }}
                              onClick={(e)=>{
                                e.stopPropagation();
                                HandleDelete(row)
                              }}
                              >
                                <MdDelete size={22}/>
                              </Button>
                            </td>
                          )
                        }
                      </tr>
                    ))
                  ):(
                    allComponents.slice(startIndex, endIndex).map((row) => (
                      <tr key={row.code} className='table_row' onClick={()=>handleRowClick(row)}>
                        <td>{row.code}</td>
                        <td>{row.name}</td>
                        <td>{row.quantity}</td>
                        <td>{row.unit}</td>
                        <td>{row.last_rehabilitation_year}</td>
                        <td>
                          <Avatar circle style={{ background: row.condition==='C1'?'green':(row.condition==='C2')?'rgb(250, 218, 9)':(row.condition==='C3')?'orange':'red' }}>{row.condition}</Avatar>
                        </td>
                        <td>
                          <Avatar circle style={{ background: row.severity_max==='S1'?'green':(row.severity_max==='S2')?'rgb(250, 218, 9)':(row.severity_max==='S3')?'orange':'red' }}>{row.severity_max}</Avatar>
                        </td>
                        <td>
                          <Avatar circle style={{ background: row.risk_level==='R1'?'green':(row.risk_level==='R2')?'rgb(250, 218, 9)':(row.risk_level==='R3')?'orange':'red' }}>{row.risk_level}</Avatar>
                        </td>
                        <td>{buildings?.buildings?.find((building)=>building.id===row?.building_id)?.name}</td>
                        <td>{row.description}</td>
                        {
                          hasPermission(userInfo.permissions,'incidents','read')&&(
                            <td style={{width:'100px',textAlign:'center',position:'absolute',right:'150px'}}>
                              <Button
                              sx={{
                                background:'linear-gradient(265deg, rgba(5,127,83,1) 0%, rgba(95,5,138,1) 100%)'
                              }}
                              onClick={(e)=>{
                                e.stopPropagation(); 
                                HandleShowIncidents(row)
                              }}
                              ><MdOutlineEventBusy/></Button>
                            </td>
                          )
                        }
                        {
                          hasPermission(userInfo.role,'components','delete')&&(
                            <td style={{width:'100px',textAlign:'center',position:'absolute',right:0}}>
                              <Button sx={{
                                background:'linear-gradient(265deg, rgba(5,127,83,1) 0%, rgba(95,5,138,1) 100%)'
                              }}
                              onClick={(e)=>{
                                e.stopPropagation();
                                HandleDelete(row)
                              }}
                              >
                                <MdDelete size={22}/>
                              </Button>
                            </td>
                          )
                        }
                      </tr>
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
              total={filteredComponents.length > 0 ? filteredComponents.length : allComponents.length}
              limit={itemsPerPage}
              activePage={activePage}
              onChangePage={setActivePage}
            />
          </div>
        </Sheet>
      </div>
      
      {/* Modal component information's */}
      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={open}
        onClose={() => setOpen(false)}
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <Sheet
          variant="outlined"
          sx={{
            width:'70%',
            maxHeight:'85vh',
            borderRadius: 'md',
            p: 3,
            boxShadow: 'lg',
            overflowY:'scroll'
          }}
        >
          <ModalClose variant="plain" sx={{ m: 1 }} />
          <Typography
            component="h2"
            id="modal-title"
            level="h2"
            textColor="inherit"
            fontWeight="lg"
            mb={1}
          > 
            <SiTestrail style={{color:'rgb(3, 110, 74)'}}/>
            <span>
              {
                (t('component')==="المكون")?(
                  selectedRow !== null && selectedRow.name ? (`${t('component')}${selectedRow.name}`) : (t('component'))
                ):(
                  t('component')
                )
              }
            </span>
          </Typography>
          <div>
            <Divider>
              <h3 id='title_H3'>
                <IoIosInformationCircle/>
                <span>
                    {t('componentsPage.information')}
                </span>
              </h3>
            </Divider>
            <div className='info-container'>
              <Divider>
                <h4>{t('componentsPage.knowledge')}</h4>
              </Divider>
              <Grid container spacing={2} sx={{ flexGrow: 1 }}>
              <Grid item xs={12} md={8} lg={6} sm={12}>
                  <strong>{t('SCT')}</strong><br /><br />
                  <Cascader
                      disabled={!hasPermission(userInfo.permissions,'components','update')}

                      data={cascaderDataComponentsType.map((type)=>({label:`Immobilier - Générique ${type.value}`,value:type.value}))}
                      defaultValue={cascaderDataComponentsType.find((type)=>type.value===selectedRow?.name)?.label || ''}
                      columnWidth={600}
                      
                      style={{width:'100%'}}
                      popupStyle={{width:'30%',zIndex:10000}}
                      onChange={(value) => handleInputChange('name', value)}  
                  />

                </Grid>
                <Grid item xs={12} md={8} lg={6} sm={12}>
                  <strong>{t('componentsPage.Characteristics')}</strong><br /><br />
                  <Cascader
                      disabled={!hasPermission(userInfo.permissions,'components','update')}

                      data={cascaderDataComponentsCharacteristics}
                      defaultValue={selectedRow?.characteristics || ''}
                      columnWidth={600}
                      style={{width:'100%'}}
                      popupStyle={{width:'30%',zIndex:10000}}
                      onChange={(value) => handleInputChange('characteristics',value)}
                  />
                </Grid>
              </Grid>
              <Divider>
                <h4>{t('componentsPage.CI')}</h4>
              </Divider>
              <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                <Grid item xs={12} md={4} lg={6} sm={12}>
                  <strong>{t('componentsPage.code')}</strong><br />
                  <Input
                      disabled={!hasPermission(userInfo.permissions,'components','update')}
                    readOnly
                    defaultValue={selectedRow?.code || ''}
                    
                  />
                </Grid>
                <Grid item xs={12} md={8} lg={6} sm={12}>
                  <strong>{t('PB')}</strong><br />
                  <Cascader
                      disabled={!hasPermission(userInfo.permissions,'components','update')}
                      data={buildings?.buildings?.map((building) => ({ label: building.name, value: building.id }))}
                      defaultValue={parentBuilding?.id} 
                      placeholder="Parent Site"
                      popupStyle={{ width: '25%', zIndex: 10000 }}
                      columnWidth={350}
                      style={{ width: '100%' }}
                      onChange={(value) => handleInputChange('building_id', value)}
                  />
                  {/* <Input
                    defaultValue={buildings?.buildings?.find((building)=>building.id===selectedRow?.building_id)?.name || ''}
                    variant="outlined"
                  /> */}
                </Grid>
              </Grid>
              <Divider>
                <h4>{t('ComponentsPage.information')}</h4>
              </Divider>
              <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                <Grid item xs={12} md={8} lg={6} sm={12}>
                  <strong>{t('componentsPage.quantity')}</strong><br /><br />
                  <Input
                      disabled={!hasPermission(userInfo.permissions,'components','update')}

                    defaultValue={selectedRow?.quantity || ''}
                    onChange={(e) => handleInputChange('quantity', e.target.value)}
                    variant="outlined"
                    type='number'
                  />
                </Grid>
                <Grid item xs={12} md={4} lg={6} sm={12}>
                  <strong>{t('componentsPage.unit')}</strong><br /><br />
                  <Cascader
                      disabled={!hasPermission(userInfo.permissions,'components','update')}

                      data={cascaderDataComponentsUnit}
                      defaultValue={cascaderDataComponentsUnit.find((comp)=>comp.value===selectedRow?.unit)?.label || ''}
                      columnWidth={600}
                      style={{width:'100%'}}
                      popupStyle={{width:'30%',zIndex:10000}}
                      onChange={(value) => handleInputChange('unit', value)}
                  />
                </Grid>
                <Grid item xs={12} md={4} lg={6} sm={12}>
                  <strong>{t('componentsPage.last_rehabilitation_year')}</strong><br /><br />
                  <Input
                      disabled={!hasPermission(userInfo.permissions,'components','update')}

                    type='number'
                    defaultValue={selectedRow?.last_rehabilitation_year || ''}
                    onChange={(e) => handleInputChange('last_rehabilitation_year', e.target.value)}
                    variant="outlined"
                  />
                </Grid>
              </Grid>
              <Divider>
                <h4>{t('componentsPage.AS')}</h4>
              </Divider>
              <h4>{t('componentsPage.CC')}</h4>
              <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                <Grid item xs={12} md={8} lg={6} sm={12}>
                  <strong>{t('componentsPage.condition')}</strong><br /><br />
                  <div style={{display:'flex',width:'100%'}}>
                    <Avatar  style={{ background: selectedRow?.condition==='C1'?'green':(selectedRow?.condition==='C2')?'rgb(250, 218, 9)':(selectedRow?.condition==='C3')?'orange':'red' }}>{selectedRow?.condition}</Avatar>
                    <Input
                      disabled={!hasPermission(userInfo.permissions,'components','update')}

                      defaultValue={selectedRow?.condition || ''}
                      placeholder="Condition"
                      variant="outlined"
                      sx={{width:'100%'}}
                      onChange={(e) => handleInputChange('condition', e.target.value)}
                      color={selectedRow?.condition==='C1'?'success':(selectedRow?.condition==='C2')?'warning':'danger'}
                    />
                  </div>
                </Grid>
                <Grid item xs={12} md={8} lg={6} sm={12}>
                  <strong>Is condition assumed ?</strong><br /><br />
                  <Toggle checked={(selectedRow?.condition)?true:false} color="cyan">
                  </Toggle>
                </Grid>
                <Grid item xs={12} md={12} lg={12} sm={12}>
                  <strong>{t('componentsPage.description')}</strong><br /><br />
                  <Input
                      disabled={!hasPermission(userInfo.permissions,'components','update')}

                    defaultValue={selectedRow?.description || ''}
                    variant="outlined"
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder='Description'
                  />
                </Grid>
              </Grid>
              <h4>{t('componentsPage.risk_level')}</h4>
              <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                <Grid item xs={12} md={12} lg={12} sm={12}>
                    <strong>{t('componentsPage.risk_level')}</strong><br /><br />
                    <div style={{display:'flex'}}>
                      <Avatar  style={{ background: selectedRow?.risk_level==='R1'?'green':(selectedRow?.risk_level==='R2')?'rgb(250, 218, 9)':(selectedRow?.risk_level==='R3')?'orange':'red' }}>{selectedRow?.risk_level}</Avatar>
                      <Input
                      disabled={!hasPermission(userInfo.permissions,'components','update')}

                        sx={{width:'100%'}}
                        defaultValue={selectedRow?.risk_level || ''}
                        variant="outlined"
                        color={selectedRow?.risk_level==='R1'?'success':(selectedRow?.risk_level==='R2')?'warning':'danger'}
                        onChange={(e) => handleInputChange('risk_level', e.target.value)}

                      />
                    </div>
                  </Grid>
              </Grid>
              <h4>{t('componentsPage.CSS')}</h4>
              <Grid container spacing={2} sx={{ flexGrow: 1 }}>
              <Grid item xs={12} md={6} lg={6} sm={12}>
                  <strong>{t('componentsPage.severity_max')} </strong><br /><br />
                  <div style={{display:'flex'}}>
                    <Avatar  style={{ background: selectedRow?.severity_max==='S1'?'green':(selectedRow?.severity_max==='S2')?'rgb(250, 218, 9)':(selectedRow?.severity_max==='S3')?'orange':'red' }}>{selectedRow?.severity_max}</Avatar>
                    <Input
                      disabled={!hasPermission(userInfo.permissions,'components','update')}

                      sx={{width:'100%'}}
                      defaultValue={selectedRow?.severity_max || ''}
                      variant="outlined"
                      color={selectedRow?.severity_max==='S1'?'success':(selectedRow?.severity_max==='S2')?'warning':'danger'}
                      onChange={(e) => handleInputChange('severity_max', e.target.value)}

                    />
                  </div>
                </Grid>
                <Grid item xs={12} md={6} lg={6} sm={12}>
                  <strong>{t('componentsPage.safety')} </strong><br /><br />
                  <div style={{display:'flex'}}>
                    <Avatar  style={{ background: selectedRow?.severity_safety==='S1'?'green':(selectedRow?.severity_safety==='S2')?'rgb(250, 218, 9)':(selectedRow?.severity_safety==='S3')?'orange':'red' }}>{selectedRow?.severity_safety}</Avatar>
                    <Input
                    
                      disabled={!hasPermission(userInfo.permissions,'components','update')}
                      sx={{width:'100%'}}
                      defaultValue={selectedRow?.severity_safety || ''}
                      variant="outlined"
                      color={selectedRow?.severity_safety==='S1'?'success':(selectedRow?.severity_safety==='S2')?'warning':'danger'}
                      onChange={(e) => handleInputChange('severity_safety', e.target.value)}

                    />
                  </div>
                </Grid>
                <Grid item xs={12} md={6} lg={6} sm={12}>
                  <strong>{t('componentsPage.operations')} </strong><br /><br />
                    <div style={{display:'flex'}}>
                      <Avatar  style={{ background: selectedRow?.severity_operations==='S1'?'green':(selectedRow?.severity_operations==='S2')?'rgb(250, 218, 9)':(selectedRow?.severity_operations==='S3')?'orange':'red' }}>{selectedRow?.severity_operations}</Avatar>
                      <Input
                      disabled={!hasPermission(userInfo.permissions,'components','update')}

                        sx={{width:'100%'}}
                        defaultValue={selectedRow?.severity_operations || ''}
                        variant="outlined"
                        color={selectedRow?.severity_operations==='S1'?'success':(selectedRow?.severity_operations==='S2')?'warning':'danger'}
                        onChange={(e) => handleInputChange('severity_operations', e.target.value)}
                      />
                    </div>
                </Grid>
                <Grid item xs={12} md={6} lg={6} sm={12}>
                  <strong>{t('componentsPage.WC')}</strong><br /><br />
                    <div style={{display:'flex'}}>
                      <Avatar  style={{ background: selectedRow?.severity_work_conditions==='S1'?'green':(selectedRow?.severity_work_conditions==='S2')?'rgb(250, 218, 9)':(selectedRow?.severity_work_conditions==='S3')?'orange':'red' }}>{selectedRow?.severity_work_conditions}</Avatar>
                      <Input
                      disabled={!hasPermission(userInfo.permissions,'components','update')}

                        sx={{width:'100%'}}
                        defaultValue={selectedRow?.severity_work_conditions || ''}
                        variant="outlined"
                        color={selectedRow?.severity_work_conditions==='S1'?'success':(selectedRow?.severity_work_conditions==='S2')?'warning':'danger'}
                        onChange={(e) => handleInputChange('severity_work_conditions', e.target.value)}
                      />
                    </div>
                </Grid>
                <Grid item xs={12} md={6} lg={6} sm={12}>
                  <strong>{t('componentsPage.environment')}</strong><br /><br />
                    <div style={{display:'flex'}}>
                      <Avatar  style={{ background: selectedRow?.severity_environment==='S1'?'green':(selectedRow?.severity_environment==='S2')?'rgb(250, 218, 9)':(selectedRow?.severity_environment==='S3')?'orange':'red' }}>{selectedRow?.severity_environment}</Avatar>
                      <Input
                      disabled={!hasPermission(userInfo.permissions,'components','update')}

                        sx={{width:'100%'}}
                        defaultValue={selectedRow?.severity_environment || ''}
                        variant="outlined"
                        color={selectedRow?.severity_environment==='S1'?'success':(selectedRow?.severity_environment==='S2')?'warning':'danger'}
                        onChange={(e) => handleInputChange('severity_environment', e.target.value)}
                      />
                    </div>
                </Grid>
                <Grid item xs={12} md={12} lg={12} sm={12}>
                  <strong>{t('componentsPage.C_image')} </strong><br /><br />
                  <img src={`http://127.0.0.1:8000/${selectedRow?.severity_image}`} alt={selectedRow?.severity_image} style={{width:'100%'}}/>
                </Grid>
              </Grid>
            </div>
            {
              isDirty&&(
                <div className='action_buttons_validate_cancel'>
                  <Button className='cancelBtn' startDecorator={<MdCancel />} onClick={()=>setOpen(false)}>{t("cancel")}</Button>
                  <Button className='checkBtn' startDecorator={<FaCheck />} onClick={handleUpdateComponent}>{t('users.update')} {t('component')}</Button>
                </div>
              )
            }
          </div>
        </Sheet>
      </Modal>

      {/* Modal delete component */}
      <Modal open={openDelete} onClose={() => setOpenDelete(false)}>
        <ModalDialog variant="outlined" role="alertdialog">
          <DialogTitle>
            <WarningRoundedIcon />
            {t("componentsPage.confirmation")} 
          </DialogTitle>
          <Divider />
          <DialogContent>
            {t("componentsPage.questionD")} {t('component')}
          </DialogContent>
          <DialogActions>
            <Button variant="solid" color="danger" onClick={confirmDelete}>
            {t("componentsPage.Confirm")}
            </Button>
            <Button variant="plain" color="neutral" onClick={() =>{ setOpenDelete(false);setDeletedRow({})}}>
            {t("cancel")}
            </Button>
          </DialogActions>
        </ModalDialog>
      </Modal>

      {/* Modal add component */}
      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={openAddComponent}
        onClose={() => setOpenAddComponent(false)}
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <Sheet
          variant="outlined"
          sx={{
            width:'70%',
            maxHeight:'85vh',
            borderRadius: 'md',
            p: 3,
            boxShadow: 'lg',
            overflowY:'scroll',
            scrollBehavior: 'smooth'
          }}
        >
          <ModalClose variant="plain" sx={{ m: 1 }} />
          <Typography
            component="h2"
            id="modal-title"
            level="h2"
            textColor="inherit"
            fontWeight="lg"
            mb={1}
          > 
            <IoMdCreate style={{color:'rgb(3, 110, 74)'}}/>
            <span>
              {('componentsPage.CreateC')}
            </span>
          </Typography>
          <div>
            <Divider>
              <h3 id='title_H3'>
                <IoIosInformationCircle/>
                <span>
                {('componentsPage.information')}
                </span>
              </h3>
            </Divider>
            <div className='info-container'>
              <Divider>
                <h4>{('componentsPage.knowledge')}</h4>
              </Divider>
              <Grid container spacing={2} sx={{ flexGrow: 1 }}>
              <Grid item xs={12} md={8} lg={6} sm={12}>
                  <strong>{('componentsPage.SCT')}</strong><br /><br />
                  <Cascader
                      data={cascaderDataComponentsType.map((type)=>({label:`Immobilier - Générique ${type.value}`,value:type.value}))}
                      // defaultValue={cascaderDataComponentsType.find((type)=>type.value===selectedRow?.name)?.label || ''}
                      columnWidth={600}
                      placeholder='Type'
                      style={{width:'100%'}}
                      popupStyle={{width:'30%',zIndex:10000}}
                      onChange={(value) =>setNewComponent({...newComponent,name:value})}  
                  />

                </Grid>
                <Grid item xs={12} md={8} lg={6} sm={12}>
                  <strong>{t('componentsPage.Characteristics')}</strong><br /><br />
                  <Cascader
                      data={cascaderDataComponentsCharacteristics}
                      columnWidth={600}
                      style={{width:'100%'}}
                      popupStyle={{width:'30%',zIndex:10000}}
                      onChange={(value) =>setNewComponent({...newComponent,characteristics:value})} 
                      placeholder='characteristics' 
                  />
                </Grid>
              </Grid>
              <Divider>
                <h4>{('componentsPage.CI')}</h4>
              </Divider>
              <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                <Grid item xs={12} md={4} lg={6} sm={12}>
                  <strong>Code</strong><br />
                  <Input
                    onChange={(e) =>setNewComponent({...newComponent,code:e.target.value})}  
                    placeholder='code'
                  />
                </Grid>
                <Grid item xs={12} md={8} lg={6} sm={12}>
                  <strong>{('componentsPage.PB')}</strong><br />
                  <Cascader
                      data={buildings?.buildings?.map((building) => ({ label: building.name, value: building.id }))}
                      placeholder="Parent Site"
                      popupStyle={{ width: '25%', zIndex: 10000 }}
                      columnWidth={350}
                      style={{ width: '100%' }}
                      onChange={(value) =>setNewComponent({...newComponent,building_id:value})}  
                  />
                </Grid>
              </Grid>
              <Divider>
                <h4>{('componentsPage.information')}</h4>
              </Divider>
              <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                <Grid item xs={12} md={8} lg={6} sm={12}>
                  <strong>{('componentsPage.quantity')}</strong><br /><br />
                  <Input
                    placeholder="Quantity"
                    onChange={(e) =>setNewComponent({...newComponent,quantity:e.target.value})}  
                    variant="outlined"
                    type='number'
                  />
                </Grid>
                <Grid item xs={12} md={4} lg={6} sm={12}>
                  <strong>{('componentsPage.unit')}</strong><br /><br />
                  <Cascader
                      data={cascaderDataComponentsUnit}
                      columnWidth={600}
                      style={{width:'100%'}}
                      popupStyle={{width:'30%',zIndex:10000}}
                      placeholder="Unit"
                      onChange={(value) =>setNewComponent({...newComponent,unit:value})} 
                  />
                </Grid>
                <Grid item xs={12} md={4} lg={6} sm={12}>
                  <strong>{('componentsPage.last_rehabilitation_year')}</strong><br /><br />
                  <Input
                    type='number'
                    placeholder="Last rehabilitation year"
                    onChange={(e) =>setNewComponent({...newComponent,last_rehabilitation_year:e.target.value})} 
                    variant="outlined"
                  />
                </Grid>
              </Grid>
              <Divider>
                <h4>{('componentsPage.AS')}</h4>
              </Divider>
              <h4>{('componentsPage.CC')}</h4>
              <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                <Grid item xs={12} md={8} lg={6} sm={12}>
                  <strong>{('componentsPage.condition')} <span style={{color:'green'}}>C1</span> - <span style={{color:'rgb(250, 218, 9)'}}>C2</span> - <span style={{color:'orange'}}>C3</span> - <span style={{color:'red'}}>C4</span></strong><br /><br />
                  <div style={{display:'flex',width:'100%'}}>
                    <Avatar   style={{ background: newComponent?.condition==='C1'?'green':(newComponent?.condition==='C2')?'rgb(250, 218, 9)':(newComponent?.condition==='C3')?'orange':'red' }}>{(newComponent?.condition)?newComponent?.condition:'?'}</Avatar>
                    <Input
                      onChange={(e) =>setNewComponent({...newComponent,condition:e.target.value})} 
                      placeholder="Condition"
                      variant="outlined"
                      sx={{width:'100%'}}
                      color={newComponent?.condition==='C1'?'success':(newComponent?.condition==='C2')?'warning':'danger'}
                    />
                  </div>
                </Grid>
                <Grid item xs={12} md={8} lg={6} sm={12}>
                  <strong>Is condition assumed ?</strong><br /><br />
                  <Toggle checked={(newComponent?.condition)?true:false} color="cyan">
                  </Toggle>
                </Grid>
                <Grid item xs={12} md={12} lg={12} sm={12}>
                  <strong>{('componentsPage.description')}</strong><br /><br />
                  <Textarea
                    minRows={8}
                    variant="outlined"
                    onChange={(e) =>setNewComponent({...newComponent,description:e.target.value})} 
                    placeholder='Description'
                  />
                </Grid>
              </Grid>
              <h4>{('componentsPage.risk_level')}</h4>
              <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                <Grid item xs={12} md={12} lg={12} sm={12}>
                    <strong>{('componentsPage.risk_level')} <span style={{color:'green'}}>R1</span> - <span style={{color:'rgb(250, 218, 9)'}}>R2</span> - <span style={{color:'orange'}}>R3</span> - <span style={{color:'red'}}>R4</span></strong><br /><br />
                    <div style={{display:'flex'}}>
                      <Avatar  style={{ background: newComponent?.risk_level==='R1'?'green':(newComponent?.risk_level==='R2')?'rgb(250, 218, 9)':(newComponent?.risk_level==='R3')?'orange':'red' }}>{(newComponent?.risk_level)?newComponent?.risk_level:'?'}</Avatar>
                      <Input
                        sx={{width:'100%'}}
                        variant="outlined"
                        color={newComponent?.risk_level==='R1'?'success':(newComponent?.risk_level==='R2')?'warning':'danger'}
                        onChange={(e) =>setNewComponent({...newComponent,risk_level:e.target.value})} 
                        placeholder='Risk level'
                      />
                    </div>
                  </Grid>
              </Grid>
              <h4>{('componentsPage.CSS')}</h4>
              <Grid container spacing={2} sx={{ flexGrow: 1 }}>
              <Grid item xs={12} md={6} lg={6} sm={12}>
                  <strong>{('componentsPage.severity_max')}<span style={{color:'green'}}>S1</span> - <span style={{color:'rgb(250, 218, 9)'}}>S2</span> - <span style={{color:'orange'}}>S3</span> - <span style={{color:'red'}}>S4</span></strong><br /><br />
                  <div style={{display:'flex'}}>
                    <Avatar  style={{ background: newComponent?.severity_max==='S1'?'green':(newComponent?.severity_max==='S2')?'rgb(250, 218, 9)':(newComponent?.severity_max==='S3')?'orange':'red' }}>{(newComponent?.severity_max)?newComponent?.severity_max:'?'}</Avatar>
                    <Input
                      sx={{width:'100%'}}
                      variant="outlined"
                      color={newComponent?.severity_max==='S1'?'success':(newComponent?.severity_max==='S2')?'warning':'danger'}
                      onChange={(e) =>setNewComponent({...newComponent,severity_max:e.target.value})} 
                      placeholder='Severity max '
                    />
                  </div>
                </Grid>
                <Grid item xs={12} md={6} lg={6} sm={12}>
                  <strong>{('componentsPage.safety')} <span style={{color:'green'}}>S1</span> - <span style={{color:'rgb(250, 218, 9)'}}>S2</span> - <span style={{color:'orange'}}>S3</span> - <span style={{color:'red'}}>S4</span></strong><br /><br />
                  <div style={{display:'flex'}}>
                    <Avatar  style={{ background: newComponent?.severity_safety==='S1'?'green':(newComponent?.severity_safety==='S2')?'rgb(250, 218, 9)':(newComponent?.severity_safety==='S3')?'orange':'red' }}>{(newComponent?.severity_safety)?newComponent?.severity_safety:'?'}</Avatar>
                    <Input
                      sx={{width:'100%'}}
                      variant="outlined"
                      color={newComponent?.severity_safety==='S1'?'success':(newComponent?.severity_safety==='S2')?'warning':'danger'}
                      onChange={(e) =>setNewComponent({...newComponent,severity_safety:e.target.value})} 
                      placeholder='Safety'
                    />
                  </div>
                </Grid>
                <Grid item xs={12} md={6} lg={6} sm={12}>
                  <strong>{('componentsPage.operations')} <span style={{color:'green'}}>S1</span> - <span style={{color:'rgb(250, 218, 9)'}}>S2</span> - <span style={{color:'orange'}}>S3</span> - <span style={{color:'red'}}>S4</span></strong><br /><br />
                    <div style={{display:'flex'}}>
                      <Avatar  style={{ background: newComponent?.severity_operations==='S1'?'green':(newComponent?.severity_operations==='S2')?'rgb(250, 218, 9)':(newComponent?.severity_operations==='S3')?'orange':'red' }}>{(newComponent?.severity_operations)?newComponent?.severity_operations:'?'}</Avatar>
                      <Input
                        sx={{width:'100%'}}
                        variant="outlined"
                        color={newComponent?.severity_operations==='S1'?'success':(newComponent?.severity_operations==='S2')?'warning':'danger'}
                        onChange={(e) =>setNewComponent({...newComponent,severity_operations:e.target.value})} 
                        placeholder='Operations'
                      />
                    </div>
                </Grid>
                <Grid item xs={12} md={6} lg={6} sm={12}>
                  <strong>{('componentsPage.WC')}<span style={{color:'green'}}>S1</span> - <span style={{color:'rgb(250, 218, 9)'}}>S2</span> - <span style={{color:'orange'}}>S3</span> - <span style={{color:'red'}}>S4</span></strong><br /><br />
                    <div style={{display:'flex'}}>
                      <Avatar  style={{ background: newComponent?.severity_work_conditions==='S1'?'green':(newComponent?.severity_work_conditions==='S2')?'rgb(250, 218, 9)':(newComponent?.severity_work_conditions==='S3')?'orange':'red' }}>{(newComponent?.severity_work_conditions)?newComponent?.severity_work_conditions:'?'}</Avatar>
                      <Input
                        sx={{width:'100%'}}
                        variant="outlined"
                        color={newComponent?.severity_work_conditions==='S1'?'success':(newComponent?.severity_work_conditions==='S2')?'warning':'danger'}
                        onChange={(e) =>setNewComponent({...newComponent,severity_work_conditions:e.target.value})} 
                        placeholder='Operations'

                      />
                    </div>
                </Grid>
                <Grid item xs={12} md={6} lg={6} sm={12}>
                  <strong>{('componentsPage.environment')} <span style={{color:'green'}}>S1</span> - <span style={{color:'rgb(250, 218, 9)'}}>S2</span> - <span style={{color:'orange'}}>S3</span> - <span style={{color:'red'}}>S4</span></strong><br /><br />
                    <div style={{display:'flex'}}>
                      <Avatar  style={{ background: newComponent?.severity_environment==='S1'?'green':(newComponent?.severity_environment==='S2')?'rgb(250, 218, 9)':(newComponent?.severity_environment==='S3')?'orange':'red' }}>{(newComponent?.severity_environment)?newComponent?.severity_environment:'?'}</Avatar>
                      <Input
                        sx={{width:'100%'}}
                        variant="outlined"
                        color={newComponent?.severity_environment==='S1'?'success':(newComponent?.severity_environment==='S2')?'warning':'danger'}
                        placeholder='Environment'
                        onChange={(e) =>setNewComponent({...newComponent,severity_environment:e.target.value})} 
                      />
                    </div>
                </Grid>
                <Grid item xs={12} md={12} lg={12} sm={12}>
                  <strong>{('componentsPage.U_ic')} </strong><br /><br />
                  <Uploader draggable onChange={handleFileUpload}>
                    <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span>Click or Drag files to this area to upload</span>
                    </div>
                  </Uploader>
                  {imageURL && (
                    <div style={{ marginTop: 20 }}>
                      <h3>Uploaded Image Preview:</h3>
                      <img src={imageURL} alt="Uploaded Preview" style={{ maxWidth: '100%' }} />
                    </div>
                  )}
                </Grid>
              </Grid>
            </div>
              <div className='action_buttons_validate_cancel'>
                <Button className='cancelBtn' startDecorator={<MdCancel />} onClick={emptyFields}>{t("cancel")}</Button>
                <Button className='checkBtn' startDecorator={<FaCheck />} onClick={handleAddComponent}>{t('addComponent')}</Button>
              </div>
          </div>
        </Sheet>
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
                  {[t('buildings'),buildings?.buildings?.find((b)=>b.id===selectedRow?.building_id)?.name,t('components'),selectedRow?.name].map((item) => (
                  <Link className='Link_breadcrumbs' key={item} color="neutral" href="#sizes">
                    <h5>
                      {item}
                    </h5>
                  </Link>
                  ))}
              </Breadcrumbs>
          </div>
          <div style={{position:'fixed',bottom:'20px',right:'10px',zIndex:10000}}  >
            <Whisper  followCursor placement='left' speaker={<Tooltip style={{zIndex:10000}}>{t('addIncident')}</Tooltip>}>
              <Fab color="primary" aria-label="add" onClick={()=>setOenModalNewIncident(true)}  >
                <AddIcon />
              </Fab>
            </Whisper>
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
              selectedRow?.incidents?.map((incident,index)=>(
                <Card variant="outlined" sx={{ width: '90%' ,height:'118vh',mb:3}}>
                  <Sheet variant="outlined" color="neutral" sx={{ p: 1,height:'118vh',borderRadius:'10px',boxShadow:'0px 0 2px rgb(1, 138, 143)' }}>
                  <CardContent>
                    <center>
                    <h5>{t('Incident')} {index+1}</h5>
                  </center>
                  <center>
                        {
                          isEditIncident&&(incidentID===incident?.id)?(
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
                            defaultValue={incident?.title}
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
                            {incident.title}
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
                        isEditIncident&&(incidentID===incident?.id)?(
                          <Textarea
                          defaultValue={incident?.description}
                          minRows={5}
                          onChange={(e)=>handleAddIncidentInputs('description',e.target.value)}
                          />
                        ):(
                          incident?.description
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
                      isEditIncident&&(incidentID===incident?.id)?(
                        <Typography component='div' sx={{
                          width:'100%',
                          display:'flex',
                          justifyContent:'space-around',
                          alignItems:'center'
                        }}>
                          <Chip
                          variant='solid'
                          color={newIncident?.status?(newIncident?.status==="Open"?'success':'neutral'):(incident?.status==="Open"?'success':'neutral')}
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
                          color={newIncident?.status?(newIncident?.status==="InProgress"?'warning':'neutral'):(incident?.status==="InProgress"?'warning':'neutral')}
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
                          color={newIncident?.status?(newIncident?.status==="Closed"?'danger':'neutral'):(incident?.status==="Closed"?'danger':'neutral')}
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
                        color={getStatusColor(incident?.status)}
                        >
                          {incident?.status}
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
                      isEditIncident&&(incidentID===incident?.id)?(
                        <Cascader
                            data={cascaderDataUsers}
                            defaultValue={cascaderDataUsers.find((user)=>user.value===incident?.user_id)?.value}
                            placeholder="Users" 
                            columnWidth={1250}
                            style={{width:'100%'}}
                            popupStyle={{width:'84%',zIndex:100000}}
                            onChange={(value)=>handleAddIncidentInputs('user_id',value)}
                        />
                      ):(
                        <p>
                          {getUserName(incident?.user_id)}
                        </p>
                      )
                    }
                  </Typography>
                  {
                    isEditIncident&&(incidentID===incident?.id)?(
                        <DateRangePicker
                          character=' - '
                          style={{width:'100%',zIndex:10000}}
                          menuStyle={{zIndex:10000}}
                          defaultValue={[dayjs(incident?.created_at), dayjs(incident?.updated_at)]}
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
                            new Date(incident?.created_at).toLocaleDateString()
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
                            new Date(incident?.updated_at).toLocaleDateString()
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
                        isEditIncident&&(incidentID===incident?.id)?(
                          <Cascader
                            data={cascaderDataBuildings}
                            defaultValue={cascaderDataBuildings.find((b)=>b.value===incident?.building_id)?.value}
                            placeholder="Buildings" 
                            columnWidth={1250}
                            style={{width:'100%'}}
                            popupStyle={{width:'84%',zIndex:100000}}
                            onChange={(value)=>handleAddIncidentInputs('building_id',value)}
                          />
                        ):(
                          cascaderDataBuildings.find((b)=>b.value===incident?.building_id)?.label
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
                        isEditIncident&&(incidentID===incident?.id)?(
                          <Cascader
                            data={cascaderDataComponents}
                            defaultValue={cascaderDataComponents.find((b)=>b.value===incident?.component_id)?.value}
                            value={newIncident.component_id!==null?newIncident.component_id:allComponents.find((b)=>b.id===incident?.component_id)?.id}
                            placeholder="Components"  
                            columnWidth={1250}
                            style={{width:'100%'}}
                            popupStyle={{width:'84%',zIndex:100000}}
                            onChange={(value)=>handleAddIncidentInputs('component_id',value)}
                          />
                        ):(
                          cascaderDataComponents.find((b)=>b.value===incident?.component_id)?.label
                        )
                      }
                  </Typography>
                  </CardContent>
                    <CardContent orientation="horizontal" sx={{width:'100%',display:'flex',justifyContent:'space-around',position:'absolute',bottom:'10px'}}>
                      {
                        isEditIncident&&(incidentID===incident?.id)?(
                          <Button color='info' level="body-xs" onClick={handleSaveIncident}>{t('users.save')}</Button>
                        ):(
                          <Button color='info' level="body-xs" onClick={()=>handleUpdateIncidentInputs(incident?.id)}>{t('users.update')}</Button>
                        )
                      }
                      <Divider orientation="vertical"/>
                      <Button color='info' level="body-xs" onClick={()=>HandleDeleteIncident(incident,incident?.id)}>{t('users.delete')}</Button>
                    </CardContent>
                  </Sheet>
                </Card>
              ))
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
          {t("componentsPage.questionD")} {('Incident')}?
          </DialogContent>
          <DialogActions>
            <Button variant="solid" color="danger" onClick={confirmDeleteIncident}>
              {t('componentsPage.Confirm')}
            </Button>
            <Button variant="plain" color="neutral" onClick={() =>{ setOpenDeleteIncident(false);setDeletedRow({})}}>
              {t('Cancel')}
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
      </div> 
  )
}
