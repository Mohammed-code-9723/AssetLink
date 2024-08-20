import React from 'react';


//
import { styled } from '@mui/joy/styles';
import Sheet from '@mui/joy/Sheet';
import Grid from '@mui/joy/Grid';
//

import Breadcrumbs from '@mui/joy/Breadcrumbs';
import Link from '@mui/joy/Link';
import Stack from '@mui/joy/Stack';
import { AvatarGroup, Badge, Avatar, Divider } from 'rsuite';
import { BsPersonWorkspace } from "react-icons/bs";
import { FaProjectDiagram } from "react-icons/fa";
import { FaBuilding } from "react-icons/fa";
import { BiSolidComponent } from "react-icons/bi";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Pie,PieChart} from 'recharts';



const Item = styled(Sheet)(({ theme }) => ({
    backgroundColor:theme.palette.mode === 'dark' ? theme.palette.background.level1 : '#fff',
    ...theme.typography['body-sm'],
    padding: theme.spacing(1),
    textAlign: 'center',
    borderRadius: 4,
    color: theme.vars.palette.text.secondary,
}));

const data = [
    { name: 'Page A', uv: 400, pv: 2400, amt: 2400 },
    { name: 'Page B', uv: 300, pv: 1398, amt: 2210 },
    { name: 'Page C', uv: 200, pv: 9800, amt: 2290 },
    { name: 'Page D', uv: 278, pv: 3908, amt: 2000 },
    { name: 'Page E', uv: 189, pv: 4800, amt: 2181 },
    { name: 'Page F', uv: 239, pv: 3800, amt: 2500 },
    { name: 'Page G', uv: 349, pv: 4300, amt: 2100 },
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

export default function Home() {
    const workspaces=[
        { workSpace: 1, projects: 25, sites: 'Beta', buildings: 15, components: 340 },
        { workSpace: 2, projects: 47, sites: 'Gamma', buildings: 8, components: 712 },
        { workSpace: 3, projects: 60, sites: 'Alpha', buildings: 20, components: 450 },
    ];

    
    
    return (
        <div >
            <Breadcrumbs separator=">" aria-label="breadcrumbs" size="sm">
                {['Dashboard',''].map((item) => (
                <Link key={item} color="neutral" href="#sizes">
                    <h5>
                        {item} 
                    </h5>
                </Link>
                ))}
            </Breadcrumbs>
            
            <div style={{display:'flex',flexWrap:'wrap',gap:10,justifyContent:'center',width:'100%',marginTop:'20px'}}>
                <Grid container spacing={2} sx={{ flexGrow: 1,width:'100%' }}>
                    <Grid xs={12} sm={12} md={3} lg={3}>
                        <Item style={{height:'70px',boxShadow:'5px 0 10px rgba(7,28,75,1),-5px 0 10px rgba(9,100,60,1),0px 5px 10px rgba(7,28,75,1)'}}>
                            <Avatar style={{background:'black',position:'absolute',top:'-15px',left:'10px'}}>
                                <BsPersonWorkspace />
                            </Avatar>
                            <h5>Workspaces</h5>
                            <h5>0</h5>
                        </Item>
                    </Grid>
                    <Grid xs={12} sm={12} md={3} lg={3}>
                        <Item style={{height:'70px',boxShadow:'5px 0 10px rgba(7,28,75,1),-5px 0 10px rgba(9,100,60,1),0px 5px 10px rgba(7,28,75,1)'}}>
                            <Avatar style={{background:'rgb(5, 77, 172)',position:'absolute',top:'-15px',left:'10px'}}>
                                <FaProjectDiagram />
                            </Avatar>
                            <h5>Projects</h5>
                            <h5>0</h5>
                        </Item>
                    </Grid>
                    <Grid xs={12} sm={12} md={3} lg={3}>
                        <Item style={{height:'70px',boxShadow:'5px 0 10px rgba(7,28,75,1),-5px 0 10px rgba(9,100,60,1),0px 5px 10px rgba(7,28,75,1)'}}>
                            <Avatar style={{background:'rgba(7,28,75,1)',position:'absolute',top:'-15px',left:'10px'}}>
                                <FaBuilding />
                            </Avatar>
                            <h5>Buildings</h5>
                            <h5>0</h5>
                        </Item>
                    </Grid>
                    <Grid xs={12} sm={12} md={3} lg={3}>
                        <Item style={{height:'70px',boxShadow:'5px 0 10px rgba(7,28,75,1),-5px 0 10px rgba(9,100,60,1),0px 5px 10px rgba(7,28,75,1)'}}>
                            <Avatar style={{background:'rgb(5, 172, 150)',position:'absolute',top:'-15px',left:'10px'}}>
                                <BiSolidComponent />
                            </Avatar>
                            <h5>Components</h5>
                            <h5>0</h5>
                        </Item>
                    </Grid>
                </Grid>
                
                <Grid
                container
                rowSpacing={5}
                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                sx={{ width: '100%' ,marginTop:'20px',boxShadow:'5px 0 10px rgba(7,28,75,1),-5px 0 10px rgba(9,100,60,1),0px 5px 10px rgba(7,28,75,1)',borderRadius:'5px'}}
                >
                    <Grid xs={12}>
                        <h3 style={{display:'flex',alignItems:'center'}}><BsPersonWorkspace />&nbsp;&nbsp; Workspaces</h3>
                    </Grid>
                    <Grid xs={12}>
                        <Item>
                            work spaces here
                            
                        </Item>
                    </Grid>
                </Grid>

                <Grid
                container
                rowSpacing={5}
                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                sx={{ width: '100%' ,marginTop:'41px',boxShadow:'5px 0 10px rgba(7,28,75,1),-5px 0 10px rgba(9,100,60,1),0px 5px 10px rgba(7,28,75,1)',borderRadius:'5px'}}
                >
                    <Grid xs={12}>
                        <h3 style={{display:'flex',alignItems:'center'}}><FaProjectDiagram />&nbsp;&nbsp; Projects</h3>
                    </Grid>
                    <Grid xs={12}>
                        <Item>
                            Projects here
                            <LineChart width={600} height={300} data={data}>
                                <Line type="monotone" dataKey="uv" stroke="#8884d8" />
                                <CartesianGrid stroke="#ccc" />
                                <XAxis dataKey="name" />
                                <YAxis />
                            </LineChart>
                        </Item>
                    </Grid>
                </Grid>

                <Grid
                container
                rowSpacing={5}
                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                sx={{ width: '100%' ,marginTop:'41px',boxShadow:'5px 0 10px rgba(7,28,75,1),-5px 0 10px rgba(9,100,60,1),0px 5px 10px rgba(7,28,75,1)',borderRadius:'5px'}}
                >
                    <Grid xs={12}>
                        <h3 style={{display:'flex',alignItems:'center'}}><FaBuilding />&nbsp;&nbsp; Buildings</h3>
                    </Grid>
                    <Grid xs={12}>
                        <Item>
                            Buildings here
                            <LineChart width={600} height={300} data={data}>
                                <Line type="monotone" dataKey="uv" stroke="#8884d8" />
                                <CartesianGrid stroke="#ccc" />
                                <XAxis dataKey="name" />
                                <YAxis />
                            </LineChart>
                        </Item>
                    </Grid>
                </Grid>

                <Grid
                container
                rowSpacing={5}
                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                sx={{ width: '100%' ,marginTop:'41px',marginBottom:'41px',boxShadow:'5px 0 10px rgba(7,28,75,1),-5px 0 10px rgba(9,100,60,1),0px 5px 10px rgba(7,28,75,1)',borderRadius:'5px'}}
                >
                    <Grid xs={12}>
                        <h3 style={{display:'flex',alignItems:'center'}}><BiSolidComponent />&nbsp;&nbsp; Components</h3>
                    </Grid>
                    <Grid xs={12}>
                        <Item>
                            Components here
                            <LineChart width={600} height={300} data={data}>
                                <Line type="monotone" dataKey="uv" stroke="#8884d8" />
                                <CartesianGrid stroke="#ccc" />
                                <XAxis dataKey="name" />
                                <YAxis />
                            </LineChart>
                        </Item>
                    </Grid>
                </Grid>
            </div>
        </div>
    )
}
