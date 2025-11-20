// 수정된 코드 - 낙관적 업데이트 적용
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../apis/axios";

export function useUpdateUserMutation(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, bio, avatar }: any) => {
      const formData = new FormData();
      if (name) formData.append("name", name);
      if (bio) formData.append("bio", bio);
      if (avatar) formData.append("avatar", avatar);

      const res = await axiosInstance.patch("/v1/users/me", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.data;
    },

    // 💡 Optimistic Update 핵심
    onMutate: async (newUserData) => {
      await queryClient.cancelQueries({ queryKey: ["me"] });

      const previousMe = queryClient.getQueryData(["me"]);

      // UI에서 즉시 반영
      queryClient.setQueryData(["me"], (old: any) => ({
        ...old,
        ...newUserData,
        avatar: newUserData.avatar
          ? URL.createObjectURL(newUserData.avatar)
          : old.avatar,
      }));

      return { previousMe };
    },

    onError: (_error, _data, context) => {
      if (context?.previousMe) {
        // 실패 시 롤백
        queryClient.setQueryData(["me"], context.previousMe);
      }
      alert("업데이트 실패 😢 되돌립니다.");
    },

    onSuccess: () => {
      // 최신 데이터로 갱신
      queryClient.invalidateQueries({ queryKey: ["me"] });
      onSuccess?.();
    },
  });
}
