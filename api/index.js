const { createServer } = require("@vercel/node");
const stockNSEIndia = require("stock-nse-india");

const fetchData = async (stockSymbol) => {
  try {
    const details = await stockNSEIndia.getEquityDetails(stockSymbol);
    return details;
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
};

module.exports = createServer(async (req, res) => {
  if (req.method === "GET") {
    const stockSymbol = req.url.substring(1);
    if (!stockSymbol) {
      res.status(400).json({ error: "No stock symbol provided" });
      return;
    }

    try {
      const data = await fetchData(stockSymbol);
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.status(405).send("Method Not Allowed");
  }
});
