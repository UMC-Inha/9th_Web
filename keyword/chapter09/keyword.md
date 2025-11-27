- **`Redux Toolkit`** 사용법을 공식문서를 보며 직접 정리해보기 🍠
    
    [Getting Started | Redux Toolkit](https://redux-toolkit.js.org/introduction/getting-started)
    
    - Provider
        
        **`Provider` (스토어 제공)**
        
        React 컴포넌트 트리에 Redux 스토어를 제공하여, 하위 컴포넌트들이 스토어에 접근할 수 있도록 합니다.
        
        - 역할 : react-redux 라이브러리의 컴포넌트로, **애플리케이션의 최상위 컴포넌트를 감싸서 스토어를 연결**합니다.
        - 사용 예시
            
            ```tsx
            import React from 'react';
            import ReactDOM from 'react-dom/client';
            import { Provider } from 'react-redux';
            import App from './App';
            import { store } from './app/store';
            
            const root = ReactDOM.createRoot(document.getElementById('root'));
            
            root.render(
            	<Provider store={store}>
            		<App />
            	</Provider>
            )
            ```
            
    - configureStore
        
        **`configureStore` (스토어 생성)**
        
        Redux 애플리케이션의 단일 소스 역할을 하는 스토어를 생성합니다.
        
        - 역할 : 기존 Redux 의 `createStore` 보다 훨씬 더 간단하게 스토어를 설정할 수 있습니다.
        - 주요 기능 :
            - **DevTools Extension 을 자동으로 활성화**합니다.
            - **`redux-thunk` 와 같은 일반적인 미들웨어를 기본적으로 추가**합니다.
            - 하나의 루트 reducer 를 구성하기 위해 전달된 **슬라이스 reducer 객체를 자동으로 `combineReducers` 로 래핑**합니다.
        - 사용 예시 :
            
            ```tsx
            import { configureStore } from '@reduxjs/toolkit';
            import counterReducer from '../features/counter/counterSlice';
            
            // 슬라이스 리듀서들을 객체 형태로 전달하면
            // configureStore 가 자동으로 combineReducers 를 호출합니다.
            export const store = configureStore({
            	reducer : {
            		counter : counterReducer,
            		// otherFeature : otherFeatureReducer
            	}
            })
            ```
            
    - createSlice
        
        **`createSlice` (슬라이스 생성)**
        
        Redux 상태의 일부 (slice) 를 정의합니다. 
        
        Redux 의 세 가지 핵심 요소인 **액션 타입**, **액션 생성자**, **리듀서**를 한 번에 생성해주는 핵심 API 입니다.
        
        - 역할 : boilerplate code (상용구 코드) 를 줄이고, Redux 로직 작성을 간소화합니다.
            
            특히, **Immer 라이브러리가 내장**되어 있어 reducer 에서 **불변성을 신경 쓰지 않고 상태를 mutate 시키는 것처럼 보이는 코드를 작성**할 수 있습니다.
            
        - 주요 옵션 :
            - `name` : **슬라이스를 식별하는 문자열** (액션 타입의 접두사로 사용)
            - `initialState` : **슬라이스의 초기 상태값**
            - `reducers` : **상태를 업데이트 하는 함수들의 객체** (여기에 작성된 **함수들은 자동으로 액션 생성자**가 됨)
        - 사용 예시 :
            
            ```tsx
            import { createSlice } from '@reduxjs/toolkit';
            
            export const counterSlice = createSlice({
            	name : 'counter', // 액션 타입 : 'counter/increment'
            	initialState : { value : 0 },
            	reducers : {
            		increment : (state) => {
            			// Immer 라이브러리 덕분에 상태를 직접 변경하는 것처럼 보이나,
            			// 실제로는 새로운 상태가 불변하게 생성되는 것
            			state.value += 1;
            		}
            		
            		decrement : (state) => {
            			state.value -= 1;
            		}
            		
            		incrementByAmount : (state, action) => {
            			// action.payload 를 사용하여 데이터에 접근한다
            			state.value += action.payload;
            		}
            	}
            })
            
            // 액션 생성자를 내보냅니다.
            export const { increment, decrement, incrementByAmount } = counterSlice.actions;
            
            // 리듀서 함수를 configureStore 에서 사용하기 위해 내보냅니다.
            export default counterSlice.reducer;
            ```
            
    - useSelector
        
        **`useSelector` (상태 조회)**
        
        Redux 스토어에서 상태의 일부를 추출하는 데 사용됩니다.
        
        - 역할 : 컴포넌트가 **스토어의 특정 데이터에 접근**하고, 해당 **데이터가 변경될 때 컴포넌트가 자동으로 리렌더링** 되도록 구독합니다.
        - 사용 예시 :
            
            ```tsx
            import React from 'react';
            import { useSelector } from 'react-redux';
            
            function CounterDisplay() {
            	// 스토어의 'counter' 슬라이스에서 'value' 상태를 가져옵니다.
            	const count = useSelector((state) => state.counter.value);
            	
            	return (
            		<div> 카운트 : {counst} </div>
            	)
            }
            ```
            
    - useDispatch
        
        **`useDispatch` (액션 전달)**
        
        액션을 Redux 스토어로 보낼 수 있는 dispatch 함수에 대한 참조를 반환합니다.
        
        - 역할 : 컴포넌트에서 **상태 변경을 요청하는 액션을 스토어에 전달**합니다.
        - 사용 예시 :
            
            ```tsx
            function CounterControls() {
            	const dispatch = useDispatch();
            	
            	return (
            		<div>
            			<button onClick={() => dispatch(increment())}> 증가 </button>
            			<button onClick={() => dispatch(decrement())}> 감소 </button>
            		</div>
            	)
            }
            ```
            
    - 기타 **`Redux Toolkit`** 사용 방법을 상세하게 정리해 보세요
        
        **`createAsyncThunk` (비동기 로직 처리)**
        
        **비동기 로직** (API 호출 등) 을 처리하기 위해 표준 Redux 에서 **Thunk** 를 사용합니다. `createAsyncThunk` 는 이 Thunk 를 쉽게 정의할 수 있도록 도와줍니다.
        
        - 역할 : 비동기 요청의 시작, 성공, 실패에 대한 액션 타입을 자동으로 생성하고 이들에 대한 리듀서 로직을 `createSlice` 의 `extraReducers` 에서 쉽게 처리하도록 합니다.
        - 사용 예시
            
            ```tsx
            import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
            
            // 비동기 Thunk 생성
            export const fetchUserById = createAsyncThunk(
            	'user/fetchUserById' // 액션 타입 접두사 user 사용
            	
            	async (userID, thunkAPI) => {
            		const response = await fetch(`/api/users/${userId}`);
            		
            		const data = await response.json();
            		
            		return data;
            	}
            )
            
            // createSlice 에서 extraReducers 로 처리
            const userSlice = createSlice({
            	name : 'users',
            	initialState : { entities : {}, loading : 'idle' },
            	reducers : { 동기 리듀서 },
            	extraReducers : (builder) => {
            		builder
            		.addCase(fetchUserById.pending, (state, action) => {
            			state.loading = 'pending';
            		})
            		.addCase(fetchUserById.fulfilled, (state, action) => {
            			state.loading = 'idle';
            			state.entities[action.payload.id] = action.payload;
            		})
            		.addCase(fetchUserById.rejected, (state, action) => {
            			state.loading = 'failed',
            		})
            	}
            })
            
            ```
            
        - 사용 예시 (컴포넌트)
            
            ```tsx
            // 컴포넌트에서 호출
            dispatch(fetchById(123));
            ```

- **Zustand** 🍠
    
    # **Zustand** 🍠
    
    ---
    
    <aside>
    💡
    
    **Zustand** 또한 처음 접하실 때 다소 복잡하게 느껴질 수 있습니다. 하지만 이번 챕터에서는 제가 위에서 **Redux**와 **Redux Toolkit**에 대해 정리해 드린 것 처럼 여러분이 **스스로 탐색하고 정리하는 학습 습관을 기르는 것**을 목표로 하기 때문에, 기본 개념 설명은 따로 제공하지 않았습니다.
    
    대신, 아래의 권장 학습 방법을 따라가며 주도적인 학습 경험을 만들어 보세요.
    
    ---
    
    ### 1. 제공된 개념 설명 먼저 정독하기
    
    - 이번 챕터에 포함된 **Zustand 관련 개념 설명**을 먼저 차분히 읽어보며 전체적인 구조와 흐름을 잡아주세요.
    - 이해가 잘 되지 않는 부분은 표시해 두었다가, 공식 문서나 추가 자료 조사로 보완해 보시길 추천합니다.
    
    ### 2. 공식 문서 및 자료 추가 탐색
    
    - **Zustand** 공식 문서와 신뢰할 수 있는 블로그 글을 참고해 보세요.
    - 특히 다음 관점을 중심으로 학습하면 도움이 됩니다:
        - 제공된 개념 설명과 공식 문서의 내용이 어떻게 연결되는지
        - 예시 코드가 어떤 의도와 패턴을 기반으로 작성되었는지
    - 다른 상태관리 라이브러리(Redux Toolkit 등)와 비교해 보는 것도 이해에 도움이 됩니다.
    
    ### 3. 워크북 작성 원칙 (중요!)
    
    - 워크북의 각 토글을 하나씩 펼쳐 보면서
        
        **제공된 개념 설명 + 직접 찾아본 내용**을 기반으로 정리해 주세요.
        
    - ⚠️ **절대 복사/붙여넣기를 하지 마세요!** ⚠️
        
        직접 이해하고 자신의 문장으로 정리하는 과정이 학습 효과를 극대화합니다.
        
    
    ### 4. 영상 활용
    
    - 학습이 막막하게 느껴진다거나 다양한 내용을 알고 싶다면 아래 제공된 설명 영상을 참고해 주세요.
    - 영상의 실습 흐름에 맞춰 따라 하면서,
        - 개념 설명에서 읽은 내용
        - 공식 문서에서 확인한 API 및 패턴
            
            이 실제 코드에서 어떻게 적용되는지 연결해 보시면 훨씬 깊은 이해를 얻을 수 있습니다.
            
    
    ---
    
    앞으로의 개발 과정에서는 **필요한 지식을 스스로 탐색하고, 정리하고, 기록하는 능력**이 매우 중요해집니다.
    
    이번 미션을 통해 이러한 능력을 더욱 단단하게 쌓아 가시길 응원합니다! 🚀
    
    </aside>
    
    ### 🎥 강의 영상
    
    https://youtu.be/NOdAIlFreOI?si=958aros8pbEXNVsJ
    
    <aside>
    🍠
    
    위의 영상을 보고 **Zustand**에 대해 정리해주세요!
    
    또한 아래 공식문서 또한 읽어보시면서 부족한 내용을 보충해서 정리해주세요!
    
    </aside>
    
    ### 📚 공식 문서
    
    [Zustand](https://zustand-demo.pmnd.rs/)
    
    - **Zustand**란 무엇인가요? 🍠
        
        # **Zustand**란 무엇인가요?
        
        ---
        
        **Zustand** 는 React 생태계에서 **매우 작고 빠르며 확장 가능한 상태 관리 라이브러리**입니다. 독일어로 ‘상태’ 를 의미하는 이름처럼, React 의 **Context API 와 유사**하지만, 더 효율적이고 간단한 방법으로 전역 상태를 관리할 수 있도록 설계되었습니다.
        
        - 특징 :
            - **Hook 기반** : 스토어를 생성하고 컴포넌트에서 상태를 구독하는 방식이 React Hook 을 사용하는 것처럼 직관적입니다.
            - **간결성** : 최소한의 API 를 제공하여 배우고 사용하기가 매우 쉽습니다.
            - **렌더링 최적화** : 컴포넌트가 실제 사용하는 상태가 변경되었을 때만 렌더링되도록 최적화되어 있습니다.
    - 왜 **Zustand**를 사용할까요? 🍠
        
        # 왜 Zustand를 사용할까요?
        
        ---
        
        Zustand 를 사용하는 주요 이유는 복잡성과 성능 문제를 동시에 해결하기 위함입니다.
        
        1. **쉬운 학습 곡선 및 최소한의 상용구 코드 (Boilerplate)** :
            - Redux 와 같은 다른 라이브러리에 비해 설정이 간단하고, 액션 타입, 디스패치 등의 복잡한 개념이 적습니다.
            - 스토어 정의에 필요한 코드가 매우 짧습니다.
        2. **자동 렌더링 최적화** :
            - React Context API Context 값이 조금이라도 바뀌면 해당 Context 를 사용하는 모든 컴포넌트가 리렌더링 되는 경향이 있습니다.
            - Zustand 는 선택적 구독을 통해서 컴포넌트가 스토어의 특정 부분만 구독하게 하여 불필요한 리렌더링을 방지합니다.
        3. **React 외부에서도 사용 가능** :
            - React 컴포넌트 내부 뿐만 아니라, 일반 JS 함수나 비동기 로직에서도 스토어에 접근하고 상태를 업데이트 할 수 있습니다.
    - **Zustand** 기본 사용법 🍠
        
        # **Zustand** 기본 사용법
        
        ---
        
        ### 1) Store 만들기
        
        - `create` 함수를 사용하여 스토어를 정의합니다.
        
        ```tsx
        import { create } from 'zustand';
        
        // set : 상태를 변경하는 함수
        // get : 현재 상태를 가져오는 함수 (주로 비동기 로직에서 사용) 
        export const useCounterStore = create((set) => {
        	// 초기 상태 정의
        	count : 0,
        	
        	// 상태를 변경하는 함수 정의 (액션)
        	increment : () => set((state) => ({ count : state.count + 1 })),
        	decrement : () => set((state) => ({ count : state.count - 1 })),
        	
        	// payload 를 받는 액션
        	increaseByAmount : (amount) => set((state) => ({ count : state.count + amount }))
        })
        ```
        
        ### 2) 컴포넌트에서 사용하기
        
        - 생성한 스토어 Hook 을 컴포넌트 내부에서 호출하여 상태와 액션 함수를 가져와서 사용합니다.
        
        ```tsx
        import React from 'react';
        import { useCounterStore } from '../store/counterStore';
        
        function Counter() {
        	// 상태와 액션을 구조 분해 할당으로 가져옵니다.
        	const count = useCounterStore((state) => state.count);
        	const increment = useCounterStore((state) => state.increment);
        	const increaseByAmount = useCounterStore((state) => state.increaseByAmount);
        	
        	return (
        		<div>
        			<h1> Count : {count} </div>
        			<button onClick={increment}> 증가 </button>
        			<button onClick={() => increaseByAmount(5)}> + 5 </button>
        		</div>
        	)
        }
        ```
        
    - **Zustand**에서 중요한 개념 🍠
        
        # **Zustand**에서 중요한 개념
        
        ---
        
        ### 1) set 함수
        
        스토어 내부에서 상태를 업데이트 할 때 사용하는 핵심 함수입니다.
        
        - 사용법 : `set(newStateOrUpdater)`
        - 기능 : `set` 함수에 이전 상태 (`state`) 를 인수로 받는 콜백 함수를 전달하여, 새 상태 객체를 반환하는 것이 가장 일반적이고 권장되는 패턴입니다.
            
            ```tsx
            set((state) => ({ count : state.count + 1 }));
            ```
            
        - 참고 : `set` 함수는 **자동으로 깊은 병합 (shallow merge) 을 수행**합니다. 즉, 업데이트 하려는 속성만 반환하면 나머지 상태는 그대로 유지됩니다.
        
        ### 2) get 함수
        
        현재 스토어의 상태를 읽을 때 사용됩니다. 주로 액션 함수 내부에서 현재 상태 값을 기반으로 복잡한 로직을 수행할 때 유용합니다.
        
        - 사용 예시
            
            ```tsx
            export const useStore = create((set, get) => ({
            	// 초기 상태
            	
            	logCount : () => {
            		const currentCount = get().count; // get() 을 통해 현재 count 값에 접근
            		
            		console.log("현재 카운트 : ", currentCount);
            	}
            }))
            ```
            
        
        ### 3) 선택적 구독 (selector)
        
        Zustand 의 렌더링 최적화의 핵심입니다. 컴포넌트에서 `useStore` 를 호출할 때 전달하는 콜백 함수를 셀렉터라고 합니다.
        
        - 역할 : 셀렉터가 반환하는 값이 이전 값과 다를 때에만 해당 컴포넌트를 리렌더링 합니다.
            
            ```tsx
            // 추천 : count 값만 구독하여 count 가 변경될 때만 리렌더링
            const count = useCounterStore((state) => state.count);
            
            // 비추천 : 스토어의 모든 상태를 구독하여 스토어의 어떤 값이든 변경되면 리렌더링
            const entireState : useCounterStore((state) => state);
            ```
            
        
    - **Zustand** 객체 상태 관리 예시 🍠
        
        # **Zustand** 객체 상태 관리 예시
        
        ---
        
        객체 내부의 특정 속성만 업데이트 하는 경우에도 set 의 깊은 병합 기능을 활용할 수 있습니다.
        
        ```tsx
        export const useUserStore = create((set) => ({
          user: {
            id: 1,
            name: 'chichi',
            email: 'chichi@example.com',
          },
        
          // 객체 내부의 속성을 업데이트
          updateName: (newName) =>
            set((state) => ({
              user: {
                ...state.user, // 나머지 속성들은 불변하게 복사
                name: newName, // 원하는 속성만 변경
              },
            })),
        }));
        ```
        
    - **Zustand** 비동기 로직 예시 🍠
        
        # **Zustand** 비동기 로직 예시
        
        ---
        
        **Zustand**에서는 비동기 API 호출도 간단하게 store 안에서 사용할 수 있어요. 
        
        `set` 함수를 사용하여 로딩 상태를 업데이트 하고, 비동기 작업이 완료된 후 데이터 상태를 업데이트 합니다.
        
        ```tsx
        export const useApiStore = create((set) => ({
        	posts : [],
        	loading : false,
        	
        	fetchPosts : async () => {
        		set({ loading : true }); // 로딩 시작
        		
        		try {
        			const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        			const data = await response.json();
        			
        			set({
        				posts : data.slice(0, 5), // 상위 5개만 저장
        				loading : false,
        			}); // 데이터 저장 및 로딩 완료
        		}
        		
        		catch (error) {
        			console.log("에러 : ", error);
        			
        			set({ loading : true }); // 에러 발생 시 로딩 완료
        		}
        	}
        }))
        ```
        
    - **Zustand** + Persist 미들웨어 🍠
        
        # **Zustand** + Persist 미들웨어
        
        ---
        
        **Zustand**는 미들웨어를 활용해 로컬스토리지 등에 상태를 저장할 수 있어요.
        
        `persist` 미들웨어는 공식적으로 제공되며, 상태를 브라우저 저장소(localStorage, sessionStorage 등) 에 유지합니다.
        
        ```tsx
        import { create } from 'zustand';
        import { persist } from 'zustand/middleware'; // 미들웨어 불러오기
        
        export const usePersistStore = create(
          persist(
            (set) => ({
              isDarkMode: false,
              toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
            }),
            
            {
              name: 'global-storage', // localStorage에 저장될 키 이름
              // getStorage: () => sessionStorage
              // 세션 스토리지 사용
            }
          )
        );
        ```
        
    - **Zustand** + Immer 함께 쓰기 🍠
        
        # **Zustand** + Immer 함께 쓰기
        
        ---
        
        불변성 관리를 쉽게 하고 싶다면 Immer 미들웨어도 사용 가능해요.
        
        특히 객체나 배열 상태를 복잡하게 업데이트 할 때 유용하며, `redux-toolkit` 에서 사용하는 것과 같은 mutate 하는 것처럼 보이는 코드를 작성할 수 있게 해준다.
        
        ```tsx
        import { create } from 'zustand';
        import { immer } from 'zustand/middleware/immer'; // immer 미들웨어
        
        export const useImmerStore = create(
        	immer((set) => ({
        		userProfile : { name : 'chichi', age : 22, skills : ['JS', 'React']},
        		addSkill : (newSkill) => {
        			set((state) => {
        				// 불변성 걱정 없이 state 객체를 직접 수정
        				state.userProfile.skills.push(newSkill);
        			}),
        		}
        		incrementAge : () => {
        			set((state) => {
        				state.userProfile.age += 1;
        			})
        		}
        	}))
        )
        ```
        
    - **Zustand** vs Context API 🍠
        
        # **Zustand** vs Context API
        
        ---
        
        | 특징 | Zustand | React Context API |
        | --- | --- | --- |
        | 상태 업데이트 | `set` 함수 사용, 스토어 정의 내부에서 관리 | `useReducer`, `useState` 와 함께 사용 |
        | 렌더링 최적화 | 선택적 구독을 통해 강력하게 최적화 | Context 값 변경 시 전체 구독 컴포넌트 리렌더링 (메모이제이션 필요) |
        | 코드 복잡성 | 매우 간단하고 최소한의 상용구 코드 | Provider/Consumer, Reducer/Dispatch 등 구조적 설정 필요 |
        | 비동기 처리 | 스토어 내부에서 `async / await` 직접 사용 | 일반적으로 Context 외부 처리 또는 복잡한 커스텀 훅 필요 |
        | 결론 | 복잡한 전역 상태 관리 적합, 성능 최적화 | 테마나 언어처럼 빈번하게 바뀌지 않는 상태나 컴포넌트 트리 하위로만 전달할 상태에 적합 |
- **React 전역 상태 관리 완벽 가이드 블로그** 읽고 개념 정리하기 🍠
    
    # **React 전역 상태 관리 완벽 가이드 블로그** 읽고 개념 정리하기  **🍠**
    
    ---
    
    [개발자 매튜 | React 전역 상태 관리 완벽 가이드: Context API vs Zustand vs Jotai](https://www.yolog.co.kr/post/global-state/)
    
    - **`Context API`**의 **`value 전체 구독 메커니즘`**과 **`Zustand`**의 **`selector 기반 구독`**의 성능 차이를 설명해보세요.
        
        Context API 는 선택적 구독 불가능이라는 한계가 있다. React 의 Context 는 **값 전체를 하나의 단위로 취급**한다. `value` 객체의 참조가 바뀌면 그 안의 어떤 속성이 바뀌었는지 상관 없이 모든 Consumer 가 재평가된다.
        
        반면 Zustand 방식은 하나의 큰 `store` 객체 안에서 모든 상태와 액션을 관리하고 파생 상태는 주로 컴포넌트 내부에서 `useSelector` 를 사용해 계산하거나, 스토어 내부의 `get` 함수를 통해 계산합니다.
        
    - **`Jotai`**의 **`atom`** 조합 방식이 파생 상태 관리에서 Zustand 대비 갖는 장점을 의존성 추적 관점에서 설명해보세요.
        - 파생 상태가 간단하다 (atom을 조합)
        - 필요한 것만 import 해서 사용
        - React Suspense 와 완벽 통합
    - 서버 상태를 **`useEffect`**로 관리할 때 발생하는 캐싱/중복 요청/불일치 문제를 설명해보세요.
        
        클라이언트 상태 관리 라이브러리 (Zustand, Redux 등) 과 달리, 서버 상태 (Server State) 는 데이터 **불일치(Stale), 캐싱, 중복 요청** 등의 고유한 문제를 가집니다. 
        
        React의 **`useEffect`** Hook만을 사용하여 서버 상태를 관리할 때 이 문제들이 두드러집니다.