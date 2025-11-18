// src/pages/MyPage.tsx

import { useState } from "react";
import { useUser } from "../store/userState";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserName } from "../store/userState"; // mock API 가져오기

export default function MyPage() {
  const { data: user } = useUser();
  const queryClient = useQueryClient();

  const [newName, setNewName] = useState("");

  const nicknameMutation = useMutation({
    mutationFn: updateUserName, // mockUser 업데이트 API

    // 🔥 즉시 UI 업데이트되는 낙관적 업데이트
    onMutate: async (newName) => {
      await queryClient.cancelQueries({ queryKey: ["user"] });

      const previous = queryClient.getQueryData(["user"]); // 이전값 저장

      // 즉시 닉네임 변경 반영
      queryClient.setQueryData(["user"], (old: any) => ({
        ...old,
        name: newName,
      }));

      return { previous };
    },

    // 실패 시 롤백
    onError: (_err, _newName, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["user"], context.previous);
      }
      alert("닉네임 변경 실패! 원래 이름으로 되돌립니다.");
    },

    // 성공/실패 상관없이 최종 동기화
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  return (
    <div style={{ padding: 40, color: "#fff" }}>
      <h2>마이페이지</h2>

      <p style={{ marginTop: 20, fontSize: "18px" }}>
        현재 닉네임: <strong>{user?.name}</strong>
      </p>

      <div style={{ marginTop: 20 }}>
        <input
          style={{
            padding: "10px",
            width: "200px",
            borderRadius: "6px",
            border: "1px solid #444",
            background: "#222",
            color: "#fff",
          }}
          placeholder="새 닉네임 입력"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />

        <button
          onClick={() => nicknameMutation.mutate(newName)}
          style={{
            marginLeft: 10,
            padding: "10px 16px",
            background: "#ff1493",
            border: "none",
            borderRadius: "6px",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          변경하기
        </button>
      </div>
    </div>
  );
}
