import React ,{useState} from 'react';
import { Button, Input,Grid } from '@mui/joy';
import Tabs from '@mui/joy/Tabs';
import TabList from '@mui/joy/TabList';
import Tab from '@mui/joy/Tab';
import TabPanel from '@mui/joy/TabPanel';
import { Avatar , Divider, Uploader,TagPicker} from 'rsuite';

import { 
    Card, 
    CardContent, 
    Typography, 
    List, 
    ListItem, 
    ListItemText, 
    Table, 
    TableHead, 
    TableRow, 
    TableCell, 
    TableBody, 
    Chip, 
    IconButton,
    TextField
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import {  FormControlLabel, Switch, FormGroup, Checkbox } from '@mui/material';

// import Avatar from '@mui/joy/Avatar';
import FormLabel from '@mui/joy/FormLabel';
import Radio, { radioClasses } from '@mui/joy/Radio';
import RadioGroup from '@mui/joy/RadioGroup';
import Sheet from '@mui/joy/Sheet';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';

const dataLanguages = ['العربية', 'Français', 'English', 'Allemande', 'Italian', 'Russian'].map(
    item => ({ label: item, value: item })
);


export default function SystemSettings() {
    const [plans, setPlans] = useState([
        { name: 'Basic Plan', price: 99.99, description: 'Suitable plan for starter business', features: ['Customers Segmentation', 'Google Integrations', 'Activity Reminder'] },
        { name: 'Enterprise Plan', price: 119.99, description: 'Best plan for mid-sized businesses', features: ['Get a Basic Plans', 'Access All Feature', 'Get 1TB Cloud Storage'] },
        { name: 'Professional Plan', price: 149.99, description: 'Suitable plan for starter', features: ['Get Enterprise Plan', 'Access All Feature', 'Get 2TB Cloud Storage'] },
    ]);

    const [editMode, setEditMode] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const [newPrice, setNewPrice] = useState('');

    const handleEdit = (index) => {
        setEditingIndex(index);
        setNewPrice(plans[index].price);
        setEditMode(true);
    };

    const handleSave = () => {
        const updatedPlans = plans.map((plan, index) =>
            index === editingIndex ? { ...plan, price: parseFloat(newPrice) } : plan
        );
        setPlans(updatedPlans);
        setEditMode(false);
        setEditingIndex(null);

        //API to the backend
    };
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
                                            <TagPicker defaultValue={['العربية', 'Français', 'English']} data={dataLanguages} style={{width:'100%'}}/>
                                        </Grid>
                                    </Grid>
                                </div>
                            </div>
                        </div>
                    </TabPanel>
                    <TabPanel value={2}>
                        <h5>Notifications</h5>
                        <p>Get notified about what's happening right now. You can turn off at any time.</p>
                        <Divider />
                        <div>
                            <h6>Email Notifications</h6>
                            <FormControlLabel
                                control={<Switch defaultChecked />}
                                label="On"
                            />
                            <FormGroup>
                                <FormControlLabel control={<Checkbox defaultChecked />} label="News and Update Settings" />
                                <FormControlLabel control={<Checkbox />} label="Tips and Tutorials" />
                                <FormControlLabel control={<Checkbox defaultChecked />} label="Offer and Promotions" />
                            </FormGroup>
                            <Divider sx={{ margin: '20px 0' }} />
                            <h6>More Activity</h6>
                            <FormControlLabel
                                control={<Switch defaultChecked />}
                                label="On"
                            />
                            <FormGroup>
                                <FormControlLabel control={<Checkbox />} label="All Reminders & Activity" />
                                <FormControlLabel control={<Checkbox />} label="Activity only" />
                                <FormControlLabel control={<Checkbox defaultChecked />} label="Important Reminder only" />
                            </FormGroup>
                        </div>
                    </TabPanel>
                    <TabPanel value={3}>
                        <h5>Billings</h5>
                        <p>Pick a billing plan that suits you</p>
                        <Divider />
                        <Grid container spacing={2}>
                            {plans.map((plan, index) => (
                                <Grid item xs={4} key={index}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6">{plan.name}</Typography>
                                            {editMode && editingIndex === index ? (
                                                <TextField
                                                    variant="outlined"
                                                    label="Price"
                                                    value={newPrice}
                                                    onChange={(e) => setNewPrice(e.target.value)}
                                                    fullWidth
                                                />
                                            ) : (
                                                <Typography variant="h5">${plan.price}/year</Typography>
                                            )}
                                            <Typography variant="body2">{plan.description}</Typography>
                                            <List>
                                                {plan.features.map((feature, i) => (
                                                    <ListItem key={i}>
                                                        <ListItemText primary={feature} />
                                                    </ListItem>
                                                ))}
                                            </List>
                                            {editMode && editingIndex === index ? (
                                                <Button variant="contained" color="primary" onClick={handleSave}>Save</Button>
                                            ) : (
                                                <Button variant="contained" onClick={() => handleEdit(index)}>Edit Price</Button>
                                            )}
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                        <Divider sx={{ margin: '20px 0' }} />
                        <Typography variant="h6">Billing History</Typography>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>No</TableCell>
                                    <TableCell>Invoices</TableCell>
                                    <TableCell>Created Date</TableCell>
                                    <TableCell>Amount</TableCell>
                                    <TableCell>Plan</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell>01</TableCell>
                                    <TableCell>Invoice#129810</TableCell>
                                    <TableCell>25 Dec 2023</TableCell>
                                    <TableCell>$149.99</TableCell>
                                    <TableCell>Professional Plan</TableCell>
                                    <TableCell><Chip label="Success" color="success" /></TableCell>
                                    <TableCell>
                                        <IconButton><EditIcon /></IconButton>
                                        <IconButton><DeleteIcon /></IconButton>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>02</TableCell>
                                    <TableCell>Invoice#129810</TableCell>
                                    <TableCell>05 Jul 2023</TableCell>
                                    <TableCell>$149.99</TableCell>
                                    <TableCell>Professional Plan</TableCell>
                                    <TableCell><Chip label="Success" color="success" /></TableCell>
                                    <TableCell>
                                        <IconButton><EditIcon /></IconButton>
                                        <IconButton><DeleteIcon /></IconButton>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TabPanel>
                </Tabs>
            </div>
        </div>
    )
}

