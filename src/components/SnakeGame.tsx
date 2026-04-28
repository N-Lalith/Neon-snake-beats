import React, { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;
const INITIAL_SPEED = 150;
const SPEED_INCREMENT = 2;

type Point = { x: number; y: number };

const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Point = { x: 0, y: -1 };

export function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const speedRef = useRef(INITIAL_SPEED);
  
  // Using ref for direction to avoid complex deps in game loop
  const directionRef = useRef(direction);
  
  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    let isOccupied = true;
    while (isOccupied) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      isOccupied = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
    }
    return newFood!;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    setHasStarted(true);
    setFood(generateFood(INITIAL_SNAKE));
    speedRef.current = INITIAL_SPEED;
  };

  const checkCollision = (head: Point) => {
    // Wall collision
    if (
      head.x < 0 ||
      head.x >= GRID_SIZE ||
      head.y < 0 ||
      head.y >= GRID_SIZE
    ) {
      return true;
    }
    // Self collision (ignore the tail as it will move forward)
    for (let i = 0; i < snake.length - 1; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) return true;
    }
    return false;
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default scrolling for arrows and space
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ' && hasStarted && !gameOver) {
        setIsPaused(p => !p);
        return;
      }

      if (!hasStarted) {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter', 'w', 'a', 's', 'd'].includes(e.key)) {
            resetGame();
        }
        return;
      }

      if (gameOver) {
          if (e.key === 'Enter') resetGame();
          return;
      }

      const currentDir = directionRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (currentDir.y !== 1) directionRef.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (currentDir.y !== -1) directionRef.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (currentDir.x !== 1) directionRef.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (currentDir.x !== -1) directionRef.current = { x: 1, y: 0 };
          break;
      }
      setDirection(directionRef.current);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasStarted, gameOver]);

  useEffect(() => {
    if (gameOver || isPaused || !hasStarted) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y,
        };

        if (checkCollision(newHead)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10);
          setFood(generateFood(newSnake));
          // Speed up slightly
          speedRef.current = Math.max(50, speedRef.current - SPEED_INCREMENT);
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const intervalId = setInterval(moveSnake, speedRef.current);
    return () => clearInterval(intervalId);
  }, [snake, food, gameOver, isPaused, hasStarted, generateFood]);


  return (
    <div className="flex flex-col items-center">
      {/* Score Header */}
      <div className="flex justify-between w-full max-w-[400px] mb-4 text-cyan-400 font-mono">
        <div className="text-xl font-bold drop-shadow-[0_0_8px_currentColor]">SCORE: {score}</div>
        <div className="text-lg opacity-80">Snake_OS v1.0</div>
      </div>

      {/* Game Board */}
      <div 
        className="relative bg-gray-950 border-2 border-cyan-800/50 rounded-lg p-1 shadow-[0_0_50px_rgba(34,211,238,0.15)] flex-shrink-0"
        style={{
          width: 'min(90vw, 400px)',
          height: 'min(90vw, 400px)',
          maxWidth: '400px',
          maxHeight: '400px'
        }}
      >
        {/* Grid lines background (optional, adds to neon aesthetic) */}
        <div 
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
                backgroundImage: 'linear-gradient(cyan 1px, transparent 1px), linear-gradient(90deg, cyan 1px, transparent 1px)',
                backgroundSize: '5% 5%'
            }}
        />

        <div className="w-full h-full relative" style={{ display: 'grid', gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`, gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)` }}>
          {/* Food */}
          <div
            className="bg-pink-500 rounded-full shadow-[0_0_10px_#ec4899] animate-pulse"
            style={{
              gridColumnStart: food.x + 1,
              gridRowStart: food.y + 1,
              transform: 'scale(0.8)'
            }}
          />

          {/* Snake */}
          {snake.map((segment, index) => {
            const isHead = index === 0;
            return (
              <div
                key={`${segment.x}-${segment.y}-${index}`}
                className={`${isHead ? 'bg-cyan-300' : 'bg-cyan-500/80'} rounded-sm shadow-[0_0_8px_#22d3ee] transition-all duration-75`}
                style={{
                  gridColumnStart: segment.x + 1,
                  gridRowStart: segment.y + 1,
                  transform: isHead ? 'scale(1)' : 'scale(0.85)',
                  zIndex: isHead ? 10 : 1
                }}
              />
            );
          })}
        </div>

        {/* Overlays */}
        {!hasStarted && (
          <div className="absolute inset-0 bg-gray-950/80 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6 z-20">
            <h2 className="text-3xl font-bold text-cyan-400 drop-shadow-[0_0_10px_currentColor] mb-4">NEON SNAKE</h2>
            <p className="text-gray-300 font-mono mb-6">Use Arrow Keys or WASD to move.</p>
            <button 
                onClick={resetGame}
                className="px-6 py-3 bg-cyan-950/50 border border-cyan-400 text-cyan-300 font-bold rounded hover:bg-cyan-900 transition-colors shadow-[0_0_15px_rgba(34,211,238,0.5)]"
            >
                INITIALIZE SEQUENCE
            </button>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 bg-red-950/80 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6 z-20">
            <h2 className="text-4xl font-bold text-red-500 drop-shadow-[0_0_15px_currentColor] mb-2">SYSTEM FAILURE</h2>
            <p className="text-white text-xl font-mono mb-6 drop-shadow-[0_0_5px_white]">Final Score: {score}</p>
            <button 
                onClick={resetGame}
                className="px-6 py-3 bg-red-950/50 border border-red-500 text-red-400 font-bold rounded hover:bg-red-900 transition-colors shadow-[0_0_15px_rgba(239,68,68,0.5)]"
            >
                REBOOT SYSTEM (Enter)
            </button>
          </div>
        )}

        {isPaused && !gameOver && hasStarted && (
          <div className="absolute inset-0 bg-gray-950/50 backdrop-blur-sm flex items-center justify-center z-20">
            <h2 className="text-3xl font-bold text-yellow-400 drop-shadow-[0_0_10px_currentColor] tracking-[0.2em] uppercase">Paused</h2>
          </div>
        )}
      </div>

      <div className="mt-4 text-xs text-gray-500 font-mono text-center max-w-[400px]">
        [SPACE] Pause/Resume
      </div>
    </div>
  );
}
