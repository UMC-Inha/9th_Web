import { useCallback, useEffect, useState } from "react";

export function useSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  // 🔥 ESC 키로 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [close]);

  // 🔥 사이드바 열렸을 때 배경 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    // 컴포넌트 언마운트 시에도 원상복구
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return {
    isOpen,
    open,
    close,
    toggle,
  };
}
