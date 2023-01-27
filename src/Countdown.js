import React from 'react';

const colors = ['green', 'yellow', 'black', 'blue', 'red', 'brown', 'gray'];

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
    fontSize: '70px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }}>
    <span style={{
      color: colors[Math.floor(Math.random() *7)],
      }}>{timeRemain}</span>
  </div>)
}

export default Countdown;