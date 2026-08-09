export default function Footer() {
  return (
    <footer className="border-t py-8">
      <div className="mx-auto max-w-7xl px-6">

        <h2 className="text-xl font-bold">
          MERN Job Portal
        </h2>

        <p className="mt-2 text-gray-500">
          Build your career with confidence.
        </p>

        <p className="mt-6 text-sm text-gray-400">
          © {new Date().getFullYear()} MERN Job Portal.
          All rights reserved.
        </p>

      </div>
    </footer>
  );
}