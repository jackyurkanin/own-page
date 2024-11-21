import { Paperclip } from 'lucide-react';
import React, { useRef } from 'react';
import axios from 'axios';

type FileUploadProps = {
  threadId: string;
  assistant_id: string;
  addMessage: (message: { text: string; sender: 'user' | 'bot' | 'system', isSuccessfulCase: boolean, caseDetails: any }) => void;
};

export default function FileUploadButton({ threadId, assistant_id, addMessage}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleButtonClick = () => {
    // Programmatically click the hidden file input
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      console.log('Selected file:', file);

      // Prepare the file and thread ID in FormData
      const formData = new FormData();
      formData.append('file', file); // Append the file
      formData.append('thread_id', threadId); // Append the thread ID
      formData.append('assistant_id', assistant_id); // Append the assistant_id

      // To inspect the form data, you can iterate over the entries
      formData.forEach((value, key) => {
        console.log(`${key}:`, value);
      });

      try {
        // Make the POST request to your API
        const response = await axios.post('/api/openai/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log('File uploaded successfully:', response);
        const newMessage = {
            text: 'File uploaded!',
            sender: 'user' as const,
            isSuccessfulCase: false,
            caseDetails: null
          };
      
        // Call the function passed from the parent to add the message
        addMessage(newMessage);

      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Button to trigger file upload */}
      <button
        onClick={handleButtonClick}
        className=""
      >
        <Paperclip className=" pr-2 h-6 w-auto text-blue-300 hover:text-green-500" />
      </button>
    </div>
  );
}
