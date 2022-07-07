import type { Target } from "../../../global";

export const defaultTargets = (target: string) =>
  [
    {
      copy: "None",
      media: "ALL",
    },
    {
      copy: "375px",
      media: `(${target}-width: 375px)`,
    },
    {
      copy: "768px",
      media: `(${target}-width: 768px)`,
    },
    {
      copy: "1024px",
      media: `(${target}-width: 1024px)`,
    },
    {
      copy: "1440px",
      media: `(${target}-width: 1440px)`,
    },
    {
      copy: "Add custom...",
      media: "",
    },
  ] as Target[];
