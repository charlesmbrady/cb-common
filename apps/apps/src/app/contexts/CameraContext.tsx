import React, { createContext, useState, useContext } from 'react';

interface CameraContextValue {
  followCam: boolean;
  toggleFollowCam: () => void;
}

const CameraContext = createContext<CameraContextValue | undefined>(undefined);

export const CameraProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [followCam, setFollowCam] = useState(false);
  return (
    <CameraContext.Provider
      value={{ followCam, toggleFollowCam: () => setFollowCam((v) => !v) }}
    >
      {children}
    </CameraContext.Provider>
  );
};

export const useCamera = () => {
  const ctx = useContext(CameraContext);
  if (!ctx) throw new Error('useCamera must be within CameraProvider');
  return ctx;
};
