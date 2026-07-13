import Link from "next/link";
import { ArrowUpRight, FileText, BadgeCheck } from "lucide-react";
import { formatUsd, type Course } from "@/lib/site";
import { cn } from "@/lib/utils";

const levelColor: Record<Course["level"], string> = {
  Beginner: "text-success border-success/40 bg-success/10",
  Intermediate: "text-gold-400 border-gold-500/40 bg-gold-500/10",
  Advanced: "text-chip-400 border-chip-500/40 bg-chip-500/10",
};

const suits = ["♠", "♥", "♦", "♣"];

export function CourseCard({ course, index = 0, owned }: { course: Course; index?: number; owned?: boolean }) {
  return (
    <Link
      href={`/courses/${course.id}`}
      className="group surface relative flex h-full flex-col overflow-hidden p-7 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-(--shadow-gold)"
    >
      <span
        aria-hidden
        className={cn(
          "font-display absolute -top-6 -right-2 text-[7rem] leading-none opacity-[0.07] transition-opacity duration-500 group-hover:opacity-[0.14]",
          course.level === "Advanced" ? "text-chip-400" : "text-gold-400",
        )}
      >
        {suits[index % suits.length]}
      </span>

      <div className="relative flex items-center gap-2">
        <span className={cn("rounded-pill border px-3 py-1 text-xs font-bold tracking-wide", levelColor[course.level])}>
          {course.level}
        </span>
        {owned && (
          <span className="inline-flex items-center gap-1 rounded-pill border border-success/40 bg-success/10 px-3 py-1 text-xs font-bold text-success">
            <BadgeCheck className="size-3.5" aria-hidden /> Owned
          </span>
        )}
      </div>

      <h3 className="font-display relative mt-4 text-xl leading-snug tracking-wide text-cream transition-colors group-hover:text-gold-300">
        {course.title}
      </h3>
      <p className="relative mt-2 flex-1 text-[0.93rem] leading-relaxed text-cream-soft">
        {course.summary}
      </p>

      <div className="relative mt-5 flex items-center justify-between border-t border-line-soft pt-4">
        <span className="flex items-center gap-1.5 text-sm text-cream-faint">
          <FileText className="size-4" aria-hidden />
          {course.pages > 0 ? `${course.pages} pages` : "PDF course"}
        </span>
        <span className="flex items-center gap-1.5 font-semibold text-gold-400">
          {formatUsd(course.priceUsd)}
          <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
        </span>
      </div>
    </Link>
  );
}
