import { z } from 'zod';
import { insertProductSchema,insertCartSchema,cartItemSchema } from '@/lib/constants/validators';


export type Product = {
  id: string;
  rating: string;
  createdAt: Date;
};

export type Cart = z.infer<typeof insertCartSchema>
export type CartItem = z.infer<typeof cartItemSchema>
