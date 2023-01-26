import React from 'react';


function Countdown({ onFinish = () => {} }) {
  const [timeRemain, setTimeRemain] = React.useState(3);
  let countdownTimer;

  function startTimer() {
    let timeLeft = timeRemain;
    console.log({ started: 1 });

    countdownTimer = setInterval(() => {
      console.log({ int: 1 });

      --timeLeft; // eslint-disable-line
      setTimeRemain(timeLeft);

      if (timeLeft <= 0) {
        clearInterval(countdownTimer);
        setTimeRemain(0);
        onFinish();
      }
    }, 1000);

    return resetTimer;
  }

  function resetTimer() {
    console.log({ reset: 1 });

    clearInterval(countdownTimer);
  }

  React.useEffect(() => startTimer(), []);

  return (<div style={{
    position: "absolute",
    marginLeft: "auto",
    marginRight: "auto",
    left: 400,
    bottom: 500,
    right: 0,
    textAlign: "center",
    height: 100,
  }}>
    countdown {timeRemain}
  </div>)
}

export default Countdown;