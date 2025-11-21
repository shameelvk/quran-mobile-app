// redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import favoritesReducer from './favoritesSlice';
import { loadFavorites } from './favoritesSlice';

/**
 * REDUX STORE: The central state container for the entire application.
 * All components can access this state and dispatch actions to update it.
 */

/**
 * MIDDLEWARE: Custom middleware to persist favorites to AsyncStorage
 * Middleware runs between dispatching an action and it reaching the reducer.
 * This middleware saves favorites to AsyncStorage whenever they change.
 */
const persistFavoritesMiddleware = (store) => (next) => (action) => {
  // Let the action pass through to the reducer first
  const result = next(action);
  
  // After the state is updated, check if it was a favorites action
  if (action.type?.startsWith('favorites/')) {
    // Get the updated favorites from the store
    const state = store.getState();
    const favorites = state.favorites.favorites;
    
    // Save to AsyncStorage
    AsyncStorage.setItem('favorites', JSON.stringify(favorites))
      .catch((error) => {
        console.error('Error saving favorites to AsyncStorage:', error);
      });
  }
  
  return result;
};

/**
 * CONFIGURE STORE: Creates the Redux store with all reducers and middleware
 */
const store = configureStore({
  reducer: {
    // Add the favorites reducer to the store
    // This makes the favorites state available at state.favorites
    favorites: favoritesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Disable serializable check for AsyncStorage
      serializableCheck: false,
    }).concat(persistFavoritesMiddleware),
});

/**
 * LOAD INITIAL STATE: Load favorites from AsyncStorage when the app starts
 */
export const initializeStore = async () => {
  try {
    const favoritesData = await AsyncStorage.getItem('favorites');
    if (favoritesData) {
      const favorites = JSON.parse(favoritesData);
      store.dispatch(loadFavorites(favorites));
    }
  } catch (error) {
    console.error('Error loading favorites from AsyncStorage:', error);
  }
};

export default store;
