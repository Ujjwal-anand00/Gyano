import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Language = "C++" | "JavaScript" | "Python";

const snippets = [
  {
    file: "Gyano.cpp",
    accent: "bg-cyan-300/30",
    language: "C++",
    lines: [
      "#include <iostream>",
      "#include <vector>",
      "using namespace std;",
      "",
      "int main() {",
      '  vector<string> skills = {"Learn", "Build", "Grow"};',
      "  for (string skill : skills) {",
      '    cout << skill << ". ";',
      "  }",
      "}",
    ],
  },
  {
    file: "Gyano.js",
    accent: "bg-yellow-300/25",
    language: "JavaScript",
    lines: [
      "const skills = ['Learn', 'Build', 'Grow'];",
      "",
      "function Gyano() {",
      "  return skills",
      "    .map((skill) => `${skill}.`)",
      "    .join(' ');",
      "}",
      "",
      "console.log(Gyano());",
      "export default Gyano;",
    ],
  },
  {
    file: "gyano.py",
    accent: "bg-emerald-300/25",
    language: "Python",
    lines: [
      "skills = ['Learn', 'Build', 'Grow']",
      "",
      "def gyano():",
      "    message = []",
      "    for skill in skills:",
      "        message.append(f'{skill}.')",
      "    return ' '.join(message)",
      "",
      "print(gyano())",
      "# Keep learning with Gyano",
    ],
  },
];

const keywordMap: Record<Language, string[]> = {
  "C++": [
    "#include",
    "using",
    "namespace",
    "int",
    "string",
    "vector",
    "for",
    "return",
  ],
  JavaScript: [
    "const",
    "function",
    "return",
    "export",
    "default",
    "console",
    "map",
    "join",
  ],
  Python: ["def", "for", "in", "return", "print"],
};

const functionNames = new Set(["main", "Gyano", "gyano", "log", "append"]);

function tokenClassName(token: string, language: Language) {
  if (/^\s+$/.test(token)) return "";
  if (token.startsWith("//") || token.startsWith("# ")) {
    return "text-slate-500 italic";
  }
  if (/^["'`]/.test(token) || /^<[^>\s]+>$/.test(token)) {
    return "text-emerald-300";
  }
  if (/^\d+$/.test(token)) return "text-amber-300";
  if (keywordMap[language].includes(token)) return "text-fuchsia-300";
  if (functionNames.has(token)) return "text-cyan-200";
  if (/^[{}()[\].,;:+\-*/=<>!|&]+$/.test(token)) return "text-slate-400";
  if (/^[A-Z][A-Za-z0-9_]*$/.test(token)) return "text-sky-200";

  return "text-slate-100";
}

function renderHighlightedLine(line: string, language: Language) {
  const tokenPattern =
    /(\s+|#include|# .*$|\/\/.*|["'`][^"'`]*["'`]?|<[^>\s]+>|\b[A-Za-z_]\w*\b|\d+|[{}()[\].,;:+\-*/=<>!|&]+)/g;
  const tokens = line.match(tokenPattern) || [line || " "];

  return tokens.map((token, index) => (
    <span className={tokenClassName(token, language)} key={`${token}-${index}`}>
      {token}
    </span>
  ));
}

function CodeBlock() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const [cursorLine, setCursorLine] = useState(0);
  const activeSnippet = snippets[activeIndex];

  useEffect(() => {
    const timers: number[] = [];
    const typingSpeed = 34;
    const linePause = 260;
    const snippetPause = 2200;

    setVisibleLines(activeSnippet.lines.map(() => ""));
    setCursorLine(0);

    let elapsed = 280;

    activeSnippet.lines.forEach((line, lineIndex) => {
      const safeLine = line || " ";

      for (let charIndex = 0; charIndex <= safeLine.length; charIndex += 1) {
        timers.push(
          window.setTimeout(() => {
            setCursorLine(lineIndex);
            setVisibleLines((currentLines) => {
              const nextLines = [...currentLines];
              nextLines[lineIndex] = safeLine.slice(0, charIndex);
              return nextLines;
            });
          }, elapsed + charIndex * typingSpeed),
        );
      }

      elapsed += safeLine.length * typingSpeed + linePause;
    });

    timers.push(
      window.setTimeout(() => {
        setActiveIndex((current) => (current + 1) % snippets.length);
      }, elapsed + snippetPause),
    );

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [activeIndex, activeSnippet.lines]);

  return (
    <motion.div
      className="relative w-full max-w-xl"
      animate={{ y: [0, -16, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
    >
      <div
        className={`absolute -inset-1 rounded-3xl ${activeSnippet.accent} blur-2xl transition-colors duration-500`}
      />
      <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-slate-950/95 shadow-2xl shadow-blue-950/40 backdrop-blur">
        <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.03] px-3 py-3 sm:px-4">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400 sm:h-3 sm:w-3" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-300 sm:h-3 sm:w-3" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-400 sm:h-3 sm:w-3" />
          <span className="ml-2 min-w-0 truncate text-xs font-medium text-slate-400 sm:ml-3">
            {activeSnippet.file}
          </span>
          <span className="ml-auto rounded-full border border-white/10 px-2 py-0.5 text-[10px] text-slate-500 sm:text-xs">
            {activeSnippet.language}
          </span>
        </div>

        <AnimatePresence mode="wait">
          <motion.pre
            key={activeSnippet.file}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="min-h-80 overflow-x-auto px-3 py-4 text-left font-mono text-[10px] leading-5 text-slate-100 sm:min-h-96 sm:px-5 sm:py-6 sm:text-sm sm:leading-7 md:text-base"
          >
            <code>
              {activeSnippet.lines.map((line, index) => {
                const visibleLine = visibleLines[index] ?? "";

                return (
                  <span className="block whitespace-nowrap" key={index}>
                    <span className="mr-2 inline-block w-4 select-none text-right text-slate-600 sm:mr-4 sm:w-5">
                      {index + 1}
                    </span>
                    <span className="inline-block whitespace-pre align-bottom">
                      {renderHighlightedLine(
                        visibleLine,
                        activeSnippet.language as Language,
                      )}
                    </span>
                    {cursorLine === index && <span className="gyano-code-cursor" />}
                  </span>
                );
              })}
            </code>
          </motion.pre>
        </AnimatePresence>

        <div className="flex items-center justify-between gap-3 border-t border-white/10 bg-white/[0.03] px-4 py-3 text-xs text-slate-500">
          <span>{activeSnippet.lines.length} lines ready</span>
          <span className="hidden sm:inline">Auto rotating snippets</span>
        </div>
      </div>
    </motion.div>
  );
}

export default CodeBlock;
