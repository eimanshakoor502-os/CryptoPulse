import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useTheme from "../hooks/useTheme";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import {
  getCoinDetails,
  getCoinMarketChart,
} from "../services/coingeckoApi";

function CoinDetails() {
  const { coinId } = useParams();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const [coin, setCoin] = useState(null);
  const [chartData
    , setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCoinData = async () => {
      try {
        setLoading(true);
        setError("");

        const [coinData, marketData] = await Promise.all([
          getCoinDetails(coinId),
          getCoinMarketChart(coinId),
        ]);

        setCoin(coinData);

        const formattedData = marketData.prices.map(
          ([timestamp, price]) => ({
            date: new Date(timestamp).toLocaleDateString(),
            price: price,
          })
        );

        setChartData(formattedData);
      } catch (err) {
        console.error(err);
        setError("Failed to load coin details.");
      } finally {
        setLoading(false);
      }
    };

    fetchCoinData();
  }, [coinId]);

  if (loading) {
    return (
      <div className="app">
        <div className="status-message">
          <div className="loading-spinner"></div>
          <p>Loading coin details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <div className="status-message error-message">
          <h3>Unable to load coin details</h3>
          <p>{error}</p>

          <button
            className="retry-button"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">

      <header className="navbar">
        <div className="logo">
          <span className="logo-icon">₿</span>
          <span>CryptoPulse</span>
        </div>

        <div className="nav-actions">
          <button
            className="nav-link"
            onClick={() => navigate("/")}
          >
            ← Back to Market
          </button>

          <button
            className="theme-toggle"
            onClick={toggleTheme}
          >
            {theme === "light" ? "🌙 Dark" : "☀ Light"}
          </button>
        </div>
      </header>

      <main className="market-section">

        {/* Coin Header */}
        <div className="coin-detail-header">

          <div className="coin-detail-info">
            <img
              src={coin.image?.large}
              alt={coin.name}
              className="coin-detail-image"
            />

            <div>
              <h1>{coin.name}</h1>
              <p>{coin.symbol?.toUpperCase()}</p>
            </div>
          </div>

          <div className="coin-detail-price">
            <h2>
              $
              {coin.market_data?.current_price?.usd?.toLocaleString()}
            </h2>

            <p
              className={
                coin.market_data?.price_change_percentage_24h >= 0
                  ? "positive"
                  : "negative"
              }
            >
              {coin.market_data?.price_change_percentage_24h?.toFixed(2)}%
              {" "}24h
            </p>
          </div>

        </div>

        {/* Chart */}
        <div className="chart-card">

          <div className="chart-header">
            <h2>7-Day Price Chart</h2>
            <p>{coin.name} price movement over the last 7 days</p>
          </div>

          <div className="chart-container">

            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData}>

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  interval="preserveStartEnd"
                />

                <YAxis
                  domain={["auto", "auto"]}
                  tick={{ fontSize: 12 }}
                />

                <Tooltip
                  formatter={(value) => [
                    `$${Number(value).toLocaleString()}`,
                    "Price",
                  ]}
                />

                <Line
                  type="monotone"
                  dataKey="price"
                  strokeWidth={2}
                  dot={false}
                />

              </LineChart>
            </ResponsiveContainer>

          </div>

        </div>

      </main>

    </div>
  );
}

export default CoinDetails;