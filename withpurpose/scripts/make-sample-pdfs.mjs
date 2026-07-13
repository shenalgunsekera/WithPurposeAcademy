/**
 * Generates three sample poker course PDFs into ./samples so the admin can
 * upload them from the admin panel while testing. Run: npm run samples
 */
import { jsPDF } from "jspdf";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const OUT = join(process.cwd(), "samples");
mkdirSync(OUT, { recursive: true });

const CREAM = [242, 234, 216];
const GOLD = [201, 161, 90];
const RED = [178, 44, 35];
const INK = [40, 34, 30];

function makePdf({ file, title, level, sections }) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const M = 56;

  // ── Cover ──
  doc.setFillColor(24, 20, 17);
  doc.rect(0, 0, W, H, "F");
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(1.5);
  doc.rect(28, 28, W - 56, H - 56);

  doc.setTextColor(...GOLD);
  doc.setFont("times", "normal");
  doc.setFontSize(13);
  doc.text("WITH PURPOSE ACADEMY", W / 2, 150, { align: "center" });

  doc.setTextColor(...CREAM);
  doc.setFont("times", "bold");
  doc.setFontSize(30);
  const titleLines = doc.splitTextToSize(title, W - 160);
  doc.text(titleLines, W / 2, 240, { align: "center" });

  doc.setFontSize(48);
  doc.setTextColor(...RED);
  doc.text("♠  ♥  ♦  ♣", W / 2, 340, { align: "center" });

  doc.setTextColor(...GOLD);
  doc.setFont("times", "normal");
  doc.setFontSize(14);
  doc.text(`${level} Course`, W / 2, 400, { align: "center" });

  doc.setTextColor(150, 140, 125);
  doc.setFontSize(10);
  doc.text(
    "Sample material for platform demonstration. © With Purpose Academy",
    W / 2,
    H - 70,
    { align: "center" },
  );

  // ── Content pages ──
  for (const section of sections) {
    doc.addPage();
    doc.setFillColor(250, 247, 240);
    doc.rect(0, 0, W, H, "F");

    // Header rule
    doc.setDrawColor(...GOLD);
    doc.setLineWidth(0.8);
    doc.line(M, 64, W - M, 64);
    doc.setTextColor(...RED);
    doc.setFont("times", "bold");
    doc.setFontSize(19);
    doc.text(section.heading, M, 52);

    doc.setTextColor(...INK);
    doc.setFont("times", "normal");
    doc.setFontSize(12);

    let y = 96;
    for (const para of section.paras) {
      const lines = doc.splitTextToSize(para, W - M * 2);
      if (y + lines.length * 16 > H - 80) break;
      doc.text(lines, M, y);
      y += lines.length * 16 + 12;
    }

    doc.setTextColor(150, 140, 125);
    doc.setFontSize(9);
    doc.text("With Purpose Academy — study with discipline, play with purpose", M, H - 48);
  }

  writeFileSync(join(OUT, file), Buffer.from(doc.output("arraybuffer")));
  console.log("wrote", file);
}

makePdf({
  file: "01-poker-foundations.pdf",
  title: "Poker Foundations: Rules, Hand Rankings & Table Discipline",
  level: "Beginner",
  sections: [
    {
      heading: "1. How a Hand of Texas Hold'em Works",
      paras: [
        "Every hand of Texas Hold'em follows the same rhythm: two private hole cards, five community cards dealt across three streets (the flop, the turn, and the river), and up to four rounds of betting. Understanding this structure cold is the foundation of everything else in this course.",
        "Before the cards are dealt, two players post forced bets called the small blind and big blind. These create the initial pot and the incentive to fight for it. Position rotates clockwise every hand, which means every player experiences every seat. As you will learn in section three, where you sit relative to the dealer button is one of the biggest factors in how profitable a hand can be.",
        "Action on each street moves clockwise. A player may fold, call, or raise. When the final bet is called on the river, hands are shown and the best five-card combination wins. Simple to learn, famously difficult to master.",
      ],
    },
    {
      heading: "2. Hand Rankings You Must Never Misread",
      paras: [
        "From strongest to weakest: royal flush, straight flush, four of a kind, full house, flush, straight, three of a kind, two pair, one pair, high card. Print this, memorise it, and test yourself until reading the board is automatic.",
        "The most common beginner mistakes are misreading a straight (remember the ace plays both high and low), missing a possible flush on a three-suited board, and overvaluing one pair. A disciplined player always asks: what is the best possible hand on this board, and how does mine compare?",
        "Exercise: deal out five community cards from a shuffled deck and name the nuts (the best possible hand) before moving on. Do this twenty times a day for a week and board reading becomes reflex.",
      ],
    },
    {
      heading: "3. Position: The Invisible Advantage",
      paras: [
        "Acting last is a structural advantage that never disappears. When you act after your opponents, you make every decision with more information than they had. Over thousands of hands, that information gap converts directly into profit.",
        "Early position (the first seats to act) demands the tightest hand selection. Late position (the cutoff and the button) allows you to play more hands profitably because you will act last on every street after the flop.",
        "A simple discipline to start with: play roughly the top 15 percent of hands from early position, the top 25 percent from middle position, and up to 40 percent from the button when the pot is unopened. Ranges tighten and loosen with context, but structure beats impulse.",
      ],
    },
    {
      heading: "4. Bankroll Discipline Before Anything Else",
      paras: [
        "The single most common reason losing players stay losing players is not bad strategy. It is playing stakes their bankroll cannot support, then making fear-driven decisions. Variance is a mathematical certainty in poker; your bankroll is the armour that lets you make correct decisions through it.",
        "A conservative starting rule: never buy into a cash game for more than 5 percent of your total poker bankroll, and keep at least 20 buy-ins for the stake you play. If the bankroll drops below that threshold, move down in stakes without ego.",
        "Track every session: date, stake, hours, result. What gets measured gets managed, and honest records are the fastest cure for selective memory.",
      ],
    },
  ],
});

makePdf({
  file: "02-mathematics-of-winning.pdf",
  title: "The Mathematics of Winning Poker: Odds, Outs & Expected Value",
  level: "Intermediate",
  sections: [
    {
      heading: "1. Counting Outs Without Errors",
      paras: [
        "An out is any unseen card that improves your hand to a likely winner. Flush draw on the flop: nine outs. Open-ended straight draw: eight. Gutshot: four. Two overcards: six, but discount them when the board favours your opponent's range.",
        "The discipline is in the discounting. If one of your straight cards also completes an opponent's flush, it is not a clean out. Professionals think in clean outs and dirty outs; amateurs count everything and wonder why the maths lies to them.",
        "Exercise: for one week, every time you see a flop with a draw, write down your out count and check it against a solver or equity calculator afterwards. Your counting error rate will drop to near zero.",
      ],
    },
    {
      heading: "2. The Rule of Two and Four",
      paras: [
        "With one card to come, multiply your clean outs by two to estimate your improvement percentage. With two cards to come and no more betting expected, multiply by four. Nine-out flush draw on the flop: roughly 36 percent to hit by the river; on the turn: roughly 18 percent.",
        "These estimates are accurate to within about one percentage point across all realistic out counts, which is more than precise enough at the table. Speed matters: an estimate you can produce in two seconds beats a perfect number you cannot.",
      ],
    },
    {
      heading: "3. Pot Odds and the Price of a Call",
      paras: [
        "Pot odds compare what you must pay against what you can win. If the pot is 100 and your opponent bets 50, you must call 50 to win 150: pot odds of 3 to 1, meaning you need at least 25 percent equity for the call to break even.",
        "The comparison is mechanical: if your hand's equity (from your out count) exceeds the required equity (from the pot odds), calling is profitable. If not, fold, unless implied odds, the money you expect to win on later streets when you hit, close the gap.",
        "Implied odds demand honesty. They are largest when your draw is hidden, your opponent is strong enough to pay you off, and the stacks behind are deep. A four-flush board that scares everyone pays you nothing extra.",
      ],
    },
    {
      heading: "4. Expected Value: The Only Score That Matters",
      paras: [
        "Every decision has an expected value (EV): the average result if the same situation were replayed millions of times. Winning players do not chase outcomes; they chase positive-EV decisions and let the long run do the accounting.",
        "EV = (probability of winning × amount won) − (probability of losing × amount lost). A 40 percent chance to win 200 against a 60 percent chance to lose 100 is +20 per attempt: a bet you should make every time it is offered, even though you lose it more often than you win.",
        "This reframing is the emotional core of professional poker: results on any night are noise. Decision quality is the signal. Judge yourself only on the decisions.",
      ],
    },
  ],
});

makePdf({
  file: "03-advanced-range-construction.pdf",
  title: "Advanced Range Construction & GTO Fundamentals",
  level: "Advanced",
  sections: [
    {
      heading: "1. Thinking in Ranges, Never in Hands",
      paras: [
        "The defining skill of an advanced player is refusing to put an opponent on a hand. Opponents do not hold hands; they hold ranges: the complete set of holdings consistent with every action they have taken so far.",
        "Range work starts preflop. A player who opens from early position and calls a three-bet arrives at the flop with a range you can write down: strong pairs, strong broadways, occasionally suited connectors. Every postflop action then filters that range further. Your job on each street is to update the filter, not to guess a card pair.",
        "Practice: replay a hand history and write the full range at every decision point. It is slow at first. It is also exactly the work that separates the top five percent.",
      ],
    },
    {
      heading: "2. Range Advantage and Nut Advantage",
      paras: [
        "On any board, ask two questions. Whose range connects with more of this board overall (range advantage)? And who can hold the very strongest hands (nut advantage)? The answers dictate who should be betting, how often, and how large.",
        "An ace-high dry board favours the preflop raiser's range massively, which justifies frequent small continuation bets with the entire range. A middling connected board often favours the caller, and the raiser should check far more than instinct suggests.",
        "Nut advantage governs big-bet streets. You can only credibly threaten stacks on rivers where your range, and not your opponent's, contains the strongest combinations.",
      ],
    },
    {
      heading: "3. GTO as a Baseline, Exploitation as the Profit",
      paras: [
        "Game-theory-optimal play is a defensive equilibrium: a strategy that cannot be exploited no matter what the opponent does. It is the correct baseline against unknown or excellent opposition, and the correct study framework because it reveals the structure of the game.",
        "But equilibrium is not maximum profit. Against real opponents with real leaks, every deviation they make funds a counter-deviation for you. A player who folds too often to river bets should be bluffed relentlessly. One who never folds should never be bluffed and always value-bet thinly.",
        "The professional loop: study GTO to understand what balanced looks like, observe where each opponent departs from it, deviate precisely as far as their leak justifies, and no further.",
      ],
    },
    {
      heading: "4. Blocker Effects and Combinatorics",
      paras: [
        "Advanced river decisions are frequently decided by blockers: the way your own cards remove combinations from your opponent's range. Holding the ace of the flush suit on a three-flush river removes their strongest flushes and makes your bluff dramatically more credible.",
        "Combinatorics turns range talk into numbers. There are six combinations of every pocket pair, sixteen of every unpaired hand (twelve offsuit, four suited). When a river card or your own holding removes combinations, the arithmetic of calling or folding shifts, sometimes decisively.",
        "Final exercise: take one river spot from your own play each day and count combinations by hand: value combos you beat, value combos you lose to, bluff combos available. Ten minutes a day of this arithmetic compounds into an unassailable edge.",
      ],
    },
  ],
});

console.log("done — PDFs are in ./samples");
