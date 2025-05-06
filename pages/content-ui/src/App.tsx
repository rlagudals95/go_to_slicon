import { useEffect, useState } from 'react';
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

export default function App() {
  // 번역 결과 상태
  const [translationResult, setTranslationResult] = useState<TranslationResult | null>(null);

  // 번역 결과 이벤트 핸들러
  const handleTranslationEvent = (event: CustomEvent) => {
    const data = event.detail as TranslationResult;
    if (data && data.originalText && data.translatedText) {
      console.log('번역 결과 수신:', data);
      setTranslationResult(data);
    }
  };

  // 번역 결과 저장 핸들러
  const handleSaveTranslation = (data: SaveTranslationData) => {
    console.log('번역 저장:', data);
    chrome.runtime.sendMessage({
      type: 'SAVE_TRANSLATION',
      payload: data,
    });
  };

  // 번역 툴팁 닫기 핸들러
  const handleCloseTooltip = () => {
    setTranslationResult(null);
  };

  // 이벤트 리스너 등록
  useEffect(() => {
    console.log('번역 확장 프로그램 UI 로드됨');

    // 커스텀 이벤트로 번역 결과 수신
    const listener = (event: Event) => handleTranslationEvent(event as CustomEvent);
    window.addEventListener('SHOW_TRANSLATION_TOOLTIP', listener);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener('SHOW_TRANSLATION_TOOLTIP', listener);
    };
  }, []);

  // 번역 결과가 없으면 렌더링하지 않음
  if (!translationResult) {
    return null;
  }

  // 번역 툴팁 렌더링
  return (
    <div
      className="translation-tooltip-container"
      style={{
        position: 'absolute',
        left: `${translationResult.position.x}px`,
        top: `${translationResult.position.y + 20}px`,
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
  );
}
