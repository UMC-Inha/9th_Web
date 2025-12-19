import type { AxiosRequestConfig } from "axios";
import { axiosClient } from "./axiosClient";
import type { MovieResponse } from "../types/movie";

export type SearchMoviesParams = {
  query: string;
  include_adult: boolean;
  language: "ko-KR" | "en-US" | "ja-JP";
};

export async function searchMovies(params: SearchMoviesParams, config?: AxiosRequestConfig) {
  const res = await axiosClient.get<MovieResponse>("/search/movie", {
    params,
    ...config,
  });
  return res.data;
}
