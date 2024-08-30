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

import { Pagination, Notification,Loader } from 'rsuite';
import { Divider } from '@mui/joy';

import Sheet from '@mui/joy/Sheet';
import Button from '@mui/joy/Button';

import '../styles/Building.css';

import { IoIosInformationCircle } from "react-icons/io";
import SiteBuildingsMap from './SiteBuildingsMap';

import Modal from '@mui/joy/Modal';
import ModalClose from '@mui/joy/ModalClose';
import Typography from '@mui/joy/Typography';
import { FaCheck } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import Input from '@mui/joy/Input';
import { IoMdCreate } from "react-icons/io";
import { BsEye } from "react-icons/bs";


import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import DialogActions from '@mui/joy/DialogActions';
import ModalDialog from '@mui/joy/ModalDialog';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';

import { buildingsData,sitesData,workspacesData} from '../features/SuperAdminSlice';

import { useDispatch,useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import LoaderComponent from './LoaderComponent';
import AddSiteBuildings from './AddSiteBuildings';


export default function OtherRolesBuildings() {
    const [activePage, setActivePage] = React.useState(1);
    const [itemsPerPage] = useState(10);
    const startIndex = (activePage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    const [open, setOpen] = React.useState(false);
    const [addBuilding, setAddBuilding] = React.useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [isDirty, setIsDirty] = useState(false);
    const [newBuilding,setNewBuilding]=useState({name:'',location:'', activity:'',code:'',site_id:'',year_of_construction:'',level_count:'',address:'',surface:'',type:''});
    const [openDelete, setOpenDelete] = React.useState(false);
    const [deletedRow,setDeletedRow]=useState({});
    
    const [allBuildings,setAllBuildings]=useState([]);
    const { sites, statusSites , errorSites } = useSelector((state) => state.sites);
    // const { buildings, statusBuildings , errorBuildings } = useSelector((state) => state.buildings);
    const { workspaces, statusWorkspaces , errorWorkspaces } = useSelector((state) => state.workspaces);
    
    const token=localStorage.getItem('token');
    const dispatch = useDispatch();
    const {t } = useTranslation();
    
    const [chosenWorkspaceSites,setChosenWorkspaceSites]=useState(null);
    const [chosenSite,setChosenSite]=useState(null);

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

     
  
    const emptyFields=()=>{
      setNewBuilding({name:null,location:null, activity:null,code:null,site_id:null,year_of_construction:null,level_count:null,address:null,surface:null,type:null});
    }
    const [LoaderState,setLoaderState]=useState(false);
    const [notif,setNotif]=useState(false);
    const [message,setMessage]=useState('');
    const [buildingSite,setBuildingSite]=useState({});
    const [updateLocation,setUpdateLocation]=useState(false);
    const [Nlocation,setLocation]=useState(null);
  
    const [chosenSiteBuildings,setChosenSiteBuildings]=useState([]);
    const [siteName,setSiteName]=useState(null);
    const [openMapModalBuildings,setOpenMapModalBuildings]=useState(false);
  
    
    const handleRowClick = (row) => {
      setSelectedRow(row);
      // console.log("row: ",row);
      setOpen(true);
      setIsDirty(false);
      setBuildingSite(sites?.find((site)=>site.id===row.site_id));
    };
    
    
    const handleInputChange = (field, value) => {
      setSelectedRow((prevState) => ({
        ...prevState,
        [field]: value,
      }));
      setIsDirty(true);
    };
    
    const HandleDelete=(row)=>{
      setBuildingSite(sites?.find((site)=>site.id===row.site_id));
      setOpenDelete(true);
      setDeletedRow(row);
    }
  
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
        }, 6000);
        return ()=>clearTimeout(intervalLoader);
      },[notif]);
  
      const HandleShowBuildings=(row)=>{
        setChosenSiteBuildings([...chosenSiteBuildings,row]);
        setSiteName(sites?.find((site)=>site.id===row.id)?.name);
        setOpenMapModalBuildings(true);
    }
  
    const confirmDelete = async () => { 
        try {
            setLoaderState(true);
            setOpenDelete(false);
            const workspace_id  = buildingSite.workspace_id;
            // alert(`http://127.0.0.1:8000/api/workspaces/${workspace_id}/buildings/${deletedRow.id}`);
            const response = await fetch(`http://127.0.0.1:8000/api/workspaces/${workspace_id}/buildings/deleteBuilding`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body:JSON.stringify({id:deletedRow.id})
            });
    
            const result = await response.json();
    
            if (response.ok) {
                setNotif(true);
                setMessage(result.message);
                setAllBuildings(allBuildings.filter((b)=>b.id!==deletedRow.id));
                dispatch(buildingsData(token));
            } else {
                console.error('Failed to delete the building:', result);
                alert('Failed to delete the building.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while deleting the building.');
        }
    };
  
    const handleUpdateBuilding = async () => {
      try {
        setLoaderState(true); 
    
        const workspace_id  = buildingSite.workspace_id; 
        const building_id =  selectedRow.id; 
        const response = await fetch(`http://127.0.0.1:8000/api/workspaces/${workspace_id}/buildings/updateBuilding`, {
          method: 'POST',
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
          setAllBuildings(allBuildings.map((building) => {
            if (building.id === building_id) {
              return { ...building, ...selectedRow };
            }
            return building;
          }));
          dispatch(buildingsData(token));
          setOpen(false);
          setLoaderState(false); 
        } else {
          console.error('Failed to update the building:', result);
          alert(`Failed to update the building: ${result.error || 'Unknown error'}`);
        }
      }catch (error) {
        console.error('Error:', error); 
        alert('An error occurred while updating the building.');
      }
    };
    
    const handleAddBuilding = async () => {
      // newBuilding.location=JSON.stringify(newBuilding.location);
      console.log(newBuilding);
      // setAddBuilding(false);
  
      try {
        setLoaderState(true); 
    
        const worksp_id  = sites?.find((site)=>site.id===newBuilding.site_id)?.workspace_id; 
        const response = await fetch(`http://127.0.0.1:8000/api/workspaces/${worksp_id}/buildings/addBuilding`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(newBuilding), 
        });
    
        const result = await response.json();
  
        if (response.ok) {
          setNotif(true);
          setMessage(result.message);
          setAllBuildings([...allBuildings,newBuilding]);
          dispatch(buildingsData(token));
          setAddBuilding(false);
          setLoaderState(false); 
          setNewBuilding({...newBuilding,location:null});
        } else {
          console.error('Failed to add the building:', result);
          alert(`Failed to add the building: ${result.error || 'Unknown error'}`);
        }
      }catch (error) {
        console.error('Error:', error); 
        alert('An error occurred while adding the building.');
      }
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
      }, 6000);
      return ()=>clearTimeout(intervalLoader);
    },[notif]);
  
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
    const cascaderDataCities =formatCascaderDataSite(sites); 

    // useEffect(()=>{},[sites])
  
    const formatCascaderDataBuildings = (allBuildings) => {
      const bL = [...new Set(allBuildings?.map((building) =>({name: building.name,code:building.code})))];
      
      return bL.map((building) => ({
        label: `${building.code} - ${building.name}`,
        value: building.code,
      }));
    };
    const cascaderDataBuildings = formatCascaderDataBuildings(allBuildings);
  
  
    const formatCascaderDataBuildingsActivities = (allBuildings) => {
      const bL = [...new Set(allBuildings?.map((building) =>({activity: building.activity})))];
      
      return bL.map((building) => ({
        label: `${building.activity}`,
        value: building.activity,
      }));
    };
    const cascaderDataBuildingsActivities = formatCascaderDataBuildingsActivities(allBuildings);
  
    

    const formatCascaderDataWorkspaces = (workspaces) => {
        const workspacesDataa = [...new Set(workspaces?.map((workspace) =>({name: workspace.name,id:workspace.id})))];
        
        return workspacesDataa.map((workspace) => ({
        label: `${workspace.id} - ${workspace.name}`,
        value: workspace.id,
        }));
    };
    const cascaderDataWorkspaces = formatCascaderDataWorkspaces(workspaces);
  
    
  
    const [filteredBuildings,setFilteredBuildings]=useState([]);
  
    const [filterByCity,setFilterCity]=useState(null); 
    const [filterByCode,setFilterCode]=useState(null);
    const [filterByActivity,setFilterActivity]=useState(null);
    const [filterBySite,setFilterSite]=useState(null);
  
    const handleFilter=()=>{
      setFilteredBuildings(allBuildings?.filter((building)=>building.code===filterByCode || building.city===filterByCity || building.activity===filterByActivity || building.site_id===filterBySite));
      }
    const handleClearFilter =()=>{
        // dispatch(sitesData(token))
        // setAllSites(sites);
        setFilterCity(null);
        setFilterSite(null);
        setFilterActivity(null);
        setFilterCode(null);
        setFilteredBuildings([]);
      }
    return (
      <div>
          <Breadcrumbs separator=">" aria-label="breadcrumbs" size="sm">
            {[t('dashboard'),t('users.workspaces'),t('buildings')].map((item) => (
              <Link  key={item} color="neutral" href="#sizes">
              <h5>
                {item}
              </h5>
            </Link>
            ))}
          </Breadcrumbs>
          <div>
            <div className='title_image'>
              <h2 id='title_H2'><SiTestrail style={{color:'rgb(3, 110, 74)'}}/><span> {t('buildings')} </span></h2>
              <img src="/assets/Buildings.svg" alt="bui_img" />
            </div>    
            <Grid container spacing={2} sx={{ flexGrow: 1 ,display:'flex',justifyContent:'center',mb:2}}>
                <Grid xs={12} lg={12} sm={12} md={6}>
                    <center>
                        <h3>Choose workspace to display sites</h3>
                    </center>
                    {/* <CheckPicker labelKey='label' placeholder={t('site')} onChange={(value)=>setFilterSite(value)} placement='bottom' menuStyle={{ zIndex: 1400 }}  data={cascaderDataSites} className='Cascader_comp'/> */}
                    <Cascader data={cascaderDataWorkspaces} 
                        className='Cascader_comp'
                        placeholder={t('users.workspaces')}
                        popupStyle={{width:'25%'}}
                        columnWidth={600}
                        onChange={(value)=>handleWorkspaceChange(value)}  
                    />
                </Grid>
                <Grid xs={12} lg={12} sm={12} md={6} sx={{display:chosenWorkspaceSites?'grid':'none',zIndex:1}}>
                    <center>
                        <h3>Choose site to display buildings</h3>
                    </center>
                    {/* <CheckPicker labelKey='label' placeholder={t('site')} onChange={(value)=>setFilterSite(value)} placement='bottom' menuStyle={{ zIndex: 1400 }}  data={cascaderDataSites} className='Cascader_comp'/> */}
                    <Cascader data={cascaderDataSites} 
                        className='Cascader_comp'
                        placeholder={t('sites')}
                        popupStyle={{width:'25%'}}
                        columnWidth={600}
                        onChange={(value)=>handleSiteChange(value)}  
                    />
                </Grid>
            </Grid>
            <br />
            {
                (message&&notif)&&(
                    <Notification style={{width:'100%',zIndex: 100000 }} showIcon type="success" color='success' closable>
                    <strong><FaCheck color='success'/></strong> {message && message}.
                    </Notification>
                )
            }
            <Sheet variant="soft" color="neutral" sx={{ display:chosenSite?'grid':'none',marginTop:'10px',p: 4,borderRadius:'5px',boxShadow:'0 0 5px rgba(176, 175, 175, 0.786)' }}>
              
              <div className='action_bottons'>
                <h6><BsLayersFill size={22}/>&nbsp;&nbsp;<span>Current</span></h6>
                <h6><MdDelete size={22}/>&nbsp;&nbsp;<span>Recently deleted</span></h6>
              </div>
              
              <div className='Cascader_container'>
                <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                  <Grid xs={12} lg={2} sm={12} md={12}>
                    <Cascader
                        // data={data}
                        className='Cascader_comp'
                        placeholder="Project" 
                        columnWidth={200}
                        popupStyle={{width:'12%'}}
                    />
                  </Grid>
                  <Grid xs={12} lg={2} sm={12} md={12}>
                    <Cascader
                        data={cascaderDataSites}
                        className='Cascader_comp'
                        placeholder="Site" 
                        columnWidth={200}
                        popupStyle={{width:'12%'}}
                        onChange={(value)=>setFilterSite(value)}  
                    />
                  </Grid>
                  <Grid xs={12} lg={2} sm={12} md={12}>
                    <Cascader
                        data={cascaderDataBuildings}
                        className='Cascader_comp'
                        placeholder="Building" 
                        columnWidth={200}
                        popupStyle={{width:'12%'}}
                        onChange={(value)=>setFilterCode(value)}  
                    />
                  </Grid>
                  <Grid xs={12} lg={2} sm={12} md={12}>
                    <Cascader
                        data={cascaderDataCities}
                        className='Cascader_comp'
                        placeholder="City (Department)" 
                        columnWidth={200}
                        popupStyle={{width:'12%'}}
                        onChange={(value)=>setFilterCity(value)}  
                    />
                  </Grid>
                  <Grid xs={12} lg={2} sm={12} md={12}>
                    <Cascader
                        data={cascaderDataBuildingsActivities}
                        className='Cascader_comp'
                        placeholder="Main usage" 
                        columnWidth={200}
                        popupStyle={{width:'12%'}}
                        onChange={(value)=>setFilterActivity(value)}  
                    />
                  </Grid>
                  <Grid xs={12} lg={2} sm={12} md={12}>
                    <Button className='apply_Button' onClick={handleFilter}><IoFilter size={22}/>&nbsp;&nbsp;{t('filter')}</Button>
                  </Grid>
                  <Grid sx={{display:filteredBuildings.length>0?'grid':'none'}} xs={12} lg={2} sm={12} md={12}>
                    <Button className='apply_Button' onClick={handleClearFilter}><IoFilter size={22}/>&nbsp;&nbsp;{('search.clear')}</Button>
                  </Grid>
                </Grid>
              </div>
              <div className='Add_container'>
                <Button className='add_Button' onClick={()=>setAddBuilding(true)}><MdAdd size={22}/>&nbsp;&nbsp;{t('addBuilding')}</Button>
              </div>
              <div className='table_container'>
                <Table hoverRow sx={{ overflowX: 'scroll' }}>
                  <thead>
                    <tr>
                      <th>Code</th>
                      <th>Name</th>
                      <th>Site</th>
                      <th>Activity</th>
                      <th>Address</th>
                      <th style={{width:'10%'}}>Location</th>
                      <th>Construction Year</th>
                      <th>Floor Area&nbsp;(m²)</th>
                      <th>Type</th>
                      <th>Level Count</th>
                      <th>Action</th>
                      <th>See location</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                  allBuildings&&allBuildings.length>0?(
                    
                    filteredBuildings.length>0?(
                      filteredBuildings.slice(startIndex, endIndex).map((row) => (
                        <tr key={row.code} onClick={()=>handleRowClick(row)} className='table_row'>
                          <td>{row.code}</td>
                          <td>{row.name}</td>
                          <td>
                            {sites?.find((site)=>site.id===row.site_id)?.name} 
                            - 
                            {sites?.find((site)=>site.id===row.site_id)?.code}
                          </td>
                          <td>{row.activity}</td>
                          <td>{row.address}</td>
                          <td>{JSON.parse(row.location)}</td>
                          <td>{row.year_of_construction}</td>
                          <td>{row.surface}</td>
                          <td>{row.type}</td>
                          <td>{row.level_count}</td>
                          <td>
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
                          <td>
                            <Button sx={{
                              background:'linear-gradient(265deg, rgba(5,127,83,1) 0%, rgba(95,5,138,1) 100%)',
                              zIndex:999
                            }}
                            onClick={(e)=>{
                              e.stopPropagation();
                              HandleShowBuildings(row)
                            }}
                            >
                              <BsEye size={22}/>
                            </Button>
                          </td>
                        </tr>
                      ))
                    ):(

                      allBuildings&&allBuildings.slice(startIndex, endIndex).map((row) => (
                        <tr key={row.code} onClick={()=>handleRowClick(row)} className='table_row'>
                          <td>{row.code}</td>
                          <td>{row.name}</td>
                          <td>
                            {sites?.find((site)=>site.id===row.site_id)?.name} 
                            - 
                            {sites?.find((site)=>site.id===row.site_id)?.code}
                          </td>
                          <td>{row.activity}</td>
                          <td>{row.address}</td>
                          <td>{JSON.parse(row.location)}</td>
                          <td>{row.year_of_construction}</td>
                          <td>{row.surface}</td>
                          <td>{row.type}</td>
                          <td>{row.level_count}</td>
                          <td>
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
                          <td>
                            <Button sx={{
                              background:'linear-gradient(265deg, rgba(5,127,83,1) 0%, rgba(95,5,138,1) 100%)',
                              zIndex:999
                            }}
                            onClick={(e)=>{
                              e.stopPropagation();
                              HandleShowBuildings(row)
                            }}
                            >
                              <BsEye size={22}/>
                            </Button>
                          </td>
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
                  total={filteredBuildings.length > 0 ? filteredBuildings.length : allBuildings.length}
                  limit={itemsPerPage}
                  activePage={activePage}
                  onChangePage={setActivePage}
                />
              </div>
            </Sheet>
          </div>
  
        {/* Modal building information's */}
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
                Building {selectedRow!==null&&selectedRow.name}
              </span>
            </Typography>
            <div>
              <Divider>
                <h3 id='title_H3'>
                  <IoIosInformationCircle/>
                  <span>Information</span>
                </h3>
              </Divider>
              <div className='info-container'>
                <Divider>
                  <h4>Information</h4>
                </Divider>
                <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                  <Grid item xs={12} md={12} lg={12} sm={12}>
                    <span>Name</span><br />
                    <Input
                      defaultValue={selectedRow?.name || ''}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={6} sm={12}>
                    <span>Code</span><br />
                    <Input
                      defaultValue={selectedRow?.code || ''}
                      onChange={(e) => handleInputChange('code', e.target.value)}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={6} sm={12}>
                    <span>Parent Site</span><br />
                    <Cascader
                        data={cascaderDataSites}
                        defaultValue={buildingSite?.id} // Use `buildingSite?.id` here
                        placeholder="Parent Site"
                        popupStyle={{ width: '25%', zIndex: 10000 }}
                        columnWidth={350}
                        style={{ width: '100%' }}
                        onChange={(value) => handleInputChange('site_id', value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={6} sm={12}>
                    <span>Correlation Code</span><br />
                    <Input
                      placeholder="Correlation Code"
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
                <Divider>
                  <h4>Address</h4>
                </Divider>
                <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                  <Grid item xs={12} md={12} lg={12} sm={12}>
                    <span>Address</span><br />
                    <Input
                      defaultValue={selectedRow?.address || ''}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
                <Divider>
                  <h4>Parent Site information</h4>
                </Divider>
                <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                  <Grid item xs={12} md={6} lg={6} sm={12}>
                    <span>Country</span><br />
                    <Input
                      readOnly
                      defaultValue={buildingSite?.country || ''}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={6} sm={12}>
                    <span>Zipcode</span><br />
                    <Input
                    readOnly
                      defaultValue={buildingSite?.zipcode || ''}
                      onChange={(e) => handleInputChange('zipcode', e.target.value)}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={6} sm={12}>
                    <span>Region/State</span><br />
                    <Input
                    readOnly
                      placeholder="Region/State"
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={6} sm={12}>
                    <span>City</span><br />
                    <Input
                    readOnly
                      defaultValue={buildingSite?.city || ''}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={6} sm={12}>
                    <span>Department</span><br />
                    <Input
                    readOnly
                      placeholder="Department"
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
                <Divider>
                  <h4>Characteristics</h4>
                </Divider>
                <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                  <Grid item xs={12} md={6} lg={6} sm={12}>
                    <span>Level Count</span><br />
                    <Input
                      defaultValue={selectedRow?.level_count || ''}
                      variant="outlined"
                      onChange={(e) => handleInputChange('level_count', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={6} sm={12}>
                    <span>Construction year </span><br />
                    <Input
                      defaultValue={selectedRow?.year_of_construction || ''}
                      variant="outlined"
                      type="number"
                      onChange={(e) => handleInputChange('year_of_construction', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={6} sm={12}>
                    <span>Floor area (m²)</span><br />
                    <Input
                      defaultValue={selectedRow?.surface || ''}
                      variant="outlined"
                      endDecorator={<Button sx={{height:'100%',marginRight:'-12px',background:'linear-gradient(124deg, rgba(7,28,75,1) 0%, rgba(9,100,60,1) 100%)'}}>m²</Button>}
                      onChange={(e) => handleInputChange('surface', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={6} sm={12}>
                    <span>Activity</span><br />
                    <Input
                      defaultValue={selectedRow?.activity || ''}
                      variant="outlined"
                      onChange={(e) => handleInputChange('activity', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={12} lg={12} sm={12}>
                    <span>Comment</span><br />
                    <Input
                      variant="outlined"
                      placeholder='Comment'
                    />
                  </Grid>
                  <Grid item xs={12} md={12} lg={12} sm={12}>
                    <span>Location</span><br />
                    <Input
                      onClick={()=>setUpdateLocation(true)}
                      value={selectedRow?.location}
                      variant="outlined"
                      placeholder='Comment'
                      // value={Nlocation}
                    />
                  </Grid>
                </Grid>
                <div>
                  {
                    updateLocation&&(
                      <AddSiteBuildings justLocation={false} handleInputChange={handleInputChange} setUpdateLocation={setUpdateLocation}/>
                    )
                  }
                </div>
              </div>
              {
                isDirty&&(
                  <div className='action_buttons_validate_cancel'>
                    <Button className='cancelBtn' startDecorator={<MdCancel />} onClick={() => setOpen(false)}>{t('cancel')}</Button>
                    <Button className='checkBtn' startDecorator={<FaCheck />} onClick={handleUpdateBuilding}>{t('users.update')}</Button>
                  </div>
                )
              }
            </div>
          </Sheet>
        </Modal>
  
        {/* Modal add Building */}
        <Modal
          aria-labelledby="modal-title"
          aria-describedby="modal-desc"
          open={addBuilding}
          onClose={() => setAddBuilding(false)}
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
              <IoMdCreate style={{color:'rgb(3, 110, 74)'}}/>
              <span>
                Create Building
              </span>
            </Typography>
            <div>
              <h3 id='title_H3'>
                <IoIosInformationCircle/>
                <span>Information</span>
              </h3>
              <div className='info-container'>
                <h4>Information</h4>
                <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                  <Grid item xs={12} md={12} lg={12} sm={12}>
                    <span>Name</span><br />
                    <Input
                      onChange={(e) => setNewBuilding({...newBuilding,name:e.target.value})}
                      variant="outlined"
                      placeholder="Name"
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={6} sm={12}>
                    <span>Code</span><br />
                    <Input
                      onChange={(e) => setNewBuilding({...newBuilding,code:e.target.value})}
                      variant="outlined"
                      placeholder="Code"
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={6} sm={12}>
                    <span>Parent Site</span><br />
                    <Cascader
                      data={cascaderDataSites}
                      placeholder="Parent Site" 
                      style={{width:'100%'}}
                      popupStyle={{width:'35%',zIndex:10000}}
                      columnWidth={500}
                      onChange={(value) => setNewBuilding({...newBuilding,site_id:value})}
                    />
                  </Grid>
                </Grid>
                <h4>Address</h4>
                <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                  <Grid item xs={12} md={12} lg={12} sm={12}>
                    <span>Address</span><br />
                    <Input
                      onChange={(e) => setNewBuilding({...newBuilding,address:e.target.value})}
                      variant="outlined"
                      placeholder="Address"
  
                    />
                  </Grid>
                </Grid>
                <h4>Characteristics</h4>
                <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                  <Grid item xs={12} md={6} lg={6} sm={12}>
                    <span>Level Count</span><br />
                    <Input
                      variant="outlined"
                      placeholder="Level Count"
                      onChange={(e) => setNewBuilding({...newBuilding,level_count:e.target.value})}
  
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={6} sm={12}>
                    <span>Construction year </span><br />
                    <Input
                      variant="outlined"
                      placeholder="Construction year"
                      type='number'
                      onChange={(e) => setNewBuilding({...newBuilding,year_of_construction:e.target.value})}
  
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={6} sm={12}>
                    <span>Floor area (m²)</span><br />
                    <Input
                      variant="outlined"
                      placeholder="Floor area"
                      onChange={(e) => setNewBuilding({...newBuilding,surface:e.target.value})}
                      endDecorator={<Button sx={{height:'100%',marginRight:'-12px',background:'linear-gradient(124deg, rgba(7,28,75,1) 0%, rgba(9,100,60,1) 100%)'}}>m²</Button>}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={6} sm={12}>
                    <span>Activity</span><br />
                    <Input
                      variant="outlined"
                      placeholder="Activity"
                      onChange={(e) => setNewBuilding({...newBuilding,activity:e.target.value})}
  
                    />
                  </Grid>
                  <Grid item xs={12} md={12} lg={12} sm={12}>
                    <span>Type</span><br />
                    <Input
                      variant="outlined"
                      placeholder='Type'
                      onChange={(e) => setNewBuilding({...newBuilding,type:e.target.value})}
  
                    />
                  </Grid>
                  <Grid item xs={12} md={12} lg={12} sm={12}>
                    <span>Location</span><br />
                    <Input
                      onClick={()=>setUpdateLocation(true)}
                      value={newBuilding.location}
                      variant="outlined"
                      placeholder='Location'
                    />
                  </Grid>
                </Grid>
              </div>
              <div>
                  {
                    updateLocation&&(
                      <AddSiteBuildings justLocation={true} newBuilding={newBuilding} setNewBuilding={setNewBuilding} setUpdateLocation={setUpdateLocation}/>
                    )
                  }
                </div>
                <div className='action_buttons_validate_cancel'>
                  <Button className='cancelBtn' startDecorator={<MdCancel />} onClick={emptyFields}>Cancel</Button>
                  <Button className='checkBtn' startDecorator={<FaCheck />} onClick={handleAddBuilding}>Validate</Button>
                </div>
            </div>
          </Sheet>
        </Modal>
  
        {/* Modal delete site */}
        {/* Modal delete site */}
        <Modal open={openDelete} onClose={() => setOpenDelete(false)} sx={{zIndex:1000}}>
          <ModalDialog variant="outlined" role="alertdialog" sx={{width:'40%'}}>
            <DialogTitle>
              <WarningRoundedIcon />
              Confirmation
            </DialogTitle>
            <Divider />
            <DialogContent sx={{width:'100%'}}>
              <Typography level='div' id="modal-desc" textColor="text.tertiary">
                Are you sure you want to delete building <strong>{deletedRow?.name}</strong> ?
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button variant="solid" color="danger" onClick={confirmDelete}>
                Confirm
              </Button>
              <Button variant="plain" color="neutral" onClick={() =>{ setOpenDelete(false);setDeletedRow({})}}>
                Cancel
              </Button>
            </DialogActions>
          </ModalDialog>
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
  
  
        {/*render site buildings map */}
        <Modal
          aria-labelledby="modal-title"
          aria-describedby="modal-desc"
          open={openMapModalBuildings}
          onClose={() => {
            setOpenMapModalBuildings(false);
            setChosenSiteBuildings([]);
          }}
          sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' ,zIndex:1000,marginLeft:'50px',marginTop:'70px'}}
        >
          <Sheet
            variant="outlined"
            sx={{
              width:'100%',
              height:'98%',
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
              level="h4"
              textColor="inherit"
              fontWeight="lg"
              mb={1}
              sx={{
                width:'100%',
                display: 'flex',
                justifyContent:'center'
              }}
            >
              <h2 id='title_H2'><SiTestrail style={{color:'rgb(3, 110, 74)'}}/><span>{siteName} {t('buildings')}</span></h2>
            </Typography>
            <Typography level='div' id="modal-desc" textColor="text.tertiary">
              <SiteBuildingsMap setAllSites={sites} siteName={siteName} chosenSiteBuildings={chosenSiteBuildings} setChosenSiteBuildings={setChosenSiteBuildings} />
            </Typography>
          </Sheet>
        </Modal>
      </div>
    )
}
