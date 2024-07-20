import React from 'react';
import '../styles/HowItWorks.css';

const HowItWorks = () => {
  const steps = [
    {
      title: "Step 1: Sign Up",
      description: "Create an account by providing your details and verifying your email address.",
      image: "/assets/register.svg"
    },
    {
      title:"step 2:Choose from our flexible pricing",
      description:"Find the Perfect Plan for Your Needs",
      image:"/assets/pricing.svg"
    },
    {
      title: "Step 3: Customize Your Profile",
      description: "Fill out your profile information to get personalized recommendations.",
      image: "/assets/cutomize.svg"
    },
    {
      title: "Step 4: Explore Features",
      description: "Browse through our features and find the ones that suit your needs.",
      image: "/assets/descover feauters.svg"
    },
    {
      title: "Step 5: Get Started",
      description: "Start using our services and enjoy the benefits we offer.",
      image: "/assets/getStarted.svg"
    },
  ];

  return (
    <div className="how-it-works">
      <center>
        <h1 className='howH1'>How It Works</h1>
        <p className='howPar'>Follow these simple steps to get started with our platform:</p>
      </center>
      <div className="steps-container">
        {steps.map((step, index) => (
          <div className="step" key={index}>
            <img src={step.image} alt={step.title} className="HowPics"/>
            <h2>{step.title}</h2>
            <p>{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HowItWorks;
