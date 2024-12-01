import { createContext, ReactNode } from "react";
import { Howl } from "howler";

const initialAudioContextData: any = {};

export const AudioContext = createContext(initialAudioContextData);

type AudioContextProviderProps = {
  children: ReactNode;
};

export const AudioContextProvider = ({
  children,
}: AudioContextProviderProps) => {
  const playAudio = (soundUrl: string) => {
    const sound = new Howl({
      src: [soundUrl],
    });

    sound.play();
  };

  const contextValue = { playAudio };

  return (
    <AudioContext.Provider value={contextValue}>
      {children}
    </AudioContext.Provider>
  );
};
