
import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  validateCard,
  formatCardNumber,
  maskCardNumber,
  getCardType
} from "@/utils/cardValidation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Update the schema with stricter validation
const cardFormSchema = z.object({
  cardNumber: z.string()
    .min(15, "Card number must be at least 15 digits")
    .max(19, "Card number cannot exceed 19 digits")
    .refine(value => /^[0-9\s]+$/.test(value.replace(/\s/g, '')), {
      message: "Card number must contain only digits"
    }),
  cardName: z.string()
    .min(2, "Name must be at least 2 characters")
    .refine(value => !/\d/.test(value), {
      message: "Name cannot contain numbers"
    }),
  expiryMonth: z.string(),
  expiryYear: z.string(),
  cvv: z.string()
    .min(3, "CVV must be at least 3 digits")
    .max(4, "CVV cannot exceed 4 digits")
    .refine(value => /^[0-9]+$/.test(value), {
      message: "CVV must contain only digits"
    }),
  nickname: z.string().min(1, "Please provide a name for this payment method"),
});

export type CardFormValues = z.infer<typeof cardFormSchema>;

interface CardFormProps {
  onSubmit: (values: CardFormValues) => void;
}

export const CardForm: React.FC<CardFormProps> = ({ onSubmit }) => {
  const [cardType, setCardType] = useState<string>("");
  const [formattedCardNumber, setFormattedCardNumber] = useState<string>("");

  const form = useForm<CardFormValues>({
    resolver: zodResolver(cardFormSchema),
    defaultValues: {
      cardNumber: "",
      cardName: "",
      expiryMonth: "",
      expiryYear: "",
      cvv: "",
      nickname: "",
    },
  });

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setFormattedCardNumber(formatted);
    setCardType(getCardType(formatted));
    form.setValue('cardNumber', formatted);
  };

  const handleSubmit = (values: CardFormValues) => {
    const validationErrors = validateCard(values);
    
    if (Object.keys(validationErrors).length > 0) {
      Object.entries(validationErrors).forEach(([key, value]) => {
        form.setError(key as any, { message: value });
      });
      return;
    }

    onSubmit(values);
    form.reset();
    setCardType("");
    setFormattedCardNumber("");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="nickname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Card Nickname</FormLabel>
              <FormControl>
                <Input placeholder="e.g. My Personal Card" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cardNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Card Number {cardType && `(${cardType})`}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="1234 5678 9012 3456"
                  value={formattedCardNumber}
                  onChange={handleCardNumberChange}
                  onBlur={() => {
                    if (formattedCardNumber) {
                      setFormattedCardNumber(maskCardNumber(formattedCardNumber));
                    }
                  }}
                  onFocus={() => {
                    setFormattedCardNumber(field.value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cardName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name on Card</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="expiryMonth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Month</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="MM" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Array.from({length: 12}, (_, i) => {
                      const month = (i + 1).toString().padStart(2, '0');
                      return (
                        <SelectItem key={month} value={month}>
                          {month}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="expiryYear"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Year</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="YY" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Array.from({length: 10}, (_, i) => {
                      const year = (new Date().getFullYear() + i).toString().slice(-2);
                      return (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cvv"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CVV</FormLabel>
                <FormControl>
                  <Input placeholder="123" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
};
