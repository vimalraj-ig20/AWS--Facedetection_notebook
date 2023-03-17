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
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere qui
        adipisci quam. Eius explicabo architecto, quibusdam accusamus culpa
        ducimus nemo voluptates iusto laboriosam nesciunt aperiam
        necessitatibus! Facilis repellat, eum dolorum deserunt debitis nemo id
        aut iure nihil culpa. Expedita libero nemo accusantium quasi unde,
        obcaecati, impedit autem temporibus et sequi asperiores molestiae omnis
        cupiditate praesentium ab nam laudantium, non distinctio. Nulla quidem
        mollitia quasi provident? Pariatur, provident adipisci. Explicabo,
        perspiciatis eligendi perferendis corrupti cumque magnam vel labore quia
        aperiam rem eos tempora nemo ad ex consectetur? Aperiam vero aliquam,
        temporibus, ipsum quasi quod facere iste beatae impedit unde excepturi
        tempora ratione! Ex, harum laudantium culpa vel voluptatem voluptatum
        nam quia cumque reprehenderit omnis hic, et veritatis? Consequatur
        facilis, eveniet voluptatibus necessitatibus suscipit blanditiis
        deserunt sint doloremque, reprehenderit corrupti error cumque ducimus
        totam accusantium. Vitae voluptatem, eveniet deleniti ratione sit illum!
        Sint laboriosam reiciendis reprehenderit neque iste mollitia quis magnam
        accusamus praesentium dicta blanditiis quidem, repudiandae ipsa esse
        voluptatem voluptatibus distinctio deserunt sit ipsam. Odio illum veniam
        a consequatur? Commodi corporis in nisi perferendis sapiente saepe rem
        nobis, tempora voluptates voluptatibus pariatur, totam vel sed, ducimus
        modi veniam? Nihil autem molestias reprehenderit sequi nobis recusandae
        aspernatur commodi nisi eveniet, optio consectetur aperiam quibusdam
        dicta laborum officia! Dolorum architecto tempora unde dolores.
        Veritatis, impedit modi nisi tenetur, porro laboriosam officiis
        necessitatibus nihil cupiditate voluptatum maiores et neque consequuntur
        quia culpa voluptate ullam sed! Illum beatae adipisci natus laboriosam
        aspernatur quo ea incidunt quibusdam.
      </p>
    </div>
  );
};

export default App;
