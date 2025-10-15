export default function SellerOverview() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Overview</h1>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="rustic-card p-4">
          <div className="text-sm text-gray-500">Total Revenue (30d)</div>
          <div className="text-2xl font-semibold">$0.00</div>
        </div>
        <div className="rustic-card p-4">
          <div className="text-sm text-gray-500">Orders (30d)</div>
          <div className="text-2xl font-semibold">0</div>
        </div>
        <div className="rustic-card p-4">
          <div className="text-sm text-gray-500">Page Views (30d)</div>
          <div className="text-2xl font-semibold">0</div>
        </div>
      </div>
    </div>
  );
}
