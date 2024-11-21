import axios from "axios";
import FileUploadButton from "./uploadClipThreads";
import { useEffect, useState } from "react";

interface MessageContentBlock {
    type: 'text';
    text: {
      value: string;
      annotations: any[];
    };
  }
  
  interface Message {
    id: string;
    object: string;
    created_at: number;
    thread_id: string;
    role: 'user' | 'assistant' | 'system';
    content: MessageContentBlock[];
    assistant_id?: string;
    run_id?: string;
    attachments?: any[];
    metadata?: object;
  }

interface ChatProps {
    threadId: string;
    assistantId: string;
}

export default function Chat({ threadId, assistantId }: ChatProps) {
    const [messages, setMessages] = useState<{ text: string; sender: 'user' | 'bot' | 'system';}[]>([]);
    const [inputValue, setInputValue] = useState<string>("");


    useEffect(() => {
        fetchMessages(threadId);
    }, [threadId]);


    const fetchMessages = async (threadId: string) => {
        try {
            // API call to fetch messages for the given thread ID
            const messagesResponse = await axios.post('/api/openai/get-messages', { thread_id: threadId });
            console.log("fetchedmessages", messagesResponse.data.messages); // [0].content[0].text.value = message 
            const formattedMessages = messagesResponse.data.messages.map((msg: Message)  => ({
                    sender: msg.role,
                    text: msg.attachments && msg.attachments.length > 0 ? "File uploaded" : msg.content[0].text.value
                })).reverse();
            setMessages(formattedMessages);
        } catch (error) {
            console.error("Error fetching messages: ", error);
        }
    };

    const runAssistant = async (message: string) => {
        try {
            const response = await axios.post('/api/openai/run', { message, id: threadId, assistant: assistantId });
            return response;
        } catch (error) {
            console.error("Error running assistant: ", error);
            return null;
        }
    };

    const addMessage = (newMessage: { text: string; sender: 'user' | 'bot' | 'system';}) => {
        setMessages(prevMessages => [...prevMessages, newMessage]);
    };

    const handleSendMessage = async () => {
        if (inputValue.trim() === '') return;

        const userMessage = { text: inputValue, sender: 'user' as const };
        setMessages([...messages, userMessage]);

        setInputValue('');

        try {
            const response = await runAssistant(userMessage.text);
            if (response) {
                const botMessage = {
                    sender: 'bot' as const,
                    text: response.data.response,
                };

                setMessages([...messages, userMessage, botMessage]);
            }
        } catch (error) {
            console.error('Failed to fetch response:', error);
            const errorMessage = { text: 'Sorry, something went wrong.', sender: 'bot' as const };
            setMessages([...messages, userMessage, errorMessage]);
        }
    };

    return (
        <div className="w-full flex flex-grow flex-col rounded rounded-lg ">
            <div className={`flex-grow p-4 overflow-y-auto bg-white shadow-xl border-[16px] border-black rounded-t-xl ${messages.length === 0 ? 'flex justify-center items-center' : ''}`}>
                {messages.length === 0 ? (
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white border-gray-300 border-2 p-4 rounded-lg shadow-md text-center">
                            <p className="text-sm text-gray-800">
                            &quot;Tell me about Jack's former work experience.&quot;
                            </p>
                        </div>
                        <div className="bg-white border-gray-300 border-2 p-4 rounded-lg shadow-md text-center">
                            <p className="text-sm text-gray-800">
                            &quot; What kind of programming languages does jack know? &quot;
                            </p>
                        </div>
                    </div>
                ) : (
                    <div>
                        {messages.map((message, index) => (
                            <div key={index}>
                                <div
                                className={`mb-4 p-3 w-fit max-w-[66%] rounded-xl ${
                                    message.sender === 'user'
                                    ? 'bg-blue-500 text-black self-end ml-auto'
                                    : 'bg-[#aeb9cc] text-black self-start mr-auto'
                                }`}
                                >
                                {message.text}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>


            {/* Input Area */}
            <footer className="pt-4 pb-4 pr-4 pl-4 bg-black flex flex-col items-center relative rounded-b-xl">
                <div className="w-full h-fit flex items-center justify-center">
                    <FileUploadButton threadId={threadId} assistant_id={assistantId} addMessage={addMessage}/>
                    
                    
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSendMessage();
                        }}
                        className="flex-grow p-2 rounded-l-lg bg-white text-black focus:outline-none"
                        placeholder="Type your message..."
                    />
                    <button
                        onClick={handleSendMessage}
                        className="bg-blue-300 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-r-lg"
                    >
                        Send
                    </button>
                </div>
            </footer>
        </div>
    );
}
