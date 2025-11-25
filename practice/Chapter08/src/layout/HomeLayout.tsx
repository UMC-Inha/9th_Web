import { BoxCard } from "../components/BoxCard";
import { SideBar } from "../components/SideBar";
import { TopNavbar } from "../components/TopNavbar";

const HomeLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <SideBar />

      <div className="flex flex-col flex-1 w-full">
        <TopNavbar />

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <BoxCard
              title="Total User"
              value="40,689"
              profile="user"
              icon="up"
              label="Up from yesterday"
              percent="8.5%"
            />

            <BoxCard
              title="Total Order"
              value="10293"
              profile="order"
              icon="up"
              label="Up from past week"
              percent="1.3%"
            />

            <BoxCard
              title="Total Sales"
              value="$89,000"
              profile="sales"
              icon="down"
              label="Down from yesterday"
              percent="4.3%"
            />

            <BoxCard
              title="Total Pending"
              value="2040"
              profile="pending"
              icon="up"
              label="Up from yesterday"
              percent="1.8%"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeLayout;
