import { createContext } from 'react';

// The context object lives in its own module so that AuthContext.jsx exports
// ONLY a component. If a file exports both a component and a plain value,
// `react-refresh/only-export-components` fires and Fast Refresh stops working:
// every edit becomes a full page reload, which loses all in-memory state.
export const AuthContext = createContext();
