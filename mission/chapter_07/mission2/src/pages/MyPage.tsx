import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useUpdateUserMutation } from "../hooks/queries/useUpdateUserMutation.js";
import { axiosInstance } from "../apis/axios.js";

export default function MyPage() {
  const [isEdit, setIsEdit] = useState(false);

  const { data: me, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await axiosInstance.get("/v1/users/me");
      return res.data.data;
    },
  });

  // ⭐ 로딩 처리 추가
  if (isLoading)
    return <div className="p-10 text-white">⏳ 불러오는 중...</div>;
  if (!me) return <div className="p-10 text-red-500">❌ 사용자 정보 없음</div>;

  const [name, setName] = useState(me.name ?? "");
  const [bio, setBio] = useState(me.bio ?? "");
  const [avatar, setAvatar] = useState<File | null>(null);

  const { mutateAsync: updateUser } = useUpdateUserMutation(() =>
    setIsEdit(false)
  );

  const handleSave = async () => {
    await updateUser({ name, bio, avatar });
  };

  return (
    <div className="p-10  space-y-6">
      {/* 프로필 사진 */}
      <img
        src={me.avatar ?? "/default.png"}
        className="w-32 h-32 rounded-full bg-gray-700"
      />

      {!isEdit ? (
        <>
          <h2 className="text-2xl font-bold">{me.name}</h2>
          <p className="text-gray-300">{me.bio ?? "소개글 없음"}</p>
          <p className="text-gray-400 text-sm">{me.email}</p>

          <button
            className="mt-2 px-4 py-2 bg-pink-600 text-white rounded cursor-pointer"
            onClick={() => setIsEdit(true)}
          >
            수정하기
          </button>
        </>
      ) : (
        <>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="이름"
            className="w-full text-white px-3 py-2 rounded bg-black border"
          />

          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="소개글"
            className="w-full px-3 py-2 text-white rounded bg-black border"
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setAvatar(e.target.files?.[0] ?? null)}
          />

          <div className="flex gap-2">
            <button
              className="px-4 py-2 bg-gray-600 rounded"
              onClick={() => setIsEdit(false)}
            >
              취소
            </button>

            <button
              className="px-4 py-2 bg-pink-600 rounded"
              onClick={handleSave}
            >
              저장
            </button>
          </div>
        </>
      )}
    </div>
  );
}
