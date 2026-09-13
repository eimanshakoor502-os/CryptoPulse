import { useEffect, useState } from "react";

const STORAGE_KEY = "cryptopulse_watchlist";

function useWatchlist() {
    const [watchlist, setWatchlist] = useState(() => {
        const savedWatchlist = localStorage.getItem(STORAGE_KEY);

        return savedWatchlist
            ? JSON.parse(savedWatchlist)
            : [];
    });

    useEffect(() => {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(watchlist)
        );
    }, [watchlist]);

    const isInWatchlist = (coinId) => {
        return watchlist.includes(coinId);
    };

    const toggleWatchlist = (coinId) => {
        setWatchlist((current) => {
            if (current.includes(coinId)) {
                return current.filter((id) => id !== coinId);
            }

            return [...current, coinId];
        });
    };

    return {
        watchlist,
        isInWatchlist,
        toggleWatchlist,
    };
}

export default useWatchlist;