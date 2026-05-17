import { createContext, useContext, useMemo, useState } from 'react';

const ReaderContext = createContext(null);

export const ReaderProvider = ({ children }) => {
  const [activePdf, setActivePdf] = useState(null); // { id, url, name }
  const value = useMemo(() => ({ activePdf, setActivePdf }), [activePdf]);
  return <ReaderContext.Provider value={value}>{children}</ReaderContext.Provider>;
};

export const useReader = () => {
  const ctx = useContext(ReaderContext);
  if (!ctx) throw new Error('useReader must be used inside ReaderProvider');
  return ctx;
};