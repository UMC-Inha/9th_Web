# Debounce 정리

## 1. 정의

Debounce(디바운스)는 연속적으로 발생하는 이벤트를 그룹화하여, 특정 함수가 마지막 이벤트가 발생한 후 일정 시간(N)이 지났을 때 단 한 번만 실행되도록 보장하는 기법입니다.

- 핵심: 이벤트가 발생하는 동안에는 함수가 실행되지 않고, 이벤트 발생이 **'완전히 멈춘' 시점**을 기준으로 작동합니다.
- 지연: 이벤트 발생과 실제 함수 실행 사이에는 필연적으로 지연(delay)이 발생합니다.

## 2. 언제 사용하나요?

Debounce는 이벤트가 발생하는 중간 상태는 무시하고, 오직 최종 상태에만 반응해야 할 때 유용합니다.

- 비동기 검색 제안: 사용자가 타이핑할 때마다 API를 호출하는 대신, 타이핑을 멈췄을 때 한 번만 API 호출.
- 폼 유효성 검사: 키 입력마다 검사하는 대신, 입력이 잠시 멈췄을 때 검사.
- 서버 업데이트 일괄 처리: 사용자가 계속 수정하는 동안에는 저장하지 않고, 수정이 멈췄을 때 한 번만 저장.

## 3. 핵심 주의사항

### 함수 재선언 문제

Debounce가 올바르게 작동하려면 타이머 상태를 기억하기 위해 항상 동일한 함수 참조가 사용되어야 합니다. 렌더링될 때마다 Debounce 함수를 새로 만들면 내부 타이머가 초기화되어 디바운스가 제대로 동작하지 않습니다.

잘못된 예시:

```tsx
// 매번 렌더링될 때마다 새로운 debounce 함수가 생성됨
class MyComponent extends React.Component {
  handleButtonClick = () => {
    console.log("The button was clicked");
  };

  render() {
    return (
      <button onClick={debounce(this.handleButtonClick, 500)}>
        Click the button
      </button>
    );
  }
}
```

올바른 예시:

```tsx
// 컴포넌트가 생성될 때 한 번만 debounce 함수가 생성됨
class MyComponent extends React.Component {
  handleButtonClick = debounce(() => {
    console.log("The button was clicked");
  }, 500);

  render() {
    return <button onClick={this.handleButtonClick}>Click the button</button>;
  }
}
```

### 최적의 시간(Duration) 설정

- 너무 짧은 시간: 이벤트를 제대로 그룹화하지 못해 성능 개선 효과가 낮음.
- 너무 긴 시간: 사용자 반응이 늦게 처리되어 UI가 답답하게 느껴질 수 있음.
- 결론: 정해진 정답은 없고, 사용 사례 + UX 기준으로 직접 테스트하며 적절한 시간을 찾아야 함.

## 4. Debounce 기본 구현 코드

```tsx
function debounce(func, duration) {
  // 타이머 ID를 저장할 변수 (클로저를 통해 상태 유지)
  let timeout;

  // 디바운스가 적용된 새로운 함수를 반환
  return function (...args) {
    // duration 시간이 지난 후 실행될 실제 로직
    const effect = () => {
      timeout = null; // 타이머 ID 초기화
      // 원본 함수(func)를 실행. this와 인자(args)를 그대로 전달
      return func.apply(this, args);
    };

    // 이전 타이머가 존재하면 취소 (이전 호출 무시)
    clearTimeout(timeout);

    // duration 시간이 지난 후 effect 실행
    timeout = setTimeout(effect, duration);
  };
}
```

## 5. Debounce 적용 예시 (이벤트 리스너)

```tsx
// 'click' 이벤트에 500ms의 디바운스를 적용
button.addEventListener(
  "click",
  debounce(function () {
    // 마지막 클릭 후 500ms가 지나야 실행됨
    throwBall();
  }, 500)
);
```

---

# Throttling 정리

## 1. 정의

- Throttle(쓰로틀)은 특정 함수가 정해진 시간 간격(N) 내에서 최대 한 번만 호출되도록 제어하는 기법입니다.
- 예시: 함수를 500ms로 쓰로틀링하면 해당 함수는 매 500ms마다 최대 한 번만 실행됩니다.
- 지정된 시간 간격 동안 추가로 발생하는 함수 호출은 무시됩니다.

## 2. 언제 사용하나요?

Throttle은 빈번하게 발생하는 이벤트에 일관되게 반응해야 할 때 사용됩니다.

- 정해진 시간마다 함수가 규칙적으로 실행되도록 보장합니다.
- 이벤트의 최종 상태가 아니라 중간 상태를 주기적으로 처리해야 할 때 유용합니다.

- 윈도우 resize 이벤트: 창 크기가 변할 때 UI를 지속적으로 업데이트 (예: 100ms마다 한 번)
- 스크롤 관련 고비용 계산 작업: 특정 위치 계산 또는 애니메이션 처리 등

## 3. 주의사항

- 함수 재선언 문제: Debounce와 동일하게, Throttle도 내부 상태를 유지해야 하므로 항상 동일한 함수 참조가 유지되어야 합니다. 렌더링 시마다 새로 throttle 함수를 선언하면 동작이 깨질 수 있습니다.
- 최적의 duration 설정:

  - 너무 짧으면 성능 향상이 미미함
  - 너무 길면 UI 반응이 끊겨 보일 수 있음
  - 최적 값은 사용 사례와 UX에 따라 테스트를 통해 결정해야 함

## 4. Throttling 기본 구현 코드

```tsx
function throttle(func, duration) {
  // 현재 대기 중인지 확인하는 플래그
  let shouldWait = false;

  // 쓰로틀링된 함수 반환
  return function (...args) {
    // 이미 대기 상태면 실행하지 않음
    if (shouldWait) {
      return;
    }

    // 대기 상태가 아니라면 즉시 함수 실행
    func.apply(this, args);

    // 대기 상태로 전환
    shouldWait = true;

    // duration 후 대기 상태 해제
    setTimeout(function () {
      shouldWait = false;
    }, duration);
  };
}
```

---

## 5. Throttling 적용 예시 (이벤트 리스너)

```tsx
// click 이벤트에 500ms 쓰로틀 적용
button.addEventListener(
  "click",
  throttle(function () {
    throwBall();
  }, 500)
);
```

---
