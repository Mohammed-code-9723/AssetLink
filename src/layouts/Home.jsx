import React from 'react';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import Box from '@mui/joy/Box';
import CardContent from '@mui/joy/CardContent';
import CardActions from '@mui/joy/CardActions';
import CircularProgress from '@mui/joy/CircularProgress';
import Typography from '@mui/joy/Typography';
import SvgIcon from '@mui/joy/SvgIcon';

const CardComponent=({workspace,projects,sites,buildings,components})=>(
    <Card variant="solid" color="primary" invertedColors sx={{
        width:'30%'
    }}>
                <CardContent orientation="horizontal">
                    <CircularProgress size="lg" determinate value={projects}>
                    <SvgIcon>
                        <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"
                        />
                        </svg>
                    </SvgIcon>
                    </CircularProgress>
                    <CardContent>
                        <Typography level="body-md">Work space : </Typography>
                        <Typography level="h2">{workspace} </Typography>
                        <Typography level="body-md">Projects: </Typography>
                        <Typography level="h2">{projects}</Typography>
                        <Typography level="body-md">sites: </Typography>
                        <Typography level="h2">{sites}</Typography>
                    </CardContent>
                </CardContent>
                <CardActions sx={{
                    width:'100%',
                    display:'flex',
                    justifyContent:'space-around'
                }}>
                    <Box>
                        <Typography level="body-md">buildings: </Typography>
                        <Typography level="h2">{buildings}</Typography>
                    </Box>
                    <Box>
                        <Typography level="body-md">Components: </Typography>
                        <Typography level="h2">{components}</Typography>
                    </Box>
                </CardActions>
            </Card>
);
export default function Home() {
    const data=[
        { workSpace: 1, projects: 25, sites: 'Beta', buildings: 15, components: 340 },
        { workSpace: 2, projects: 47, sites: 'Gamma', buildings: 8, components: 712 },
        { workSpace: 3, projects: 60, sites: 'Alpha', buildings: 20, components: 450 },
        // { workSpace: 4, projects: 38, sites: 'Delta', buildings: 10, components: 300 },
        // { workSpace: 5, projects: 89, sites: 'Epsilon', buildings: 5, components: 670 },
        // { workSpace: 6, projects: 20, sites: 'Zeta', buildings: 30, components: 520 },
        // { workSpace: 7, projects: 95, sites: 'Eta', buildings: 12, components: 430 },
        // { workSpace: 8, projects: 40, sites: 'Theta', buildings: 25, components: 310 },
        // { workSpace: 9, projects: 55, sites: 'Iota', buildings: 18, components: 620 },
        // { workSpace: 10, projects: 70, sites: 'Kappa', buildings: 22, components: 710 }
    ];
    
    return (
        <div >
            Home
            <div style={{display:'flex',flexWrap:'wrap',gap:10,justifyContent:'center',width:'100%'}}>
                {
                    data.map((item,index)=>(
                        <CardComponent 
                        workspace={item.workSpace}
                        projects={item.projects}
                        sites={item.sites}
                        buildings={item.buildings}
                        components={item.components}
                        />
                    ))
                }
            </div>
        </div>
    )
}
