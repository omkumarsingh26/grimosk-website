// FundedNext trading interview — 8 sections, each a themed cluster of
// questions. One continuous recording is made per SECTION (covering all
// prompts in it) — 8 clips total. Within a section, each individual prompt
// gets its own short timer that auto-advances the highlighted question,
// so pacing matches how substantial each question actually is.
//
// "Introduce yourself" was intentionally dropped per instruction.

export type Prompt = { text: string; seconds: number };

export type InterviewPage = {
  id: string;
  theme: string;
  prompts: Prompt[];
  maxSeconds: number; // sum of this section's prompt durations
};

function section(id: string, theme: string, prompts: Prompt[]): InterviewPage {
  return {
    id,
    theme,
    prompts,
    maxSeconds: prompts.reduce((sum, p) => sum + p.seconds, 0),
  };
}

export const INTERVIEW_QUESTIONS: InterviewPage[] = [
  section("q1", "Your Trading Approach", [
    { text: "Trading Strategy — How do you take trades?", seconds: 60 },
    { text: "How do you mark support and resistance levels?", seconds: 30 },
    { text: "What candlestick and chart patterns do you follow?", seconds: 30 },
    { text: "What kind of trader are you?", seconds: 30 },
  ]),
  section("q2", "Tools & Timeframes", [
    { text: "What are indicators? Which indicators do you use?", seconds: 30 },
    { text: "Do you use any indicators? Why or why not?", seconds: 20 },
    { text: "How does an EMA work?", seconds: 20 },
    { text: "Which timeframes do you use?", seconds: 20 },
  ]),
  section("q3", "Risk Management", [
    { text: "What risk-reward ratio do you follow?", seconds: 30 },
    { text: "What is breakeven? When do you move trades to breakeven?", seconds: 30 },
    { text: "How do you manage risk if a trade goes wrong?", seconds: 30 },
  ]),
  section("q4", "Market Fundamentals", [
    { text: "What is leverage?", seconds: 20 },
    { text: "What is spread, ask, and bid price?", seconds: 20 },
    { text: "What is a swap in forex?", seconds: 15 },
    { text: "What is the base and quote currency in XAUUSD?", seconds: 15 },
  ]),
  section("q5", "Sessions & News", [
    { text: "What are the different forex sessions? Which do you prefer?", seconds: 30 },
    { text: "What kind of news impacts gold?", seconds: 30 },
    { text: "What sources do you use for news?", seconds: 15 },
    { text: "How do international events affect your trades?", seconds: 30 },
  ]),
  section("q6", "Trading Styles & Pairs", [
    { text: "What are the different trading styles?", seconds: 30 },
    { text: "Which pairs do you trade?", seconds: 15 },
    { text: "What is the commission for the pair you trade?", seconds: 15 },
  ]),
  section("q7", "FundedNext & Platform", [
    { text: "What type of challenge did you take with FundedNext?", seconds: 20 },
    { text: "Why FundedNext?", seconds: 30 },
    { text: "Do you use VPS or VPN?", seconds: 15 },
    { text: "Which is your favourite trading platform? Why?", seconds: 20 },
  ]),
  section("q8", "Background & Reflection", [
    { text: "What made you start trading? How long have you been trading?", seconds: 30 },
    { text: "Do you follow any trading mentor or channel?", seconds: 15 },
    { text: "Why did you shift from stock market to forex?", seconds: 30 },
    { text: "What's your strength as a trader?", seconds: 30 },
    { text: "What's the biggest lesson you've learned in trading?", seconds: 30 },
  ]),
];
