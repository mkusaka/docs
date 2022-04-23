module.exports = {
  extends: ["next/core-web-vitals"],
  rules: {
    "react/jsx-curly-brace-presence": ["error", "never"],
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "error",
  },
};
