import { z } from "zod";
import { formatNumberWithDecimal } from "../utils";

const currency = z.string().refine((value) => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(Number(value))), 'Price must have exactly two decminal places');



export const insertProductSchema = z.object({
  name: z.string().min(3, 'Name must be atleast 3 characters'),
  slug: z.string().min(3, 'Slug must be at least 3 characters'),
  category: z.string().min(3, 'Category must be atleast 3 characters'),
  description: z.string().min(3, 'description must be atleast 3 characters'),
  stock: z.coerce.number(),
  images: z.array(z.string()).min(1, 'product must have atleast one image'),
  isFeatured: z.boolean(),
  banner: z.string().nullable(),
  price: currency,
})


// schema for signing users in

export const signInFormSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6,'password must be atleast 6 characters'),
})

// schema for signing users up

export const signUpFormSchema = z.object({
  name: z.string().min(3,'Name must be atleast 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'password must be atleast 6 characters'),
  confirmPassword: z.string().min(6,'Passwords dont match'),
})
