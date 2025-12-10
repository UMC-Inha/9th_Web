import { FaShoppingCart } from "react-icons/fa";
import { useDispatch, useSelector } from "../hooks/useCustomRedux";
import { useEffect } from "react";
import { calculateTotals } from "../slices/cartSlice";

const Navbar = () => {
  const { amount, cartItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(calculateTotals());
  }, [dispatch, cartItems]);

  return (
    <div className="flex justify-between items-center p-4 bg-linear-to-r from-blue-400 to-purple-500 text-white">
      <h1
        className="text-2xl font-semibold cursor-pointer ml-2"
        onClick={() => {
          window.location.href = "/";
        }}
      >
        Logo
      </h1>
      <div className="flex items-center space-x-2">
        <FaShoppingCart className="text-2xl" />
        <span className="text-xl font-medium">{amount}</span>
      </div>
    </div>
  );
};

export default Navbar;
