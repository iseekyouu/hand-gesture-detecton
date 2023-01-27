// 0. Install fingerpose npm install fingerpose
// 1. Add Use State
// 2. Import emojis and finger pose import * as fp from "fingerpose";
// 3. Setup hook and emoji object
// 4. Update detect function for gesture handling
// 5. Add emoji display to the screen

///////// NEW STUFF ADDED USE STATE
import React, { useRef, useState, useEffect } from "react";
///////// NEW STUFF ADDED USE STATE

// import logo from './logo.svg';
import * as tf from "@tensorflow/tfjs";
import * as handpose from "@tensorflow-models/handpose";
import Webcam from "react-webcam";
import "./App.css";
import { drawHand } from "./utilities";

///////// NEW STUFF IMPORTS
import  * as fp from "fingerpose";
import victory from "./victory.png";
import thumbs_up from "./thumbs_up.png";
// import thumbs_down from "./thumbs_down.jpg";
import raised_hand from "./open-hand.svg";
///////// NEW STUFF IMPORTS

import { Gestures } from 'fingerpose-gestures';
import Countdown from './Countdown';

let stack = {};

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  ///////// NEW STUFF ADDED STATE HOOK
  const [emoji, setEmoji] = useState(null);
  const [timeRemain, setTimeRemain] = useState(null);

  const [net, setNet] = useState(null);
  const [detectInterval, setDetectInterval] = useState(null);


  const images = { thumbs_up: thumbs_up, thumbs_down: thumbs_up, victory: victory, raised_hand };
  ///////// NEW STUFF ADDED STATE HOOK

  async function loadNet() {
    const net = await handpose.load();
    setNet(net);
    console.log("Handpose model loaded.");
  }

  const runHandpose = async () => {
    //  Loop and detect hands
    const detectInterval = setInterval(() => {
      detect(net);
    }, 10);

    setDetectInterval(detectInterval);
  };

  function stopAndDelayDetect() {
    clearInterval(detectInterval);

    setTimeout(() => {
      setEmoji(null);
      runHandpose();
    }, 2000);
  }


  function onGestureDetectEvent(gesture) {
    stackIt(gesture);
    setEmoji(gesture);
    setTimeRemain(3);
  }

  function onApproveGesture() {
    console.log({ approve: 1 });

    setTimeRemain(0);
    stopAndDelayDetect();

    // do stuff
  }


  function stackIt(key) {
    stack[key] = (stack[key] || 0) + 1;
  }

  const detect = async (net) => {
    // Check data is available
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Set canvas height and width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // Make Detections
      const hand = await net.estimateHands(video);
      // console.log(hand);

      ///////// NEW STUFF ADDED GESTURE HANDLING

      if (hand.length > 0) {
        const GE = new fp.GestureEstimator([
          fp.Gestures.VictoryGesture,
          Gestures.thumbsUpGesture,
          Gestures.thumbsUpGesture,
          Gestures.raisedHandGesture,
        ]);

        const gesture = await GE.estimate(hand[0].landmarks, 4);
        if (gesture.gestures !== undefined && gesture.gestures.length > 0) {
          // console.dir(gesture.gestures);

          const confidence = gesture.gestures.map(
            (prediction) => prediction.score
          );
          // console.log({ confidence });

          const maxConfidence = confidence.indexOf(
            Math.max.apply(null, confidence)
          );

          // console.log({ 1: gesture.gestures[maxConfidence].score });

          if (gesture.gestures[maxConfidence] && gesture.gestures[maxConfidence].score >= 8.2) {
            onGestureDetectEvent(gesture.gestures[maxConfidence].name);
          } else if (gesture.gestures[maxConfidence] && gesture.gestures[maxConfidence].score < 8) {
            console.log({ score: gesture.gestures[maxConfidence] && gesture.gestures[maxConfidence].score });

            setEmoji(null);
          }
          // console.log(emoji);
        }
      }

      ///////// NEW STUFF ADDED GESTURE HANDLING

      // Draw mesh
      const ctx = canvasRef.current.getContext("2d");
      drawHand(hand, ctx);
    }
  };

  useEffect(() => { loadNet() }, []);

  useEffect(() => {
    if (net) {
      runHandpose();
    }
  },
    [net]
  );

  return (
    <div className="App">
      <header className="App-header">
        <Webcam
          ref={webcamRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480,
            transform: 'scaleX(-1)',
          }}
        />

        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480,
            transform: 'scaleX(-1)',
          }}
        />
        {/* NEW STUFF */}
        {emoji && (
          <>
          <img
            alt='aa'
            src={images[emoji]}
            style={{
              position: "absolute",
              marginLeft: "auto",
              marginRight: "auto",
              left: 400,
              bottom: 500,
              right: 0,
              textAlign: "center",
              height: 100,
            }}
          />
            {timeRemain && <Countdown timer={timeRemain} onFinish={() => onApproveGesture()} />}
          </>
        )}
        {/* <Countdown timer={timeRemain} onFinish={() => {}} /> */}
        {/* NEW STUFF */}
      </header>
    </div>
  );
}

export default App;
