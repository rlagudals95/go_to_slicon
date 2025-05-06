# Go to Silicon Valley: 개발자를 위한 영어 번역 및 저장 크롬 확장 프로그램

## 1. 프로젝트 개요

### 목적
웹 브라우징 중 마주치는 영어 단어나 문장을 쉽게 번역하고 저장할 수 있는 크롬 확장 프로그램입니다. 개발자들이 기술 문서, 블로그, 포럼 등을 읽을 때 언어 장벽을 낮추고 영어 학습을 도와줍니다.

### 핵심 기능
- 웹페이지에서 영어 텍스트 드래그 시 번역 툴팁 표시
- 번역 결과 저장 및 관리
- 저장된 단어/문장 복습 기능

## 2. 타겟 사용자
- 영어로 된 기술 문서를 읽는 개발자
- 영어 학습 중인 개발자
- 영어가 모국어가 아닌 웹 사용자

## 3. 기능 명세

### 3.1 텍스트 선택 및 번역
- **텍스트 드래그 감지**: 사용자가 웹페이지에서 텍스트를 드래그하면 자동 감지
- **툴팁 표시**: 선택된 텍스트 근처에 번역 결과를 포함한 툴팁 표시
- **번역 API 연동**: - chrome background 또는 content script(CORS 우회가능): + google 번역 등을 이용한 번역방식
- **다국어 지원**: 한국어 번역을 기본으로 하되, 추후 다른 언어로 확장 가능

### 3.2 번역 결과 저장
- **저장 버튼**: 툴팁에 저장 버튼 포함
- **컨텍스트 저장**: 원문, 번역, 출처 URL, 선택된 시간 함께 저장
- **태그 지정**: 저장 시 선택적으로 태그 추가 가능 (예: #javascript, #react)

### 3.3 저장된 항목 관리
- **저장 목록 보기**: 확장 프로그램 팝업에서 저장된 모든 항목 조회
- **검색 및 필터링**: 저장된 항목 중 키워드, 태그, 날짜별 검색
- **CSV/JSON 내보내기**: 저장된 데이터 다른 형식으로 내보내기
- **클라우드 동기화**: 선택적으로 Google 계정과 연동하여 기기 간 동기화 (선택적 기능)

### 3.4 사용자 설정
- **단축키 설정**: 번역 활성화 단축키 사용자 지정
- **툴팁 스타일**: 위치, 크기, 색상 등 툴팁 UI 사용자화
- **자동 번역 설정**: 드래그 후 자동 번역 또는 추가 액션 필요 여부 설정
- **번역 언어 선택**: 목표 번역 언어 변경 가능

## 4. 기술 스택

### 프론트엔드
- **JavaScript/TypeScript**: 코어 확장 기능 개발
- **React**: 팝업 및 설정 페이지 UI 개발
- **TailwindCSS**: 스타일링
- **Chrome Extension API**: 브라우저 확장 기능 구현

### 백엔드 (선택적)
- **nestjs**: 클라우드 동기화용 (선택 기능)

### 번역
- **chrome background** 또는 **content script**(CORS 우회가능): + google 번역 등을 이용한 번역방식

### 데이터 저장(초기 mvp 추후 백엔드로 저장)
- **IndexedDB**: 대용량 로컬 데이터 저장

## 5. 현재 프로젝트 구조 및 구현 계획

### 현재 보일러플레이트 구조
```
/
├── chrome-extension/          # 크롬 확장 프로그램 코드
│   ├── public/                # 정적 파일
│   │   ├── icon-34.png        # 확장 프로그램 아이콘
│   │   ├── icon-128.png       # 확장 프로그램 아이콘
│   │   └── content.css        # 콘텐츠 스크립트 스타일
│   │
│   ├── src/                   # 소스 코드
│   │   └── background/        # 백그라운드 스크립트
│   │       └── index.ts       # 백그라운드 서비스 워커
│   │
│   ├── manifest.ts            # 확장 프로그램 매니페스트 설정
│   ├── package.json           # 의존성 및 스크립트
│   └── vite.config.mts        # 빌드 설정
│
├── docs/                      # 문서
├── packages/                  # 공유 패키지
└── ... (기타 설정 파일)
```

### 구현해야 할 구조
```
chrome-extension/
├── src/
│   ├── background/
│   │   └── index.ts           # 백그라운드 로직, 메시지 처리
│   │
│   ├── content/               # 콘텐츠 스크립트 (웹페이지에 주입)
│   │   ├── index.ts           # 텍스트 선택 감지 및 메시지 전달
│   │   └── selection.ts       # 텍스트 선택 유틸리티
│   │
│   ├── content-ui/            # 웹페이지에 표시될 UI
│   │   ├── index.tsx          # 진입점
│   │   ├── Tooltip.tsx        # 번역 결과 툴팁 컴포넌트
│   │   └── TranslationCard.tsx # 번역 카드 UI
│   │
│   ├── popup/                 # 확장 아이콘 클릭 시 팝업
│   │   ├── index.tsx          # 팝업 진입점
│   │   ├── Popup.tsx          # 메인 팝업 컴포넌트
│   │   └── SavedItems.tsx     # 저장된 항목 목록
│   │
│   ├── options/               # 설정 페이지
│   │   ├── index.tsx          # 설정 페이지 진입점
│   │   └── Options.tsx        # 설정 컴포넌트
│   │
│   ├── services/              # 공통 서비스
│   │   ├── translation.ts     # 번역 API 연동
│   │   └── storage.ts         # 스토리지 관리
│   │
│   └── utils/                 # 유틸리티
│       ├── dom.ts             # DOM 조작 유틸리티
│       └── messaging.ts       # 컴포넌트 간 메시지 통신
│
└── public/
    ├── _locales/              # 다국어 지원
    │   ├── en/
    │   │   └── messages.json  # 영어 메시지
    │   └── ko/
    │       └── messages.json  # 한국어 메시지
    │
    └── ... (아이콘 등)
```

### 주요 구현 파일

#### 1. 콘텐츠 스크립트 (`src/content/index.ts`)
```typescript
// 텍스트 선택 이벤트 리스너
document.addEventListener('mouseup', (event) => {
  const selection = window.getSelection();
  const selectedText = selection?.toString().trim();
  
  if (selectedText && selectedText.length > 0) {
    // 선택된 텍스트가 있으면 번역 요청
    chrome.runtime.sendMessage({
      type: 'TRANSLATE_TEXT',
      payload: {
        text: selectedText,
        position: {
          x: event.pageX,
          y: event.pageY
        },
        url: window.location.href
      }
    });
  }
});

// 백그라운드로부터 메시지 수신
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'TRANSLATION_RESULT') {
    // 번역 결과를 콘텐츠 UI 스크립트에 전달
    window.dispatchEvent(
      new CustomEvent('SHOW_TRANSLATION_TOOLTIP', {
        detail: message.payload
      })
    );
  }
});
```

#### 2. 백그라운드 스크립트 (`src/background/index.ts`)
```typescript
// 번역 API 호출 및 결과 전달
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'TRANSLATE_TEXT') {
    // 번역 API 호출
    translateText(message.payload.text)
      .then(result => {
        // 번역 결과를 콘텐츠 스크립트에 전달
        chrome.tabs.sendMessage(sender.tab.id, {
          type: 'TRANSLATION_RESULT',
          payload: {
            originalText: message.payload.text,
            translatedText: result,
            position: message.payload.position,
            url: message.payload.url,
            timestamp: new Date().toISOString()
          }
        });
      });
  }
  
  // 번역 결과 저장
  if (message.type === 'SAVE_TRANSLATION') {
    chrome.storage.local.get(['savedTranslations'], (result) => {
      const savedTranslations = result.savedTranslations || [];
      savedTranslations.push(message.payload);
      
      chrome.storage.local.set({ savedTranslations }, () => {
        // 저장 완료 알림
        chrome.notifications.create({
          type: 'basic',
          iconUrl: 'icon-128.png',
          title: '번역 저장 완료',
          message: '선택하신 텍스트가 저장되었습니다.'
        });
      });
    });
  }
});
```

#### 3. 콘텐츠 UI 스크립트 (`src/content-ui/Tooltip.tsx`)
```tsx
// 번역 결과 툴팁 컴포넌트
const TranslationTooltip = ({ originalText, translatedText, position, onSave, onClose }) => {
  return (
    <div 
      className="translation-tooltip"
      style={{ 
        position: 'absolute', 
        left: `${position.x}px`, 
        top: `${position.y + 20}px`,
        zIndex: 9999
      }}
    >
      <div className="original-text">{originalText}</div>
      <div className="translated-text">{translatedText}</div>
      <div className="tooltip-actions">
        <button onClick={onSave}>저장</button>
        <button onClick={onClose}>닫기</button>
      </div>
    </div>
  );
};

// 이벤트 리스너 및 툴팁 렌더링 로직
window.addEventListener('SHOW_TRANSLATION_TOOLTIP', (event) => {
  const data = event.detail;
  
  // 툴팁 표시 로직
  // React.createRoot를 사용하여 툴팁 렌더링
});
```

#### 4. 팝업 UI 컴포넌트 (`src/popup/SavedItems.tsx`)
```tsx
// 저장된 항목 표시 컴포넌트
const SavedItems = () => {
  const [savedItems, setSavedItems] = useState([]);
  
  useEffect(() => {
    // 저장된 항목 로드
    chrome.storage.local.get(['savedTranslations'], (result) => {
      setSavedItems(result.savedTranslations || []);
    });
  }, []);
  
  return (
    <div className="saved-items">
      <h2>저장된 항목</h2>
      {savedItems.length === 0 ? (
        <p>저장된 항목이 없습니다.</p>
      ) : (
        <ul>
          {savedItems.map((item, index) => (
            <li key={index}>
              <div className="original">{item.originalText}</div>
              <div className="translation">{item.translatedText}</div>
              <div className="source">{item.url}</div>
              <div className="timestamp">{new Date(item.timestamp).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
```

## 6. 구현 상세

### 6.1 텍스트 선택 및 번역 워크플로우
1. 사용자가 웹페이지에서 텍스트를 드래그하여 선택
2. 콘텐츠 스크립트가 `mouseup` 이벤트를 감지하고 선택된 텍스트 추출
3. 선택된 텍스트와 위치 정보를 백그라운드 스크립트로 전송
4. 백그라운드 스크립트에서 번역 API 호출
5. 번역 결과를 콘텐츠 스크립트로 전송
6. 콘텐츠 UI 스크립트가 번역 결과를 툴팁으로 표시

### 6.2 저장 워크플로우
1. 사용자가 툴팁에서 저장 버튼 클릭
2. 콘텐츠 UI 스크립트가 저장 요청을 백그라운드로 전송
3. 백그라운드 스크립트가 Chrome Storage API를 사용하여 번역 결과 저장
4. 저장 완료 알림 표시

### 6.3 팝업 UI 워크플로우
1. 사용자가 확장 프로그램 아이콘 클릭
2. 팝업 UI가 Chrome Storage에서 저장된 항목 로드
3. 저장된 항목을 목록으로 표시
4. 필터링, 검색, 삭제 등 관리 기능 제공

## 7. 개발 로드맵

### Phase 1 (2주)
- 기본 확장 프로그램 구조 설정
- 텍스트 선택 감지 및 기본 툴팁 UI 구현
- 번역 API 연동

### Phase 2 (2주)
- 번역 결과 저장 기능 구현
- 저장된 항목 목록 보기 구현
- 기본 설정 페이지 구현

### Phase 3 (2주)
- UI/UX 개선
- 태그 및 검색 기능 구현
- 내보내기 기능 구현
- 테스트 및 버그 수정

### Phase 4 (선택적, 2주)
- 클라우드 동기화 기능 구현
- 사용자 피드백 기반 개선
- 성능 최적화

## 8. 성공 지표

### 사용자 지표
- 확장 프로그램 설치 수
- 일일/주간 활성 사용자 수
- 번역 요청 횟수
- 저장된 항목 수

### 성능 지표
- 번역 응답 시간
- 메모리 사용량
- 안정성 (충돌/오류 비율)

## 9. 확장 가능성

### 추가 기능
- 웹페이지 전체 번역
- 발음 지원 (TTS)
- 단어장 퀴즈/복습 기능
- OCR을 통한 이미지 내 텍스트 번역
- 웹사이트별 설정 프로필

### 플랫폼 확장
- Firefox, Edge 등 다른 브라우저 지원
- 모바일 브라우저 지원
