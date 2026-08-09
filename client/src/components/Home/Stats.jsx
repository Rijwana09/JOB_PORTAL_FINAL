const stats = [
  { value: "10K+", label: "Jobs" },
  { value: "5K+", label: "Companies" },
  { value: "50K+", label: "Students" },
  { value: "95%", label: "Success Rate" },
];

export default function Stats() {
  return (
    <section className="bg-blue-600 py-20 text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 text-center md:grid-cols-4">
        {stats.map((item) => (
          <div key={item.label}>
            <h2 className="text-5xl font-bold">
              {item.value}
            </h2>

            <p className="mt-3 text-lg">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}