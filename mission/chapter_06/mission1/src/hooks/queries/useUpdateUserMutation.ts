import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUser, type UpdateUserRequest } from "../../apis/users";

export function useUpdateUserMutation(onClose: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateUserRequest) => updateUser(data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] }); // 🔥 내 정보 refetch
      alert("프로필이 수정되었습니다!");
      onClose();
    },

    onError: (err: any) => {
      console.log(err.response?.data ?? err);
      alert("수정 중 오류 발생!");
    },
  });
}
