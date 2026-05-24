import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GameSession, Puzzle, GameMode, Difficulty } from '@sudoworld/shared';

interface GameState {
  currentSession: GameSession | null;
  currentPuzzle: Puzzle | null;
  selectedMode: GameMode | null;
  selectedDifficulty: Difficulty | null;
  isGameActive: boolean;
  mistakes: number;
  hintsUsed: number;
  notes: Map<string, number[]>;
  selectedCell: { row?: number; col?: number; x?: number; y?: number; z?: number } | null;
  elapsedTime: number;
  gameHistory: GameSession[];
}

const initialState: GameState = {
  currentSession: null,
  currentPuzzle: null,
  selectedMode: null,
  selectedDifficulty: null,
  isGameActive: false,
  mistakes: 0,
  hintsUsed: 0,
  notes: new Map(),
  selectedCell: null,
  elapsedTime: 0,
  gameHistory: []
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    startGame: (state, action: PayloadAction<{ mode: GameMode; difficulty: Difficulty }>) => {
      state.selectedMode = action.payload.mode;
      state.selectedDifficulty = action.payload.difficulty;
      state.isGameActive = true;
      state.mistakes = 0;
      state.hintsUsed = 0;
      state.elapsedTime = 0;
      state.notes.clear();
    },
    setCurrentPuzzle: (state, action: PayloadAction<Puzzle>) => {
      state.currentPuzzle = action.payload;
    },
    setCurrentSession: (state, action: PayloadAction<GameSession>) => {
      state.currentSession = action.payload;
    },
    selectCell: (state, action) => {
      state.selectedCell = action.payload;
    },
    makeMove: (state, action: PayloadAction<{ position: any; value: number }>) => {
      // Move will be sent to backend
    },
    addNote: (state, action: PayloadAction<{ cellId: string; value: number }>) => {
      const current = state.notes.get(action.payload.cellId) || [];
      if (!current.includes(action.payload.value)) {
        state.notes.set(action.payload.cellId, [...current, action.payload.value]);
      }
    },
    removeNote: (state, action: PayloadAction<{ cellId: string; value: number }>) => {
      const current = state.notes.get(action.payload.cellId) || [];
      state.notes.set(
        action.payload.cellId,
        current.filter((v) => v !== action.payload.value)
      );
    },
    addMistake: (state) => {
      state.mistakes++;
      if (state.mistakes >= 3) {
        state.isGameActive = false;
      }
    },
    addHintUsed: (state) => {
      state.hintsUsed++;
    },
    incrementTimer: (state) => {
      state.elapsedTime++;
    },
    endGame: (state) => {
      state.isGameActive = false;
    },
    resetGame: (state) => {
      state.currentSession = null;
      state.currentPuzzle = null;
      state.selectedMode = null;
      state.selectedDifficulty = null;
      state.isGameActive = false;
      state.mistakes = 0;
      state.hintsUsed = 0;
      state.notes.clear();
      state.selectedCell = null;
      state.elapsedTime = 0;
    }
  }
});

export const {
  startGame,
  setCurrentPuzzle,
  setCurrentSession,
  selectCell,
  makeMove,
  addNote,
  removeNote,
  addMistake,
  addHintUsed,
  incrementTimer,
  endGame,
  resetGame
} = gameSlice.actions;

export default gameSlice.reducer;
