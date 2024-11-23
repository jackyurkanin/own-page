import { useEffect, useRef, useState } from "react";
import LoadingScreen from "./Loading";
import { Switch } from "./ui/switch";
import { Paperclip } from 'lucide-react';
import axios from "axios";

// Child component for the form
const ImageForm = ({ change }: { change: (text: string) => void }) => {
    const [swtch, flip] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
  
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        console.log("File selected:", file.name);
        // Call the new function here with the selected file
        change("");
        improveImageQuality(file);
      }
    };
  
    const handleButtonClick = () => {
      if (fileInputRef.current) {
        fileInputRef.current.click(); // Trigger the file input click
      }
    };
  
    const improveImageQuality = (file: File) => {
      console.log("Improving quality for:", file.name);
      // Add your API call or processing logic here
    };
  
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      console.log("Prompt submitted");
      change("");
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
            <p className="text-xl text-gray-700">Try out my image generator</p>
            <input
              type="text"
              placeholder="Enter your prompt..."
              className="p-2 border w-full border-gray-300 rounded-md"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Submit
            </button>
          </form>
        ) : (
          // View when switch is checked
          <div className="flex flex-col items-center space-y-4">
            <p className="text-xl text-gray-700">Improve quality of an image</p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={handleButtonClick}
              className="flex items-center space-x-2 px-4 py-2 text-blue-500 border border-blue-500 rounded-md hover:text-green-500 hover:border-green-500"
            >
              <Paperclip className="h-6 w-auto" />
              <span>Upload File</span>
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
  const [thumbImg, setThumb] = useState<string>("");
  const [nasaTitle, writeTitle] = useState<string>("");

  useEffect(() => {
    // Fetch images from APIs (example using NASA's API)
    const fetchImages = async () => {
      try {
        const response = await axios.get('/api/get-images');
        let imageUrl = response.data.nasa_data.url;
        let imageTitle = response.data.nasa_data.title;
        // setimgList([imageUrl]);
        changeImg(imageUrl); // Set the initial image
        setThumb(imageUrl);
        writeTitle(imageTitle);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, []);

  useEffect(() => {
    if (!changeView) {
      building(!changeView);
    }
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

  return (
    <div className="w-full h-full grid grid-cols-7">
      {/* Main Image Display */}
      <div className="col-span-5 h-full p-16 rounded-xl">
        {currentImg ? (
            <div className="relative flex justify-center items-center w-full h-full">
                <img
                    src={currentImg}
                    alt="Current Display"
                    className="max-w-full max-h-full rounded-xl shadow-2xl shadow-black"
                    style={{ width: "auto", height: "auto" }}
                />
                <p className="absolute bottom-2 right-2 bg-transparent text-white text-sm p-1">
                    {nasaTitle}
                </p>
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
              src={thumbImg}
              alt="Thumbnail"
              className="h-1/2 w-full object-cover rounded-xl"
            />
            <ImageForm change={(text) => changeImg(text)}/>
          </div>
        ) : (
            <div className="flex flex-col w-full h-full">
                <div className="invisible bg-transparent w-full h-1/2 pb-4"></div>
                <ImageForm change={(text) => changeImg(text)}/>
            </div>
        )}
      </div>
    </div>
  );
}
