import React,{useState,useEffect} from 'react'

import { Button, Input,Grid } from '@mui/joy';
import { Avatar , Divider, Uploader,TagPicker,Loader} from 'rsuite';
import '../styles/profile.css';
import { BsEye } from 'react-icons/bs';
import { FiEyeOff } from 'react-icons/fi';
import { updateUser } from '../features/SuperAdminSlice';
import { useDispatch ,useSelector } from 'react-redux';
import { FaCheck } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { Notification } from 'rsuite'; 
import Modal from '@mui/joy/Modal';
import LoaderComponent from './LoaderComponent';
import { fetchUsersData } from '../features/UserSlice';
import { useTranslation } from 'react-i18next';
import { SiTestrail } from 'react-icons/si';

export default function Profile() {

  const token=localStorage.getItem('token');
  const userInfo=JSON.parse(localStorage.getItem('user'));
  const {messageUpdate,statusUpdate,errorUpdate}=useSelector((state) => state.updateUser);
  const { users, status, error } = useSelector((state) => state.users);
  
  const dispatch=useDispatch();
  const [notif,setNotif]=useState(false);
  
  const [imageURL, setImageURL] = useState('');
  const [updatePhoto, setUpdatePhoto] = useState(false);
  const [type, setType] = useState(true);
  const [LoaderState,setLoaderState]=useState(false);
  const {t}=useTranslation();
  // useEffect(()=>{
  //   alert(JSON.stringify(userInfo))
  // },[]);

  useEffect(()=>{
    const intervalLoader=setTimeout(() => {
      setLoaderState(false);
    }, 3000);
    return ()=>clearTimeout(intervalLoader);
  },[LoaderState]);
  
  useEffect(()=>{
    const intervalLoader=setTimeout(() => {
      setUpdatePhoto(false);
      setNotif(false);
    }, 8000);
    return ()=>clearTimeout(intervalLoader);
  },[notif]);
  
  const [updateUserState,setUpdateUserState]=useState({id:userInfo.id,name:userInfo.name,email:userInfo.email,password:userInfo.password_confirmation,photo:'',role:userInfo.role});
  
  const handleFileUpload = (fileList) => {
    if (fileList && fileList.length > 0) {
      const file = fileList[0].blobFile;
      const fileName = file.name;

      // console.log("file: ");
      // alert(file);
      // alert("fileName: ");
      // console.log(fileName); 
      
      const imageURL = URL.createObjectURL(file);
      setImageURL(imageURL);
      setUpdateUserState({...updateUserState,photo:imageURL});

      // console.log("imageURL: ");
      // console.log(imageURL);
    }
  };
  const [message,setMessage]=useState('');
  //! Update user:
  const handleUpdateExistingUser = () => {
      setLoaderState(false);
      dispatch(updateUser({ token,updateUserState }));
      dispatch(fetchUsersData(token))
      setNotif(true);
  };

  useEffect(()=>{
    if(users){
      const findUser=users?.users?.find((user)=>user.id===updateUserState.id);
      if(findUser){
        localStorage.setItem('user',JSON.stringify(findUser));
      }
    }
  },[users, updateUserState.id]);

  useEffect(()=>{
      setMessage(messageUpdate);

    if(message!==''){
      const intervalLoader=setTimeout(() => {
        setMessage('');
      }, 8000);
      return ()=>clearTimeout(intervalLoader);
    }
  },[messageUpdate]);

  return (
    <div>
      <div>
        <div className='title_image'>
          <h2 id='title_H2'><SiTestrail style={{color:'rgb(3, 110, 74)'}}/><span> {t('p')} </span></h2>
          <img src="/assets/profile.svg" alt="pro_img" />
        </div>
        <Grid container spacing={2} sx={{ flexGrow: 1,width:'100%',display:'flex',gap:'50px' ,justifyContent:'center'}}>
            {
            (message!=='')&&(
                <Notification style={{width:'100%',zIndex: 100000 }} showIcon type="success" color='success' closable>
                <strong><FaCheck/></strong> {message}.
                </Notification>
            )
            }
            {
              !notif&&(
                <Loader content=''/>
              )
            }
            <Divider>
                <p style={{textDecoration:'underline',margin:'30px 0'}}>
                    <b>Change your information's</b>
                </p>
            </Divider> 
            <Grid lg={12}>
                <h5 className='title_photo'>Photo</h5>
                {imageURL!=='' ? (
                  <Avatar circle />
                  ):(
                    <Avatar circle src={userInfo.photo} size='30'/>
                  )
                }
                <br />
                <Button className='actionButtonsP' sx={{width:'110px',height:'40px'}} onClick={()=>setUpdatePhoto(true)}>Update</Button>
                <br /><br />
                {
                  updatePhoto&&(
                    <Uploader draggable onChange={handleFileUpload}>
                      <div style={{ height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span>Click or Drag files to this area to upload</span>
                      </div>
                    </Uploader>
                  )
                }
                <br />
                <Button className='actionButtonsP' sx={{width:'110px',height:'40px'}} onClick={()=>{setImageURL('');setUpdatePhoto(false)}} endDecorator={<MdCancel/>}>Delete</Button>
                <br />
            </Grid>
            <Grid lg={12}>
                <span>Name</span>
                <Input type='text' placeholder=" name" value={updateUserState.name} onChange={(e)=>setUpdateUserState({...updateUserState,name:e.target.value})}/>
            </Grid>
            <Grid lg={12}>
                <span>Email</span>
                <Input type='text' placeholder=" email" value={updateUserState.email} onChange={(e)=>setUpdateUserState({...updateUserState,email:e.target.value})}/>
            </Grid>
            <Grid lg={12}>
                <span>Password</span>
                <Input type={type?'password':'text'} placeholder=" password" endDecorator={type?<BsEye onClick={()=>setType(!type)}/>:<FiEyeOff onClick={()=>setType(!type)}/>}
                value={updateUserState.password}
                onChange={(e)=>setUpdateUserState({...updateUserState,password:e.target.value})}
                />
            </Grid>
            {
              updatePhoto&&(
                <Grid lg={12}>
                  <Button className='actionButtonsP' sx={{width:'110px',height:'40px'}} onClick={handleUpdateExistingUser} endDecorator={<FaCheck/>}>Save</Button>
                </Grid>
              )
            }
        </Grid>
      </div>

      {/*Loader component */}
      <Modal
          aria-labelledby="modal-title"
          aria-describedby="modal-desc"
          open={LoaderState}
          onClose={() => setLoaderState(false)}
          sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <LoaderComponent/>
      </Modal>

    </div> 
  )
}
