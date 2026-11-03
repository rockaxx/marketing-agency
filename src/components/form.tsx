"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Script from "next/script";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowUpRight, CheckCircle2, LoaderCircle } from "lucide-react";
import {
  contactSchema,
  type ContactInput,
  serviceIds,
  budgetIds,
} from "@/lib/validation";
import { type Locale, href } from "@/i18n/routing";
import { messages } from "@/i18n/messages";
const botKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
declare global {
  interface Window {
    turnstile?: {
      render: (
        element: HTMLElement,
        options: Record<string, unknown>,
      ) => string;
      reset: (id?: string) => void;
      remove: (id: string) => void;
    };
  }
}
function BotCheck({
  locale,
  onToken,
}: {
  locale: Locale;
  onToken: (token: string) => void;
}) {
  const container = useRef<HTMLDivElement>(null);
  const widget = useRef<string | undefined>(undefined);
  useEffect(
    () => () => {
      if (widget.current) {
        window.turnstile?.remove(widget.current);
        widget.current = undefined;
      }
    },
    [],
  );
  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onReady={() => {
          if (container.current && window.turnstile && !widget.current)
            widget.current = window.turnstile.render(container.current, {
              sitekey: botKey,
              language: locale,
              size: "compact",
              callback: onToken,
              "expired-callback": () => onToken(""),
              "error-callback": () => onToken(""),
            });
        }}
      />
      <div ref={container} className="bot-verification" />
    </>
  );
}
export function ContactForm({
  locale,
  service,
}: {
  locale: Locale;
  service?: string;
}) {
  const t = messages[locale].form;
  const [state, setState] = useState("");
  const [botError, setBotError] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    reset,
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema(locale)),
    defaultValues: {
      locale,
      name: "",
      email: "",
      company: "",
      service: serviceIds.includes(service as (typeof serviceIds)[number])
        ? (service as ContactInput["service"])
        : undefined,
      website: "",
      budget: "",
      method: "",
      description: "",
      honeypot: "",
      startedAt: 0,
      turnstileToken: "",
    },
  });
  useEffect(() => {
    setValue("startedAt", Date.now());
  }, [setValue]);
  const onToken = useCallback(
    (token: string) => {
      setValue("turnstileToken", token);
      if (token) setBotError(false);
    },
    [setValue],
  );
  async function submit(data: ContactInput) {
    setState("");
    if (botKey && !data.turnstileToken) {
      setBotError(true);
      return;
    }
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      setState(
        response.ok && result.code === "sent"
          ? "success"
          : result.code === "configuration"
            ? "configuration"
            : result.code === "spam"
              ? "spam"
              : result.code === "rate"
                ? "rate"
                : "error",
      );
      if (botKey) {
        window.turnstile?.reset();
        setValue("turnstileToken", "");
      }
    } catch {
      setState("error");
    }
  }
  const error = (name: keyof ContactInput) =>
    errors[name] ? (
      <span role="alert" className="field-error" id={`${name}-error`}>
        {errors[name]?.message}
      </span>
    ) : null;
  const props = (name: keyof ContactInput) => ({
    "aria-invalid": !!errors[name],
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
  });
  if (state === "success")
    return (
      <div className="form-success" role="status" tabIndex={-1}>
        <CheckCircle2 size={40} />
        <h2>{locale === "sk" ? "Dopyt odoslaný." : "Inquiry sent."}</h2>
        <p>{t.success}</p>
        <button
          className="pill"
          onClick={() => {
            reset({
              locale,
              startedAt: Date.now(),
              honeypot: "",
              turnstileToken: "",
              website: "",
              budget: "",
              method: "",
              name: "",
              email: "",
              company: "",
              description: "",
            });
            setState("");
          }}
        >
          {t.retry}
          <ArrowUpRight size={18} />
        </button>
      </div>
    );
  return (
    <form className="contact-form" noValidate onSubmit={handleSubmit(submit)}>
      <p className="form-required">{t.required}</p>
      <div className="form-grid">
        <div className="field">
          <label htmlFor="name">{t.name} *</label>
          <input
            id="name"
            autoComplete="name"
            maxLength={120}
            {...register("name")}
            {...props("name")}
          />
          {error("name")}
        </div>
        <div className="field">
          <label htmlFor="email">{t.email} *</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            maxLength={254}
            {...register("email")}
            {...props("email")}
          />
          {error("email")}
        </div>
        <div className="field">
          <label htmlFor="company">{t.company} *</label>
          <input
            id="company"
            autoComplete="organization"
            maxLength={180}
            {...register("company")}
            {...props("company")}
          />
          {error("company")}
        </div>
        <div className="field">
          <label htmlFor="service">{t.service} *</label>
          <select id="service" {...register("service")} {...props("service")}>
            <option value="">{t.select}</option>
            {serviceIds.map((v, i) => (
              <option key={v} value={v}>
                {t.services[i]}
              </option>
            ))}
          </select>
          {error("service")}
        </div>
        <div className="field">
          <label htmlFor="website">
            {t.website} <small>({t.optional})</small>
          </label>
          <input
            id="website"
            type="url"
            autoComplete="url"
            placeholder="https://"
            {...register("website")}
            {...props("website")}
          />
          {error("website")}
        </div>
        <div className="field">
          <label htmlFor="budget">
            {t.budget} <small>({t.optional})</small>
          </label>
          <select id="budget" {...register("budget")} {...props("budget")}>
            <option value="">{t.select}</option>
            {budgetIds.map((v, i) => (
              <option key={v} value={v}>
                {t.budgets[i]}
              </option>
            ))}
          </select>
          {error("budget")}
        </div>
        <div className="field full">
          <label htmlFor="method">
            {t.method} <small>({t.optional})</small>
          </label>
          <select id="method" {...register("method")}>
            <option value="">{t.select}</option>
            <option value="email">{t.methods[0]}</option>
            <option value="video">{t.methods[1]}</option>
          </select>
        </div>
        <div className="field full">
          <label htmlFor="description">{t.description} *</label>
          <textarea
            id="description"
            rows={5}
            maxLength={5000}
            placeholder={t.descriptionPlaceholder}
            {...register("description")}
            {...props("description")}
          />
          {error("description")}
        </div>
      </div>
      <div className="honeypot" aria-hidden="true">
        <label htmlFor="fax">Fax</label>
        <input
          id="fax"
          tabIndex={-1}
          autoComplete="off"
          {...register("honeypot")}
        />
      </div>
      {botKey && (
        <>
          <BotCheck key={locale} locale={locale} onToken={onToken} />
          {botError && (
            <p role="alert" className="field-error">
              {t.bot}
            </p>
          )}
        </>
      )}
      <p className="privacy-hint">
        {t.privacy} <Link href={href(locale, "privacy")}>{t.privacyLink}</Link>.
      </p>
      {state && (
        <p className="form-status" role="alert">
          {t[state as "error" | "configuration" | "spam" | "rate"]}
        </p>
      )}
      <button type="submit" className="pill" disabled={isSubmitting}>
        {isSubmitting ? (
          <LoaderCircle size={19} className="spin" />
        ) : (
          <span className="arrow-circle">
            <ArrowUpRight size={18} />
          </span>
        )}
        {isSubmitting ? t.sending : t.submit}
      </button>
    </form>
  );
}
