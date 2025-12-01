import { useCartActions, useCartInfo } from "../hooks/useCartStore";

const PriceBox = () => {
  const { total } = useCartInfo();
  const { openModal } = useCartActions();

  const handleInitializeCart = () => {
    openModal();
  };

  return (
    <div className="p-8 flex justify-between">
      <button
        onClick={handleInitializeCart}
        className="px-4 py-2 bg-pink-500 text-white rounded-md cursor-pointer hover:bg-pink-600"
      >
        전체 삭제
      </button>
      <div className="text-xl font-medium">총 가격: {total}원</div>
    </div>
  );
};
export default PriceBox;
