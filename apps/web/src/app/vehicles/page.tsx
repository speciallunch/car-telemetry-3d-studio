type Vehicle = {
  id: string;
  vin: string;
  name: string;
  model: string;
  year: number;
};

export default async function VehiclesPage() {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL!;
  const res = await fetch(`${base}/vehicles`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch vehicles");
  const vehicles: Vehicle[] = await res.json();

  return (
    <main style={{ padding: 24 }}>
      <h1>Vehicles</h1>
      <ul>
        {vehicles.map((v) => (
          <li key={v.id}>
            <a href={`/vehicles/${v.id}`}>
              {v.name} ({v.model} {v.year}) — {v.vin}
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
