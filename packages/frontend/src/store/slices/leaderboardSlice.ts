import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LeaderboardEntry } from '@sudoworld/shared';

interface LeaderboardState {
  daily: LeaderboardEntry[];
  weekly: LeaderboardEntry[];
  monthly: LeaderboardEntry[];
  yearly: LeaderboardEntry[];
  currentType: 'daily' | 'weekly' | 'monthly' | 'yearly';
  isLoading: boolean;
  error: string | null;
  userRank: { [key: string]: number | null };
}

const initialState: LeaderboardState = {
  daily: [],
  weekly: [],
  monthly: [],
  yearly: [],
  currentType: 'daily',
  isLoading: false,
  error: null,
  userRank: {}
};

const leaderboardSlice = createSlice({
  name: 'leaderboard',
  initialState,
  reducers: {
    setLeaderboardType: (state, action: PayloadAction<'daily' | 'weekly' | 'monthly' | 'yearly'>) => {
      state.currentType = action.payload;
    },
    setLeaderboardEntries: (
      state,
      action: PayloadAction<{ type: string; entries: LeaderboardEntry[] }>
    ) => {
      state[action.payload.type as keyof Omit<LeaderboardState, 'currentType' | 'isLoading' | 'error' | 'userRank'>] = action.payload.entries;
    },
    setUserRank: (state, action: PayloadAction<{ type: string; rank: number | null }>) => {
      state.userRank[action.payload.type] = action.payload.rank;
    },
    setLeaderboardLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setLeaderboardError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    }
  }
});

export const {
  setLeaderboardType,
  setLeaderboardEntries,
  setUserRank,
  setLeaderboardLoading,
  setLeaderboardError
} = leaderboardSlice.actions;

export default leaderboardSlice.reducer;
