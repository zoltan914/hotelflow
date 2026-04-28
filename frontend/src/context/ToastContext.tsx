import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Toast, ToastType } from '../interfaces/interfaces';

interface ToastContextValue {
  addToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string | Object, type: ToastType = 'success') => {

    const baseId = Date.now();

    // Segédfüggvény a hozzáadáshoz és az időzített törléshez
    const pushToast = (msg: string, finalId: number, toastType: ToastType) => {
      setToasts((prev) => [...prev, { id: finalId, message: msg, type: toastType }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== finalId));
      }, 3000);
    };

    if (typeof message === 'string') {
      pushToast(message, baseId, type);
    } else if (typeof message === 'object' && message !== null) {
      // Kinyerjük az összes üzenetet (akár beágyazott 'message' kulcsról van szó, akár a Map-ről)
      const errorEntries = Object.values(message);
      
      errorEntries.forEach((msg, i) => {
        // Itt fontos, hogy mindegyiknek saját timeoutja legyen a saját ID-jára
        pushToast(String(msg), baseId + i, 'error');
      });
    }
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div
        style={{
          position: 'fixed',
          top: '16px',
          right: '16px',
          zIndex: 2000,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          maxWidth: '400px',
        }}
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            style={{
              padding: '12px 20px',
              borderRadius: '6px',
              color: 'white',
              backgroundColor:
                t.type === 'success' ? '#4caf50' :
                t.type === 'error'   ? '#f44336' :
                t.type === 'warning' ? '#ff9800' :
                '#2196f3', // info
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              wordBreak: 'break-word',
              fontSize: '0.95rem',
            }}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}