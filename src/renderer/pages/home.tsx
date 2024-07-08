import { useEffect, useState } from 'react';

const TEN_MINUTES = 10 * 60 * 1000;
const initialTime = TEN_MINUTES;

export const Home = () => {
  const [second, setSecond] = useState(initialTime);
  const [started, setStarted] = useState(false);
  const finished = started && second === 0;

  const reset = () => {
    setSecond(initialTime);
    setStarted(false);
  };

  useEffect(() => {
    if (!started) return;

    const startTime = performance.now();
    const endTime = startTime + second;

    const update = () => {
      const now = performance.now();
      const remainingTime = endTime - now;
      if (remainingTime <= 0) {
        clearInterval(interval);
        setSecond(0);
      } else {
        setSecond(remainingTime);
      }
    };
    const interval = setInterval(update, 1000);
    update();

    return () => clearInterval(interval);
  }, [started]);

  return (
    <div>
      <h1>🍅 Pomodoro Timer 🍅</h1>
      <h2>{finished && '끝!'}</h2>
      <h2>{formatTime(second)}</h2>
      <button onClick={reset}>초기화</button>
      <button onClick={() => setStarted(!started)}>{started ? '중지' : '시작'}</button>
    </div>
  );
};

// input: 스톱워치 총 시간
// output: mm:ss 형식의 문자열
export const formatTime = (time: number): string => {
  const minutes = Math.floor(time / 60000);
  const seconds = Math.floor((time % 60000) / 1000);

  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};
