import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { VibeProvider } from './context/VibeContext';
import { ReaderProvider } from './context/ReaderContext';
import { AppShell } from './components/layout/AppShell';
import { LandingPage } from './pages/LandingPage';
import { ReaderPage } from './pages/ReaderPage';

export default function App() {
  return (
    <VibeProvider>
      <ReaderProvider>
        <BrowserRouter>
          <AppShell>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/read" element={<ReaderPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AppShell>
        </BrowserRouter>
      </ReaderProvider>
    </VibeProvider>
  );
}