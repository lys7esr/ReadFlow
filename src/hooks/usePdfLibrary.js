import { useEffect, useState } from 'react';
import { pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).href;

let cached = null;

export const usePdfLibrary = () => {
  const [lib, setLib] = useState(cached);

  useEffect(() => {
    if (cached) return;

    let cancelled = false;

    (async () => {
      const reactPdf = await import('react-pdf');

      cached = reactPdf;

      if (!cancelled) {
        setLib(reactPdf);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return lib;
};