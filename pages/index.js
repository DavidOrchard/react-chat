import Image from "next/image";
import { useEffect, useRef, useState } from 'react'

import logo from "../src/logo.svg";
import { io } from "socket.io-client";
let socket;

function App() {
    const ref = useRef();
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);

    const socketInitializer = async () => {
        await fetch('/api/socket')
        socket = io();
    
        socket.on('connect', () => {
            console.log('connected');
        });

        socket.on('update-input', msg => {
            setInput(msg);
          });

          socket.on('update-messages', msg => {
            console.log('update-messages');
            setMessages((prev) => [...prev, msg]);
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

    const onSubmitHandler = (e) => {
        e.preventDefault();
        console.log('ref.current', ref.current.value);
        socket.emit('message-send', ref.current.value);
        setMessages((prev) => [...prev, ref.current.value]);

    };


    return (
        <div className="App">
            <input
                placeholder="Type something"
                value={input}
                onChange={onChangeHandler}
            />
            <div>
                {messages.map((msg, index) => (<div key={index}>{msg}</div>))}
            </div>
            <form>
              <input
                ref={ref}
                placeholder="Type a message"
               />
            <button onClick={onSubmitHandler}>Submit</button>
            {}
            </form>
        </div>
    );
}

export default App;
