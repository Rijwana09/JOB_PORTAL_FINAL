import { FaInbox } from "react-icons/fa";

export default function EmptyState({
  title = "No Data Found",
  description = "Nothing to display.",
}) {
  return (
    <div className="flex flex-col items-center py-20 text-center">
      <FaInbox className="text-6xl text-gray-400" />

      <h2 className="mt-5 text-2xl font-semibold">
        {title}
      </h2>

      <p className="mt-3 text-gray-500">
        {description}
      </p>
    </div>
  );
}