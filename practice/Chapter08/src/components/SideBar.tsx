import { NavLink } from "react-router-dom";
import Logo from "../assets/logo/logo.svg?react";
import Products from "../assets/Navigation/Products.svg?react";
import Dashboard from "../assets/Navigation/Dashboard.svg?react";
import Favorites from "../assets/Navigation/Favorites.svg?react";
import Inbox from "../assets/Navigation/Inbox.svg?react";
import OrderList from "../assets/Navigation/OrderLists.svg?react";
import Stock from "../assets/Navigation/ProductStock.svg?react";
import Pricing from "../assets/Navigation/Pricing.svg?react";
import Calendar from "../assets/Navigation/Calender.svg?react";
import ToDo from "../assets/Navigation/ToDo.svg?react";
import Contact from "../assets/Navigation/Contact.svg?react";
import Invoice from "../assets/Navigation/Invoice.svg?react";
import UIElement from "../assets/Navigation/UIElements.svg?react";
import Team from "../assets/Navigation/Team.svg?react";
import Table from "../assets/Navigation/Table.svg?react";
import Settings from "../assets/Navigation/Settings.svg?react";
import Logout from "../assets/Navigation/Logout.svg?react";
import type { Item } from "../types/dashboard";

export const SideBar = () => {
  const menuItems = [
    { name: "Dashboard", icon: Dashboard, path: "/" },
    { name: "Products", icon: Products, path: "/" },
    { name: "Favorites", icon: Favorites, path: "/" },
    { name: "Inbox", icon: Inbox, path: "/" },
    { name: "Order Lists", icon: OrderList, path: "/" },
    { name: "Stock", icon: Stock, path: "/" },
  ];

  const pagesItems = [
    { name: "Pricing", icon: Pricing, path: "/" },
    { name: "Calendar", icon: Calendar, path: "/" },
    { name: "To-Do", icon: ToDo, path: "/" },
    { name: "Contact", icon: Contact, path: "/" },
    { name: "Invoice", icon: Invoice, path: "/" },
    { name: "UI Elements", icon: UIElement, path: "/" },
    { name: "Team", icon: Team, path: "/" },
    { name: "Table", icon: Table, path: "/" },
  ];

  const settingItems = [
    { name: "Settings", icon: Settings, path: "/" },
    { name: "Logout", icon: Logout, path: "/" },
  ];

  const renderList = (item: Item) => {
    return (
      <NavLink
        key={item.name}
        to={item.path}
        className={
          "flex items-center gap-4 px-4 py-3 rounded-xl transition-colors duration-200 hover:bg-[#4880FF] hover:text-white"
        }
      >
        <item.icon className="w-5 h-5" />
        <span>{item.name}</span>
      </NavLink>
    );
  };

  return (
    <div className="flex w-60 h-[1070px] bg-white flex-col border border-black transition-all duration-300 px-4">
      <div className="mt-10 mb-10 flex justify-center">
        <Logo />
      </div>

      <nav className="flex flex-col gap-2">
        {menuItems.map(renderList)}

        <hr className="text-[#D8D8D8]" />
        <span className="text-sm ml-6 mb-5">PAGES</span>
        {pagesItems.map(renderList)}

        <hr className="text-[#D8D8D8]" />
        {settingItems.map(renderList)}
      </nav>
    </div>
  );
};
