import React from 'react'
import Breadcrumbs from '@mui/joy/Breadcrumbs';
import Link from '@mui/joy/Link';
import Sheet from '@mui/joy/Sheet';
import Button from '@mui/joy/Button';

import { SiTestrail } from "react-icons/si";
import { BsLayersFill } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import { IoFilter } from "react-icons/io5";
import { MdAdd } from "react-icons/md";

import { Cascader,Avatar } from 'rsuite';
import Grid from '@mui/joy/Grid';
import Table from '@mui/joy/Table';

import { Pagination } from 'rsuite';
import { Divider } from '@mui/joy';


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

export default function Component() {
  const [activePage, setActivePage] = React.useState(1);

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
        <h2 id='title_H2'><SiTestrail style={{color:'rgb(3, 110, 74)'}}/><span> Component </span></h2>
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
                <tr key={row.Code}>
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
      </div>
  )
}
