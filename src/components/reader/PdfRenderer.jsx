import { forwardRef, useEffect, useMemo, useState } from 'react';
import { usePdfLibrary } from '../../hooks/usePdfLibrary';
import { useVibe } from '../../context/VibeContext';
import { Spinner } from '../ui/Spinner';
import { READER_CONFIG } from '../../constants/reader';

const useViewportScale = () => {
  const [scale, setScale] = useState(() =>
    window.innerWidth < 768 ? READER_CONFIG.pdfScaleMobile : READER_CONFIG.pdfScaleDesktop
  );
  useEffect(() => {
    const onResize = () =>
      setScale(window.innerWidth < 768 ? READER_CONFIG.pdfScaleMobile : READER_CONFIG.pdfScaleDesktop);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return scale;
};

export const PdfRenderer = forwardRef(function PdfRenderer(
  { fileUrl, onLoaded, onPageChange }, ref
) {
  const lib = usePdfLibrary();
  const { vibe } = useVibe();
  const scale = useViewportScale();
  const [numPages, setNumPages] = useState(0);
  const [width, setWidth] = useState(800);

  useEffect(() => {
    const update = () => {
      const el = ref?.current;
      if (!el) return;
      setWidth(Math.min(el.clientWidth - 24, 900));
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [ref]);

  // Track which page is currently in view via IntersectionObserver
  useEffect(() => {
    const root = ref?.current;
    if (!root || !numPages) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) {
          const p = Number(visible.target.getAttribute('data-page'));
          if (p) onPageChange?.(p);
        }
      },
      { root, threshold: [0.25, 0.5, 0.75] }
    );
    const nodes = root.querySelectorAll('[data-page]');
    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, [numPages, ref, onPageChange]);

  const fileProp = useMemo(() => ({ url: fileUrl }), [fileUrl]);

  if (!lib) {
    return <div className="grid place-items-center h-full"><Spinner label="Loading reader…" /></div>;
  }

  const { Document, Page } = lib;

  return (
    <Document
      file={fileProp}
      loading={<div className="grid place-items-center py-20"><Spinner label="Opening PDF…" /></div>}
      error={<div className="text-center py-20 text-red-400">Failed to load this PDF.</div>}
      onLoadSuccess={({ numPages: n }) => {
        setNumPages(n);
        onLoaded?.({ numPages: n });
      }}
    >
      {Array.from({ length: numPages }, (_, i) => (
        <div
          key={i + 1}
          data-page={i + 1}
          style={{ marginBottom: vibe.config.pageMargin }}
        >
          <Page
            pageNumber={i + 1}
            width={width}
            scale={scale}
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
        </div>
      ))}
    </Document>
  );
});