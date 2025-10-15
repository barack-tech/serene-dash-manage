import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  dateOfDeath: z.string().min(1, "Date of death is required"),
  gender: z.string().min(1, "Gender is required"),
  identification: z.string().min(1, "Identification number is required"),
  causeOfDeath: z.string().min(1, "Cause of death is required"),
  nextOfKin: z.string().min(2, "Next of kin is required"),
  contactNumber: z.string().min(10, "Valid contact number is required"),
  address: z.string().min(5, "Address is required"),
  religion: z.string().optional(),
  notes: z.string().optional(),
});

export type DeceasedRecord = z.infer<typeof formSchema> & {
  id: string;
  admissionDate: string;
  status: "pending" | "processing" | "released";
};

interface DeceasedRecordFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Omit<DeceasedRecord, "id" | "admissionDate" | "status">) => void;
  initialData?: DeceasedRecord;
}

export function DeceasedRecordForm({
  open,
  onOpenChange,
  onSubmit,
  initialData,
}: DeceasedRecordFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      fullName: "",
      dateOfBirth: "",
      dateOfDeath: "",
      gender: "",
      identification: "",
      causeOfDeath: "",
      nextOfKin: "",
      contactNumber: "",
      address: "",
      religion: "",
      notes: "",
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values);
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Deceased Record" : "Add New Deceased Record"}
          </DialogTitle>
          <DialogDescription>
            Enter the details of the deceased individual. All fields marked with * are required.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Full Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dateOfDeath"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Death *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="identification"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ID/Passport Number *</FormLabel>
                    <FormControl>
                      <Input placeholder="ID123456789" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="causeOfDeath"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Cause of Death *</FormLabel>
                    <FormControl>
                      <Input placeholder="Natural causes" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="nextOfKin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Next of Kin *</FormLabel>
                    <FormControl>
                      <Input placeholder="Jane Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contactNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Number *</FormLabel>
                    <FormControl>
                      <Input placeholder="+1234567890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Address *</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Main Street, City" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="religion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Religion</FormLabel>
                    <FormControl>
                      <Input placeholder="Optional" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any additional information..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {initialData ? "Update Record" : "Add Record"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
