import {useMutation,useQueryClient} from "@tanstack/react-query";
import {createLp} from "../apis/lp";
import type {CreateLpPayload} from "../types/auth";
import { QUERY_KEY } from "../constans/key";

export default function useCreateLp(){
    const queryClient=useQueryClient();
    return useMutation({
        mutationFn:(payload:CreateLpPayload)=>createLp(payload),
        onSuccess:()=>{
            queryClient.invalidateQueries({queryKey:[QUERY_KEY.lps]});
        }
    })
};

