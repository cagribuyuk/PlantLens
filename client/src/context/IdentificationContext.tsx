import {
  createContext,
  ReactNode,
  useContext,
  useState,
} from 'react';

import {
  PlantImage,
  PlantOrgan,
} from '../types/plant';

interface IdentificationContextValue {
  image: PlantImage | null;
  organ: PlantOrgan;

  setImage: (
    image: PlantImage | null,
  ) => void;

  setOrgan: (
    organ: PlantOrgan,
  ) => void;

  clearIdentification: () => void;
}

const IdentificationContext =
  createContext<
    IdentificationContextValue | undefined
  >(undefined);

export function IdentificationProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [image, setImage] =
    useState<PlantImage | null>(null);

  const [organ, setOrgan] =
    useState<PlantOrgan>('auto');

  const clearIdentification =
    () => {
      setImage(null);
      setOrgan('auto');
    };

  return (
    <IdentificationContext.Provider
      value={{
        image,
        organ,
        setImage,
        setOrgan,
        clearIdentification,
      }}
    >
      {children}
    </IdentificationContext.Provider>
  );
}

export function useIdentification() {
  const context =
    useContext(
      IdentificationContext,
    );

  if (!context) {
    throw new Error(
      'useIdentification must be used inside IdentificationProvider',
    );
  }

  return context;
}