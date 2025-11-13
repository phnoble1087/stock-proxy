const API_KEY = "Hsb7ohmRDG2CDrTs91LsxVDGEqMUkgb7";

export default async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  const { ticker } = req.query;
  if (!ticker) {
    return res.status(400).json({ error: "No ticker provided" });
  }
  
  try {
    const [quote, profile] = await Promise.all([
      fetch(`https://financialmodelingprep.com/api/v3/quote-short/${ticker}?apikey=${API_KEY}`).then(r => r.json()),
      fetch(`https://financialmodelingprep.com/api/v3/profile/${ticker}?apikey=${API_KEY}`).then(r => r.json())
    ]);
    
    if (!quote[0] || !profile[0]) {
      return res.status(404).json({ error: "Ticker not found" });
    }
    
    res.json({
      companyName: profile[0].companyName,
      price: profile[0].price,
      mktCap: profile[0].mktCap,
      pe: quote[0].pe || null,
      beta: profile[0].beta || null
    });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
}
