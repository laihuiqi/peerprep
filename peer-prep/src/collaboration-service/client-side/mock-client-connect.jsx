// SocketConnection.js
import React, { useEffect } from 'react';
import io from 'socket.io-client';

const SocketConnection = () => {
  useEffect(() => {
    // Specify the URL of your Socket.IO server
    const socketURL = 'http://localhost:3000'; // Adjust based on your server URL

    // Connect to the server
    const socket = io(socketURL);

    // Handle events or perform other actions with the socket
    socket.on('connect', () => {
      console.log('Connected to the server');
    });

    // Example: Listen for a custom event from the server
    socket.on('customEvent', (data) => {
      console.log('Received data from server:', data);
    });

    // Clean up the socket connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, []); // Empty dependency array ensures this effect runs only once

  return <div>Socket Connection Component</div>;
};

export default SocketConnection;