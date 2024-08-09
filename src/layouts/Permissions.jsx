import React, { useEffect, useState } from 'react';
import { Form, Button, Divider, Accordion, Stack, Avatar ,Message} from 'rsuite';
import { fetchUsersData } from '../features/UserSlice';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import Checkbox from '@mui/joy/Checkbox';
import Chip from '@mui/joy/Chip';
import CheckIcon from '@mui/icons-material/Check';
import { Box, Breadcrumbs ,Link} from '@mui/joy';
import { updateUsersPermissions } from '../features/SuperAdminSlice';
import { TbShieldCancel } from "react-icons/tb";
import { LuShieldCheck } from "react-icons/lu";
import { useTranslation } from 'react-i18next';

import { MdSupervisorAccount } from "react-icons/md";
import { MdAdminPanelSettings } from "react-icons/md";

const Header = props => {
  const { avatarUrl, title, subtitle, ...rest } = props;
  return (
    <Stack {...rest} spacing={10} alignItems="flex-start" style={{
      background: 'linear-gradient(124deg, rgba(7,28,75,1) 0%, rgba(9,100,60,1) 100%)',
      padding: '10px',
      borderRadius: '5px',
    }}>
      <Avatar color="blue" bordered circle src={avatarUrl || "https://i.pravatar.cc/150?u=1"} />
      <Stack spacing={2} direction="column" alignItems="flex-start">
        <div style={{ color: 'white' }}>{title}</div>
        <div style={{ color: 'var(--rs-text-secondary)', fontSize: 12 }}>{subtitle}</div>
        <img style={{position:"absolute",right:"90px",bottom:"33px",width:"40px",height:"40px"}} src={subtitle==="admin"?"/assets/admin.png":(subtitle==="manager")?"/assets/manager.png":(subtitle==="ingenieur")?"/assets/ingenieur.png":"/assets/mechanic.png"} alt="p" />
      </Stack>
    </Stack>
  );
};

export default function Permissions() {
  const dispatch = useDispatch();
  const token = localStorage.getItem('token');
  const { users, status, error } = useSelector((state) => state.users);
  const { message, statusPermissions, errorPermissions } = useSelector((state) => state.usersPermissions);
  const [allUsers, setAllUsers] = useState([]);
  const [usersChanged, setUsersChanged] = useState([]);
  const [changed, setChanged] = useState(false);
  const [nameUser,setNameUser]=useState("");
  const {t } = useTranslation();

  useEffect(() => {
    if (users) {
      setAllUsers(users.users);
    }
  }, [users]);

  useEffect(() => {
    dispatch(fetchUsersData(token));
  }, [dispatch, token]);

  if (!token) {
    return <Navigate to="/" />;
  }

  const handleUserPermissionChange = (user, section, permission) => {
    setChanged(true);
    setNameUser("");
    const updatedUsers = allUsers.map(u => {
      if (u.id === user.id) {
        setNameUser(user.name);
        const parsedPermissions = JSON.parse(u.permissions);
        const sectionPermissions = parsedPermissions[section] || [];

        if (sectionPermissions.includes(permission)) {
          parsedPermissions[section] = sectionPermissions.filter(perm => perm !== permission);
        } else {
          parsedPermissions[section] = [...sectionPermissions, permission];
        }

        const updatedUser = { ...u, permissions: JSON.stringify(parsedPermissions) };
        const existingChangedUser = usersChanged.find(changedUser => changedUser.id === user.id);
        if (existingChangedUser) {
          setUsersChanged(usersChanged.map(changedUser => changedUser.id === user.id ? updatedUser : changedUser));
        } else {
          setUsersChanged([...usersChanged, updatedUser]);
        }

        return updatedUser;
      }
      return u;
    });

    setAllUsers(updatedUsers);
  };

  const handleSave = () => {
    const updatedUsers = allUsers.map(u => {
      const changedUser = usersChanged.find(changed => changed.id === u.id);
      return changedUser || u;
    });
    setAllUsers(updatedUsers);
    dispatch(updateUsersPermissions({updatedUsers,token})).then(()=>{
      setChanged(false);
      setUsersChanged([]);
    });
  };

  const handleCancel = () => {
    setChanged(false);
    setUsersChanged([]);
  };
  

  return (
    <div>
      <Breadcrumbs separator=">" aria-label="breadcrumbs" size="sm">
        {[t('dashboard'),t('users.users'),t('users.permissions')].map((item) => (
        <Link key={item} color="neutral" href="#sizes">
            <h5>
                {item} 
            </h5>
        </Link>
        ))}
      </Breadcrumbs>
      {
        message && statusPermissions==="succeeded" && nameUser!==""?(
          <div>
            <Message showIcon type={'success'} closable>
              <strong>{message} for:  {nameUser}</strong>
            </Message>
          </div>
        ):''
      }
      <Accordion bordered>
        {allUsers.map((user, index) => (
          <Accordion.Panel
            key={user.id}
            header={
              <Header
                title={user.name}
                subtitle={user.role}
              />
            }
            eventKey={index}
          >
            <div style={{ height: '100%', width: '100%', zIndex: '-1' }}>
              
              {Object.keys(JSON.parse(user.permissions)).map((section, i) => (
                <React.Fragment key={i}>
                  <Divider><h3>{section}</h3></Divider>
                  {/* create */}
                  <Box
                    sx={{
                      display: 'flex',
                      width: '100%',
                      flexWrap: 'wrap',
                      justifyContent: 'space-evenly'
                    }}
                  >
                    <Chip
                      variant="plain"
                      color={JSON.parse(user.permissions)[section].includes('create') ? 'primary' : 'neutral'}
                      startDecorator={
                        JSON.parse(user.permissions)[section].includes('create') && <CheckIcon sx={{ zIndex: 1, pointerEvents: 'none' }} />
                      }
                    >
                      <Checkbox
                        variant="outlined"
                        color={JSON.parse(user.permissions)[section].includes('create') ? 'primary' : 'neutral'}
                        disableIcon
                        overlay
                        label={"create"}
                        checked={JSON.parse(user.permissions)[section].includes('create')}
                        onChange={() => handleUserPermissionChange(user, section, 'create')}
                      />
                    </Chip>
                  {/* read */}
                    <Chip
                      variant="plain"
                      color={JSON.parse(user.permissions)[section].includes('read') ? 'primary' : 'neutral'}
                      startDecorator={
                        JSON.parse(user.permissions)[section].includes('read') && <CheckIcon sx={{ zIndex: 1, pointerEvents: 'none' }} />
                      }
                    >
                      <Checkbox
                        variant="outlined"
                        color={JSON.parse(user.permissions)[section].includes('read') ? 'primary' : 'neutral'}
                        disableIcon
                        overlay
                        label={"read"}
                        checked={JSON.parse(user.permissions)[section].includes('read')}
                        onChange={() => handleUserPermissionChange(user, section, 'read')}
                      />
                    </Chip>
                  {/* update */}
                    <Chip
                      variant="plain"
                      color={JSON.parse(user.permissions)[section].includes('update') ? 'primary' : 'neutral'}
                      startDecorator={
                        JSON.parse(user.permissions)[section].includes('update') && <CheckIcon sx={{ zIndex: 1, pointerEvents: 'none' }} />
                      }
                    >
                      <Checkbox
                        variant="outlined"
                        color={JSON.parse(user.permissions)[section].includes('update') ? 'primary' : 'neutral'}
                        disableIcon
                        overlay
                        label={"update"}
                        checked={JSON.parse(user.permissions)[section].includes('update')}
                        onChange={() => handleUserPermissionChange(user, section, 'update')}
                      />
                    </Chip>
                  {/* delete */}
                    <Chip
                      variant="plain"
                      color={JSON.parse(user.permissions)[section].includes('delete') ? 'primary' : 'neutral'}
                      startDecorator={
                        JSON.parse(user.permissions)[section].includes('delete') && <CheckIcon sx={{ zIndex: 1, pointerEvents: 'none' }} />
                      }
                    >
                      <Checkbox
                        variant="outlined"
                        color={JSON.parse(user.permissions)[section].includes('delete') ? 'primary' : 'neutral'}
                        disableIcon
                        overlay
                        label={"delete"}
                        checked={JSON.parse(user.permissions)[section].includes('delete')}
                        onChange={() => handleUserPermissionChange(user, section, 'delete')}
                      />
                    </Chip>
                  </Box>
                  <Divider />
                </React.Fragment>
              ))}
              <Divider />
            </div>
            <form action="" method="post" onSubmit={(e)=>e.preventDefault()}>
              <div style={{ width: '100%', display: changed ? 'flex' : 'none', justifyContent: 'space-evenly' }}>
                <Button onClick={handleSave} type='submit' startIcon={<LuShieldCheck color='success'/>}>{t('users.save')}</Button>
                <Button onClick={handleCancel} startIcon={<TbShieldCancel color='danger'/>}>{t('cancel')}</Button>
              </div>
            </form>
          </Accordion.Panel>
        ))}
      </Accordion>
    </div>
  );
}
