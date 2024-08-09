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


import { Cascader, CheckPicker } from 'rsuite';
import Grid from '@mui/joy/Grid';
import Table from '@mui/joy/Table';

import { Pagination } from 'rsuite';
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

import { workspacesData,sitesData ,buildingsData,activitiesData} from '../features/SuperAdminSlice';
import { useDispatch,useSelector } from 'react-redux';

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



export default function Site({sites}) {
  const [activePage, setActivePage] = useState(1);
  const [open, setOpen] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [addSite, setAddSite] = React.useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isDirty, setIsDirty] = useState(false);

  const [newSite,setNewSite]=useState({Name:'',Activity:'',Code:'',Correlation_Code:'',Address:'',Country:'',Zipcode:'',Region_State:'',City:'',Department:'',Floor_ares:''});
  const [deletedRow,setDeletedRow]=useState({});

  const navigate=useNavigate();
  const {t}=useTranslation();

  
    const dispatch = useDispatch();
    // const { sites, statusSites , errorSites } = useSelector((state) => state.sites);
    const { buildings, statusBuildings , errorBuildings } = useSelector((state) => state.buildings);
    const token=localStorage.getItem('token');

    useEffect(()=>{
        // dispatch(sitesData(token));
        dispatch(buildingsData(token));
    },[dispatch]);

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
    setNewSite({Name:'',Activity:'',Code:'',Correlation_Code:'',Address:'',Country:'',Zipcode:'',Region_State:'',City:'',Department:'',Floor_ares:''});
  }

  const HandleDelete=(row)=>{
    setOpenDelete(true);
    setDeletedRow(row);
  }

  const cascaderDataCities = formatCascaderData(sites);
  const cascaderDataSites = formatCascaderDataSite(sites);

  const [openMapModal,setOpenMapModal]=useState(false);
  const [openMapModalAddBuilding,setOpenMapModalAddBuilding]=useState(false);

  const [chosenSiteBuildings,setChosenSiteBuildings]=useState([]);

  const HandleShowBuildings=(row)=>{
      setChosenSiteBuildings(buildings.buildings.filter((building)=>building.site_id===row.id));
      setOpenMapModal(true);
  }

  return (
    <div>
      
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
          <div className='Add_container'>
            <Button className='add_Button' onClick={()=>setAddSite(true)}><MdAdd size={22}/>&nbsp;&nbsp;{t('addSite')}</Button>
          </div>
          <div className='table_container'>
            <Table hoverRow 
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
                  <th>Action</th>
                  <th>Site Buildings</th>
                </tr>
              </thead>
              <tbody>
              {sites&&sites.map((row) => (
                <tr key={row.code} onClick={()=>handleRowClick(row)} className='table_row'>
                  <td>{row.code}</td>
                  <td>{row.name}</td>
                  <td>{row.activity}</td>
                  <td>{row.address}</td>
                  <td>{row.zipcode}</td>
                  <td>{row.city}</td>
                  <td>{row.country}</td>
                  <td>{row.floor_area}</td>
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
                  <td>
                    <Button sx={{
                      background:'linear-gradient(265deg, rgba(5,127,83,1) 0%, rgba(95,5,138,1) 100%)',
                      zIndex:10000
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
              ))}
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
              total={100}
              limit={10}
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
                    value={selectedRow?.name || ''}
                    onChange={(e) => handleInputChange('Name', e.target.value)}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={4} lg={6} sm={12}>
                  <span>Activity</span><br />
                  <Input
                    value={selectedRow?.activity || ''}
                    onChange={(e) => handleInputChange('Activity', e.target.value)}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={4} lg={6} sm={12}>
                  <span>Code</span><br />
                  <Input
                    value={selectedRow?.code || ''}
                    onChange={(e) => handleInputChange('Code', e.target.value)}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={8} lg={6} sm={12}>
                  <span>Correlation Code</span><br />
                  <Input
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
                    value={selectedRow?.address || ''}
                    onChange={(e) => handleInputChange('Address', e.target.value)}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={4} lg={6} sm={12}>
                  <span>Country</span><br />
                  <Input
                    value={selectedRow?.country || ''}
                    onChange={(e) => handleInputChange('Country', e.target.value)}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={4} lg={6} sm={12}>
                  <span>Zipcode</span><br />
                  <Input
                    value={selectedRow?.zipcode || ''}
                    onChange={(e) => handleInputChange('ZipCode', e.target.value)}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={8} lg={6} sm={12}>
                  <span>Region/State</span><br />
                  <Input
                    placeholder="Region/State"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={8} lg={6} sm={12}>
                  <span>City</span><br />
                  <Input
                    value={selectedRow?.city || ''}
                    onChange={(e) => handleInputChange('City', e.target.value)}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={8} lg={6} sm={12}>
                  <span>Department</span><br />
                  <Input
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
                    value={selectedRow?.floor_area || ''}
                    onChange={(e) => handleInputChange('Floor_ares', e.target.value)}
                    variant="outlined"
                  />
                </Grid>
              </Grid>
            </div>
            {
              isDirty&&(
                <div className='action_buttons_validate_cancel'>
                  <Button className='cancelBtn' startDecorator={<MdCancel />} onClick={() => setOpen(false)}>Cancel</Button>
                  <Button className='checkBtn' startDecorator={<FaCheck />}>Validate</Button>
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
                    onChange={(e) => setNewSite({Name:e.target.value})}
                    variant="outlined"
                    placeholder='Name'
                  />
                </Grid>
                <Grid item xs={12} md={4} lg={6} sm={12}>
                  <span>Activity</span><br />
                  <Input
                    onChange={(e) => setNewSite({Activity:e.target.value})}
                    variant="outlined"
                    placeholder='Activity'
                  />
                </Grid>
                <Grid item xs={12} md={4} lg={6} sm={12}>
                  <span>Code</span><br />
                  <Input
                    onChange={(e) => setNewSite({Code:e.target.value})}
                    variant="outlined"
                    placeholder='Code'
                  />
                </Grid>
                <Grid item xs={12} md={8} lg={6} sm={12}>
                  <span>Correlation Code</span><br />
                  <Input
                    onChange={(e) => setNewSite({Correlation_Code:e.target.value})}
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
                    onChange={(e) => setNewSite({Address:e.target.value})}
                    variant="outlined"
                    placeholder='Address'
                  />
                </Grid>
                <Grid item xs={12} md={4} lg={6} sm={12}>
                  <span>Country</span><br />
                  <Input
                    onChange={(e) => setNewSite({Country:e.target.value})}
                    variant="outlined"
                    placeholder='Country'
                  />
                </Grid>
                <Grid item xs={12} md={4} lg={6} sm={12}>
                  <span>Zipcode</span><br />
                  <Input
                    onChange={(e) => setNewSite({Zipcode:e.target.value})}
                    variant="outlined"
                    placeholder='Zipcode'
                  />
                </Grid>
                <Grid item xs={12} md={8} lg={6} sm={12}>
                  <span>Region/State</span><br />
                  <Input
                    onChange={(e) => setNewSite({Region_State:e.target.value})}
                    placeholder="Region/State"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={8} lg={6} sm={12}>
                  <span>City</span><br />
                  <Input
                    placeholder="City"
                    onChange={(e) => setNewSite({City:e.target.value})}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={8} lg={6} sm={12}>
                  <span>Department</span><br />
                  <Input
                    onChange={(e) => setNewSite({Department:e.target.value})}
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
                    onChange={(e) => setNewSite({Floor_ares:e.target.value})}
                    variant="outlined"
                    placeholder='Floor area'
                  />
                </Grid>
              </Grid>
              <h4>Add location</h4>
              <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                <Grid item xs={12} md={12} lg={12} sm={12}>
                  <span>Choose the location of the site</span><br />
                  <Button className='cancelBtn' startDecorator={<FaLocationDot/>}
                  onClick={()=>setOpenMapModalAddBuilding(true)}
                  >ADD LOCATION</Button>
                </Grid>
              </Grid>
            </div>
              <div className='action_buttons_validate_cancel'>
                <Button className='cancelBtn' startDecorator={<MdCancel />} onClick={emptyFields}>Cancel</Button>
                <Button className='checkBtn' startDecorator={<FaCheck />}>Validate</Button>
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
            Are you sure you want to delete {deletedRow?.Name} ?
          </DialogContent>
          <DialogActions>
            <Button variant="solid" color="danger" onClick={() =>{ setOpenDelete(false);setDeletedRow({})}}>
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
            <SiteBuildingsMap chosenSiteBuildings={chosenSiteBuildings}/>
          </Typography>
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
    </div>
  )
}
