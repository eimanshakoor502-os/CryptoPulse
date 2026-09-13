import axios from "axios";

const API_URL = "https://api.coingecko.com/api/v3";

// Get Top 20 Coins
export const getTopCoins = async () => {
    const response = await axios.get(
        `${API_URL}/coins/markets`,
        {
            params: {
                vs_currency: "usd",
                order: "market_cap_desc",
                per_page: 22,
                page: 1,
                sparkline: false,
                price_change_percentage: "24h",
            },
        }
    );

    return response.data;
};

// Get Coin Details
export const getCoinDetails = async (coinId) => {
    const response = await axios.get(
        `${API_URL}/coins/${coinId}`,
        {
            params: {
                localization: false,
                tickers: false,
                market_data: true,
                community_data: false,
                developer_data: false,
            },
        }
    );

    return response.data;
};

// Get 7-Day Price Chart
export const getCoinMarketChart = async (coinId) => {
    const response = await axios.get(
        `${API_URL}/coins/${coinId}/market_chart`,
        {
            params: {
                vs_currency: "usd",
                days: 7,
            },
        }
    );

    return response.data;
};