// src/pages/Home.jsx
import { useEffect, useState } from 'react';
import SEOTable from '../components/SEOTable';
import Filters from '../components/Filters';

function Home() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keywordFilter, setKeywordFilter] = useState('');
  const fetchSEOData = async () => {
    try {
      const res = await fetch('http://localhost:3001/search-console-data');
      const json = await res.json();
      setData(json.rows || []);
    } catch (err) {
      console.error('Failed to fetch SEO data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSEOData();
    const interval = setInterval(fetchSEOData, 60000); // auto refresh every 60 sec
    return () => clearInterval(interval);
  }, []);
  console.log(data);
  //
  const filteredData = data.filter((row) =>
    row.keys[0].toLowerCase().includes(keywordFilter.toLowerCase())
  );

  return (
    <div className="px-4 flex min-h-screen justify-center align-center items-center flex-col min-w-screen">
      <h1 className="text-4xl p-4 border-2  text-orange-400 font-bold mb-4">
        SEO DASHBOARD
      </h1>
      <Filters
        className="m-10 p-2"
        keywordFilter={keywordFilter}
        onKeywordChange={setKeywordFilter}
      />
      <div className="max-w-4xl w-full">
        {loading ? <p>Loading...</p> : <SEOTable data={filteredData} />}
      </div>
    </div>
  );
}

export default Home;
