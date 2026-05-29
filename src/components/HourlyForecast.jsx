import { useRef, useEffect } from "react";

function HourlyForecast({ hourlyData }) {
  const scrollRef = useRef(null);
  const scrollTimeoutRef = useRef(null);
  const isProgrammaticScroll = useRef(false);
  const currentHour = new Date().getHours();

  const scrollToCurrent = () => {
    if (!scrollRef.current) return;
    const currentCard = scrollRef.current.querySelector(
      ".hourly-card--current"
    );
    if (currentCard) {
      const container = scrollRef.current;
      const containerWidth = container.clientWidth;
      const cardOffsetLeft = currentCard.offsetLeft;
      const cardWidth = currentCard.clientWidth;
      const targetScrollLeft = cardOffsetLeft - containerWidth / 2 + cardWidth / 2;

      if (Math.abs(container.scrollLeft - targetScrollLeft) < 5) {
        return;
      }

      isProgrammaticScroll.current = true;
      container.scrollTo({
        left: targetScrollLeft,
        behavior: "smooth",
      });

      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => {
        isProgrammaticScroll.current = false;
      }, 1000);
    }
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (!container || !hourlyData || hourlyData.length === 0) return;

    scrollToCurrent();

    const handleScroll = () => {
      if (isProgrammaticScroll.current) return;

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = setTimeout(() => {
        scrollToCurrent();
      }, 5000);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      container.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [hourlyData]);

  if (!hourlyData || hourlyData.length === 0) return null;

  return (
    <section className="section-block compact" id="hourly">
      <div className="section-heading align-start">
        <p className="section-kicker">Hourly</p>
        <h2>Hour-by-hour breakdown</h2>
        <p>
          A detailed look at how today&apos;s weather unfolds throughout the
          day.
        </p>
      </div>

      <div className="rounded-[15px] p-2">
        <div ref={scrollRef} className="flex gap-[14px] overflow-x-auto p-5 snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden bg-transparent">
          {hourlyData.map((hour) => {
            const hourDate = new Date(hour.time);
            const hourNum = hourDate.getHours();
            const isCurrent = hourNum === currentHour;

            const formattedTime =
              hourNum === 0
                ? "12 AM"
                : hourNum < 12
                  ? `${hourNum} AM`
                  : hourNum === 12
                    ? "12 PM"
                    : `${hourNum - 12} PM`;

            const iconUrl = hour.condition.icon.startsWith("//")
              ? `https:${hour.condition.icon}`
              : hour.condition.icon;

            return (
              <article
                key={hour.time_epoch}
                className={`relative flex flex-col items-center gap-2 flex-[0_0_105px] min-w-[105px] md:flex-[0_0_120px] md:min-w-[120px] py-4 px-2.5 md:py-5 md:px-3.5 rounded-[22px] text-center snap-center transition-all duration-300 ease-out bg-[var(--surface-strong)] backdrop-blur-md border border-[var(--border)] ${
                  isCurrent
                    ? "hourly-card--current !bg-gradient-to-br !from-[rgba(242,138,43,0.18)] !to-[rgba(242,138,43,0.04)] !border-[rgba(242,138,43,0.48)] shadow-[0_0_0_3px_rgba(242,138,43,0.12),_0_8px_32px_rgba(242,138,43,0.18)] hover:!border-[rgba(242,138,43,0.6)] hover:shadow-[0_0_0_3px_rgba(242,138,43,0.18),_0_24px_48px_rgba(37,30,21,0.15)] scale-[1.02] z-10"
                    : "hover:scale-[1.01]"
                }`}
              >
                {isCurrent && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 py-[3px] px-3 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent-strong)] text-white text-[0.7rem] font-extrabold tracking-wider uppercase whitespace-nowrap">
                    Now
                  </span>
                )}

                <p
                  className={`m-0 text-[0.82rem] font-extrabold tracking-wide ${
                    isCurrent ? "text-[var(--accent-strong)]" : "text-[var(--muted)]"
                  }`}
                >
                  {formattedTime}
                </p>

                <img
                  src={iconUrl}
                  alt={hour.condition.text}
                  className="w-10 h-10 md:w-12 md:h-12"
                  width="48"
                  height="48"
                />

                <strong className="text-[1.18rem] md:text-[1.35rem] tracking-tight leading-none">
                  {Math.round(hour.temp_c)}°C
                </strong>

                <span className="text-[0.82rem] font-bold text-[var(--muted)]">
                  💧 {hour.chance_of_rain}%
                </span>

                <small className="text-[0.72rem] text-[var(--muted)] leading-[1.35] max-w-[100px] truncate">
                  {hour.condition.text}
                </small>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default HourlyForecast;

