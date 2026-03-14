"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";

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
import { Textarea } from "@/components/ui/textarea";
import type { MarketingCopy } from "@/lib/data/marketing-copy";
import { contactFormSchema, type ContactFormValues } from "@/lib/validators/contact";

const initialValues: ContactFormValues = {
  name: "",
  email: "",
  company: "",
  message: "",
  locale: "es",
};

type SubmitState =
  | { type: "idle" }
  | { type: "success"; message: string }
  | { type: "error"; message: string };

export default function LeadForm({ copy, locale }: { copy: MarketingCopy; locale: ContactFormValues["locale"] }) {
  const [submitState, setSubmitState] = useState<SubmitState>({ type: "idle" });

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      ...initialValues,
      locale,
    },
  });

  const isSubmitting = form.formState.isSubmitting;
  const messageValue = useWatch({ control: form.control, name: "message" });
  const messageLength = messageValue?.length ?? 0;

  async function onSubmit(values: ContactFormValues) {
    if (isSubmitting) {
      return;
    }

    setSubmitState({ type: "idle" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = (await response.json()) as { error?: string; message?: string; success?: boolean };

      if (!response.ok || !data.success) {
        setSubmitState({
          type: "error",
          message: data.error ?? copy.lead_error_message,
        });
        return;
      }

      form.reset(initialValues);
      form.setValue("locale", locale);
      setSubmitState({
        type: "success",
        message: data.message ?? copy.lead_success_message,
      });
    } catch {
      setSubmitState({
        type: "error",
        message: copy.lead_error_message,
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <div className="grid gap-5 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{copy.lead_name_label}</FormLabel>
                <FormControl>
                  <Input placeholder={copy.lead_name_placeholder} autoComplete="name" {...field} />
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
                <FormLabel>{copy.lead_email_label}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={copy.lead_email_placeholder}
                    type="email"
                    autoComplete="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="company"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{copy.lead_company_label}</FormLabel>
              <FormControl>
                <Input placeholder={copy.lead_company_placeholder} autoComplete="organization" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between gap-3">
                <FormLabel>{copy.lead_message_label}</FormLabel>
                <span className="text-xs text-zinc-500">{messageLength}/2000</span>
              </div>
              <FormControl>
                <Textarea
                  placeholder={copy.lead_message_placeholder}
                  rows={6}
                  maxLength={2000}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {submitState.type === "error" ? (
          <div className="flex items-center gap-2 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {submitState.message}
          </div>
        ) : null}

        {submitState.type === "success" ? (
          <div className="flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            {submitState.message}
          </div>
        ) : null}

        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {isSubmitting ? copy.lead_submit_loading : copy.lead_submit_idle}
        </Button>
      </form>
    </Form>
  );
}
