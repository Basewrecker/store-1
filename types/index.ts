import { z } from 'zod';
import { insertProductSchema } from '@/lib/constants/validators';


export type Product = {
  id: string;
  rating: string;
  createdAt: Date;
};
