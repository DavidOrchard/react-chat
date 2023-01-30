import Image from "next/image";
import { useEffect, useState } from 'react'

import logo from "../src/logo.svg";
import { io } from "socket.io-client";
let socket;

function App() {

    const [input, setInput] = useState('');

    const socketInitializer = async () => {
        await fetch('/api/socket')
        socket = io();
    
        socket.on('connect', () => {
            console.log('connected');
        });

        socket.on('update-input', msg => {
            setInput(msg);
          });
    };

    useEffect(() => {
        socketInitializer();
        return () => {
            socket.disconnect();
          };
    }, []);

    const onChangeHandler = (e) => {
        setInput(e.target.value)
        socket.emit('input-change', e.target.value)
      };

    return (
        <div className="App">
              <input
                placeholder="Type something"
                value={input}
                onChange={onChangeHandler}
            />
        </div>
    );
}

export default App;
