"use client";

import { useState, Suspense, lazy } from "react";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  Clock,
  Crown,
  Download,
  Flag,
  FlaskConical,
  Info,
  Leaf,
  ListChecks,
  Map,
  Pickaxe,
  Rocket,
  Sparkles,
  Star,
  Tag,
  TrendingUp,
  Trophy,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useMessages } from "next-intl";
import { VideoFeature } from "@/components/home/VideoFeature";
import { LatestGuidesAccordion } from "@/components/home/LatestGuidesAccordion";
import { NativeBannerAd, AdBanner } from "@/components/ads";
import { getPreferredMobileBannerSelection } from "@/components/ads/mobileAdConfigs";
import { scrollToSection } from "@/lib/scrollToSection";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import type { ContentItemWithType } from "@/lib/getLatestArticles";
import type { ModuleLinkMap } from "@/lib/buildModuleLinkMap";

// Lazy load heavy components
const HeroStats = lazy(() => import("@/components/home/HeroStats"));
const FAQSection = lazy(() => import("@/components/home/FAQSection"));
const CTASection = lazy(() => import("@/components/home/CTASection"));

// Loading placeholder
const LoadingPlaceholder = ({ height = "h-64" }: { height?: string }) => (
  <div
    className={`${height} bg-white/5 border border-border rounded-xl animate-pulse`}
  />
);

// Conditionally render text as a link or plain span
function LinkedTitle({
  linkData,
  children,
  className,
  locale,
}: {
  linkData: { url: string; title: string } | null | undefined;
  children: React.ReactNode;
  className?: string;
  locale: string;
}) {
  if (linkData) {
    const href = locale === "en" ? linkData.url : `/${locale}${linkData.url}`;
    return (
      <Link
        href={href}
        className={`${className || ""} hover:text-[hsl(var(--nav-theme-light))] hover:underline decoration-[hsl(var(--nav-theme-light))/0.4] underline-offset-4 transition-colors`}
        title={linkData.title}
      >
        {children}
      </Link>
    );
  }
  return <>{children}</>;
}

interface HomePageClientProps {
  latestArticles: ContentItemWithType[];
  moduleLinkMap: ModuleLinkMap;
  locale: string;
}

export default function HomePageClient({
  latestArticles,
  moduleLinkMap,
  locale,
}: HomePageClientProps) {
  const t = useMessages() as any;
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.thealterslastvariable.wiki";

  // Structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "The Alters Last Variable Wiki",
        description:
          "Complete The Alters: Last Variable Wiki covering the walkthrough, Alters, research, terraforming, the Oasis, endings, achievements, and fixes for the sci-fi survival DLC by 11 bit studios.",
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "The Alters: Last Variable - 20-Hour Sci-Fi Survival Expansion",
        },
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "The Alters Last Variable Wiki",
        alternateName: "The Alters: Last Variable",
        url: siteUrl,
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/android-chrome-512x512.png`,
          width: 512,
          height: 512,
        },
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "The Alters Last Variable Wiki - Walkthrough & Endings",
        },
        sameAs: [
          "https://store.steampowered.com/app/1601570/The_Alters/",
          "https://discord.com/invite/11bitstudios",
          "https://www.reddit.com/r/TheAlters/",
          "https://x.com/altersgame",
          "https://www.youtube.com/@11bitstudios",
          "https://11bitstudios.com/games/the-alters/",
        ],
      },
      {
        "@type": "VideoGame",
        name: "The Alters: Last Variable",
        gamePlatform: ["PC", "Steam", "PlayStation 5", "Xbox Series X|S"],
        applicationCategory: "Game",
        genre: ["Survival", "Sci-fi", "Adventure", "Story DLC"],
        numberOfPlayers: {
          minValue: 1,
          maxValue: 1,
        },
        offers: {
          "@type": "Offer",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: "https://store.steampowered.com/app/1601570/The_Alters/",
        },
      },
      {
        "@type": "VideoObject",
        name: "The Alters: Last Variable | Launch Trailer",
        description:
          "Official The Alters: Last Variable launch trailer from 11 bit studios.",
        uploadDate: "2026-07-13",
        thumbnailUrl: `${siteUrl}/images/hero.webp`,
        embedUrl: "https://www.youtube.com/embed/iO5p3trr8NY",
        contentUrl: "https://www.youtube.com/watch?v=iO5p3trr8NY",
      },
    ],
  };

  // Accordion states for walkthrough + endings sections
  const [walkthroughExpanded, setWalkthroughExpanded] = useState<number | null>(
    null,
  );
  const [endingsExpanded, setEndingsExpanded] = useState<number | null>(null);
  const mobileBannerAd = getPreferredMobileBannerSelection();

  return (
    <div className="home-shell min-h-screen bg-background text-foreground">
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* 广告位 1: 顶部固定横幅 */}
      <div className="sticky top-20 z-20 border-b border-border py-2">
        <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-24 pb-14 md:pt-32 md:pb-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 scroll-reveal">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 md:px-4 md:py-2
                            bg-[hsl(var(--nav-theme)/0.1)]
                            border border-[hsl(var(--nav-theme)/0.3)] mb-4 md:mb-6"
            >
              <Sparkles className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-medium">
                {t.hero.badge}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 md:mb-6 leading-[1.05]">
              {t.hero.title}
            </h1>

            {/* Description */}
            <p className="mx-auto mb-8 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg md:mb-10 md:max-w-3xl md:text-2xl">
              {t.hero.description}
            </p>

            {/* CTA Buttons */}
            <div className="mb-10 flex flex-col justify-center gap-3 sm:flex-row md:mb-12 md:gap-4">
              <button
                onClick={() => scrollToSection("beginner-guide")}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           bg-[hsl(var(--nav-theme))] hover:bg-[hsl(var(--nav-theme)/0.9)]
                           text-white rounded-lg font-semibold text-base md:text-lg transition-colors"
              >
                <BookOpen className="w-5 h-5" />
                {t.hero.getFreeCodesCTA}
              </button>
              <a
                href="https://store.steampowered.com/app/1601570/The_Alters/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           border border-border hover:bg-white/10 rounded-lg
                           font-semibold text-base md:text-lg transition-colors"
              >
                {t.hero.playOnSteamCTA}
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Stats */}
          <Suspense fallback={<LoadingPlaceholder height="h-32" />}>
            <HeroStats stats={Object.values(t.hero.stats)} />
          </Suspense>
        </div>
      </section>

      {/* Video Section - 紧跟 Hero 之后 */}
      <section className="px-4 py-10 md:py-12">
        <div className="scroll-reveal container mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-2xl">
            <VideoFeature
              videoId="iO5p3trr8NY"
              title="The Alters: Last Variable — Launch Trailer"
              poster="/images/hero.webp"
            />
          </div>
        </div>
      </section>

      {/* Tools Grid - 8 Navigation Cards (位于视频区之后、Latest Updates 之前) */}
      <section className="px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.tools.title}{" "}
              <span className="text-[hsl(var(--nav-theme-light))]">
                {t.tools.titleHighlight}
              </span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.tools.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {t.tools.cards.map((card: any, index: number) => {
              const sectionIds = [
                "release-date-platforms-price",
                "dlc-access-story-prerequisites",
                "beginner-guide",
                "walkthrough-quest-guide",
                "the-alters-last-variable-specialist-alters",
                "the-alters-last-variable-underground-base-cryosleep",
                "the-alters-last-variable-terraforming-oasis-research",
                "the-alters-last-variable-endings-choices-achievements",
              ];
              const sectionId = sectionIds[index];

              return (
                <button
                  key={index}
                  onClick={() => scrollToSection(sectionId)}
                  className="scroll-reveal group rounded-xl border border-border p-4 md:p-6
                             bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                             transition-all duration-300 cursor-pointer text-left
                             hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div
                    className="mb-3 h-10 w-10 rounded-lg md:mb-4 md:h-12 md:w-12
                                  bg-[hsl(var(--nav-theme)/0.1)]
                                  flex items-center justify-center
                                  group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                                  transition-colors"
                  >
                    <DynamicIcon
                      name={card.icon}
                      className="h-5 w-5 md:h-6 md:w-6 text-[hsl(var(--nav-theme-light))]"
                    />
                  </div>
                  <h3 className="mb-1.5 text-sm md:text-base font-semibold">
                    {card.title}
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    {card.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 广告位 2: 首屏内容之后再加载广告 */}
      <NativeBannerAd adKey={process.env.NEXT_PUBLIC_AD_NATIVE_BANNER || ""} />

      {/* 广告位 3: 移动端优先使用方形，桌面端保留横幅 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Module 1: Release Date, Platforms and Price */}
      <section id="release-date-platforms-price" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="flex items-center justify-center gap-3 mb-3 md:mb-4">
              <Rocket className="w-7 h-7 md:w-8 md:h-8 text-[hsl(var(--nav-theme-light))]" />
              <h2 className="text-3xl md:text-5xl font-bold">
                <LinkedTitle
                  linkData={moduleLinkMap["releaseDatePlatformsPrice"]}
                  locale={locale}
                >
                  {t.modules.releaseDatePlatformsPrice.title}
                </LinkedTitle>
              </h2>
            </div>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.releaseDatePlatformsPrice.intro}
            </p>
          </div>

          {/* 桌面表格 */}
          <div className="scroll-reveal hidden md:block overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-[hsl(var(--nav-theme)/0.1)] text-left">
                <tr>
                  <th className="p-3 font-semibold">Platform</th>
                  <th className="p-3 font-semibold">Release Date</th>
                  <th className="p-3 font-semibold">Price</th>
                  <th className="p-3 font-semibold">Availability</th>
                  <th className="p-3 font-semibold">Base Game</th>
                  <th className="p-3 font-semibold">Features</th>
                </tr>
              </thead>
              <tbody>
                {t.modules.releaseDatePlatformsPrice.platforms.map(
                  (p: any, i: number) => (
                    <tr key={i} className="border-t border-border align-top">
                      <td className="p-3 font-semibold">{p.platform}</td>
                      <td className="p-3">{p.releaseDate}</td>
                      <td className="p-3 font-bold text-[hsl(var(--nav-theme-light))]">
                        {p.price}
                      </td>
                      <td className="p-3">{p.availability}</td>
                      <td className="p-3">{p.baseGameRequired}</td>
                      <td className="p-3 text-muted-foreground">{p.features}</td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>

          {/* 移动卡片 */}
          <div className="scroll-reveal md:hidden space-y-3">
            {t.modules.releaseDatePlatformsPrice.platforms.map(
              (p: any, i: number) => (
                <div
                  key={i}
                  className="p-4 bg-white/5 border border-border rounded-xl"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold">{p.platform}</h3>
                    <span className="font-bold text-[hsl(var(--nav-theme-light))]">
                      {p.price}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1.5">
                    {p.releaseDate} · {p.availability}
                  </p>
                  <p className="text-sm text-muted-foreground">{p.features}</p>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Module 2: DLC Access and Story Prerequisites */}
      <section
        id="dlc-access-story-prerequisites"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="flex items-center justify-center gap-3 mb-3 md:mb-4">
              <Download className="w-7 h-7 md:w-8 md:h-8 text-[hsl(var(--nav-theme-light))]" />
              <h2 className="text-3xl md:text-5xl font-bold">
                <LinkedTitle
                  linkData={moduleLinkMap["dlcAccessStoryPrerequisites"]}
                  locale={locale}
                >
                  {t.modules.dlcAccessStoryPrerequisites.title}
                </LinkedTitle>
              </h2>
            </div>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.dlcAccessStoryPrerequisites.intro}
            </p>
          </div>

          <div className="scroll-reveal space-y-3 md:space-y-4">
            {t.modules.dlcAccessStoryPrerequisites.steps.map(
              (step: any, index: number) => (
                <div
                  key={index}
                  className="flex gap-3 md:gap-4 p-4 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <div className="flex h-10 w-10 md:h-12 md:w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-[hsl(var(--nav-theme)/0.5)] bg-[hsl(var(--nav-theme)/0.2)]">
                    <span className="text-base md:text-xl font-bold text-[hsl(var(--nav-theme-light))]">
                      {index + 1}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-bold mb-1.5 md:mb-2">
                      <LinkedTitle
                        linkData={
                          moduleLinkMap[
                            `dlcAccessStoryPrerequisites::steps::${index}`
                          ]
                        }
                        locale={locale}
                      >
                        {step.title}
                      </LinkedTitle>
                    </h3>
                    <p className="text-sm md:text-base text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Module 3: Beginner Guide */}
      <section id="beginner-guide" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="flex items-center justify-center gap-3 mb-3 md:mb-4">
              <BookOpen className="w-7 h-7 md:w-8 md:h-8 text-[hsl(var(--nav-theme-light))]" />
              <h2 className="text-3xl md:text-5xl font-bold">
                <LinkedTitle
                  linkData={moduleLinkMap["beginnerGuide"]}
                  locale={locale}
                >
                  {t.modules.beginnerGuide.title}
                </LinkedTitle>
              </h2>
            </div>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.beginnerGuide.intro}
            </p>
          </div>

          <div className="scroll-reveal space-y-4">
            {t.modules.beginnerGuide.steps.map((step: any, index: number) => (
              <div
                key={index}
                className="p-4 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-3">
                  <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[hsl(var(--nav-theme)/0.2)] border border-[hsl(var(--nav-theme)/0.5)] text-sm font-bold text-[hsl(var(--nav-theme-light))]">
                    {index + 1}
                  </span>
                  {step.timeframe && (
                    <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                      <Clock className="w-3 h-3" />
                      {step.timeframe}
                    </span>
                  )}
                  <h3 className="text-lg md:text-xl font-bold">
                    <LinkedTitle
                      linkData={
                        moduleLinkMap[`beginnerGuide::steps::${index}`]
                      }
                      locale={locale}
                    >
                      {step.title}
                    </LinkedTitle>
                  </h3>
                </div>

                {step.objectives && (
                  <ul className="space-y-1.5 mb-3">
                    {step.objectives.map((o: string, oi: number) => (
                      <li
                        key={oi}
                        className="flex items-start gap-2 text-sm md:text-base text-muted-foreground"
                      >
                        <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-1 flex-shrink-0" />
                        {o}
                      </li>
                    ))}
                  </ul>
                )}

                {step.alterOptions && (
                  <div className="mb-3 p-3 rounded-lg bg-[hsl(var(--nav-theme)/0.05)] border border-[hsl(var(--nav-theme)/0.2)]">
                    <p className="text-xs font-semibold mb-1.5 text-[hsl(var(--nav-theme-light))]">
                      First Alter options
                    </p>
                    <ul className="space-y-1">
                      {step.alterOptions.map((a: string, ai: number) => (
                        <li
                          key={ai}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <Star className="w-3.5 h-3.5 text-[hsl(var(--nav-theme-light))] mt-1 flex-shrink-0" />
                          {a}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {step.keyCosts && (
                  <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                    <Tag className="w-3.5 h-3.5" />
                    {step.keyCosts}
                  </span>
                )}

                {step.avoid && (
                  <p className="mt-3 flex items-start gap-2 text-sm text-muted-foreground">
                    <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                    {step.avoid}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 广告位 4: 阅读停顿位 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-468x60"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60}
        className="hidden md:flex"
      />

      {/* Module 4: Walkthrough and Quest Guide */}
      <section
        id="walkthrough-quest-guide"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="flex items-center justify-center gap-3 mb-3 md:mb-4">
              <Map className="w-7 h-7 md:w-8 md:h-8 text-[hsl(var(--nav-theme-light))]" />
              <h2 className="text-3xl md:text-5xl font-bold">
                <LinkedTitle
                  linkData={moduleLinkMap["walkthroughQuestGuide"]}
                  locale={locale}
                >
                  {t.modules.walkthroughQuestGuide.title}
                </LinkedTitle>
              </h2>
            </div>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.walkthroughQuestGuide.intro}
            </p>
          </div>

          <div className="scroll-reveal space-y-3">
            {t.modules.walkthroughQuestGuide.cycles.map(
              (cycle: any, index: number) => (
                <div
                  key={index}
                  className="border border-border rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() =>
                      setWalkthroughExpanded(
                        walkthroughExpanded === index ? null : index,
                      )
                    }
                    className="w-full flex items-center justify-between p-4 md:p-5 text-left hover:bg-white/5 transition-colors"
                  >
                    <span className="font-semibold text-base md:text-lg">
                      <span className="text-[hsl(var(--nav-theme-light))] mr-2">
                        Cycle {index + 1}
                      </span>
                      {cycle.section}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 flex-shrink-0 transition-transform ${walkthroughExpanded === index ? "rotate-180" : ""}`}
                    />
                  </button>
                  {walkthroughExpanded === index && (
                    <div className="px-4 md:px-5 pb-5 space-y-4 text-sm md:text-base">
                      {cycle.mainQuests?.length > 0 && (
                        <div>
                          <p className="font-semibold mb-1.5 flex items-center gap-1.5">
                            <Flag className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
                            Main Quests
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {cycle.mainQuests.map((q: string, qi: number) => (
                              <span
                                key={qi}
                                className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]"
                              >
                                {q}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {cycle.requiredActions?.length > 0 && (
                        <CycleList
                          icon={<Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />}
                          title="Required Actions"
                          items={cycle.requiredActions}
                        />
                      )}
                      {cycle.requiredResearch?.length > 0 && (
                        <CycleList
                          icon={<FlaskConical className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />}
                          title="Required Research"
                          items={cycle.requiredResearch}
                        />
                      )}
                      {cycle.importantCosts?.length > 0 && (
                        <CycleList
                          icon={<Tag className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />}
                          title="Important Costs"
                          items={cycle.importantCosts}
                        />
                      )}
                      {cycle.optionalObjectives?.length > 0 && (
                        <CycleList
                          icon={<Star className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />}
                          title="Optional Objectives"
                          items={cycle.optionalObjectives}
                        />
                      )}
                      {cycle.completionCheckpoint && (
                        <div className="p-3 rounded-lg bg-[hsl(var(--nav-theme)/0.05)] border border-[hsl(var(--nav-theme)/0.2)]">
                          <p className="font-semibold mb-1 flex items-center gap-1.5">
                            <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
                            Completion Checkpoint
                          </p>
                          <p className="text-muted-foreground">
                            {cycle.completionCheckpoint}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Module 5: Specialist Alters and Best Assignments */}
      <section
        id="the-alters-last-variable-specialist-alters"
        className="scroll-mt-24 px-4 py-14 md:py-20"
      >
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="flex items-center justify-center gap-3 mb-3 md:mb-4">
              <Users className="w-7 h-7 md:w-8 md:h-8 text-[hsl(var(--nav-theme-light))]" />
              <h2 className="text-3xl md:text-5xl font-bold">
                <LinkedTitle
                  linkData={moduleLinkMap["specialistAlters"]}
                  locale={locale}
                >
                  {t.modules.specialistAlters.title}
                </LinkedTitle>
              </h2>
            </div>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.specialistAlters.intro}
            </p>
          </div>

          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.modules.specialistAlters.specialists.map(
              (s: any, index: number) => (
                <div
                  key={index}
                  className="p-5 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs px-2 py-1 rounded-full border font-bold ${s.tier === "S" ? "bg-[hsl(var(--nav-theme)/0.2)] border-[hsl(var(--nav-theme)/0.5)] text-[hsl(var(--nav-theme-light))]" : "bg-white/5 border-border"}`}
                      >
                        Tier {s.tier}
                      </span>
                      {s.tier === "S" && (
                        <Crown className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
                      )}
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                      Create #{s.creationPriority}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold mb-2">
                    <LinkedTitle
                      linkData={
                        moduleLinkMap[`specialistAlters::specialists::${index}`]
                      }
                      locale={locale}
                    >
                      {s.specialist}
                    </LinkedTitle>
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {s.scientificSpecialty}
                  </p>

                  {s.researchContribution?.length > 0 && (
                    <SpecialistList
                      icon={<FlaskConical className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />}
                      title="Research Contribution"
                      items={s.researchContribution}
                    />
                  )}
                  {s.workEfficiency && (
                    <p className="text-sm mb-3 flex items-start gap-2">
                      <TrendingUp className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{s.workEfficiency}</span>
                    </p>
                  )}
                  {s.bestAssignments?.length > 0 && (
                    <SpecialistList
                      icon={<ListChecks className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />}
                      title="Best Assignments"
                      items={s.bestAssignments}
                    />
                  )}
                  {s.personality && (
                    <p className="text-sm mb-3 flex items-start gap-2">
                      <Info className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{s.personality}</span>
                    </p>
                  )}
                  {s.fieldLabTiming && (
                    <p className="text-sm mb-3 flex items-start gap-2">
                      <Clock className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{s.fieldLabTiming}</span>
                    </p>
                  )}
                  {s.relationshipRule && (
                    <div className="mt-3 p-3 rounded-lg bg-[hsl(var(--nav-theme)/0.05)] border border-[hsl(var(--nav-theme)/0.2)]">
                      <p className="text-xs font-semibold mb-1 text-[hsl(var(--nav-theme-light))]">
                        Relationship Rule
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {s.relationshipRule}
                      </p>
                    </div>
                  )}
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Module 6: Underground Base and Cryosleep */}
      <section
        id="the-alters-last-variable-underground-base-cryosleep"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="flex items-center justify-center gap-3 mb-3 md:mb-4">
              <Pickaxe className="w-7 h-7 md:w-8 md:h-8 text-[hsl(var(--nav-theme-light))]" />
              <h2 className="text-3xl md:text-5xl font-bold">
                <LinkedTitle
                  linkData={moduleLinkMap["undergroundBaseCryosleep"]}
                  locale={locale}
                >
                  {t.modules.undergroundBaseCryosleep.title}
                </LinkedTitle>
              </h2>
            </div>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.undergroundBaseCryosleep.intro}
            </p>
          </div>

          <div className="scroll-reveal space-y-4">
            {t.modules.undergroundBaseCryosleep.steps.map(
              (step: any, index: number) => (
                <div
                  key={index}
                  className="p-4 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-3">
                    <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[hsl(var(--nav-theme)/0.2)] border border-[hsl(var(--nav-theme)/0.5)] text-sm font-bold text-[hsl(var(--nav-theme-light))]">
                      {index + 1}
                    </span>
                    <h3 className="text-lg md:text-xl font-bold">
                      <LinkedTitle
                        linkData={
                          moduleLinkMap[
                            `undergroundBaseCryosleep::steps::${index}`
                          ]
                        }
                        locale={locale}
                      >
                        {step.title}
                      </LinkedTitle>
                    </h3>
                  </div>

                  {step.timing && (
                    <p className="text-xs mb-3 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                      <Clock className="w-3 h-3" />
                      {step.timing}
                    </p>
                  )}

                  {step.requirements?.length > 0 && (
                    <ul className="space-y-1.5 mb-3">
                      {step.requirements.map((r: string, ri: number) => (
                        <li
                          key={ri}
                          className="flex items-start gap-2 text-sm md:text-base text-muted-foreground"
                        >
                          <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-1 flex-shrink-0" />
                          {r}
                        </li>
                      ))}
                    </ul>
                  )}

                  {step.baseRule && (
                    <p className="text-sm mb-2 flex items-start gap-2">
                      <Info className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{step.baseRule}</span>
                    </p>
                  )}

                  {step.failurePrevented && (
                    <p className="text-sm flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">
                        {step.failurePrevented}
                      </span>
                    </p>
                  )}
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Module 7: Terraforming, Oasis and Research */}
      <section
        id="the-alters-last-variable-terraforming-oasis-research"
        className="scroll-mt-24 px-4 py-14 md:py-20"
      >
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="flex items-center justify-center gap-3 mb-3 md:mb-4">
              <Leaf className="w-7 h-7 md:w-8 md:h-8 text-[hsl(var(--nav-theme-light))]" />
              <h2 className="text-3xl md:text-5xl font-bold">
                <LinkedTitle
                  linkData={moduleLinkMap["terraformingOasisResearch"]}
                  locale={locale}
                >
                  {t.modules.terraformingOasisResearch.title}
                </LinkedTitle>
              </h2>
            </div>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.terraformingOasisResearch.intro}
            </p>
          </div>

          {/* 桌面表格 */}
          <div className="scroll-reveal hidden lg:block overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-[hsl(var(--nav-theme)/0.1)] text-left">
                <tr>
                  <th className="p-3 font-semibold">Arena</th>
                  <th className="p-3 font-semibold">Terraformer</th>
                  <th className="p-3 font-semibold">Surface Role</th>
                  <th className="p-3 font-semibold">Key Pickables</th>
                  <th className="p-3 font-semibold">Resource / Unlock</th>
                  <th className="p-3 font-semibold">Research Priority</th>
                </tr>
              </thead>
              <tbody>
                {t.modules.terraformingOasisResearch.arenas.map(
                  (a: any, i: number) => (
                    <tr key={i} className="border-t border-border align-top">
                      <td className="p-3 font-semibold">{a.arena}</td>
                      <td className="p-3 whitespace-nowrap">{a.terraformer}</td>
                      <td className="p-3 text-muted-foreground">{a.surfaceRole}</td>
                      <td className="p-3 text-muted-foreground">
                        {a.keyPickables.join(", ")}
                      </td>
                      <td className="p-3 text-muted-foreground">
                        {a.resourceOrUnlock}
                      </td>
                      <td className="p-3 text-muted-foreground">
                        {a.researchPriority}
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>

          {/* 平板/移动卡片 */}
          <div className="scroll-reveal lg:hidden space-y-3">
            {t.modules.terraformingOasisResearch.arenas.map(
              (a: any, i: number) => (
                <div
                  key={i}
                  className="p-4 bg-white/5 border border-border rounded-xl"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold">{a.arena}</h3>
                    <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                      {a.terraformer}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {a.surfaceRole}
                  </p>
                  <p className="text-xs text-muted-foreground mb-1">
                    <span className="font-semibold text-[hsl(var(--nav-theme-light))]">
                      Pickables:
                    </span>{" "}
                    {a.keyPickables.join(", ")}
                  </p>
                  <p className="text-sm text-muted-foreground mb-2">
                    {a.resourceOrUnlock}
                  </p>
                  <p className="text-sm flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{a.hazardResponse}</span>
                  </p>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Module 8: Endings, Choices and Achievements */}
      <section
        id="the-alters-last-variable-endings-choices-achievements"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="flex items-center justify-center gap-3 mb-3 md:mb-4">
              <Trophy className="w-7 h-7 md:w-8 md:h-8 text-[hsl(var(--nav-theme-light))]" />
              <h2 className="text-3xl md:text-5xl font-bold">
                <LinkedTitle
                  linkData={moduleLinkMap["endingsChoicesAchievements"]}
                  locale={locale}
                >
                  {t.modules.endingsChoicesAchievements.title}
                </LinkedTitle>
              </h2>
            </div>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.endingsChoicesAchievements.intro}
            </p>
          </div>

          <div className="scroll-reveal space-y-3">
            {t.modules.endingsChoicesAchievements.items.map(
              (item: any, index: number) => (
                <div
                  key={index}
                  className="border border-border rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() =>
                      setEndingsExpanded(
                        endingsExpanded === index ? null : index,
                      )
                    }
                    className="w-full flex items-center justify-between p-4 md:p-5 text-left hover:bg-white/5 transition-colors"
                  >
                    <span className="font-semibold text-base md:text-lg pr-2">
                      {item.heading}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 flex-shrink-0 transition-transform ${endingsExpanded === index ? "rotate-180" : ""}`}
                    />
                  </button>
                  {endingsExpanded === index && (
                    <div className="px-4 md:px-5 pb-5 space-y-3 text-sm md:text-base">
                      <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-400">
                        <AlertTriangle className="w-3 h-3" />
                        {item.spoilerLevel}
                      </span>
                      <p className="text-muted-foreground">{item.summary}</p>

                      {item.details?.length > 0 && (
                        <ul className="space-y-1.5">
                          {item.details.map((d: string, di: number) => (
                            <li
                              key={di}
                              className="flex items-start gap-2 text-muted-foreground"
                            >
                              <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-1 flex-shrink-0" />
                              {d}
                            </li>
                          ))}
                        </ul>
                      )}

                      {item.requirements?.length > 0 && (
                        <EndingList
                          icon={<Flag className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />}
                          title="Requirements"
                          items={item.requirements}
                        />
                      )}

                      {item.savePoints?.length > 0 && (
                        <EndingList
                          icon={<Flag className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />}
                          title="Best Save Points"
                          items={item.savePoints}
                        />
                      )}

                      {item.missables?.length > 0 && (
                        <EndingList
                          icon={<Star className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />}
                          title="Missable Objectives"
                          items={item.missables}
                        />
                      )}

                      {item.outcome && (
                        <p className="flex items-start gap-2">
                          <Info className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">
                            <span className="font-semibold text-foreground">
                              Outcome:{" "}
                            </span>
                            {item.outcome}
                          </span>
                        </p>
                      )}

                      {item.theme && (
                        <p className="flex items-start gap-2">
                          <Sparkles className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">
                            <span className="font-semibold text-foreground">
                              Theme:{" "}
                            </span>
                            {item.theme}
                          </span>
                        </p>
                      )}

                      {item.achievements?.length > 0 && (
                        <div className="space-y-2">
                          <p className="font-semibold flex items-center gap-1.5">
                            <Trophy className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
                            Achievements & Trophies
                          </p>
                          {item.achievements.map((a: any, ai: number) => (
                            <div
                              key={ai}
                              className="p-3 bg-white/5 border border-border rounded-lg"
                            >
                              <p className="font-semibold text-sm text-[hsl(var(--nav-theme-light))]">
                                {a.name}
                              </p>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {a.requirement}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* 广告位 5: 移动端横幅 */}
      {mobileBannerAd && (
        <AdBanner
          type={mobileBannerAd.type}
          adKey={mobileBannerAd.adKey}
          className="md:hidden"
        />
      )}

      {/* Latest Updates Section (位于 Tools Grid 之后) */}
      <LatestGuidesAccordion
        articles={latestArticles}
        locale={locale}
        max={12}
      />

      {/* FAQ Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <FAQSection
          title={t.faq.title}
          titleHighlight={t.faq.titleHighlight}
          subtitle={t.faq.subtitle}
          questions={t.faq.questions}
        />
      </Suspense>

      {/* CTA Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <CTASection
          title={t.cta.title}
          description={t.cta.description}
          joinCommunity={t.cta.joinCommunity}
          joinGame={t.cta.joinGame}
        />
      </Suspense>

      {/* Ad Banner 3 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Footer */}
      <footer className="bg-white/[0.02] border-t border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-[hsl(var(--nav-theme-light))]">
                {t.footer.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t.footer.description}
              </p>
            </div>

            {/* Community - External Links Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.community}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://discord.com/invite/11bitstudios"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.discord}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.reddit.com/r/TheAlters/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.reddit}
                  </a>
                </li>
                <li>
                  <a
                    href="https://x.com/altersgame"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.twitter}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.youtube.com/@11bitstudios"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.youtube}
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal - Internal Routes Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.legal}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.about}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.privacy}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-of-service"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.terms}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/copyright"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.copyrightNotice}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Copyright */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                {t.footer.copyright}
              </p>
              <p className="text-xs text-muted-foreground">
                {t.footer.disclaimer}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Walkthrough cycle 内部列表（section 内复用，非独立 section）
function CycleList({
  icon,
  title,
  items,
}: {
  icon: React.ReactNode;
  title: string;
  items: string[];
}) {
  return (
    <div>
      <p className="font-semibold mb-1.5 flex items-center gap-1.5">
        {icon}
        {title}
      </p>
      <ul className="space-y-1">
        {items.map((it: string, i: number) => (
          <li
            key={i}
            className="flex items-start gap-2 pl-5 text-muted-foreground"
          >
            <span className="text-[hsl(var(--nav-theme-light))] mt-1">•</span>
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}

// Specialist 卡片内部列表
function SpecialistList({
  icon,
  title,
  items,
}: {
  icon: React.ReactNode;
  title: string;
  items: string[];
}) {
  return (
    <div className="mb-3">
      <p className="text-xs font-semibold mb-1.5 text-[hsl(var(--nav-theme-light))] flex items-center gap-1.5">
        {icon}
        {title}
      </p>
      <ul className="space-y-1">
        {items.map((it: string, i: number) => (
          <li
            key={i}
            className="flex items-start gap-2 text-sm text-muted-foreground"
          >
            <Check className="w-3.5 h-3.5 text-[hsl(var(--nav-theme-light))] mt-1 flex-shrink-0" />
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}

// Endings accordion 内部列表
function EndingList({
  icon,
  title,
  items,
}: {
  icon: React.ReactNode;
  title: string;
  items: string[];
}) {
  return (
    <div>
      <p className="font-semibold mb-1.5 flex items-center gap-1.5">
        {icon}
        {title}
      </p>
      <ul className="space-y-1.5">
        {items.map((it: string, i: number) => (
          <li
            key={i}
            className="flex items-start gap-2 text-muted-foreground"
          >
            <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-1 flex-shrink-0" />
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}
