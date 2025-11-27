# Props Drilling

## Props Drilling이란?

- Props Drilling은 상위 컴포넌트에서 하위 컴포넌트까지 데이터를 전달하기 위해 중간 계층의 컴포넌트들이 실제로는 사용하지도 않는 props를 계속 전달해야 하는 상황을 말합니다.

## 왜 Props Drilling이 문제일까?

1. 중간 컴포넌트 오염
   사용하지 않는 props가 중간 컴포넌트의 인터페이스를 더럽히고, 컴포넌트의 재사용성을 크게 떨어뜨립니다.
2. 구조 변경 시 유지보수 비용 증가
   컴포넌트 구조가 바뀌면 props 전달 체인을 다시 조정해야 해서 오류 가능성이 높아집니다.
3. 코드 가독성 저하
   컴포넌트가 많아질수록 props 전달 흐름을 파악하기 어려워집니다.
4. 불필요한 렌더링 증가
   props가 내려갈 때마다 중간 컴포넌트들도 리렌더링될 수 있습니다.

## 어떤 상황에서 Props Drilling이 자주 생길까?

상황 1: 전역적으로 필요한 상태 (예: 유저 정보, 로그인 상태)
상황 2: 깊은 중첩 구조의 UI
상황 3: 이벤트 핸들러를 아주 아래 계층으로 내려야 할 때
상황 4: 컴포넌트가 너무 작은 단위로 나뉘어 있을 때

## Props Drilling을 줄이거나 없애는 방법

1. React Context 사용
   전역 또는 좁은 범위의 상태 공유에 적합.
2. 상태를 더 상위로 올리기(Lift State Up)
   불필요한 컴포넌트를 거치지 않도록 상태를 더 공통된 조상으로 올리는 방법.
3. 상태 관리 라이브러리 사용
   Redux,Zustand,Recoil,Jotai
   여러 계층의 상태 관리가 자연스럽게 가능해짐.
4. Render Props / Compound Pattern 활용
   UI 라이브러리에서 자주 쓰는 패턴.
5. URL/Router 상태 활용
   필요한 정보가 라우팅에 해당한다면 props로 전달할 필요 없이 URL에 보관.

## Props Drilling → Context로 리팩토링

const UserContext = createContext(null);

function App() {
return (
<UserContext.Provider value="Kim">
<A />
</UserContext.Provider>
);
}

function C() {
const user = useContext(UserContext);
return <div>{user}</div>;
}

## TypeScript 관점에서 살펴보기

const UserContext = createContext(null);

function App() {
return (
<UserContext.Provider value="Kim">
<A />
</UserContext.Provider>
);
}

function C() {
const user = useContext(UserContext);
return <div>{user}</div>;
}
어떤 값들이 Context에 들어가는지 한눈에 알 수 있고,useContext를 사용할 때도 자동완성의 도움을 받을 수 있어서 실수 가능성이 줄어듭니다.

# useReducer

## useReducer란 무엇인가요?

= - useReducer는 복잡한 상태 관리 로직을 하나의 reducer 함수로 관리할 수 있게 하는 React Hook입니다. useReducer는 여러 종류의 액션이 존재하거나 상태가 객체/배열처럼 구조적일 때 더 적합합니다.

## useReducer 기본 문법

- const [state, dispatch] = useReducer(reducer, initialState);

## useState와 useReducer 비교하기

- | 항목               | useState                  | useReducer                       |
  | ------------------ | ------------------------- | -------------------------------- |
  | 적합한 상황        | 단순 상태 / 직접 업데이트 | 복잡한 상태 / 액션 기반 업데이트 |
  | 업데이트 방식      | setState(newState)        | dispatch({ type, payload })      |
  | 비즈니스 로직 위치 | 컴포넌트 내부             | reducer 함수로 분리됨            |
  | 상태 타입          | 보통 단순                 | 객체/배열 형태 자주 사용         |
  | 디버깅             | 쉽다                      | 더 구조적이지만 액션 추적 필요   |

## useReducer 객체 상태 관리

interface FormState {
name: string;
age: number;
}

type FormAction =
| { type: "setName"; payload: string }
| { type: "setAge"; payload: number }
| { type: "reset" };

const initialForm: FormState = {
name: "",
age: 0,
};

function formReducer(state: FormState, action: FormAction): FormState {
switch (action.type) {
case "setName":
return { ...state, name: action.payload };
case "setAge":
return { ...state, age: action.payload };
case "reset":
return initialForm;
default:
return state;
}
}
인터페이스 설정
FormAction타입: 통한 dispatch()에 전달될 액션들의 형태를 정의한 TypeScript union 타입
formReducer 함수를 통해 변경

## dispatch를 통해 props로 전달해보기

function Child({ dispatch }: { dispatch: React.Dispatch<Action> }) {
return (
<button onClick={() => dispatch({ type: "increment" })}>+1</button>
);
}
React.Dispatch<Action>은 useReducer의 dispatch 함수 타입을 그대로 표현한 공식 타입입니다.
즉, 이 dispatch 함수는 반드시 Action 타입의 객체를 인자로 받아야 한다는 의미입니다.

## useReducer + Context 함께 사용하기

// 1. Context 생성
const UserContext = createContext(null);

// 2. Provider 만들기
function UserProvider({ children }) {
const [state, dispatch] = useReducer(userReducer, { name: "Kim" });

return (
<UserContext.Provider value={{ state, dispatch }}>
{children}
</UserContext.Provider>
);
}

// 3. 하위 컴포넌트에서 사용
function Profile() {
const { state, dispatch } = useContext(UserContext);

return (
<>
<p>{state.name}</p>
<button onClick={() => dispatch({ type: "setName", payload: "Lee" })}>
Change
</button>
</>
);
}

# Redux

## Redux는 무엇인가요?

= Redux는 애플리케이션의 상태를 예측 가능하고 일관되게 관리하기 위한 상태 관리 라이브러리입니다.

## Redux Toolkit은 무엇인가요?

- Redux Toolkit(RTK)은 Redux를 더 쉽게, 더 적게, 더 안전하게 사용할 수 있도록 만든 공식 도구 세트입니다.
  Redux의 가장 큰 불만이던 다음 문제를 해결합니다:
  보일러플레이트 코드가 많다
  reducer 작성이 번거롭다
  immutable update가 불편하다
  store 설정이 장황하다

import { createSlice } from "@reduxjs/toolkit";

const counterSlice = createSlice({
name: "counter",
initialState: { count: 0 },
reducers: {
increment(state) {
state.count += 1; // 불변성 신경 쓸 필요 없음!
},
},
});

export const { increment } = counterSlice.actions;
export default counterSlice.reducer;
설명:

## Redux vs Redux Toolkit 한눈에 비교

| 비교 항목      | Redux                      | Redux Toolkit           |
| -------------- | -------------------------- | ----------------------- |
| 상태 변경 방식 | 순수 reducer 직접 작성     | createSlice로 자동 생성 |
| 불변성 처리    | 직접 spread 연산으로 관리  | Immer 자동 처리         |
| 보일러플레이트 | 많음                       | 매우 적음               |
| 비동기 처리    | Thunk/Middleware 별도 설정 | Thunk 기본 포함         |
| store 설정     | configureStore 없음        | configureStore 제공     |
| 학습 난이도    | 상대적으로 높음            | 매우 낮음               |

## Redux Toolkit이 공식적으로 권장되는 이유

1. 보일러플레이트 대폭 감소
   기존 Redux는 action type, action creator, reducer를 모두 작성해야 했지만,
   RTK는 createSlice() 하나로 모두 해결합니다.
2. 불변성 문제 자동 해결
   Redux는 반드시 불변성을 유지해야 하는데,
   RTK는 Immer로 이 문제를 자동 해결합니다.
3. store 설정 기본 제공
   configureStore()는 미들웨어, DevTools, Thunk 등 필수 설정이 자동 세팅됩니다.
4. 디버깅 환경 강화
   Redux DevTools와 함께 사용 시 상태 추적이 매우 직관적입니다.
5. 초보자와 팀 협업에 최적화
   코드 패턴이 통일되고 유지보수가 쉬워집니다.

## 언제 Redux Toolkit을 사용할까요?

✔ 상태가 여러 컴포넌트에 걸쳐 전역적으로 필요할 때
예: 로그인 정보, 유저 설정, 테마 정보
✔ 상태 변경 흐름을 명확하게 추적해야 할 때
액션 기반 패턴이 유용
✔ 비동기 로직(API 요청)이 많을 때
RTK Query까지 더하면 서버 상태도 자동 관리 가능
✔ useReducer + Context 조합이 너무 커졌을 때
규모가 커지면 RTK가 훨씬 구조적이고 확장성이 좋음
✔ 팀 프로젝트
코드 패턴을 통일하고 디버깅/테스트가 좋아진다
