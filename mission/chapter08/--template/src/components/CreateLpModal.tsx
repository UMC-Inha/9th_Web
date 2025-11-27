import { useEffect, useRef, useState } from "react";
import useCreateLp from "../hooks/useCreateLp";
import { uploadImage } from "../apis/lp";

export default function CreateLpModal({ onClose }: { onClose: () => void }) {
  const { mutate, isPending } = useCreateLp();
  const [uploading, setUploading] = useState(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");

  const dialogRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // 모달 열릴 때 body 스크롤 잠금
  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  // 바깥 클릭 닫기 (오버레이 클릭 시)
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // 오버레이 자체를 클릭했을 때만 닫기 (모달 컨텐츠 클릭은 제외)
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // 파일 프리뷰
  useEffect(() => {
    if (!file) return setPreview("");
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const addTag = () => {
    const v = tagInput.trim();
    if (!v) return;
    if (tags.includes(v)) return;
    setTags((prev) => [...prev, v]);
    setTagInput("");
  };

  const removeTag = (name: string) => {
    setTags((prev) => prev.filter((t) => t !== name));
  };

  const submit = async () => {
    if (!title.trim()) return alert("제목을 입력해 주세요.");
    
    try {
      setUploading(true);
      let thumbnail = "";
      
      // 이미지가 있으면 먼저 업로드
      if (file) {
        try {
          thumbnail = await uploadImage(file);
        } catch (error) {
          console.error("이미지 업로드 실패:", error);
          setUploading(false);
          alert("이미지 업로드에 실패했어요.");
          return;
        }
      }
      
      // LP 생성
      mutate(
        { 
          title: title.trim(), 
          content, 
          tags, 
          thumbnail,
          published: true,
        },
        {
          onSuccess: () => {
            setUploading(false);
            // 폼 초기화
            setTitle("");
            setContent("");
            setTags([]);
            setFile(null);
            setTagInput("");
            onClose();
          },
          onError: (error: any) => {
            console.error("LP 생성 실패:", error);
            setUploading(false);
            const errorMessage = error?.response?.data?.message || error?.message || "업로드에 실패했어요.";
            alert(errorMessage);
          },
        }
      );
    } catch (error) {
      console.error("예상치 못한 오류:", error);
      setUploading(false);
      alert("예상치 못한 오류가 발생했어요.");
    }
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-40 bg-black/60 grid place-items-center p-4"
    >
      <div
        ref={dialogRef}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-2xl border border-neutral-800 bg-neutral-900 p-6 text-white shadow-xl z-50"
      >
          {/* 헤더 - X 버튼만 */}
          <div className="mb-4 flex items-center justify-end">
            <button
              onClick={onClose}
              className="rounded p-1 hover:bg-neutral-800"
              aria-label="닫기"
            >
              ✕
            </button>
          </div>

          {/* 이미지 프리뷰 */}
          <div className="mb-4 grid place-items-center">
            <div className="h-40 w-40 overflow-hidden rounded-full border border-neutral-700 bg-neutral-800">
              {preview ? (
                <img
                  src={preview}
                  alt="preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full grid place-items-center text-neutral-400">
                  LP
                </div>
              )}
            </div>
          </div>

          {/* 파일 입력 */}
          <label className="mb-3 block">
            <span className="mb-1 block text-sm text-neutral-300">LP 사진</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              key={file ? file.name : "file-input"}
              className="block w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-neutral-700 file:px-3 file:py-2 file:text-white hover:file:bg-neutral-600"
            />
          </label>

          {/* 제목 */}
          <label className="mb-3 block">
            <span className="mb-1 block text-sm text-neutral-300">LP Name</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목"
              className="w-full h-10 rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm outline-none focus:border-pink-500"
            />
          </label>

          {/* 내용 */}
          <label className="mb-3 block">
            <span className="mb-1 block text-sm text-neutral-300">LP Content</span>
            <textarea
              rows={1}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="내용"
              className="w-full h-10 rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm outline-none focus:border-pink-500 resize-none"
            />
          </label>

          {/* 태그 입력 + 추가 */}
          <div className="mb-2 flex gap-2">
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="LP Tag"
              className="flex-1 rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm outline-none focus:border-pink-500"
            />
            <button
              type="button"
              onClick={addTag}
              className="rounded-md bg-neutral-700 px-3 py-2 text-sm hover:bg-neutral-600"
            >
              Add
            </button>
          </div>

          {/* 태그 리스트 */}
          {!!tags.length && (
            <div className="mb-4 flex flex-wrap gap-2">
              {tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 rounded-full bg-neutral-800 px-2 py-1 text-xs"
                >
                  #{t}
                  <button
                    onClick={() => removeTag(t)}
                    className="ml-1 rounded p-0.5 hover:bg-neutral-700"
                    aria-label={`${t} 삭제`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* 하단 버튼 */}
          <div className="mt-5">
            <button
              onClick={submit}
              disabled={isPending || uploading}
              className="w-full rounded-md bg-pink-600 py-2 hover:bg-pink-500 disabled:opacity-60"
            >
              {isPending || uploading ? "업로드 중..." : "Add LP"}
            </button>
          </div>
        </div>
    </div>
  );
}

