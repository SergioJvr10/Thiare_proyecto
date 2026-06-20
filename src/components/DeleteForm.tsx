type DeleteFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  id: string;
  idFieldName?: string;
  extraFields?: Record<string, string>;
  label?: string;
  className?: string;
};

export function DeleteForm({
  action,
  id,
  idFieldName = "id",
  extraFields,
  label = "Eliminar",
  className = "text-xs text-stone-400 hover:text-rose-600",
}: DeleteFormProps) {
  return (
    <form action={action}>
      <input type="hidden" name={idFieldName} value={id} />
      {extraFields &&
        Object.entries(extraFields).map(([name, value]) => (
          <input key={name} type="hidden" name={name} value={value} />
        ))}
      <button type="submit" className={className}>
        {label}
      </button>
    </form>
  );
}
