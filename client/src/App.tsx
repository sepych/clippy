import {useEffect, useState} from 'react';
import {ServerMessage, serverMessagesDecode} from "../../common/types.ts";

function App() {
    const [recentMessages, setRecentMessages] = useState<ServerMessage[]>([]);
    const [channelId, setChannelId] = useState<string>();

    useEffect(() => {
        // Initialize WebSocket connection
        const socket = new WebSocket("ws://localhost:3000");

        // Set up WebSocket event listeners
        socket.addEventListener("open", () => {
            console.log("WebSocket connection established");
        });
        socket.addEventListener("message", event => {
            console.log("Message from server:", event.data);
            const serverMessages = serverMessagesDecode(event.data);
            if (serverMessages.length > 0) {
                setChannelId(serverMessages[0].channelId);
            }
            setRecentMessages(prev => {
                return [...prev, ...serverMessages];
            });
        });
        socket.addEventListener("error", error => {
            console.error("WebSocket error:", error);
        });
        socket.addEventListener("close", () => {
            console.log("WebSocket connection closed");
        });

        // Clean up function to close the WebSocket connection when the component unmounts
        return () => {
            socket.close();
        };
    }, []); // Empty dependency array ensures this effect runs only once after the initial render

    const messages = [...recentMessages].reverse().map((message, index) => (
        <li key={index} className="mb-2">
            <div
                className="inline-block g-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
                {message.ipAddress}
            </div>
            <div
                className="inline-block bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                {message.message}
            </div>
        </li>
    ));

    return (
        <div className="container mx-auto">
            {channelId && (<h3>
                <span className="text-xs">Channel: </span><span
                className="bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">
                   {channelId}
                </span>
            </h3>)}
            <ul>
                {messages}
            </ul>
        </div>
    );
}

export default App;
