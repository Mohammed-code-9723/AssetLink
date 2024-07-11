import React from 'react';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import CardActions from '@mui/joy/CardActions';
import Chip from '@mui/joy/Chip';
import Divider from '@mui/joy/Divider';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import Typography from '@mui/joy/Typography';
import Check from '@mui/icons-material/Check';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
//
import Tabs from '@mui/joy/Tabs';
import TabList from '@mui/joy/TabList';
import Tab, { tabClasses } from '@mui/joy/Tab';
import { TabPanel } from '@mui/joy';
import '../styles/Pricing.css';


export default function Pricing() {
    return (
        <div 
            className='pricing_container'
            >
                <h1>Pricing</h1>
                <center>
                    <div
                        className='pricing_hero_section'
                        >
                        <h2 id='hero_title'>
                            Find the Perfect Plan for Your Needs
                        </h2>
                        <h3 id='sec_hero_title'>
                            Simple, transparent pricing to fit your business.
                        </h3>
                        <p id='par_hero_title'>
                            Choose from our flexible pricing plans designed to scale with your real estate portfolio. Whether you prefer the cost savings of an annual plan or the flexibility of a monthly subscription, we have the right option for you. Start managing your properties more efficiently with AssetLink today.
                        </p>
                    </div>
                </center>
                <center>
                <Tabs aria-label="tabs" defaultValue={0} sx={{ bgcolor: 'transparent' }}>
                    <center>
                        <TabList
                            disableUnderline
                            sx={{
                            p: 0.5,
                            gap: 0.5,
                            borderRadius: 'xl',
                            bgcolor: 'background.level1',
                            [`& .${tabClasses.root}[aria-selected="true"]`]: {
                                boxShadow: 'sm',
                                bgcolor: 'background.surface',
                            },
                            width:'fit-content'
                            }}
                        >
                            <Tab disableIndicator>Yearly</Tab>
                            <Tab disableIndicator>Monthly</Tab>
                        </TabList>
                    </center>
                    <TabPanel value={0}>
                        <Typography level="inherit">
                        Get started with the industry-standard React UI library, MIT-licensed.
                        </Typography>
                        <Typography textColor="success.400" fontSize="xl3" fontWeight="xl" mt={1}>
                        $0{' '}
                        <Typography fontSize="sm" textColor="text.secondary" fontWeight="md">
                            － Free forever
                        </Typography>
                        </Typography>
                    </TabPanel>
                    <TabPanel value={1}>
                        <Typography level="inherit">
                        Best for professional developers building enterprise or data-rich
                        applications.
                        </Typography>
                        <Typography textColor="primary.400" fontSize="xl3" fontWeight="xl" mt={1}>
                        $15{' '}
                        <Typography fontSize="sm" textColor="text.secondary" fontWeight="md">
                            / dev / month
                        </Typography>
                        </Typography>
                    </TabPanel>
                    <TabPanel value={2}>
                        <Typography level="inherit">
                        The most advanced features for data-rich applications, as well as the
                        highest priority for support.
                        </Typography>
                        <Typography textColor="primary.400" fontSize="xl3" fontWeight="xl" mt={1}>
                        <Typography
                            fontSize="xl"
                            borderRadius="sm"
                            px={0.5}
                            mr={0.5}
                            sx={(theme) => ({
                            ...theme.variants.soft.danger,
                            color: 'danger.400',
                            verticalAlign: 'text-top',
                            textDecoration: 'line-through',
                            })}
                        >
                            $49
                        </Typography>
                        $37*{' '}
                        <Typography fontSize="sm" textColor="text.secondary" fontWeight="md">
                            / dev / month
                        </Typography>
                        </Typography>
                    </TabPanel>
                </Tabs>
                </center>
                <Box
                    sx={{
                        width: '100%',
                        display: 'flex',
                        gap: 2,
                        marginTop:'50px',
                        justifyContent:'center',
                    }}
                    >
                    <Card size="lg" variant="outlined" 
                    sx={{
                        width: '30%',
                    }}
                    >
                        <Chip size="sm" variant="outlined" color="neutral">
                        BASIC
                        </Chip>
                        <Typography level="h2">Professional</Typography>
                        <Divider inset="none" />
                        <List size="sm" sx={{ mx: 'calc(-1 * var(--ListItem-paddingX))' }}>
                        <ListItem>
                            <ListItemDecorator>
                            <Check />
                            </ListItemDecorator>
                            Virtual Credit Cards
                        </ListItem>
                        <ListItem>
                            <ListItemDecorator>
                            <Check />
                            </ListItemDecorator>
                            Financial Analytics
                        </ListItem>
                        <ListItem>
                            <ListItemDecorator>
                            <Check />
                            </ListItemDecorator>
                            Checking Account
                        </ListItem>
                        <ListItem>
                            <ListItemDecorator>
                            <Check />
                            </ListItemDecorator>
                            API Integration
                        </ListItem>
                        </List>
                        <Divider inset="none" />
                        <CardActions>
                        <Typography level="title-lg" sx={{ mr: 'auto' }}>
                            3.990€{' '}
                            <Typography fontSize="sm" textColor="text.tertiary">
                            / month
                            </Typography>
                        </Typography>
                        <Button
                            variant="soft"
                            color="neutral"
                            endDecorator={<KeyboardArrowRight />}
                        >
                            Start now
                        </Button>
                        </CardActions>
                    </Card>
                    <Card
                        size="lg"
                        variant="solid"
                        color="neutral"
                        invertedColors
                        sx={{ bgcolor: 'neutral.900',color:'white' ,width: '30%'}}
                    >
                        <Chip size="sm" variant="outlined">
                        MOST POPULAR
                        </Chip>
                        <Typography level="h2" sx={{color:'white'}}>Unlimited</Typography>
                        <Divider inset="none" />
                        <List
                        size="sm"
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            mx: 'calc(-1 * var(--ListItem-paddingX))',
                            color:'whitesmoke'
                        }}
                        >
                        <ListItem>
                            <ListItemDecorator>
                            <Check />
                            </ListItemDecorator>
                            Virtual Credit Cards
                        </ListItem>
                        <ListItem>
                            <ListItemDecorator>
                            <Check />
                            </ListItemDecorator>
                            Financial Analytics
                        </ListItem>
                        <ListItem>
                            <ListItemDecorator>
                            <Check />
                            </ListItemDecorator>
                            Checking Account
                        </ListItem>
                        <ListItem>
                            <ListItemDecorator>
                            <Check />
                            </ListItemDecorator>
                            API Integration
                        </ListItem>
                        <ListItem>
                            <ListItemDecorator>
                            <Check />
                            </ListItemDecorator>
                            Cancel Anytime
                        </ListItem>
                        </List>
                        <Divider inset="none" />
                        <CardActions>
                        <Typography level="title-lg" sx={{ mr: 'auto' ,color:'white'}}>
                            5.990€{' '}
                            <Typography fontSize="sm" textColor="text.tertiary">
                            / month
                            </Typography>
                        </Typography>
                        <Button endDecorator={<KeyboardArrowRight />}>Start now</Button>
                        </CardActions>
                    </Card>
                </Box>
            </div>
    )
}
