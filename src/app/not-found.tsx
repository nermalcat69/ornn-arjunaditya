import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16 text-sm text-neutral-700">
      <p>Page not found.</p>
      <Link
        href="/"
        className="mt-2 inline-block text-neutral-500 underline hover:text-neutral-900"
      >
        Back home
      </Link>
    </div>
  );
}
