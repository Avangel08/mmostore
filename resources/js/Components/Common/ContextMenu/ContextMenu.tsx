import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ContextMenuProps, ContextMenuConfig } from './types';

export interface ContextMenuOption {
  id: string;
  label: string;
  icon?: string;
  className?: string;
  onClick: (data: any) => void;
  disabled?: boolean;
  divider?: boolean;
  children?: ContextMenuOption[];
}

const ContextMenu: React.FC<ContextMenuProps> = ({
  options,
  data,
  visible,
  position,
  onClose,
  config,
  className = ''
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [adjustedPosition, setAdjustedPosition] = useState(position);

  useEffect(() => {
    if (visible && menuRef.current) {
      const menu = menuRef.current;
      const rect = menu.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let newX = position.x;
      let newY = position.y;

      // Apply position strategy based on config
      if (config?.position === 'center') {
        newX = (viewportWidth - rect.width) / 2;
        newY = (viewportHeight - rect.height) / 2;
      } else if (config?.position === 'top-left') {
        newX = 10;
        newY = 10;
      } else if (config?.position === 'top-right') {
        newX = viewportWidth - rect.width - 10;
        newY = 10;
      } else if (config?.position === 'bottom-left') {
        newX = 10;
        newY = viewportHeight - rect.height - 10;
      } else if (config?.position === 'bottom-right') {
        newX = viewportWidth - rect.width - 10;
        newY = viewportHeight - rect.height - 10;
      } else {
        // Default mouse position with auto-adjustment
        if (position.x + rect.width > viewportWidth) {
          newX = viewportWidth - rect.width - 10;
        }
        if (position.y + rect.height > viewportHeight) {
          newY = viewportHeight - rect.height - 10;
        }
        newX = Math.max(10, newX);
        newY = Math.max(10, newY);
      }

      setAdjustedPosition({ x: newX, y: newY });
    }
  }, [visible, position, config]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (config?.closeOnClickOutside !== false && menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (config?.closeOnEscape !== false && event.key === 'Escape') {
        onClose();
      }
    };

    if (visible) {
      if (config?.closeOnClickOutside !== false) {
        document.addEventListener('mousedown', handleClickOutside);
      }
      if (config?.closeOnEscape !== false) {
        document.addEventListener('keydown', handleEscape);
      }
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [visible, onClose, config]);

  if (!visible) return null;

  // Get theme classes
  const getThemeClass = () => {
    if (config?.theme === 'dark') return 'context-menu-dark';
    if (config?.theme === 'light') return 'context-menu-light';
    return 'context-menu-auto';
  };

  // Get animation class
  const getAnimationClass = () => {
    if (config?.animation === 'slide') return 'context-menu-slide';
    if (config?.animation === 'scale') return 'context-menu-scale';
    if (config?.animation === 'fade') return 'context-menu-fade';
    return '';
  };

  return createPortal(
    <div
      ref={menuRef}
      className={`context-menu ${getThemeClass()} ${getAnimationClass()} ${className}`}
      style={{
        position: 'fixed',
        left: adjustedPosition.x,
        top: adjustedPosition.y,
        zIndex: config?.zIndex || 9999,
        minWidth: config?.minWidth || 180,
        maxWidth: config?.maxWidth || 250,
        maxHeight:
          Math.max(100, (window.innerHeight - adjustedPosition.y - 10)) ||
          config?.maxHeight ||
          300,
        backgroundColor: 'white',
        border: '1px solid #e0e0e0',
        borderRadius: '6px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        padding: '4px 0',
        fontFamily: 'inherit',
        fontSize: '14px',
        overflowY: 'auto',
      }}
    >
      {options.map((option, index) => {
        if (option.divider) {
          return (
            <div
              key={`divider-${index}`}
              style={{
                height: '1px',
                backgroundColor: '#e0e0e0',
                margin: '4px 0',
              }}
            />
          );
        }

        return (
          <div
            key={`${option.id}-${index}`}
            className={`context-menu-item ${option.className || ''} ${
              option.disabled ? 'disabled' : ''
            }`}
            onClick={() => {
              if (!option.disabled) {
                option.onClick(data);
                onClose();
              }
            }}
            style={{
              padding: '8px 16px',
              cursor: option.disabled ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: option.disabled ? '#999' : '#333',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => {
              if (!option.disabled) {
                e.currentTarget.style.backgroundColor = '#f5f5f5';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            {option.icon && (
              <i className={option.icon} style={{ fontSize: '16px' }} />
            )}
            <span>{option.label}</span>
          </div>
        );
      })}
    </div>,
    document.body
  );
};

export default ContextMenu;
