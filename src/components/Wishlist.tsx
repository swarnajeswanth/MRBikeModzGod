import { FaBox } from "react-icons/fa";

type WishlistItem = {
  name: string;
  price: string;
};

const wishlistItems: WishlistItem[] = [
  {
    name: "Turbo Charger Kit",
    price: "$899.99",
  },
  {
    name: "Carbon Fiber Spoiler",
    price: "$449.99",
  },
  {
    name: "Racing Seat Set",
    price: "$1299.99",
  },
];

const Wishlist: React.FC = () => {
  return (
    <div className=" w-full bg-[#101828] text-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-5">My Wishlist</h2>
      {wishlistItems.map((item, idx) => (
        <div
          key={idx}
          className="flex justify-between items-center bg-[#1D2939] p-4 rounded-lg mb-3"
        >
          <div className="flex items-center gap-3">
            <div className="bg-[#344054] p-3 rounded-lg">
              <FaBox className="text-gray-300 text-xl" />
            </div>
            <div>
              <p className="font-semibold">{item.name}</p>
              <p className="text-red-400">{item.price}</p>
            </div>
          </div>
          <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition">
            Add to Cart
          </button>
        </div>
      ))}
      <button
        disabled
        className="w-full mt-4 py-2 bg-white text-gray-500 font-medium rounded-md cursor-not-allowed"
      >
        View All Wishlist
      </button>
    </div>
  );
};

export default Wishlist;
