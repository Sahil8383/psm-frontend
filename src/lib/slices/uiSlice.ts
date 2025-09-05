import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UIState {
  sidebarOpen: boolean;
  modalOpen: boolean;
  modalType: string | null;
  notification: {
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    show: boolean;
  };
  loading: boolean;
  theme: 'light' | 'dark';
}

const initialState: UIState = {
  sidebarOpen: false,
  modalOpen: false,
  modalType: null,
  notification: {
    type: 'info',
    message: '',
    show: false,
  },
  loading: false,
  theme: 'light',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    openModal: (state, action: PayloadAction<string>) => {
      state.modalOpen = true;
      state.modalType = action.payload;
    },
    closeModal: (state) => {
      state.modalOpen = false;
      state.modalType = null;
    },
    showNotification: (state, action: PayloadAction<{ type: 'success' | 'error' | 'warning' | 'info'; message: string }>) => {
      state.notification = {
        ...action.payload,
        show: true,
      };
    },
    hideNotification: (state) => {
      state.notification.show = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  openModal,
  closeModal,
  showNotification,
  hideNotification,
  setLoading,
  toggleTheme,
  setTheme,
} = uiSlice.actions;

export default uiSlice.reducer; 