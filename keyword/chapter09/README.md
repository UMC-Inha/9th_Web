<h3>Props Drilling 이란 ??</h3>

- 상위 컴포넌트에서 하위 컴포넌트로 데이터를 내려보낼 때 실제로 그 값을 쓰지 않는 중간 컴포넌트 들도 props를 계속 받아서 다시 아래로전달해야 하는 상황.

- 문제인 이유

  1. 유지보수가 점점 어려워 진다. -> 어떤 데이터를 어디에서 전달하는지 추적하기가 점점 어려워지는 현상
  2. 코드 가독성이 떨어진다. -> 실제로 해당 컴포넌트를 사용하지 않음에도 단지 아래로 내려주기 위해서 props를 받고 또 넘겨야 한다
  3. 컴포넌트 구조를 바꾸기가 부담스러워진다. -> 화면 구조를 리펙토링하면서 컴포넌트를 위아래로 옮기면 , 그에 맞춰 props 전달 경로도 전부 다시 손을 봐야한다.

- 어떤 상황에서 많이 생기는가 ?

  1. 로그인한 사용자 정보
  2. 다크모드/ 라이트 모드
  3. 언어 설정
  4. 레이아웃 전체에서 쓰는 설정 값들
  5. 모달 열림 여부, 알림 상태 전역 등 UI 상태

- 줄이거나 없애는 방법

  - 가장 먼저 확인해야하는 것 : 컴포넌트 설계
    1. 이 데이터가 진짜 이 깊이까지 내려가야 하는가?
    2. 컴포넌트 역할을 다시 나누면 props 경로를 줄일 수 있는가?

  1. 타입 정의하기

     - 여러 컴포넌트에서 공통으로 사용하는 값이라면 Context를 사용해서 Props Drilling 을 주릴 수 있다.

  2. 상위에서 Provider로 감싸기

     ```tsx
     function App() {
       return (
         <UserContext.Provider value={{ name: "Matthew" }}>
           <Parent />
         </UserContext.Provider>
       );
     }
     ```

  3. 하위 컴포너트에서 사용하기

  4. 상태관리 라이브러리를 사용하기

  5. Custom Hook으로 로직 분리하기
     여러 컴포넌트에서 **같은 로직**을 사용해야 한다면 `useSomething` 형태의 Custom Hook으로 분리하는 것도 좋아요.

    ```tsx
    function useDarkMode() {
    const [isDarkMode, setIsDarkMode] = useState(false);

    const toggle = () => setIsDarkMode((prev) => !prev);

    return { isDarkMode, toggle };
    }
    ```

    이제 필요한 컴포넌트에서:

    ```tsx
    function Header() {
    const { isDarkMode, toggle } = useDarkMode();

    return (
        <header>
        <button onClick={toggle}>
            {isDarkMode ? "다크 모드" : "라이트 모드"}
        </button>
        </header>
    );
    }
    ```

```TS관점에서 살펴보기``` 
    
- Props 타입을 정의하고 
- Context 타입 정의


<h3>useReducer</h3>

- React 에서 상태를 관리하기 위한 훅이다.
- 상태 변화 로직이 복잡해지거나 여러 타입의 업데이트가 필요한 경우에는 useReducer가 더 적합하다.

- useReducer 
    - useReducer를 사용하는 이유 
        1. 상태 업데이트가 여러 형태일 때 좋아요
        2. state 구조가 복잡할 때 좋다
        3. 상태 업데이트 로직을 컴포넌트 밖으로 분리할 수 있다.
        4. props drilling 없이 dispatch만 넘기면 된다.
    - useState vs Reducer 
        - 상태가 단순한 경우 : useState
        - 상태 업데이트 로직이 복잡한 경우 : useReducer
        - 여러 액션이 존재할 경우 : useReducer에서 switch로 명확하게 구분
        - 컴포너트 재사용/테스트 용이성 : useReducer
        - 전역 상태 처럼 사용 : dispatch만 내려도 가능하다.
    - dispatch를 props로 전달하기

    props drilling을 줄이기 위해 **state 대신 dispatch만 전달하는 방식**도 자주 사용해요.

    ```tsx
        function Child({ dispatch }: { dispatch: React.Dispatch<Action> }) {
        return (
        <button onClick={() => dispatch({ type: "increment" })}>+1</button>
        );
        }
    ```

    - 이렇게 하면 상태값(state)을 굳이 여러 컴포넌트에 전달할 필요가 없다.
    - 하위 컴포넌트는 dispatch만 받아서 필요한 액션을 보내면 된다.

    - useReducer 사용 시 체크리스트
        1. 상태 업데이트 로직이 복잡해지는가?
        2. 상태 변경이 여러 경우로 나뉘는가?
        3. 테스트 가능한 로직을 만들고 싶은가?
        4. dispatch 를 내려보내면 props drilling을 줄일 수 있는가?

``` Redux란 무엇인가 ?```

- 전역 상태를 예측 가능하게 관리할 수 있도록 도와주는 라이브러리이다.
- 특징
    1. 상태는 하나의 큰 저장소에 모여 있다.
    2. 상태는 항상 순수 함수를 통해서만 변경된다.
    3. 변경하려면 반드시 action 객체를 사용해야한다.
    4. 구조가 명확해서 예측 가능성이 높다.

- 단점
    1. 코드가 길어지고 반복되는 부분이 많아진다.
    2. 작성할 코드가 많아진다.

```Redux Toolkit은 무엇인가?```

- 기존 Redux의 불편한 점을 해결하고, 더 적은 코드로 Redux를 사용할 수 있게 만든 도구
- 특징
    1. 보일러플레이트를 크게 줄여준다.
    2. immer가 포함되어 있어서 불변성 관리가 자동으로 된다.
    3. createSlice를 통해 action +reducer를 한번에 만들 수 있다.
    4. 비동기 로직도 createAsyncThunk로 쉽게 관리할 수 있다.

- Redux를 언제 사용해야 하는가?
    1. 여러 컴포넌트에 공유하는 복잡한 상태가 많을때
    2. 비동기 API 요청이 많을 때
    3. 데이터 구조가 복잡해서 불변성 관리가 힘들때
    4. 상태 모듈을 여러 개로 나눠 관리하고 싶을때
    
- Redux Toolkit 사용법

1. Provider
리액트 앱 전체에 Redux store를 꽂아주는 컴포넌트 이다.

```tsx
import { Provider } from "react-redux";
import { store } from "./app/store";

<Provider store={store}>
  <App />
</Provider>
```

이렇게 설정을 해두면 App안쪽의 모든 컴포넌트에서 useSeletor, useDispatch를 써서 Redux상태/액션에 접근이 가능해진다.

2. configureStore
- Redux Toolkit에서 제공하는 스토어 생성함수이다
- 옛날 createStore+DevTools 설정 + 미들웨어 설정을 한번에 처리해주는 "공식 스토어 생성 방법" 이다.
reducer 객체 안에 slice 리듀서들을 키-값 형태로 등록하는 방법.

자동으로 해주는것

1. Redux Devtools 연동
2. 기본 미들웨어 세팅
3. 개발 환경에서 불변성/직렬화 검사
4. Ts에서 store.dispatch,store.getState 타입의 추론이 잘되게 도와준다.

- createSlice
Redux Toolkit에서 제공하는 slice단위 상태 모듈 생성함수.

state+reducer+action creator를 한번에 만들어준다

→ 옛날 Reducer처럼 ACTION_TYPE,action creator,switch,reducer를 따로 만들 필요가 없다.

```tsx
import { createSlice } from "@reduxjs/toolkit";

const counterSlice = createSlice({
  name: "counter",              // slice 이름 (action type prefix로도 사용)
  initialState: { value: 0 },   // 초기 상태
  reducers: {                   // 동기 리듀서 + 자동 action creator 생성
    increment(state) {
      state.value += 1;         
    },
    decrement(state) {
      state.value -= 1;
    },
    incrementByAmount(state, action) {
      state.value += action.payload;
    },
  },
});

export const { increment, decrement, incrementByAmount } = counterSlice.actions;
export default counterSlice.reducer;
```

- useSelector
Redux store 안에 있는 상태를 읽어오는 React Hook이다. 

Provider로 감싼 컴포넌트 트리 안에서만 사용이가능하고

state 전체 중 필요한 일부만 선택해서 가져오는 용도이다.

```tsx
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";

function MyComponent() {
  const count = useSelector((state: RootState) => state.counter.value);

  return <div>Count: {count}</div>;
}
```

콜백의 인자는 Redux의 전체 상태 트리

state.counter.value처럼 내가 원하는 부분만 리턴하면 된다.

컴포넌트는 그 값이 바뀔 때만 리랜더링 하면 된다.

- 장점으로는 매번 useSelector<RootState>이런 식으로 사용하지 않아도 되고 콜백 안의 state상태가 자동으로 잡힌다.


- useDispatch
Redux store에 액션을 보내는 함수(dispatch)를 꺼내오는  React Hook

dispatch 를 호출하여 state를 변경하는 트리거 역할을 한다.

Provider로 감싼 컴포넌트 트리 안에서만 사용이 가능하다.

```tsx
import { useDispatch } from "react-redux";
import { increment } from "../features/counter/counterSlice";

function Counter() {
  const dispatch = useDispatch();

  return (
    <button onClick={() => dispatch(increment())}>
      +1
    </button>
  );
}
```

dispatch에 잘못된 액션을 넣어주면 TS가 잡아주고 thunk(비동기 액션)도 타입이 안전하게 사용이 가능하다.


```Zustand 사용하는 이유 ```
1. 가볍고 빠름. → 번들 사이즈가 매우 작고, 구조도 단순하여 작은/중간 규모 앱엥 특히 잘 맞는다.
2. 보일러플레이트가 거의 없다.
    
    → Redux러럼 액션 타입, 액션 크리에이터, 리듀서 파일 따로 만들 필요가 없다.
    
3. Provider 감싸기가 필요없다.
    
    → <Provider>로 앱 전체를 래핑할 필요가 없다.
    
    store는 그냥 모듈 레벨에 만들어두고 어디서든 hook으로 접근한다.
    
4. API가 React Hooks 기반이라 직관적이다.
    
    →컴포넌트마다 필요한 조각만 선택하여 가져오기 떄문에 불필요한 리렌더도 줄일 수 있다.
    
5. 엄청 의견 강한 라이브러리가 아니다
    
    → 아키텍처를 강요하지않고 유연하게 쓸 수 있다

###  set 함수

- 스토어 상태를 업데이트하는 함수
- set(새상태) 또는 set(prev⇒ 새 상태) 형식으로 작성한다.
- 

```tsx
import { create } from "zustand";

type BearState = {
  bears: number;
  increase: () => void;
};

const useBearStore = create<BearState>((set) => ({
  bears: 0,
  increase: () =>
    set((state) => ({ bears: state.bears + 1 })), // ← 여기 set
}));
```

### 2) get 함수

- create 콜백은 set뿐만 아니라 get도 받을 수 있음.
- 액션 안에서 조건 분기할 때, 또는 컴포넌트 밖에서 상태 참조할 때 사용.
- 

```tsx
import { create } from "zustand";

type BearState = {
  bears: number;
  eatFish: () => void;
};

const useBearStore = create<BearState>((set, get) => ({
  bears: 0,
  eatFish: () => {
    const current = get().bears; // ← 여기 get
    if (current > 0) {
      set({ bears: current - 1 });
    }
  },
}));
```

### 3) 선택적 구독 (selector)

- 필요한 조각만 선택해서 구독.
- 그 조각이 바뀔 때만 컴포넌트가 리랜더링 된다. → 불필요한 랜더 감소.

```Zustand vs Context API```
- 둘 다 전역 상태로 내려보내는 용도로 쓸 수 있다.
- 리액트 컴포넌트 트리 어디서든 상태를 공유할 수 있게 해준다.
- Zustand
    - 장점
        1. 리랜더링 최소화에 특화
        2. Provider 필요가 없다
        3. 상태 +액션 구조가 깔끔하다.
        4. 비동기 / 미들웨어 /퍼시스트 등 확장이 쉽다
- context API
    - 장점
        1. 리액트 내장이 가능하다
        2. 가벼운 전역 값 공유에 좋다
    - 단점
        1. 리랜더링 관리가 어렵다
        2. 상태 관리 도구가 아니다..
        
- Zustand가 적합한 경우
    - 앱이 작고 전역 상태가 아주 단순할 때
- Zustand가 더 적합한 경우
    - 전역 상태가 많아지고 여러 컴포넌트에서 복잡하게 읽고 쓰는 구조일 때
    - 비동기 로직, 로딩/에러 상태, 여러 모듈의 상태를 관리해야 할 때

- **`Jotai`**의 **`atom`** 조합 방식이 파생 상태 관리에서 Zustand 대비 갖는 장점을 의존성 추적 관점에서 설명해보세요.
    
    Zustand의 파생상태
    
    Zustand에서는 파생 상태를 만들려면 직접 selector를 만들거나 store안에서 getter 함수로 직접 계산해야 한다.
    
    하지만 Zustand는 의존성 자동 추적을 하지 않는다.
    
    따라서 결국 개발자가 어떤 상태와 어떤 상태가 의존하는지를 직접 관리해야한다.
    
    따라서 atom과 파생 atom으로 상태를 구성한다. 
    
    장점 
    
    - 어떤 atom이 어떤 atom에 의존하는지 **명시적이고 자동적으로 관리됨**.
    - 불필요 업데이트 없음 → 필요한 atom들만 다시 계산되고 업데이트됨.
    - 파생 상태가 **연쇄 구조**일 때(파생 → 파생 → 파생…) 확실한 이점이 생김.
    - 개발자가 직접 “이 값이 변하면 저 값도 다시 계산해야지” 같은 관리 필요 없음.
- 서버 상태를 **`useEffect`**로 관리할 때 발생하는 캐싱/중복 요청/불일치 문제를 설명해보세요.
    1. 캐싱 부재 
        1. 데이터가 컴포넌트마다 개별로 요청되며 , 한번은 가져온 데이터를 재사용하는 캐싱 전력이 없다. → 다른 화면으로 다녀오면 다시 fetch 로 인한 성능저하
    2. 중복 요청 발생
        1. 여러 컴포넌트가 같은 서버 리소스가 필요하면 → useEffect에서 fetch 실행 → 중복 fetch가 다발성이된다 따라서 서버 리소스 낭비 + 네트워크 비용이 증가
    3. 데이터 불일치 
        1. useEffect는 타이밍에 따라 fetch가 지연되거나 컴포넌트 재랜더링 순서 때문에 이전 요청이 이후 요청보다 늦게 도착하면 사용자는 오래된 화면을 보게될 수 도 있음.