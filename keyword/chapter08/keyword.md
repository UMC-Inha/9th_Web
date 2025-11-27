# Debounce는 무엇인가요?

- Debounce는 이벤트가 연달아 터질 때 실행을 잠깐 지연시키고 마지막 이벤트 뒤로 일정 시간 동안 더 이상 이벤트가 안 오면 그때 한 번만 실행됩니다. 즉, 사용자가 타자를 멈출 때까지 기다렸다가 마지막 입력 기준으로 딱 한 번만 실행되게 합니다.
  const debouncedSearch = debounce((query) => {
  fetch(`/api/search?q=${query}`);
  }, 300);

<input onChange={(e) => debouncedSearch(e.target.value)} />
이 코드에선 300ms의 간격을 두고 그 안에 재실행되지 않을 시 fetch를 실행합니다.

# Throttling은 무엇인가요?

- Throttling은 이벤트가 연달아 발생하더라도 일정 시간마다 한 번만 실행되도록 제한합니다. 즉, 짧은 간격으로 여러 번 호출되더라도 주기적으로 딱 한 번씩 실행됩니다.
  스크롤, 드래그, 창 리사이즈, 버튼 연타 같은 지속적이거나 빈번한 이벤트 처리에 자주 사용됩니다.
  const throttledScroll = throttle(() => {
  console.log("스크롤 중...");
  }, 300);

window.addEventListener("scroll", throttledScroll);
이 코드는 300ms의 간격을 두고 실행되게 하고 그 안에는 다시 실행을 막는 코드입니다.

# Debounce vs Throttling 요약

구분: Debounce (디바운스) Throttling (스로틀링)
실행 :시점 이벤트 종료 후, 일정 시간 뒤 (마지막 한 번) /일정 시간 간격(주기)마다 (지속적 실행)
목적 :과도한 API 요청, 불필요한 연산 방지/ 빈번한 이벤트로 인한 성능 저하 방지
주요 :사용처 검색창 입력, 창 크기 조절, 드래그 종료 시점/ 스크롤 이벤트, 버튼 연타 방지, 게임 조작!
