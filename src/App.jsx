import React, { useEffect, useRef, useState } from 'react';
import AWS from 'aws-sdk';
import { Buffer } from 'buffer';

const awsConfig = {
  region: 'ap-south-1',
  accessKeyId: 'AKIAWS574FYYCCD65SNN',
  secretAccessKey: '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',
};

AWS.config.update(awsConfig);

const rekognition = new AWS.Rekognition();

const App = () => {
  window.Buffer = window.Buffer || Buffer;

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [age, setAge] = useState(null);

  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((error) => console.error(error));
    }
  }, []);

  const captureImage = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const image = canvas.toDataURL('image/png');

    const params = {
      Image: {
        Bytes: Buffer.from(
          image.replace(/^data:image\/\w+;base64,/, ''),
          'base64'
        ),
      },
      Attributes: ['ALL'],
    };

    try {
      const data = await rekognition.detectFaces(params).promise();
      console.log(data);

      if (data.FaceDetails && data.FaceDetails.length > 0) {
        setAge(data.FaceDetails[0].AgeRange.Low);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <video
        className="w-80 absolute top-0 right-0"
        ref={videoRef}
        autoPlay
      ></video>
      <button
        className="px-3 py-2 bg-green-400 rounded-lg m-4 text-white"
        onClick={captureImage}
      >
        Capture Image
      </button>
      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
      <div className="text-2xl mx-4 mb-2">
        Estimated Age Range: <span className="text-green-600">{age}</span>
      </div>

      <p className={`text-${age}px tracking-wide mx-4`}>
        The list of companies housing their IT environments in AWS reads like a who’s who of the most successful global organizations: 

Adobe uses AWS to provide multi-terabyte operating environments for its customers by integrating its system with AWS Cloud. Adobe can focus on deploying and operating its own software instead of trying to deploy and manage the infrastructure.
Airbnb, the online vacation rental marketplace for property owners and travelers to connect, maintains a huge infrastructure in AWS, using nearly all the available services.
Autodesk develops software for the engineering, design, and entertainment industries. Using services like Amazon RDS and Amazon S3, Autodesk can focus on developing its machine learning tools instead of spending that time on managing the infrastructure 
America Online (AOL) has used AWS to economize, closing data centers, and decommissioning about 14,000 in-house and co-located servers. They’ve moved mission-critical workloads to the cloud, extended its global reach, and saved millions of dollars on energy resources.
BitDefender is an internet security software firm and its portfolio of software includes antivirus and anti-spyware products. Using Amazon EC2, they’re running several hundred instances that handle about five terabytes of data. BitDefender also uses the  Elastic Load Balancer feature to load balance the connection coming in to those instances across availability zones, providing seamless global delivery of service.
BMW uses AWS for its new connected-car application, collecting sensor data from BMW 7-series cars to give drivers dynamically updated map information.
Canon's imaging products division benefits from faster deployment times, lower cost, and global reach by using AWS to deliver cloud-based services such as mobile print and office imaging products.
The world's largest cable company and the United States’ leading provider of internet service, Comcast, uses AWS in a hybrid environment. Out of all the other cloud providers, Comcast chose AWS for its flexibility and scalable hybrid infrastructure.
Docker is a company helping to redefine the way developers build, ship, and run applications making use of containers. The Amazon EC2 container service helps them do it.
Although much of the European Space Agency’s work is done by satellites, some of the program's data storage and computing infrastructure is built on Amazon Web Services.
The Guardian newspaper uses a wide range of AWS services to power an analytic dashboard used by editors to see how stories are trending in real time.
The Financial Times is one of the world's leading business news organizations and they use Amazon Redshift to perform their analyses. In fact, Redshift performed their analyses so quickly, some thought it was malfunctioning. They were used to running queries overnight. The Times found that the results were correct, just much faster.
General Electric (GE) is, at this moment, migrating more than 9,000 workloads - including 300 disparate ERP systems - to AWS while reducing its data center footprint from 34 to four by 2021.
The list goes on: Howard Medical School, McDonald's, NASA, Kellogg's, and many more benefit from Amazon Web Services
      </p>
    </div>
  );
};

export default App;
