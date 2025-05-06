import { useCallback, useEffect, useState } from 'react';
import type { ToastType } from './components/Toast';
import { Toast } from './components/Toast';
import { TranslationTooltip } from './components/TranslationTooltip';

// 번역 결과 인터페이스
interface TranslationResult {
  originalText: string;
  translatedText: string;
  position: {
    x: number;
    y: number;
  };
  url: string;
  timestamp: string;
}

// 저장용 번역 결과 인터페이스
interface SaveTranslationData {
  originalText: string;
  translatedText: string;
  url: string;
  timestamp: string;
}

// 토스트 상태 인터페이스
interface ToastState {
  visible: boolean;
  message: string;
  type: ToastType;
}

// 전역 스타일 추가
const addGlobalStyles = () => {
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    @keyframes tooltipFadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .translation-tooltip-container {
      animation: tooltipFadeIn 0.2s ease-out forwards;
    }
  `;
  document.head.appendChild(styleElement);
  return () => {
    document.head.removeChild(styleElement);
  };
};

export default function App() {
  // 번역 결과 상태
  const [translationResult, setTranslationResult] = useState<TranslationResult | null>(null);

  // 툴팁 표시 여부 상태
  const [isVisible, setIsVisible] = useState(false);

  // 토스트 상태
  const [toast, setToast] = useState<ToastState>({
    visible: false,
    message: '',
    type: 'success',
  });

  // 전역 스타일 추가
  useEffect(() => {
    const cleanupStyles = addGlobalStyles();
    return cleanupStyles;
  }, []);

  // 번역 결과 이벤트 핸들러
  const handleTranslationEvent = useCallback(
    (event: CustomEvent) => {
      const data = event.detail as TranslationResult;
      if (data && data.originalText && data.translatedText) {
        console.log('번역 결과 수신:', data);

        // 동일한 텍스트가 이미 선택되어 있다면 툴팁 위치만 업데이트
        if (translationResult?.originalText === data.originalText) {
          setTranslationResult({
            ...translationResult,
            position: data.position,
          });
        } else {
          setTranslationResult(data);
        }

        setIsVisible(true);
      }
    },
    [translationResult],
  );

  // 토스트 표시 핸들러
  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    setToast({
      visible: true,
      message,
      type,
    });
  }, []);

  // 토스트 닫기 핸들러
  const handleCloseToast = useCallback(() => {
    setToast(prev => ({ ...prev, visible: false }));
  }, []);

  // 번역 결과 저장 핸들러
  const handleSaveTranslation = useCallback(
    (data: SaveTranslationData) => {
      console.log('번역 저장:', data);
      chrome.runtime.sendMessage({
        type: 'SAVE_TRANSLATION',
        payload: data,
      });

      // 토스트 메시지 표시
      showToast('번역 결과가 저장되었습니다!', 'success');
    },
    [showToast],
  );

  // 번역 툴팁 닫기 핸들러
  const handleCloseTooltip = useCallback(() => {
    setIsVisible(false);

    // 애니메이션을 위해 약간의 지연 후 데이터 제거
    setTimeout(() => {
      setTranslationResult(null);
    }, 200);
  }, []);

  // 이벤트 리스너 등록
  useEffect(() => {
    console.log('번역 확장 프로그램 UI 로드됨');

    // 커스텀 이벤트로 번역 결과 수신
    const listener = (event: Event) => handleTranslationEvent(event as CustomEvent);
    window.addEventListener('SHOW_TRANSLATION_TOOLTIP', listener);

    // ESC 키 이벤트 리스너 추가
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isVisible) {
        handleCloseTooltip();
      }
    };
    document.addEventListener('keydown', handleEscKey);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener('SHOW_TRANSLATION_TOOLTIP', listener);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [handleTranslationEvent, handleCloseTooltip, isVisible]);

  // 화면 경계를 벗어나지 않도록 위치 조정
  const calculatePosition = () => {
    if (!translationResult) return { x: 0, y: 0 };

    const position = { ...translationResult.position };

    // 오른쪽 경계 확인 (툴팁 너비 320px + 여유 20px 고려)
    const rightBoundary = window.innerWidth - 340;
    if (position.x > rightBoundary) {
      position.x = rightBoundary;
    }

    // 하단 경계 확인 (대략적인 툴팁 높이 + 여유 고려)
    const estimatedHeight = 250;
    const bottomBoundary = window.innerHeight - estimatedHeight;

    // 하단 경계를 넘어가면 상단에 표시 (20px 위치 조정)
    if (position.y > bottomBoundary) {
      position.y = position.y - estimatedHeight - 40; // 선택 영역 위에 표시
    } else {
      // 선택 영역 아래에 표시 (20px 여유)
      position.y = position.y + 20;
    }

    return position;
  };

  // 번역 툴팁이 없거나 visible 상태가 아니면 토스트만 표시
  if (!translationResult || !isVisible) {
    return toast.visible ? <Toast type={toast.type} message={toast.message} onClose={handleCloseToast} /> : null;
  }

  const adjustedPosition = calculatePosition();

  // 번역 툴팁 및 토스트 렌더링
  return (
    <>
      <div
        className="translation-tooltip-container"
        style={{
          position: 'absolute',
          left: `${adjustedPosition.x}px`,
          top: `${adjustedPosition.y}px`,
          zIndex: 9999,
        }}>
        <TranslationTooltip
          originalText={translationResult.originalText}
          translatedText={translationResult.translatedText}
          position={translationResult.position}
          timestamp={translationResult.timestamp}
          url={translationResult.url}
          onSave={handleSaveTranslation}
          onClose={handleCloseTooltip}
        />
      </div>

      {toast.visible && <Toast type={toast.type} message={toast.message} onClose={handleCloseToast} />}
    </>
  );
}
