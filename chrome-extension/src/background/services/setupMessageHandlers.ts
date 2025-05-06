/**
 * 백그라운드 스크립트
 * 번역 API 요청을 처리하고 결과를 content 스크립트로 전달
 */
import { getSettings, saveTranslation } from './storage';
import { translateText } from './translation';

console.log('번역 확장 프로그램 백그라운드 스크립트 로드됨');

// 메시지 타입 정의
type MessageType = 'TRANSLATE_TEXT' | 'SAVE_TRANSLATION';

// 기본 메시지 인터페이스
interface Message {
  type: MessageType;
  payload: Record<string, unknown>;
}

// 번역 요청 메시지
interface TranslateTextMessage extends Message {
  type: 'TRANSLATE_TEXT';
  payload: {
    text: string;
    position: {
      x: number;
      y: number;
    };
    url: string;
  };
}

// 번역 저장 메시지
interface SaveTranslationMessage extends Message {
  type: 'SAVE_TRANSLATION';
  payload: {
    originalText: string;
    translatedText: string;
    timestamp: string;
    url: string;
  };
}

/**
 * 메시지 핸들러 등록
 */
export default function setupMessageHandlers() {
  chrome.runtime.onMessage.addListener((message: Message, sender) => {
    console.log('백그라운드: 메시지 수신:', message.type);

    switch (message.type) {
      case 'TRANSLATE_TEXT':
        handleTranslateText(message as TranslateTextMessage, sender);
        break;

      case 'SAVE_TRANSLATION':
        handleSaveTranslation(message as SaveTranslationMessage);
        break;

      default:
        console.log('알 수 없는 메시지 타입:', message.type);
    }

    // 비동기 응답을 위해 true 반환
    return true;
  });
}

/**
 * 번역 요청 처리
 */
async function handleTranslateText(message: TranslateTextMessage, sender: chrome.runtime.MessageSender) {
  try {
    const { text, position, url } = message.payload;
    console.log('번역 요청:', text);

    // 설정 불러오기
    const settings = await getSettings();

    // 텍스트 번역
    const translatedText = await translateText(text, settings.targetLanguage);

    // 번역 결과 전송
    if (sender.tab?.id) {
      chrome.tabs.sendMessage(sender.tab.id, {
        type: 'TRANSLATION_RESULT',
        payload: {
          originalText: text,
          translatedText,
          position,
          url,
          timestamp: new Date().toISOString(),
        },
      });
    }
  } catch (error) {
    console.error('번역 처리 오류:', error);
  }
}

/**
 * 번역 결과 저장 처리
 */
async function handleSaveTranslation(message: SaveTranslationMessage) {
  try {
    const { originalText, translatedText, timestamp, url } = message.payload;
    console.log('번역 저장 요청:', originalText);

    // 설정 가져오기
    const settings = await getSettings();

    // 저장할 데이터 준비
    const translationData = {
      originalText,
      translatedText,
      timestamp,
      url,
      targetLanguage: settings.targetLanguage,
    };

    // 번역 결과 저장
    await saveTranslation(translationData);

    // 저장 완료 알림
    chrome.notifications.create({
      type: 'basic',
      iconUrl: '/icon-128.png',
      title: '번역 저장 완료',
      message: `"${originalText.substring(0, 20)}${originalText.length > 20 ? '...' : ''}" 저장됨`,
    });
  } catch (error) {
    console.error('번역 저장 오류:', error);
  }
}
