import { createContext, ReactNode, useState } from "react";
import { Howl } from "howler";

const initialAudioContextData: any = {};

export const AudioContext = createContext(initialAudioContextData);

type AudioContextProviderProps = {
  children: ReactNode;
};

export const AudioContextProvider = ({
  children,
}: AudioContextProviderProps) => {
  const [volumeOn, setVolumeOn] = useState(false);

  const playAudio = (soundUrl: string) => {
    if (!volumeOn) return;

    const sound = new Howl({
      src: [soundUrl],
    });

    sound.play();
  };

  const handleVolume = () => {
    if (volumeOn) {
      Howler.volume(0);
    } else {
      Howler.volume(1);
    }

    setVolumeOn((prev) => !prev);
  };

  const contextValue = { playAudio, handleVolume, volumeOn };

  return (
    <AudioContext.Provider value={contextValue}>
      {children}
    </AudioContext.Provider>
  );
};
