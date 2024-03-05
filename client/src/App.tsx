import {useEffect, useMemo, useState} from 'react';
import {ServerMessage} from "../../common/types.ts";
import {ApiClient} from "../../common/api.ts";

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
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredMessages, setFilteredMessages] = useState<ServerMessage[]>([]);


    const client = useMemo<ApiClient>(() => {
        return new ApiClient({
            onChannel: (channel) => {
                setChannelId(channel);
            },
            onMessage: (messages) => {
                setRecentMessages(prev => {
                    return [...prev, ...messages];
                });
            },
        });
    }, []);


    useEffect(() => {
        // Initialize WebSocket connection
        const socket = new WebSocket("ws://localhost:3000");

        // Set up WebSocket event listeners
        socket.addEventListener("open", () => {
            console.log("WebSocket connection established");
        });
        socket.addEventListener("message", event => {
            console.log("Message from server:", event.data);
            client.onData(event.data);
        });
        socket.addEventListener("error", error => {
            console.error("WebSocket error:", error);
        });
        socket.addEventListener("close", () => {
            console.log("WebSocket connection closed");
            setRecentMessages([]);
            setChannelId(undefined);
        });

        // Clean up function to close the WebSocket connection when the component unmounts
        return () => {
            socket.close();
        };
    }, []); // Empty dependency array ensures this effect runs only once after the initial render

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            setFilteredMessages(recentMessages.filter(message =>
                message.message.toLowerCase().includes(searchTerm.toLowerCase())));
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, recentMessages]);

    const displayMessages = filteredMessages.length > 0 ? filteredMessages : recentMessages;

    const messages = [...displayMessages].reverse().map((message, index) => (
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

            <form className="max-w-md mb-3">
                <label htmlFor="default-search"
                       className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                <div className="relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                             xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                        </svg>
                    </div>
                    <input type="search" id="default-search"
                           className="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                           placeholder="Search ..." onChange={
                        (event) => {
                            setSearchTerm(event.target.value);
                        }}/>
                </div>
            </form>

            <div>
                {messages}
            </div>
        </div>
    );
}

export default App;
