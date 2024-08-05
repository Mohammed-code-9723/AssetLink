import React, { useState, useEffect } from 'react';
import { Checkbox, CheckboxGroup,Divider,Accordion, Placeholder, Stack, Avatar } from 'rsuite';


const Header = props => {
  const { avatarUrl, title, subtitle, ...rest } = props;
  return (
    <Stack {...rest} spacing={10} alignItems="flex-start">
      <Avatar src={avatarUrl} alt={title} />
      <Stack spacing={2} direction="column" alignItems="flex-start">
        <div>{title}</div>
        <div style={{ color: 'var(--rs-text-secondary)', fontSize: 12 }}>{subtitle}</div>
      </Stack>
    </Stack>
  );
};

export default function Test() {
    const [newUser, setNewUser] = useState({
        permissions: {
            dashboard: [],
            workspaces: [],
            projects: [],
            sites: [],
            buildings: [],
            components: [],
            incidents: [],
            reports: []
        }
    });

    const handlePermissionChange = (section, permission) => {
      setNewUser(prevState => {
          const newPermissions = { ...prevState.permissions };
          if (!newPermissions[section].includes(permission)) {
              newPermissions[section].push(permission);
          }
          return { ...prevState, permissions: newPermissions };
      });
    };

    useEffect(() => {
        console.log(newUser);
    }, [newUser]);

    return (
        <div style={{ height: '100vh', width: '100%', zIndex: '-1' }}>
          {
            ["dashboard","workspaces","projects","sites","buildings","components","incidents","reports"].map((item,index)=>(
              <div style={{width:'100%'}}>
                <Divider><h3>{item}</h3></Divider>
                <CheckboxGroup inline name="checkbox-group" key={index}>
                    <Checkbox value="Create" onChange={() => handlePermissionChange(item, 'Create')}>Create</Checkbox>
                    <Checkbox value="Read" onChange={() => handlePermissionChange(item, 'Read')}>Read</Checkbox>
                    <Checkbox value="Update" onChange={() => handlePermissionChange(item, 'Update')}>Update</Checkbox>
                    <Checkbox value="Delete" onChange={() => handlePermissionChange(item, 'Delete')}>Delete</Checkbox>
                </CheckboxGroup>
                <Divider/>
              </div>
            ))
          }
          <Divider></Divider>
        </div>
    );
}
