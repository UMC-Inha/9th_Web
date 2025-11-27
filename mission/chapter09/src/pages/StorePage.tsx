import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Modal from '../components/Modal'; 
import { useCartStore } from "../hooks/useCartStore"; 

interface Item {
    id: string;
    title: string;
    singer: string;
    price: string;
    amount: number;
    img: string;
}

const StorePage = () => {
    const { items, increase, decrease, isOpen } = useCartStore();

    return (
        <div>
            <Navbar />

            {isOpen && <Modal />} 

            <div className="flex flex-col px-6 py-10 max-w-3xl mx-auto">
                {items.map((item: Item) => (
                    <div key={item.id} className="flex items-center justify-between py-4 border-b border-gray-200">
                        <div className="flex items-center gap-4">
                            <img
                            src={item.img}
                            alt={item.title} 
                            className="w-20 h-20 object-cover rounded-md shadow"
                            />

                            <div>
                                <h2 className="text-lg font-semibold"> {item.title} </h2>
                                <p className="text-sm text-gray-600"> {item.singer} </p>
                                <p className="text-md font-bold mt-1"> ₩{Number(item.price).toLocaleString()} </p> 
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                            onClick={() => increase(item.id)}
                            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                            >
                                +
                            </button>

                            <span className="w-8 text-center font-semibold"> {item.amount} </span>

                            <button
                            onClick={() => decrease(item.id)}
                            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                            >
                                -
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <Footer />
        </div>
    );
};

export default StorePage;