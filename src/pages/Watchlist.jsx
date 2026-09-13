import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getTopCoins } from "../services/coingeckoApi";
import useWatchlist from "../hooks/useWatchlist";
import useTheme from "../hooks/useTheme";

function Watchlist() {
    const [coins, setCoins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();

    const {
        watchlist,
        isInWatchlist,
        toggleWatchlist,
    } = useWatchlist();

    useEffect(() => {
        const fetchCoins = async () => {
            try {
                setLoading(true);

                const data = await getTopCoins();

                setCoins(data);
            } catch (err) {
                console.error(err);
                setError("Failed to load watchlist data.");
            } finally {
                setLoading(false);
            }
        };

        fetchCoins();
    }, []);

    const watchlistCoins = coins.filter((coin) =>
        watchlist.includes(coin.id)
    );

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
                        className="nav-link"
                        onClick={() => navigate("/")}
                    >
                        Market
                    </button>

                    <button className="nav-link active">
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

            {/* Watchlist */}
            <main className="market-section">

                <div className="section-header">

                    <div>
                        <h2>My Watchlist ⭐</h2>

                        <p>
                            Your saved cryptocurrencies
                        </p>
                    </div>

                </div>

                {loading && (
                    <div className="status-message">
                        <div className="loading-spinner"></div>
                        <p>Loading watchlist...</p>
                    </div>
                )}

                {error && (
                    <div className="status-message error-message">
                        <h3>Unable to load watchlist</h3>
                        <p>{error}</p>

                        <button
                            className="retry-button"
                            onClick={() => window.location.reload()}
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* Empty Watchlist */}
                {!loading &&
                    !error &&
                    watchlistCoins.length === 0 && (
                        <div className="status-message">
                            <h3>Your watchlist is empty</h3>

                            <p>
                                Go to the Market and click ☆ on a coin
                                to add it to your watchlist.
                            </p>

                            <button
                                className="nav-link"
                                onClick={() => navigate("/")}
                            >
                                Go to Market
                            </button>
                        </div>
                    )}

                {/* Watchlist Table */}
                {!loading &&
                    !error &&
                    watchlistCoins.length > 0 && (
                        <div className="table-container">

                            <table>

                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Coin</th>
                                        <th>Price</th>
                                        <th>24h Change</th>
                                        <th>Market Cap</th>
                                        <th>Remove</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {watchlistCoins.map((coin) => (

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
                                                    className="star-button star-active"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleWatchlist(coin.id);
                                                    }}
                                                >
                                                    ★
                                                </button>

                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>
                    )}

            </main>

        </div>
    );
}

export default Watchlist;