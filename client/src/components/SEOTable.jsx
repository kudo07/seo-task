// src/components/SEODataTable.jsx
function SEODataTable({ data }) {
  if (!data || data.length === 0) return <p>No data found.</p>;

  return (
    <div className="overflow-x-auto ">
      <table className="min-w-full bg-purple-50 shadow rounded">
        <thead>
          <tr className="bg-green-100 text-left text-sm uppercase tracking-wider">
            <th className="p-2">Keyword</th>
            <th className="p-2">Clicks</th>
            <th className="p-2">Impressions</th>
            <th className="p-2">CTR</th>
            <th className="p-2">Position</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="border-b text-sm hover:bg-gray-50">
              <td className="p-2">{row.keys[0]}</td>
              <td className="p-2">{row.clicks}</td>
              <td className="p-2">{row.impressions}</td>
              <td className="p-2">{(row.ctr * 100).toFixed(2)}%</td>
              <td className="p-2">{row.position.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SEODataTable;
