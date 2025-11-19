import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../App";
import { QUERY_KEY } from "../../constants/key";
import { updateMyInfo } from "../../apis/lp";
import type { ResponseMyInfoDto } from "../../types/auth";
import type { UpdateMyInfoDto } from "../../types/lp";

function useUpdateMyInfo(onSuccessCallback: () => void) {
  return useMutation({
    mutationFn: (payload: UpdateMyInfoDto) => updateMyInfo(payload),
    onMutate: async (newInfoPayload: UpdateMyInfoDto) => {
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEY.myInfo],
      });

      const previousInfo = queryClient.getQueryData<ResponseMyInfoDto>([
        QUERY_KEY.myInfo,
      ]);

      if (previousInfo) {
        queryClient.setQueryData<ResponseMyInfoDto>([QUERY_KEY.myInfo], {
          ...previousInfo,
          data: {
            ...previousInfo.data,
            ...newInfoPayload,
          },
        });
      }
      return { previousInfo };
    },

    onError: (err, variables, context) => {
      if (context?.previousInfo) {
        queryClient.setQueryData([QUERY_KEY.myInfo], context.previousInfo);
      }
    },

    onSuccess: () => {
      onSuccessCallback();
    },

    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.myInfo] });
    },
  });
}

export default useUpdateMyInfo;
