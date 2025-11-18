import { useState } from "react";

export default function CommentSection() {
  const [text, setText] = useState("");
  const [comments, setComments] = useState<string[]>([]);

  return (
    <div>
      <h3>댓글</h3>

      <div>
        {comments.map((c, i) => (
          <div key={i} style={{ marginBottom: 5 }}>
            {c}
          </div>
        ))}
      </div>

      <input
        style={{ padding: 10, marginTop: 10 }}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="댓글 입력"
      />
      <button
        style={{ padding: 10, marginLeft: 10 }}
        onClick={() => {
          setComments([...comments, text]);
          setText("");
        }}
      >
        등록
      </button>
    </div>
  );
}
