"use client";

export default function Error({ reset }) {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="rounded-lg bg-white p-8 text-center shadow-lg">
        <h2 className="mb-4 text-2xl font-bold text-primary-100">
          Something went wrong!
        </h2>
        <p className="mb-6 text-gray-600">Please try again</p>
        <button
          onClick={() => reset()}
          className="rounded-full bg-darkPink px-6 py-3 font-semibold text-primary-100 hover:bg-primary-100 border border-primary-100 hover:text-white transition-all cursor-pointer focus:outline-none focus:ring-2"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
