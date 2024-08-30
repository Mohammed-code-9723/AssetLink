import React ,{useState,useEffect,useRef} from 'react';
import { Container, Header, Content, DatePicker, InputPicker, Grid, Row, Col, Panel, Table, ButtonGroup, Button ,Loader, SelectPicker} from 'rsuite';
import { BarChart, Bar, PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Breadcrumbs from '@mui/joy/Breadcrumbs';
import Link from '@mui/joy/Link';
import { useTranslation } from 'react-i18next';
import { useDispatch,useSelector } from 'react-redux';
import { SiHomeassistant, SiTestrail } from 'react-icons/si';
import {  Input,  Form, FormGroup,Message} from 'rsuite';
import { Modal , Sheet, Typography , Divider, Textarea } from '@mui/joy';
import { DataGrid } from '@mui/x-data-grid';
import { useReactToPrint } from 'react-to-print'; 
import { BsEye } from 'react-icons/bs';
import { MdDelete } from 'react-icons/md';
import { GrUpdate } from 'react-icons/gr';

import '../styles/reports.css';
import dayjs from 'dayjs';



const { Column, HeaderCell, Cell } = Table;


// const pieChartData = [
//     { name: 'Low', value: 50 },
//     { name: 'Medium', value: 100 },
//     { name: 'High', value: 75 },
//     { name: 'Critical', value: 25 },
// ];



const lineChartData = [
  { name: 'January', resolutionTime: 24 },
  { name: 'February', resolutionTime: 20 },
  { name: 'March', resolutionTime: 18 },
  // Add more months
];



export default function SuperAdminAllReports() {

  const token=localStorage.getItem('token');
  const userInfo=JSON.parse(localStorage.getItem('user'));
  const {t } = useTranslation();
  const [message,setMessage]=useState('');
  const [allReports,setAllReports]=useState([]);
  const [allUserIncidents,setAllUserIncidents]=useState([]);
  const [totalIncidents,setTotalIncidents]=useState('');
  const [resolvedIncidents,setResolvedIncidents]=useState('');
  const [criticalIncidents,setCriticalIncidents]=useState('');
  const [allBuildings,setAllBuildings]=useState([]);
  const [allProjects,setAllProjects]=useState([]);
  const [allSites,setAllSites]=useState([]);
  const [allMaintenances,setAllMaintenances]=useState(['']);
  const [allUsersReports,setAllUsersReports]=useState([]);
  
  
  const barChartData = allUserIncidents.reduce((acc, incident) => {
    const month = new Date(incident.created_at).toLocaleString('en-US', { month: 'long' });
  
    if (!acc[month]) {
      acc[month] = {
        name: month,
        incidents: 0,
      };
    }
  
    acc[month].incidents++;
    return acc;
  }, {});
  
  // Convert the object to an array
  const barChartDataArray = Object.values(barChartData);


  const pieChartData = allUserIncidents.reduce((acc, incident) => {
    const status = incident.status; // Assuming 'status' is the property for incident status
  
    if (!acc[status]) {
      acc[status] = {
        name: status,
        value: 0,
      };
    }
  
    acc[status].value++;
    return acc;
  }, {});
  
  // Convert the object to an array
  const pieChartDataArray = Object.values(pieChartData);


  const [openAdd, setOpenAdd] = useState(false); 
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [reportData, setReportData] = useState({
    title: '',
    report_about: '',
    description: '',
    created_by: userInfo.id, // Should be set automatically based on the current user
    project_id: null,
    site_id: null,
    building_id: null,
    incident_id: null,
    maintenance_id: null,
  });

  const [selectedReportId, setSelectedReportId] = useState(null);

  const handleOpenAdd = () => setOpenAdd(true);
    // const handleCloseAdd = () => setOpenAdd(false);

    const handleOpenUpdate = (report) => {
        setReportData(report);
        setSelectedReportId(report.id);
        setOpenUpdate(true);
    };
    const handleCloseUpdate = () => setReportData({
      title: '',
      report_about: '',
      description: '',
      created_by: userInfo.id, 
      project_id: null,
      site_id: null,
      building_id: null,
      incident_id: null,
      maintenance_id: null,
    });

    const handleOpenDelete = (reportId) => {
        setSelectedReportId(reportId);
        setOpenDelete(true);
    };
    const handleCloseDelete = () => setOpenDelete(false);

    const handleChange = (value, name) => {
      setReportData({
          ...reportData,
          [name]: value
      });
  };

  const [openPrint,setOpenPrint]=useState(false);
  const handleClosePrint=()=>setOpenPrint(false);
  const handleOpenPrint=(report)=>{
    setReportData(report);
    setSelectedReportId(report.id);
    setOpenPrint(true);
  };

  useEffect(()=>{
  
      try {
        fetch(`http://127.0.0.1:8000/api/auth/allReports`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }).then((response)=>response.json())
        .then((result)=>{
          setAllReports(result.allReports);
          setTotalIncidents(result.totalIncidents);
          setResolvedIncidents(result.resolvedIncidents);
          setCriticalIncidents(result.criticalIncidents);
          setAllUserIncidents(result.allUserIncidents);
          setAllBuildings(result.allBuildings);
          setAllProjects(result.allProjects);
          setAllSites(result.allSites);
          setAllMaintenances(result.allMaintenances);
          setAllUsersReports(result.allUsersReports);
          console.log("result: ");
          console.log(result);
        })
      }catch (error) {
        console.error('Error:', error); 
        alert('An error occurred while getting the reports.');
      }
  },[]);


  const fetchReportsData=()=>{
    try {
      fetch(`http://127.0.0.1:8000/api/auth/allReports`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }).then((response)=>response.json())
      .then((result)=>{
        setAllReports(result.allReports);
        setTotalIncidents(result.totalIncidents);
        setResolvedIncidents(result.resolvedIncidents);
        setCriticalIncidents(result.criticalIncidents);
        setAllUserIncidents(result.allUserIncidents);
        setAllBuildings(result.allBuildings);
        setAllProjects(result.allProjects);
        setAllSites(result.allSites);
        setAllMaintenances(result.allMaintenances);
      })
    }catch (error) {
      console.error('Error:', error); 
      alert('An error occurred while getting the reports.');
    }
  }

//!add report
  const handleAddReport = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/auth/add_Report', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(reportData),
      });

      if (!response.ok) {
          throw new Error('Failed to add report');
      }

      const data = await response.json();
      setMessage(data.message);
      fetchReportsData(); 
      setOpenAdd(false);
      setReportData({
        title: '',
        report_about: '',
        description: '',
        created_by: userInfo.id, 
        project_id: null,
        site_id: null,
        building_id: null,
        incident_id: null,
        maintenance_id: null,
      });
      return data;
    } catch (error) {
        console.error('Error adding report:', error);
        return Promise.reject(error.message);
    } 
  };

//!update report
//   const updateReport = async ( token, selectedReportId, updatedData ) => {
//     try {
//         const response = await fetch(`http://127.0.0.1:8000/api/auth/update_report/${selectedReportId}`, {
//             method: 'PUT',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${token}`,
//             },
//             body: JSON.stringify(updatedData),
//         });

//         if (!response.ok) {
//             throw new Error('Failed to update report');
//         }

//         const data = await response.json();
//         setMessage(data.message);
//         return data;
//     } catch (error) {
//         console.error('Error updating report:', error);
//         return Promise.reject(error.message);
//     }
// };

  const handleUpdateReport = async () => {
    try {
        const response = await fetch(`http://127.0.0.1:8000/api/auth/update_report/${selectedReportId}`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(reportData),
        });

        if (!response.ok) {
            throw new Error('Failed to update report');
        }

        const data = await response.json();
        setMessage(data.message);
        fetchReportsData(); 
        setOpenUpdate(false);
        setReportData({
          title: '',
          report_about: '',
          description: '',
          created_by: userInfo.id, 
          project_id: null,
          site_id: null,
          building_id: null,
          incident_id: null,
          maintenance_id: null,
        });
        return data;
    } catch (error) {
        console.error(error);
    }
  };

  //!delete report:
  const deleteReport = async ( token,selectedReportId ) => {
    try {
        const response = await fetch(`http://127.0.0.1:8000/api/auth/delete_report`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body:JSON.stringify({id:selectedReportId}) 
        });

        if (!response.ok) {
            throw new Error('Failed to delete report');
        }

        const data = await response.json();
        setMessage(data.message);
        return data;
    } catch (error) {
        console.error('Error deleting report:', error);
        return Promise.reject(error.message);
    }
  };

  const handleDeleteReport = async () => {
    try {
        await deleteReport(token, selectedReportId); // Assuming you have a deleteReport function
        fetchReportsData(); // Refresh the reports list
        setOpenDelete(false);
        handleCloseDelete();
    } catch (error) {
        console.error(error);
    }
  };

  //? Report information:
  // const handleRowClick = (params) => {
  //   console.log('Row clicked:', params.row);
    
  // };

  const printRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });


  const columns = [
    { field: 'id', headerName: 'Report ID', width: 100 },
    { field: 'title', headerName: 'Title', width: 200 },
    { field: 'report_about', headerName: 'Report About', width: 150 },
    { field: 'description', headerName: 'Description', width: 200 },
    {
      field: 'created_by',
      headerName: 'Created By',
      width: 150,
      valueGetter: (params) => {
        if (params === null || params === undefined) return '-';
        const user = allUsersReports?.find(user => user.id === params);
        return user ? user.name : '-';
      },
    },
    {
      field: 'project_id',
      headerName: 'Project',
      width: 150,
      valueGetter: (params) => {
        if (params === null || params === undefined) return '-';
        const project = allProjects?.find(project => project.id === params);
        return project ? project.name : '-';
      },
    },
    {
      field: 'site_id',
      headerName: 'Site',
      width: 150,
      valueGetter: (params) => {
        if (params === null || params === undefined) return '-';
        const site = allSites?.find(site => site.id === params);
        return site ? site.name : '-';
      },
    },
    {
      field: 'building_id',
      headerName: 'Building',
      width: 150,
      valueGetter: (params) => {
        if (!params || params=== null || params === undefined) return '-';
        const building = allBuildings?.find(building => building.id === params);
        return building ? building.name : '-';
      },
    },
    {
      field: 'incident_id',
      headerName: 'Incident',
      width: 150,
      valueGetter: (params) => {
        if (params === null || params === undefined) return '-';
        const incident = allUserIncidents?.find(incident => incident.id === params);
        return incident ? incident.title : '-';
      },
    },
    {
      field: 'maintenance_id',
      headerName: 'Maintenance',
      width: 150,
      valueGetter: (params) => {
        if (params === null || params === undefined) return '-';
        const maintenance = allMaintenances?.find(maintenance => maintenance.id === params);
        return maintenance ? maintenance.task_name : '-';
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%' ,height:'fit-content', alignItems:'center' }}>
          <Button
            onClick={() => handleOpenUpdate(params.row)}
            style={{ marginRight: '10px', background: 'linear-gradient(265deg, rgba(5,127,83,1) 0%, rgba(95,5,138,1) 100%)', color: 'white',marginTop:'6px' }}
          >
            <GrUpdate/>
          </Button>
          <Button
            onClick={() => handleOpenDelete(params.row.id)}
            style={{marginRight: '10px', background: 'linear-gradient(265deg, rgba(5,127,83,1) 0%, rgba(95,5,138,1) 100%)', color: 'white' ,marginTop:'6px'}}
          >
            <MdDelete/>
          </Button>
          <Button
            onClick={() => handleOpenPrint(params.row)}
            style={{ background: 'linear-gradient(265deg, rgba(5,127,83,1) 0%, rgba(95,5,138,1) 100%)', color: 'white' ,marginTop:'6px'}}
          >
            <BsEye/>
          </Button>
        </div>
      ),
    },
  ];
  
  
  const [cascaderData, setCascaderData] = useState([]);

  useEffect(() => {
    switch (reportData.report_about) {
      case 'Incident':
        setCascaderData(allUserIncidents.map(incident => ({ label: incident.title, value: incident.id })));
        break;
      case 'Maintenance':
        setCascaderData(allMaintenances.map(maintenance => ({ label: maintenance.task_name, value: maintenance.id })));
        break;
      case 'Building':
        setCascaderData(allBuildings.map(building => ({ label: building.name, value: building.id })));
        break;
      case 'Project':
        setCascaderData(allProjects.map(project => ({ label: project.name, value: project.id })));
        break;
      case 'Site':
        setCascaderData(allSites.map(site => ({ label: site.name, value: site.id })));
        break;
      default:
        setCascaderData([]);
    }
  }, [reportData.report_about, allUserIncidents, allMaintenances, allBuildings, allProjects, allSites]);

  

  useEffect(()=>{
    if(message!==''){
      const intervalCount=setTimeout(()=>{
        setMessage('');
      },5000);
      return ()=>clearTimeout(intervalCount);
    }
  },[message]);
  
  return (
    <Container>
        <Header>
            <Grid fluid>
                <Row>
                    <Col lg={12} xs={12}>
                        <Breadcrumbs separator=">" aria-label="breadcrumbs" size="sm">
                            {[t('dashboard'),t('reports')].map((item) => (
                            <Link  key={item} color="neutral" href="#sizes">
                              <h5>
                                {item}
                              </h5>
                            </Link>
                            ))}
                        </Breadcrumbs>
                    </Col>
                    <div style={{width:'100%',display:'flex',justifyContent:'space-between'}}>
                      <h2 id='title_H2'><SiTestrail style={{color:'rgb(3, 110, 74)'}}/><span> {t('reportsPage.RA')}</span></h2>
                      <img src="/assets/Components.svg" alt="comp_img" width={200}/>
                    </div>
                </Row>
                <Row style={{width:'100%',gap:'5px'}}>
                  <Col  lg={6} md={12} sm={24} xs={6} >
                      <DatePicker placeholder={t('reportsPage.SDR')} style={{ width:'100%',marginBottom:'10px'}} />
                  </Col>
                  <Col lg={6} md={12} sm={24} xs={6} >
                      <InputPicker data={[{label: 'Project A', value: 'projectA'}]} placeholder={t('reportsPage.SP')} style={{ width: '100%',marginBottom:'10px'}} />
                  </Col>
                  <Col  lg={6} md={12} sm={24} xs={6}>
                      <InputPicker data={[{label: 'Site A', value: 'siteA'}]} placeholder={t('reportsPage.SS')} style={{ width: '100%',marginBottom:'10px' }} />
                  </Col>
                  <Col  lg={6} md={12} sm={24} xs={6} >
                      <InputPicker data={[{label: 'Type A', value: 'typeA'}]} placeholder={t('reportsPage.SIT')} style={{ width: '100%',marginBottom:'10px'}} />
                  </Col>
                </Row>
                <Row style={{width:'100%',display:'flex',justifyContent:'center'}}>
                  <Col lg={12} md={12} sm={24} xs={6}>
                      <InputPicker data={[{label: 'John Doe', value: 'johnDoe'}]} placeholder={t('reportsPage.SU')} style={{ width: '100%' ,marginBottom:'10px'}} />
                  </Col>
                </Row>
            </Grid>
        </Header>
        <Content>
            <Grid fluid>
                <Row>
                    <Col lg={6} md={12} sm={24} xs={6} >
                        <Panel bordered style={{height:'150px',textAlign:'center'}}>
                          <center>
                              <h4 style={{background:'linear-gradient(265deg, rgba(118,0,89,1) 0%, rgba(5,127,83,1) 50%, rgba(5,49,138,1) 100%)',
                          width:'fit-content',
                          color:'transparent',
                          WebkitBackgroundClip:'text',
                          backgroundClip:'text',
                          textAlign:'center'
                        }}>{t('reportsPage.TI')}</h4>
                          </center>
                            <h2>{totalIncidents?totalIncidents:<Loader content='...Loading'/>}</h2> {/* Dynamically populate this value */}
                        </Panel>
                    </Col>
                    <Col lg={6} md={12} sm={24} xs={6} >
                        <Panel bordered style={{height:'150px',textAlign:'center'}}>
                          <center>
                              <h4 style={{background:'linear-gradient(265deg, rgba(118,0,89,1) 0%, rgba(5,127,83,1) 50%, rgba(5,49,138,1) 100%)',
                          width:'fit-content',
                          color:'transparent',
                          WebkitBackgroundClip:'text',
                          backgroundClip:'text',
                          textAlign:'center'
                        }}>{t('reportsPage.RI')}</h4>
                          </center>
                            <h2>{resolvedIncidents?resolvedIncidents:<Loader content='...Loading'/>}</h2> {/* Dynamically populate this value */}
                        </Panel>
                    </Col>
                    <Col lg={6} md={12} sm={24} xs={6} >
                        <Panel bordered style={{height:'150px',textAlign:'center'}}>
                          <center>
                              <h4 style={{background:'linear-gradient(265deg, rgba(118,0,89,1) 0%, rgba(5,127,83,1) 50%, rgba(5,49,138,1) 100%)',
                          width:'fit-content',
                          color:'transparent',
                          WebkitBackgroundClip:'text',
                          backgroundClip:'text',
                          textAlign:'center'
                        }}>{t('reportsPage.ART')}</h4>
                          </center>
                            <h2>5h 30m</h2> {/* Dynamically populate this value */}
                        </Panel>
                    </Col>
                    <Col lg={6} md={12} sm={24} xs={6} >
                        <Panel bordered style={{height:'150px',textAlign:'center'}}>
                          <center>
                              <h4 style={{background:'linear-gradient(265deg, rgba(118,0,89,1) 0%, rgba(5,127,83,1) 50%, rgba(5,49,138,1) 100%)',
                          width:'fit-content',
                          color:'transparent',
                          WebkitBackgroundClip:'text',
                          backgroundClip:'text',
                          textAlign:'center'
                        }}>{t('reportsPage.CI')}</h4>
                          </center>
                            <h2>{criticalIncidents?criticalIncidents:<Loader content='...Loading'/>}</h2> {/* Dynamically populate this value */}
                        </Panel>
                    </Col>
                </Row>
                <Row style={{display:'flex',width:'100%',marginTop:'10px'}}>
                    <Col lg={12} xs={24} md={24} style={{width:'50%'}}>
                    <center>
                      <h3 style={{background:'linear-gradient(265deg, rgba(118,0,89,1) 0%, rgba(5,127,83,1) 50%, rgba(5,49,138,1) 100%)',
                        width:'fit-content',
                        color:'transparent',
                        WebkitBackgroundClip:'text',
                        backgroundClip:'text'
                      }}>{t('reportsPage.IPM')}</h3>
                    </center>
                    {
                      barChartDataArray.length>0?(
                        <BarChart width={555} height={300} data={barChartDataArray}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="incidents" fill="#8884d8" />
                        </BarChart>
                      ):(
                        <Loader content='...loading'/>
                      )
                    }
                    </Col>
                    <Col lg={12} xs={24} md={24} style={{width:'50%'}}>
                    <center>
                      <h3 style={{background:'linear-gradient(265deg, rgba(118,0,89,1) 0%, rgba(5,127,83,1) 50%, rgba(5,49,138,1) 100%)',
                        width:'fit-content',
                        color:'transparent',
                        WebkitBackgroundClip:'text',
                        backgroundClip:'text'
                      }}>{t('reportsPage.IPS')}</h3>
                    </center>
                    {
                      pieChartDataArray.length>0?(
                        <PieChart width={555} height={300}>
                            <Pie data={pieChartDataArray} dataKey="value" cx={'50%'} cy={'50%'} outerRadius={80} fill="#82ca9d" label />
                            <Tooltip />
                        </PieChart>
                      ):(
                        <Loader content='...loading'/>
                      )
                    }
                    </Col>
                </Row>
                <Row>
                  <Col xs={12} md={8}>
                  {
                    pieChartDataArray.length>0?(
                      <LineChart width={1110} height={300} data={barChartDataArray}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="resolutionTime" stroke="#8884d8" />
                      </LineChart>

                    ):
                    (
                      <Loader content='...loading'/>
                    )
                  }
                  </Col>
                </Row>
                <Row>
                    <Col xs={24}>
                        <Panel header="Detailed Reports">
                          {
                            message!==''&&(
                              <Message closable content={message}>
                                {message}
                              </Message>
                            )
                          }
                          <Button onClick={handleOpenAdd} appearance="primary">Add Report</Button>
                          {/* <div style={{ height: 600, width: '100%' }}> */}
                            <DataGrid
                              rows={allReports}
                              columns={columns}
                              pageSize={10}
                              rowsPerPageOptions={[10, 25, 50]}
                              checkboxSelection={false}
                              disableSelectionOnClick
                              comfortable
                              // autoHeight
                              // onRowClick={handleRowClick}
                              
                            />
                          {/* </div> */}


                            <ButtonGroup style={{ marginTop: 10,width:'100%',display:'flex',justifyContent:'space-around',alignItems:'center' }}>
                                <Button appearance="primary">Export to CSV</Button>
                                <Button appearance="primary">Export to Excel</Button>
                                <Button appearance="primary">Export to PDF</Button>
                                <Button appearance="primary">Print</Button>
                            </ButtonGroup>
                        </Panel>
                    </Col>
                </Row>
            </Grid>
            <div>

              {/* Modal add report */}
              <Modal 
              aria-labelledby="modal-title"
              aria-describedby="modal-desc"
              sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
              open={openAdd} onClose={()=>setOpenAdd(false)} >
                  <Sheet
                  variant="outlined"
                  sx={{
                    width:'70%',
                    maxHeight:'85vh',
                    borderRadius: 'md',
                    p: 3,
                    boxShadow: 'lg',
                    overflow:'hidden',
                    zIndex:10011
                  }}
                  >
                      <Typography component='h2'>
                          <Typography component='h5'>Add Report</Typography>
                      </Typography>
                      <div>
                          <div>
                              <h2>Title</h2>
                              <Input name="title" defaultValue={reportData.title} onChange={(value) => handleChange(value, 'title')} />
                          </div>
                          <div>
                              <h2>Report About</h2>
                              <InputPicker data={[
                                  { label: 'Incident', value: 'Incident' },
                                  { label: 'Maintenance', value: 'Maintenance' },
                                  { label: 'Building', value: 'Building' },
                                  { label: 'Project', value: 'Project' },
                                  { label: 'Site', value: 'Site' }
                              ]} 
                              placeholder="Select Report Type"
                              defaultValue={reportData.report_about} 
                              menuStyle={{
                                zIndex:1000000
                              }}
                              style={{width:'100%'}}
                              onChange={(value) => handleChange(value, 'report_about')} />
                          </div>
                          <div>
                          <div style={{ display: cascaderData.length>0? 'block' : 'none' }}>
                              <h2>{reportData.report_about}</h2>
                              <SelectPicker 
                                data={cascaderData} 
                                labelKey='label'
                                valueKey='value'
                                placeholder="Select Report Type"
                                menuStyle={{ zIndex: 1000000 }}
                                style={{ width: '100%' }}
                                onChange={(value) => handleChange(value, reportData.report_about === 'Incident' ? 'incident_id' : 
                                                                  reportData.report_about === 'Maintenance' ? 'maintenance_id' : 
                                                                  reportData.report_about === 'Building' ? 'building_id' : 
                                                                  reportData.report_about === 'Project' ? 'project_id' : 
                                                                  'site_id')} 
                              />
                            </div>
                          </div>
                          <div>
                              <h2>Description</h2>
                              <Textarea placeholder="description" minRows={6} defaultValue={reportData.description} onChange={(e) => handleChange(e.target.value, 'description')} />
                          </div>
                          <div>
                            <h2>Created by</h2>
                            <Input value={userInfo.name} disabled/>
                          </div>
                      </div>
                      <Panel>
                          <Button onClick={handleAddReport} appearance="primary">Add</Button>
                            <Divider vertical/>
                          <Button onClick={()=>setOpenAdd(false)} appearance="subtle">Cancel</Button>
                      </Panel>
                  </Sheet>
              </Modal>

              {/* Update Report Modal */}
              <Modal 
              aria-labelledby="modal-title"
              aria-describedby="modal-desc"
              sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
              open={openUpdate} onClose={()=>{
                handleCloseUpdate();
                setOpenUpdate(false);
                }}>
                  <Sheet
                  variant="outlined"
                  sx={{
                    width:'70%',
                    maxHeight:'85vh',
                    borderRadius: 'md',
                    p: 3,
                    boxShadow: 'lg',
                    overflow:'hidden',
                    zIndex:10011
                  }}
                  >
                  <Typography component='h2'>
                      <Typography component='h5'>Update Report</Typography>
                  </Typography>
                      <div>
                          <div>
                              <h2>Title</h2>
                              <Input name="title" defaultValue={reportData.title} onChange={(value) => handleChange(value, 'title')} />
                          </div>
                          <div>
                              <h2>Report About</h2>
                              <InputPicker data={[
                                  { label: 'Incident', value: 'Incident' },
                                  { label: 'Maintenance', value: 'Maintenance' },
                                  { label: 'Building', value: 'Building' },
                                  { label: 'Project', value: 'Project' },
                                  { label: 'Site', value: 'Site' }
                              ]} 
                              placeholder="Select Report Type"
                              defaultValue={reportData.report_about} 
                              menuStyle={{
                                zIndex:1000000
                              }}
                              style={{width:'100%'}}
                              onChange={(value) => handleChange(value, 'report_about')} />
                          </div>
                          <div>
                          <div style={{ display: cascaderData.length>0? 'block' : 'none' }}>
                              <h2>{reportData.report_about}</h2>
                              <SelectPicker 
                                data={cascaderData} 
                                labelKey='label'
                                valueKey='value'
                                placeholder="Select Report Type"
                                menuStyle={{ zIndex: 1000000 }}
                                style={{ width: '100%' }}
                                onChange={(value) => handleChange(value, reportData.report_about === 'Incident' ? 'incident_id' : 
                                                                  reportData.report_about === 'Maintenance' ? 'maintenance_id' : 
                                                                  reportData.report_about === 'Building' ? 'building_id' : 
                                                                  reportData.report_about === 'Project' ? 'project_id' : 
                                                                  'site_id')} 
                              />
                            </div>
                          </div>
                          <div>
                              <h2>Description</h2>
                              <Textarea placeholder="description" minRows={6} defaultValue={reportData.description} onChange={(e) => handleChange(e.target.value, 'description')} />
                          </div>
                          <div>
                            <h2>Created by</h2>
                            <Input value={userInfo.name} disabled/>
                          </div>
                      </div>
                    <Panel>
                        <Button onClick={handleUpdateReport} appearance="primary">Update</Button>
                          <Divider vertical/>
                        <Button onClick={()=>{
                          setOpenUpdate(false);
                          handleCloseUpdate();
                        }} appearance="subtle">Cancel</Button>
                    </Panel>
                  </Sheet>
              </Modal>

              {/* Delete Report Modal */}
              <Modal 
              aria-labelledby="modal-title"
              aria-describedby="modal-desc"
              sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
              open={openDelete}  onClose={()=>handleCloseDelete()}>
                  <Sheet
                  variant="outlined"
                  sx={{
                    width:'50%',
                    maxHeight:'30vh',
                    borderRadius: 'md',
                    p: 3,
                    boxShadow: 'lg',
                    overflow:'hidden',
                    zIndex:10011
                  }}
                  >
                  <Typography component='h2'>
                      <Typography component='h5'>Delete Report</Typography>
                  </Typography>
                      Are you sure you want to delete this report?
                  <Panel>
                      <Button onClick={handleDeleteReport} appearance="primary" color="red">Delete</Button>
                        <Divider vertical/>
                      <Button onClick={handleCloseDelete} appearance="subtle">Cancel</Button>
                  </Panel>
                  </Sheet>
              </Modal>
              
              {/* print modal */}
              <Modal 
                aria-labelledby="modal-title"
                aria-describedby="modal-desc"
                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                open={openPrint}  onClose={()=>handleClosePrint()}>
                  <Sheet
                  variant="outlined"
                  sx={{
                    width:'80%',
                    height:'90%',
                    borderRadius: 'md',
                    p: 3,
                    boxShadow: 'lg',
                    overflowY:'scroll',
                    marginTop:'50px',
                    zIndex:10011
                  }}
                  
                  >
                  <div style={{
                    width:'100%',
                    height:'100%',
                    minHeight:'100%'

                  }}
                  
                  >
                    <Grid fluid ref={printRef}>
                      <Row>
                        <Col lg={24} md={24} sm={24} xs={6} >
                          <Row style={{ width: '100%'}}>
                            <Col lg={12} md={12} sm={24} xs={24}>
                              <h1 className='logo_report'>
                                <SiHomeassistant style={{ color: 'black' }} />
                                &nbsp;&nbsp;&nbsp;<span style={{ color: 'black' }}>AssetLink</span>
                              </h1>
                            </Col>
                            <Col lg={12} md={12} sm={24} xs={24}>
                              <Typography component='div' style={{textAlign:'right'}}>
                                <Typography component='h3'>
                                  Date : {dayjs().format('MM/DD/YYYY')} 
                                </Typography><br />
                                <Typography component='h3'>
                                  Created by: {allUsersReports?.find(user => user.id === reportData.created_by)?.name || '-'}
                                </Typography>
                              </Typography>
                            </Col>
                          </Row>
                          <Panel>
                            <center>
                              <Typography component='h3'>Report title :</Typography>
                              <Typography component='div'>{reportData.title}</Typography>
                              <Typography component='h3'>Report about :</Typography>
                              <Typography component='div'>{reportData.report_about}</Typography>
                              <Typography component='h3'>Report description :</Typography>
                              <Typography component='div' style={{minHeight:'150px'}}>{reportData.description}</Typography>
                            </center>
                            <Divider>Details</Divider>
                            <Typography component='div'>
                              <Typography component='h3'>Site</Typography>
                              <div>{allSites?.find(site => site.id === reportData.site_id)?.name || '-'}</div>
                              <Typography component='h3'>Building</Typography>
                              <div>{allBuildings?.find(building => building.id === reportData.building_id)?.name || '-'}</div>
                              <Typography component='h3'>Project</Typography>
                              <div>{allProjects?.find(project => project.id === reportData.project_id)?.name || '-'}</div>
                              <Typography component='h3'>Incident</Typography>
                              <div>{allUserIncidents?.find(incident => incident.id === reportData.incident_id)?.title || '-'}</div>
                              <Typography component='h3'>Maintenance</Typography>
                              <div>{allMaintenances?.find(maintenance => maintenance.id === reportData.maintenance_id)?.task_name || '-'}</div>
                            </Typography>
                          </Panel>
                        </Col>
                      </Row>
                    </Grid>

                    <Button onClick={handlePrint} style={{ marginTop: '10px', background: 'green', color: 'white' }}>
                      Print Report
                    </Button>
                    <Button onClick={()=>setOpenPrint(false)} style={{ marginTop: '10px', marginLeft: '10px' }}>
                      Close
                    </Button>
                  </div>
                  </Sheet>
              </Modal>
            </div>
        </Content>
    </Container>
  );
}
