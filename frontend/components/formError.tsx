export function FormError({ error }: { error?: string[] }) {
  if (!error || error.length === 0) return null;

  return error.map((err, index) => (
    <div
      key={index}
      className="p-4 mb-4 text-xs italic text-pink-500 bg-red-100 rounded-lg"
      role="alert"
    >
      {err}
    </div>
  ));
}
