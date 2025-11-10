import React from "react";

interface SidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
}

export default function Sidebar({ isOpen, closeSidebar }: SidebarProps) {
  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      <ul>
        <li onClick={closeSidebar}>🔍 찾기</li>
        <li onClick={closeSidebar}>👤 마이페이지</li>
        <li className="exit" onClick={closeSidebar}>
          탈퇴하기
        </li>
      </ul>
    </aside>
  );
}
