import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../App";
import { QUERY_KEY } from "../../constants/key";
import { updateMyInfo } from "../../apis/lp";

function useUpdateMyInfo(onSuccessCallback: () => void) {
  return useMutation({
    mutationFn: updateMyInfo,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.myInfo], 
      });
      onSuccessCallback();
    }
  });
}

export default useUpdateMyInfo;