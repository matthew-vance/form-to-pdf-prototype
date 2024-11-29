import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { date, z } from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { jsPDF } from "jspdf";

import { Button } from "@/components/ui/button";
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const formSchema = z
  .object({
    name: z.string().min(1),
    age: z.coerce.number().positive().int(),
    date: date(),
  })
  .required();
type FormSchema = z.infer<typeof formSchema>;

function App() {
  const [pdfDataUrl, setPdfDataUrl] = useState<string>();

  function generatePdf(formData?: Partial<FormSchema>) {
    const doc = new jsPDF();

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Generated PDF", 20, 20);
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Name: ${formData?.name ?? ""}`, 20, 40);
    doc.text(`Age: ${formData?.age?.toString() ?? ""}`, 20, 50);
    doc.text(
      `Date: ${formData?.date ? format(formData.date, "PPP") : ""}`,
      20,
      60
    );

    const pdfUrl = doc.output("dataurlstring");
    setPdfDataUrl(pdfUrl);
  }

  useEffect(() => {
    generatePdf();
  }, []);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(values: FormSchema) {
    generatePdf(values);
  }

  function TypographyH1({ children }: { children: React.ReactNode }) {
    return (
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        {children}
      </h1>
    );
  }

  function TypographyH2({ children }: { children: React.ReactNode }) {
    return (
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        {children}
      </h2>
    );
  }

  return (
    <div className="container mx-auto px-4 flex flex-col gap-4">
      <header>
        <TypographyH1>Header</TypographyH1>
      </header>
      <main className="flex gap-8">
        <section className="w-1/3">
          <TypographyH2>Form side</TypographyH2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Name" {...field} />
                    </FormControl>
                    <FormDescription>Sample text input.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Age" {...field} />
                    </FormControl>
                    <FormDescription>Sample number input.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date of birth</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>Sample date input.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </section>
        <section className="w-2/3 flex flex-col">
          <TypographyH2>Preview side</TypographyH2>
          {pdfDataUrl && (
            <iframe
              src={pdfDataUrl}
              title="PDF Preview"
              className="w-full h-full"
            />
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
