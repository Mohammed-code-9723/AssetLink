import React,{useState,useEffect} from 'react'
import { workspacesData } from '../features/SuperAdminSlice';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsersData } from '../features/UserSlice';
import { Panel, Placeholder, AutoComplete } from 'rsuite';

import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';

import CardOverflow from '@mui/joy/CardOverflow';
import { Typography,Divider,Button, Sheet } from '@mui/joy';
import Grid from '@mui/joy/Grid';
import Modal from '@mui/joy/Modal';
import ModalClose from '@mui/joy/ModalClose';
import Site from './Site';
import { SiTestrail } from 'react-icons/si';
import { RiDeleteBin6Fill } from "react-icons/ri";
import { FaEye } from "react-icons/fa6";

import Breadcrumbs from '@mui/joy/Breadcrumbs';
import Link from '@mui/joy/Link';

import { FaMapLocationDot } from "react-icons/fa6";
import { FaDiagramProject } from "react-icons/fa6";
import { useTranslation } from 'react-i18next';


export default function WorkspacesSuperAdmin() {
  
  const dispatch=useDispatch();
  const token = localStorage.getItem('token');
  const { users, status, error } = useSelector((state) => state.users);
  const { workspaces, statusWorkspaces , errorWorkspaces } = useSelector((state) => state.workspaces);
  
  const [allUsers,setAllUsers]=useState([]);
  //!search states:
  const [search,setSearch]=useState("");
  const [filteredUsers,setFilteredUsers]=useState(null);

  const [openMoreDetails,setOpenMoreDetails]=useState(false);
  const [chosenWorkspace,setChosenWorkspace]=useState(null);
  const [chosenWorkspaceProjects,setChosenWorkspaceProjects]=useState([]);
  const [chosenWorkspaceSites,setChosenWorkspaceSites]=useState([]);
  const {t } = useTranslation();

  useEffect(() => {
    if (users) {
      setAllUsers(users.users);
    }
  }, [users]);

  useEffect(()=>{
    dispatch(fetchUsersData(token));
    dispatch(workspacesData(token));
  },[]);

  useEffect(()=>{
    setFilteredUsers(allUsers.filter((user)=>user.name.includes(search)||user.email.includes(search)||user.role.includes(search)));
  },[search])

  const moreDetails=(workspace)=>{
    setOpenMoreDetails(true);
    setChosenWorkspaceProjects(workspaces.find(w=>w.id===workspace.id).projects);
    setChosenWorkspaceSites(workspaces.find(w=>w.id===workspace.id).sites);
    setChosenWorkspace(workspace);
  }

  return (
    <div>
      <Breadcrumbs separator=">" aria-label="breadcrumbs" size="sm">
        {[t('dashboard'),t('users.users'),t('users.workspaces')].map((item) => (
        <Link key={item} color="neutral" href="#sizes">
            <h5>
                {item} 
            </h5>
        </Link>
        ))}
      </Breadcrumbs>
      <center>
        <div style={{width:'100%',display:'flex',justifyContent:'space-evenly',margin:'20px 0'}}>
          <AutoComplete data={allUsers.map((user)=>user.name)} style={{ width: '30%' }} 
            placeholder={t('search.name')}
            onChange={(value)=>setSearch(value)}  
          />
          <AutoComplete data={allUsers.map((user)=>user.email)} style={{ width: '30%' }} 
            placeholder={t('search.email')}
            onChange={(value)=>setSearch(value)}  
          />
          <AutoComplete data={allUsers.map((user)=>user.role)} style={{ width: '30%' }} 
            placeholder={t('search.role')}
            onChange={(value)=>setSearch(value)}  
          />
          <Button onClick={()=>{setSearch("");setFilteredUsers(null)}}>{t('search.clear')}</Button>
        </div>
      </center>
      <div>
        <Grid container spacing={2} sx={{ flexGrow: 1,width:'100%',display:'flex',gap:'10px' ,justifyContent:'center'}}>
          {
            filteredUsers&&search!==""?(
              filteredUsers.map((user,index)=>(
                <Grid lg={5} xs={12} >
                  <Card variant="outlined"  key={index}>
                    <CardContent>
                      <Typography level="title-md">{user.name}</Typography>
                      <Typography level="body-sm">{user.email}</Typography>
                    </CardContent>
                    <CardOverflow variant="soft" sx={{ bgcolor: 'background.level1' }}>
                      <Divider inset="context" />
                      <CardContent orientation="horizontal" sx={{width:'100%',direction:t('workspaces.name')==="الاسم"?'rtl':'lfr'}}>
                          {t('users.nbrWorkspaces')}: <strong>{user.workspaces.length}</strong>
                        <Divider orientation="horizontal" />
                      </CardContent>
                      <CardContent>
                        <Panel header={t("users.workspaces")} collapsible bordered>
                          {
                            user.workspaces.map((workspace,index)=>(
                              < Card key={index} sx={{marginBottom:'10px',
                                
                              }} >
                                <CardOverflow variant="soft" sx={{
                                  width:'100%'
                                  ,direction:t('workspaces.name')==="الاسم"?'rtl':'lfr'
                                }}>
                                  <b>{t('workspace')}: {index+1}</b>
                                  <p>{t('workspaces.name')}: {workspace.name} </p>
                                  <p>{t('workspaces.description')}: {workspace.description} </p>
                                </CardOverflow>
                                <CardOverflow
                                  variant="soft"
                                  sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    gap: 1,
                                    justifyContent: 'space-around',
                                    py: 1,
                                    borderTop: '1px solid',
                                    borderColor: 'divider',
                                  }}
                                >
                                  <Typography startDecorator={<FaDiagramProject color="danger" />} level="title-sm">
                                    {t('users.nbrProjects')}: {workspaces&&workspaces.find(w=>w.id===workspace.id).projects.length}
                                  </Typography>
                                  <Divider orientation="vertical" />
                                  <Typography startDecorator={<FaMapLocationDot />} level="title-sm">
                                    {t('users.nbrSites')}: {workspaces&&workspaces.find(w=>w.id===workspace.id).sites.length}
                                  </Typography>
                                </CardOverflow>
                                <CardContent sx={{
                                  width:'100%',
                                  display:'flex',
                                  flexWrap:'wrap'
                                }}>
                                  <Button  style={{width:'100%'}} onClick={()=>moreDetails(workspace,workspace.projects,workspace.sites)}>
                                    <span style={{width:'20%'}}>
                                      <FaEye/>
                                    </span>
                                    <span style={{width:'80%'}}>
                                      { t('users.showPS')}
                                    </span>
                                  </Button>
                                  <Button style={{width:'100%'}} sx={{background:'red'}} >
                                    <span style={{width:'20%'}}>
                                      <RiDeleteBin6Fill/>
                                    </span>
                                    <span style={{width:'80%'}}>
                                      {t('users.deleteW')}
                                    </span>
                                  </Button>
                                </CardContent>
                                </Card> 
                            ))
                          }
                        </Panel>
                      </CardContent>
                      
                    </CardOverflow>
                  </Card>
                </Grid>
              ))
            ):(
              allUsers.map((user,index)=>(
                <Grid lg={5} xs={12} >
                  <Card variant="outlined"  key={index}>
                    <CardContent>
                      <Typography level="title-md">{user.name}</Typography>
                      <Typography level="body-sm">{user.email}</Typography>
                    </CardContent>
                    <CardOverflow variant="soft" sx={{ bgcolor: 'background.level1' }}>
                      <Divider inset="context" />
                      <CardContent orientation="horizontal" sx={{width:'100%',direction:t('workspaces.name')==="الاسم"?'rtl':'lfr'}}>
                          {t('users.nbrWorkspaces')}: <strong>{user.workspaces.length}</strong>
                        <Divider orientation="horizontal" />
                      </CardContent>
                      <CardContent>
                        <Panel header={t("users.workspaces")} collapsible bordered>
                          {
                            user.workspaces.map((workspace,index)=>(
                              <Card key={index} sx={{marginBottom:'10px',
                                width:'100%',

                                
                              }}>
                                <CardOverflow variant="soft" sx={{
                                  width:'100%'
                                  ,direction:t('workspaces.name')==="الاسم"?'rtl':'lfr'
                                }}>
                                  <b>{t('workspace')}: {index+1}</b>
                                  <p>{t('workspaces.name')}: {workspace.name} </p>
                                  <p>{t('workspaces.description')}: {workspace.description} </p>
                                </CardOverflow>
                                <CardOverflow
                                  variant="soft"
                                  sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    gap: 1,
                                    justifyContent: 'space-around',
                                    py: 1,
                                    borderTop: '1px solid',
                                    borderColor: 'divider',
                                  }}
                                >
                                  <Typography startDecorator={<FaDiagramProject color="danger" />} level="title-sm">
                                    {t('users.nbrProjects')}: {workspaces&&workspaces.find(w=>w.id===workspace.id).projects.length}
                                  </Typography>
                                  <Divider orientation="vertical" />
                                  <Typography startDecorator={<FaMapLocationDot />} level="title-sm">
                                    {t('users.nbrSites')}: {workspaces&&workspaces.find(w=>w.id===workspace.id).sites.length}
                                  </Typography>
                                </CardOverflow>
                                <CardContent sx={{
                                  width:'100%',
                                  display:'flex',
                                  flexWrap:'wrap'
                                }}>
                                  <Button  style={{width:'100%'}} onClick={()=>moreDetails(workspace,workspace.projects,workspace.sites)}>
                                    <span style={{width:'20%'}}>
                                      <FaEye/>
                                    </span>
                                    <span style={{width:'80%'}}>
                                      { t('users.showPS')}
                                    </span>
                                  </Button>
                                  <Button style={{width:'100%'}} sx={{background:'red'}} >
                                    <span style={{width:'20%'}}>
                                      <RiDeleteBin6Fill/>
                                    </span>
                                    <span style={{width:'80%'}}>
                                      {t('users.deleteW')}
                                    </span>
                                  </Button>
                                </CardContent>
                              </Card> 
                            ))
                          }
                        </Panel>
                      </CardContent>
                      
                    </CardOverflow>
                  </Card>
                </Grid>
              ))
            )
          }
        </Grid>
      </div>
      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={openMoreDetails}
        onClose={() => {
          setOpenMoreDetails(false);
          setChosenWorkspaceProjects([]);
          setChosenWorkspaceSites([]);
          setChosenWorkspace(null);
          }
        }
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <Sheet
          variant="outlined"
          sx={{
            width:'100%',
            height:'98vh',
            overflowY:'scroll',
            borderRadius: 'md',
            p: 3,
            boxShadow: 'lg',
          }}
        >
          <ModalClose variant="plain" sx={{ m: 1 }} />
          <Typography
            component="h2"
            id="modal-title"
            level="h4"
            textColor="inherit"
            fontWeight="lg"
            textAlign="center"
            mb={1}
            sx={{
              width:'100%',
              display:'flex',
              justifyContent:'center',
              flexDirection:'column'
            }}
          >
            <h2>{t('workspace')} <span id='title_H2_2'>{chosenWorkspace&&chosenWorkspace.name}</span> {t('details')} </h2><br />
            <center>
              <Breadcrumbs separator=">" aria-label="breadcrumbs" size="sm" sx={{width:'100%'}}>
              {[t('users.workspaces'),`${t('workspace')} ${chosenWorkspace&&chosenWorkspace.name}`,t('sites')].map((item) => (
              <Link className='Link_breadcrumbs' key={item} color="neutral" href="#sizes">
                <h5>
                  {item}
                </h5>
              </Link>
              ))}
              </Breadcrumbs>
            </center>
          </Typography>
          <div>
            <div className='title_image'>
              <h2 id='title_H2'><SiTestrail style={{color:'rgb(3, 110, 74)'}}/><span> {t('projects')} </span></h2>
              <img src="/assets/Sites.svg" alt="sites_img" />
            </div>
            <div>
              <Sheet
                variant="soft"
                sx={{
                  // width:'95%',
                  // height:'20vh',
                  // overflowY:'scroll',
                  borderRadius: 'md',
                  zIndex:1000,
                  p: 3,
                  boxShadow: 'lg',
                  boxShadow:'0 0 5px rgba(176, 175, 175, 0.786)',
                  marginBottom:'20px'
                }}
                color="neutral" 
              >
                {
                  chosenWorkspaceProjects.length===0?(
                    <center>
                      <h3>This workspace has no projects</h3>
                    </center>
                  ):(
                    chosenWorkspaceProjects.map((project,index)=>(
                      <Panel key={index} header={project.name} collapsible bordered>
                        <div>
                          <p>
                            {project.description}
                          </p>
                        </div>
                      </Panel>
                    ))
                  )
                }
              </Sheet>
            </div>
            {/* <Divider/> */}
            <Site sites={chosenWorkspaceSites} projects={chosenWorkspaceProjects}/>
          </div>
        </Sheet>
      </Modal>
    </div>
  )
}
