import React,{useState, useEffect} from 'react';
import '../styles/Site.css';
import Breadcrumbs from '@mui/joy/Breadcrumbs';
import Link from '@mui/joy/Link';
import Sheet from '@mui/joy/Sheet';
import Button from '@mui/joy/Button';
import Input from '@mui/joy/Input';
// import { styled } from '@mui/joy/styles';

import { SiTestrail } from "react-icons/si";
import { BsEye, BsLayersFill } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import { IoFilter } from "react-icons/io5";
import { MdAdd } from "react-icons/md";


import { Cascader, CheckPicker,Badge } from 'rsuite';
import Grid from '@mui/joy/Grid';
import Table from '@mui/joy/Table';

import { Pagination ,Notification, Loader} from 'rsuite';
import { Divider } from '@mui/joy';
import { IoIosInformationCircle } from "react-icons/io";
import { FaSitemap } from "react-icons/fa6";
import Modal from '@mui/joy/Modal';
import ModalClose from '@mui/joy/ModalClose';
import Typography from '@mui/joy/Typography';
import { FaCheck } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { IoMdCreate } from "react-icons/io";
import { FaLocationDot } from "react-icons/fa6";

import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import DialogActions from '@mui/joy/DialogActions';
import ModalDialog from '@mui/joy/ModalDialog';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import { useNavigate } from 'react-router-dom';
import SiteBuildingsMap from './SiteBuildingsMap';
import AddSiteBuildings from './AddSiteBuildings';
import { useTranslation } from 'react-i18next';

import { deleteSite,buildingsData,addSiteAsync,updateSite} from '../features/SuperAdminSlice';
import { useDispatch,useSelector } from 'react-redux';
import {workspacesData, projectsData } from '../features/SuperAdminSlice';
import { fetchUsersData } from '../features/UserSlice';
import LoaderComponent from './LoaderComponent';
import { hasPermission } from '../components/CheckPermissions';

const formatCascaderData = (sites) => {
  const cities = [...new Set(sites.map((site) => site.city))];
  
  return cities.map((city) => ({
    label: city,
    value: city,
  }));
};

const formatCascaderDataSite = (sites) => {
  const sitess = [...new Set(sites.map((site) =>({name: site.name,code:site.code})))];
  
  return sitess.map((site) => ({
    label: `${site.code} - ${site.name}`,
    value: site.code,
  }));
};






export default function Site({setChosenWorkspaceSites,workspace,projects}) {


  const [activePage, setActivePage] = useState(1);
  const [itemsPerPage] = useState(10);
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const [open, setOpen] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [addSite, setAddSite] = React.useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isDirty, setIsDirty] = useState(false);

  const [newSite,setNewSite]=useState({Name:'',Activity:'',Code:'',Correlation_Code:'',Address:'',Country:'',Zipcode:'',Region_State:'',City:'',Department:'',Floor_area:''});
  const [deletedRow,setDeletedRow]=useState({});
  const [allSites,setAllSites]=useState([]);

  const { buildings, statusBuildings , errorBuildings } = useSelector((state) => state.buildings);
  const { workspaces, statusWorkspaces , errorWorkspaces } = useSelector((state) => state.workspaces);
  const { messageSiteDelete, statusSiteDelete , errorSiteDelete } = useSelector((state) => state.deleteSiteRe);
  const {messageAddSite,statusAddSite,errorAddSite}=useSelector((state) => state.addSiteRe);
  const {messageUpdateSite,statusUpdateSite,errorUpdateSite}=useSelector((state) => state.updateSiteRe);

  const token=localStorage.getItem('token');
  const userInfo=JSON.parse(localStorage.getItem('user'));
  const dispatch = useDispatch();

  
  useEffect(()=>{
    dispatch(workspacesData(token)).then(()=>{
      setAllSites(workspaces.find(w=>w.id===workspace.id).sites);
    })
  },[statusUpdateSite])



  const navigate=useNavigate();
  const {t}=useTranslation();

  
  // const { sites, statusSites , errorSites } = useSelector((state) => state.sites);

    
    
    useEffect(()=>{
        // dispatch(sitesData(token));
        dispatch(buildingsData(token));
    },[]); 

  const handleRowClick = (row) => {
    setSelectedRow(row);
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

  const emptyFields=()=>{
    setNewSite({Name:'',Activity:'',Code:'',Correlation_Code:'',Address:'',Country:'',Zipcode:'',Region_State:'',City:'',Department:'',Floor_area:''});
  }

  const HandleDelete=(row)=>{
    setOpenDelete(true);
    setDeletedRow(row);
  }

  const handleInputsAddChange = (field, value) => {
    setNewSite((prevState) => ({
      ...prevState,
      [field]: value,
    }));
    // setIsDirty(true);
  };


  const cascaderDataCities = formatCascaderData(allSites);
  const cascaderDataSites = formatCascaderDataSite(allSites);

  const [openMapModal,setOpenMapModal]=useState(false);
  const [openMapModalAddBuilding,setOpenMapModalAddBuilding]=useState(false);

  const [LoaderState,setLoaderState]=useState(false);

  const [chosenSiteBuildings,setChosenSiteBuildings]=useState([]);

  const HandleShowBuildings=(row)=>{
      setChosenSiteBuildings(buildings?.buildings?.filter((building)=>building.site_id===row.id));
      setOpenMapModal(true);
  }


  const handleAddSite = async () => {
    setLoaderState(true);
    const result = await Promise.resolve(dispatch(addSiteAsync({ token, newSite, workspace: workspace.id })));
    if (result.meta.requestStatus === 'fulfilled') {
      const updatedWorkspaces = await dispatch(workspacesData(token));
      setAllSites(updatedWorkspaces.payload.find(w => w.id === workspace.id).sites);
    }
    setAddSite(false);
  };
  
  const handleUpdateSite = async () => {
    setLoaderState(true);
    const result = await Promise.resolve(dispatch(updateSite({ updatedSite: selectedRow, token })));
    if (result.meta.requestStatus === 'fulfilled') {
      const updatedWorkspaces = await dispatch(workspacesData(token));
      setAllSites(updatedWorkspaces.payload.find(w => w.id === workspace.id).sites);
    }
    setOpen(false);
  };
  
  const confirmDelete=async() =>{ 
    setLoaderState(true);
    const result = await Promise.resolve(dispatch(deleteSite({token,id:deletedRow.id})));
    if (result.meta.requestStatus === 'fulfilled') {
      const updatedWorkspaces = await dispatch(workspacesData(token));
      setAllSites(updatedWorkspaces.payload.find(w => w.id === workspace.id).sites);
      setDeletedRow({});
      setOpenDelete(false);
    }
  }
  
  useEffect(()=>{
    const intervalLoader=setTimeout(() => {
      setLoaderState(false);
    }, 4000);
    return ()=>clearTimeout(intervalLoader);
  },[LoaderState]);

  return (
    <div>
        {
          statusSiteDelete==="succeeded"&&(
              <Notification style={{width:'100%',zIndex: 100000 }} showIcon type="success" color='success' closable>
                <strong><FaCheck/></strong> {messageSiteDelete && messageSiteDelete}.
              </Notification>
          )
        }
        {
          statusAddSite==="succeeded"&&(
              <Notification style={{width:'100%',zIndex: 100000 }} showIcon type="success" color='success' closable>
                <strong><FaCheck/></strong> {messageAddSite && messageAddSite}.
              </Notification>
          )
        }
        {
          statusUpdateSite==="succeeded"&&(
              <Notification style={{width:'100%',zIndex: 100000 }} showIcon type="success" color='success' closable>
                <strong><FaCheck/></strong> {messageUpdateSite && messageUpdateSite}.
              </Notification>
          )
        }
        <div>
          <div className='title_image'>
            <h2 id='title_H2'><SiTestrail style={{color:'rgb(3, 110, 74)'}}/><span> {t('sites')} </span></h2>
            <img src="/assets/Sites.svg" alt="sites_img" />
          </div>
          <Sheet variant="soft" color="neutral" sx={{ marginTop:'10px',p: 4,borderRadius:'5px',boxShadow:'0 0 5px rgba(176, 175, 175, 0.786)' }}>
            
            <div className='action_bottons'>
              <h6><BsLayersFill size={22}/>&nbsp;&nbsp;<span>Current</span></h6>
              <h6><MdDelete size={22}/>&nbsp;&nbsp;<span>Recently deleted</span></h6>
            </div>
            
            <div className='Cascader_container'>
              <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                <Grid xs={12} lg={3.33} sm={12} md={12}>
                  <Cascader
                      // data={data}
                      menuStyle={{ zIndex: 1400 }}
                      className='Cascader_comp'
                      placeholder="Project" 
                  />
                </Grid>
                <Grid xs={12} lg={3.33} sm={12} md={12}>
                  <CheckPicker labelKey='label' placeholder={t('site')} placement='bottom' menuStyle={{ zIndex: 1400 }}  data={cascaderDataSites} className='Cascader_comp'/>
                </Grid>
                <Grid xs={12} lg={3.33} sm={12} md={12}>
                  <CheckPicker labelKey='label' placeholder={t('city')} placement='bottom' menuStyle={{ zIndex: 1400 }}  data={cascaderDataCities} className='Cascader_comp'/>
                </Grid>
                <Grid xs={12} lg={2} sm={12} md={12}>
                  <Button className='apply_Button'><IoFilter size={22}/>&nbsp;&nbsp;{t('filter')}</Button>
                </Grid>
              </Grid>
            </div>
            {
              hasPermission(userInfo.permission,'sites','create')&&(
                <div className='Add_container'>
                  <Button className='add_Button' onClick={()=>setAddSite(true)}><MdAdd size={22}/>&nbsp;&nbsp;{t('addSite')}</Button>
                </div>
              )
            }
            <div className='table_container'>
              <Table 
              // key={JSON.stringify(allSites)}
              hoverRow 
              sx={{
                overflowX:'scroll'
              }}>
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Name</th>
                    <th>Activity</th>
                    <th style={{width:'20%'}}>Address</th>
                    <th>ZipCode</th>
                    <th>City</th>
                    <th>Country</th>
                    <th>Floor area</th>
                    {
                      hasPermission(userInfo.permissions, 'sites', 'delete')&&(
                        <th>Action</th>
                      )
                    }
                    {
                      hasPermission(userInfo.permissions, 'buildings', 'read')&&(
                        <th>Site Buildings</th>
                      )
                    }
                  </tr>
                </thead>
                <tbody>
                {
                allSites&&allSites.length>0?(
                  allSites.slice(startIndex, endIndex).map((row) => (
                    <tr key={row.code} onClick={()=>handleRowClick(row)} className='table_row'>
                      <td>{row.code}</td>
                      <td>{row.name}</td>
                      <td>{row.activity}</td>
                      <td>{row.address}</td>
                      <td>{row.zipcode}</td>
                      <td>{row.city}</td>
                      <td>{row.country}</td>
                      <td>{row.floor_area}</td>
                      {
                        hasPermission(userInfo.permissions, 'sites', 'delete')&&(
                          <td>
                            <Button sx={{
                              background:'linear-gradient(265deg, rgba(5,127,83,1) 0%, rgba(95,5,138,1) 100%)',
                              zIndex:10000
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
                      {
                        hasPermission(userInfo.permissions, 'buildings', 'read')&&(
                          <td>
                            <Badge style={{zIndex:1011}} content={row.buildings?.length>0?row.buildings?.length:'0'}>
                              <Button sx={{
                                background:'linear-gradient(265deg, rgba(5,127,83,1) 0%, rgba(95,5,138,1) 100%)',
                                // zIndex:10000
                              }}
                              onClick={(e)=>{
                                e.stopPropagation();
                                HandleShowBuildings(row)
                              }}
                              >
                                <BsEye size={22}/>
                              </Button>
                            </Badge>
                          </td>
                        )
                      }
                    </tr>
                  ))
                )  
                :
                (
                  <div style={{width:'100%',display:'flex',justifyContent:'center',alignItems:'center',height:'10vh',fontSize:'1.2rem'}}>
                    <Loader content="Loading..." style={{width:'fit-content'}}/>
                  </div>
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
                total={allSites?.length}
                limit={itemsPerPage}
                activePage={activePage}
                onChangePage={setActivePage}
              />
            </div>
          </Sheet>
        </div>

        {/* Modal site information's */}
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
                Site {selectedRow!==null&&selectedRow.name}
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
                  <Grid item xs={12} md={8} lg={6} sm={12}>
                    <span>Name</span><br />
                    <Input
                      disabled={hasPermission(userInfo.permission,'sites','update')}
                      defaultValue={selectedRow?.name || ''}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} md={4} lg={6} sm={12}>
                    <span>Activity</span><br />
                    <Input
                      disabled={hasPermission(userInfo.permission,'sites','update')}
                      defaultValue={selectedRow?.activity || ''}
                      onChange={(e) => handleInputChange('activity', e.target.value)}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} md={4} lg={6} sm={12}>
                    <span>Code</span><br />
                    <Input
                      disabled={hasPermission(userInfo.permission,'sites','update')}
                      defaultValue={selectedRow?.code || ''}
                      onChange={(e) => handleInputChange('code', e.target.value)}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} md={8} lg={6} sm={12}>
                    <span>Correlation Code</span><br />
                    <Input
                      disabled={hasPermission(userInfo.permission,'sites','update')}
                      placeholder="Correlation Code"
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
                <h4>Address</h4>
                <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                  <Grid item xs={12} md={8} lg={6} sm={12}>
                    <span>Address</span><br />
                    <Input
                      disabled={hasPermission(userInfo.permission,'sites','update')}
                      defaultValue={selectedRow?.address || ''}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} md={4} lg={6} sm={12}>
                    <span>Country</span><br />
                    <Input
                      disabled={hasPermission(userInfo.permission,'sites','update')}
                      defaultValue={selectedRow?.country || ''}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} md={4} lg={6} sm={12}>
                    <span>Zipcode</span><br />
                    <Input
                      disabled={hasPermission(userInfo.permission,'sites','update')}
                      defaultValue={selectedRow?.zipcode || ''}
                      onChange={(e) => handleInputChange('zipcode', e.target.value)}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} md={8} lg={6} sm={12}>
                    <span>Region/State</span><br />
                    <Input
                      disabled={hasPermission(userInfo.permission,'sites','update')}
                      placeholder="Region/State"
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} md={8} lg={6} sm={12}>
                    <span>City</span><br />
                    <Input
                      disabled={hasPermission(userInfo.permission,'sites','update')}
                      defaultValue={selectedRow?.city || ''}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} md={8} lg={6} sm={12}>
                    <span>Department</span><br />
                    <Input
                      disabled={hasPermission(userInfo.permission,'sites','update')}
                      placeholder="Department"
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
                <h4>Characteristics</h4>
                <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                  <Grid item xs={12} md={12} lg={12} sm={12}>
                    <span>Floor area </span><br />
                    <Input
                      disabled={hasPermission(userInfo.permission,'sites','update')}
                      defaultValue={selectedRow?.floor_area || ''}
                      onChange={(e) => handleInputChange('floor_area', e.target.value)}
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
              </div>
              {
                isDirty&&(
                  <div className='action_buttons_validate_cancel'>
                    <Button className='cancelBtn' startDecorator={<MdCancel />} onClick={() => setOpen(false)}>Cancel</Button>
                    <Button className='checkBtn' startDecorator={<FaCheck />} onClick={handleUpdateSite}>Validate</Button>
                  </div>
                )
              }
            </div>
          </Sheet>
        </Modal>

        {/* Modal add site */}
        <Modal
          aria-labelledby="modal-title"
          aria-describedby="modal-desc"
          open={addSite}
          onClose={() => setAddSite(false)}
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
                Create Site
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
                  <Grid item xs={12} md={8} lg={6} sm={12}>
                    <span>Name</span><br />
                    <Input
                      onChange={(e) => handleInputsAddChange('Name', e.target.value)}
                      variant="outlined"
                      placeholder='Name'
                    />
                  </Grid>
                  <Grid item xs={12} md={4} lg={6} sm={12}>
                    <span>Activity</span><br />
                    <Input
                      onChange={(e) => handleInputsAddChange('Activity', e.target.value)}
                      variant="outlined"
                      placeholder='Activity'
                    />
                  </Grid>
                  <Grid item xs={12} md={4} lg={6} sm={12}>
                    <span>Code</span><br />
                    <Input
                      onChange={(e) => handleInputsAddChange('Code', e.target.value)}
                      variant="outlined"
                      placeholder='Code'
                    />
                  </Grid>
                  <Grid item xs={12} md={8} lg={6} sm={12}>
                    <span>Correlation Code</span><br />
                    <Input
                      onChange={(e) => handleInputsAddChange('Correlation_Code', e.target.value)}
                      placeholder="Correlation Code"
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
                <h4>Address</h4>
                <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                  <Grid item xs={12} md={8} lg={6} sm={12}>
                    <span>Address</span><br />
                    <Input
                      onChange={(e) => handleInputsAddChange('Address', e.target.value)}
                      variant="outlined"
                      placeholder='Address'
                    />
                  </Grid>
                  <Grid item xs={12} md={4} lg={6} sm={12}>
                    <span>Country</span><br />
                    <Input
                      onChange={(e) => handleInputsAddChange('Country', e.target.value)}
                      variant="outlined"
                      placeholder='Country'
                    />
                  </Grid>
                  <Grid item xs={12} md={4} lg={6} sm={12}>
                    <span>Zipcode</span><br />
                    <Input
                      onChange={(e) => handleInputsAddChange('Zipcode', e.target.value)}
                      variant="outlined"
                      placeholder='Zipcode'
                    />
                  </Grid>
                  <Grid item xs={12} md={8} lg={6} sm={12}>
                    <span>Region/State</span><br />
                    <Input
                      onChange={(e) => handleInputsAddChange('Region_State', e.target.value)}
                      placeholder="Region/State"
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} md={8} lg={6} sm={12}>
                    <span>City</span><br />
                    <Input
                      placeholder="City"
                      onChange={(e) => handleInputsAddChange('City', e.target.value)}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} md={8} lg={6} sm={12}>
                    <span>Department</span><br />
                    <Input
                      onChange={(e) => handleInputsAddChange('Department', e.target.value)}
                      placeholder="Department"
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
                <h4>Characteristics</h4>
                <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                  <Grid item xs={12} md={12} lg={12} sm={12}>
                    <span>Floor area </span><br />
                    <Input
                      onChange={(e) => handleInputsAddChange('Floor_area', e.target.value)}
                      variant="outlined"
                      placeholder='Floor area'
                    />
                  </Grid>
                </Grid>
                {/* <h4>Add location</h4>
                <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                  <Grid item xs={12} md={12} lg={12} sm={12}>
                    <span>Choose the location of the site</span><br />
                    <Button className='cancelBtn' startDecorator={<FaLocationDot/>}
                    onClick={()=>setOpenMapModalAddBuilding(true)}
                    >ADD LOCATION</Button>
                  </Grid>
                </Grid> */}
              </div>
                <div className='action_buttons_validate_cancel'>
                  <Button className='cancelBtn' startDecorator={<MdCancel />} onClick={emptyFields}>Cancel</Button>
                  <Button className='checkBtn' onClick={handleAddSite} startDecorator={<FaCheck />}>Validate</Button>
                </div>
            </div>
          </Sheet>
        </Modal>

        {/* Modal delete site */}
        <Modal open={openDelete} onClose={() => setOpenDelete(false)}>
          <ModalDialog variant="outlined" role="alertdialog" sx={{width:'40%'}}>
            <DialogTitle>
              <WarningRoundedIcon />
              Confirmation
            </DialogTitle>
            <Divider />
            <DialogContent>
              Are you sure you want to delete site <strong>{deletedRow?.name}</strong> ?
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

        {/*render site buildings map */}
        <Modal
          aria-labelledby="modal-title"
          aria-describedby="modal-desc"
          open={openMapModal}
          onClose={() => setOpenMapModal(false)}
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
            {chosenSiteBuildings ? (
              <>
                <Typography
                  component="h2"
                  id="modal-title"
                  level="h4"
                  textColor="inherit"
                  fontWeight="lg"
                  mb={1}
                  sx={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  {chosenSiteBuildings?.name}
                </Typography>
                <Typography level="div" id="modal-desc" textColor="text.tertiary">
                  <SiteBuildingsMap setAllSites={setAllSites} siteName={chosenSiteBuildings?.name} chosenSiteBuildings={chosenSiteBuildings} setChosenSiteBuildings={setChosenSiteBuildings}/>
                </Typography>
              </>
            ) : (
              <Typography>No site buildings selected</Typography>
            )}
          </Sheet>
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
            <LoaderComponent/>
          </Sheet>
        </Modal>
        
    </div>
  )
}
