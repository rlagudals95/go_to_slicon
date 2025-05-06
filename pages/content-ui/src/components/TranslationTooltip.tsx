/**
 * TranslationTooltip 컴포넌트
 * 번역 결과를 표시하는 툴팁 UI 컴포넌트
 */
import type React from 'react';
import { useEffect, useRef } from 'react';

// 스타일 정의
const styles = {
  container: {
    width: '320px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    fontSize: '14px',
    overflow: 'hidden',
    border: '1px solid rgba(0, 0, 0, 0.08)',
    transition: 'all 0.2s ease',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    backgroundColor: '#f8fafc',
    borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
  },
  title: {
    fontWeight: '600',
    fontSize: '15px',
    color: '#1e293b',
    margin: 0,
  },
  closeButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#64748b',
    fontSize: '20px',
    padding: '4px 8px',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s ease',
    ':hover': {
      backgroundColor: '#f1f5f9',
    },
  },
  content: {
    padding: '16px',
  },
  originalText: {
    color: '#334155',
    marginBottom: '12px',
    fontWeight: '500',
    lineHeight: '1.5',
    padding: '8px 12px',
    backgroundColor: '#f8fafc',
    borderRadius: '6px',
    border: '1px solid #e2e8f0',
  },
  translatedText: {
    color: '#1e40af',
    marginBottom: '12px',
    lineHeight: '1.5',
    padding: '8px 12px',
    backgroundColor: '#eff6ff',
    borderRadius: '6px',
    border: '1px solid #bfdbfe',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    borderTop: '1px solid rgba(0, 0, 0, 0.06)',
    backgroundColor: '#f8fafc',
  },
  button: {
    padding: '8px 16px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    outline: 'none',
    transition: 'background-color 0.2s ease',
    ':hover': {
      backgroundColor: '#2563eb',
    },
    ':active': {
      backgroundColor: '#1d4ed8',
    },
  },
  saveButton: {
    backgroundColor: '#10b981',
    ':hover': {
      backgroundColor: '#059669',
    },
    ':active': {
      backgroundColor: '#047857',
    },
  },
  message: {
    fontSize: '13px',
    color: '#10b981',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  checkIcon: {
    fontSize: '16px',
  },
};

// 인라인 스타일에 가상 선택자를 적용하기 위한 CSS 스타일 추가
const addGlobalStyles = () => {
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    .translation-tooltip-close:hover {
      background-color: #f1f5f9;
    }
    .translation-tooltip-save {
      background-color: #10b981;
    }
    .translation-tooltip-save:hover {
      background-color: #059669;
    }
    .translation-tooltip-save:active {
      background-color: #047857;
    }
  `;
  document.head.appendChild(styleElement);
  return () => {
    document.head.removeChild(styleElement);
  };
};

// 컴포넌트 Props 타입
interface TranslationTooltipProps {
  originalText: string;
  translatedText: string;
  position: {
    x: number;
    y: number;
  };
  timestamp: string;
  url: string;
  onSave: (translationResult: { originalText: string; translatedText: string; timestamp: string; url: string }) => void;
  onClose: () => void;
}

/**
 * 번역 결과 툴팁 컴포넌트
 */
export const TranslationTooltip: React.FC<TranslationTooltipProps> = ({
  originalText,
  translatedText,
  timestamp,
  url,
  onSave,
  onClose,
}) => {
  const tooltipRef = useRef<HTMLElement>(null);

  // 전역 스타일 추가
  useEffect(() => {
    const cleanupStyles = addGlobalStyles();
    return cleanupStyles;
  }, []);

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    // 이벤트 리스너 등록
    document.addEventListener('mousedown', handleClickOutside);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  /**
   * 번역 결과 저장 핸들러
   */
  const handleSave = () => {
    // 콜백 호출
    onSave({
      originalText,
      translatedText,
      timestamp,
      url,
    });

    // 즉시 툴팁 닫기
    onClose();
  };

  return (
    <section ref={tooltipRef} role="dialog" aria-labelledby="translation-title" style={styles.container}>
      <div style={styles.header}>
        <h4 id="translation-title" style={styles.title}>
          번역 결과
        </h4>
        <button className="translation-tooltip-close" style={styles.closeButton} onClick={onClose} aria-label="닫기">
          ×
        </button>
      </div>

      <div style={styles.content}>
        <div style={styles.originalText}>{originalText}</div>
        <div style={styles.translatedText}>{translatedText}</div>
      </div>

      <div style={styles.footer}>
        <div></div>
        <button
          className="translation-tooltip-save"
          style={{ ...styles.button, ...styles.saveButton }}
          onClick={handleSave}>
          저장
        </button>
      </div>
    </section>
  );
};
