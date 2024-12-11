import { useEffect, useRef, useState } from "react";
import LoadingScreen from "./Loading";
import { Switch } from "./ui/switch";
import { Paperclip } from 'lucide-react';
import axios from "axios";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import Image from 'next/image';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";


// Child component for the form
const ImageForm = ({ change, toggleView }: { change: (text: string) => void, toggleView: () => void}) => {
    const [swtch, flip] = useState<boolean>(false);
    const [prompt, setPrompt] = useState<string>("");
    const fileInputRef = useRef<HTMLInputElement>(null);
  
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        console.log("File selected:", file.name);
        // Call the new function here with the selected file
        change("");
        toggleView();
        improveImageQuality(file);
      }
    };
  
    const handleButtonClick = () => {
      if (fileInputRef.current) {
        fileInputRef.current.click(); // Trigger the file input click
      }
    };
  
    const improveImageQuality = async (file: File) => {
      console.log("Improving quality for:", file.name);
      try {
        const formData = new FormData();
        formData.append('file', file); 

        const response = await axios.post('/api/super-resolution', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
        
        const newImg = response.data.imgUrl;
        change(newImg);

        console.log("Image Resolution Improvement Success!", newImg);
      } catch (error) {
        console.error("Failed to improve image:", error);
      }
      
    };
  
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("Prompt submitted:", prompt);
        change("");
        toggleView();
    
        try {
            const response = await axios.post("/api/text-to-image", { prompt });
            console.log("Image Making Success!", response.data.temp_path);
            change(response.data.temp_path);
        } catch (error) {
            console.error("Failed to make image:", error);
        }
    };
  
    return (
      <div className="flex flex-col h-full space-y-4">
        {/* Switch */}
        <Switch
          className="border border-purple-800 self-end"
          checked={swtch}
          onCheckedChange={(state) => flip(state)}
        />
  
        {/* View when switch is unchecked */}
        {!swtch ? (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col space-y-4 items-center"
          >
            <p className="text-xl text-gray-700">Generate an Image</p>
            <Textarea
                value={prompt} 
                onChange={(e) => setPrompt(e.target.value)} 
                placeholder="Enter your prompt..."
                className="p-2 w-full rounded-md hover:border-purple-800 text-black"
            />
            <Button
                variant='outline'
                type="submit"
                className="px-4 py-2 bg-purple-500 border-purple-800 opacity-50 text-white rounded-md hover:bg-purple-800"
            >
              Submit
            </Button>
          </form>
        ) : (
          // View when switch is checked
          <div className="flex flex-col items-center space-y-4">
            <p className="text-xl text-gray-700">Improve the Quality of Your Image</p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={handleButtonClick}
              className="flex items-center space-x-2 px-4 py-2 text-white bg-purple-500 opacity-50 border border-purple-800 rounded-md hover:bg-purple-800"
            >
              <Paperclip className="h-6 w-auto" />
              <span className="text-white">Upload File</span>
            </button>
          </div>
        )}
      </div>
    );
  };

export default function Images() {
    const [changeView, building] = useState<boolean>(false); // View toggle
    //   const [imgList, setimgList] = useState<string[] | null>(null); // Image list
    const [currentImg, changeImg] = useState<string>(""); // Current image
    const [nasaImg, setNasa] = useState<string>("");
    const [nasaTitle, writeTitle] = useState<string>("");

    useEffect(() => {
        // Fetch images from APIs (example using NASA's API)
        const fetchImages = async () => {
            try {
                const response = await axios.get('/api/get-images');
                let imageUrl = response.data.nasa_data.hdurl;
                let otherUrl = response.data.nasa_data.url;
                let imageTitle = response.data.nasa_data.title;
                // setimgList([imageUrl]);
                changeImg(imageUrl); // Set the initial image
                console.log(response)
                setNasa(otherUrl);
                writeTitle(imageTitle);
            } catch (error) {
                console.error("Error fetching images:", error);
            }
        };

        fetchImages();
    }, []);

    useEffect(() => {
        let previousImg: string | null = null; // Track the previous image

        const deleteFile = async (filePath: string) => {
            if (!filePath.startsWith("/temp/")) return; // Ensure file is in the temp folder
            try {
                const response = await axios.post("/api/delete-file", { path: filePath });
            } catch (error) {
                console.error("Error deleting file:", error);
            }
        };

        if (previousImg) {
            deleteFile(previousImg); // Delete the previous image if it exists
        }

        // Update the previous image reference
        previousImg = currentImg;

        return () => {
            if (previousImg) {
                deleteFile(previousImg); // Delete the last image on component unmount
            }
        };
    }, [currentImg]);
    

//   useEffect(() => {
//     // Cycle through the images every 5 seconds
//     if (imgList) {
//       const interval = setInterval(() => {
//         changeImg((prevImg) => {
//           const currentIndex = imgList.indexOf(prevImg);
//           const nextIndex = (currentIndex + 1) % imgList.length;
//           return imgList[nextIndex];
//         });
//       }, 5000);

//       return () => clearInterval(interval); // Cleanup interval on unmount
//     }
//   }, [imgList]);

  const handleDownload = (url: string, name: string) => {
    const anchor = document.createElement("a"); // Create an anchor element
    anchor.href = url; // Set the image URL
    anchor.download = name; // Set the file name for download
    document.body.appendChild(anchor); // Append the anchor to the body
    anchor.click(); // Trigger a click event
    document.body.removeChild(anchor); // Clean up the DOM
  };

  return (
    <div className="w-full h-full grid grid-cols-7">
      {/* Main Image Display */}
      <div className="col-span-5 h-full max-h-screen max-w-screen p-16 rounded-xl object-contain">
        {currentImg ? (
            <div className="relative flex justify-center items-center w-full h-full">
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex w-full h-full items-center justify-center focus:outline-none">
                      <img
                          src={currentImg}
                          alt="Current Display"
                          className="rounded-xl shadow-2xl shadow-black max-h-full max-w-screen object-contain"
                      />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-fit h-fit p-2 bg-black">
                    {currentImg.startsWith("http") && (
                      <>
                        <DropdownMenuLabel>{nasaTitle}</DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-white"/>
                        <DropdownMenuItem onClick={() => handleDownload(currentImg, nasaTitle)}>Download</DropdownMenuItem>
                      </>
                    )}

                    {!currentImg.startsWith("http") && (
                      <DropdownMenuItem onClick={() => handleDownload(currentImg, "generated_img")}>Download</DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
            </div>
        ) : (
          <LoadingScreen />
        )}
      </div>

      {/* Right Panel */}
      <div className="col-span-2 h-full p-8">
        {changeView ? (
          <div className="flex flex-col space-y-4 w-full h-full">
            <img
                src={nasaImg}
                alt="Thumbnail"
                className="rounded-xl w-full h-1/3"
                
            />
            <ImageForm change={(text) => changeImg(text)} toggleView={()=> building(true)}/>
          </div>
        ) : (
            <div className="flex flex-col w-full h-full">
                <div className="invisible bg-transparent w-full h-1/2 pb-4"></div>
                <ImageForm change={(text) => changeImg(text)} toggleView={()=> building(true)}/>
            </div>
        )}
      </div>
    </div>
  );
}
