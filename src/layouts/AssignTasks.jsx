import React, { useState ,useEffect} from 'react';
import { Form, Button, SelectPicker, DatePicker, Uploader,Input } from 'rsuite';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUsersData } from '../features/UserSlice';
import dayjs from 'dayjs';

export default function AssignTasks() {

    const token=localStorage.getItem('token');
    const userInfo=JSON.parse(localStorage.getItem('user'));
    const { users, status, error } = useSelector((state) => state.users);
    const dispatch=useDispatch();

    useEffect(()=>{
        dispatch(fetchUsersData(token));
    },[]);

    const [taskType, setTaskType] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [user, setUser] = useState(null);
    const [taskDescription, setTaskDescription] = useState(null);
    const [taskPriority, setTaskPriority] = useState('Medium');
    const [taskDeadline, setTaskDeadline] = useState(null);
    const [taskAttachment, setTaskAttachment] = useState(null);
    
    const rolesData=userInfo.role==="superadmin"?[
        { label: 'Admin', value: 'admin' },
        { label: 'Manager', value: 'manager' },
        { label: 'Ingenieur', value: 'ingenieur' },
        { label: 'Technicien', value: 'technicien' },
    ]:userInfo.role==="admin"?[
        { label: 'Manager', value: 'manager' },
        { label: 'Ingenieur', value: 'ingenieur' },
        { label: 'Technicien', value: 'technicien' },
    ]:userInfo.role==="manager"?[
        { label: 'Ingenieur', value: 'ingenieur' },
        { label: 'Technicien', value: 'technicien' },
    ]:userInfo.role==="ingenieur"?[
        { label: 'Technicien', value: 'technicien' },
    ]:[];

    
    const [usersData, setUsersData] = useState([]);

    useEffect(()=>{
        if(userRole){
            setUsersData(users?.users?.filter((user)=>user.role===userRole).map((user)=>({label:`${user.role} - ${user.name}`,value:user.id})))
        }
    },[userRole]);
    // ;

    const handleTaskAssignment = () => {
        const assignedTask = {
            taskType:taskType,
            userRole:userRole,
            user:user,
            taskDescription:taskDescription,
            taskPriority:taskPriority,
            taskDeadline:taskDeadline,
            taskAttachment:taskAttachment,
        };

        console.log('Assigned Task:', assignedTask);
        // Clear form
        setTaskType(null);
        setUserRole(null);
        setUser(null);
        setTaskDescription(null);
        setTaskPriority('Medium');
        setTaskDeadline(null);
        setTaskAttachment(null);
    };

    return (
        <div style={{minHeight:'100vh'}}>
            <h2>Assign Tasks</h2>
            <Form onSubmit={handleTaskAssignment} style={{height:'100%',display:'flex',flexDirection:'column',justifyContent:'space-around'}}>
                <div style={{height:'20vh',justifyContent:'center',display:'flex',flexDirection:'column'}}>
                    <h5>Task Type:</h5>
                    <SelectPicker
                        data={[
                            { label: 'Create user', value: 'createUser' },
                            { label: 'Assign site', value: 'assignSite' },
                        ]}
                        value={taskType}
                        onChange={(value)=>setTaskType(value)}
                        placeholder="Select Task Type"
                        block
                        required
                    />
                </div>
                <div style={{height:'20vh',justifyContent:'center',display:'flex',flexDirection:'column'}}>
                    <h5>User Role:</h5>
                    <SelectPicker
                        data={rolesData}
                        value={userRole}
                        onChange={(value)=>setUserRole(value)}
                        placeholder="Select User Role"
                        block
                        required
                    />
                </div>
                <div style={{height:'20vh',justifyContent:'center',display:'flex',flexDirection:'column'}}>
                    <h5>User:</h5>
                    <SelectPicker
                        data={usersData}
                        value={user}
                        onChange={(value)=>setUser(value)}
                        placeholder="Enter User Name"
                        block
                        required
                    />
                </div>
                <div style={{height:'20vh',justifyContent:'center',display:'flex',flexDirection:'column'}}>
                    <h5>Task Description:</h5>
                    <Input
                        name="taskDescription"
                        value={taskDescription}
                        onChange={(value)=>setTaskDescription(value)}
                        placeholder="Enter Task Description"
                        rows={8}
                        componentClass="textarea"
                        required
                    />
                </div>
                <div style={{height:'20vh',justifyContent:'center',display:'flex',flexDirection:'column'}}>
                    <h5>Task Priority:</h5>
                    <SelectPicker
                        data={[
                            { label: 'High', value: 'High' },
                            { label: 'Medium', value: 'Medium' },
                            { label: 'Low', value: 'Low' },
                        ]}
                        value={taskPriority}
                        onChange={(value)=>setTaskPriority(value)}
                        block
                    />
                </div>
                <div style={{height:'20vh',justifyContent:'center',display:'flex',flexDirection:'column'}}>
                    <h5>Task Deadline:</h5>
                    <DatePicker
                        value={dayjs(taskDeadline).format('yyyy-MM-dd')}
                        onChange={(value)=>setTaskDeadline(dayjs(value).format('MM/DD/YYYY'))}
                        placeholder="Select Deadline"
                        block
                        required
                    />
                </div>
                <div style={{height:'20vh',justifyContent:'center',display:'flex',flexDirection:'column'}}>
                    <h5>Task Attachment:</h5>
                    <Uploader
                        fileListVisible={false}
                        autoUpload={false}
                        onChange={setTaskAttachment}
                    />
                </div>
                <Button appearance="primary" type="submit">Assign Task</Button>
            </Form>
        </div>
    );
}
