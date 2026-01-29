'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export function ProductSort() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [sort, order] = e.target.value.split('-');
    const params = new URLSearchParams(searchParams.toString());

    params.set('sort', sort);
    params.set('order', order);
    params.set('page', '1');

    router.push(`/products?${params.toString()}`);
  };

  const currentSort = `${searchParams.get('sort') || 'created_at'}-${searchParams.get('order') || 'DESC'}`;

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort" className="text-sm font-medium">
        Sort by:
      </label>
      <select
        id="sort"
        value={currentSort}
        onChange={handleSortChange}
        className="border rounded-md px-3 py-1.5 text-sm bg-background"
      >
        <option value="created_at-DESC">Newest</option>
        <option value="created_at-ASC">Oldest</option>
        <option value="price-ASC">Price: Low to High</option>
        <option value="price-DESC">Price: High to Low</option>
        <option value="name-ASC">Name: A to Z</option>
        <option value="name-DESC">Name: Z to A</option>
      </select>
    </div>
  );
}
