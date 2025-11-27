# 🎯 핵심 키워드

---

<aside>
💡 주요 내용들에 대해 조사해보고, 자신만의 생각을 통해 정리해보세요!
레퍼런스를 참고하여 정의, 속성, 장단점 등을 적어주셔도 됩니다.
조사는 공식 홈페이지 **Best**, 블로그(최신 날짜) **Not Bad**

🍠 이모지가 달린 부분은, 여러분들이 직접 조사하여, 추가 작성하거나, 실습해보실 부분이니, 꼭 진행해주셔야 합니다!

</aside>

- **`Debounce`**는 무엇인가요?
  ### **`Debounce`**는 무엇인가요?
  ***
  **`Debounce`**는 **이벤트가 연달아 터질 때 실행을 잠깐 지연시켜요.**
  그리고 **마지막 이벤트 뒤로 일정 시간 동안 더 이상 이벤트가 안 오면 그때 한 번만 실행돼요.**
  검색어 자동완성, 입력 폼 검사, 창 리사이즈 처리 같은 데서 자주 써요.
  ***
  ### 왜 쓰나요?
  - 짧은 시간에 함수가 수십 번 불리면 비용이 커요. → **불필요한 호출을 미뤄줘요.**
  - 사용자가 타자를 멈출 때까지 기다렸다가 **마지막 입력 기준으로 딱 한 번 실행돼요.**
  - 결과적으로 **네트워크/연산 낭비를 줄이고**, 깔끔한 UX를 만들어요.
  ***
  ### 시각적 흐름
  아래는 300ms 디바운스를 예로 든 타임라인이에요.
  키 입력이 계속 이어지면 실행이 계속 **미뤄져요**. 멈추고 300ms 지나면 **그때 실행돼요**.
  ```mermaid
  gantt
  dateFormat  X
  axisFormat  %Lms
  title Debounce 타임라인 (300ms)

  section 키 입력
  A 입력 :milestone, a, 0, 0
  B 입력 :milestone, b, 100, 0
  C 입력 :milestone, c, 200, 0

  section 대기 (300ms)
  A 이후 대기 :active, 0, 300
  B 이후 대기 :active, 100, 300
  C 이후 대기 :active, 200, 300

  section 실행
  실행 (C 기준) :milestone, exec, 500, 0
  ```
  - A(0ms), B(100ms), C(200ms) 모두 300ms 안에 잇달아 들어와서 실행이 **미뤄져요**.
  - C 이후 300ms 동안 추가 입력이 없어서 **500ms에 한 번 실행돼요**.
  ***
  ### 예시: 검색 자동완성
  사용자가 검색창에 글자를 입력할 때마다 API를 호출하면 어떻게 될까요?
  예를 들어 `"apple"`을 치는 동안 5글자를 빠르게 입력하면
  `a → ap → app → appl → apple`
  이렇게 **5번이나 API 요청이 발생할 수 있어요.**
  이건 서버 입장에서도 부담이고, 사용자 입장에서도 느려 보이죠.
  그래서 **“잠깐 기다렸다가, 입력이 끝났을 때 한 번만 호출”** 하도록 만드는 게 **`Debounce`**의 역할이에요.
  **🔍 `Debounce`를 적용하지 않은 코드**
  ```tsx
  <input
    onChange={(e) => {
      fetch(`/api/search?q=${e.target.value}`);
    }}
  />
  ```
  - 사용자가 키보드를 칠 때마다 `onChange`가 즉시 실행돼요.
  - `"apple"`을 입력하면 **5번 fetch 요청**이 발생합니다.
  - 검색 API를 이렇게 자주 부르면 서버 부하도 크고, UX도 좋지 않아요.
  **✅ `Debounce`를 적용한 코드**
  ```tsx
  const debouncedSearch = debounce((query) => {
    fetch(`/api/search?q=${query}`);
  }, 300);

  <input onChange={(e) => debouncedSearch(e.target.value)} />;
  ```
  **🔍 동작 방식**
  1. 사용자가 키를 누를 때마다 `debouncedSearch`가 호출돼요.
  2. 하지만 바로 실행하지 않고 **300ms 기다립니다.**
  3. 300ms 안에 또 입력이 들어오면 **기존 타이머를 취소하고 새로 시작**해요.
  4. 사용자가 입력을 멈추고 300ms 동안 아무 키도 누르지 않으면

     그제서야 `fetch('/api/search?q=...')`가 실행돼요.
  👉 즉, “입력이 멈춘 뒤 0.3초 뒤에 딱 한 번 실행”되는 거예요.
- **`Throttling`**은 무엇인가요?
  ### **`Throttling`**은 무엇인가요?
  ***
  **`Throttling`**은 **이벤트가 연달아 발생하더라도 일정 시간마다 한 번만 실행되도록 제한해요.**
  즉, **짧은 간격으로 여러 번 호출되더라도 주기적으로 딱 한 번씩 실행돼요.**
  스크롤, 드래그, 창 리사이즈, 버튼 연타 같은 **지속적이거나 빈번한 이벤트 처리**에 자주 사용돼요.
  ***
  ### 왜 쓰나요?
  - 짧은 시간에 함수가 수십 번 불리면 비용이 커요. → **주기적으로 실행을 제한해줘요.**
  - 사용자가 계속 이벤트를 발생시켜도 **정해진 주기마다 한 번만 실행돼요.**
  - 결과적으로 **CPU 부하를 줄이고**, **자연스러운 실시간 반응**을 유지할 수 있어요.
  ***
  ### 시각적 흐름
  아래는 300ms 스로틀 예시 타임라인이에요.
  이벤트가 여러 번 발생해도 실행은 **300ms마다 딱 한 번만** 일어나요.
  ```mermaid
  gantt
  dateFormat  X
  axisFormat  %Lms
  title Throttle 타임라인 (300ms)

  section 이벤트 발생
  A 발생 :milestone, a, 0, 0
  B 발생 :milestone, b, 100, 0
  C 발생 :milestone, c, 200, 0
  D 발생 :milestone, d, 400, 0
  E 발생 :milestone, e, 700, 0

  section 실행
  실행 (A 기준) :milestone, exec1, 0, 0
  실행 (D 기준) :milestone, exec2, 400, 0
  실행 (E 기준) :milestone, exec3, 700, 0

  ```
  - A~C가 300ms 안에 몰려와도 **A 한 번만 실행돼요.**
  - D는 A 이후 300ms가 지났으므로 다시 실행돼요.
  - E도 D 이후 300ms가 지나 실행돼요.
  👉 즉, **“이벤트가 많아도 일정 간격마다 한 번씩 실행되는 구조”**예요.
  ***
  ### 예시: 스크롤 이벤트 처리
  사용자가 스크롤할 때마다 화면을 업데이트하는 상황을 생각해볼게요.
  이벤트가 너무 자주 발생하면 렉이 걸리거나 프레임이 떨어질 수 있어요.
  **🧱 `Throttling`을 적용하지 않은 코드**
  ```tsx
  window.addEventListener("scroll", () => {
    console.log("스크롤 중...");
  });
  ```
  - 스크롤 이벤트가 수백 번 발생하면 `console.log`도 그만큼 실행돼요.
  - CPU 점유율이 높아지고, 스크롤이 끊기거나 느려질 수 있어요.
  **✅ `Throttling`을 적용한 코드**
  ```tsx
  const throttledScroll = throttle(() => {
    console.log("스크롤 중...");
  }, 300);

  window.addEventListener("scroll", throttledScroll);
  ```
  🔍 동작 방식
  1. 사용자가 스크롤을 시작하면 `throttledScroll`이 즉시 실행돼요.
  2. 이후 **300ms 동안은 실행이 잠시 막혀요.**
  3. 300ms가 지나면 **다음 이벤트를 다시 허용해요.**
  4. 즉, 계속 스크롤 중이라도 **0.3초마다 한 번만 실행**돼요.
  👉 “**이벤트를 주기적으로 제한해서 부드럽게 처리**”하는 거예요.
- **`Debounce`** vs **`Throttling`** 요약
  ## **`Debounce`** vs **`Throttling`** 요약
  > **TIP**: **입력이 멈춘 뒤 한 번이면 `Debounce`**, **계속 반응해야 하면 `Throttling`**.
  | 항목        | **`Debounce`**                                 | **`Throttling`**                       |
  | ----------- | ---------------------------------------------- | -------------------------------------- |
  | 정의        | **마지막 이벤트 후** 지연 시간 지나면 1회 실행 | **지정 간격마다** 최대 1회 실행        |
  | 실행 시점   | 입력이 **멈춘 뒤** 실행                        | 이벤트가 계속 와도 **주기적으로** 실행 |
  | 적합한 사례 | 검색 자동완성, 입력 검증, 저장/검사 버튼       | 스크롤/리사이즈, 드래그, 마우스 이동   |
  | 사용자 경험 | 결과가 **확정된 뒤** 응답 → 안정적             | **지속적으로** 반응 → 실시간 느낌      |
  | 장점        | 불필요 호출 최소화, 네트워크 절약              | 프레임 드랍 완화, 부드러운 인터랙션    |
  | 주의점      | 지연이 길면 응답이 느리게 느껴질 수 있음       | 주기 사이 값이 **건너뛰어질 수 있음**  |
- **`Debounce`** 구글링 후 개념 정리 및 코드 작성해보기 🍠
  ### 📚 참고자료
  [Debounce vs Throttle: Definitive Visual Guide](https://kettanaito.com/blog/debounce-vs-throttle)
  ***
  - **`Debounce`** 개념 정리 🍠
    - 연속적으로 발생한 이벤트를 하나로 처리하는 방식
    - 주로 처음이나 마지막으로 실행된 함수만을 실행함
    - 성능상의 문제를 위해 사용함
      - 모든 함수를 실행하면 성능적으로 문제가 생길 수 있기 때문
  - **`Debounce`** 코드 작성 🍠
    - 타이핑할 때마다 console이 찍히는 것이 아니라 1초마다 타이핑이 찍히도록 디바운싱 적용
    - setTimeout으로 특정 시간동안 딱 한번만 함수가 실행되도록 코드를 작성한다
      - 마지막 함수 실행 후 1초 후 console이 찍힌다
    ```jsx
    let alertTimer;
    function alertWhenTypingStops() {
      if (alertTimer) {
        clearTimeout(alertTimer);
      }
      const name = nameElem.value;

      alertTimer = setTimeout(() => console.log(`입력된 이름:${name}`), 1000);
    }

    const nameElem = document.getElementById(`inputName`);

    nameElem.addEventListner("input", alertWhenTypingStops);
    ```
    **대표적 사용 예시**
    - 키워드 검색 혹은 자동완성 기능에서 api 함수 호출 횟수를 최대한 줄이고 싶을 때
    - 사용자가 창크기 조정을 멈출 때까지 기다렸다가 resizing Event를 반영하고 싶을 때
- **`Throttling`** 구글링 후 개념 정리 및 코드 작성해보기 🍠
  ### 📚 참고자료
  [Debounce vs Throttle: Definitive Visual Guide](https://kettanaito.com/blog/debounce-vs-throttle)
  ***
  - **`Throttling`** 개념 정리 🍠
    - 출력을 조절한다는 의미로, 이벤트를 일정주기마다 발생하도록 하는 기술
    - 100ms를 준다면 이벤트는 100ms 동안 최대 한번만 발생하게 됨
    - 마지막 함수가 호출된 후 일정 시간이 지나기 전에 다시 호출되지 않도록 함
      - 일정 시간동안 딱 한번만 이벤트를 발생시킴
    - 연이어 발생한 이벤트에 대해, 일정한 delay를 포함시켜 연속적으로 발생한 이벤트는 무시하는 방식.
    - 즉, delay 시간동안 호출된 함수는 무시한다
  - **`Throttling`** 코드 작성 🍠
    ```jsx
    let isInThrottle;
    function increaseScoreDuringTyping() {
      if (isInThrottle) {
        return;
      }

      isInThrottle = true;

      // 타이머 세팅
      setTimeout(() => {
        const score = document.querySelector("#score");
        const newScore = parseInt(score.innerText) + 1;
        score.innerText = newScore;

        isInThrottle = false;
      }, 500);
    }

    const nameElem = document.querySelector("#inputName");

    nameElem.addEventListener("input", increaseScoreDuringTyping);
    ```
    쓰로틀러를 500ms동안 작동시키고, 만약 쓰로틀러가 이벤트를 조이고 있는 경우, 해당 이벤트는 무시된다.
    결과적으로 500ms 동안 최대 1번의 이벤트만이 발생한다
    **대표적 사용 예시**
    - 스크롤에 많이 사용한다
      - 모든 스크롤을 기록하는 것.
      - 성능문제가 있음
      - ⇒ 특정 시간마다의 스크롤의 위치를 찍어주는 것이 좋다
