import React, { useState , useEffect } from 'react'
import '../styles/SuperAdminDahsboard.css';
import { Navigate } from 'react-router-dom';

import { styled } from '@mui/joy/styles';
import Grid from '@mui/joy/Grid';
import { FaProjectDiagram } from "react-icons/fa";
import { FaBuilding } from "react-icons/fa";
import Sheet from '@mui/joy/Sheet';
import Link from '@mui/joy/Link';
import { AvatarGroup, Badge, Avatar, Divider } from 'rsuite';
import Breadcrumbs from '@mui/joy/Breadcrumbs';
import { FaUsers } from "react-icons/fa6";
import { SiTestcafe, SiTestrail } from "react-icons/si";
import { BarChart, Bar,PieChart,Pie, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import { fetchUsersData } from '../features/UserSlice';
import { workspacesData,sitesData ,buildingsData,activitiesData} from '../features/SuperAdminSlice';

import { useDispatch,useSelector } from 'react-redux';
import { Timeline, Loader } from 'rsuite';

import { LineChart, Line,RadialBarChart, RadialBar} from 'recharts';
import { Pagination , Notification , Uploader, Whisper} from 'rsuite'; 

import refreshToken from '../features/SuperAdminSlice';

import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Item = styled(Sheet)(({ theme }) => ({
    backgroundColor:theme.palette.mode === 'dark' ? theme.palette.background.level1 : '#fff',
    ...theme.typography['body-sm'],
    padding: theme.spacing(1),
    textAlign: 'center',
    borderRadius: 4,
    color: theme.vars.palette.text.secondary,
}));

export default function SuperAdminHome() {

    const navigate=useNavigate();
    const user=JSON.parse(localStorage.getItem('user'));
    const token=localStorage.getItem('token');

    //! all users fetching:
    const dispatch = useDispatch();
    const { users, status, error } = useSelector((state) => state.users);
    const { workspaces, statusWorkspaces , errorWorkspaces } = useSelector((state) => state.workspaces);
    const { sites, statusSites , errorSites } = useSelector((state) => state.sites);
    const { buildings, statusBuildings , errorBuildings } = useSelector((state) => state.buildings);
    const { activities, statusActivities , errorActivities } = useSelector((state) => state.activities);
    
    const {t}=useTranslation();
    
    useEffect(()=>{

        dispatch(activitiesData(token));
        dispatch(workspacesData(token));
        dispatch(sitesData({token}));
        if(user.role==="superadmin"||user.role==="admin"||user.role==="manager"){
            dispatch(buildingsData(token));
        }

    },[dispatch]);
    console.log(activities, statusActivities , errorActivities );
    useEffect(() => {
        const checkAndFetchUsers = async () => {
            let currentToken = token;
            if (currentToken && isTokenExpired(currentToken)) {
                currentToken = await refreshToken();
            }
            if (currentToken) {
                dispatch(fetchUsersData(currentToken));
            } else {
                localStorage.removeItem('token');
                alert('Session expired. Please log in again.');
                navigate('/');
            }
        };

        checkAndFetchUsers();
    }, [dispatch, token]);

    const isTokenExpired = (token) => {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp * 1000 < Date.now();
    };

    const [allReports,setAllReports]=useState([]); 
    const [allUserIncidents,setAllUserIncidents]=useState([]);
    const [totalIncidents,setTotalIncidents]=useState('');
    const [resolvedIncidents,setResolvedIncidents]=useState('');
    const [criticalIncidents,setCriticalIncidents]=useState('');

    const dataRadial = [
        
        {
          name: 'Total workspaces',
          uv: workspaces?workspaces.reduce((total, workspace) => total + (workspace?.sites?.length || 0), 0):0,
        //   pv: 1398,
          fill: '#8dd1e1',
        },
        {
          name: 'Resolved Incidents',
        //   uv: 8.22,
          uv: resolvedIncidents,
          fill: '#82ca9d',
        },
        {
          name: 'Total Incidents',
        //   uv: 8.63,
          uv: totalIncidents,
          fill: '#a4de6c',
        },
        {
          name: t("users.totalUsers"),
        //   uv: 6.67,
          uv: users?.users?.length,
          fill: '#ffc658',
        },
      ];
      
      const style = {
        top: '50%',
        right: 0,
        transform: 'translate(0, -50%)',
        lineHeight: '24px',
      };
    

    const data = [ 
        {
            name: 'Admins',
            nbr: users?.users.filter((user)=>user.role==="admin").length,
        },
        {
            name: 'Managers',
            nbr: users?.users.filter((user)=>user.role==="manager").length,
        },
        {
            name: 'Engineers',
            nbr: users?.users.filter((user)=>user.role==="ingenieur").length,
        },
        {
            name: 'Technicians',
            nbr: users?.users.filter((user)=>user.role==="technicien").length,
        },
        {
            name: 'Regular users',
            nbr: 12
        },
        
    ];

    const data01 = [
        { name: 'Group A', value: 400 },
        { name: 'Group B', value: 300 },
        { name: 'Group C', value: 300 },
        { name: 'Group D', value: 200 },
        { name: 'Group E', value: 278 },
        { name: 'Group F', value: 189 },
    ];
    
    const data02 = [
        { name: 'Group A', value: 2400 },
        { name: 'Group B', value: 4567 },
        { name: 'Group C', value: 1398 },
        { name: 'Group D', value: 9800 },
        { name: 'Group E', value: 3908 },
        { name: 'Group F', value: 4800 },
    ];

    const dataLine = [
        {
          name: 'Page A',
          uv: 4000,
          pv: 2400,
          amt: 2400,
        },
        {
          name: 'Page B',
          uv: 3000,
          pv: 1398,
          amt: 2210,
        },
        {
          name: 'Page C',
          uv: 2000,
          pv: 9800,
          amt: 2290,
        },
        {
          name: 'Page D',
          uv: 2780,
          pv: 3908,
          amt: 2000,
        },
        {
          name: 'Page E',
          uv: 1890,
          pv: 4800,
          amt: 2181,
        },
        {
          name: 'Page F',
          uv: 2390,
          pv: 3800,
          amt: 2500,
        },
        {
          name: 'Page G',
          uv: 3490,
          pv: 4300,
          amt: 2100,
        },
    ];

    

    useEffect(()=>{
        try {
        fetch(`${process.env.REACT_APP_API_URL}/api/auth/allReports`, {
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
            
        })
        }catch (error) {
        console.error('Error:', error); 
        alert('An error occurred while getting the reports.');
        }
    },[])

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

    
  const financialData = [
    { name: 'January', revenue: 10000, expenses: 7000, costPerIncident: 200 },
    { name: 'February', revenue: 12000, expenses: 8000, costPerIncident: 250 },
    { name: 'March', revenue: 15000, expenses: 9000, costPerIncident: 300 },
    { name: 'April', revenue: 13000, expenses: 8500, costPerIncident: 220 },
    { name: 'May', revenue: 14000, expenses: 8800, costPerIncident: 270 },
    { name: 'June', revenue: 16000, expenses: 9200, costPerIncident: 310 },
    { name: 'July', revenue: 17000, expenses: 9500, costPerIncident: 330 },
  ];

const [activePage, setActivePage] = React.useState(1);
  const [itemsPerPage] = useState(5);
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  
    return (
        <div>
            <Breadcrumbs separator=">" aria-label="breadcrumbs" size="sm">
                {[t('dashboard'),''].map((item) => (
                <Link key={item} color="neutral" href="#sizes">
                    <h5>
                        {item} 
                    </h5>
                </Link>
                ))}
            </Breadcrumbs>
            <div className='title_image'>
                <h2 id='title_H2'><SiTestrail style={{color:'rgb(3, 110, 74)'}}/><span> {t('dashboard')} </span></h2>
                <img src="/assets/dashboardOrAnalytics.svg" alt="comp_img" />
            </div>
            <div style={{display:'flex',flexWrap:'wrap',gap:10,justifyContent:'center',width:'100%'}}>
                
                    <Grid container spacing={2} sx={{ flexGrow: 1,width:'100%' }}>
                        <Grid xs={12} sm={12} md={6} lg={6}>
                            <Sheet variant="outlined" color="neutral" sx={{ marginTop:'20px',p: 1,borderRadius:'10px',boxShadow:'0px 0 2px rgb(1, 138, 143)' }}>
                                <Item className='itemsDash' style={{height:'70px',boxShadow:'0px 0 2px rgb(1, 138, 143)',
                                    display:'flex',alignItems:'center',justifyContent:'center'
                                }}>
                                    <h4>{t('welcome')===("Welcome"||"Bienvenue")?t('welcome'):''} {user.name} {t('welcome')==="مرحبا"?t('welcome'):''}</h4>
                                </Item>
                            </Sheet>
                        </Grid>
                        <Grid xs={12} sm={12} md={6} lg={6}>
                            <Sheet variant="outlined" color="neutral" sx={{ marginTop:'20px',p: 1,borderRadius:'10px',boxShadow:'0px 0 2px rgb(1, 138, 143)' }}>
                                <Item  style={{height:'70px',boxShadow:'0px 0 2px rgb(1, 138, 143)',
                                    display:'flex',alignItems:'center',justifyContent:'center',
                                    backgroundImage:'url("/assets/isometric-house.jpg")',
                                    backgroundSize:'cover',
                                    backgroundRepeat:'no-repeat',
                                    backgroundPosition:'center',
                                    // objectFit:'fill'
                                }}>
                                </Item>
                            </Sheet>
                        </Grid>
                    </Grid>
            </div>
            <div style={{display:'flex',flexWrap:'wrap',gap:10,justifyContent:'center',width:'100%',marginTop:'20px'}}>
                <Grid container spacing={2} sx={{ flexGrow: 1,width:'100%' }}>
                    <Grid xs={12} sm={12} md={3} lg={3}>
                        <Sheet variant="outlined" color="neutral" sx={{ p: 1,borderRadius:'10px',boxShadow:'0px 0 2px rgb(1, 138, 143)' }}>
                            <Item className='itemsDash' style={{height:'70px',boxShadow:'0px 0 2px rgb(1, 138, 143)'}}>
                                <Avatar style={{background:'black',position:'absolute',top:'-15px',left:'10px'}}>
                                    <FaUsers />
                                </Avatar>
                                <h6 style={{marginTop:'10px'}}>{t("users.totalUsers")}</h6>
                                <h5 style={{marginTop:'8px'}}>
                                    {users && users.users.length > 0 ? (
                                        <span>{users.users.length}</span>
                                    ) : (
                                        <Loader content="Loading..." />
                                    )
                                    }
                                </h5>
                            </Item>
                        </Sheet>
                    </Grid>
                    <Grid xs={12} sm={12} md={3} lg={3}>
                        <Sheet variant="outlined" color="neutral" sx={{ p: 1,borderRadius:'10px',boxShadow:'0px 0 2px rgb(1, 138, 143)' }}>
                            <Item className='itemsDash' style={{height:'70px',boxShadow:'0px 0 2px rgb(1, 138, 143)'}}>
                                <Avatar style={{background:'rgb(5, 77, 172)',position:'absolute',top:'-15px',left:'10px'}}>
                                    <FaProjectDiagram />
                                </Avatar>
                                <h6 style={{marginTop:'10px'}}>{t("users.totalWorkspaces")}</h6>
                                <h5 style={{marginTop:'8px'}}>
                                    {workspaces && workspaces.length > 0 ? (
                                        <span>{workspaces.length}</span>
                                    ) : (
                                        <Loader content="Loading..." />
                                    )
                                    }
                                </h5>
                            </Item>
                        </Sheet>
                    </Grid>
                    <Grid xs={12} sm={12} md={3} lg={3}>
                        <Sheet variant="outlined" color="neutral" sx={{ p: 1,borderRadius:'10px',boxShadow:'0px 0 2px rgb(1, 138, 143)' }}>
                            <Item className='itemsDash' style={{height:'70px',boxShadow:'0px 0 2px rgb(1, 138, 143)'}}>
                                <Avatar style={{background:'rgba(7,28,75,1)',position:'absolute',top:'-15px',left:'10px'}}>
                                    < SiTestcafe/>
                                </Avatar>
                                <h6 style={{marginTop:'10px'}}>{t("users.totalSites")}</h6>
                                <h5 style={{marginTop:'8px'}}>
                                    {
                                        (user.role==="superadmin"||user.role==="admin"||user.role==="manager")?(
                                            sites && sites.length > 0 ? (
                                                <span>{sites.length}</span>
                                            ) : (
                                                <Loader content="Loading..." />
                                            )
                                        ):(
                                            workspaces && workspaces.length > 0 ? (
                                                <span>{workspaces.reduce((total, workspace) => total + (workspace?.sites?.length || 0), 0)}</span>
                                            ) : (
                                                <Loader content="Loading..." />
                                            )
                                        )
                                    }
                                    
                                </h5>
                            </Item>
                        </Sheet>
                    </Grid>
                    <Grid xs={12} sm={12} md={3} lg={3}>
                        <Sheet variant="outlined" color="neutral" sx={{ p: 1,borderRadius:'10px',boxShadow:'0px 0 2px rgb(1, 138, 143)' }}>
                            <Item className='itemsDash' style={{height:'70px',boxShadow:'0px 0 2px rgb(1, 138, 143)'}}>
                                <Avatar style={{background:'rgb(5, 172, 150)',position:'absolute',top:'-15px',left:'10px'}}>
                                    < FaBuilding/>
                                </Avatar>
                                <h6 style={{marginTop:'10px'}}>{t("users.totalBuildings")}</h6>
                                <h5 style={{marginTop:'8px'}}>
                                    {
                                        (user.role==="superadmin"||user.role==="admin"||user.role==="manager")?(
                                            buildings && buildings.buildings.length > 0 ? (
                                                <span>{buildings.buildings.length}</span>
                                            ) : (
                                                <Loader content="Loading..." />
                                            )
                                        ):(
                                            workspaces && workspaces.length > 0 ? (
                                                <span>{workspaces.reduce((totalBuildings, workspace) => 
                                                    totalBuildings + workspace.sites.reduce((siteTotal, site) => 
                                                        siteTotal + (site?.buildings?.length || 0), 0), 0
                                                )}</span>
                                            ) : (
                                                <Loader content="Loading..." />
                                            )
                                        )
                                    }
                                </h5>
                            </Item>
                        </Sheet>
                    </Grid>
                </Grid>
            </div>
            <div>
                <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                    <Grid sm={12} md={12} xs={12} lg={6}>
                        {/* <Item> */}
                                <ResponsiveContainer width="100%" height="100%">
                                    <Sheet className='sheet_comp' variant="outlined" color="neutral" sx={{ marginTop:'20px',p: 1,borderRadius:'5px',boxShadow:'0px 0 2px rgb(1, 138, 143)' }}>
                                    <Item className='dash_items'>
                                        <center>
                                            <h4>Users by category</h4>
                                        </center>
                        {
                            users&&users?.users?.length>0?( 
                                    <BarChart
                                    
                                    width={520}
                                    height={300}
                                    data={data}
                                    
                                    >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="nbr"  fill="#8884d8" activeBar={<Rectangle fill="pink" stroke="blue" />} />
                                    {/* <Bar dataKey="uv" fill="#82ca9d" activeBar={<Rectangle fill="gold" stroke="purple" />} /> */}
                                </BarChart>
                            ):(
                                <Loader content='...loading'/>
                            )
                        }
                        </Item>
                        </Sheet>
                    </ResponsiveContainer>
                        {/* </Item> */}
                    </Grid>
                    <Grid sm={12} md={12} xs={12} lg={6}>
                        <ResponsiveContainer width="100%" height="100%">
                        <Sheet className='sheet_comp' variant="outlined" color="neutral" sx={{ marginTop:'20px',p: 1,borderRadius:'5px' ,boxShadow:'0px 0 2px rgb(1, 138, 143)'}}>
                            <Item className='dash_items'>
                                <center>
                                    <h4>{t('reportsPage.IPM')}</h4>
                                </center>
                                {
                                    barChartDataArray.length>0?(
                                        <BarChart width={520} height={300} data={barChartDataArray}>
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
                                {/* <PieChart width={530} height={300}>
                                    <Pie
                                        dataKey="value"
                                        isAnimationActive={false}
                                        data={data01}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        fill="#8884d8"
                                        label
                                    />
                                    <Tooltip />
                                </PieChart> */}
                            </Item>
                            </Sheet>
                        </ResponsiveContainer>
                    </Grid>
                    <Grid sm={12} md={12} xs={12} lg={12}>
                    <ResponsiveContainer width="100%" height="100%">
                        <Sheet className='sheet_comp' variant="outlined" color="neutral" sx={{ p: 1, borderRadius: '5px', boxShadow: '0px 0 2px rgb(1, 138, 143)' }}>
                            <Item className='dash_items'>
                                <center>
                                    <h4>Financial Overview</h4>
                                </center>
                                <LineChart
                                    width={1120}
                                    height={300}
                                    data={financialData}
                                    margin={{
                                        top: 5,
                                        left: 20,
                                        bottom: 5,
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis yAxisId="left" />
                                    <YAxis yAxisId="right" orientation="right" />
                                    <Tooltip />
                                    <Legend />
                                    <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#8884d8" activeDot={{ r: 8 }} name="Revenue ($)" />
                                    <Line yAxisId="left" type="monotone" dataKey="expenses" stroke="#82ca9d" name="Expenses ($)" />
                                    <Line yAxisId="right" type="monotone" dataKey="costPerIncident" stroke="#ff7300" name="Cost Per Incident ($)" />
                                </LineChart>
                            </Item>
                        </Sheet>
                    </ResponsiveContainer>
                    </Grid>
                    <Grid sm={12} md={12} xs={12} lg={6}>
                        <ResponsiveContainer width="100%" height="100%">
                        <Sheet className='sheet_comp' variant="outlined" color="neutral" sx={{ p: 1,borderRadius:'5px' ,boxShadow:'0px 0 2px rgb(1, 138, 143)'}}>
                            <Item className='dash_items' style={{maxHeight:'60vh'}}>
                                <center>
                                    <h4>Radial chart</h4>
                                </center>
                                <RadialBarChart width={530} height={300} cx="50%" cy="50%" innerRadius="10%" outerRadius="80%" barSize={10} data={dataRadial}>
                                    <RadialBar
                                    
                                        minAngle={15}
                                        label={{ position: 'insideStart', fill: '#fff' }}
                                        background
                                        clockWise
                                        dataKey="uv"
                                    />
                                    <Legend iconSize={10} layout="vertical" verticalAlign="middle" wrapperStyle={style} />
                                    <Tooltip content={'uv'}/>
                                </RadialBarChart>
                            </Item>
                            </Sheet>
                        </ResponsiveContainer>
                    </Grid>
                    <Grid xs={12} lg={6} >
                        <Sheet className='sheet_comp' variant="outlined" color="neutral" sx={{p: 1,borderRadius:'5px' ,boxShadow:'0px 0 2px rgb(1, 138, 143)'}}>
                            <Item className='dash_items' style={{maxHeight:'60vh'}}>
                                <center>
                                    <h4>Activities</h4>
                                </center>
                                <Timeline endless style={{marginTop:'20px'}}>
                                    {
                                        activities&&activities.slice(startIndex, endIndex).map((activity,index)=>(
                                            <Timeline.Item key={index}> <strong>{activity.created_at}</strong> - <strong>{users&&users.users.find((user)=>user.id===activity.user_id).name}</strong> - {activity.action} - {activity.description}</Timeline.Item>
                                        ))
                                    }
                                </Timeline>
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
                                    total={activities&&activities.length}
                                    limit={itemsPerPage}
                                    activePage={activePage}
                                    onChangePage={setActivePage}
                                    />
                                </div>
                            </Item>
                        </Sheet>
                    </Grid>
                </Grid>
            </div>
        </div>
    )
}
