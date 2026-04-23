import { useState, useEffect } from "react";

const COUNTRY_CURRENCY = {
  "United States": "USD", "Spain": "EUR", "France": "EUR", "Germany": "EUR",
  "Italy": "EUR", "Portugal": "EUR", "Netherlands": "EUR", "Greece": "EUR",
  "United Kingdom": "GBP", "Japan": "JPY", "China": "CNY", "Australia": "AUD",
  "Canada": "CAD", "Switzerland": "CHF", "Sweden": "SEK", "Norway": "NOK",
  "Denmark": "DKK", "Brazil": "BRL", "Mexico": "MXN", "Argentina": "ARS",
  "South Korea": "KRW", "India": "INR", "Thailand": "THB", "Indonesia": "IDR",
  "Malaysia": "MYR", "Singapore": "SGD", "Philippines": "PHP", "Vietnam": "VND",
  "Turkey": "TRY", "South Africa": "ZAR", "Egypt": "EGP", "Morocco": "MAD",
  "United Arab Emirates": "AED", "Saudi Arabia": "SAR", "Israel": "ILS",
  "New Zealand": "NZD", "Hong Kong": "HKD", "Poland": "PLN", "Czech Republic": "CZK",
  "Hungary": "HUF", "Romania": "RON", "Croatia": "EUR", "Russia": "RUB",
  "Ukraine": "UAH", "Colombia": "COP", "Chile": "CLP", "Peru": "PEN",
  "Pakistan": "PKR", "Bangladesh": "BDT", "Nigeria": "NGN", "Kenya": "KES",
};

const CURRENCIES = [
  "USD","EUR","GBP","JPY","AUD","CAD","CHF","CNY","SEK","NOK",
  "DKK","NZD","SGD","HKD","KRW","INR","BRL","MXN","ZAR","TRY",
  "AED","SAR","THB","MYR","IDR","PHP","VND","PLN","CZK","HUF",
];

const FLAG_EMOJI = {
  USD:"🇺🇸", EUR:"🇪🇺", GBP:"🇬🇧", JPY:"🇯🇵", AUD:"🇦🇺", CAD:"🇨🇦",
  CHF:"🇨🇭", CNY:"🇨🇳", SEK:"🇸🇪", NOK:"🇳🇴", DKK:"🇩🇰", NZD:"🇳🇿",
  SGD:"🇸🇬", HKD:"🇭🇰", KRW:"🇰🇷", INR:"🇮🇳", BRL:"🇧🇷", MXN:"🇲🇽",
  ZAR:"🇿🇦", TRY:"🇹🇷", AED:"🇦🇪", SAR:"🇸🇦", THB:"🇹🇭", MYR:"🇲🇾",
  IDR:"🇮🇩", PHP:"🇵🇭", VND:"🇻🇳", PLN:"🇵🇱", CZK:"🇨🇿", HUF:"🇭🇺",
};

const Converter = () => {
  const [fromCurrency, setFromCurrency] = useState("EUR");
  const [toCountry, setToCountry]       = useState("United States");
  const [amount, setAmount]             = useState("");
  const [rates, setRates]               = useState(null);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState(null);

  const toCurrency = COUNTRY_CURRENCY[toCountry];

  // Fetch rates whenever the base currency changes
  useEffect(() => {
    if (!fromCurrency) return;
    setLoading(true);
    setError(null);
    fetch(`https://open.er-api.com/v6/latest/${fromCurrency}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.result === "success") {
          setRates(data.rates);
        } else {
          setError("Could not fetch rates. Try again.");
        }
      })
      .catch(() => setError("Network error. Check your connection."))
      .finally(() => setLoading(false));
  }, [fromCurrency]);

  const rate = rates?.[toCurrency];
  const converted =
    amount !== "" && rate && !isNaN(amount)
      ? (parseFloat(amount) * rate).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : "";

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">

      {/* Header */}
      <p className="font-serif text-4xl text-center font-normal mb-1">Currency Converter</p>
      <p className="mb-8 text-center text-gray-700">Live rates updated daily, no account needed.</p>

      {/* Selectors */}
      <div className="grid md:grid-cols-2 gap-5 mb-8">
        {/* From currency */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs  uppercase tracking-wider text-center">Choose your currency</label>
          <select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}
            className="bg-white rounded-xl p-4 cursor-pointer hover:scale-105 transition-all duration-500 hover:shadow-xl">

            {CURRENCIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Destination country */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs  uppercase tracking-wider text-center">What's your destination?</label>
          <select value={toCountry} onChange={(e) => setToCountry(e.target.value)}
            className="bg-white rounded-xl p-4 cursor-pointer hover:scale-105 transition-all duration-500 hover:shadow-xl">
            {Object.keys(COUNTRY_CURRENCY).sort().map((country) => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Country → currency pill */}
      <div className="flex items-center gap-2 mb-6 justify-center">
        <span className="text-xs">Currency used in {toCountry}:</span>
        <span className="font-bold text-stone-600 px-3 py-1 ">
          {FLAG_EMOJI[toCurrency] || ""} {toCurrency}
        </span>
      </div>

      {/* Conversion inputs */}
      <div className="grid md:grid-cols-2 gap-5 items-end">
        {/* Amount input */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-center uppercase tracking-wider">You have ({fromCurrency})</label>
         
            <input type="number" min="0" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)}
              className="bg-white rounded-xl p-4 cursor-pointer hover:scale-105 transition-all duration-500 hover:shadow-xl focus:outline-0"/>
        
        </div>

        {/* Result output */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs uppercase tracking-wider text-center">You get ({toCurrency})</label>
            <div className="w-full bg-stone-50 border border-gray-100 rounded-xl pl-9 pr-4 py-3 text-lg overflow-hidden">
              {loading ? (
                <span className=" text-sm">Loading rates...</span>
              ) : error ? (
                <span className="text-red-400 text-sm">{error}</span>
              ) : converted ? (
                converted
              ) : (
                <span className="">0.00</span>
              )}
            </div>
        </div>
      </div>

      {/* Rate info */}
      {rate && !loading && (
        <p className="mt-4 text-right">
          1 {fromCurrency} = {rate.toFixed(4)} {toCurrency}
        </p>
      )}

      {/* Attribution (required by the API terms) */}
      <p className="text-xs  mt-8 text-center">
        Rates provided by{" "}
        
        <a href="https://www.exchangerate-api.com" target="_blank" rel="noreferrer" className="underline hover: transition-colors">        
          ExchangeRate-API
        </a>
      </p>
    </div>
  );
}
export default Converter