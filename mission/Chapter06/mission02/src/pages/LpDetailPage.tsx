import { useParams } from "react-router-dom";
import useGetLpDetail from "../hooks/useGetLpDetail";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorDisplay from "../components/ErrorDisplay";
import LpCommentSection from "../components/LpCommentSection";

const LpDetailPage = () => {
  const { lpid } = useParams<{ lpid: string }>();
  const { data, isLoading, isError } = useGetLpDetail(lpid);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError || !lpid) {
    return <ErrorDisplay />;
  }

  const lp = data?.data;

  return (
    <div className="p-8 max-w-3xl mx-auto text-gray-300">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <img
            src={lp.author.avatar}
            alt="작성자 아바타"
            className="w-8 h-8 rounded-full"
          />
          <span className="font-semibold text-white">{lp.author.name}</span>
        </div>
        <div className="flex items-center gap-4 text-gray-400">
          <button className="hover:text-white text-black cursor-pointer">
            수정
          </button>
          <button className="hover:text-white text-black cursor-pointer">
            삭제
          </button>
        </div>
      </div>

      <h1 className="text-4xl font-bold mb-6 text-white">{lp.title}</h1>

      <img
        src={lp.thumbnail}
        alt="lp 썸네일"
        className="w-full rounded-lg mb-6 bg-gray-900 p-4 size-100 object-cover"
      />

      <div className="flex justify-center items-center gap-2">
        <button className="text-pink-500 text-3xl transition-transform hover:scale-125">
          ❤️
        </button>
        <span className="text-xl font-semibold text-white">
          {lp.likes.length}
        </span>
      </div>

      <LpCommentSection lpid={lpid} />
    </div>
  );
};

export default LpDetailPage;
