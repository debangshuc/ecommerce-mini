import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page grid min-h-[60vh] place-items-center py-16">
      <div className="text-center">
        <p className="text-sm font-bold uppercase tracking-widest text-lavender-600">
          Error 404
        </p>
        <h1 className="mt-3 text-3xl font-bold">Page not found</h1>
        <p className="mt-3 text-ink-soft">
          Sorry, we couldn’t find the page you’re looking for.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-lavender-600 px-6 text-sm font-semibold text-white transition-colors hover:bg-lavender-700"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}