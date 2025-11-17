import { useState } from "react";
import { useCreateLpMutation } from "../hooks/queries/useCreateLpMutation.js";

interface Props {
  onClose: () => void;
}

export default function LpWriteModal({ onClose }: Props) {
  const { mutateAsync: createLp } = useCreateLpMutation(onClose);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);

  /** 🔥 태그 상태 */
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  /** ⬆ 태그 추가 */
  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    if (tags.includes(tagInput)) return alert("이미 추가된 태그입니다!");
    setTags((prev) => [...prev, tagInput.trim()]);
    setTagInput("");
  };

  /** ❌ 태그 삭제 */
  const removeTag = (name: string) => {
    setTags((prev) => prev.filter((t) => t !== name));
  };

  async function handleSubmit() {
    if (!title.trim()) return alert("제목을 입력해주세요!");

    await createLp({ title, content, thumbnail, tags });
    onClose();
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 flex justify-center items-center"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg w-[420px] space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex justify-between items-center">
          <h2 className="text-xl font-bold">LP 작성</h2>
          <button onClick={onClose}>❌</button>
        </header>

        <input
          placeholder="제목"
          className="border w-full px-3 py-2 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="내용"
          className="border w-full px-3 py-2 rounded h-28"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        {/* 🔥 태그 입력 */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="태그 입력"
              className="border flex-1 rounded px-2 py-1"
            />
            <button
              onClick={handleAddTag}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            >
              추가
            </button>
          </div>

          {/* 🔥 태그 UI */}
          <div className="flex gap-2 flex-wrap">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-pink-100 rounded-full text-sm flex items-center gap-1"
              >
                #{tag}
                <button onClick={() => removeTag(tag)}>❌</button>
              </span>
            ))}
          </div>
        </div>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setThumbnail(e.target.files?.[0] ?? null)}
        />

        <button
          onClick={handleSubmit}
          className="w-full py-2 bg-pink-600 text-white rounded hover:bg-pink-700"
        >
          등록
        </button>
      </div>
    </div>
  );
}
