import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useTheme from "../hooks/useTheme";

import { getTopCoins } from "../services/coingeckoApi";

function Compare() {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();

    const [coins, setCoins] = useState([]);
    const [coinOne, setCoinOne] = useState("");
    const [coinTwo, setCoinTwo] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchCoins = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getTopCoins();

                setCoins(data);
            } catch (err) {
                console.error(err);
                setError("Failed to load coins.");
            } finally {
                setLoading(false);
            }
        };

        fetchCoins();
    }, []);

    const handleCompare = () => {
        if (!coinOne || !coinTwo) {
            alert("Please select two coins.");
            return;
        }

        if (coinOne === coinTwo) {
            alert("Please select two different coins.");
            return;
        }

        navigate(`/compare/${coinOne}/${coinTwo}`);
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
                        className="nav-link"
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

                    <button className="nav-link active">
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

            {/* Compare Section */}
            <main className="market-section">

                <div className="section-header">
                    <div>
                        <h2>Compare Cryptocurrencies</h2>

                        <p>
                            Select two coins to compare their 7-day
                            price performance.
                        </p>
                    </div>
                </div>

                {loading && (
                    <div className="status-message">
                        Loading cryptocurrencies...
                    </div>
                )}

                {error && (
                    <div className="status-message error-message">
                        <h3>Unable to load comparison data</h3>
                        <p>{error}</p>

                        <button
                            className="retry-button"
                            onClick={() => window.location.reload()}
                        >
                            Try Again
                        </button>
                    </div>
                )}
                {!loading && !error && (
                    <div className="compare-box">

                        <div className="compare-select">

                            <label>
                                First Coin
                            </label>

                            <select
                                value={coinOne}
                                onChange={(e) =>
                                    setCoinOne(e.target.value)
                                }
                            >
                                <option value="">
                                    Select first coin
                                </option>

                                {coins.map((coin) => (
                                    <option
                                        key={coin.id}
                                        value={coin.id}
                                    >
                                        {coin.name} (
                                        {coin.symbol.toUpperCase()})
                                    </option>
                                ))}
                            </select>

                        </div>

                        <div className="compare-select">

                            <label>
                                Second Coin
                            </label>

                            <select
                                value={coinTwo}
                                onChange={(e) =>
                                    setCoinTwo(e.target.value)
                                }
                            >
                                <option value="">
                                    Select second coin
                                </option>

                                {coins.map((coin) => (
                                    <option
                                        key={coin.id}
                                        value={coin.id}
                                    >
                                        {coin.name} (
                                        {coin.symbol.toUpperCase()})
                                    </option>
                                ))}
                            </select>

                        </div>

                        <button
                            className="compare-button"
                            onClick={handleCompare}
                        >
                            Compare Coins
                        </button>

                    </div>
                )}

            </main>

        </div>
    );
}

export default Compare;