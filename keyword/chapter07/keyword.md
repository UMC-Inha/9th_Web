# useMutation

## useMutation은 무엇인가요?

useMutation은 React Query (또는 최신 버전인 TanStack Query)에서 제공하는 비동기 데이터 변경(쓰기) 작업을 다루기 위한 훅(Hook)입니다.
즉, 데이터를 가져오는(get) useQuery와 달리, useMutation은 데이터를 변경(post, put, patch, delete) 하는 작업을 처리합니다.
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

function useCreatePost() {
return useMutation({
mutationFn: async (newPost) => {
const response = await axios.post('/api/posts', newPost);
return response.data;
},
onSuccess: (data) => {
console.log('✅ 성공:', data);
},
onError: (error) => {
console.error('❌ 에러:', error);
},
});
}

와 같이 사용됩니다.
| 개념 | 역할 |
| --------------------- | ----------------------------------- |
| `useQuery` | 서버 데이터 **조회 (GET)** |
| `useMutation` | 서버 데이터 **변경 (POST, PUT, DELETE 등)** |
| `invalidateQueries()` | 변경 후 캐시 데이터 **갱신** 요청 |

## useMutation의 핵심 옵션

| 옵션명       | 실행 시점    | 주요 역할                        |
| ------------ | ------------ | -------------------------------- |
| `mutationFn` | 요청 실행 시 | 실제 서버 요청 로직              |
| `onMutate`   | 요청 시작 전 | Optimistic Update 준비           |
| `onSuccess`  | 요청 성공 시 | 성공 후 로직, 캐시 갱신          |
| `onError`    | 요청 실패 시 | 에러 처리 및 롤백                |
| `onSettled`  | 요청 완료 시 | 공통 후처리 (성공/실패 관계없음) |
| `retry`      | 요청 실패 후 | 재시도 횟수 제어                 |

# 낙관적 업데이트(OptimisticUpdate)

## 낙관적 업데이트(OptimisticUpdate)는 무엇인가요?

서버의 응답을 기다리지 않고, 요청이 성공할 것이라고 “낙관적으로 가정”하고 UI를 즉시 업데이트하는 전략입니다.즉, 사용자가 어떤 데이터를 수정하거나 삭제했을 때 서버에서 응답을 받을 때까지 기다리지 않고UI를 바로 바꿔버리는 것입니다.

## Tanstack Query에서 낙관적 업데이트(OptimisticUpdate) 구현하기

React Query(TanStack Query)에서는 useMutation의 onMutate, onError, onSettled 콜백을 이용해 쉽게 구현할 수 있습니다.
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

function useLikePost() {
const queryClient = useQueryClient();

return useMutation({
mutationFn: (postId) => axios.post(`/api/posts/${postId}/like`),

    // 🟢 1. 요청 시작 직전 (UI를 낙관적으로 먼저 업데이트)
    onMutate: async (postId) => {
      // 1️⃣ 현재 데이터 스냅샷 저장
      await queryClient.cancelQueries(['posts']);
      const previousPosts = queryClient.getQueryData(['posts']);

      // 2️⃣ 낙관적 업데이트 적용
      queryClient.setQueryData(['posts'], (old) =>
        old.map((post) =>
          post.id === postId
            ? { ...post, likes: post.likes + 1 } // 임시로 +1
            : post
        )
      );

      // 3️⃣ 롤백용 이전 상태 반환
      return { previousPosts };
    },

    // 🔴 2. 요청 실패 시 → 롤백
    onError: (error, postId, context) => {
      queryClient.setQueryData(['posts'], context.previousPosts);
      alert('좋아요 반영 실패 😢');
    },

    // 🟡 3. 요청 성공 또는 실패 후 → 캐시 재검증
    onSettled: () => {
      queryClient.invalidateQueries(['posts']);
    },

});
}
1️ 사용자가 “좋아요” 클릭
2️ onMutate → UI 즉시 업데이트 (좋아요 +1)
3️ 서버에 요청 전송
4️ 서버 응답 성공 → 그대로 유지
5️ 서버 응답 실패 → 롤백 (좋아요 원상복구)

## 어떤 상황에서 낙관적 업데이트(OptimisticUpdate)가 효율적일까요?

서버 응답이 느리거나, 사용자 액션이 잦은 경우에 특히 효율적입니다.
| 상황 | 낙관적 업데이트 적용 효과 |
| --------------------- | ------------------------ |
| 좋아요 / 북마크 / 팔로우 버튼 | 클릭 즉시 UI 반응으로 UX 개선 |
| 삭제 버튼 (리스트에서 제거) | 빠른 피드백으로 지연 감지 방지 |
| 댓글 작성 / 수정 | 입력 후 즉시 표시, 성공 시 동기화 |
| 채팅 메시지 전송 | 전송 후 바로 화면에 표시 (실패 시 취소) |
