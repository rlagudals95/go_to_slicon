// 콘텐츠 스크립트 로드 메시지
console.log('번역 확장 프로그램 콘텐츠 스크립트 로드됨');

// 사용자가 선택한 텍스트와 위치 정보
interface SelectionInfo {
  text: string;
  position: {
    x: number;
    y: number;
  };
  url: string;
}

// 메시지 타입 정의
interface TranslationMessage {
  type: string;
  payload: Record<string, unknown>;
}

// 번역 결과 메시지 타입
interface TranslationResultMessage extends TranslationMessage {
  type: 'TRANSLATION_RESULT';
  payload: {
    originalText: string;
    translatedText: string;
    position: {
      x: number;
      y: number;
    };
    url: string;
    timestamp: string;
  };
}

// 선택 이벤트가 무시되어야 하는 요소들 (예: 입력 필드)
const IGNORED_ELEMENTS = ['INPUT', 'TEXTAREA', 'SELECT', 'OPTION'];

// 이벤트가 무시되어야 하는지 확인
function shouldIgnoreSelection(target: EventTarget | null): boolean {
  if (!target || !(target instanceof Element)) {
    return false;
  }

  // 무시할 요소인지 확인
  if (IGNORED_ELEMENTS.includes(target.tagName)) {
    return true;
  }

  // 편집 가능한 요소인지 확인
  if (target.getAttribute('contenteditable') === 'true') {
    return true;
  }

  return false;
}

// 선택한 텍스트 정보 가져오기
function getSelectionInfo(event: MouseEvent): SelectionInfo | null {
  const selection = window.getSelection();
  const selectedText = selection?.toString().trim();

  // 선택된 텍스트가 없으면 null 반환
  if (!selectedText || selectedText.length === 0) {
    return null;
  }

  // 선택 위치 조정 (마우스 위치 또는 선택 범위 끝 위치)
  const position = {
    x: event.pageX,
    y: event.pageY,
  };

  return {
    text: selectedText,
    position,
    url: window.location.href,
  };
}

// 텍스트 선택 이벤트 핸들러
function handleTextSelection(event: MouseEvent): void {
  // 이벤트 발생 요소가 무시해야 할 요소인지 확인
  if (shouldIgnoreSelection(event.target)) {
    return;
  }

  // 선택된 텍스트 정보 가져오기
  const selectionInfo = getSelectionInfo(event);

  // 선택된 텍스트가 없으면 무시
  if (!selectionInfo) {
    return;
  }

  // 백그라운드 스크립트로 메시지 전송
  chrome.runtime.sendMessage({
    type: 'TRANSLATE_TEXT',
    payload: selectionInfo,
  });
}

// 백그라운드 스크립트에서 메시지 수신 핸들러
function handleBackgroundMessage(message: TranslationMessage): void {
  if (message.type === 'TRANSLATION_RESULT') {
    // 메시지를 TranslationResultMessage로 취급
    const translationResult = message as TranslationResultMessage;

    // 번역 결과를 content-ui로 전달하기 위해 커스텀 이벤트 생성
    const event = new CustomEvent('SHOW_TRANSLATION_TOOLTIP', {
      detail: translationResult.payload,
    });

    // 이벤트 디스패치
    window.dispatchEvent(event);
  }
}

// 이벤트 리스너 등록
function registerEventListeners(): void {
  // 마우스 업 이벤트로 텍스트 선택 감지
  document.addEventListener('mouseup', handleTextSelection);

  // 백그라운드 메시지 수신
  chrome.runtime.onMessage.addListener(handleBackgroundMessage);
}

// 초기화 함수
function init(): void {
  registerEventListeners();
}

// 콘텐츠 스크립트 초기화
init();
