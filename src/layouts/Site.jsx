import React,{useState} from 'react';
import '../styles/Site.css';
import Breadcrumbs from '@mui/joy/Breadcrumbs';
import Link from '@mui/joy/Link';
import Sheet from '@mui/joy/Sheet';
import Button from '@mui/joy/Button';
import Input from '@mui/joy/Input';
// import { styled } from '@mui/joy/styles';

import { SiTestrail } from "react-icons/si";
import { BsLayersFill } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import { IoFilter } from "react-icons/io5";
import { MdAdd } from "react-icons/md";

import { Cascader } from 'rsuite';
import Grid from '@mui/joy/Grid';
import Table from '@mui/joy/Table';

import { Pagination } from 'rsuite';
import { Divider } from '@mui/joy';
import { IoIosInformationCircle } from "react-icons/io";

import Modal from '@mui/joy/Modal';
import ModalClose from '@mui/joy/ModalClose';
import Typography from '@mui/joy/Typography';
import { FaCheck } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { IoMdCreate } from "react-icons/io";

function createData(Code, Name, Activity, Address, ZipCode, City,Country, Floor_ares) {
  return { Code, Name, Activity, Address, ZipCode, City,Country, Floor_ares };
}

const rows = [
  createData('S57', 'Building A', 'Office', '123 Main St', '10001', 'New York', 'USA', 10000),
  createData('I58', 'Ice Cream Sandwich Shop', 'Retail', '456 Elm St', '90001', 'Los Angeles', 'USA', 2000),
  createData('E59', 'Eclair Bakery', 'Bakery', '789 Oak St', '60601', 'Chicago', 'USA', 1500),
  createData('C60', 'Cupcake Factory', 'Manufacturing', '321 Pine St', '94101', 'San Francisco', 'USA', 3000),
  createData('G61', 'Gingerbread House', 'Housing', '654 Maple St', '30301', 'Atlanta', 'USA', 2500),
];




export default function Site() {
  const [activePage, setActivePage] = useState(1);
  const [open, setOpen] = React.useState(false);
  const [addSite, setAddSite] = React.useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isDirty, setIsDirty] = useState(false);

  const [newSite,setNewSite]=useState({Name:'',Activity:'',Code:'',Correlation_Code:'',Address:'',Country:'',Zipcode:'',Region_State:'',City:'',Department:'',Floor_ares:''});

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

  return (
    <div>
      <Breadcrumbs separator=">" aria-label="breadcrumbs" size="sm">
          {['Workspaces','workspace name','sites'].map((item) => (
          <Link className='Link_breadcrumbs' key={item} color="neutral" href="#sizes">
            <h5>
              {item}
            </h5>
          </Link>
          ))}
      </Breadcrumbs>
      <div>
        <h2 id='title_H2'><SiTestrail style={{color:'rgb(3, 110, 74)'}}/><span> Site </span></h2>
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
                    className='Cascader_comp'
                    placeholder="Project" 
                />
              </Grid>
              <Grid xs={12} lg={3.33} sm={12} md={12}>
                <Cascader
                    // data={data}
                    className='Cascader_comp'
                    placeholder="Site" 
                />
              </Grid>
              <Grid xs={12} lg={3.33} sm={12} md={12}>
                <Cascader
                    // data={data}
                    className='Cascader_comp'
                    placeholder="City" 
                />
              </Grid>
              <Grid xs={12} lg={2} sm={12} md={12}>
                <Button className='apply_Button'><IoFilter size={22}/>&nbsp;&nbsp;Apply filter</Button>
              </Grid>
            </Grid>
          </div>
          <div className='Add_container'>
            <Button className='add_Button' onClick={()=>setAddSite(true)}><MdAdd size={22}/>&nbsp;&nbsp;Add site</Button>
          </div>
          <div className='table_container'>
            <Table hoverRow 
            // borderAxis={'yBetween'}
            sx={{
              overflowX:'scroll'
            }}>
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Name</th>
                  <th>Activity</th>
                  <th>Address</th>
                  <th>ZipCode</th>
                  <th>City</th>
                  <th>Country</th>
                  <th>Floor area</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
              {rows.map((row) => (
                <tr key={row.Code} onClick={()=>handleRowClick(row)} className='table_row'>
                  <td>{row.Code}</td>
                  <td>{row.Name}</td>
                  <td>{row.Activity}</td>
                  <td>{row.Address}</td>
                  <td>{row.ZipCode}</td>
                  <td>{row.City}</td>
                  <td>{row.Country}</td>
                  <td>{row.Floor_ares}</td>
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
              Site {selectedRow!==null&&selectedRow.Name}
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
                    value={selectedRow?.Name || ''}
                    onChange={(e) => handleInputChange('Name', e.target.value)}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={4} lg={6} sm={12}>
                  <span>Activity</span><br />
                  <Input
                    value={selectedRow?.Activity || ''}
                    onChange={(e) => handleInputChange('Activity', e.target.value)}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={4} lg={6} sm={12}>
                  <span>Code</span><br />
                  <Input
                    value={selectedRow?.Code || ''}
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
                    value={selectedRow?.Address || ''}
                    onChange={(e) => handleInputChange('Address', e.target.value)}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={4} lg={6} sm={12}>
                  <span>Country</span><br />
                  <Input
                    value={selectedRow?.Country || ''}
                    onChange={(e) => handleInputChange('Country', e.target.value)}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={4} lg={6} sm={12}>
                  <span>Zipcode</span><br />
                  <Input
                    value={selectedRow?.ZipCode || ''}
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
                    value={selectedRow?.City || ''}
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
                    value={selectedRow?.Floor_ares || ''}
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
