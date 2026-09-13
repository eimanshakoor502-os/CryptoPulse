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
    Legend,
} from "recharts";

import {
    getCoinDetails,
    getCoinMarketChart,
} from "../services/coingeckoApi";

function CompareChart() {
    const { coinOne, coinTwo } = useParams();
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();

    const [firstCoin, setFirstCoin] = useState(null);
    const [secondCoin, setSecondCoin] = useState(null);
    const [chartData, setChartData] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchComparisonData = async () => {
            try {
                setLoading(true);
                setError("");

                const [
                    firstDetails,
                    secondDetails,
                    firstChart,
                    secondChart,
                ] = await Promise.all([
                    getCoinDetails(coinOne),
                    getCoinDetails(coinTwo),
                    getCoinMarketChart(coinOne),
                    getCoinMarketChart(coinTwo),
                ]);

                setFirstCoin(firstDetails);
                setSecondCoin(secondDetails);

                const firstPrices = firstChart.prices;
                const secondPrices = secondChart.prices;

                const combinedData = [];

                const maxLength = Math.min(
                    firstPrices.length,
                    secondPrices.length
                );

                for (let i = 0; i < maxLength; i++) {
                    combinedData.push({
                        date: new Date(
                            firstPrices[i][0]
                        ).toLocaleDateString(),

                        firstPrice: firstPrices[i][1],
                        secondPrice: secondPrices[i][1],
                    });
                }

                setChartData(combinedData);
            } catch (err) {
                console.error(err);
                setError("Failed to load comparison data.");
            } finally {
                setLoading(false);
            }
        };

        fetchComparisonData();
    }, [coinOne, coinTwo]);

    if (loading) {
        return (
            <div className="app">
                <div className="status-message">
                    <div className="loading-spinner"></div>
                    <p>Loading comparison...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="app">
                <div className="status-message error-message">
                    <h3>Unable to load comparison</h3>
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

            {/* Navbar */}
            <header className="navbar">

                <div className="logo">
                    <span className="logo-icon">₿</span>
                    <span>CryptoPulse</span>
                </div>

                <div className="nav-actions">
                    <button
                        className="nav-link"
                        onClick={() => navigate("/compare")}
                    >
                        ← Back to Compare
                    </button>

                    <button
                        className="theme-toggle"
                        onClick={toggleTheme}
                    >
                        {theme === "light" ? "🌙 Dark" : "☀ Light"}
                    </button>
                </div>

            </header>

            {/* Comparison */}
            <main className="market-section">

                <div className="section-header">

                    <div>
                        <h2>
                            {firstCoin.name} vs {secondCoin.name}
                        </h2>

                        <p>
                            7-day price comparison
                        </p>
                    </div>

                </div>

                {/* Coin Information */}
                <div className="comparison-coins">

                    <div className="comparison-coin">

                        <img
                            src={firstCoin.image?.large}
                            alt={firstCoin.name}
                            className="coin-detail-image"
                        />

                        <div>
                            <strong>
                                {firstCoin.name}
                            </strong>

                            <span>
                                {firstCoin.symbol?.toUpperCase()}
                            </span>
                        </div>

                    </div>

                    <div className="comparison-vs">
                        VS
                    </div>

                    <div className="comparison-coin">

                        <img
                            src={secondCoin.image?.large}
                            alt={secondCoin.name}
                            className="coin-detail-image"
                        />

                        <div>
                            <strong>
                                {secondCoin.name}
                            </strong>

                            <span>
                                {secondCoin.symbol?.toUpperCase()}
                            </span>
                        </div>

                    </div>

                </div>

                {/* Chart */}
                <div className="chart-card">

                    <div className="chart-header">
                        <h2>7-Day Price Comparison</h2>

                        <p>
                            Both cryptocurrency prices are shown
                            on the same chart.
                        </p>
                    </div>

                    <div className="chart-container">

                        <ResponsiveContainer
                            width="100%"
                            height={450}
                        >
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

                                <Legend />

                                <Line
                                    type="monotone"
                                    dataKey="firstPrice"
                                    name={firstCoin.name}
                                    strokeWidth={2}
                                    dot={false}
                                />

                                <Line
                                    type="monotone"
                                    dataKey="secondPrice"
                                    name={secondCoin.name}
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

export default CompareChart;