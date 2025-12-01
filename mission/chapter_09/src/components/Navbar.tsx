import { FaShoppingCart } from "react-icons/fa";
import { useCartInfo } from "../hooks/useCartStore";

const Navbar = () => {
  const { amount } = useCartInfo();

  return (
    <div className="flex justify-between items-center p-4 bg-pink-500 text-white">
      <h1
        onClick={() => {
          window.location.href = "/";
        }}
        className="text-2xl font-semibold cursor-pointer"
      >
        채채의 플레이리스트
      </h1>
      <div className="flex items-center space-x-2">
        <FaShoppingCart className="text-2xl" />
        <span className="text-xl font-medium">{amount}</span>
      </div>
    </div>
  );
};

export default Navbar;
