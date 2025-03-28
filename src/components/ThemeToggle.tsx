
import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { Toggle } from "./ui/toggle";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Toggle 
      pressed={isDark}
      onPressedChange={toggleTheme}
      aria-label="Toggle dark mode"
      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
    >
      {isDark ? (
        <Moon size={20} className="text-purple-300" />
      ) : (
        <Sun size={20} className="text-purple-600" />
      )}
    </Toggle>
  );
};

export default ThemeToggle;
