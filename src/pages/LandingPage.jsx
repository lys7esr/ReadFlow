import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Hero } from '../components/landing/Hero';
import { VibeSelector } from '../components/landing/VibeSelector';
import { UploadZone } from '../components/landing/UploadZone';
import { Button } from '../components/ui/Button';
import { useReader } from '../context/ReaderContext';
import { sessionStore } from '../services/sessionStore';
import { pdfStorage } from '../services/pdfStorage';

export const LandingPage = () => {
  const { setActivePdf } = useReader();
  const navigate = useNavigate();
  const [resumable, setResumable] = useState(null);

  useEffect(() => {
    const lastId = sessionStore.getLastId();
    if (!lastId) return;
    const data = sessionStore.get(lastId);
    if (data && pdfStorage.get(lastId)) {
      setResumable({ id: lastId, ...data, ...pdfStorage.get(lastId) });
    }
  }, []);

  const handleReady = (pdf) => {
    setActivePdf(pdf);
    navigate('/read');
  };

  const handleResume = () => {
    const entry = pdfStorage.get(resumable.id);
    if (!entry) return;
    setActivePdf({ id: resumable.id, url: entry.url, name: entry.name });
    navigate('/read');
  };

  return (
    <main className="min-h-[100dvh] px-5 py-10 sm:py-16 flex flex-col items-center">
      <Hero />
      <div className="w-full max-w-2xl mt-10 space-y-8 animate-slide-up">
        <VibeSelector />
        <UploadZone onReady={handleReady} />
        {resumable && (
          <div className="surface rounded-2xl p-4 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-xs uppercase tracking-widest text-text-muted">Continue reading</div>
              <div className="truncate text-sm mt-1">{resumable.name}</div>
              <div className="text-xs text-text-muted mt-1">
                Page {resumable.page || 1}{resumable.totalPages ? ` of ${resumable.totalPages}` : ''}
              </div>
            </div>
            <Button onClick={handleResume} size="sm">Resume</Button>
          </div>
        )}
      </div>
      <footer className="mt-auto pt-16 text-xs text-text-muted">
        Built for calm reading. Files never leave your device.
      </footer>
    </main>
  );
};