export default function Spinner() {
  return (
    <div className="flex flex-col items-center justify-center py-32">
      <div className="w-12 h-12 border-4 border-gray-700 border-t-veeam rounded-full animate-spin" />
      <p className="mt-4 text-gray-400 text-sm">Loading release data from GitHub...</p>
    </div>
  );
}
