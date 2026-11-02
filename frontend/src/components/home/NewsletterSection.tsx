"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2, Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!EMAIL_PATTERN.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setSubscribed(true);
    setEmail("");
  };

  return (
    <section className="container-page py-12 lg:py-16">
      <div className="rounded-3xl bg-peach-100 px-6 py-12 text-center sm:px-12">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-white text-peach-600">
          <Mail size={26} />
        </span>
        <h2 className="mt-5 text-3xl font-bold">Get student deals in your inbox</h2>
        <p className="mx-auto mt-2 max-w-md text-ink-soft">
          Exam-season offers, new bundles and study tips. No spam, unsubscribe
          any time.
        </p>

        {subscribed ? (
          <p
            role="status"
            className="mx-auto mt-8 flex max-w-md items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-mint-600"
          >
            <CheckCircle2 size={18} /> You&apos;re subscribed. Thanks for joining!
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            noValidate
            className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
          >
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@college.edu"
              aria-label="Email address"
              className="h-12 flex-1 rounded-full border border-line bg-white px-5 text-sm focus:border-lavender-400 focus:outline-none focus:ring-4 focus:ring-lavender-100"
            />
            <Button type="submit" size="lg">
              Subscribe
            </Button>
          </form>
        )}
        {error && <p className="mt-3 text-sm font-medium text-danger">{error}</p>}
      </div>
    </section>
  );
}