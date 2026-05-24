import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  sidebarOpen: boolean;
  themeMode: 'light' | 'dark';
  showNumberPad: boolean;
  showLeaderboard: boolean;
  notificationCount: number;
  isMobile: boolean;
}

const initialState: UIState = {
  sidebarOpen: true,
  themeMode: 'light',
  showNumberPad: true,
  showLeaderboard: false,
  notificationCount: 0,
  isMobile: false
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    toggleTheme: (state) => {
      state.themeMode = state.themeMode === 'light' ? 'dark' : 'light';
    },
    toggleNumberPad: (state, action: PayloadAction<boolean>) => {
      state.showNumberPad = action.payload;
    },
    toggleLeaderboard: (state, action: PayloadAction<boolean>) => {
      state.showLeaderboard = action.payload;
    },
    setNotificationCount: (state, action: PayloadAction<number>) => {
      state.notificationCount = action.payload;
    },
    setIsMobile: (state, action: PayloadAction<boolean>) => {
      state.isMobile = action.payload;
    }
  }
});

export const {
  toggleSidebar,
  toggleTheme,
  toggleNumberPad,
  toggleLeaderboard,
  setNotificationCount,
  setIsMobile
} = uiSlice.actions;

export default uiSlice.reducer;
