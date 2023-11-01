import { useEffect} from 'react';
import socketIOClient from "socket.io-client";

const ENDPOINT = "http://localhost:3002";

const Timer = ({ setTimeRemaining, onSessionEnd }) => {
  useEffect(() => {
    const socket = socketIOClient(ENDPOINT, { query: { userId: 1, sessionId: "1234" } });

    socket.on("session-timer", data => {
      setTimeRemaining(data.timeRemaining); // passing the time to parent component
    });

    socket.on("session-end", () => {
      if (onSessionEnd) {
        onSessionEnd();
      }
    });

    // Listen for time extension events
    socket.on("time-extended", (extension) => {
      setTimeRemaining(prevTime => prevTime + extension); // update the time in parent component
    });

    return () => {
      socket.disconnect();
    };
  }, [setTimeRemaining, onSessionEnd]);

  return null; // No UI, so we return null
};

export default Timer;
