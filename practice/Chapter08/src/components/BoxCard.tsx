import type { Card } from "../types/dashboard";
import User from "../assets/dashboard/totalUser.svg?react";
import Sales from "../assets/dashboard/totalSales.svg?react";
import Order from "../assets/dashboard/totalOrder.svg?react";
import Pending from "../assets/dashboard/totalPending.svg?react";
import Down from "../assets/dashboard/trendingDown.svg?react";
import Up from "../assets/dashboard/trendingUp.svg?react";

export const BoxCard = ({
  title,
  value,
  profile,
  icon,
  label,
  percent,
}: Card) => {
  const profileList = {
    user: User,
    sales: Sales,
    order: Order,
    pending: Pending,
  };

  const trendList = { up: Up, down: Down };

  const ProfileIcon = profileList[profile as keyof typeof profileList];
  const TrendIcon = trendList[icon as keyof typeof trendList];

  const Increase = icon === "up";

  return (
    <div className="bg-white rounded-[14px] shadow-sm border border-gray-100 p-6 ">
      <div className="flex">
        <div>
          <h3 className="text-gray-500 text-base font-medium">{title}</h3>
        </div>
        <ProfileIcon className="ml-25" />
      </div>

      <div className="mb-6">
        <span className="text-3xl font-bold text-gray-900">{value}</span>
      </div>

      <div className="flex items-center gap-2 text-sm">
        <TrendIcon />
        <span className={`${Increase ? "text-[#00B69B]" : "text-[#F93C65]"}`}>
          {percent}
        </span>
        <span className="text-gray-400">{label}</span>
      </div>
    </div>
  );
};
