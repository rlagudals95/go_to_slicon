/**
 * 번역 서비스
 * Google 번역을 이용한 텍스트 번역 기능 제공
 */

/**
 * 텍스트를 한국어로 번역합니다.
 * @param text 번역할 텍스트
 * @param targetLang 번역 대상 언어 코드 (기본값: 'ko')
 * @returns 번역된 텍스트
 */
export async function translateText(text: string, targetLang = 'ko'): Promise<string> {
  try {
    // Google Translate API를 사용한 번역 (클라이언트 측 구현)
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`번역 요청 실패: ${response.status}`);
    }

    const data = await response.json();

    // 번역 결과 추출
    let translatedText = '';
    if (data && data[0]) {
      translatedText = data[0]
        .map((item: Array<string>) => item[0])
        .filter(Boolean)
        .join(' ');
    }

    return translatedText || '번역 결과를 찾을 수 없습니다.';
  } catch (error: unknown) {
    console.error('번역 에러:', error);
    if (error instanceof Error) {
      return `번역 중 오류가 발생했습니다: ${error.message}`;
    }
    return '번역 중 알 수 없는 오류가 발생했습니다.';
  }
}

/**
 * 번역 결과 인터페이스
 */
export interface TranslationResult {
  originalText: string;
  translatedText: string;
  timestamp: string;
  url: string;
  targetLanguage: string;
}
