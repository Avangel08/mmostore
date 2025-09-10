import React, { createContext, useContext, useState, ReactNode } from 'react';
import ContextMenu, { ContextMenuOption } from './ContextMenu';
import { ContextMenuConfig, ContextMenuContextType, ContextMenuProviderProps } from './types';

const ContextMenuContext = createContext<ContextMenuContextType | undefined>(
  undefined
);

export const ContextMenuProvider: React.FC<ContextMenuProviderProps> = ({
  children,
  defaultConfig,
}) => {
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    options: ContextMenuOption[];
    data: any;
    position: { x: number; y: number };
    config?: ContextMenuConfig;
  }>({
    visible: false,
    options: [],
    data: null,
    position: { x: 0, y: 0 },
    config: defaultConfig,
  });

  const showContextMenu = (
    options: ContextMenuOption[],
    data: any,
    position: { x: number; y: number },
    config?: ContextMenuConfig
  ) => {
    setContextMenu({
      visible: true,
      options,
      data,
      position,
      config: config || defaultConfig,
    });
  };

  const hideContextMenu = () => {
    setContextMenu(prev => ({
      ...prev,
      visible: false,
    }));
  };

  return (
    <ContextMenuContext.Provider
      value={{
        showContextMenu,
        hideContextMenu,
      }}
    >
      {children}
      <ContextMenu
        options={contextMenu.options}
        data={contextMenu.data}
        visible={contextMenu.visible}
        position={contextMenu.position}
        onClose={hideContextMenu}
        config={contextMenu.config}
      />
    </ContextMenuContext.Provider>
  );
};

export const useContextMenu = (): ContextMenuContextType => {
  const context = useContext(ContextMenuContext);
  if (context === undefined) {
    throw new Error('useContextMenu must be used within a ContextMenuProvider');
  }
  return context;
};
