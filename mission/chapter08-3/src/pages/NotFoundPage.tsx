import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-400">
      <div className="bg-white w-[420px] rounded-2xl p-10 shadow-lg flex flex-col items-center gap-4">
        <img
          src="/404.png"
          alt="404"
          className="w-48 mb-4"
        />
        <h2 className="text-lg font-semibold">Looks like you’ve got lost….</h2>

        <button
          onClick={() => navigate("/")}
          className="bg-blue-500 text-white px-6 py-2 rounded-md mt-2 hover:bg-blue-600"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
