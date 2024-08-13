import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon, Tooltip ,useMap} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';
import { Button, Switch,Grid } from '@mui/joy';
import Typography from '@mui/joy/Typography';

import { SiTestrail } from 'react-icons/si'
import Breadcrumbs from '@mui/joy/Breadcrumbs';
import Link from '@mui/joy/Link';

import { BsLayersFill } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import { IoFilter } from "react-icons/io5";
import { MdAdd } from "react-icons/md";

import { Cascader } from 'rsuite';
import Table from '@mui/joy/Table';

import { Pagination } from 'rsuite';
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

export default function SiteBuildingsMap({ siteName , chosenSiteBuildings }) {

    const [polygonCoords, setPolygonCoords] = useState([]);
    const [customIcon, setCustomIcon] = useState(createCustomIcon());
    const [checked, setChecked] = useState(false);
    const [targetLocation, setTargetLocation] = useState(null);

    const [activePage, setActivePage] = React.useState(1);
    const [open, setOpen] = React.useState(false);
    const [addBuilding, setAddBuilding] = React.useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [isDirty, setIsDirty] = useState(false);
    const [newBuilding,setNewBuilding]=useState({Name:'',Activity:'',Code:'',Site:'',ConstructionYear:'',LevelCount:'',Correlation_Code:'',Address:'',Country:'',Zipcode:'',Region_State:'',City:'',Department:'',Floor_ares:'',Comment:''});
    const [openDelete, setOpenDelete] = React.useState(false);
    const [deletedRow,setDeletedRow]=useState({});
    const {t}=useTranslation();
    
    useEffect(() => {
        const icon = createCustomIcon();
        setCustomIcon(icon);
    }, []);
    
    useEffect(() => {
        if (chosenSiteBuildings && chosenSiteBuildings.length > 0) {
            const initialPolygonCoords = chosenSiteBuildings.map(building => {
                const [latitude, longitude] = building.location.slice(1, -1).split(',').map(coord => parseFloat(coord));
                return [latitude, longitude];
            });
            setPolygonCoords(initialPolygonCoords);
        }
    }, [chosenSiteBuildings]);

    const firstBuildingLocation = (chosenSiteBuildings && chosenSiteBuildings.length > 0)
        ? chosenSiteBuildings[0].location.slice(1, -1).split(',').map(coord => parseFloat(coord))
        : [33.908089, -5.578308];

        

        const emptyFields=()=>{
            setNewBuilding({Name:'',Activity:'',Code:'',Site:'',ConstructionYear:'',LevelCount:'',Correlation_Code:'',Address:'',Country:'',Zipcode:'',Region_State:'',City:'',Department:'',Floor_ares:'',Comment:''});
        }

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
        
        const HandleDelete=(row)=>{
            setOpenDelete(true);
            setDeletedRow(row);
        }

    return (
        <div>
            <div style={{ flex: 1, height: '80vh',marginTop:'20px' }}>
                <MapContainer center={firstBuildingLocation} zoom={6} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {chosenSiteBuildings && chosenSiteBuildings.length > 0 && (
                        chosenSiteBuildings.map((loc, idx) => {
                            const [latitude, longitude] = loc.location.slice(1, -1).split(',').map(coord => parseFloat(coord));
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
                    <Button className='apply_Button'><IoFilter size={22}/>&nbsp;&nbsp;Apply filter</Button>
                    </Grid>
                </Grid>
                </div>
                <div className='Add_container'>
                <Button className='add_Button' onClick={()=>setAddBuilding(true)}><MdAdd size={22}/>&nbsp;&nbsp;Add building</Button>
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
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                    {
                        chosenSiteBuildings.length>0?(
                            chosenSiteBuildings.map((site, idx) => {
                                const [latitude, longitude] = site.location.slice(1, -1).split(',').map(coord => parseFloat(coord));
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
                                    <td>
                                    <td className="locationList"
                                    key={idx} onClick={() => setTargetLocation([latitude, longitude])}
                                    style={{width:'100%'}}>
                                        <Button sx={{
                                            backgroundColor: 'blue',
                                            marginRight:'5px',
                                            width:'100%'
                                        }}>Show details</Button>
                                        <Button sx={{
                                            backgroundColor: 'red',
                                            width:'100%'
                                        }}>Delete building</Button>
                                    </td>
                                    </td>
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
                    Building {selectedRow!==null&&selectedRow.Name}
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
                            value={selectedRow?.Name || ''}
                            onChange={(e) => handleInputChange('Name', e.target.value)}
                            variant="outlined"
                        />
                        </Grid>
                        <Grid item xs={12} md={6} lg={6} sm={12}>
                        <span>Code</span><br />
                        <Input
                            value={selectedRow?.Code || ''}
                            onChange={(e) => handleInputChange('Code', e.target.value)}
                            variant="outlined"
                        />
                        </Grid>
                        <Grid item xs={12} md={6} lg={6} sm={12}>
                        <span>Parent Site</span><br />
                        <Cascader
                            // data={data}
                            placeholder="Parent Site" 
                            style={{width:'100%'}}
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
                            value={selectedRow?.Address || ''}
                            onChange={(e) => handleInputChange('Address', e.target.value)}
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
                            value={selectedRow?.Country || ''}
                            onChange={(e) => handleInputChange('Country', e.target.value)}
                            variant="outlined"
                        />
                        </Grid>
                        <Grid item xs={12} md={6} lg={6} sm={12}>
                        <span>Zipcode</span><br />
                        <Input
                            value={selectedRow?.ZipCode || ''}
                            onChange={(e) => handleInputChange('ZipCode', e.target.value)}
                            variant="outlined"
                        />
                        </Grid>
                        <Grid item xs={12} md={6} lg={6} sm={12}>
                        <span>Region/State</span><br />
                        <Input
                            placeholder="Region/State"
                            variant="outlined"
                        />
                        </Grid>
                        <Grid item xs={12} md={6} lg={6} sm={12}>
                        <span>City</span><br />
                        <Input
                            value={selectedRow?.City || ''}
                            onChange={(e) => handleInputChange('City', e.target.value)}
                            variant="outlined"
                        />
                        </Grid>
                        <Grid item xs={12} md={6} lg={6} sm={12}>
                        <span>Department</span><br />
                        <Input
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
                            value={selectedRow?.Level_count || ''}
                            variant="outlined"
                        />
                        </Grid>
                        <Grid item xs={12} md={6} lg={6} sm={12}>
                        <span>Construction year </span><br />
                        <Input
                            value={selectedRow?.Construction_year || ''}
                            variant="outlined"
                        />
                        </Grid>
                        <Grid item xs={12} md={6} lg={6} sm={12}>
                        <span>Floor area (m²)</span><br />
                        <Input
                            value={selectedRow?.Floor_area || ''}
                            variant="outlined"
                            endDecorator={<Button sx={{height:'100%',marginRight:'-12px',background:'linear-gradient(124deg, rgba(7,28,75,1) 0%, rgba(9,100,60,1) 100%)'}}>m²</Button>}
                        />
                        </Grid>
                        <Grid item xs={12} md={6} lg={6} sm={12}>
                        <span>Activity</span><br />
                        <Input
                            value={selectedRow?.Activity || ''}
                            variant="outlined"
                        />
                        </Grid>
                        <Grid item xs={12} md={12} lg={12} sm={12}>
                        <span>Comment</span><br />
                        <Input
                            variant="outlined"
                            placeholder='Comment'
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
                            onChange={(e) => setNewBuilding({Name:e.target.value})}
                            variant="outlined"
                            placeholder="Name"
                        />
                        </Grid>
                        <Grid item xs={12} md={6} lg={6} sm={12}>
                        <span>Code</span><br />
                        <Input
                            onChange={(e) => setNewBuilding({Code:e.target.value})}
                            variant="outlined"
                            placeholder="Code"
                        />
                        </Grid>
                        <Grid item xs={12} md={6} lg={6} sm={12}>
                        <span>Parent Site</span><br />
                        <Cascader
                            // data={data}
                            placeholder="Parent Site" 
                            style={{width:'100%'}}
                            onChange={(e) => setNewBuilding({Site:e.target.value})}

                        />
                        </Grid>
                        <Grid item xs={12} md={6} lg={6} sm={12}>
                        <span>Correlation Code</span><br />
                        <Input
                            placeholder="Correlation Code"
                            variant="outlined"
                            onChange={(e) => setNewBuilding({Correlation_Code:e.target.value})}
                        />
                        </Grid>
                    </Grid>
                    <h4>Address</h4>
                    <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                        <Grid item xs={12} md={12} lg={12} sm={12}>
                        <span>Address</span><br />
                        <Input
                            onChange={(e) => setNewBuilding({Address:e.target.value})}
                            variant="outlined"
                            placeholder="Address"

                        />
                        </Grid>
                    </Grid>
                    <h4>Parent Site information</h4>
                    <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                        <Grid item xs={12} md={6} lg={6} sm={12}>
                        <span>Country</span><br />
                        <Input
                            onChange={(e) => setNewBuilding({Country:e.target.value})}
                            variant="outlined"
                            placeholder="Country"

                        />
                        </Grid>
                        <Grid item xs={12} md={6} lg={6} sm={12}>
                        <span>Zipcode</span><br />
                        <Input
                            onChange={(e) => setNewBuilding({Zipcode:e.target.value})}
                            variant="outlined"
                            placeholder="Zipcode"
                        />
                        </Grid>
                        <Grid item xs={12} md={6} lg={6} sm={12}>
                        <span>Region/State</span><br />
                        <Input
                            placeholder="Region/State"
                            variant="outlined"
                            onChange={(e) => setNewBuilding({Region_State:e.target.value})}
                        />
                        </Grid>
                        <Grid item xs={12} md={6} lg={6} sm={12}>
                        <span>City</span><br />
                        <Input
                            onChange={(e) => setNewBuilding({City:e.target.value})}
                            variant="outlined"
                            placeholder="City"
                        />
                        </Grid>
                        <Grid item xs={12} md={6} lg={6} sm={12}>
                        <span>Department</span><br />
                        <Input
                            placeholder="Department"
                            variant="outlined"
                            onChange={(e) => setNewBuilding({Department:e.target.value})}

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
                            onChange={(e) => setNewBuilding({LevelCount:e.target.value})}

                        />
                        </Grid>
                        <Grid item xs={12} md={6} lg={6} sm={12}>
                        <span>Construction year </span><br />
                        <Input
                            variant="outlined"
                            placeholder="Construction year"
                            onChange={(e) => setNewBuilding({ConstructionYear:e.target.value})}

                        />
                        </Grid>
                        <Grid item xs={12} md={6} lg={6} sm={12}>
                        <span>Floor area (m²)</span><br />
                        <Input
                            variant="outlined"
                            placeholder="Floor area"
                            onChange={(e) => setNewBuilding({Floor_ares:e.target.value})}
                            endDecorator={<Button sx={{height:'100%',marginRight:'-12px',background:'linear-gradient(124deg, rgba(7,28,75,1) 0%, rgba(9,100,60,1) 100%)'}}>m²</Button>}
                        />
                        </Grid>
                        <Grid item xs={12} md={6} lg={6} sm={12}>
                        <span>Activity</span><br />
                        <Input
                            variant="outlined"
                            placeholder="Activity"
                            onChange={(e) => setNewBuilding({Activity:e.target.value})}

                        />
                        </Grid>
                        <Grid item xs={12} md={12} lg={12} sm={12}>
                        <span>Comment</span><br />
                        <Input
                            variant="outlined"
                            placeholder='Comment'
                            onChange={(e) => setNewBuilding({Comment:e.target.value})}

                        />
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
        </div>
    );
}
