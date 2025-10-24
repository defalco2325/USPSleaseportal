import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { ArrowRight, ArrowLeft, Calculator, CheckCircle2 } from "lucide-react";

// Stage 1: Contact Information
const stage1Schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
});

// Stage 2: Property Details
const stage2Schema = z.object({
  propertyAddress: z.string().min(1, "Property address is required"),
  annualRent: z.coerce.number().min(0, "Annual rent must be positive"),
  annualPropertyTaxes: z.coerce.number().min(0, "Property taxes must be positive"),
  taxesReimbursed: z.boolean().default(false),
  annualInsurance: z.coerce.number().min(0, "Insurance cost must be positive"),
  squareFootage: z.coerce.number().min(1, "Square footage must be positive"),
});

type Stage1Data = z.infer<typeof stage1Schema>;
type Stage2Data = z.infer<typeof stage2Schema>;

export default function ValuationForm() {
  const [stage, setStage] = useState<1 | 2 | 3>(1);
  const [valuationId, setValuationId] = useState<string | null>(null);
  const [stage1Data, setStage1Data] = useState<Stage1Data | null>(null);
  const [calculatedValues, setCalculatedValues] = useState<{
    lowEstimate: number;
    highEstimate: number;
  } | null>(null);
  const { toast } = useToast();

  const stage1Form = useForm<Stage1Data>({
    resolver: zodResolver(stage1Schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    },
  });

  const stage2Form = useForm<Stage2Data>({
    resolver: zodResolver(stage2Schema),
    defaultValues: {
      propertyAddress: "",
      annualRent: 0,
      annualPropertyTaxes: 0,
      taxesReimbursed: false,
      annualInsurance: 0,
      squareFootage: 0,
    },
  });

  const createValuationMutation = useMutation({
    mutationFn: async (data: Stage1Data) => {
      const res = await apiRequest("POST", "/api/valuations", {
        ...data,
        stage1Completed: true,
        stage2Completed: false,
      });
      return await res.json();
    },
    onSuccess: (data: any) => {
      setValuationId(data.id);
      setStage1Data(stage1Form.getValues());
      setStage(2);
      toast({
        title: "Contact information saved",
        description: "Let's gather your property details to calculate the valuation.",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save your information. Please try again.",
      });
    },
  });

  const updateValuationMutation = useMutation({
    mutationFn: async (data: Stage2Data) => {
      if (!valuationId) throw new Error("No valuation ID");

      // Calculate values using the formula
      const { annualRent, annualPropertyTaxes, taxesReimbursed, annualInsurance, squareFootage } = data;
      
      const maintenanceCost = squareFootage * 1.75;
      const taxesToSubtract = taxesReimbursed ? 0 : annualPropertyTaxes;
      const netOperatingIncome = annualRent - taxesToSubtract - annualInsurance - maintenanceCost;
      
      const lowEstimatedValue = Math.round(netOperatingIncome / 0.12);
      const highEstimatedValue = Math.round(netOperatingIncome / 0.08);

      const res = await apiRequest("PATCH", `/api/valuations/${valuationId}`, {
        ...data,
        lowEstimatedValue,
        highEstimatedValue,
        stage2Completed: true,
      });
      return await res.json();
    },
    onSuccess: (data: any) => {
      setCalculatedValues({
        lowEstimate: data.lowEstimatedValue,
        highEstimate: data.highEstimatedValue,
      });
      setStage(3);
      toast({
        title: "Valuation calculated!",
        description: "Here's your estimated property value range.",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to calculate valuation. Please try again.",
      });
    },
  });

  const onStage1Submit = (data: Stage1Data) => {
    createValuationMutation.mutate(data);
  };

  const onStage2Submit = (data: Stage2Data) => {
    updateValuationMutation.mutate(data);
  };

  if (stage === 3 && calculatedValues) {
    return (
      <Card className="p-8 md:p-12 max-w-2xl mx-auto">
        <div className="text-center space-y-6 animate-fade-in">
          <CheckCircle2 className="w-16 h-16 text-primary mx-auto" />
          <h2 className="text-3xl font-bold text-foreground">Your Property Valuation</h2>
          <p className="text-muted-foreground">
            Based on the information provided, here's your estimated property value range:
          </p>

          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <Card className="p-6 border-2 border-primary/20">
              <p className="text-sm font-semibold text-muted-foreground mb-2">Conservative Estimate</p>
              <p className="text-4xl font-bold text-foreground" data-testid="text-low-estimate">
                ${calculatedValues.lowEstimate.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground mt-2">12% cap rate</p>
            </Card>

            <Card className="p-6 border-2 border-primary">
              <p className="text-sm font-semibold text-primary mb-2">Optimistic Estimate</p>
              <p className="text-4xl font-bold text-foreground" data-testid="text-high-estimate">
                ${calculatedValues.highEstimate.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground mt-2">8% cap rate</p>
            </Card>
          </div>

          <div className="bg-muted/50 rounded-lg p-6 mt-8 text-left">
            <h3 className="font-semibold text-foreground mb-3">What happens next?</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Our team will review your property details within 24-48 hours</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>We'll connect you with qualified buyers from our nationwide network</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>You'll receive a no-obligation cash offer with zero broker fees</span>
              </li>
            </ul>
          </div>

          <p className="text-sm text-muted-foreground mt-6">
            Thank you for submitting your information. Our team will contact you at <strong>{stage1Data?.email}</strong> with next steps.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-8 md:p-12 max-w-2xl mx-auto">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className={`text-sm font-medium ${stage >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
            Contact Info
          </span>
          <span className={`text-sm font-medium ${stage >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
            Property Details
          </span>
          <span className={`text-sm font-medium ${stage >= 3 ? 'text-primary' : 'text-muted-foreground'}`}>
            Results
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-500"
            style={{ width: `${(stage / 3) * 100}%` }}
          />
        </div>
      </div>

      {/* Stage 1: Contact Information */}
      {stage === 1 && (
        <div className="space-y-6 animate-fade-in-up">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Get Your Free Property Valuation</h2>
            <p className="text-muted-foreground">
              Start by telling us a little about yourself. We'll save your progress so you can complete this later if needed.
            </p>
          </div>

          <Form {...stage1Form}>
            <form onSubmit={stage1Form.handleSubmit(onStage1Submit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={stage1Form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} data-testid="input-first-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={stage1Form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Smith" {...field} data-testid="input-last-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={stage1Form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john@example.com" {...field} data-testid="input-email" />
                    </FormControl>
                    <FormDescription>We'll send your valuation report to this email</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={stage1Form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number (Optional)</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="(555) 123-4567" {...field} data-testid="input-phone" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                size="lg"
                className="w-full group"
                disabled={createValuationMutation.isPending}
                data-testid="button-continue-stage1"
              >
                {createValuationMutation.isPending ? "Saving..." : "Continue to Property Details"}
                <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </form>
          </Form>
        </div>
      )}

      {/* Stage 2: Property Details */}
      {stage === 2 && (
        <div className="space-y-6 animate-fade-in-up">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Property Information</h2>
            <p className="text-muted-foreground">
              Provide details about your USPS-leased property to calculate your valuation.
            </p>
          </div>

          <Form {...stage2Form}>
            <form onSubmit={stage2Form.handleSubmit(onStage2Submit)} className="space-y-6">
              <FormField
                control={stage2Form.control}
                name="propertyAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Address</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Main St, City, State ZIP" {...field} data-testid="input-address" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={stage2Form.control}
                  name="annualRent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Annual Rent</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                          <Input type="number" placeholder="120000" {...field} className="pl-7" data-testid="input-annual-rent" />
                        </div>
                      </FormControl>
                      <FormDescription>Total yearly rental income</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={stage2Form.control}
                  name="squareFootage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Square Footage</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input type="number" placeholder="5000" {...field} data-testid="input-square-footage" />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">sq ft</span>
                        </div>
                      </FormControl>
                      <FormDescription>Interior square footage</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={stage2Form.control}
                name="annualPropertyTaxes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Annual Property Taxes</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                        <Input type="number" placeholder="8000" {...field} className="pl-7" data-testid="input-property-taxes" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={stage2Form.control}
                name="taxesReimbursed"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-border p-4 bg-muted/30">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        data-testid="checkbox-taxes-reimbursed"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Property taxes are reimbursed by USPS
                      </FormLabel>
                      <FormDescription>
                        Check this if USPS reimburses your property taxes
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={stage2Form.control}
                name="annualInsurance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Annual Insurance Cost</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                        <Input type="number" placeholder="3000" {...field} className="pl-7" data-testid="input-insurance" />
                      </div>
                    </FormControl>
                    <FormDescription>Yearly property insurance premium</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => setStage(1)}
                  className="flex-1"
                  data-testid="button-back-stage2"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back
                </Button>

                <Button
                  type="submit"
                  size="lg"
                  className="flex-1 group"
                  disabled={updateValuationMutation.isPending}
                  data-testid="button-calculate"
                >
                  <Calculator className="w-5 h-5 mr-2" />
                  {updateValuationMutation.isPending ? "Calculating..." : "Calculate Valuation"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      )}
    </Card>
  );
}
