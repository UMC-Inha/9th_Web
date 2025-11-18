import LPModal from "../components/LPModal";
import CommentSection from "../components/CommentSection";

export default function HomePage() {
  return (
    <div style={{ padding: 40 }}>
      <h2>홈 화면</h2>
      <CommentSection />
      <LPModal />
    </div>
  );
}
