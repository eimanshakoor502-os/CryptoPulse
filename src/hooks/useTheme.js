import { useEffect, useState } from "react";

const THEME_KEY = "cryptopulse_theme";

function useTheme() {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem(THEME_KEY) || "light";
    });

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);

        localStorage.setItem(THEME_KEY, theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((currentTheme) =>
            currentTheme === "light" ? "dark" : "light"
        );
    };

    return {
        theme,
        toggleTheme,
    };
}

export default useTheme;