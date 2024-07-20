import React,{useState} from 'react'
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

import { Pagination } from 'rsuite';
import { Divider } from '@mui/joy';

import Sheet from '@mui/joy/Sheet';
import Button from '@mui/joy/Button';

import '../styles/Building.css';

import { IoIosInformationCircle } from "react-icons/io";

import Modal from '@mui/joy/Modal';
import ModalClose from '@mui/joy/ModalClose';
import Typography from '@mui/joy/Typography';
import { FaCheck } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import Input from '@mui/joy/Input';
import { IoMdCreate } from "react-icons/io";

function createData(Code, Name, Site, Activity, Address, Construction_year, Floor_area, Level_count) {
  return { Code, Name, Site, Activity, Address, Construction_year, Floor_area, Level_count };
}

const rows = [
  createData('B001', 'Building A', 'Site 1', 'Office', '123 Main St, New York, USA', 1990, 10000, 10),
  createData('B002', 'Ice Cream Sandwich Shop', 'Site 2', 'Retail', '456 Elm St, Los Angeles, USA', 2005, 2000, 1),
  createData('B003', 'Eclair Bakery', 'Site 3', 'Bakery', '789 Oak St, Chicago, USA', 1985, 1500, 2),
  createData('B004', 'Cupcake Factory', 'Site 4', 'Manufacturing', '321 Pine St, San Francisco, USA', 2010, 3000, 3),
  createData('B005', 'Gingerbread House', 'Site 5', 'Housing', '654 Maple St, Atlanta, USA', 2000, 2500, 2),
];


export default function Building() {
  const [activePage, setActivePage] = React.useState(1);
  const [open, setOpen] = React.useState(false);
  const [addBuilding, setAddBuilding] = React.useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [newBuilding,setNewBuilding]=useState({Name:'',Activity:'',Code:'',Site:'',ConstructionYear:'',LevelCount:'',Correlation_Code:'',Address:'',Country:'',Zipcode:'',Region_State:'',City:'',Department:'',Floor_ares:'',Comment:''});
  
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

  return (
    <div>
        <Breadcrumbs separator=">" aria-label="breadcrumbs" size="sm">
          {['Workspaces','workspace name','Buildings'].map((item) => (
            <Link className='Link_breadcrumbs' key={item} color="neutral" href="#sizes">
            <h5>
              {item}
            </h5>
          </Link>
          ))}
        </Breadcrumbs>
        <div>
          <h2 id='title_H2'><SiTestrail style={{color:'rgb(3, 110, 74)'}}/><span> Building </span></h2>
          <Sheet variant="soft" color="neutral" sx={{ marginTop:'10px',p: 4,borderRadius:'5px',boxShadow:'0 0 5px rgba(176, 175, 175, 0.786)' }}>
            
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
                    <th>Site</th>
                    <th>Activity</th>
                    <th>Address</th>
                    <th>Construction Year</th>
                    <th>Floor Area&nbsp;(m²)</th>
                    <th>Level Count</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.Code} onClick={()=>handleRowClick(row)} className='table_row'>
                      <td>{row.Code}</td>
                      <td>{row.Name}</td>
                      <td>{row.Site}</td>
                      <td>{row.Activity}</td>
                      <td>{row.Address}</td>
                      <td>{row.Construction_year}</td>
                      <td>{row.Floor_area}</td>
                      <td>{row.Level_count}</td>
                      <td>
                        <Button sx={{
                          background:'linear-gradient(265deg, rgba(5,127,83,1) 0%, rgba(95,5,138,1) 100%)'
                        }}>
                          <MdDelete size={22}/>
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
              <h4>Address</h4>
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
              <h4>Parent Site information</h4>
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
              <h4>Characteristics</h4>
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
    </div>
  )
}
