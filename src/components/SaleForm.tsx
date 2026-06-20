"use client";

type ProductOption = { id: string; name: string; salePrice: number };

export function SaleForm({
  products,
  today,
  action,
}: {
  products: ProductOption[];
  today: string;
  action: (formData: FormData) => void | Promise<void>;
}) {
  return (
    <form
      action={action}
      className="mb-8 space-y-3 rounded-2xl border border-rose-100 bg-white p-4 shadow-sm"
    >
      <p className="font-semibold text-stone-900">Registrar venta</p>
      <select
        name="productId"
        required
        className="w-full rounded-xl border border-stone-200 px-3 py-2.5"
        onChange={(e) => {
          const opt = e.target.selectedOptions[0];
          const price = opt?.dataset.price;
          const input = document.getElementById("unitPrice") as HTMLInputElement | null;
          if (price && input) input.value = price;
        }}
      >
        <option value="">Producto</option>
        {products.map((p) => (
          <option key={p.id} value={p.id} data-price={String(p.salePrice)}>
            {p.name}
          </option>
        ))}
      </select>
      <div className="grid grid-cols-2 gap-3">
        <input
          name="quantity"
          type="number"
          min="1"
          step="1"
          placeholder="Cantidad"
          defaultValue={1}
          required
          className="rounded-xl border border-stone-200 px-3 py-2.5"
        />
        <input
          id="unitPrice"
          name="unitPrice"
          type="number"
          min="1"
          step="1"
          placeholder="Precio unitario ($)"
          required
          className="rounded-xl border border-stone-200 px-3 py-2.5"
        />
      </div>
      <input
        name="date"
        type="date"
        defaultValue={today}
        className="w-full rounded-xl border border-stone-200 px-3 py-2.5"
      />
      <button
        type="submit"
        className="w-full rounded-xl bg-rose-600 py-3 font-semibold text-white hover:bg-rose-700"
      >
        Guardar venta
      </button>
    </form>
  );
}
