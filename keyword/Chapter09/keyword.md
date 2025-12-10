# Redux와 Redux Toolkit 비교

Redux는 코드량이 많고 불변성을 직접 관리해야 합니다.
Reducer는 switch문을 사용하고, Action은 별도로 작성해야 합니다.
비동기 처리는 redux-thunk나 saga 설정이 필요하며, 학습 난이도가 높고 생산성이 낮습니다.

Redux Toolkit은 코드량이 적고 Immer로 불변성을 자동 처리합니다.
Reducer는 createSlice로 간결하게 작성할 수 있고, Action은 자동 생성됩니다.
비동기 처리도 createAsyncThunk로 간단하며, 학습이 쉽고 생산성이 높습니다.

---

# Redux Toolkit 사용법

## Provider

`Provider`는 `react-redux` 라이브러리에서 제공하는 핵심 컴포넌트로, Redux와 React를 연결할 때 가장 상위에 위치해야 합니다.  
`Provider`는 Redux의 상태 저장소(Store)를 React 애플리케이션의 모든 컴포넌트가 접근할 수 있도록 제공합니다.  
즉, React 컴포넌트 트리 전체에서 store에 저장된 상태를 읽거나 변경할 수 있게 하는 역할을 합니다.  
사용 시 반드시 `store`라는 props를 전달해야 합니다.

```tsx
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store';
import App from './App';

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
);
```

## configureStore

`configureStore`는 Redux store를 생성하는 함수로, 기존 Redux의 `createStore`를 감싸 더 좋은 기본 설정(Good Defaults)을 제공합니다.  

- 여러 개의 slice reducer를 객체 형태로 넣으면 자동으로 하나의 root reducer로 합쳐줍니다.
- Redux 개발자 도구를 별도 설정 없이 바로 사용할 수 있습니다.
- 비동기 작업 처리를 위해 필요한 `redux-thunk` 미들웨어가 기본으로 포함되어 있습니다.

```tsx
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import postsReducer from './postsSlice';

const store = configureStore({
  reducer: {
    // 객체 형태로 넣어주면 자동으로 하나로 합쳐줍니다.
    user: userReducer,
    posts: postsReducer,
  },
});

export default store;
```

이를 통해 Redux를 보다 간단하고 안정적으로 설정할 수 있습니다.

## createSlice

`createSlice`는 액션(Action)과 리듀서(Reducer)를 한 번에 정의할 수 있게 해주는 함수입니다.  
슬라이스 이름, 초기 상태값, 그리고 리듀서 객체를 전달하면, Redux 상태 관리에 필요한 모든 기본 구성 요소를 자동으로 생성합니다.

- 정의한 리듀서만으로 Action Type, Action Creator, Reducer를 모두 자동 생성합니다.
- 내부적으로 Immer 라이브러리를 사용하여, 복잡한 불변성 유지 로직 없이도 상태를 안전하게 변경할 수 있습니다.  
  예를 들어, `state.value = 1`과 같이 직접 상태를 수정하는 것처럼 보여도 실제로는 불변성이 유지됩니다.

## useSelector

`useSelector`는 store 안의 상태를 조회하는 훅(Hook)입니다.  

- `Provider`를 통해 공급된 store에서 필요한 부분만 선택적으로 가져올 수 있습니다.
- store의 해당 데이터가 변경되면, 이 데이터를 사용하는 컴포넌트는 자동으로 리렌더링되어 UI가 갱신됩니다.
- `useSelector`의 인자로 들어오는 state는 store에 저장된 모든 상태를 의미하며, 필요한 slice의 값만 선택해서 가져오면 됩니다.

## useDispatch

`useDispatch`는 store에 액션을 전달(Dispatch)하여 상태를 변경할 수 있게 해주는 훅입니다.  

- `useDispatch`를 호출하면 `dispatch` 함수를 반환받습니다.
- 이벤트(버튼 클릭 등)가 발생했을 때, `dispatch(액션)` 형태로 전달하면 store의 reducer가 해당 액션을 처리하고 상태를 변경합니다.
- `createSlice`로 생성한 action creator와 함께 사용하면 직관적이고 간결하게 상태 변경을 관리할 수 있습니다.

```tsx
import React from 'react';
import { useDispatch } from 'react-redux';
// 액션 함수를 가져옵니다.
import { increment } from './counterSlice';

export function CounterButton() {
  // dispatch 함수를 가져옵니다.
  const dispatch = useDispatch();

  return (
    // 버튼을 누르면 'increment' 요청을 전달합니다.
    <button onClick={() => dispatch(increment())}>
      +1 증가
    </button>
  );
}
```

## createAsyncThunk

`createAsyncThunk`는 서버 API 호출과 같이 비동기 작업을 처리하는 액션을 간편하게 만들어주는 함수입니다.  
Redux는 기본적으로 동기적이므로, 비동기 작업을 처리하려면 Thunk를 사용해야 합니다.  

- 비동기 작업의 상태를 `pending`, `fulfilled`, `rejected` 세 가지 액션으로 자동으로 분리합니다.
- 비동기 로딩 상태나 오류 처리 로직을 쉽게 관리할 수 있습니다.
- slice의 `extraReducers`에서 이 상태들을 처리하여 UI 업데이트에 활용할 수 있습니다.

## createEntityAdapter

`createEntityAdapter`는 ID 기반 데이터 리스트를 효율적으로 관리할 수 있게 도와주는 도구입니다.  

- 데이터를 정규화(normalization)하여 `{ ids: [], entities: {} }` 형태로 관리합니다.
- CRUD 관련 기본 함수들을 제공하여, find나 map을 사용하지 않고도 데이터 추가, 수정, 삭제를 빠르게 수행할 수 있습니다.
- 복잡한 데이터 구조를 다루거나, 대규모 리스트를 처리할 때 성능과 코드 간결성에 큰 도움이 됩니다.

---

# Zustand 이해

Zustand는 React 상태 관리 라이브러리로, Props Drilling 문제를 해결하기 위해 등장한 Redux나 Context API의 복잡성과 반복적인 코드 작성 문제를 보완하기 위해 만들어졌습니다. 단순하고 직관적이며, 성능 최적화가 용이하다는 장점을 갖고 있습니다.

## Zustand의 특징

- 앱 전체를 감싸는 Provider가 필요하지 않습니다.
- store를 생성하고 상태와 변경 함수를 정의하는 최소한의 코드로 동작합니다.
- 구독한 데이터가 변할 때만 컴포넌트가 리렌더링되어 성능 최적화에 유리합니다.
- 상태와 상태를 변경하는 함수인 액션을 한 곳에서 관리할 수 있습니다.

## Zustand를 사용하는 이유

- Redux와 달리 액션 타입, 액션 생성자, 리듀서를 따로 작성할 필요가 없습니다. 상태 정의와 변경 함수를 한 곳에서 관리할 수 있어 읽기와 수정이 쉽습니다.
- Context API와 달리, 필요한 데이터만 선택적으로 구독할 수 있어 다른 데이터가 바뀌더라도 불필요한 리렌더링이 발생하지 않습니다.
- 최상위 컴포넌트에 여러 Provider를 감싸는 구조를 단순화할 수 있습니다. Zustand는 store 훅을 직접 import하여 사용하면 되므로 앱 구조가 직관적으로 바뀝니다.

```tsx
<AuthProvider>
  <ThemeProvider>
    <ReduxProvider>
      <Router>
         <App />
      </Router>
    </ReduxProvider>
  </ThemeProvider>
</AuthProvider>
```

- React 컴포넌트 외부에서도 상태에 접근하고 변경할 수 있어, 일반 자바스크립트 파일에서도 상태 관리를 수행할 수 있습니다.

## Zustand 기본 사용법

store 만들기
```tsx
import { create } from 'zustand'

// useStore라는 훅 생성.
const useStore = create((set) => ({
  count: 0, // 상태(State)
  increase: () => set((state) => ({ count: state.count + 1 })), // Action
  removeAll: () => set({ count: 0 }),
}))
```

컴포넌트에서 사용하기
```tsx
function Counter() {
  // 스토어에서 필요한 상태만 가져옵니다
  const count = useStore((state) => state.count)
  const increase = useStore((state) => state.increase)

  return (
    <div>
      <h1>{count}</h1>
      <button onClick={increase}>증가시키기</button>
    </div>
  )
}
```

## Zustand에서 중요한 개념

### set 함수

- store 내부의 상태를 업데이트할 때 사용됩니다. 바꾸고 싶은 데이터만 지정하면 나머지는 자동으로 유지됩니다.
- shallow merge 방식으로 동작하며, 1단계 깊이까지만 병합이 됩니다. 객체 안에 객체가 있는 구조에서는 직접 복사하거나 Immer를 사용해야 합니다.

### get 함수

- 현재 상태를 확인할 때 사용합니다. set 함수 내 state 인자로도 접근할 수 있지만, 복잡한 조건문이나 비동기 로직에서 유용합니다.

### 선택적 구독(selector)

- 컴포넌트는 store의 모든 데이터를 가져오지 않고 필요한 데이터만 선택적으로 구독합니다.
- 특정 값이 바뀔 때만 해당 컴포넌트가 리렌더링됩니다.
- 여러 데이터를 가져올 때는 shallow 구독 기능을 활용하여 불필요한 리렌더링을 방지할 수 있습니다.

## 객체 상태 관리

- 객체 안에 중첩된 구조가 있을 경우, set 함수는 최상위만 병합하고 내부 객체는 수동으로 복사해주어야 합니다.
- 중첩 구조의 상태를 안전하게 업데이트하기 위해 Immer 미들웨어를 사용할 수 있습니다. Immer를 사용하면 직접 값을 수정하는 것처럼 작성해도 불변성이 유지됩니다.

## 비동기 로직

- store 안에서 비동기 API 호출을 처리할 수 있습니다.
- 비동기 작업을 시작할 때 로딩 상태를 변경하고, 성공 또는 실패 시 상태를 업데이트하도록 관리할 수 있습니다.

```tsx
import { create } from 'zustand'

const useUserStore = create((set) => ({
	// 상태 정의
  user: null,
  isLoading: false,
  error: null,

  // 비동기 액션 정의
  fetchUser: async (userId) => {
    // 요청 시작 => 로딩 상태를 true로 변경, 에러 초기화
    set({ isLoading: true, error: null });

    try {
      // API 호출
      const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
      
      if (!response.ok) throw new Error('데이터를 가져오는데 실패했습니다.');
      
      const data = await response.json();

      set({ user: data, isLoading: false });
      
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
}))

export default useUserStore;
```

## Persist 미들웨어

- Zustand는 미들웨어를 사용하여 로컬 스토리지나 세션 스토리지에 상태를 저장하고 복구할 수 있습니다.
- 저장하고 싶은 데이터만 선택적으로 저장할 수 있으며, 앱이 다시 켜질 때 자동으로 상태를 복구합니다.

## Immer와 함께 사용

- 배열이나 중첩 객체 등 복잡한 상태를 간단하게 업데이트할 수 있습니다.
- map이나 복사 없이 상태를 직접 수정하는 것처럼 작성할 수 있으며, Immer가 불변성을 자동으로 유지합니다.

## Zustand와 Context API 비교

- Context API는 구독한 데이터가 하나라도 바뀌면 해당 Context를 구독하는 모든 컴포넌트가 강제로 리렌더링됩니다.
- Zustand는 selector를 통해 필요한 데이터만 구독할 수 있어, 선택한 데이터가 변하지 않으면 다른 값이 바뀌더라도 리렌더링이 일어나지 않습니다.
- Context API는 최상위 컴포넌트를 Provider로 감싸야 하지만, Zustand는 Provider가 필요 없고 store 훅을 import해서 바로 사용할 수 있습니다.
- Context API는 React 컴포넌트 내부에서만 동작하지만, Zustand는 React와 독립적인 자바스크립트 객체로 컴포넌트 외부에서도 상태를 읽고 쓸 수 있습니다.
- 단순한 데이터 전달은 Context API로 충분하지만, 데이터가 자주 변하고 성능 최적화가 중요한 경우에는 Zustand가 적합합니다.

---

# Context API, Zustand, Jotai, 서버 상태 관리 비교

## Context API의 전체 value 구독과 Zustand의 selector 기반 구독 성능 차이

Context API에서는 Provider에 전달되는 value 객체를 하나의 덩어리로 취급합니다. 
```tsx
const value = { user, theme }; 
<UserContext.Provider value={value}> ... </UserContext.Provider>
```
따라서 value 내부의 일부 값만 변경되어도 value 객체 전체가 새로 생성되며, 이를 사용하는 모든 구독 컴포넌트가 리렌더링됩니다. 예를 들어 user만 사용하는 컴포넌트가 999개이고, theme만 사용하는 컴포넌트가 1개일 때 theme 값이 바뀌면 user 컴포넌트 999개까지 모두 리렌더링됩니다.

반면 Zustand는 store에서 데이터를 가져올 때 selector를 사용하여 필요한 데이터만 선택적으로 구독합니다. store 상태가 변경되면 각 컴포넌트의 selector를 실행하고, 이전 값과 비교하여 값이 달라진 경우에만 리렌더링합니다. 따라서 theme 값이 변해도 user를 구독하는 컴포넌트는 리렌더링되지 않습니다.  
즉, Context API는 내용물 중 일부가 바뀌어도 전체를 새로 포장하여 전달하는 방식이고, Zustand는 필요한 데이터만 낱개로 관리하여 변경된 경우에만 알림을 주는 방식입니다.

## 2. Jotai의 atom 조합과 Zustand의 selector 비교

Jotai에서 파생 상태를 만들 때, get(atomA)를 호출하면 내부적으로 atomA가 의존성 그래프에 기록됩니다. atomA 값이 바뀌면, atomA를 의존하는 파생 atom만 재계산됩니다. 값이 변하지 않으면 이전 계산값을 그대로 반환합니다.

Zustand는 store 내 selector를 통해 상태를 가져오며, 상태가 변경될 때 selector가 실행됩니다. selector 내부 연산이 무겁거나 복잡하면 store의 관련 없는 값이 바뀌어도 selector가 재실행될 수 있습니다. 이 경우 useMemo나 createSelector 같은 별도의 최적화가 필요합니다.  
결론적으로, Jotai는 의존성 그래프 기반으로 파생 상태를 정확하게 추적하므로 계산 비용이 큰 로직에서 더 효율적입니다.

## useEffect로 서버 상태를 관리할 때 발생하는 문제

### 캐싱 문제
컴포넌트가 마운트될 때 API 요청을 수행하고, 언마운트 시 데이터가 사라집니다. 사용자가 다시 해당 컴포넌트를 보게 되면 이미 데이터를 잃어버린 상태이므로, API를 다시 호출해야 합니다. 이로 인해 불필요한 서버 요청과 UX 저하가 발생합니다.

### 중복 요청 문제
각 컴포넌트가 독립적으로 서버 상태를 관리하면 동일한 데이터를 요청할 때 중복 요청이 발생합니다. 예를 들어 로그인한 사용자 정보를 보여주기 위해 여러 컴포넌트가 각자의 useEffect에서 API를 호출하면 동시에 여러 번 요청이 발생할 수 있습니다.  
이를 해결하기 위해 TanStack Query와 같은 라이브러리는 deduplication 기능으로 한 번만 요청하도록 최적화합니다.

### 불일치 문제
동일한 데이터를 여러 컴포넌트의 useState에 저장하면, 한 컴포넌트에서 상태가 변경되어도 다른 컴포넌트의 상태는 이전 값을 유지하게 됩니다. 예를 들어 게시글 목록에서 좋아요를 눌렀지만 목록에는 반영되지 않는 상황이 발생할 수 있습니다. 이는 서버 상태와 로컬 상태 간의 동기화가 깨지면서 발생합니다.


