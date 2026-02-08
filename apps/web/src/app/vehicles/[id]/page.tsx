type Telemetry = {
  id: string;
  speed: number;
  battery: number;
  latitude: number;
  longitude: number;
  timestamp: string;
};

export default async function VehicleTelemetryPage({
  params
}: {
  params: { id: string };
}) {
  const base = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL!;
  const res = await fetch(`${base}/vehicles/${params.id}/telemetry?limit=10`, {
    cache: "no-store"
  });
  if (!res.ok) throw new Error("Failed to fetch telemetry");
  const rows: Telemetry[] = await res.json();

  return (
    <main style={{ padding: 24 }}>
      <h1>Telemetry (latest 10)</h1>

      <table border={1} cellPadding={8}>
        <thead>
          <tr>
            <th>timestamp</th>
            <th>speed</th>
            <th>battery</th>
            <th>lat</th>
            <th>lon</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td>{new Date(r.timestamp).toLocaleString()}</td>
              <td>{r.speed}</td>
              <td>{r.battery}</td>
              <td>{r.latitude}</td>
              <td>{r.longitude}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
