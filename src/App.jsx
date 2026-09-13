import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";

import { getTopCoins } from "./services/coingeckoApi";
import useWatchlist from "./hooks/useWatchlist";
import CoinDetails from "./pages/CoinDetails";
import Watchlist from "./pages/Watchlist";
import Compare from "./pages/Compare";
import CompareChart from "./pages/CompareChart";
import useTheme from "./hooks/useTheme";

import "./App.css";

function MarketPage() {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [sortConfig, setSortConfig] = useState({
    key: "market_cap_rank",
    direction: "asc",
  });

  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const {
    isInWatchlist,
    toggleWatchlist,
  } = useWatchlist();

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getTopCoins();

        console.log("Coins received:", data.length);

        setCoins(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load cryptocurrency data.");
      } finally {
        setLoading(false);
      }
    };

    fetchCoins();
  }, []);

  const filteredCoins = coins
    .filter((coin) => {
      const searchText = search.toLowerCase();

      return (
        coin.name.toLowerCase().includes(searchText) ||
        coin.symbol.toLowerCase().includes(searchText)
      );
    })
    .sort((a, b) => {
      const { key, direction } = sortConfig;

      const valueA = a[key] ?? 0;
      const valueB = b[key] ?? 0;

      if (valueA < valueB) {
        return direction === "asc" ? -1 : 1;
      }

      if (valueA > valueB) {
        return direction === "asc" ? 1 : -1;
      }

      return 0;
    });

  const handleSort = (key) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === "asc"
          ? "desc"
          : "asc",
    }));
  };

  return (
    <div className="app">

      {/* Navbar */}
      <header className="navbar">

        <div className="logo">
          <span className="logo-icon">₿</span>
          <span>CryptoPulse</span>
        </div>

        <nav className="nav-links">

          <button
            className="nav-link active"
            onClick={() => navigate("/")}
          >
            Market
          </button>

          <button
            className="nav-link"
            onClick={() => navigate("/watchlist")}
          >
            Watchlist
          </button>

          <button
            className="nav-link"
            onClick={() => navigate("/compare")}
          >
            Compare
          </button>

        </nav>

        <button
          className="theme-toggle"
          onClick={toggleTheme}
        >
          {theme === "light" ? "🌙 Dark" : "☀ Light"}
        </button>

      </header>

      {/* Hero */}
      <section className="hero">

        <p className="eyebrow">
          CRYPTOCURRENCY TRACKER
        </p>

        <h1>
          Track the market.
          <br />
          <span>Make informed moves.</span>
        </h1>

        <p className="hero-text">
          Real-time cryptocurrency prices,
          market data, and 7-day trends.
        </p>

      </section>

      {/* Market */}
      <main className="market-section">

        <div className="section-header">

          <div>
            <h2>Crypto Market</h2>

            <p>
              Top 20 cryptocurrencies by market cap
            </p>
          </div>

          <div className="search-box">

            <input
              type="text"
              placeholder="Search coins..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

          </div>

        </div>

        {/* Loading */}
        {loading && (
          <div className="status-message">
            <div className="loading-spinner"></div>
            <p>Loading cryptocurrency data...</p>
          </div>
        )}

        {error && (
          <div className="status-message error-message">
            <h3>Something went wrong</h3>
            <p>{error}</p>

            <button
              className="retry-button"
              onClick={fetchCoins}
            >
              Try Again
            </button>
          </div>
        )}

        {/* Table */}
        {!loading && !error && (
          <div className="table-container">

            <table>

              <thead>
                <tr>

                  <th
                    onClick={() =>
                      handleSort("market_cap_rank")
                    }
                  >
                    # ↕
                  </th>

                  <th>Coin</th>

                  <th
                    onClick={() =>
                      handleSort("current_price")
                    }
                  >
                    Price ↕
                  </th>

                  <th
                    onClick={() =>
                      handleSort(
                        "price_change_percentage_24h"
                      )
                    }
                  >
                    24h Change ↕
                  </th>

                  <th
                    onClick={() =>
                      handleSort("market_cap")
                    }
                  >
                    Market Cap ↕
                  </th>

                  <th>Watchlist</th>

                </tr>
              </thead>

              <tbody>

                {filteredCoins.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="no-results"
                    >
                      No coins found.
                    </td>
                  </tr>
                ) : (
                  filteredCoins.map((coin) => (

                    <tr
                      key={coin.id}
                      onClick={() =>
                        navigate(`/coin/${coin.id}`)
                      }
                      style={{ cursor: "pointer" }}
                    >

                      <td>
                        {coin.market_cap_rank}
                      </td>

                      <td>

                        <div className="coin-info">

                          <img
                            src={coin.image}
                            alt={coin.name}
                            className="coin-image"
                          />

                          <div>
                            <strong>
                              {coin.name}
                            </strong>

                            <span>
                              {coin.symbol.toUpperCase()}
                            </span>
                          </div>

                        </div>

                      </td>

                      <td>
                        $
                        {coin.current_price?.toLocaleString()}
                      </td>

                      <td
                        className={
                          coin.price_change_percentage_24h >= 0
                            ? "positive"
                            : "negative"
                        }
                      >
                        {coin.price_change_percentage_24h?.toFixed(
                          2
                        )}
                        %
                      </td>

                      <td>
                        $
                        {coin.market_cap?.toLocaleString()}
                      </td>

                      <td>

                        <button
                          className={`star-button ${isInWatchlist(coin.id)
                            ? "star-active"
                            : ""
                            }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWatchlist(coin.id);
                          }}
                        >
                          {isInWatchlist(coin.id)
                            ? "★"
                            : "☆"}
                        </button>

                      </td>

                    </tr>

                  ))
                )}

              </tbody>

            </table>

          </div>
        )}

      </main>

    </div>
  );
}

function PlaceholderPage({ title }) {
  const navigate = useNavigate();

  return (
    <div className="app">

      <header className="navbar">

        <div className="logo">
          <span className="logo-icon">₿</span>
          <span>CryptoPulse</span>
        </div>

        <button
          className="nav-link"
          onClick={() => navigate("/")}
        >
          ← Back to Market
        </button>

      </header>

      <main className="market-section">

        <div className="status-message">
          <h2>{title}</h2>
          <p>This section will be completed next.</p>
        </div>

      </main>

    </div>
  );
}

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<MarketPage />}
        />

        <Route
          path="/coin/:coinId"
          element={<CoinDetails />}
        />

        <Route
          path="/watchlist"
          element={<Watchlist />}
        />
        <Route
          path="/compare"
          element={<Compare />}
        />
        <Route
          path="/compare/:coinOne/:coinTwo"
          element={<CompareChart />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;