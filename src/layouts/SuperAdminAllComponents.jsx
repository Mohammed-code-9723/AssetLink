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

import { Cascader,Avatar,Toggle } from 'rsuite';
import Grid from '@mui/joy/Grid';
import Table from '@mui/joy/Table';

import { Pagination } from 'rsuite';
import { Divider } from '@mui/joy';


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


function createData(Code, Name, Site, Building, Quantity, Unit, Last_rehabilitation_year, Condition, Severity_Max, Risk_Level) {
  return { Code, Name, Site, Building, Quantity, Unit, Last_rehabilitation_year, Condition, Severity_Max, Risk_Level };
}

const rows = [
  createData('S57', 'Structural Column', 'Site 1', 'Building A', 50, 'pieces', 2015, 'C2', 'S3', 'R2'),
  createData('I58', 'Ice Cream Sandwich Shop', 'Site 2', 'Building B', 200, 'square meters', 2018, 'C1', 'S1', 'R1'),
  createData('E59', 'Eclair Bakery', 'Site 3', 'Building C', 30, 'pieces', 2012, 'C3', 'S2', 'R3'),
  createData('C60', 'Cupcake Factory', 'Site 4', 'Building D', 150, 'square meters', 2020, 'C4', 'S4', 'R4'),
  createData('G61', 'Gingerbread House', 'Site 5', 'Building E', 75, 'pieces', 2017, 'C2', 'S3', 'R2'),
];

export default function SuperAdminAllComponents() {
  const [activePage, setActivePage] = React.useState(1);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [deletedRow,setDeletedRow]=useState({});
  
  const [allComponents,setAllComponents]=useState([]);

  useEffect(()=>{
    fetch( `http://127.0.0.1:8000/api/auth/Components`).then((response)=>response.json()).then((data)=>{
          setAllComponents(data.allComponents);
          console.log("resussuususlt: ",data.allComponents);
        })
  },[]);

  const HandleDelete=(row)=>{
    setOpenDelete(true);
    setDeletedRow(row);
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
          {['Workspaces','workspace name','components'].map((item) => (
          <Link className='Link_breadcrumbs' key={item} color="neutral" href="#sizes">
            <h5>
              {item}
            </h5>
          </Link>
          ))}
      </Breadcrumbs>
      <div>
        <div className='title_image'>
          <h2 id='title_H2'><SiTestrail style={{color:'rgb(3, 110, 74)'}}/><span> Components </span></h2>
          <img src="/assets/Components.svg" alt="comp_img" />
        </div>
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
                    placeholder="City (Department)" 
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
                    placeholder="Component Type" 
                />
              </Grid>
              <Grid xs={12} lg={2} sm={12} md={12}>
                <Cascader
                    // data={data}
                    className='Cascader_comp'
                    placeholder="Ageing Condition" 
                />
              </Grid>
              <Grid xs={12} lg={12} sm={12} md={12}>
                <center>
                  <Button className='apply_Button' sx={{width:'50%'}}><IoFilter size={22}/>&nbsp;&nbsp;Apply filter</Button>
                </center>
              </Grid>
            </Grid>
          </div>
          <div className='Add_container'>
            <Button className='add_Button'><MdAdd size={22}/>&nbsp;&nbsp;Add Component</Button>
          </div>
          <div className='table_container'>
            <Table hoverRow>
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Name</th>
                  <th>Site</th>
                  <th>Building</th>
                  <th>Quantity</th>
                  <th>Unit</th>
                  <th>Last rehabilitation year</th>
                  <th>Condition</th>
                  <th>Severity Max</th>
                  <th>Risk Level</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
              {rows.map((row) => (
                <tr key={row.Code} className='table_row' onClick={()=>handleRowClick(row)}>
                  <td>{row.Code}</td>
                  <td>{row.Name}</td>
                  <td>{row.Site}</td>
                  <td>{row.Building}</td>
                  <td>{row.Quantity}</td>
                  <td>{row.Unit}</td>
                  <td>{row.Last_rehabilitation_year}</td>
                  <td>
                    <Avatar circle style={{ background: row.Condition==='C1'?'green':(row.Condition==='C2')?'rgb(250, 218, 9)':(row.Condition==='C3')?'orange':'red' }}>{row.Condition}</Avatar>
                  </td>
                  <td>
                    <Avatar circle style={{ background: row.Severity_Max==='S1'?'green':(row.Severity_Max==='S2')?'rgb(250, 218, 9)':(row.Severity_Max==='S3')?'orange':'red' }}>{row.Severity_Max}</Avatar>
                  </td>
                  <td>
                    <Avatar circle style={{ background: row.Risk_Level==='R1'?'green':(row.Risk_Level==='R2')?'rgb(250, 218, 9)':(row.Risk_Level==='R3')?'orange':'red' }}>{row.Risk_Level}</Avatar>
                  </td>
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
              Component {selectedRow!==null&&selectedRow.Name}
            </span>
          </Typography>
          <div>
            <Divider>
              <h3 id='title_H3'>
                <IoIosInformationCircle/>
                <span>
                    Information
                </span>
              </h3>
            </Divider>
            <div className='info-container'>
              <Divider>
                <h4>Knowledge base linker</h4>
              </Divider>
              <Grid container spacing={2} sx={{ flexGrow: 1 }}>
              <Grid item xs={12} md={8} lg={6} sm={12}>
                  <span>Standard Component Type</span><br />
                  <Input
                    readOnly
                    value={`Immobilier - Générique ${selectedRow?.Name}` || ''}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={8} lg={6} sm={12}>
                  <span>Characteristics</span><br />
                  <Input
                    readOnly
                    variant="outlined"
                  />
                </Grid>
              </Grid>
              <Divider>
                <h4>Component Identification</h4>
              </Divider>
              <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                <Grid item xs={12} md={4} lg={6} sm={12}>
                  <span>Name</span><br />
                  <Input
                    value={selectedRow?.Name || ''}
                    onChange={(e) => handleInputChange('Name', e.target.value)}
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
                  <span>Parent Building</span><br />
                  <Input
                    value={selectedRow?.Building || ''}
                    variant="outlined"
                  />
                </Grid>
              </Grid>
              <Divider>
                <h4>Information</h4>
              </Divider>
              <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                <Grid item xs={12} md={8} lg={6} sm={12}>
                  <span>Quantity</span><br />
                  <Input
                    value={selectedRow?.Quantity || ''}
                    onChange={(e) => handleInputChange('Quantity', e.target.value)}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={4} lg={6} sm={12}>
                  <span>Unit</span><br />
                  <Input
                    value={selectedRow?.Unit || ''}
                    onChange={(e) => handleInputChange('Unit', e.target.value)}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={4} lg={6} sm={12}>
                  <span>Last rehabilitation year</span><br />
                  <Input
                  type='number'
                    value={selectedRow?.Last_rehabilitation_year || ''}
                    onChange={(e) => handleInputChange('Last_rehabilitation_year', e.target.value)}
                    variant="outlined"
                  />
                </Grid>
              </Grid>
              <Divider>
                <h4>Ageing and severity</h4>
              </Divider>
              <h4>Component condition</h4>
              <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                <Grid item xs={12} md={8} lg={6} sm={12}>
                  <span>Condition</span><br />
                  <Input
                    value={selectedRow?.Condition || ''}
                    placeholder="Region/State"
                    variant="outlined"
                    color={selectedRow?.Condition==='C1'?'success':(selectedRow?.Condition==='C2')?'warning':'danger'}
                  />
                </Grid>
                <Grid item xs={12} md={8} lg={6} sm={12}>
                  <span>Is condition assumed ?</span><br />
                  <Toggle defaultChecked color="cyan">
                  </Toggle>
                </Grid>
                <Grid item xs={12} md={12} lg={12} sm={12}>
                  <span>Comment</span><br />
                  <Input
                    placeholder='Comment'
                    variant="outlined"
                  />
                </Grid>
              </Grid>
              <h4>Component Severity per Stakes</h4>
              <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                <Grid item xs={12} md={6} lg={6} sm={12}>
                  <span>Safety </span><br />
                  <div style={{display:'flex'}}>
                    <Avatar circle style={{ background: selectedRow?.Severity_Max==='S1'?'green':(selectedRow?.Severity_Max==='S2')?'rgb(250, 218, 9)':(selectedRow?.Severity_Max==='S3')?'orange':'red' }}>{selectedRow?.Severity_Max}</Avatar>
                    <Input
                      sx={{width:'100%'}}
                      value={selectedRow?.Severity_Max || ''}
                      variant="outlined"
                      color={selectedRow?.Severity_Max==='S1'?'success':(selectedRow?.Severity_Max==='S2')?'warning':'danger'}
                    />
                  </div>
                </Grid>
                <Grid item xs={12} md={6} lg={6} sm={12}>
                  <span>Operations </span><br />
                  <Input
                  readOnly
                    // value={selectedRow?.Floor_ares || ''}
                    // onChange={(e) => handleInputChange('Floor_ares', e.target.value)}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={6} sm={12}>
                  <span>Work Conditions </span><br />
                  <Input
                    readOnly
                    // value={selectedRow?.Floor_ares || ''}
                    // onChange={(e) => handleInputChange('Floor_ares', e.target.value)}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={6} sm={12}>
                  <span>Environment</span><br />
                  <Input
                    readOnly
                    // value={selectedRow?.Floor_ares || ''}
                    // onChange={(e) => handleInputChange('Floor_ares', e.target.value)}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={12} lg={12} sm={12}>
                  <span>Image </span><br />
                  <Input
                    readOnly
                    // value={selectedRow?.Floor_ares || ''}
                    // onChange={(e) => handleInputChange('Floor_ares', e.target.value)}
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
  )
}
