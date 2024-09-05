import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon, Tooltip ,useMap} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';
import { Button, Switch,Grid } from '@mui/joy';
import Typography from '@mui/joy/Typography';

import { SiTestrail } from 'react-icons/si';
import Breadcrumbs from '@mui/joy/Breadcrumbs';
import Link from '@mui/joy/Link';

import { BsLayersFill } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import { IoFilter } from "react-icons/io5";
import { MdAdd } from "react-icons/md";

import { Cascader } from 'rsuite';
import Table from '@mui/joy/Table';
import { FaLocationDot } from "react-icons/fa6";

import { Pagination,Notification } from 'rsuite';
import { Divider } from '@mui/joy';

import Sheet from '@mui/joy/Sheet';

import '../styles/Building.css';

import { IoIosInformationCircle } from "react-icons/io";
import Modal from '@mui/joy/Modal';
import ModalClose from '@mui/joy/ModalClose';
import { FaCheck } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import Input from '@mui/joy/Input';
import { IoMdCreate } from "react-icons/io";
import { useTranslation } from 'react-i18next';


import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import DialogActions from '@mui/joy/DialogActions';
import ModalDialog from '@mui/joy/ModalDialog';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';

import '../styles/SiteBuildingsMap.css'; 

import { useDispatch,useSelector } from 'react-redux';
import {sitesData, projectsData } from '../features/SuperAdminSlice';
import LoaderComponent from './LoaderComponent';
import AddSiteBuildings from './AddSiteBuildings';
import {  CheckPicker } from 'rsuite';
import { deleteSite,buildingsData,addSiteAsync,updateSite,workspacesData} from '../features/SuperAdminSlice';
import { hasPermission } from '../components/CheckPermissions';


const createCustomIcon = () => {
    const svgString = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#04c179">
            <path d="M12 2C8.14 2 5 5.14 5 9c0 4.3 7 13 7 13s7-8.7 7-13c0-3.86-3.14-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5 14.5 7.62 14.5 9 13.38 11.5 12 11.5z"/>
        </svg>`;
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    return new L.Icon({
        iconUrl: url,
        iconSize: [40, 40],
        iconAnchor: [12, 24],
        popupAnchor: [0, -24],
    });
};

function MoveToLocation({ lat, lon }) {
    const map = useMap();
    useEffect(() => {
        if (lat && lon) {
            map.setView([lat, lon], 17);
        }
    }, [lat, lon, map]);

    return null;
}

export default function SiteBuildingsMap({ siteName,setAllSites ,setChosenSiteBuildings, chosenSiteBuildings }) {

    const [polygonCoords, setPolygonCoords] = useState([]);
    const [customIcon, setCustomIcon] = useState(createCustomIcon());
    const [checked, setChecked] = useState(false);
    const [targetLocation, setTargetLocation] = useState(null);

    const [activePage, setActivePage] = React.useState(1);
    const [open, setOpen] = React.useState(false);
    const [addBuilding, setAddBuilding] = React.useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [isDirty, setIsDirty] = useState(false);
    const [newBuilding,setNewBuilding]=useState({name:null,location:null, activity:null,code:null,site_id:null,year_of_construction:null,level_count:null,address:null,surface:null,type:null});
    const [openDelete, setOpenDelete] = React.useState(false);
    const [deletedRow,setDeletedRow]=useState({});
    const {t}=useTranslation();
    const token=localStorage.getItem('token');
    const userInfo=JSON.parse(localStorage.getItem('user'));
    const dispatch = useDispatch();

    const { sites, statusSites , errorSites } = useSelector((state) => state.sites);
    const { buildings, statusBuildings , errorBuildings } = useSelector((state) => state.buildings);
    
const [openMapModalAddBuilding,setOpenMapModalAddBuilding]=useState(false);

const [addWS,setAddWS]=useState(null);

    useEffect(() => {
        const icon = createCustomIcon();
        setCustomIcon(icon);
    }, []);
    
    useEffect(() => {
        if (chosenSiteBuildings && chosenSiteBuildings?.length > 0) {
            const initialPolygonCoords = chosenSiteBuildings?.map(building => {
                const latitude = JSON.parse(building.location)[0];
                const longitude = JSON.parse(building.location)[1];
                return [latitude, longitude];
            });
            setPolygonCoords(initialPolygonCoords);
        }
    }, [chosenSiteBuildings]);


    const [updateLocation,setUpdateLocation]=useState(false);

    //!add building:

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
          setChosenSiteBuildings([...chosenSiteBuildings,newBuilding]);
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

    //!update building:
    const handleUpdateBuilding = async () => {

        try {
          setLoaderState(true); 
      
          const workspace_id  = buildingSite.workspace_id; 
          const building_id =  selectedRow.id; 
        //   alert(`http://127.0.0.1:8000/api/workspaces/${workspace_id}/buildings/${building_id}`);
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
            setChosenSiteBuildings(chosenSiteBuildings?.map((building) => {
              if (building.id === building_id) {
                return { ...building, ...selectedRow };
              }
              return building;
            }));
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
  

    // const firstBuildingLocation = (chosenSiteBuildings && chosenSiteBuildings.length > 0)
        // ? [JSON.parse(chosenSiteBuildings[0].location)[0],JSON.parse(chosenSiteBuildings[0].location)[1]]
        // : [33.908089, -5.578308];

        const [LoaderState,setLoaderState]=useState(false);
        const [notif,setNotif]=useState(false);
        const [buildingSite,setBuildingSite]=useState({});
        const [message,setMessage]=useState('');
      

        const emptyFields=()=>{
            setNewBuilding({name:null,location:null, activity:null,code:null,site_id:null,year_of_construction:null,level_count:null,address:null,surface:null,type:null});

        }

        const handleRowClick = (row) => {
            setSelectedRow(row);
            setBuildingSite(sites?.find((site)=>site.id===row.site_id));
            setOpen(true);
            setIsDirty(false);
        };

        const handleInputChange = (field, value) => {
            setSelectedRow((prevState) => ({
            ...prevState,
            [field]: value,
            }));
            setIsDirty(true);
        };

        const HandleDelete=(row)=>{
            setOpenDelete(true);
            setDeletedRow(row);
            setBuildingSite(sites?.find((site)=>site.id===row.site_id));
        }
        
        //!delete building:

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
                    setChosenSiteBuildings(chosenSiteBuildings?.filter((b)=>b.id!==deletedRow.id));
                    dispatch(sitesData(token)).then(()=>{
                        setAllSites(sites);
                    })
                } else {
                    console.error('Failed to delete the building:', result);
                    alert('Failed to delete the building.');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred while deleting the building.');
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
    const sitess = [...new Set(sites?.map((site) =>({name: site.name,id:site.id})))];
    
    return sitess.map((site) => ({
      label: `${site.id} - ${site.name}`,
      value: site.id,
    }));
  };
  const cascaderDataSites = formatCascaderDataSite(sites);

    return (
        <div>
            <div style={{ flex: 1, height: '80vh',marginTop:'20px' }}>
                <MapContainer center={[33.908089, -5.578308]} zoom={6} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {chosenSiteBuildings && chosenSiteBuildings?.length > 0 && (
                        chosenSiteBuildings?.map((loc, idx) => {
                            // const [latitude, longitude] = loc.location.slice(1, -1).split(',').map(coord => parseFloat(coord));
                            const latitudeLongitude = JSON.parse(loc.location);
                            let latitude=latitudeLongitude[0];
                            let longitude=latitudeLongitude[1];
                            return (
                                <Marker key={idx} position={[latitude, longitude]} icon={customIcon}>
                                    <Popup>
                                        Location: {latitude.toFixed(6)}, {longitude.toFixed(6)}<br />
                                        Address: {loc.address}
                                    </Popup>
                                </Marker>
                            );
                        })
                    )}
                    {checked && polygonCoords.length > 2 && (
                        <Polygon positions={polygonCoords} color="purple">
                            <Tooltip>Site</Tooltip>
                        </Polygon>
                    )}
                    {targetLocation && <MoveToLocation lat={targetLocation[0]} lon={targetLocation[1]} />}
                </MapContainer>
            </div>
            <div style={{ minHeight: '10vh',display:'flex',justifyContent:'center',alignItems:'center' }}>
                <Typography component="h3" endDecorator={
                    <Switch sx={{ ml: 1 }}
                        checked={checked}
                        onChange={(event) => setChecked(event.target.checked)}
                    />
                }>
                    {checked ? 'Hide' : 'Show'} site boundaries
                </Typography>
            </div>
            <div>
                <h3>Buildings Locations:</h3>
                <Breadcrumbs separator=">" aria-label="breadcrumbs" size="sm">
                {['sites',`${t('site')} ${siteName&&siteName}`,t('Buildings')].map((item) => (
                    <Link className='Link_breadcrumbs' key={item} color="neutral" href="#sizes">
                    <h5>
                    {item}
                    </h5>
                </Link>
                ))}
                </Breadcrumbs>
                <div className='title_image'>
                    <h2 id='title_H2'><SiTestrail style={{color:'rgb(3, 110, 74)'}}/><span> {t('Buildings')} </span></h2>
                    <img src="/assets/Buildings.svg" alt="bui_img" />
                </div>
                {
                    (message&&notif)&&(
                        <Notification style={{width:'100%',zIndex: 100000 }} showIcon type="success" color='success' closable>
                        <strong><FaCheck/></strong> {message && message}.
                        </Notification>
                    )
                }
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
                    />
                    </Grid>
                    <Grid xs={12} lg={2} sm={12} md={12}>
                    <Cascader
                        // data={data}
                        className='Cascader_comp'
                        placeholder="Site" 
                    />
                    </Grid>
                    <Grid xs={12} lg={2} sm={12} md={12}>
                    <Cascader
                        // data={data}
                        className='Cascader_comp'
                        placeholder="Building" 
                    />
                    </Grid>
                    <Grid xs={12} lg={2} sm={12} md={12}>
                    <Cascader
                        // data={data}
                        className='Cascader_comp'
                        placeholder="City (Department)" 
                    />
                    </Grid>
                    <Grid xs={12} lg={2} sm={12} md={12}>
                    <Cascader
                        // data={data}
                        className='Cascader_comp'
                        placeholder="Main usage" 
                    />
                    </Grid>
                    <Grid xs={12} lg={2} sm={12} md={12}>
                    <Button className='apply_Button'><IoFilter size={22}/>&nbsp;&nbsp;{t('filter')}</Button>
                    </Grid>
                </Grid>
                </div>
                <div className='Add_container'>
                  {
                    hasPermission(userInfo.permissions,'buildings','create')&&(
                      <Button className='add_Button' onClick={()=>setAddBuilding(true)}><MdAdd size={22}/>&nbsp;&nbsp;{t('addBuilding')}</Button>
                    )
                  }
                </div>
                <div className='table_container'>
                    <Table hoverRow sx={{ overflowX: 'scroll' }}>
                        <thead>
                        <tr>
                            <th>Code</th>
                            <th>Name</th>
                            <th>Activity</th>
                            <th>Address</th>
                            <th>Location</th>
                            <th>Construction Year</th>
                            <th>Surface</th>
                            <th>Type</th>
                            <th>Level Count</th>
                            {
                              hasPermission(userInfo.permission,'buildings','delete')&&(
                                <th>Action</th>
                              )
                            }
                        </tr>
                        </thead>
                        <tbody>
                    {
                        chosenSiteBuildings?.length>0?(
                            chosenSiteBuildings?.map((site, idx) => {
                                const latitudeLongitude = JSON.parse(site.location);
                                let latitude=latitudeLongitude[0];
                                let longitude=latitudeLongitude[1];
                                return (
                                    <tr key={site.code} onClick={()=>handleRowClick(site)} className='table_row'>
                                    <td>{site.code}</td>
                                    <td>{site.name}</td>
                                    <td>{site.activity}</td>
                                    <td>{site.address}</td>
                                    <td>{[latitude, longitude].join(',')}</td>
                                    <td>{site.year_of_construction}</td>
                                    <td>{site.surface}</td>
                                    <td>{site.type}</td>
                                    <td>{site.level_count}</td>
                                    {
                                      hasPermission(userInfo.permission,'buildings','delete')&&(
                                      <td className="locationList"
                                      key={idx} onClick={() => setTargetLocation([latitude, longitude])}
                                      style={{width:'100%'}}>
                                          <Button sx={{
                                              background:'linear-gradient(265deg, rgba(5,127,83,1) 0%, rgba(95,5,138,1) 100%)',
                                              zIndex:999
                                              }}
                                              onClick={(e)=>{
                                              e.stopPropagation();
                                              HandleDelete(site)
                                              }}
                                              >
                                              <MdDelete size={22}/>
                                          </Button>
                                      </td>
                                      )
                                    }
                                    </tr>
                                )})
                        ):
                    (
                            <tr >
                                <td>No buildings found</td>
                            </tr>
                        )
                        }
                </tbody>
                </Table>
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
                            total={100}
                            limit={10}
                            activePage={activePage}
                            onChangePage={setActivePage}
                        />
                    </div>
                </div>
            </div>
            <div>

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
                      disabled={hasPermission(userInfo.permission,'buildings','update')}
                      defaultValue={selectedRow?.name || ''}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={6} sm={12}>
                    <span>Code</span><br />
                    <Input
                      disabled={hasPermission(userInfo.permission,'buildings','update')}
                      defaultValue={selectedRow?.code || ''}
                      onChange={(e) => handleInputChange('code', e.target.value)}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={6} sm={12}>
                    <span>Parent Site</span><br />
                    <Cascader
                      disabled={hasPermission(userInfo.permission,'buildings','update')}
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
                    <span>Correlation Code</span><br />
                    <Input
                      disabled={hasPermission(userInfo.permission,'buildings','update')}
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
                      disabled={hasPermission(userInfo.permission,'buildings','update')}
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
                      disabled={hasPermission(userInfo.permission,'buildings','update')}
                      readOnly
                      defaultValue={buildingSite?.country || ''}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={6} sm={12}>
                    <span>Zipcode</span><br />
                    <Input
                      disabled={hasPermission(userInfo.permission,'buildings','update')}
                    readOnly
                      defaultValue={buildingSite?.zipcode || ''}
                      onChange={(e) => handleInputChange('zipcode', e.target.value)}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={6} sm={12}>
                    <span>Region/State</span><br />
                    <Input
                      disabled={hasPermission(userInfo.permission,'buildings','update')}
                    readOnly
                      placeholder="Region/State"
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={6} sm={12}>
                    <span>City</span><br />
                    <Input
                      disabled={hasPermission(userInfo.permission,'buildings','update')}
                    readOnly
                      defaultValue={buildingSite?.city || ''}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={6} sm={12}>
                    <span>Department</span><br />
                    <Input
                      disabled={hasPermission(userInfo.permission,'buildings','update')}
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
                      disabled={hasPermission(userInfo.permission,'buildings','update')}
                      defaultValue={selectedRow?.level_count || ''}
                      variant="outlined"
                      onChange={(e) => handleInputChange('level_count', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={6} sm={12}>
                    <span>Construction year </span><br />
                    <Input
                      disabled={hasPermission(userInfo.permission,'buildings','update')}
                      defaultValue={selectedRow?.year_of_construction || ''}
                      variant="outlined"
                      type="number"
                      onChange={(e) => handleInputChange('year_of_construction', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={6} sm={12}>
                    <span>Floor area (m²)</span><br />
                    <Input
                      disabled={hasPermission(userInfo.permission,'buildings','update')}
                      defaultValue={selectedRow?.surface || ''}
                      variant="outlined"
                      endDecorator={<Button sx={{height:'100%',marginRight:'-12px',background:'linear-gradient(124deg, rgba(7,28,75,1) 0%, rgba(9,100,60,1) 100%)'}}>m²</Button>}
                      onChange={(e) => handleInputChange('surface', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={6} sm={12}>
                    <span>Activity</span><br />
                    <Input
                      disabled={hasPermission(userInfo.permission,'buildings','update')}
                      defaultValue={selectedRow?.activity || ''}
                      variant="outlined"
                      onChange={(e) => handleInputChange('activity', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={12} lg={12} sm={12}>
                    <span>Comment</span><br />
                    <Input
                      disabled={hasPermission(userInfo.permission,'buildings','update')}
                      variant="outlined"
                      placeholder='Comment'
                    />
                  </Grid>
                  <Grid item xs={12} md={12} lg={12} sm={12}>
                    <span>Location</span><br />
                    <Input
                      disabled={hasPermission(userInfo.permission,'buildings','update')}
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
              <Modal open={openDelete} onClose={() => setOpenDelete(false)}>
                  <ModalDialog variant="outlined" role="alertdialog">
                  <DialogTitle>
                      <WarningRoundedIcon />
                      Confirmation
                  </DialogTitle>
                  <Divider />
                  <DialogContent>
                      Are you sure you want to delete {deletedRow?.name} ?
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

        {/*add site buildings map */}
        <Modal
          aria-labelledby="modal-title"
          aria-describedby="modal-desc"
          open={openMapModalAddBuilding}
          onClose={() => setOpenMapModalAddBuilding(false)}
          sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
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
              {chosenSiteBuildings?.name}
            </Typography>
            <Typography level='div' id="modal-desc" textColor="text.tertiary">
              <AddSiteBuildings/>
            </Typography>
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
                  <div>
                    <ModalClose variant="plain" sx={{ m: 1 }} />
                    <LoaderComponent/>
                  </div>
                  
              </Modal>
            </div>            
        </div>
    );
}
