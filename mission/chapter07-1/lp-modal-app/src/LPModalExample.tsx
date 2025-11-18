import React, { useState } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

// -----------------------------
// ✅ Mock API (테스트용 서버 시뮬레이션)
// -----------------------------
const fakeDB = {
  comments: [
    { id: 1, user: "김연진", content: "안녕!", mine: true },
    { id: 2, user: "홍길동", content: "LP 멋지네요!", mine: false },
  ],
};

const fetchComments = async () => {
  await new Promise((r) => setTimeout(r, 100));
  return fakeDB.comments;
};

const postComment = async (newComment: { content: string }) => {
  await new Promise((r) => setTimeout(r, 150));
  const newItem = {
    id: Date.now(),
    user: "김연진",
    content: newComment.content,
    mine: true,
  };
  fakeDB.comments.push(newItem);
  return newItem;
};

const updateComment = async (data: { id: number; content: string }) => {
  await new Promise((r) => setTimeout(r, 150));
  const c = fakeDB.comments.find((item) => item.id === data.id);
  if (c) c.content = data.content;
  return c;
};

const deleteComment = async (id: number) => {
  await new Promise((r) => setTimeout(r, 100));
  fakeDB.comments = fakeDB.comments.filter((item) => item.id !== id);
  return id;
};

const postLP = async (formData: FormData) => {
  await new Promise((r) => setTimeout(r, 300));
  return { message: "LP 생성 완료", data: Object.fromEntries(formData.entries()) };
};

// -----------------------------
// ✅ LP 모달 + 댓글 통합 컴포넌트
// -----------------------------
export default function LPAndCommentPage() {
  const queryClient = useQueryClient();

  // 모달 관련 상태
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // 댓글 관련 상태
  const [newComment, setNewComment] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  const { data: comments = [] } = useQuery({
    queryKey: ["comments"],
    queryFn: fetchComments,
  });

  const createComment = useMutation({
    mutationFn: postComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      setNewComment("");
    },
  });

  const editComment = useMutation({
    mutationFn: updateComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      setEditId(null);
      setEditText("");
    },
  });

  const deleteCommentMut = useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
  });

  // -----------------------------
  const createLP = useMutation({
    mutationFn: postLP,
    onSuccess: () => {
      alert("LP 생성 완료!");
      setIsOpen(false);
      setTitle("");
      setDescription("");
      setTags([]);
      setImageFile(null);
      queryClient.invalidateQueries({ queryKey: ["lpList"] });
    },
  });

  // -----------------------------
  const handleAddTag = () => {
    const t = tagInput.trim();
    if (!t || tags.includes(t)) return;
    setTags([...tags, t]);
    setTagInput("");
  };
  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((x) => x !== tag));
  };

  // -----------------------------
  const handleSubmitLP = () => {
    if (!title || !description) return alert("모든 필드를 채워주세요!");
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("tags", JSON.stringify(tags));
    if (imageFile) formData.append("image", imageFile);
    createLP.mutate(formData);
  };

  return (
    <div
      style={{
        backgroundColor: "#18181b",
        color: "#fff",
        minHeight: "100vh",
        padding: "40px",
        position: "relative",
      }}
    >
      <h2 style={{ marginBottom: "20px" }}>돌려돌려 LP판 🎶</h2>

      {/* ---------------- 댓글 영역 ---------------- */}
      <div
        style={{
          background: "#222",
          padding: "16px",
          borderRadius: "12px",
          maxWidth: "600px",
          marginBottom: "60px",
        }}
      >
        <h3 style={{ marginBottom: "10px" }}>💬 댓글</h3>

        {/* 댓글 입력 */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
          <input
            placeholder="댓글을 입력해주세요"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            style={{
              flex: 1,
              padding: "8px",
              borderRadius: "6px",
              border: "1px solid #555",
              background: "#333",
              color: "#fff",
            }}
          />
          <button
            onClick={() => createComment.mutate({ content: newComment })}
            disabled={!newComment.trim()}
            style={{
              background: "#ff1493",
              border: "none",
              borderRadius: "6px",
              color: "#fff",
              padding: "0 16px",
              cursor: "pointer",
            }}
          >
            작성
          </button>
        </div>

        {/* 댓글 리스트 */}
        {comments.map((c) => (
          <div
            key={c.id}
            style={{
              borderTop: "1px solid #333",
              padding: "8px 0",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <strong>{c.user}</strong>

              {c.mine && (
                <div>
                  <button
                    onClick={() =>
                      editId === c.id ? setEditId(null) : setEditId(c.id)
                    }
                    style={{
                      background: "none",
                      border: "none",
                      color: "#999",
                      cursor: "pointer",
                    }}
                  >
                    ⋮
                  </button>
                </div>
              )}
            </div>

            {editId === c.id ? (
              <div style={{ display: "flex", gap: "6px", marginTop: "6px" }}>
                <input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  style={{
                    flex: 1,
                    background: "#333",
                    color: "#fff",
                    border: "1px solid #555",
                    borderRadius: "6px",
                    padding: "6px",
                  }}
                />
                <button
                  onClick={() =>
                    editComment.mutate({ id: c.id, content: editText })
                  }
                  style={{
                    background: "#4c8bf5",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    padding: "0 10px",
                    cursor: "pointer",
                  }}
                >
                  저장
                </button>
                <button
                  onClick={() => deleteCommentMut.mutate(c.id)}
                  style={{
                    background: "#ff5555",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    padding: "0 10px",
                    cursor: "pointer",
                  }}
                >
                  삭제
                </button>
              </div>
            ) : (
              <p style={{ marginTop: "6px" }}>{c.content}</p>
            )}
          </div>
        ))}
      </div>

      {/* ---------------- LP + 버튼 ---------------- */}
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #ff4081, #ff1493)",
          color: "#fff",
          fontSize: "32px",
          border: "none",
          cursor: "pointer",
        }}
      >
        +
      </button>

      {/* ---------------- LP 작성 모달 ---------------- */}
      {isOpen && (
        <div
          onClick={(e) => e.target === e.currentTarget && setIsOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "#222",
              color: "#fff",
              borderRadius: "12px",
              padding: "30px",
              width: "400px",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <button
              onClick={() => setIsOpen(false)}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "none",
                border: "none",
                color: "#bbb",
                fontSize: "20px",
                cursor: "pointer",
              }}
            >
              ✕
            </button>

            <h3 style={{ textAlign: "center" }}>Add LP</h3>

            <input
              placeholder="LP 제목"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                background: "#333",
                border: "1px solid #444",
                padding: "10px",
                borderRadius: "6px",
                color: "#fff",
              }}
            />
            <input
              placeholder="LP 설명"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                background: "#333",
                border: "1px solid #444",
                padding: "10px",
                borderRadius: "6px",
                color: "#fff",
              }}
            />

            {/* 태그 추가 */}
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                placeholder="LP Tag"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
                style={{
                  flex: 1,
                  background: "#333",
                  border: "1px solid #444",
                  padding: "10px",
                  borderRadius: "6px",
                  color: "#fff",
                }}
              />
              <button
                onClick={handleAddTag}
                style={{
                  background: "#555",
                  border: "none",
                  borderRadius: "6px",
                  color: "#fff",
                  padding: "0 16px",
                  cursor: "pointer",
                }}
              >
                Add
              </button>
            </div>

            {/* 태그 리스트 */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {tags.map((tag) => (
                <div
                  key={tag}
                  style={{
                    background: "#444",
                    borderRadius: "8px",
                    padding: "4px 8px",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <span>{tag}</span>
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#ccc",
                      cursor: "pointer",
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {/* 이미지 업로드 */}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setImageFile(file);
              }}
              style={{
                background: "#333",
                border: "1px solid #444",
                padding: "10px",
                borderRadius: "6px",
                color: "#fff",
              }}
            />

            {/* 등록 버튼 */}
            <button
              onClick={handleSubmitLP}
              disabled={createLP.isPending}
              style={{
                background: "#ff1493",
                border: "none",
                borderRadius: "8px",
                padding: "12px",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              {createLP.isPending ? "등록 중..." : "Add LP"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
