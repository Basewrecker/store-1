'use client'

import { CartItem } from "@/types";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToastManager } from "@/components/ui/toast";
import { addItemToCart } from "@/lib/actions/cart.actions";


const AddToCart = ({ item }: { item: CartItem; }) => {
  const router = useRouter();
  const { add } = useToastManager();

  const handleAddToCart = async () => {
    const res = await addItemToCart(item);

    if (!res.success) {
      add({
        title: 'Error',
        description: res.message,
      });
      return;
    }

    add({
      title: 'Added to cart',
      description: res.message,
      actionProps: {
        children: 'View Cart',
        onClick: () => router.push('/cart'),
      },
    });
  }

  return (
    <Button className="w-full" type = "button" onClick = {handleAddToCart}>Add to cart</Button>
  );
}

export default AddToCart;
