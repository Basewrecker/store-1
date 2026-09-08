'use client'
import { Cart, CartItem } from "@/types";
import { Button } from "@/components/ui/button";
import { Plus,Minus, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast, useToastManager } from "@/components/ui/toast";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";
import { useTransition } from "react";
const AddToCart = ({ cart,item }: { cart?: Cart , item: CartItem; }) => {
  const router = useRouter();
  const { add } = useToastManager();

  const [isPending, startTransition] = useTransition();

  const handleAddToCart = async () => {
    startTransition(async () => {
      const res = await addItemToCart(item);
      if (!res.success) {
        add({
          title: 'Error',
          description: res.message,
        });
        return;
      }
      add({
        description: `${item.name} added to cart`,
        actionProps: {
          children: 'Go To Cart',
          onClick: () => router.push('/cart'),
        },
      });
    })
  };

  // checking if an item already exists in the cart
  const handleRemoveFromCart = async () => {
    const res = await removeItemFromCart(item.productId);

    add({
      title: res.success ? 'Removed from cart' : 'Error',
      description: res.message,
      type: res.success ? 'success' : 'error',
    });
  };

  const existitem = cart && cart.items.find((x) => x.productId === item.productId);

  return (
    existitem ? (
      <div>
        <Button type='button' variant="outline" onClick={handleRemoveFromCart}>
          {isPending ? (<Loader className="w-4 h-4 animate-spin"/>): (<Minus className="w-4 h-4"/>) }
        </Button>
        <span className="px-2">{existitem.qty}</span>
        <Button type = "button" variant="outline" onClick={handleAddToCart}>
          {isPending ? (<Loader className="w-4 h-4 animate-spin"/>): (<Plus className="w-4 h-4"/>) }
        </Button>
    </div>
    ): (
        <Button className="w-full" type="button" onClick={handleAddToCart}>
        {isPending ? (<Loader className="w-4 h-4 animate-spin"/>): (<Plus className="w-4 h-4"/>) }Add to cart
        </Button>
    )
  );
}
export default AddToCart;
