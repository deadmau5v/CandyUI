import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";
import { candySound, CandySoundType } from "../sound/audio";
import "./CandyProvider.css";

export interface CandyContextValue {
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  soundVolume: number;
  setSoundVolume: (volume: number) => void;
  playSound: (type?: CandySoundType) => void;
}

const CandyContext = createContext<CandyContextValue>({
  soundEnabled: true,
  setSoundEnabled: () => {},
  soundVolume: 0.5,
  setSoundVolume: () => {},
  playSound: () => {},
});

export interface CandyProviderProps {
  children: React.ReactNode;
  defaultSoundEnabled?: boolean;
  defaultVolume?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const CandyProvider: React.FC<CandyProviderProps> = ({
  children,
  defaultSoundEnabled = true,
  defaultVolume = 0.5,
  className = "",
  style,
}) => {
  const [soundEnabled, setSoundEnabledState] = useState(defaultSoundEnabled);
  const [soundVolume, setSoundVolumeState] = useState(defaultVolume);

  useEffect(() => {
    candySound.setEnabled(soundEnabled);
  }, [soundEnabled]);

  useEffect(() => {
    candySound.setVolume(soundVolume);
  }, [soundVolume]);

  const setSoundEnabled = (enabled: boolean) => {
    setSoundEnabledState(enabled);
    candySound.setEnabled(enabled);
  };

  const setSoundVolume = (vol: number) => {
    setSoundVolumeState(vol);
    candySound.setVolume(vol);
  };

  const playSound = useCallback(
    (type: CandySoundType = "click") => {
      if (soundEnabled) {
        candySound.play(type);
      }
    },
    [soundEnabled],
  );

  const value = useMemo(
    () => ({
      soundEnabled,
      setSoundEnabled,
      soundVolume,
      setSoundVolume,
      playSound,
    }),
    [soundEnabled, soundVolume, playSound],
  );

  return (
    <CandyContext.Provider value={value}>
      <div
        className={`candy-ui-root ${className}`}
        style={{ fontFamily: "var(--candy-font-family)", ...style }}
      >
        {children}
      </div>
    </CandyContext.Provider>
  );
};

export const useCandy = (): CandyContextValue => {
  return useContext(CandyContext);
};
