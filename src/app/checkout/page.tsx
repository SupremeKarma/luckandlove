
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { User, Mail, Phone, MapPin, CreditCard, Shield } from 'lucide-react';
import CheckoutButton from '@/components/CheckoutButton';
import EsewaButton from '@/components/EsewaButton';
import KhaltiButton from '@/components/KhaltiButton';
import Link from 'next/link';

const formSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  phone: z.string().min(10, { message: 'Phone number must be at least 10 digits.' }),
  address: z.string().min(5, { message: 'Address must be at least 5 characters.' }),
  city: z.string().min(2, { message: 'City must be at least 2 characters.' }),
  postalCode: z.string().min(4, { message: 'Postal code must be at least 4 characters.' }),
});

export default function CheckoutPage() {
  const { cartItems, cartTotal } = useCart();
  const [currentStep, setCurrentStep] = useState(1);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      postalCode: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log('Shipping details:', values);
    setCurrentStep(2);
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-muted-foreground mb-6">You can't checkout without any items!</p>
        <Button asChild>
          <Link href="/products">Go Shopping</Link>
        </Button>
      </div>
    );
  }

  const tax = cartTotal * 0.1; // Example 10% tax
  const shipping = 5; // Example $5 shipping
  const total = cartTotal + tax + shipping;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-12"
    >
      <h1 className="text-4xl font-bold text-center mb-10">Checkout</h1>
      
      <div className="grid md:grid-cols-2 gap-12 items-start">
        <div className="md:col-span-1">
          <Card className="glass-card-dark">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cartItems.map(item => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between">
                  <p>Subtotal</p>
                  <p>${cartTotal.toFixed(2)}</p>
                </div>
                <div className="flex justify-between">
                  <p>Shipping</p>
                  <p>${shipping.toFixed(2)}</p>
                </div>
                <div className="flex justify-between">
                  <p>Tax</p>
                  <p>${tax.toFixed(2)}</p>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <p>Total</p>
                  <p>${total.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-1">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="glass-card-dark">
                  <CardHeader>
                    <CardTitle className="text-2xl">1. Shipping Details</CardTitle>
                  </CardHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                      <CardContent className="space-y-4">
                        <FormField control={form.control} name="fullName" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} icon={<User className="h-4 w-4" />} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="email" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="you@example.com" {...field} icon={<Mail className="h-4 w-4" />} />
                            </FormControl>
                             <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="phone" render={({ field }) => (
                           <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                              <Input type="tel" placeholder="+1234567890" {...field} icon={<Phone className="h-4 w-4" />} />
                            </FormControl>
                             <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="address" render={({ field }) => (
                           <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                              <Input placeholder="123 Main St" {...field} icon={<MapPin className="h-4 w-4" />} />
                            </FormControl>
                             <FormMessage />
                          </FormItem>
                        )} />
                         <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="city" render={({ field }) => (
                              <FormItem>
                                <FormLabel>City</FormLabel>
                                <FormControl>
                                  <Input placeholder="Metropolis" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )} />
                           <FormField control={form.control} name="postalCode" render={({ field }) => (
                              <FormItem>
                                <FormLabel>Postal Code</FormLabel>
                                <FormControl>
                                  <Input placeholder="12345" {...field} />
                                </FormControl>
                                 <FormMessage />
                              </FormItem>
                            )} />
                         </div>
                      </CardContent>
                      <CardFooter>
                        <Button type="submit" className="w-full">Continue to Payment</Button>
                      </CardFooter>
                    </form>
                  </Form>
                </Card>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="glass-card-dark">
                  <CardHeader>
                    <CardTitle className="text-2xl">2. Payment Method</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
                      <AccordionItem value="item-1">
                        <AccordionTrigger><div className="flex items-center gap-2"><CreditCard /> Credit Card</div></AccordionTrigger>
                        <AccordionContent className="pt-4">
                          <CheckoutButton />
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-2">
                        <AccordionTrigger><div className="flex items-center gap-2"><Shield /> Local Payments</div></AccordionTrigger>
                        <AccordionContent className="pt-4 space-y-2">
                          <EsewaButton />
                          <KhaltiButton />
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                  <CardFooter>
                     <Button variant="outline" onClick={() => setCurrentStep(1)} className="w-full">Back to Shipping</Button>
                  </CardFooter>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

// Helper component for icon inputs
const IconInput = React.forwardRef<HTMLInputElement, React.ComponentPropsWithoutRef<typeof Input> & { icon: React.ReactNode }>(({ icon, ...props }, ref) => {
  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
        {icon}
      </div>
      <Input {...props} ref={ref} className="pl-10" />
    </div>
  )
});
IconInput.displayName = "IconInput";
