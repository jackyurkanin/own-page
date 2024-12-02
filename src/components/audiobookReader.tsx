'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { FileUp, Play, Pause, FastForward, Rewind } from 'lucide-react';
import Cookies from 'js-cookie';
import { Button } from './ui/button';
import { Input } from './ui/input';
import axios from 'axios';

// Types for better type safety
type BookState = {
  name: string;
  content: string;
  currentPage: number;
  totalPages: number;
};

export default function BookReader() {
    // State management
    const [files, setFiles] = useState<File[]>([]);
    const [selectedBook, setSelectedBook] = useState<File | null>(null);
    const [audioBook, setAudioBook] = useState<BookState | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    
    // Refs
    const fileInputRef = useRef<HTMLInputElement>(null);
    const audioRef = useRef<HTMLAudioElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    // Drag and Drop Handlers
    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        
        const droppedFiles = Array.from(e.dataTransfer.files);
        setFiles(prevFiles => [...prevFiles, ...droppedFiles]);
        setError(null);
    }, []);

     // File Input Handler

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files)

            setFiles(prevFiles => [...prevFiles, ...newFiles]);
            setError(null);
        }
    };

  // Book Selection and Content Loading
    const handleBookSelect = async (file: File) => {
        try {
            // Simulating book content reading (replace with actual file reading logic)
            setSelectedBook(file)
            const savedPage = Cookies.get(file.name); // Retrieve saved page from cookies

            const formData = new FormData();
            formData.append('pdf_file', file);
            if( savedPage) {
              formData.append('savedPage', savedPage)
            }

            const response = await axios.post('/api/py/get-audiobook', formData)
            console.log(response);
            setAudioBook({
              content: response.data.text,
              name: file.name,
              currentPage: response.data.currentPage,
              totalPages: response.data.totalPages,
            });
            
            fetchAudio();
            setError(null);
        } catch (err) {
            setError('Failed to read book file');
            console.error(err);
        }
    };

    // Page Tracking and Cookie Management
    const updatePageInCookies = useCallback((bookName: string, page: number) => {
      // Set cookie to expire in 7 days
      Cookies.set(bookName, page.toString(), { expires: 7 });
    }, []);

    // Audio Player Controls
    const togglePlayPause = () => {
      if (audioRef.current) {
        if (isPlaying) {
          audioRef.current.pause();
        } else {
          audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
      }
    };

    // Fetch and Play Audio for the Current Page
    const fetchAudio = async () => {
      if (!selectedBook) return;

      try {
        const response = await axios.get(`/api/py/get-audio?audiobook=${selectedBook}`, {
          responseType: 'blob',
        });

        const audioBlob = new Blob([response.data], { type: 'audio/mpeg' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioUrl(audioUrl);

        if (audioRef.current) {
          audioRef.current.src = audioUrl;
          audioRef.current.play();
          setIsPlaying(true);
        }
      } catch (err) {
        setError('Failed to play audio');
        console.error(err);
      }
    };

    // Page Navigation
    const navigatePage = async (direction: 'next' | 'back') => {
      if (!selectedBook) return;

      try {
        const formData = new FormData();
        formData.append('pdf_file', selectedBook);
        formData.append('page', String(audioBook?.currentPage));
        formData.append('func', direction)
        const response = await axios.post('/api/py/change-page', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            }
        },);

        setAudioBook(prev => prev && { ...prev,content: response.data.content, currentPage: direction === 'next' ? prev.currentPage + 1 : prev.currentPage - 1 });
        fetchAudio(); // Fetch audio for the new page
      } catch (err) {
        setError('Failed to change page');
        console.error(err);
      }
    };

    // Content Scrolling and Page Tracking
    useEffect(() => {
      const contentElement = contentRef.current;
      
      const handleScroll = () => {
        if (contentElement && audioBook) {
          const scrollPercentage = 
            (contentElement.scrollTop / (contentElement.scrollHeight - contentElement.clientHeight)) * 100;
          
          const estimatedCurrentPage = Math.ceil(scrollPercentage / (100 / audioBook.totalPages));
          
          // Update cookies when page changes
          updatePageInCookies(audioBook.name, estimatedCurrentPage);
        }
      };

      contentElement?.addEventListener('scroll', handleScroll);
      return () => contentElement?.removeEventListener('scroll', handleScroll);
    }, [selectedBook, updatePageInCookies]);

    const handleAudioEnd = () => {
      navigatePage('next'); 
    };

    return (
    <div className='w-full h-full grid grid-cols-4 items-center'>
        {/* Book Content Display */}{/* Audio Player Controls */}
        <div className="col-start-1 col-span-1 mt-4 flex justify-center items-center">
        </div>

        {audioBook && (
            <div 
                ref={contentRef}
                className="max-h-[66%] col-start-1 col-span-3 overflow-y-auto wrap p-8 bg-transparent
                rounded-lg text-justify text-xl leading-relaxed text-black break-words"
            >
                {audioBook.content}
            </div>        
        )}

        <div 
          className="flex flex-col col-start-4 col-span-1 max-h-[70%] mx-auto p-6  w-full bg-[#008080] shadow-lg rounded-l-lg"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {/* File Upload Section */}
          <div 
            className="border-2 border-dashed border-gray-300 p-6 text-center bg-white
            hover:bg-gray-300 transition duration-300 cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <FileUp className="mx-auto mb-4 text-black" size={48} />
            <p className='text-black'>Drag and Drop or Click to Upload</p>
            <Input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileUpload}
              multiple
              accept=".pdf"
              className="hidden"
            />
          </div>

          {/* Uploaded Files List */}
          {files.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Uploaded Files:</h3>
              {files.map((file, index) => (
                <div 
                  key={index} 
                  className="flex justify-between items-center p-2 
                  bg-white rounded mb-2 hover:bg-gray-300 cursor-pointer"
                  onClick={() => handleBookSelect(file)}
                >
                  <span className='text-black'>{file.name}</span>
                  <span className="text-sm text-gray-500">{(file.size / 1024).toFixed(2)} KB</span>
                </div>
              ))}
            </div>
          )}

          {audioBook && (
            <div className="flex justify-center items-center gap-x-2 mt-4">
              <Button 
                onClick={() => navigatePage('back')}
                className="bg-white text-[#008080] p-3 rounded-full hover:bg-gray-300 transition duration-300"
              >
                <Rewind size={24} />
              </Button>
              <Button 
                onClick={togglePlayPause}
                className="bg-white text-[#008080] p-3 rounded-full hover:bg-gray-300 transition duration-300"
              >
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
              </Button>
              <Button 
                onClick={() => navigatePage('next')}
                className="bg-white text-[#008080] p-3 rounded-full hover:bg-gray-300 transition duration-300"
              >
                <FastForward size={24} />
              </Button>
              <p className="text-white">
                Page {audioBook.currentPage} of {audioBook.totalPages}
              </p>
            </div>
          )}
        </div>

        <audio ref={audioRef} className="hidden" onEnded={handleAudioEnd}></audio>

        {error && (
          <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}
    </div>
  );
};