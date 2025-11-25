import { useEffect } from "react";
import useSidebar from "../hooks/useSidebar";

const HomeLayout = () => {
  const { isOpen, toggle, close } = useSidebar();

  useEffect(() => {
    const closeSidebar = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
      }
    };

    document.addEventListener("keydown", closeSidebar);

    return () => {
      document.removeEventListener("keydown", closeSidebar);
    };
  }, [close]);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-yellow-100 p-5 flex">
        <button className="mr-10 cursor-pointer shadow-md" onClick={toggle}>
          CLICK
        </button>
        <p className="font-bold ">내가 만든 Navbar</p>
      </header>

      <div className="flex flex-1">
        <aside
          className={`bg-yellow-500 w-50 p-20 font-bold transition-all duration-300 
            ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          Side
        </aside>

        <main className="flex-1 p-5">
          {Array.from({ length: 100 }, (_, i) => (
            <p key={i}>엄청나게 긴 글</p>
          ))}
        </main>
      </div>
    </div>
  );
};

export default HomeLayout;
