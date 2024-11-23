import "jquery";
import "@chrisoakman/chessboardjs/dist/chessboard-1.0.0.min.css";
import Chessboard from '@chrisoakman/chessboardjs';

import { useEffect, useRef, useState } from 'react';
import { Button } from "./ui/button";

export default function Chess() {
    const boardRef = useRef<HTMLDivElement>(null);
    const chessboard = useRef<any>(null);

    useEffect(() => {
        // Ensure the code runs only on the client side
        if (typeof window !== 'undefined' && boardRef.current) {
        // Initialize the chessboard
        chessboard.current = (Chessboard as any)(boardRef.current, {
            position: 'start',
            draggable: true,
            showErrors: 'console',
        });
        }

        // Cleanup function to destroy the chessboard on unmount
        return () => {
        if (chessboard.current) {
            chessboard.current.destroy();
        }
        };
    }, []);

    const handleNewGame = () => {
        chessboard.current.clear(false);
        chessboard.current.start(false);
    }

    return (
        <div className="w-full h-full flex flex-col p-[10%]">
            <Button variant='outline' className="h-fit w-fit self-left">New Game</Button>
            <div ref={boardRef} style={{ width: "400px" }} id="myBoard"></div>
        </div>
        
    )
}