- **`Referential Equality` (참조 동일성)** 🍠
    - **`Referential Equality`는 무엇인가요?**
        
        # **`Referential Equality`는 무엇인가요?**
        
        간단히 말하면, 
        
        > **참조 동일성**은 “두 변수가 **완전히 같은 객체를 가리키고 있는가**?”를 보는 개념이에요.
        > 
        - “같은 값이냐?”가 아니라 “같은 **메모리 주소(같은 객체 인스턴스)**를 가리키냐?”를 묻는 거에요.
        
        그래서 **“두 객체가 진짜로 같은 녀석이냐?”** 를 확인할 때 쓰는 기준이라고 볼 수 있어요.
        
        ---
        
        ## 1. 자바스크립트에서 값 vs 참조에요
        
        ---
        
        ### 1-1. 값(primitive) 타입
        
        - `number`, `string`, `boolean`, `null`, `undefined`, `bigint`, `symbol`
        - 변수 안에 **값 자체가 들어있는 경우**에요.
        
        ```jsx
        let a = 10;
        let b = 10;
        
        console.log(a === b); // true (값 비교)
        ```
        
        ---
        
        ### 1-2. 참조(object) 타입
        
        - `object`, `array`, `function`, `Date`, `Map` 등
        - 변수 안에는 “객체가 저장된 메모리 위치(참조)”가 들어있어요.
        
        ```jsx
        const obj1 = { x: 1 };
        const obj2 = { x: 1 };
        const obj3 = obj1;
        
        console.log(obj1 === obj2); // false (서로 다른 객체(주소값)에요)
        console.log(obj1 === obj3); // true  (같은 객체(주소값)를 가리켜요)
        ```
        
        - `obj1`과 `obj2`는 모양은 같지만 **서로 다른 객체**에요.
        - `obj1`과 `obj3`는 **정확히 같은 객체**를 공유해요.
            
            → 이 둘이 “참조 동일”하다고 말하는 거예요.
            
        
        ---
        
        ## 2. 자바스크립트에서 ==, ===, Object.is 에요
        
        ---
        
        ### 2-1. `==` (느슨한 동등)
        
        - 타입을 **암묵적으로 변환**하면서 비교해요.
        - 예측하기 어려운 경우가 많아서, **실무에서는 거의 안 쓰는 게 좋아요.**
        
        ```jsx
        0 == false;   // true
        "" == false;  // true
        null == undefined; // true
        ```
        
        ---
        
        ### 2-2 `===` (엄격한 동등)
        
        - 타입 변환 없이 **그대로 비교**해요.
        - primitive에서는 “값 동일성”
        - 객체/배열/함수에서는 “참조 동일성”을 비교해요.
        
        ```jsx
        // primitive
        1 === 1;       // true
        "hi" === "hi"; // true
        
        // object
        const a = { x: 1 };
        const b = { x: 1 };
        const c = a;
        
        a === b; // false (서로 다른 객체)
        a === c; // true  (참조 동일성)
        ```
        
        ---
        
        ### 2-3. `Object.is`
        
        - 기본적으로 `===`와 비슷하지만,
            - `NaN` 비교, `+0` vs `-0` 같은 특수 케이스에서만 조금 달라요.
        
        ```jsx
        NaN === NaN;       // false
        Object.is(NaN, NaN); // true
        
        +0 === -0;        // true
        Object.is(+0, -0);   // false
        ```
        
        - **객체에 대해서는 `===`와 똑같이 참조 동일성**을 비교해요.
        
        ```jsx
        const obj1 = {};
        const obj2 = obj1;
        
        Object.is(obj1, obj2); // true (같은 참조에요)
        ```
        
        ---
        
        ## 3. 객체/배열/함수에서 참조 동일성 예제
        
        ---
        
        ### 3-1. 객체
        
        ```jsx
        const user1 = { name: "kim" };
        const user2 = { name: "kim" };
        const user3 = user1;
        
        console.log(user1 === user2); // false
        console.log(user1 === user3); // true
        ```
        
        - `user1`과 `user2`는 **값은 같아 보여도** 서로 다른 객체에요.
        - `user1`과 `user3`는 같은 참조를 공유하니까 참조 동일이에요.
        
        ---
        
        ### 3-2. 배열
        
        ```jsx
        const arr1 = [1, 2, 3];
        const arr2 = [1, 2, 3];
        const arr3 = arr1;
        
        console.log(arr1 === arr2); // false
        console.log(arr1 === arr3); // true
        ```
        
        “배열 내용이 같은지”를 보려면 **직접 비교 로직**이 필요해요.
        
        ```jsx
        const isArrayEqual = (a, b) => 
          a.length === b.length && a.every((v, i) => v === b[i]);
        
        console.log(isArrayEqual(arr1, arr2)); // true (값 동일성)
        ```
        
        ---
        
        ### 3-3. 함수
        
        ```jsx
        function foo() {}
        
        const bar = function () {};
        
        const baz = foo;
        
        console.log(foo === bar); // false (다른 함수 객체)
        console.log(foo === baz); // true  (같은 함수 객체)
        ```
        
        - 함수도 결국 **객체**라서, 참조 단위로 비교돼요.
        
        ---
        
        ## 4. 참조 동일성이 중요한 이유
        
        ---
        
        ### 4-1. 가변 객체 공유로 인한 사이드 이펙트
        
        ```jsx
        const state = { count: 0 };
        
        function increment(s) {
          s.count += 1;
          return s;
        }
        
        const a = state;
        const b = increment(state);
        
        console.log(a === b);     // true (같은 객체)
        console.log(state.count); // 1
        console.log(a.count);     // 1
        console.log(b.count);     // 1
        ```
        
        - `state`, `a`, `b` 세 변수가 **같은 객체를 공유**하고 있어요.
        - 어느 한 곳에서 `count`를 바꾸면 **전부 동시에 바뀌는 효과**가 나요.
        - “여기만 바꾼 줄 알았는데, 저기도 같이 바뀌었다”는 버그가 나기 쉬운 패턴이에요.
        
        ---
        
        ### 4-2. 불변 객체(immutable) + 참조 동일성
        
        ```jsx
        const state = { count: 0 };
        
        function incrementImmutable(s) {
          return { ...s, count: s.count + 1 };
        }
        
        const a = state;
        const b = incrementImmutable(state);
        
        console.log(a === b); // false (새 객체)
        console.log(a.count); // 0
        console.log(b.count); // 1
        ```
        
        - **원본은 그대로 두고, 새로운 객체를 만들어서 반환**해요.
        - 이 패턴을 쓰면
            - 과거 상태를 안전하게 보관할 수 있고
            - “참조가 바뀌었는지”만 봐도 변경 여부를 어느 정도 알 수 있어요.
        
        리액트에서
        
        - `useMemo`, `useCallback`
        - `React.memo`, `shouldComponentUpdate`
        - 리덕스의 상태 비교
        
        같은 곳에서 **“참조가 바뀌었냐?”를 기준으로 리렌더링/계산 최적화를 하는 이유**가 여기에 있어요.
        
        ---
        
        ## 5. 자바스크립트에서 자주 하는 실수들
        
        ---
        
        ### 5-1. “객체 내용이 같은데 왜 false죠?”
        
        ```jsx
        const a = { x: 1 };
        const b = { x: 1 };
        
        console.log(a === b); // false
        ```
        
        - 이 비교는 **“같은 객체냐?”** 를 묻는 거예요.
        - “내용이 같냐?”를 보려면 별도의 **deepEqual** 로직이나 라이브러리를 써야 해요.
        
        ---
        
        ### 5-2. 배열도 마찬가지
        
        ```jsx
        [1, 2, 3] === [1, 2, 3]; // 항상 false
        ```
        
        매번 새로 만들어지는 배열은 **다 다른 객체**라서, 참조 동일성이 깨져요.
        
        ---
        
        ### 5-3. 상태를 직접 수정하면서, 참조 비교로 변경 여부를 보려는 경우
        
        ```jsx
        const state = { x: 1 };
        
        function mutate(s) {
          s.x = 2;
        }
        
        mutate(state);
        
        console.log(state === state); // 항상 true죠…
        ```
        
        - “객체를 직접 수정”했는데, 참조는 그대로니까 참조 동일성으로는 변경 여부를 알 수 없어요.
        - 참조 비교로 변경 여부를 감지하고 싶다면 **불변 패턴(새 객체 생성)**을 써야 해요.
        
    - **리액트 렌더링 최적화**와 **`Referential Equality`**는 어떤 관계가 있을까요? 🍠
        
        ## 1. Referential Equality란 무엇인가
        
        - Referential Equality(참조 동일성)이란
        
        두 변수가 **메모리 상에서 동일한 객체(같은 주소)를 참조하는지**를 의미합니다.
        
        ```jsx
        const a = {x:1 };
        const b = {x:1 };
        
        a === b;// false (값은 같지만 참조는 다름)
        
        const c = a;
        a === c;// true (같은 참조)
        
        ```
        
        React는 객체·배열·함수에 대해 값 비교가 아닌 참조 비교(`===`)를 기본으로 사용합니다.
        
        ---
        
        ## 2. React 렌더링과 Referential Equality의 직접적인 관계
        
        ### 핵심 요약
        
        > React는 “참조가 바뀌었는가?”를 기준으로 다시 렌더링할지 판단한다
        > 
        
        이 원칙이 **렌더링 최적화의 출발점**입니다.
        
        ---
        
        ## 3. React가 Referential Equality를 사용하는 주요 지점
        
        ### 3.1 `React.memo`
        
        ```tsx
        constChild =React.memo(({ data }) => {
          ...
        });
        
        ```
        
        - `props`를 **shallow comparison**으로 비교
        - 객체·배열·함수는 `===` 비교
        - 부모가 리렌더링되더라도 **props 참조가 동일하면 Child는 리렌더링 안 함**
        
        문제 상황
        
        ```tsx
        <Child data={{id:1 }} />// 매 렌더마다 새로운 객체
        
        ```
        
        해결
        
        ```tsx
        const data =useMemo(() => ({id:1 }), []);
        <Childdata={data} />
        
        ```
        
        ---
        
        ### 3.2 `useEffect` Dependency Array
        
        ```tsx
        useEffect(() => {
          ...
        }, [obj]);
        
        ```
        
        - 의존성 배열도 **참조 비교**
        - `obj`가 매 렌더마다 새로 생성되면 effect는 계속 실행됨
        
        ```tsx
        const obj = {a:1 };
        useEffect(..., [obj]);// 매번 실행
        
        ```
        
        ```tsx
        const obj =useMemo(() => ({a:1 }), []);
        
        ```
        
        ---
        
        ### 3.3 `useCallback`, `useMemo`
        
        이 두 Hook의 존재 이유 자체가 **Referential Equality 유지**입니다.
        
        | Hook | 목적 |
        | --- | --- |
        | `useCallback` | 함수 참조 고정 |
        | `useMemo` | 객체·배열·계산 결과 참조 고정 |
        
        ```tsx
        const onClick =useCallback(() => {
        setCount(c => c +1);
        }, []);
        
        ```
        
        → 자식 컴포넌트에 전달 시 불필요한 리렌더링 방지
        
        ---
        
        ### 3.4 상태 업데이트(`useState`)
        
        ```tsx
        setState(prev => prev);
        
        ```
        
        - 이전 상태와 **참조가 동일하면 리렌더링 발생하지 않음**
        
        ```tsx
        const [state, setState] =useState({a:1 });
        
        setState({a:1 });// 값은 같아도 참조가 다르므로 리렌더링 발생
        
        ```
        
        ---
        
        ## 4. Referential Equality가 깨질 때 발생하는 문제
        
        ### 4.1 불필요한 리렌더링
        
        - 부모 → 자식 연쇄 렌더링
        - `React.memo`가 무력화됨
        
        ### 4.2 Effect 과다 실행
        
        - API 중복 호출
        - 성능 저하, 버그 발생 가능
        
        ### 4.3 상태 관리 라이브러리 성능 저하
        
        - Redux / Zustand / Recoil 등은 **참조 기반 변경 감지**
        - 새로운 객체를 불필요하게 생성하면 전체 트리 갱신
        
        ---
        
        ## 5. 실무 관점에서의 최적화 전략
        
        ### 5.1 언제 Referential Equality를 신경 써야 하나
        
        ✔ 컴포넌트가 자주 렌더링됨
        
        ✔ props로 객체·함수 전달
        
        ✔ 리스트 / 대규모 상태
        
        ✔ 메모이제이션을 사용하는 경우
        
        ❌ 단순 UI, 렌더링 비용이 매우 작은 컴포넌트
        
        ---
        
        ### 5.2 실무 기준 체크리스트
        
        - `React.memo` 사용 시 → **props 참조 안정성 확보**
        - `useEffect` 의존성 → **객체/함수 직접 넣지 말기**
        - 상태 업데이트 → **불필요한 새 객체 생성 금지**
        - 전역 상태 → **부분 선택(selectors) 사용**
- **`useCallabck`과 `memo`** 🍠
    
    ### 🎥 실습 1. 강의 영상
    
    https://www.youtube.com/watch?v=Z3uNjFqYSF8&t=904s
    
    <aside>
    🍠
    
    위의 영상을 보고 **`useCallabck`과 `memo`에**대해 정리해주세요!
    
    또한 아래 공식문서 또한 읽어보시면서 부족한 내용을 보충해서 정리해주세요!
    
    https://react.dev/reference/react/useCallback
    
    https://react.dev/reference/react/memo
    
    </aside>
    
    - **`useCallabck`** 에 대하여 정리해주세요! 🍠
        
        # **`useCallabck`** 에 대하여 정리해주세요! 🍠
        
        ---
        
        - **`useCallabck`** 이 무엇인지? 🍠
            
            # **`useCallabck`** 이 무엇인지?
            
            ---
            
            - 함수(콜백)를 “메모이제이션” 한다는 게 무슨 뜻인지?
                
                **렌더링이 반복되어도 같은 함수 참조(메모리 주소)를 재사용한다는 뜻**
                
                - React에서 함수는 객체
                - 렌더링 시 기본적으로 **매번 새 함수 생성**
                - `useCallback`은 이전에 만든 함수를 기억해 재사용
            - 언제 새 함수를 만들고, 언제 기존 함수를 재사용하는지?
                - **deps 배열이 바뀌면 → 새 함수 생성**
                - **deps 배열이 안 바뀌면 → 기존 함수 재사용**
                
                ```tsx
                useCallback(fn, deps)
                
                ```
                
        - 왜 **`useCallabck`**을 사용하는지? 🍠
            
            # 왜 **`useCallabck`**을 사용하는지?
            
            ---
            
            - **불필요한 리렌더링 방지**와 어떤 관련이 있는지
                - React는 props 비교 시 **참조(===)** 로 판단
                - 함수가 새로 만들어지면 자식은 “props 변경”으로 인식
                - `useCallback` → 함수 참조 고정 → 자식 리렌더링 방지
            - 성능 최적화 관점에서 얻는 이득 vs 남용했을 때의 오버헤드
                
                **이득**
                
                - 자식 컴포넌트 리렌더링 감소
                - `useEffect` 반복 실행 방지
                
                **오버헤드**
                
                - 메모이제이션 비용
                - 코드 복잡도 증가
                
                👉 **리렌더링 비용이 클 때만 사용**
                
        - **`useCallabck`** 기본 사용법 🍠
            
            # **`useCallabck`** 기본 사용법
            
            ---
            
            - **`useCallabck`**은 어떻게 사용하나요? (코드)
                
                ```tsx
                const handleClick = useCallback(() => {
                  setCount(prev => prev + 1);
                }, []);
                ```
                
            - `deps` 배열에 무엇을 넣어야 하는지 규칙
                
                콜백 내부에서 사용하는
                
                **외부 값(state, props, 변수)은 deps에 포함**
                
            - 의존성 변경 시 콜백이 어떻게 다시 만들어지는지
                - deps 동일 → 함수 재사용
                - deps 변경 → 새 함수 생성
        - **`useCallabck`**에서 중요한 개념 🍠
            
            # **`useCallabck`**에서 중요한 개념
            
            ---
            
            - **참조 동일성(reference equality)** 이 왜 중요한지 (=== 비교)
                
                
                React는 함수의 내용이 아니라 참조만 비교
                
                ```tsx
                prevFn === nextFn
                ```
                
                useCallback은 이 참조를 유지하는 역할
                
            - 클로저와 상태: 콜백 안에서 state, props를 사용할 때 주의할 점
                
                ❌
                
                ```tsx
                useCallback(() => {
                setCount(count +1);
                }, []);
                
                ```
                
                - 오래된 `count` 사용
                
                ✅
                
                ```tsx
                useCallback(() => {
                setCount(prev => prev +1);
                }, []);
                
                ```
                
            - **stale closure(낡은 값 캡처)** 문제는 언제 생기는지, 어떻게 피하는지
                - deps에 필요한 값을 넣지 않았을 때
                - 콜백이 **옛 state/props를 기억**
                
                **해결**
                
                - deps 정확히 작성
                - 함수형 업데이트 사용
        - **`useCallabck`**을 사용한 콜백 메모이제이션 예시 🍠
            
            # **`useCallabck`**을 사용한 콜백 메모이제이션 예시
            
            ---
            
            - 부모에서 자식으로 콜백을 내려줄 때, `onClick`, `onChange` 같은 핸들러를 **`useCallabck`** 없이 넘겼을 때와 **`useCallabck`**으로 감싸서 넘겼을 때 차이
                
                ❌
                
                ```tsx
                <Child onClick={() => {}} />
                
                ```
                
                - 부모 렌더링마다 새 함수
                - 자식 리렌더링 발생
                
                ✅
                
                ```tsx
                const onClick =useCallback(() => {}, []);
                <ChildonClick={onClick} />
                
                ```
                
                - 함수 참조 유지
                - `React.memo`와 함께 효과적
            
        - 이벤트 핸들러 / 비동기 로직에서 **`useCallabck`** 예시 🍠
            
            # 이벤트 핸들러 / 비동기 로직에서 **`useCallabck`** 예시
            
            ---
            
            - 버튼 클릭 시 API 호출하는 핸들러를 `useCallback`으로 감싸는 패턴
                
                ```tsx
                const fetchData = useCallback(async () => {
                  const res = await fetch("/api/data");
                  setData(await res.json());
                }, []);
                
                ```
                
            - `useEffect` 안에서 의존성으로 콜백을 넣을 때 패턴
                
                ```tsx
                useEffect(() => {
                fetchData();
                }, [fetchData]);
                ```
                
            - 폼 제출 핸들러, 디바운스/스로틀 함수와 함께 사용할 때
                
                ```tsx
                const handleSubmit =useCallback((e) => {
                  e.preventDefault();
                }, []);
                
                ```
                
                ```tsx
                const debounced =useCallback(
                debounce(fn,300),
                  []
                );
                
                ```
                
            
    - **`memo`**에 대하여 정리해주세요!🍠
        
        # **`memo`**에 대하여 정리해주세요!🍠
        
        ---
        
        - **`memo`**가 무엇인지? 🍠
            
            # **`memo`**가 무엇인지?
            
            ---
            
            ### 정의
            
            - *`React.memo`는 컴포넌트를 메모이제이션하는 HOC(Higher-Order Component)**이다.
            - 부모 컴포넌트가 리렌더링되더라도
                
                **자식 컴포넌트의 props가 이전과 같다면 리렌더링을 건너뛴다.**
                
            
            ```tsx
            constMemoComponent =React.memo(Component);
            
            ```
            
            ---
            
            ### 핵심 동작 원리
            
            - 이전 렌더링 시의 props와
            - 현재 렌더링 시의 props를 비교
            - **얕은 비교(shallow comparison)** 결과:
                - 같으면 → 렌더링 ❌
                - 다르면 → 렌더링 ⭕
        - 왜 **`memo`**를 사용하는지? 🍠
            
            # 왜 **`memo`**를 사용하는지?
            
            ---
            
            ### React의 기본 렌더링 방식
            
            - React는 기본적으로
                - **부모가 리렌더링되면 자식도 함께 리렌더링**
            - 실제로는
                - 자식의 UI나 props가 **전혀 변하지 않은 경우도 많음**
            
            이때 불필요한 렌더링이 발생
            
            ---
            
            ### `memo`의 역할
            
            - props가 바뀌지 않은 컴포넌트를 **렌더링 대상에서 제외**
            - 렌더링 비용이 큰 컴포넌트에서 성능 최적화 효과가 큼
            
            ---
            
            ### `memo`를 사용했을 때 얻는 효과
            
            - 불필요한 리렌더링 감소
            - CPU 사용량 감소
            - 대규모 트리에서 성능 개선
        - **`memo`** 기본 사용법 🍠
            
            # **`memo`** 기본 사용법
            
            ---
            
            ### 1. 가장 기본적인 사용
            
            ```tsx
            import { memo }from"react";
            
            constChild =memo(functionChild({ value }) {
            console.log("Child render");
            return<div>{value}</div>;
            });
            
            ```
            
            - `value`가 바뀌지 않으면
            - `Child render`는 다시 찍히지 않음
            
            ---
            
            ### 2. props 비교 방식 (중요)
            
            - `memo`는 기본적으로 **얕은 비교(shallow compare)** 사용
            - 즉, 내부적으로는 `===` 비교
            
            ```tsx
            prevProps === nextProps
            
            ```
            
            ---
            
            ### 얕은 비교의 의미
            
            | props 타입 | 비교 방식 |
            | --- | --- |
            | number, string, boolean | 값 비교 |
            | object, array, function | **참조 비교** |
        - **`memo`**를 언제 쓰면 좋은지 / 안 좋은지 🍠
            
            # **`memo`**를 언제 쓰면 좋은지 / 안 좋은지
            
            ---
            
            ### 사용하면 좋은 경우
            
            - 컴포넌트 렌더링 비용이 큼
            - 같은 props로 여러 번 렌더링됨
            - 리스트 아이템 컴포넌트
            - 차트, 복잡한 UI
            - `useCallback`, `useMemo`로 props 안정성이 확보된 경우
            
            ### 사용을 피해야 할 경우
            
            - 컴포넌트가 매우 단순함
            - props가 매번 새 객체 / 새 함수
            - 렌더링 비용보다 **props 비교 비용이 더 큼**
            - 성능 이슈가 없는 경우