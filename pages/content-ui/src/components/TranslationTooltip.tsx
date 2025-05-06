/**
 * TranslationTooltip 컴포넌트
 * 번역 결과를 표시하는 툴팁 UI 컴포넌트
 */
import type React from 'react';
import { useState } from 'react';

// 스타일 정의
const styles = {
  container: {
    width: '300px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    fontSize: '14px',
    overflow: 'hidden',
    border: '1px solid #e0e0e0',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 12px',
    backgroundColor: '#f8f9fa',
    borderBottom: '1px solid #e0e0e0',
  },
  title: {
    fontWeight: 'bold',
    fontSize: '14px',
    color: '#333',
    margin: 0,
  },
  closeButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#666',
    fontSize: '16px',
    padding: '2px 6px',
  },
  content: {
    padding: '12px',
  },
  originalText: {
    color: '#333',
    marginBottom: '8px',
    fontWeight: 'bold',
  },
  translatedText: {
    color: '#3740ff',
    marginBottom: '12px',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 12px',
    borderTop: '1px solid #e0e0e0',
    backgroundColor: '#f8f9fa',
  },
  button: {
    padding: '6px 12px',
    backgroundColor: '#3740ff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '13px',
    cursor: 'pointer',
    outline: 'none',
  },
  saveButton: {
    backgroundColor: '#28a745',
  },
  message: {
    fontSize: '12px',
    color: '#28a745',
    marginRight: '10px',
  },
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
  // 저장 성공 메시지 표시 상태
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

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

    // 성공 메시지 표시
    setSavedMessage('저장되었습니다!');

    // 3초 후 메시지 삭제
    setTimeout(() => {
      setSavedMessage(null);
    }, 3000);
  };

  return (
    <section role="dialog" aria-labelledby="translation-title" style={styles.container}>
      <div style={styles.header}>
        <h4 id="translation-title" style={styles.title}>
          번역 결과
        </h4>
        <button style={styles.closeButton} onClick={onClose}>
          ×
        </button>
      </div>

      <div style={styles.content}>
        <div style={styles.originalText}>{originalText}</div>
        <div style={styles.translatedText}>{translatedText}</div>
      </div>

      <div style={styles.footer}>
        {savedMessage && <span style={styles.message}>{savedMessage}</span>}
        <div style={{ flex: 1 }}></div>
        <button style={{ ...styles.button, ...styles.saveButton }} onClick={handleSave}>
          저장
        </button>
      </div>
    </section>
  );
};
