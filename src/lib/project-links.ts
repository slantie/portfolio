const PROJECT_GITHUB_FALLBACKS = [
  {
    title: /(?:isro|iirs|spectral classification)/i,
    href: "https://github.com/slantie/isro-hackathon",
  },
  {
    title: /(?:gst predictive|predictive model in gst)/i,
    href: "https://github.com/slantie/GSTN_589-Team-Coding-Brigades",
  },
];

export function getProjectGithubFallback(title: string): string | undefined {
  return PROJECT_GITHUB_FALLBACKS.find((project) => project.title.test(title))
    ?.href;
}
