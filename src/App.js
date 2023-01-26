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
import thumbs_down from "./thumbs_down.jpg";
import raised_hand from "./raised_hand.png";
///////// NEW STUFF IMPORTS

import { Gestures } from 'fingerpose-gestures';

let stack = {};

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  ///////// NEW STUFF ADDED STATE HOOK
  const [emoji, setEmoji] = useState(null);
  const [net, setNet] = useState(null);
  const [intervalNumber, setIntervalNumber] = useState(null);


  const images = { thumbs_up: thumbs_up, victory: victory, thumbs_down, raised_hand };
  ///////// NEW STUFF ADDED STATE HOOK

  async function loadNet() {
    const net = await handpose.load();
    setNet(net);
    console.log("Handpose model loaded.");
  }

  const runHandpose = async () => {
    //  Loop and detect hands
    const intervalNumber = setInterval(() => {
      detect(net);
    }, 10);

    setIntervalNumber(intervalNumber);
    setInterval(() => {
      determineGestureFromStack();
    }, 3000)
  };

  function stopAndDelayDetect() {
    clearInterval(intervalNumber);

    setTimeout(() => {
      setEmoji(null);
      runHandpose();
    }, 2000);
  }


  function stackIt(key) {
    stack[key] = (stack[key] || 0) + 1;
  }

  function determineGestureFromStack() {
    const gesture = Object.keys(stack).reduce((acc, key) => stack[acc] > stack[key] ? acc : key, Object.keys(stack)[0])
    if (gesture) {
      setEmoji(gesture);
    }

    stack = {};
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
          Gestures.thumbsDownGesture,
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

          if (gesture.gestures[maxConfidence] && gesture.gestures[maxConfidence].score > 9) {
            stackIt(gesture.gestures[maxConfidence].name);
            // setEmoji(gesture.gestures[maxConfidence].name);
            // console.log({ gestureStack });

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

  useEffect(() => loadNet(), []);

  useEffect(() => {
    if (net) {
      runHandpose();
    }
}, [net]);

  useEffect(() => {
   if (emoji) {
     stopAndDelayDetect();
   }
  }, [emoji]);

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
        {emoji !== null ? (
          <img
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
        ) : (
          ""
        )}

        {/* NEW STUFF */}
      </header>
    </div>
  );
}

export default App;
