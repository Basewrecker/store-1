'use server';

import { cookies } from "next/headers";
import { CartItem } from "@/types";
import { convertToPlainObject, formatError, round2 } from "../utils";
import { auth } from "@/auth";
import { cartItemSchema, insertCartSchema } from "../constants/validators";
import { prisma } from "../prisma";
import { revalidatePath } from "next/cache";
import { Prisma } from "../generated/prisma/client";

const calcPrice = (items: CartItem[]) => {
  const itemsPrice = round2(
    items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0)
  ),
    shippingPrice = round2(itemsPrice > 100 ? 0 : 100),
    taxPrice = round2(0.15 * itemsPrice),
    totalPrice = round2(itemsPrice + taxPrice + shippingPrice);

  return {
      itemsPrice: itemsPrice.toFixed(2),
      shippingPrice: shippingPrice.toFixed(2),
      taxPrice: taxPrice.toFixed(2),
      totalPrice: totalPrice.toFixed(2),
    }
}

export async function addItemToCart(data: CartItem) {
  try {
    const sessionCartId = (await cookies()).get('sessionCartId')?.value;
    if (!sessionCartId) throw new Error('Cart session not found');
    const session = await auth();
    const userId = session?.user?.id ? (session.user.id as string) : undefined;

    //Get cart

    const cart = await getMyCart();

    // parse over the items
    const item = cartItemSchema.parse(data);
    const product = await prisma.product.findFirst({
      where: {id: item.productId},
    })
    if (!product) throw new Error('Product not found');
    if (!cart) {
      const newCart = insertCartSchema.parse({
        userId: userId,
        items: [item],
        sessionCartId: sessionCartId,
        ...calcPrice([item])
      })

      await prisma.cart.create({
        data: newCart
      })

      revalidatePath(`/product/${product.slug}`)
      return {
        success: true,
        message: `${product.name} added to cart`,
      };
    } else {
      // checking if another instance of the item already exists in the cart
      const existitem = (cart.items as CartItem[]).find((x) => x.productId === item.productId);

      if (existitem) {
        if (product.stock < existitem.qty + 1) {
          throw new Error("Not enough stock");
        }

        (cart.items as CartItem[]).find((x) => x.productId === item.productId) !.qty = existitem.qty + 1;
      } else {
        if (product.stock < 1) throw new Error('Not enough stock');

        cart.items.push(item);
      }

      await prisma.cart.update({
        where: { id: cart.id },
        data: {
          items: cart.items as Prisma.CartUpdateitemsInput[],
          ...calcPrice(cart.items as CartItem[])
        }
      });

      revalidatePath(`/product/${product.slug}`);

      return {
        success: true,
        message: `${product.name} ${existitem ? 'updated in' : 'added to'} cart`
      }
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error)
      }
  }

}

export async function getMyCart() {
  const sessionCartId = (await cookies()).get('sessionCartId')?.value;
  if (!sessionCartId) throw new Error('Cart session not found');
  const session = await auth();
  const userId = session?.user?.id ? (session.user.id as string) : undefined;

  const cart = await prisma.cart.findFirst({
    where: userId ? { userId: userId } : { sessionCartId: sessionCartId }
  });

  if (!cart) return undefined;

  return convertToPlainObject({
    ...cart,
    items: cart.items as CartItem[],
    itemsPrice: cart.itemsPrice.toString(),
    totalPrice: cart.totalPrice.toString(),
    shippingPrice: cart.shippingPrice.toString(),
    taxPrice: cart.taxPrice.toString(),
  })
}

export async function removeItemFromCart(productId: string) {
  try {
    const sessionCartId = (await cookies()).get('sessionCartId')?.value;
    if (!sessionCartId) throw new Error('Cart session not found');

    const product = await prisma.product.findFirst({
      where: { id: productId }
    });

    if (!product) throw new Error('Product not found');
    const cart = await getMyCart();
    if (!cart) throw new Error('Cart not found');
    const exist = (cart.items as CartItem[]).find((x) => x.productId === productId);
    if (!exist) throw new Error("Item doesn't exist");

    if (exist.qty === 1) {
      cart.items = (cart.items as CartItem[]).filter((x) =>x.productId !== exist.productId)
    } else {
      (cart.items as CartItem[]).find((x) => x.productId === productId)!.qty = exist.qty - 1;
    }

    // updating the cart in the prisma database
    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        items: cart.items as Prisma.CartUpdateitemsInput[],
        ...calcPrice(cart.items as CartItem[]),
      }
    });

    //removing the item from cart

    revalidatePath(`/product/${product.slug}`);
    return {
      success: true,
      message: `${product.name} was removed from cart`,
    }

  } catch (error) {
    return {success: false,message: formatError(error)}
  }
}

// [
//   {
//     "productId": "cmt3wrvpf0003u8xuedfrvgls",
//     "name": "Calvin Klein Slim Fit Stretch Shirt",
//     "slug": "calvin-klein-slim-fit-stretch-shirt",
//     "qty": 6,
//     "image": "/images/sample-products/p4-1.jpg",
//     "price": "39.95"
//   }
// ]
