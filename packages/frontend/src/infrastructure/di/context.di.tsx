import { type ComponentChildren, createContext } from 'preact';
import { createContainer, type Container } from './container.di';
import { useContext } from 'preact/hooks';

const ContainerContext = createContext<Container | null>(null);

export const DiProvider = ({ children }: { children: ComponentChildren }) => {
  const container = createContainer();

  return (
    <ContainerContext.Provider value={container}>
      {children}
    </ContainerContext.Provider>
  );
};

export const useDiContainer = (): Container => {
  const context = useContext(ContainerContext);

  if (!context) {
    throw new Error("useDiContainer must be used within DiProvider");
  }

  return context;
};
