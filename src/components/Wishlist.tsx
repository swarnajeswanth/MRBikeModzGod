import { FaBox, FaHeart, FaTrash } from "react-icons/fa";
import { Heart, XCircle, Lock } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "./store";
import { removeFromWishlist, clearWishlist } from "./store/UserSlice";
import { selectIsFeatureEnabled } from "./store/storeSettingsSlice";
import { toast } from "react-hot-toast";

const Wishlist: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { wishlist } = useSelector((state: RootState) => state.user);
  const isWishlistEnabled = useSelector(selectIsFeatureEnabled("wishlist"));

  const handleRemoveFromWishlist = (productId: string) => {
    if (!isWishlistEnabled) {
      toast.error("Wishlist feature is currently disabled");
      return;
    }

    if (productId === "all") {
      dispatch(clearWishlist());
      toast.success("Wishlist cleared");
    } else {
      dispatch(removeFromWishlist(productId));
      toast.success("Removed from wishlist");
    }
  };

  const handleAddToCart = (product: any) => {
    // TODO: Implement add to cart functionality
    toast.success("Added to cart");
  };

  // Show disabled state if wishlist feature is disabled
  if (!isWishlistEnabled) {
    return (
      <div className="w-full bg-[#101828] text-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center gap-3 mb-5">
          <XCircle className="text-gray-400 text-2xl" />
          <h2 className="text-2xl font-bold text-gray-400">
            My Wishlist (Disabled)
          </h2>
        </div>
        <div className="text-center py-8">
          <Lock className="text-gray-400 text-4xl mx-auto mb-4" />
          <p className="text-gray-400">
            Wishlist feature is currently disabled
          </p>
          <p className="text-gray-500 text-sm">
            Contact the store administrator to enable this feature
          </p>
        </div>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="w-full bg-[#101828] text-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center gap-3 mb-5">
          <Heart className="text-red-400 text-2xl" />
          <h2 className="text-2xl font-bold">My Wishlist</h2>
        </div>
        <div className="text-center py-8">
          <Heart className="text-gray-400 text-4xl mx-auto mb-4" />
          <p className="text-gray-400">Your wishlist is empty</p>
          <p className="text-gray-500 text-sm">
            Start adding products to your wishlist!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#101828] text-white p-6 rounded-lg shadow-lg">
      <div className="flex items-center gap-3 mb-5">
        <Heart className="text-red-400 text-2xl" />
        <h2 className="text-2xl font-bold">My Wishlist ({wishlist.length})</h2>
      </div>
      {wishlist.map((item) => (
        <div
          key={item.id}
          className="flex justify-between items-center bg-[#1D2939] p-4 rounded-lg mb-3 cursor-pointer hover:bg-[#2A3A4A] transition-colors"
          onClick={() => router.push(`/product/${item.id}`)}
        >
          <div className="flex items-center gap-3">
            <div className="bg-[#344054] p-3 rounded-lg">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-12 object-cover rounded"
                />
              ) : (
                <FaBox className="text-gray-300 text-xl" />
              )}
            </div>
            <div>
              <p className="font-semibold">{item.name}</p>
              <p className="text-red-400">${item.price}</p>
              <p className="text-gray-400 text-sm">{item.category}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart(item);
              }}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
            >
              Add to Cart
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveFromWishlist(item.id);
              }}
              className="bg-gray-600 text-white px-3 py-2 rounded-md hover:bg-gray-700 transition"
            >
              <FaTrash className="text-sm" />
            </button>
          </div>
        </div>
      ))}
      <button
        onClick={() => handleRemoveFromWishlist("all")}
        className="w-full mt-4 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition"
      >
        Clear Wishlist
      </button>
    </div>
  );
};

export default Wishlist;
