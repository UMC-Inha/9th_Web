import { useUser } from "../store/userState";

export default function NavBar() {
  const { data: user } = useUser();

  return (
    <div
      style={{
        background: "#111",
        padding: "15px 20px",
        marginBottom: "20px",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <h3>돌려돌려 LP판</h3>
      <div style={{ color: "#ff1493" }}>
        👋 {user?.name || "게스트"}
      </div>
    </div>
  );
}
