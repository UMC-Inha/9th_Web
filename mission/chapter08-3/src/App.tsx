import { useSidebar } from "./useSidebar";

export default function App() {
  const sidebar = useSidebar();

  return (
    <div className="relative min-h-screen bg-gray-900 text-white">
      {/* 상단 헤더 */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
        <div className="text-lg font-bold">로고</div>

        {/* 햄버거 버튼 */}
        <button
          onClick={sidebar.toggle}
          className="
            inline-flex flex-col justify-between
            w-8 h-6
            group
          "
          aria-label="사이드바 열기"
        >
          <span
            className={`
              h-[3px] rounded bg-white
              transition-transform duration-300
              ${sidebar.isOpen ? "translate-y-[9px] rotate-45" : ""}
            `}
          />
          <span
            className={`
              h-[3px] rounded bg-white
              transition-opacity duration-300
              ${sidebar.isOpen ? "opacity-0" : "opacity-100"}
            `}
          />
          <span
            className={`
              h-[3px] rounded bg-white
              transition-transform duration-300
              ${sidebar.isOpen ? "-translate-y-[9px] -rotate-45" : ""}
            `}
          />
        </button>
      </header>

      {/* 메인 콘텐츠 (스크롤되도록 긴 텍스트 예시) */}
      <main className="p-4 space-y-4">
        <h1 className="text-2xl font-bold mb-4">메인 콘텐츠</h1>
        <p>
          임의의 글
        </p>
        {Array.from({ length: 40 }).map((_, i) => (
          <p key={i}>스크롤 테스트용 더미 텍스트 {i + 1}</p>
        ))}
      </main>

      {sidebar.isOpen && (
        <div
          className="
            fixed inset-0 bg-black/50
            transition-opacity duration-300
            opacity-100
          "
          onClick={sidebar.close}
        />
      )}

  
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 
          bg-gray-800 shadow-xl
          transform
          transition-transform duration-300 ease-out
          ${sidebar.isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        aria-hidden={!sidebar.isOpen}
      >
        <div className="p-4 flex items-center justify-between border-b border-gray-700">
          <h2 className="text-xl font-bold">사이드바</h2>
          <button
            onClick={sidebar.close}
            className="text-sm text-gray-300 hover:text-white"
          >
            닫기 (ESC)
          </button>
        </div>

        <nav className="p-4 space-y-2">
          <a href="#" className="block hover:text-blue-400">
            메뉴 1
          </a>
          <a href="#" className="block hover:text-blue-400">
            메뉴 2
          </a>
          <a href="#" className="block hover:text-blue-400">
            메뉴 3
          </a>
        </nav>
      </aside>
    </div>
  );
}
