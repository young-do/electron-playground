import { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  signInAnonymously,
  User as FirebaseUser,
  signOut,
} from 'firebase/auth';
import HomeIcon from '../assets/svgs/home.svg?react';

const TEN_MINUTES = 5000; //10 * 60 * 1000;
const initialTime = TEN_MINUTES;

export const Home = () => {
  const [second, setSecond] = useState(initialTime);
  const [started, setStarted] = useState(false);
  const finished = started && second === 0;

  const reset = () => {
    setSecond(initialTime);
    setStarted(false);
  };

  const showNotification = () => {
    new Notification('🍅 Pomodoro Timer 🍅', {
      body: '10분이 지났습니다!',
    });
  };

  const showNotificationDesktop = () => {
    window.electronAPI.showNotification();
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
        window.electronAPI.showWindow();
      } else {
        setSecond(remainingTime);
      }
    };
    const interval = setInterval(update, 1000);
    update();

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started]);

  return (
    <div>
      <h1>
        🍅 Pomodoro Timer 🍅 <HomeIcon />
      </h1>
      <h2>{finished && '끝!'}</h2>
      <h2>{formatTime(second)}</h2>
      <button onClick={reset}>초기화</button>
      <button onClick={() => setStarted(!started)}>{started ? '중지' : '시작'}</button>
      <button onClick={showNotification}>알림 테스트 (web)</button>
      <button onClick={showNotificationDesktop}>알림 테스트 (desktop)</button>
      <Locker />
      <AnonymousAuth />
      <MachineId />
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

const Locker = () => {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const savePassword = () => {
    const result = window.electronAPI.savePassword(password);
    console.log('!!', result);

    setMessage('Password saved.');
  };

  const verifyPassword = () => {
    const result = window.electronAPI.verifyPassword(password);
    console.log('@@', result);
    setMessage(result.ok ? 'Password is correct.' : 'Password is incorrect.');
  };

  return (
    <div>
      <h1>Locker</h1>
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={savePassword}>Save</button>
      <button onClick={verifyPassword}>Verify</button>
      <p>{message}</p>
    </div>
  );
};

const AnonymousAuth = () => {
  const [user, setUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    window.onstorage = (e) => {
      console.log('storage event', e);
    };

    const app = initializeApp({
      apiKey: 'AIzaSyCCCWY6sbqrROPyffnI4_94x16wNAmWou8',
      authDomain: 'sample-6ef3c.firebaseapp.com',
      projectId: 'sample-6ef3c',
      storageBucket: 'sample-6ef3c.appspot.com',
      messagingSenderId: '454155517545',
      appId: '1:454155517545:web:8ad8391b799aa914996cf8',
      measurementId: 'G-C58RKE0MXR',
    });
    const auth = getAuth(app);

    // 새로고침해도 계속 동일한 uid를 가지는 이유
    // ㄴ indexedDB에 저장되어 있기 때문
    signInAnonymously(auth)
      .then((value) => {
        // Signed in..
        console.log('signed in', value);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ...
        console.error('error', error, errorCode, errorMessage);
      });

    onAuthStateChanged(auth, (user) => {
      setUser(user);
      console.log('user', user);
    });
  }, []);

  return (
    <div>
      <h1>Anonymous auth</h1>
      <p>user is {user ? `signed in with uid = "${user.uid}"` : 'signed out'}</p>
      <button onClick={() => signOut(getAuth())}>sign out</button>
    </div>
  );
};

const MachineId = () => {
  const [id, setId] = useState('');

  useEffect(() => {
    if (!window.electronAPI) return;

    const id = window.electronAPI.getMachineId();
    setId(id);
  }, []);

  return (
    <div>
      <h1>Machine Id</h1>
      <p>user machine id is "{id || '...'}"</p>
    </div>
  );
};
