import React from 'react';


function Countdown({ timer, onFinish = () => {} }) {
  const [timeRemain, setTimeRemain] = React.useState(timer);
  let countdownTimer;

  function startTimer() {
    setTimeRemain(timer);
    let timeLeft = timeRemain;
    console.log({ timeLeft });

    countdownTimer = setInterval(() => {
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