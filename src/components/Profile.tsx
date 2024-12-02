import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


import { newMessage } from "@/functionality/supabase";

import { useState, FormEvent } from 'react';

import { AiOutlineArrowRight } from "react-icons/ai";


export default function Profile() {
    const [email, setEmail] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [urlForComp, setUrl] = useState<string>('');
    const [showDocument, setShowDocument] = useState<string | null>(null);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    
        try {
            const response = await newMessage( email, message );
        
            if (response.error) {
                // Log the error if the response is not okay
                throw new Error(`HTTP error! status: ${response.status}, ${response.error}`);
            }
            console.log('Message successfully sent');

            setEmail('');
            setMessage('');
        } catch (error) {
             console.error('Error submitting message:', error);
        }
    };

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        // Get the value of the button that was clicked
        const value = event.currentTarget.value;
        setUrl(value);
      };

    // Handle viewing a document
    const handleItemClick = () => {
        setShowDocument("Resume.pdf"); // Display the document view
    };

    // Handle going back to the chat view
    const handleBackToChat = () => {
        setShowDocument(null); // Hide the document view
    };

    return (
        <div className="w-full h-full grid grid-cols-5 ">
            <div className="relative h-full w-full col-span-3 bg-white rounded-r-xl">
                {/* MyItem takes full width and height */}
                
                {showDocument? (
                <div className="w-full h-full flex flex-col bg-black rounded-xl">
                  <div className="flex justify-end items-center p-4">
                    <button onClick={handleBackToChat} className="text-blue-300 hover:text-green-500">
                      <AiOutlineArrowRight size={24}  />
                    </button>
                  </div>
                  <iframe src={showDocument} title='Document' className="flex-grow w-full h-full border-none rounded-xl" />
                  
                </div>
              ) : (
                <div>
                    {/* <MyItem link={urlForComp} className="absolute inset-0" /> */}

                    {/* Grid for Buttons positioned at the bottom */}
                    <div className="absolute bottom-0 left-0 w-full h-1/5 grid grid-cols-4 grid-rows-2">
                        {/* Top Buttons */}
                        <button
                            value="www.linkedin.com/in/jack-yurkanin/"
                            onClick={handleClick}
                            className="col-start-1 row-start-1 bg-blue-300 bg-opacity-50 hover:bg-opacity-90 text-white p-2 rounded self-center justify-self-center w-24"
                        >
                            LinkedIn
                        </button>
                        <button 
                            value="www.github.com/jackyurkanin/"
                            onClick={handleClick}
                            className="col-start-3 row-start-1 bg-green-300 bg-opacity-50 hover:bg-opacity-90 text-white p-2 rounded self-center justify-self-center w-24"
                        >
                        GitHub
                        </button>

                        {/* Bottom Buttons */}
                        <button
                            value="www.researchloom.com"
                            onClick={handleClick}
                            className="col-start-2 row-start-2 bg-yellow-600 bg-opacity-50 hover:bg-opacity-90 text-white p-2 rounded self-center justify-self-center w-24">
                        Eureka
                        </button>
                        <button
                            value="https://briefcase-jade.vercel.app/"
                            onClick={handleClick}
                            className="col-start-4 row-start-2 bg-red-300 bg-opacity-50 hover:bg-opacity-90 text-white p-2 rounded self-center justify-self-center w-24"
                        >
                        Briefcase
                        </button>
                    </div>
                </div>
              )}
                
            </div>

            <div className="flex flex-col w-full col-span-2 space-y-4">
                <Avatar className="w-fit h-36 self-center mt-4">
                    <AvatarImage src="https://media.licdn.com/dms/image/v2/C4D03AQGZ0jHeSgICxA/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1589688909540?e=1738195200&v=beta&t=TcnsPGu5dE1ydN8iaQfBjXbJ38b_wPK1E19C0XR64oA" />
                    <AvatarFallback>JY</AvatarFallback>
                </Avatar>

                <h3 className="text-6xl w-full h-fit text-center text-white p-4 pt-0"> JACK YURKANIN</h3>
                <h2 className="col-span-3 p-4 pt-0 text-center text-lg">MIT '23 | Ex-Meta | Telora S24 | Researcher at MIT SeaGrant & UniSannio</h2>
                {/* <h2 className="col-span-3 p-4 pt-0 text-center text-lg">I'm a developer and love to write code. Give me a hard problem to solve.</h2> */}
                <Button
                    variant='outline'
                    onClick={() => handleItemClick()}
                    className="cursor-pointer w-fit h-fit p-2 self-center bg-blue-300 bg-opacity-20 hover:bg-opacity-90 "
                >
                    See my Resume
                </Button>
                <form onSubmit={handleSubmit} className="flex w-full p-4 pb-8 mx-auto">
                    <div className="flex flex-col w-full items-center justify-center">
                        <h4 className="text-4xl w-full h-fit text-center text-white p-4 pt-8"> Contact Me</h4>
                        <div className="flex-col w-2/3 items-center pb-4">
                            <Label htmlFor="email" className="text-left pb-2 ">
                                Email
                            </Label>
                            <Input
                                id="email"
                                placeholder="Enter Email"
                                className="w-full h-fit"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="flex-col w-2/3 items-center pb-4">
                            <Label htmlFor="message" className="text-left">
                                Message
                            </Label>
                            <Textarea 
                                placeholder="Type your message here." 
                                id="message" 
                                className="col-span-3"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                        </div>
                        <Button variant="outline" type="submit" className="bg-white bg-opacity-10 text-center justify-center hover:bg-blue-200 hover:text-gray-600">Submit</Button>
                    </div>
                </form>
            </div>
        </div>
    )
}