<h1>8주차 키워드 정리</h1>

```Debounce란 무엇인가?```

- 이벤트가 연달아 터질 때 실행을 잠깐 지연시킨다. 그 후 마지막 이벤트 뒤로 일정시간동안 더 이상 이벤트가 오지않으면 그 때 한번만 실행이 된다.

- 왜 사용하는가?
    - 짧은 시간에 함수가 수십 번 불리면 비용이 크다. -> 불필요한 호출을 미뤄준다.
    - 사용자가 타자를 멈출 때까지 기다렸다가 마지막 입력 기준으로 딱 한번만 실행이 된다.
    - 네트워크 / 연산 낭비를 줄이고 깔끔한 UX를 만든다.

    - 적용하지 않은 코드 
    ```tsx
    <input onChange={(e) => {
    fetch(`/api/search?q=${e.target.value}`);
    }} />
    ```

    - 적용한 코드 
    ```tsx
    const debouncedSearch = debounce((query) => {
    fetch(`/api/search?q=${query}`);
    }, 300);

    <input onChange={(e) => debouncedSearch(e.target.value)} />
    ```

- 동작방식
    1. 사용자가 키를 누를때마다 debouncedSearch가 호출
    2. 하지만 바로 실행하지 않고 300ms를 기다린다.
    3. 300ms 안에 입력이 또 들어오면 기존 타이머를 취소하고 새로 시작한다.
    4. 사용자가 입력을 멈추고 300ms 동안 아무것도하지 않으면 fetch('/api/search?q=...')가 실행이 된다.

```Throttling은 무엇인가요?```
- 이벤트가 연달아 발생하더라도 일정시간마다 한번만 실행되도록 제한.
- 짧은 간격으로 여러번 호출하더라도 주기적으로 딱 한번만 실행된다.

- 왜 쓰는가?
    - 짧은 시간에 함수가 수십번 불리면 비용이 크다. -> 주기적으로 실행을 제한해 줘야한다.
    - 사용자가 계속 이벤트를 발생시켜도 정해진 주기마다 한 번만 실행된다.
    - CPU부하를 줄이고 , 자연스러운 실시간 반응을 유지할 수 있음.

    - 적용하지 않은 코드
    ```tsx
    window.addEventListener("scroll", () => {
    console.log("스크롤 중...");
    });
    ```
    - 적용한 코드
    ```tsx
    const throttledScroll = throttle(() => {
    console.log("스크롤 중...");
    }, 300);

    window.addEventListener("scroll", throttledScroll);
    ```

- 동작방식
    1. 사용자가 스크롤을 시작하면 throttledScroll이 즉시 실행된다.
    2. 이후 300ms 동안은 실행이 잠시 먹힌다.
    3. 300ms가 지나면 다음 이벤트를 다시 허용한다.
    4. 즉, 계속 스크롤 중이라도 0.3초마다 한번만 실행된다.
    