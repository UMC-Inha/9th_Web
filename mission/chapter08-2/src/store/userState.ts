// src/store/userState.ts
import { useQuery } from "@tanstack/react-query";

// 👇 메모리에 저장되는 Mock 유저 데이터
let mockUser = { name: "기본유저" };

// 🔥 유저 정보를 가져오는 훅
export const useUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 200));
      return mockUser;  // 항상 최신 mockUser 반환
    },
  });
};

// 🔥 닉네임 업데이트 API (Mock)
export const updateUserName = async (name: string) => {
  await new Promise((r) => setTimeout(r, 400));

  mockUser = { ...mockUser, name };  // mock DB 업데이트
  return mockUser;
};
