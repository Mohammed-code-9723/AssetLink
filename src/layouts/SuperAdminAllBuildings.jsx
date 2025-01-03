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

import { buildingsData,sitesData} from '../features/SuperAdminSlice';

import { useDispatch,useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import LoaderComponent from './LoaderComponent';
import AddSiteBuildings from './AddSiteBuildings';
import { hasPermission } from '../components/CheckPermissions';

export default function SuperAdminAllBuildings() {

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
  const { buildings, statusBuildings , errorBuildings } = useSelector((state) => state.buildings);

  const token=localStorage.getItem('token');
  const userInfo=JSON.parse(localStorage.getItem('user'));

  const dispatch = useDispatch();
  const {t } = useTranslation();

    useEffect(()=>{
      dispatch(sitesData({token}))
      dispatch(buildingsData(token));
    },[]); 

  useEffect(()=>{
    if(buildings){
      setAllBuildings(buildings.buildings);
    }
  },[buildings,dispatch]); 

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
          const response = await fetch(`${process.env.REACT_APP_API_URL}/api/workspaces/${workspace_id}/buildings/deleteBuilding`, {
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
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/workspaces/${workspace_id}/buildings/updateBuilding`, {
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
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/workspaces/${worksp_id}/buildings/addBuilding`, {
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
        console.error('Failed to update the building:', result);
        alert(`Failed to update the building: ${result.error || 'Unknown error'}`);
      }
    }catch (error) {
      console.error('Error:', error); 
      alert('An error occurred while updating the building.');
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

  const formatCascaderDataSite = (sites) => {
    const sitess = [...new Set(sites?.map((site) =>({id: site.id,name: site.name,code:site.code})))];
    
    return sitess.map((site) => ({
      label: `${site.code} - ${site.name}`,
      value: site.id,
    }));
  };
  const cascaderDataSites = formatCascaderDataSite(sites);

  const formatCascaderDataBuildings = (buildings) => {
    const bL = [...new Set(buildings?.buildings?.map((building) =>({name: building.name,code:building.code})))];
    
    return bL.map((building) => ({
      label: `${building.code} - ${building.name}`,
      value: building.code,
    }));
  };
  const cascaderDataBuildings = formatCascaderDataBuildings(buildings);


  const formatCascaderDataBuildingsActivities = (buildings) => {
    const bL = [...new Set(buildings?.buildings?.map((building) =>({activity: building.activity})))];
    
    return bL.map((building) => ({
      label: `${building.activity}`,
      value: building.activity,
    }));
  };
  const cascaderDataBuildingsActivities = formatCascaderDataBuildingsActivities(buildings);

  const formatCascaderDataCities = (sites) => { 
    const cities = [...new Set(sites?.map((site) => site.city))]; 
    
    return cities.map((city) => ({
      label: city,
      value: city,
    }));
  };
  const cascaderDataCities = formatCascaderDataCities(sites); 


  const [filteredBuildings,setFilteredBuildings]=useState([]);

  const [filterByCity,setFilterCity]=useState(null); 
  const [filterByCode,setFilterCode]=useState(null);
  const [filterByActivity,setFilterActivity]=useState(null);
  const [filterBySite,setFilterSite]=useState(null);

  const handleFilter=()=>{
    setFilteredBuildings(buildings?.buildings?.filter((building)=>building.code===filterByCode || building.city===filterByCity || building.activity===filterByActivity || building.site_id==filterBySite));
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
          {
              (message&&notif)&&(
                  <Notification style={{width:'100%',zIndex: 100000 }} showIcon type="success" color='success' closable>
                  <strong><FaCheck color='success'/></strong> {message && message}.
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
                <Grid xs={12} lg={2} sm={12} md={12}>
                  <Cascader
                      // data={data}
                      className='Cascader_comp'
                      placeholder={t("project" )}
                      columnWidth={200}
                      popupStyle={{width:'12%'}}
                  />
                </Grid>
                <Grid xs={12} lg={2} sm={12} md={12}>
                  <Cascader
                      data={cascaderDataSites}
                      className='Cascader_comp'
                      placeholder={t("site")} 
                      columnWidth={200}
                      popupStyle={{width:'12%'}}
                      onChange={(value)=>setFilterSite(value)}  
                  />
                </Grid>
                <Grid xs={12} lg={2} sm={12} md={12}>
                  <Cascader
                      data={cascaderDataBuildings}
                      className='Cascader_comp'
                      placeholder={t("building" )}
                      columnWidth={200}
                      popupStyle={{width:'12%'}}
                      onChange={(value)=>setFilterCode(value)}  
                  />
                </Grid>
                <Grid xs={12} lg={2} sm={12} md={12}>
                  <Cascader
                      data={cascaderDataCities}
                      className='Cascader_comp'
                      placeholder={t("city")} 
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
            {
              hasPermission(userInfo.permissions,'buildings','create')&&(
                <div className='Add_container'>
                  <Button className='add_Button' onClick={()=>setAddBuilding(true)}><MdAdd size={22}/>&nbsp;&nbsp;{t('addBuilding')}</Button>
                </div>
              )
            }
            <div className='table_container'>
              <Table hoverRow sx={{ overflowX: 'scroll' }}>
                <thead>
                  <tr>
                    <th>{t('componentsPage.code')}</th>
                    <th>{t('componentsPage.name')}</th>
                    <th>{t('site')}</th>
                    <th>{t('buildingsPage.activity')}</th>
                    <th>{t('buildingsPage.address')}</th>
                    <th style={{width:'10%'}}>{t('buildingsPage.location')}</th>
                    <th>{t('buildingsPage.construction_year')}</th>
                    <th>{t('buildingsPage.Floor_area')}&nbsp;(m²)</th>
                    <th>{t('buildingsPage.type')}</th>
                    <th>{t('buildingsPage.level_count')}</th>
                    {
                      hasPermission(userInfo.permissions,'buildings','delete')&&(
                        <th>{t('buildingsPage.action')}</th>
                      )
                    }
                    <th>{t('buildingsPage.seeLocation')}</th>
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
                        {
                          hasPermission(userInfo.permissions,'buildings','delete')&&(
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
                          )
                        }
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
                    allBuildings.slice(startIndex, endIndex).map((row) => (
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
                        {
                          hasPermission(userInfo.permissions,'buildings','delete')&&(
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
                          )
                        }
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
            {
                (t('building')==="بناء")?(
                  selectedRow !== null && selectedRow.name ? (`${t('building')}${selectedRow.name}`) : (t('building'))
                ):(
                  t('building')
                )
              }
              
            </span>
          </Typography>
          <div>
            <Divider>
              <h3 id='title_H3'>
                <IoIosInformationCircle/>
                <span>{('componentsPage.information')}</span>
              </h3>
            </Divider>
            <div className='info-container'>
              <Divider>
                <h4>{('componentsPage.information')}</h4>
              </Divider>
              <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                <Grid item xs={12} md={12} lg={12} sm={12}>
                  <span>{('componentsPage.name')}</span><br />
                  <Input
                  disabled={!hasPermission(userInfo.permissions,'buildings','update')}
                    defaultValue={selectedRow?.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={6} sm={12}>
                  <span>{('componentsPage.code')}</span><br />
                  <Input
                  disabled={!hasPermission(userInfo.permissions,'buildings','update')}
                    defaultValue={selectedRow?.code || ''}
                    onChange={(e) => handleInputChange('code', e.target.value)}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={6} sm={12}>
                  <span>{('buildingsPage.PS')}</span><br />
                  <Cascader
                  disabled={!hasPermission(userInfo.permissions,'buildings','update')}
                      data={sites?.map((site) => ({ label: site.name, value: site.id }))}
                      defaultValue={buildingSite?.id} // Use `buildingSite?.id` here
                      placeholder="Parent Site"
                      popupStyle={{ width: '25%', zIndex: 10000 }}
                      columnWidth={350}
                      style={{ width: '100%' }}
                      onChange={(value) => handleInputChange('site_id', value)}
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={6} sm={12}>
                  <span>{('buildingsPage.CC')}</span><br />
                  <Input
                  disabled={!hasPermission(userInfo.permissions,'buildings','update')}
                    placeholder="Correlation Code"
                    variant="outlined"
                  />
                </Grid>
              </Grid>
              <Divider>
                <h4>{('buildingsPage.address')}</h4>
              </Divider>
              <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                <Grid item xs={12} md={12} lg={12} sm={12}>
                  <span>{('buildingsPage.address')}</span><br />
                  <Input
                  disabled={!hasPermission(userInfo.permissions,'buildings','update')}
                    defaultValue={selectedRow?.address || ''}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    variant="outlined"
                  />
                </Grid>
              </Grid>
              <Divider>
                <h4>{('buildingsPage.PSI')}</h4>
              </Divider>
              <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                <Grid item xs={12} md={6} lg={6} sm={12}>
                  <span>{('buildingsPage.Ctr')}</span><br />
                  <Input
                  disabled={!hasPermission(userInfo.permissions,'buildings','update')}
                    readOnly
                    defaultValue={buildingSite?.country || ''}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={6} sm={12}>
                  <span>{('buildingsPage.ZC')}</span><br />
                  <Input
                  disabled={!hasPermission(userInfo.permissions,'buildings','update')}
                  readOnly
                    defaultValue={buildingSite?.zipcode || ''}
                    onChange={(e) => handleInputChange('zipcode', e.target.value)}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={6} sm={12}>
                  <span>{('buildingsPage.RS')}</span><br />
                  <Input
                  disabled={!hasPermission(userInfo.permissions,'buildings','update')}
                  readOnly
                    placeholder="Region/State"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={6} sm={12}>
                  <span>{t('city')}</span><br />
                  <Input
                  disabled={!hasPermission(userInfo.permissions,'buildings','update')}
                  readOnly
                    defaultValue={buildingSite?.city || ''}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={6} sm={12}>
                  <span>Department</span><br />
                  <Input
                  disabled={!hasPermission(userInfo.permissions,'buildings','update')}
                  readOnly
                    placeholder="Department"
                    variant="outlined"
                  />
                </Grid>
              </Grid>
              <Divider>
                <h4>{('componentsPage.Characteristics')}</h4>
              </Divider>
              <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                <Grid item xs={12} md={6} lg={6} sm={12}>
                  <span>{('buildingsPage.level_count')}</span><br />
                  <Input
                  disabled={!hasPermission(userInfo.permissions,'buildings','update')}
                    defaultValue={selectedRow?.level_count || ''}
                    variant="outlined"
                    onChange={(e) => handleInputChange('level_count', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={6} sm={12}>
                  <span>{('buildingsPage.construction_year')}</span><br />
                  <Input
                  disabled={!hasPermission(userInfo.permissions,'buildings','update')}
                    defaultValue={selectedRow?.year_of_construction || ''}
                    variant="outlined"
                    type="number"
                    onChange={(e) => handleInputChange('year_of_construction', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={6} sm={12}>
                  <span>{('buildingsPage.Floor_area')}(m²)</span><br />
                  <Input
                  disabled={!hasPermission(userInfo.permissions,'buildings','update')}
                    defaultValue={selectedRow?.surface || ''}
                    variant="outlined"
                    endDecorator={<Button sx={{height:'100%',marginRight:'-12px',background:'linear-gradient(124deg, rgba(7,28,75,1) 0%, rgba(9,100,60,1) 100%)'}}>m²</Button>}
                    onChange={(e) => handleInputChange('surface', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={6} sm={12}>
                  <span>{('buildingsPage.activity')}</span><br />
                  <Input
                  disabled={!hasPermission(userInfo.permissions,'buildings','update')}
                    defaultValue={selectedRow?.activity || ''}
                    variant="outlined"
                    onChange={(e) => handleInputChange('activity', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={12} lg={12} sm={12}>
                  <span>{('buildingsPage.Cmt')}</span><br />
                  <Input
                  disabled={!hasPermission(userInfo.permissions,'buildings','update')}
                    variant="outlined"
                    placeholder='Comment'
                  />
                </Grid>
                <Grid item xs={12} md={12} lg={12} sm={12}>
                  <span>{('buildingsPage.location')}</span><br />
                  <Input
                  disabled={!hasPermission(userInfo.permissions,'buildings','update')}
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
              {t('buildingsPage.CB')}
            </span>
          </Typography>
          <div>
            <h3 id='title_H3'>
              <IoIosInformationCircle/>
              <span>{t('componentsPage.information')}</span>
            </h3>
            <div className='info-container'>
              <h4>{t('componentsPage.information')}</h4>
              <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                <Grid item xs={12} md={12} lg={12} sm={12}>
                  <span>{t('componentsPage.name')}</span><br />
                  <Input
                    onChange={(e) => setNewBuilding({...newBuilding,name:e.target.value})}
                    variant="outlined"
                    placeholder="Name"
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={6} sm={12}>
                  <span>{t('componentsPage.code')}</span><br />
                  <Input
                    onChange={(e) => setNewBuilding({...newBuilding,code:e.target.value})}
                    variant="outlined"
                    placeholder="Code"
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={6} sm={12}>
                  <span>{t('buildingsPage.PS')}</span><br />
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
              <h4>{t('buildingsPage.address')}</h4>
              <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                <Grid item xs={12} md={12} lg={12} sm={12}>
                  <span>{t('buildingsPage.address')}</span><br />
                  <Input
                    onChange={(e) => setNewBuilding({...newBuilding,address:e.target.value})}
                    variant="outlined"
                    placeholder="Address"

                  />
                </Grid>
              </Grid>
              <h4>{t('componentsPage.Characteristics')}</h4>
              <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                <Grid item xs={12} md={6} lg={6} sm={12}>
                  <span>{t('buildingsPage.level_count')}</span><br />
                  <Input
                    variant="outlined"
                    placeholder="Level Count"
                    onChange={(e) => setNewBuilding({...newBuilding,level_count:e.target.value})}

                  />
                </Grid>
                <Grid item xs={12} md={6} lg={6} sm={12}>
                  <span>{t('buildingsPage.construction_year')}</span><br />
                  <Input
                    variant="outlined"
                    placeholder="Construction year"
                    type='number'
                    onChange={(e) => setNewBuilding({...newBuilding,year_of_construction:e.target.value})}

                  />
                </Grid>
                <Grid item xs={12} md={6} lg={6} sm={12}>
                  <span>{t('buildingsPage.Floor_area')} (m²)</span><br />
                  <Input
                    variant="outlined"
                    placeholder="Floor area"
                    onChange={(e) => setNewBuilding({...newBuilding,surface:e.target.value})}
                    endDecorator={<Button sx={{height:'100%',marginRight:'-12px',background:'linear-gradient(124deg, rgba(7,28,75,1) 0%, rgba(9,100,60,1) 100%)'}}>m²</Button>}
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={6} sm={12}>
                  <span>{t('buildingsPage.activity')}</span><br />
                  <Input
                    variant="outlined"
                    placeholder="Activity"
                    onChange={(e) => setNewBuilding({...newBuilding,activity:e.target.value})}

                  />
                </Grid>
                <Grid item xs={12} md={12} lg={12} sm={12}>
                  <span>{t('buildingsPage.type')}</span><br />
                  <Input
                    variant="outlined"
                    placeholder='Type'
                    onChange={(e) => setNewBuilding({...newBuilding,type:e.target.value})}

                  />
                </Grid>
                <Grid item xs={12} md={12} lg={12} sm={12}>
                  <span>{t('buildingsPage.location')}</span><br />
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
                <Button className='cancelBtn' startDecorator={<MdCancel />} onClick={emptyFields}>{t('Cancel')}</Button>
                <Button className='checkBtn' startDecorator={<FaCheck />} onClick={handleAddBuilding}>{t('buildingsPage.CB')}</Button>
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
            {('componentsPage.confirmation')}
          </DialogTitle>
          <Divider />
          <DialogContent sx={{width:'100%'}}>
            <Typography level='div' id="modal-desc" textColor="text.tertiary">
              {('componentsPage.questionD')} {t('building')}?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button variant="solid" color="danger" onClick={confirmDelete}>
              {('componentsPage.Confirm')}
            </Button>
            <Button variant="plain" color="neutral" onClick={() =>{ setOpenDelete(false);setDeletedRow({})}}>
              {('cancel')}
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
