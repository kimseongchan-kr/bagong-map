import type { Preview } from "@storybook/react-vite";
import "../src/design-system/fonts.css";
import "../src/design-system/tokens.css";
import "./preview.css";

const preview: Preview = {
  parameters: { layout: "centered" },
};

export default preview;
