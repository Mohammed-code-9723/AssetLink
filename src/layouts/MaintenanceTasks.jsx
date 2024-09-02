import React, { useState, useEffect } from 'react';
import { SelectPicker, Panel, Form, Button ,Divider , DatePicker, Message } from 'rsuite';
import dayjs from 'dayjs';

import { buildingsData,componentsData,sitesData,workspacesData} from '../features/SuperAdminSlice';
import { useDispatch,useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Textarea } from '@mui/joy';
import TextArea from 'antd/es/input/TextArea';
import Input from 'antd/es/input';
import { message } from 'antd';
import { SiTestrail } from 'react-icons/si';
// import {  } from 'antd';



export default function  MaintenanceTasks () {
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [filteredComponents, setFilteredComponents] = useState([]);


  //!
  const [allBuildings,setAllBuildings]=useState([]);
  const { users, status, error } = useSelector((state) => state.users);
  const { components, statusComponents , errorComponents } = useSelector((state) => state.components);
  const { sites, statusSites , errorSites } = useSelector((state) => state.sites);
  const { workspaces, statusWorkspaces , errorWorkspaces } = useSelector((state) => state.workspaces);
  const token=localStorage.getItem('token');
  const userInfo=JSON.parse(localStorage.getItem('user'));
  const dispatch = useDispatch();
  const {t } = useTranslation();
  const [chosenWorkspaceSites,setChosenWorkspaceSites]=useState(null);
  const [chosenSite,setChosenSite]=useState(null);
  //!
  

  const handleBuildingChange = (value) => {
    setSelectedBuilding(value);
  };

  //! what i add:

  const [allUsers,setAllUsers]=useState([]);
useEffect(() => {
      if (users) {
          if(userInfo.role==="superadmin"){
              setAllUsers(users?.users?.filter((user)=>user.role!=="superadmin"));
              // alert(JSON.stringify(allUsers))
          }else if(userInfo.role==="admin"){
              setAllUsers(users?.users?.filter((user)=>user.role!=="superadmin"&&user.role!=="admin"));
          }else if(userInfo.role==="manager"){
              setAllUsers(users?.users?.filter((user)=>user.role!=="manager"&&user.role!=="superadmin"&&user.role!=="admin"));
          }else if(userInfo.role==="ingenieur"){
              setAllUsers(users?.users?.filter((user)=>user.role!=="manager"&&user.role!=="superadmin"&&user.role!=="admin"&&user.role!=="ingenieur"));
          }else{
              setAllUsers([]);
          }
      }
  }, [users]);
    

  const [allComponents,setAllComponents]=useState([]);
  useEffect(()=>{
    if(components){
        setAllComponents(components?.allComponents);
    }
},[components])


const handleWorkspaceChange = (value) => {
      setChosenWorkspaceSites(value);
      dispatch(sitesData({ token, value }));
    };
 const handleSiteChange = (value) => {
    if (Array.isArray(sites)) {
        setAllBuildings(sites?.find((site)=>site.id===value)?.buildings);
        setChosenSite(value);
    }

    // console.log("sites?.find((site)=>site.id===value)?.buildings: ", sites?.find((site)=>site.id===value)?.buildings);
};
useEffect(()=>{
    
        dispatch(workspacesData(token));
    },[]); 
  const formatCascaderDataSite = (value) => {
    if(Array.isArray(value)){
      const sitess = [...new Set(value?.map((site) =>({id: site.id,name: site.name,code:site.code})))];
      
      return sitess.map((site) => ({
        label: `${site.code} - ${site.name}`,
        value: site.id,
      }));
    }
  };

  const cascaderDataSites =formatCascaderDataSite(sites) ;
const formatCascaderDataBuildings = (allBuildings) => {
    const bL = [...new Set(allBuildings?.map((building) =>({name: building.name,code:building.code})))];
    
    return bL.map((building) => ({
      label: `${building.code} - ${building.name}`,
      value: building.code,
    }));
  };
  const cascaderDataBuildings = formatCascaderDataBuildings(allBuildings);

const formatCascaderDataWorkspaces = (workspaces) => {
      const workspacesDataa = [...new Set(workspaces?.map((workspace) =>({name: workspace.name,id:workspace.id})))];
      
      return workspacesDataa.map((workspace) => ({
      label: `${workspace.id} - ${workspace.name}`,
      value: workspace.id,
      }));
  };
  const cascaderDataWorkspaces = formatCascaderDataWorkspaces(workspaces);

  const formatCascaderDataUsers = (allUsers) => {
    const usersData = [...new Set(allUsers?.map((user) =>({name: user.name,id:user.id})))];
    
    return usersData.map((user) => ({
    label: `${user.id} - ${user.name}`,
    value: user.id,
    }));
};
const cascaderDataUsers = formatCascaderDataUsers(allUsers);

  
  //!fetching all maintenances tasks:
  const [allMaintenances,setMaintenances]=useState([]);
  useEffect(()=>{
    const fetchMaintenances=async()=>{
      try {
        const url=(userInfo.role==='superadmin'||userInfo.role==='admin'||userInfo.role==='manager'||userInfo.role==='ingenieur')?
        'http://127.0.0.1:8000/api/auth/getAllMaintenancesTasks'
        :
        'http://127.0.0.1:8000/api/auth/getAllMaintenancesTasksT';
        const response = await fetch(url, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
          },
        });
  
        if (!response.ok) {
            throw new Error('Failed to fetch maintenances');
        }
  
        const data = await response.json();
        setMaintenances(data.allMaintenancesBack);
        // alert("successfully.")
      } catch (error) {
        alert(error);
      }
    }
    fetchMaintenances();
    dispatch(componentsData({token}));

  },[])

const [newMaintenance,setNewMaintenance]=useState({
  task_name:null,
  description:null,
  priority:null,
  status:null,
  scheduled_date:null,
  completion_date:null,
  assigned_to:null,
  building_id:null,
  component_id:null,
});

useEffect(() => {
  if (newMaintenance.building_id) {
    const componentsForBuilding = allComponents?.filter(component => component.building_id === newMaintenance.building_id);
    setFilteredComponents(componentsForBuilding.map((component)=>({label:component.name,value:component.id})));
    alert(JSON.stringify(componentsForBuilding));
  }
}, [newMaintenance.building_id]);

const handleChange = (name, value) => {
  setNewMaintenance({
      ...newMaintenance,
      [name]: value
  });
};

  
  const [message,setMessage]=useState('');
  //!add maintenanceTask
  const addMaintenanceTask=async()=>{
    
  }

  useEffect(()=>{
    if(message!==""){
      const intervalLoader=setTimeout(() => {
        setMessage('');
      }, 8000);
      return ()=>clearTimeout(intervalLoader);
    }
    
  },[message]);


  const handleSubmit=async()=>{
    alert(JSON.stringify(newMaintenance));
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/auth/maintenances/addMaintenanceTask`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body:JSON.stringify(newMaintenance) 
      });

      if (!response.ok) {
          throw new Error('Failed to add maintenance');
      }

      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      alert(error);
    }
  }


  return (
    <div>
        {
          message!==""&&(
            <Message color='success'>
              {message}
            </Message>
          )
        }
        <div className='title_image'>
              <h2 id='title_H2'><SiTestrail style={{color:'rgb(3, 110, 74)'}}/><span> {t('maintenancesPage.maintenance')} </span></h2>
              <img src="/assets/maintenances_tasks.svg" alt="mai_img" />
            </div>   
        <Panel bordered header={<Divider>Create Maintenance Task</Divider>}>
        <center>
          <form   style={{width:'80%'}}>
            <div>
                <Divider>Select workspace</Divider>
                <SelectPicker data={cascaderDataWorkspaces} 
                    // className='Cascader_comp'
                    placeholder={t('users.workspaces')}
                    popupStyle={{width:'25%'}}
                    // columnWidth={600}
                    style={{ width: '100%' ,border:'1px solid royalblue',borderRadius:'5px'}}
                    onChange={(value)=>handleWorkspaceChange(value)}  
                />
            </div>
            <div>
              <Divider>Select site</Divider>
                <SelectPicker data={cascaderDataSites} 
                    // className='Cascader_comp'
                    placeholder={t('sites')}
                    popupStyle={{width:'25%'}}
                    columnWidth={600}
                    style={{ width: '100%' ,border:'1px solid royalblue',borderRadius:'5px'}}
                    onChange={(value)=>handleSiteChange(value)}  
                />
            </div>
            <div>
              <Divider>Select Building</Divider>
              <SelectPicker
                data={cascaderDataBuildings}
                // className='Cascader_comp'
                placeholder="Building" 
                columnWidth={200}
                popupStyle={{width:'12%',zIndex:1000000}}
                style={{ width: '100%' ,border:'1px solid royalblue',borderRadius:'5px'}}
                onChange={(value)=>handleChange('building_id',value)}
                // onChange={(value)=>setFilterCode(value)}  
            />
            </div>
            
            {newMaintenance.building_id && (
              <div>
                <Divider>Select Component</Divider>
                <SelectPicker
                  data={filteredComponents}
                  labelKey="name"
                  valueKey="id"
                  placeholder="Select a component"
                  style={{ width: '100%' ,border:'1px solid royalblue',borderRadius:'5px'}}
                  onChange={(value)=>handleChange('component_id',value)}
                />
              </div>
            )}

            
            
            <div>
              <Divider>Task Name</Divider>
              <Input style={{ width: '100%' ,border:'1px solid royalblue'}} onChange={(e)=>handleChange('task_name',e.target.value)} type="text" placeholder="Enter task name" />
            </div>
            
            <div>
              <Divider>Description</Divider>
              <TextArea style={{ width: '100%' ,border:'1px solid royalblue'}} onChange={(value)=>handleChange('description',value)} placeholder="Enter task description"/>
            </div>
            
            <div>
              <Divider>Scheduled Date</Divider>
                  <DatePicker onChange={(value)=>handleChange('scheduled_date',value)} style={{ width: '100%' ,border:'1px solid royalblue',borderRadius:'5px'}} placement='top'  menuStyle={{zIndex:100000,display:'flex',justifyContent:'center'}} />
            </div>
            <div>
                <Divider>Assign Maintenance to:</Divider>
                <SelectPicker
                  data={cascaderDataUsers}
                  // labelKey="label"
                  // valueKey="id"
                  placeholder="Select a technicien"
                  style={{ width: '100%' ,border:'1px solid royalblue',borderRadius:'5px'}}
                  onChange={(value)=>handleChange('assigned_to',value)}
                />
              </div>
            <div>
              <Divider>Priority</Divider>
              <SelectPicker
                data={[
                  { label: 'Low', value: 'Low' },
                  { label: 'Medium', value: 'Medium' },
                  { label: 'High', value: 'High' },
                ]}
                placeholder="Select priority"
                style={{ width: '100%' ,border:'1px solid royalblue',borderRadius:'5px'}}
                onChange={(value)=>handleChange('priority',value)}
              />
            </div>
            <div>
              <Divider>Status</Divider>
              <Input onChange={(e)=>handleChange('status',e.target.value)} type="text" placeholder="Enter task name" />
            </div>
            <div style={{marginBottom:'20px'}}>
              <Divider>Completion Date</Divider>
                  <DatePicker onChange={(value)=>handleChange('completion_date',value)} disabled={userInfo.role==="technicien"?false:true} style={{ width: '100%' ,border:'1px solid royalblue',borderRadius:'5px'}} placement='top'  menuStyle={{zIndex:100000,display:'flex',justifyContent:'center'}} />
            </div>
          </form>
            <Button onClick={handleSubmit} style={{width:'70%',border:'1px solid royalblue',borderRadius:'5px'}} appearance="primary" >Submit</Button>
        </center>
        </Panel>
    </div>
  )
};