import React,{useState} from 'react';
import { Form, Input, Button, Message, Schema, Container, Content } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';
import '../styles/ContactUs.css';

const { StringType } = Schema.Types;

const model = Schema.Model({
  name: StringType().isRequired('Name is required.'),
  email: StringType().isEmail('Please enter a valid email.').isRequired('Email is required.'),
  subject: StringType().isRequired('Subject is required.'),
  message: StringType().isRequired('Message is required.')
});


export default function ContactUs() {
  const [formValue, setFormValue] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
    console.log('Form data:', formValue);
    // Handle form submission (e.g., send data to a backend)
    setFormValue({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };
  return (
    <Container className="contact-us">
      <Content className='image_container'>
        <img src="/assets/ContactUs.svg" alt="" id='imgContact'/>
      </Content>

      <Content className='form_container'>
        <center>
          <h1 className='ContactH1'>Contact Us</h1>
        </center>
        {submitted && <Message showIcon type="success" description="Thank you for your message. We will get back to you soon!" />}
        <Form 
          model={model}
          formValue={formValue}
          onChange={setFormValue}
          onSubmit={handleSubmit}
          fluid
        >
          <Form.Group>
            <Form.ControlLabel>Name</Form.ControlLabel>
            <Form.Control name="name" placeholder='Your name here'/>
          </Form.Group>
          <Form.Group>
            <Form.ControlLabel>Email</Form.ControlLabel>
            <Form.Control name="email" type="email" placeholder='Your email here'/>
          </Form.Group>
          <Form.Group>
            <Form.ControlLabel>Subject</Form.ControlLabel>
            <Form.Control name="subject" placeholder='Your subject here'/>
          </Form.Group>
          <Form.Group>
            <Form.ControlLabel>Message</Form.ControlLabel>
            <Input as="textarea" name="message" rows={5} placeholder="Write your message here" />
          </Form.Group>
          <Form.Group>
            <Button appearance="primary" type="submit">Send</Button>
          </Form.Group>
        </Form>
      </Content>
    </Container>
  )
}
