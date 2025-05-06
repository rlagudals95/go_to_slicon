/**
 * 토스트 컴포넌트
 * 사용자에게 알림을 표시하는 컴포넌트
 */
import type React from 'react';
import type { CSSProperties } from 'react';
import { useEffect, useState } from 'react';

// 토스트 타입 정의
export type ToastType = 'success' | 'error' | 'info';

// 토스트 스타일 정의
const styles: Record<string, CSSProperties> = {
  container: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    padding: '12px 16px',
    borderRadius: '8px',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    alignItems: 'center',
    maxWidth: '300px',
    zIndex: 10000,
    transition: 'all 0.3s ease',
  },
  successContainer: {
    backgroundColor: '#ecfdf5',
    border: '1px solid #d1fae5',
    color: '#065f46',
  },
  errorContainer: {
    backgroundColor: '#fee2e2',
    border: '1px solid #fecaca',
    color: '#b91c1c',
  },
  infoContainer: {
    backgroundColor: '#eff6ff',
    border: '1px solid #dbeafe',
    color: '#1e40af',
  },
  icon: {
    marginRight: '12px',
    fontSize: '18px',
    fontWeight: 'bold',
  },
  successIcon: {
    color: '#10b981',
  },
  errorIcon: {
    color: '#ef4444',
  },
  infoIcon: {
    color: '#3b82f6',
  },
  message: {
    fontSize: '14px',
    fontWeight: '500',
  },
};

// 토스트 아이콘 매핑
const icons: Record<ToastType, string> = {
  success: '✓',
  error: '✕',
  info: 'ℹ',
};

// 토스트 애니메이션 스타일 추가
const addToastStyles = () => {
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    @keyframes toastSlideIn {
      from {
        transform: translateY(20px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
    
    @keyframes toastSlideOut {
      from {
        transform: translateY(0);
        opacity: 1;
      }
      to {
        transform: translateY(20px);
        opacity: 0;
      }
    }
    
    .toast-enter {
      animation: toastSlideIn 0.3s ease forwards;
    }
    
    .toast-exit {
      animation: toastSlideOut 0.3s ease forwards;
    }
  `;
  document.head.appendChild(styleElement);
  return () => {
    document.head.removeChild(styleElement);
  };
};

// 컴포넌트 Props 타입
interface ToastProps {
  type: ToastType;
  message: string;
  duration?: number;
  onClose: () => void;
}

/**
 * 토스트 메시지 컴포넌트
 */
export const Toast: React.FC<ToastProps> = ({ type = 'info', message, duration = 3000, onClose }) => {
  const [visible, setVisible] = useState(true);
  const [animationClass, setAnimationClass] = useState('toast-enter');

  // 애니메이션 스타일 추가
  useEffect(() => {
    const cleanup = addToastStyles();
    return cleanup;
  }, []);

  // 토스트 타입에 따른 스타일 적용
  const getContainerStyle = (): CSSProperties => {
    switch (type) {
      case 'success':
        return { ...styles.container, ...styles.successContainer };
      case 'error':
        return { ...styles.container, ...styles.errorContainer };
      case 'info':
        return { ...styles.container, ...styles.infoContainer };
      default:
        return styles.container;
    }
  };

  // 아이콘 스타일 적용
  const getIconStyle = (): CSSProperties => {
    switch (type) {
      case 'success':
        return { ...styles.icon, ...styles.successIcon };
      case 'error':
        return { ...styles.icon, ...styles.errorIcon };
      case 'info':
        return { ...styles.icon, ...styles.infoIcon };
      default:
        return styles.icon;
    }
  };

  // 자동 닫기 타이머
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationClass('toast-exit');

      // 애니메이션 종료 후 컴포넌트 제거
      const animationTimer = setTimeout(() => {
        setVisible(false);
        onClose();
      }, 300);

      return () => clearTimeout(animationTimer);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  return (
    <div className={animationClass} style={getContainerStyle()}>
      <span style={getIconStyle()}>{icons[type]}</span>
      <span style={styles.message}>{message}</span>
    </div>
  );
};
