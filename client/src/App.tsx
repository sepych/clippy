import {useEffect, useState} from 'react';
import {ServerMessage, serverMessagesDecode} from "../../common/types.ts";

async function copyTextToClipboard(text: string) {
    try {
        await navigator.clipboard.writeText(text);
    } catch (err) {
        console.error('Failed to copy: ', err);
    }
}

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
        <div key={index} className="flex mb-1">
            <div className="me-2 flex items-start">
                <div
                    className="inline-block g-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
                    {message.ipAddress}
                </div>
            </div>
            <div className="flex items-start">
                <div
                    className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">

                    <button onClick={() => copyTextToClipboard(message.message)} className="float-right ml-2">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                             className="w-4 h-4">
                            <path fillRule="evenodd" clipRule="evenodd"
                                  d="M12 4C10.8954 4 10 4.89543 10 6H14C14 4.89543 13.1046 4 12 4ZM8.53513 4C9.22675 2.8044 10.5194 2 12 2C13.4806 2 14.7733 2.8044 15.4649 4H17C18.6569 4 20 5.34315 20 7V19C20 20.6569 18.6569 22 17 22H7C5.34315 22 4 20.6569 4 19V7C4 5.34315 5.34315 4 7 4H8.53513ZM8 6H7C6.44772 6 6 6.44772 6 7V19C6 19.5523 6.44772 20 7 20H17C17.5523 20 18 19.5523 18 19V7C18 6.44772 17.5523 6 17 6H16C16 7.10457 15.1046 8 14 8H10C8.89543 8 8 7.10457 8 6Z"
                                  fill="currentColor"></path>
                        </svg>
                    </button>
                    {message.message}
                </div>
            </div>
        </div>
    ));

    return (
        <div className="container mx-auto">
            {channelId && (<h3 className='mb-3'>
                <span
                    className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">
                   Channel: {channelId}
                </span>
            </h3>)}
            <div>
                {messages}
            </div>
        </div>
    );
}

export default App;
