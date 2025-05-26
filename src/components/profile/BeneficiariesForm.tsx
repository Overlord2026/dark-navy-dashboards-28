import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
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
import { useState } from "react";
import { BeneficiaryList } from "./BeneficiaryList";
import { BeneficiaryFormHeader } from "./BeneficiaryFormHeader";
import { BeneficiaryFormActions } from "./BeneficiaryFormActions";
import { DateOfBirthField } from "./DateOfBirthField";
import { 
  beneficiarySchema, 
  Beneficiary, 
  defaultBeneficiaryValues 
} from "./beneficiarySchema";

export function BeneficiariesForm({ onSave }: { onSave: () => void }) {
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [currentBeneficiary, setCurrentBeneficiary] = useState<Beneficiary | null>(null);

  const form = useForm<Beneficiary>({
    resolver: zodResolver(beneficiarySchema),
    defaultValues: defaultBeneficiaryValues,
  });

  function onSubmit(values: Beneficiary) {
    if (currentBeneficiary) {
      // Update existing beneficiary
      setBeneficiaries(prev => 
        prev.map(b => 
          b === currentBeneficiary ? values : b
        )
      );
      setCurrentBeneficiary(null);
    } else {
      // Add new beneficiary
      setBeneficiaries(prev => [...prev, values]);
    }
    
    form.reset(defaultBeneficiaryValues);
  }

  function handleRemoveBeneficiary(beneficiary: Beneficiary) {
    setBeneficiaries(prev => prev.filter(b => b !== beneficiary));
    if (currentBeneficiary === beneficiary) {
      setCurrentBeneficiary(null);
      form.reset(defaultBeneficiaryValues);
    }
  }

  function handleEditBeneficiary(beneficiary: Beneficiary) {
    setCurrentBeneficiary(beneficiary);
    form.reset(beneficiary);
  }

  function handleCancelEdit() {
    setCurrentBeneficiary(null);
    form.reset(defaultBeneficiaryValues);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Provide your beneficiary information</h2>
        <p className="text-sm text-muted-foreground mt-1">
          You can add or remove beneficiaries from your profile. Ask your advisor to assign a
          beneficiary to a specific account.
        </p>
      </div>
      
      <BeneficiaryList 
        beneficiaries={beneficiaries}
        onEdit={handleEditBeneficiary}
        onRemove={handleRemoveBeneficiary}
      />
      
      <BeneficiaryFormHeader 
        isEditing={currentBeneficiary !== null}
        onCancelEdit={handleCancelEdit}
      />
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="First name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Last name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="relationship"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Relationship to Beneficiary</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select relationship" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Spouse">Spouse</SelectItem>
                      <SelectItem value="Child">Child</SelectItem>
                      <SelectItem value="Parent">Parent</SelectItem>
                      <SelectItem value="Sibling">Sibling</SelectItem>
                      <SelectItem value="Other Relative">Other Relative</SelectItem>
                      <SelectItem value="Friend">Friend</SelectItem>
                      <SelectItem value="Trust">Trust</SelectItem>
                      <SelectItem value="Organization">Organization</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DateOfBirthField form={form} />
            
            <FormField
              control={form.control}
              name="ssn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SSN (or ITIN)</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="SSN or ITIN" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Email address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Street address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="address2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address 2 (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Apt, suite, unit, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="City" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="AL">Alabama</SelectItem>
                      <SelectItem value="AK">Alaska</SelectItem>
                      <SelectItem value="AZ">Arizona</SelectItem>
                      <SelectItem value="AR">Arkansas</SelectItem>
                      <SelectItem value="CA">California</SelectItem>
                      <SelectItem value="CO">Colorado</SelectItem>
                      <SelectItem value="CT">Connecticut</SelectItem>
                      <SelectItem value="DE">Delaware</SelectItem>
                      <SelectItem value="FL">Florida</SelectItem>
                      <SelectItem value="GA">Georgia</SelectItem>
                      {/* Other states would be added here */}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="zipCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Zip Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Zip code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <BeneficiaryFormActions 
            isEditing={currentBeneficiary !== null}
            hasBeneficiaries={beneficiaries.length > 0}
            onSave={onSave}
          />
        </form>
      </Form>
    </div>
  );
}
