import { useState } from "react";

export default function LPModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          background: "#ff1493",
          padding: 20,
          borderRadius: "50%",
        }}
      >
        +
      </button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              background: "#222",
              padding: 20,
              borderRadius: 10,
              width: 300,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>LP 작성</h3>
            <input style={{ width: "100%", padding: 10 }} placeholder="제목" />
            <button style={{ marginTop: 10, padding: 10 }}>등록</button>
          </div>
        </div>
      )}
    </>
  );
}
