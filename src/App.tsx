import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { jsPDF } from "jspdf";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { faker } from "@faker-js/faker";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

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
import { useEffect, useState, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import imgUrl from "./assets/img.png";

const formSchema = z
  .object({
    name: z.string().min(1),
    number: z.coerce.number().positive().int(),
    date: z.date(),
    freeText: z.string().optional(),
  })
  .required();
type FormSchema = z.infer<typeof formSchema>;

function App() {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: faker.person.fullName(),
      number: faker.number.int({ min: 1, max: 100 }),
      date: new Date(),
      freeText: faker.lorem.paragraphs(10),
    },
  });

  const ref = useRef<HTMLDivElement>(null);

  const [pdfDataUrl, setPdfDataUrl] = useState<string>();
  const [pdfDoc, setPdfDoc] = useState<jsPDF>();

  function generatePdf(formData?: Partial<FormSchema>) {
    const doc = new jsPDF({ format: "legal" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const middle = pageWidth / 2;

    doc
      .setFont("Helvetica", "bold")
      .setFontSize(16)
      .text("Generated PDF", 20, 20)
      .addImage(imgUrl, "PNG", middle - 10, 80, 20, 20)
      .setFont("Helvetica", "normal")
      .setFontSize(12)
      .text(`Name: ${formData?.name ?? ""}`, 20, 40)
      .text(`Number: ${formData?.number?.toString() ?? ""}`, 20, 50)
      .text(
        `Date: ${formData?.date ? format(formData.date, "PPP") : ""}`,
        20,
        60
      )
      .text(`Free text: ${formData?.freeText ?? ""}`, 20, 70, {
        maxWidth: pageWidth - 40,
      })
      .text("This is a footer", 20, pageHeight - 20);

    const pdfUrl = doc.output("dataurlstring");
    setPdfDataUrl(pdfUrl);
    setPdfDoc(doc);
    return doc;
  }

  function onSubmit(values: FormSchema) {
    generatePdf(values);
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }

  function downloadPdf() {
    if (pdfDoc) {
      pdfDoc.save("generated.pdf");
    } else {
      generatePdf(form.getValues()).save("generated.pdf");
    }
  }

  useEffect(() => {
    generatePdf(form.getValues());
  }, [form]);

  return (
    <div className="container mx-auto">
      <main className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="flex flex-col gap-4 overflow-auto max-h-screen">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Form to PDF Prototype
          </h1>
          <section className="my-2">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
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
                  name="number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Number" {...field} />
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
                      <FormLabel>Date</FormLabel>
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
                <FormField
                  control={form.control}
                  name="freeText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Free text</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Free text"
                          {...field}
                          className="h-60"
                        />
                      </FormControl>
                      <FormDescription>
                        A sample textarea input.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-2 flex-row-reverse">
                  <Button type="button" onClick={() => downloadPdf()}>
                    Download
                  </Button>
                  <Button type="submit" variant="secondary">
                    Preview
                  </Button>
                </div>
              </form>
            </Form>
          </section>
        </div>
        <section className="overflow-auto max-h-screen">
          {pdfDataUrl && (
            <div
              ref={ref}
              className="border-input border my-2 px-3 py-1 w-full rounded-md bg-transparent"
            >
              <Document file={pdfDataUrl}>
                <Page pageNumber={1} />
              </Document>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
