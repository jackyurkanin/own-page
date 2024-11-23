declare module "@chrisoakman/chessboardjs" {
  export default class Chessboard {
    constructor(containerElOrId: string | HTMLElement, config?: ChessboardConfig);

    // Methods
    clear(useAnimation?: boolean): void; // Clears the board
    destroy(): void; // Removes the board instance
    fen(): string; // Returns the current position as a FEN string
    flip(): void; // Flips the board orientation
    move(...moves: string[]): PositionObject; // Moves pieces
    position(): PositionObject; // Returns current position as an object
    position(fen: "fen"): string; // Returns current position as a FEN string
    position(newPosition: PositionObject | string, useAnimation?: boolean): void; // Sets the board position
    orientation(): "white" | "black"; // Returns the current board orientation
    orientation(side: "white" | "black" | "flip"): void; // Sets or flips the orientation
    resize(): void; // Recalculates and redraws the board
    start(useAnimation?: boolean): void; // Resets to the starting position
  }

  // Configuration Object
  export interface ChessboardConfig {
    position?: "start" | string | PositionObject; // Initial position
    draggable?: boolean; // Enables drag-and-drop
    dropOffBoard?: "snapback" | "trash"; // Behavior for pieces dropped off the board
    orientation?: "white" | "black"; // Initial orientation
    showNotation?: boolean; // Show or hide board notation
    sparePieces?: boolean; // Enables spare pieces
    pieceTheme?: string | ((piece: string) => string); // Custom piece images
    appearSpeed?: number | "slow" | "fast"; // Animation speed for pieces appearing
    moveSpeed?: number | "slow" | "fast"; // Animation speed for moves
    snapbackSpeed?: number | "slow" | "fast"; // Speed for snapback animation
    snapSpeed?: number | "slow" | "fast"; // Speed for snapping to a square
    trashSpeed?: number | "slow" | "fast"; // Speed for removing pieces
    showErrors?: false | "console" | "alert" | ((code: string, error: string, data?: any) => void);

    // Event Callbacks
    onChange?: (oldPos: PositionObject, newPos: PositionObject) => void;
    onDragStart?: (
      source: string,
      piece: string,
      position: PositionObject,
      orientation: "white" | "black"
    ) => boolean | void;
    onDragMove?: (
      newLocation: string,
      oldLocation: string,
      source: string,
      piece: string,
      position: PositionObject,
      orientation: "white" | "black"
    ) => void;
    onDrop?: (
      source: string,
      target: string,
      piece: string,
      newPos: PositionObject,
      oldPos: PositionObject,
      orientation: "white" | "black"
    ) => "snapback" | "trash" | void;
    onMouseoutSquare?: (
      square: string,
      piece: string | false,
      position: PositionObject,
      orientation: "white" | "black"
    ) => void;
    onMouseoverSquare?: (
      square: string,
      piece: string | false,
      position: PositionObject,
      orientation: "white" | "black"
    ) => void;
    onMoveEnd?: (oldPos: PositionObject, newPos: PositionObject) => void;
    onSnapbackEnd?: (
      piece: string,
      square: string,
      position: PositionObject,
      orientation: "white" | "black"
    ) => void;
    onSnapEnd?: (
      source: string,
      target: string,
      piece: string
    ) => void;
  }

  // Position Object Type
  export interface PositionObject {
    [square: string]: string; // e.g., { e2: 'wP', e7: 'bP' }
  }
}
