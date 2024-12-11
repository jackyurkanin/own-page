import { Center, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Suspense, useState } from "react";
import CanvasLoader from "./design/CanvasLoader";
import DemoMac from "./design/DemoMac";

type Project = {
    src: string;
    title: string;
    brief: string;
}

const projects: Project[] = [
    {
        src: '/Briefcase.mp4',
        title: 'BRIEFCASE',
        brief: 'AI Lawsuit Qualification & Attorneys onDemand',
    },
    {
        src: '/Eureka.mp4',
        title: 'EUREKA',
        brief: 'Research Paper AI',
    },
    
]
const projectLen = projects.length;

const Computer = () => {
    const [selectedInd, changeScreen] = useState<number>(0);
    const currentProject = projects[selectedInd];

    const handleNavigation = (change: string) => {
        console.log(currentProject);
        changeScreen( (prevIndex) => {
            if (change === 'previous') {
                return prevIndex === 0? projectLen - 1 : prevIndex - 1;
            } else {
                return prevIndex === projectLen - 1? 0: prevIndex + 1;
            }
        })
    }

    return (
        <div className="relative w-full h-full bg-gray-900 rounded-r-xl">
            <button 
                className="absolute top-4 left-4 arrow-btn w-fit h-fit z-10"
                onClick={() => handleNavigation('previous')}
            >
                <ArrowLeft className="h-10 w-10"/>
            </button>
            <button 
                className="absolute top-4 right-4 arrow-btn w-fit h-fit z-10"
                onClick={() => handleNavigation('next')}
            >
                <ArrowRight className="h-10 w-10"/>
            </button>
            <div className="h-full w-full">
                <Canvas>
                    <ambientLight intensity={Math.PI}/>
                    <directionalLight position={[10, 10, 5]}/>
                    <Center>
                        <Suspense fallback={<CanvasLoader/>}>
                            <group scale={12} position={[0, -1, 1]} rotation={[0.3, 5*Math.PI/8, 0]}>
                                <DemoMac texture={currentProject.src}/>
                            </group>
                        </Suspense>
                    </Center>
                    <OrbitControls/>
                </Canvas>
            </div>
        </div>
    )
}

export default Computer;