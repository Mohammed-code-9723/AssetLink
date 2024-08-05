import React from 'react';
import { Button, Input,Grid } from '@mui/joy';
import Tabs from '@mui/joy/Tabs';
import TabList from '@mui/joy/TabList';
import Tab from '@mui/joy/Tab';
import TabPanel from '@mui/joy/TabPanel';
import { Avatar , Divider, Uploader} from 'rsuite';


// import Avatar from '@mui/joy/Avatar';
import FormLabel from '@mui/joy/FormLabel';
import Radio, { radioClasses } from '@mui/joy/Radio';
import RadioGroup from '@mui/joy/RadioGroup';
import Sheet from '@mui/joy/Sheet';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';


export default function SystemSettings() {
    return (
        <div>
            <div style={{width:'100%',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <div>
                    <h3>Settings</h3>
                    <h6>Customize the system settings </h6>
                </div>
                <div style={{width:'30%',display:'flex',justifyContent:'space-around',flexWrap:'wrap'}}>
                    <Button sx={{
                        width:'40%'
                    }}
                    >Cancel</Button>
                    <Button sx={{
                        width:'40%'
                    }}
                    >Save</Button>
                </div>
            </div>
            <div>
                <Tabs
                    aria-label="Vertical tabs"
                    orientation="vertical"
                    sx={{ width: '100%',minHeight:'100vh',marginTop:'30px'}}
                >
                    <TabList>
                        <Tab>General</Tab>
                        <Tab>Preferences</Tab>
                        <Tab>Notifications</Tab>
                        <Tab>Billings</Tab>
                    </TabList>
                    <TabPanel value={0}>
                        <h5>General</h5>
                        <p>Update the platform and your details</p>
                        <Divider/>
                        <div>
                            <h6>
                                Platform details
                            </h6>
                            <p style={{textDecoration:'underline',margin:'10px 0'}}>
                                <b>Change the logo</b>
                            </p>
                            <div style={{width:'50%',display:'flex',justifyContent:'space-between',flexWrap:'wrap',padding:'20px 0'}}>
                                <Avatar circle />
                                <Uploader action="//jsonplaceholder.typicode.com/posts/">
                                    <Button sx={{width:'110px',height:'40px'}}>Upload new</Button>
                                </Uploader>
                                <Button sx={{width:'110px',height:'40px'}}>Delete</Button>
                            </div>
                            <Divider>
                                <p style={{textDecoration:'underline',margin:'10px 0'}}>
                                    <b>Change the platform name</b>
                                </p>
                            </Divider>
                            <div>
                                <Grid container spacing={2} sx={{ flexGrow: 1,width:'100%',display:'flex',gap:'50px' ,justifyContent:'center'}}>
                                    <Grid lg={12}>
                                        <Input type='text' value={'AssetLink'} />
                                    </Grid>
                                </Grid>
                            </div>
                            <Divider>
                                <p style={{textDecoration:'underline',margin:'30px 0'}}>
                                    <b>Change your information's</b>
                                </p>
                            </Divider>  
                            <div>
                                <Grid container spacing={2} sx={{ flexGrow: 1,width:'100%',display:'flex',gap:'50px' ,justifyContent:'center'}}>
                                    <Grid lg={12}>
                                        <span>Email</span>
                                        <Input type='text' placeholder="super admin email" />
                                    </Grid>
                                    <Grid lg={12}>
                                        <span>Password</span>
                                        <Input type='text' placeholder="super admin password" />
                                    </Grid>
                                </Grid>
                            </div>
                        </div>
                    </TabPanel>
                    <TabPanel value={1}>
                        <h5>Preferences</h5> 
                        <p>Customization according to your preferences</p>
                        <Divider/>
                        <div>
                            <h6>
                                Select Theme
                            </h6>
                            <div>
                                <RadioGroup
                                    aria-label="platform"
                                    defaultValue="Website"
                                    overlay
                                    name="platform"
                                    sx={{
                                        flexDirection: 'row',
                                        marginTop:'30px',
                                        gap: 2,
                                        [`& .${radioClasses.checked}`]: {
                                        [`& .${radioClasses.action}`]: {
                                            inset: -1,
                                            border: '3px solid',
                                            borderColor: 'primary.500',
                                        },
                                        },
                                        [`& .${radioClasses.radio}`]: {
                                        display: 'contents',
                                        '& > svg': {
                                            zIndex: 2,
                                            position: 'absolute',
                                            top: '-8px',
                                            right: '-8px',
                                            bgcolor: 'background.surface',
                                            borderRadius: '50%',
                                        },
                                        },
                                    }}
                                    >
                                    {['Light Mode', 'Dark Mode','Custom color'].map((value) => (
                                        <Sheet
                                        key={value}
                                        variant="outlined"
                                        sx={{
                                            borderRadius: 'md',
                                            boxShadow: 'sm',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            gap: 1.5,
                                            p: 2,
                                            width: '30%',
                                            height:'150px'
                                        }}
                                        >
                                        <Radio id={value} value={value} checkedIcon={<CheckCircleRoundedIcon />} />
                                        <Avatar variant="soft" size="lg" />
                                        <FormLabel sx={{position:'absolute',bottom:5}} htmlFor={value}>{value}</FormLabel>
                                        </Sheet>
                                    ))}
                                </RadioGroup>
                                <h6 style={{margin:'30px 0'}}>
                                    Other preferences
                                </h6>
                                <div style={{marginTop:'30px'}}>
                                    <Grid container spacing={2} sx={{ flexGrow: 1,width:'100%'}}>
                                        <Grid lg={4}>
                                            <span>Time Zone</span>
                                        </Grid>
                                        <Grid lg={8}>
                                            <Input type='text' placeholder="select time zone" />
                                        </Grid>
                                        <Grid lg={4}>
                                            <span>Language</span>
                                        </Grid>
                                        <Grid lg={8}>
                                            <Input type='text' placeholder="Select language" />
                                        </Grid>
                                    </Grid>
                                </div>
                            </div>
                        </div>
                    </TabPanel>
                    <TabPanel value={2}>
                        <b>Notifications tab</b> 
                    </TabPanel>
                    <TabPanel value={3}>
                        <b>Billings tab</b> 
                    </TabPanel>
                </Tabs>
            </div>
        </div>
    )
}

