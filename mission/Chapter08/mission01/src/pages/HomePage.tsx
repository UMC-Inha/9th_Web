import { useEffect, useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorDisplay from "../components/ErrorDisplay";
import useGetInfiniteLpList from "../hooks/useGetInfiniteLpList";
import { useInView } from "react-intersection-observer";
import LpCard from "../components/LpCard/LpCard";
import LpCardSkeletonList from "../components/LpCard/LpCardSkeletonList";
import { useDebounce } from "../hooks/useDebounce";

const HomePage = () => {
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [search, setSearch] = useState("");
  const value = useDebounce(search, 500);

  const {
    data: lps,
    isFetching,
    hasNextPage,
    fetchNextPage,
    isLoading,
    isError,
  } = useGetInfiniteLpList(50, value, order);

  const { ref, inView } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [inView, isFetching, hasNextPage, fetchNextPage]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <ErrorDisplay />;
  }

  return (
    <div className="p-8">
      <div className="flex justify-end items-center mb-4 ">
        <div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-md mr-5"
          />
        </div>
        <button
          onClick={() => setOrder("asc")}
          className={`px-3 py-1 rounded-md text-sm font-semibold cursor-pointer transition-colors duration-200 ${
            order == "asc"
              ? `bg-gray-700 text-white`
              : `bg-gray-200 text-gray-700`
          }`}
        >
          오래된순
        </button>

        <button
          onClick={() => setOrder("desc")}
          className={`px-3 py-1 rounded-md text-sm font-semibold cursor-pointer transition-colors duration-200 ${
            order == "desc"
              ? `bg-gray-700 text-white`
              : `bg-gray-200 text-gray-700`
          }`}
        >
          최신순
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {lps?.pages
          ?.map((page) => page.data.data)
          ?.flat()
          ?.map((lp) => (
            <LpCard lp={lp} />
          ))}
        {isFetching && <LpCardSkeletonList count={20} />}
      </div>
      <div ref={ref}></div>
    </div>
  );
};

export default HomePage;
