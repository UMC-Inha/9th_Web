## `gcTime`

`gcTime`(Garbage Collection Time)은  
쿼리가 **더 이상 컴포넌트에서 사용되지 않는 시점(inactive)** 이후에도  
**캐시가 메모리에 유지되는 기간**을 의미합니다.

### 필요한 이유

#### 1) **재사용을 위한 캐시 유지**

- 유저는 페이지를 자주 이동함
  - ex) List → Detail → 다시 List
- inactive 시점에 바로 캐시를 삭제하면  
  화면 복귀 시 또다시 fetch가 필요 → UX 저하 + 네트워크 낭비
- `gcTime`은 비활성 캐시를 잠시 유지하여  
  **재방문 시 즉시 렌더링 + 필요한 경우 refetch 가능**

#### 2) **stale 여부와 독립**

- `staleTime`은 데이터 신선도
- `gcTime`은 데이터 **메모리 유지 기간**
- 데이터가 stale 이어도 `gcTime` 안에서는 캐시에 남아 있음
- `gcTime`이 지나면 stale 여부와 관계 없이 메모리에서 삭제됨

### 작동 흐름 요약

1. 데이터 fetch → 캐시 저장
2. 컴포넌트에서 쿼리 사용 → active
3. 언마운트 → inactive
4. `gcTime` 카운트 시작
5. `gcTime` 내 재사용 → 캐시 그대로 사용 (필요 시 refetch)
6. `gcTime` 이후 → 캐시 삭제

---

## `staleTime`

`staleTime`은 **데이터가 신선(fresh)하다고 간주되는 시간**입니다.

`staleTime` 동안에는 refetch가 발생하지 않습니다.  
데이터를 믿고 그대로 UI에 사용합니다.

### 쿼리 데이터의 상태

| 상태         | 설명                                                       |
| ------------ | ---------------------------------------------------------- |
| **Fresh**    | fetch 직후, `staleTime` 내 → 자동 refetch X                |
| **Stale**    | `staleTime` 지난 후 → 오래됐다고 간주, 상황에 따라 refetch |
| **Inactive** | 화면에서 사용되지 않음 → gcTime까지 메모리에 보관          |

### Fresh → Stale 전환 흐름

1. fetch 완료 → fresh
2. `staleTime` 시작
3. `staleTime` 경과 → stale
4. 아래 상황에서 refetch 가능
   - window focus
   - reconnect
   - 재마운트
   - refetch() 호출
5. `gcTime`까지 유지 → 이후 삭제

### 조정의 효과

- `staleTime` 짧음 → 최신성 ↑, 네트워크 비용 ↑
- `staleTime` 김 → 성능 ↑, 최신성 ↓

---

# 두 값을 어떻게 설정해야 “캐싱 전략에 유리”한가?

## 핵심 원칙

> **`staleTime < gcTime`**

- 만약 `gcTime < staleTime` 이라면  
  fresh 상태일 때 캐시가 삭제될 수 있음 →  
  → 재방문 시 refetch 발생 → 캐싱 전략 손해

- 반대로  
  `gcTime`이 더 길면
  - stale가 되어도 캐시 데이터를 즉시 보여줄 수 있음
  - refetch도 함께 진행 가능  
    → UX + 성능 모두 개선

---

## 상황별 전략

### 자주 변하는 데이터 (주식 시세, 채팅 등)

- `staleTime` → 매우 짧게
- `gcTime` → 최소한 화면 재방문 고려 수준  
  → 최신성 우선, 캐시는 빠르게 정리

### 잘 변하지 않는 데이터 (프로필, 설정)

- `staleTime` → 길게
- `gcTime` → `staleTime`보다 더 길게  
  → 네트워크 절약 + 빠른 재사용

### 목록 ↔ 상세 반복 이동 (List → Detail → List)

- `gcTime` → 길게 (캐시 오래 유지)
- `staleTime` → 상대적으로 짧아도 OK  
  → stale 상태라도 화면 복귀 시 빠르게 표시 + refetch

---

# 요약

| 개념        | 의미                                   | 적용 포인트         |
| ----------- | -------------------------------------- | ------------------- |
| `staleTime` | 데이터를 fresh → stale로 전환하는 시간 | 최신성/자동 refetch |
| `gcTime`    | inactive 캐시 삭제까지의 시간          | 메모리 유지/재사용  |

> `staleTime` < `gcTime`

- **staleTime** → 신선도(automatical refetch 기준 시간)
- **gcTime** → 캐시 생명주기(메모리 유지 시간)

> 상황에 맞게 조절하되, staleTime 보다 gcTime을 길게 유지하면 성능과 UX 모두에 유리합니다.
