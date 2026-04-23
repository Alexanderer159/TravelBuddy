import { useState } from "react";
import { ArrowRight } from 'lucide-react';

const OTM_KEY = "5ae2e3f221c38a28845f05b643d8160b3dcf59de5b4d88db8e917930"; 

const COUNTRY_CODES = {
  "japan": "jp", "spain": "es", "france": "fr", "germany": "de",
  "italy": "it", "portugal": "pt", "united states": "us", "usa": "us",
  "united kingdom": "gb", "uk": "gb", "china": "cn", "australia": "au",
  "canada": "ca", "brazil": "br", "mexico": "mx", "india": "in",
  "thailand": "th", "indonesia": "id", "greece": "gr", "netherlands": "nl",
  "turkey": "tr", "south korea": "kr", "argentina": "ar", "egypt": "eg",
  "morocco": "ma", "south africa": "za", "switzerland": "ch", "sweden": "se",
  "norway": "no", "denmark": "dk", "poland": "pl", "austria": "at",
  "belgium": "be", "czech republic": "cz", "hungary": "hu", "romania": "ro",
  "croatia": "hr", "vietnam": "vn", "malaysia": "my", "singapore": "sg",
  "philippines": "ph", "new zealand": "nz", "peru": "pe", "colombia": "co",
  "chile": "cl", "ukraine": "ua", "russia": "ru", "israel": "il",
  "saudi arabia": "sa", "united arab emirates": "ae", "nigeria": "ng",
  "kenya": "ke", "pakistan": "pk",
};

async function geocodeCity(city, country) {
  const countryCode = COUNTRY_CODES[country.toLowerCase().trim()] || country.trim();
  const res = await fetch(
    `https://api.opentripmap.com/0.1/en/places/geoname?name=${encodeURIComponent(city.trim())}&country=${countryCode}&apikey=${OTM_KEY}`
  );
  return res.json();
}

async function fetchPlaces(lat, lon) {
  const res = await fetch(
    `https://api.opentripmap.com/0.1/en/places/radius?radius=5000&lon=${lon}&lat=${lat}&kinds=interesting_places,tourist_object,architecture,museums,historic,natural&rate=3&format=json&limit=20&apikey=${OTM_KEY}`
  );
  return res.json();
}

async function fetchPlaceDetail(xid) {
  const res = await fetch(
    `https://api.opentripmap.com/0.1/en/places/xid/${xid}?apikey=${OTM_KEY}`
  );
  return res.json();
}

async function fetchWikipediaImage(name) {
  try {
    // Search Wikipedia for the title
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=pageimages&piprop=thumbnail&pithumbsize=500&titles=${encodeURIComponent(name)}`;
    const res = await fetch(searchUrl);
    const data = await res.json();
    
    const pages = data.query.pages;
    const pageId = Object.keys(pages)[0];
    
    if (pageId !== "-1" && pages[pageId].thumbnail) {
      return pages[pageId].thumbnail.source;
    }
    
    // Fallback: If Wikipedia has nothing, use a high-quality generic travel image
    // This is better than a broken link or a boring emoji
    return `https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=500&q=80`;
  } catch (error) {
    return null;
  }
}

const Places = () => {

  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!city.trim() || !country.trim()) return;
    setLoading(true);
    setError(null);
    setPlaces([]);
    setSearched(true);

    try {
      // Step 1 — geocode the city
      const geo = await geocodeCity(city, country);
      if (!geo.lat) throw new Error(`Could not find "${city}, ${country}". Try a different spelling.`);

      // Step 2 — fetch nearby POIs
      const raw = await fetchPlaces(geo.lat, geo.lon);
      if (!raw.length) throw new Error("No interesting places found for this city.");

      // Step 3 — fetch details for each (in parallel, cap at 20)
      const details = await Promise.all(raw.map((p) => fetchPlaceDetail(p.xid)));

      // Step 4 — filter to ones that have a name and coords
const cleaned = await Promise.all(
  details
    .filter((p) => p.name && p.point)
    .map(async (p) => {

      const tags = p.kinds ? p.kinds.split(",").map(kind => 
        kind.replace(/_/g, " ") // replace underscores with spaces
      ) : [];
      
      return {
        xid: p.xid,
        name: p.name,
        lat: p.point.lat,
        lon: p.point.lon,
        tags: tags,
        description: p.wikipedia_extracts?.text || "Historical site",
      };
    })
);

      setPlaces(cleaned);
    } catch (e) {
      setError(e.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

const openInMaps = (lat, lon, name) => {
  window.open(
    `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`,
    "_blank"
  );
};

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">

{/* Header */}
      <p className="font-serif text-4xl font-normal text-center mb-1">Explore Places</p>
      <p className="text-center mb-8">Enter a country and city to find top attractions.</p>

{/* Search bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-10">
        <input type="text" placeholder="Country — e.g. Japan" value={country} onChange={(e) => setCountry(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm  focus:outline-none focus:border-gray-400 placeholder-gray-300"/>
        <input type="text" placeholder="City — e.g. Kyoto" value={city} onChange={(e) => setCity(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm  focus:outline-none focus:border-gray-400 placeholder-gray-300"/>
        <button onClick={handleSearch} disabled={loading || !city.trim() || !country.trim()}
          className="bg-gray-900 text-white rounded-xl px-6 py-2.5 text-sm font-medium hover:opacity-80 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed whitespace-nowrap">
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-100 text-red-400 text-sm rounded-xl px-4 py-3 mb-6">
          {error}
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-xl overflow-hidden bg-gray-50 border border-gray-100 animate-pulse">
              <div className="w-full h-36 bg-gray-100" />
              <div className="p-3 flex flex-col gap-2">
                <div className="h-3 bg-gray-100 rounded w-3/4" />
                <div className="h-2 bg-gray-100 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Results grid */}
      {!loading && places.length > 0 && (
        <>
          <p className="text-center mb-4 uppercase tracking-wider">{places.length} places found in {city} !</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {places.map((place) => (
              <button key={place.xid} onClick={() => openInMaps(place.lat, place.lon, place.name)}
                className="group rounded-xl overflow-hidden bg-white border border-gray-100 hover:border-gray-300 hover:shadow-xl hover:scale-105 transition-all duration-500 cursor-pointer p-5 flex flex-col justify-between gap-5">
                  <p className="text-3xl">{place.name}</p>
                  <p className="text-xs">{place.description}</p>
                  <p>{place.kinds}</p>
                  <div className="flex justify-end pe-15 group-hover:pe-10 transition-all duration-500">
                  <ArrowRight />
                  </div>
              </button>
            ))}
          </div>
        </>
      )}

      {/* Empty state */}
      {!loading && searched && places.length === 0 && !error && (
        <div className="text-center py-16 ">
          <p className="text-4xl mb-3">🗺️</p>
          <p className="text-sm">No results yet. Try searching a city above.</p>
        </div>
      )}

      {/* Initial state */}
      {!searched && !loading && (
        <div className="text-center py-16 ">
          <p className="text-xl">Where are we headed?</p>
        </div>
      )}

    </div>
  );
}

export default Places