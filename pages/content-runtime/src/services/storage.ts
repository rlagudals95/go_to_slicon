/**
 * 스토리지 서비스
 * 번역 결과 및 설정을 Chrome Storage에 저장
 */
import type { TranslationResult } from './translation';

// 스토리지 키 상수
const STORAGE_KEYS = {
  TRANSLATIONS: 'savedTranslations',
  SETTINGS: 'translationSettings',
};

// 앱 설정 인터페이스
export interface TranslationSettings {
  targetLanguage: string;
  autoTranslate: boolean;
}

// 기본 설정
const DEFAULT_SETTINGS: TranslationSettings = {
  targetLanguage: 'ko',
  autoTranslate: true,
};

/**
 * 번역 결과를 저장합니다.
 * @param translation 저장할 번역 결과
 */
export async function saveTranslation(translation: TranslationResult): Promise<void> {
  try {
    const { TRANSLATIONS } = STORAGE_KEYS;
    const items = await chrome.storage.local.get(TRANSLATIONS);
    const savedTranslations: TranslationResult[] = items[TRANSLATIONS] || [];

    // 새 번역 결과를 배열 앞에 추가
    savedTranslations.unshift(translation);

    // 저장할 항목 수 제한 (최대 100개)
    const limitedTranslations = savedTranslations.slice(0, 100);

    // 스토리지에 저장
    await chrome.storage.local.set({ [TRANSLATIONS]: limitedTranslations });
    console.log('번역 결과 저장 완료');
  } catch (error: unknown) {
    console.error('번역 결과 저장 오류:', error);
  }
}

/**
 * 저장된 모든 번역 결과를 가져옵니다.
 */
export async function getAllTranslations(): Promise<TranslationResult[]> {
  try {
    const { TRANSLATIONS } = STORAGE_KEYS;
    const items = await chrome.storage.local.get(TRANSLATIONS);
    return items[TRANSLATIONS] || [];
  } catch (error: unknown) {
    console.error('번역 결과 조회 오류:', error);
    return [];
  }
}

/**
 * 특정 번역 결과를 삭제합니다.
 * @param timestamp 삭제할 번역 결과의 타임스탬프
 */
export async function deleteTranslation(timestamp: string): Promise<void> {
  try {
    const { TRANSLATIONS } = STORAGE_KEYS;
    const items = await chrome.storage.local.get(TRANSLATIONS);
    const savedTranslations: TranslationResult[] = items[TRANSLATIONS] || [];

    // 해당 타임스탬프를 가진 항목 제외
    const filteredTranslations = savedTranslations.filter(item => item.timestamp !== timestamp);

    // 변경된 배열 저장
    await chrome.storage.local.set({ [TRANSLATIONS]: filteredTranslations });
    console.log('번역 결과 삭제 완료');
  } catch (error: unknown) {
    console.error('번역 결과 삭제 오류:', error);
  }
}

/**
 * 설정을 가져옵니다.
 */
export async function getSettings(): Promise<TranslationSettings> {
  try {
    const { SETTINGS } = STORAGE_KEYS;
    const items = await chrome.storage.local.get(SETTINGS);
    return items[SETTINGS] || DEFAULT_SETTINGS;
  } catch (error: unknown) {
    console.error('설정 조회 오류:', error);
    return DEFAULT_SETTINGS;
  }
}

/**
 * 설정을 저장합니다.
 * @param settings 저장할 설정
 */
export async function saveSettings(settings: Partial<TranslationSettings>): Promise<void> {
  try {
    const { SETTINGS } = STORAGE_KEYS;
    const currentSettings = await getSettings();

    // 기존 설정과 병합
    const newSettings = { ...currentSettings, ...settings };

    // 설정 저장
    await chrome.storage.local.set({ [SETTINGS]: newSettings });
    console.log('설정 저장 완료');
  } catch (error: unknown) {
    console.error('설정 저장 오류:', error);
  }
}
