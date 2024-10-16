export const LabelInput = ({ title, value, onChange }) => {
  return (
    <div className="flex flex-col gap-y-2 w-full">
      <p>{title}</p>
      <input className="h-12 rounded-lg border-gray-600 border-2" />
    </div>
  );
};
