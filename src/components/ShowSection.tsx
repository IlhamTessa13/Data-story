// src/components/ShowSection.tsx
import { useState, useEffect } from "react";

const members = [
  { name: "Ari", nickname: "Ari", number: 1, file: "ari.png" },
  { name: "Tesa", nickname: "Tesa", number: 2, file: "tesa.png" },
  { name: "Fia", nickname: "Fia", number: 3, file: "pia.png" },
  { name: "Halim ", nickname: "Halim", number: 4, file: "halim.png" },
  { name: "Amey", nickname: "Amey", number: 5, file: "amey.png" },
];

const total = members.length;

// Each MEMBER has a fixed rotation for life — never changes regardless of slot
// This prevents any rotation jump when cards shift positions
const MEMBER_ROTATION = [2, -5, 6, -3, 4];

// Slot controls only Y offset, scale, and z-index
const SLOT_Y = [0, 10, 16, 20, 24];
const SLOT_SCALE = [1, 0.97, 0.94, 0.91, 0.88];
const SLOT_Z = [50, 40, 30, 20, 10];

// Physics easing: fast start, decelerate (card falling with gravity feel)
const FALL_EASING = "cubic-bezier(0.55, 0, 1, 0.45)"; // accelerate down
const RISE_EASING = "cubic-bezier(0, 0.55, 0.45, 1)"; // decelerate up (like lifting)

// How many cards have been "spent" (moved off the front)
// visibleCount = total - spent
// spent=0 → all 5 cards in stack; spent=5 → stack empty

type CardState = {
  // Which visual slot this card currently occupies (0=front … total-1=back)
  // null means it has been "fallen off" (spent) and lives below viewport
  slot: number | null;
  // Animation override for this card
  phase: "idle" | "falling" | "snap-below" | "rising";
};

export default function ShowSection() {
  // order[i] = memberIndex at position i from front (only unspent cards)
  const [order, setOrder] = useState<number[]>(members.map((_, i) => i));
  // spent: array of memberIndices that have already fallen off, in order
  const [spent, setSpent] = useState<number[]>([]);
  const [animating, setAnimating] = useState(false);

  // Per-card animation phase
  const [phases, setPhases] = useState<Record<number, CardState["phase"]>>(() =>
    Object.fromEntries(
      members.map((_, i) => [i, "idle" as CardState["phase"]]),
    ),
  );

  const canGoNext = order.length > 0 && !animating;
  // Can go prev only if there are spent cards
  const canGoPrev = spent.length > 0 && !animating;

  const goNext = () => {
    if (!canGoNext) return;
    setAnimating(true);
    const frontIdx = order[0];

    // 1. Trigger fall animation on front card
    setPhases((p) => ({ ...p, [frontIdx]: "falling" }));

    setTimeout(() => {
      // 2. Move card from active order → spent
      setOrder((o) => o.slice(1));
      setSpent((s) => [...s, frontIdx]);
      // Snap below instantly (no transition)
      setPhases((p) => ({ ...p, [frontIdx]: "snap-below" }));

      setTimeout(() => {
        setAnimating(false);
      }, 40);
    }, 480);
  };

  const goPrev = () => {
    if (!canGoPrev) return;
    setAnimating(true);
    // The last spent card comes back
    const returnIdx = spent[spent.length - 1];

    // 1. Snap it BELOW viewport (no transition) — will rise up from bottom
    setPhases((p) => ({ ...p, [returnIdx]: "snap-below" }));

    setTimeout(() => {
      // 2. Move it back to front of order
      setOrder((o) => [returnIdx, ...o]);
      setSpent((s) => s.slice(0, -1));

      setTimeout(() => {
        // 3. Animate it rising into slot 0
        setPhases((p) => ({ ...p, [returnIdx]: "rising" }));

        setTimeout(() => {
          setPhases((p) => ({ ...p, [returnIdx]: "idle" }));
          setAnimating(false);
        }, 520);
      }, 30);
    }, 30);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") goNext();
      if (e.key === "ArrowUp") goPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [order, spent, animating]);

  const frontMember = order.length > 0 ? members[order[0]] : null;
  const shownCount = order.length; // cards still in stack

  return (
    <section
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(160deg, #d4f5ef 0%, #e8f8f5 40%, #c9f0e8 100%)",
        overflow: "hidden",
        padding: "2rem",
      }}
    >
      {/* Bg blobs */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <div
          style={{
            position: "absolute",
            top: "10%",
            left: "5%",
            width: 320,
            height: 320,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(29,158,117,0.12) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "15%",
            right: "8%",
            width: 260,
            height: 260,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(201,150,15,0.1) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Left nav */}
      <div
        style={{
          position: "absolute",
          left: "clamp(1.5rem, 5vw, 5rem)",
          top: "50%",
          transform: "translateY(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.5rem",
          zIndex: 100,
        }}
      >
        <div
          style={{
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: "0.65rem",
            fontWeight: 700,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "#1d9e75",
            marginBottom: "1rem",
          }}
        >
          Tim 1 3SD1
        </div>

        <NavBtn onClick={goPrev} disabled={!canGoPrev}>
          &#8679;
        </NavBtn>

        {/* Progress dots */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 6,
            padding: "0.4rem 0",
          }}
        >
          {members.map((_, i) => {
            const isActive = order[0] === i;
            const isSpent = spent.includes(i);
            return (
              <div
                key={i}
                style={{
                  width: isActive ? 8 : 5,
                  height: isActive ? 8 : 5,
                  borderRadius: "50%",
                  background: isActive
                    ? "#1d9e75"
                    : isSpent
                      ? "rgba(29,158,117,0.12)"
                      : "rgba(29,158,117,0.3)",
                  transition: "all 0.35s ease",
                  alignSelf: "center",
                }}
              />
            );
          })}
        </div>

        <NavBtn onClick={goNext} disabled={!canGoNext}>
          &#8681;
        </NavBtn>
      </div>

      {/* Right info */}
      <div
        style={{
          position: "absolute",
          right: "clamp(1.5rem, 5vw, 5rem)",
          top: "50%",
          transform: "translateY(-50%)",
          textAlign: "right",
          zIndex: 100,
        }}
      >
        <div
          style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            fontWeight: 900,
            color: "#0C2726",
            lineHeight: 1.1,
          }}
        >
          Kenalan
          <br />
          <span style={{ color: "#1d9e75" }}>Yuk!</span>
        </div>
        <p
          style={{
            fontFamily: "'Lora', serif",
            fontStyle: "italic",
            fontSize: "clamp(0.85rem, 1.5vw, 1.1rem)",
            color: "#64748b",
            marginTop: "0.5rem",
            maxWidth: 200,
            marginLeft: "auto",
          }}
        >
          Tim hebat di balik Web Data Storytelling
        </p>

        <div style={{ marginTop: "2rem" }}>
          {frontMember ? (
            <>
              <div
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 800,
                  fontSize: "clamp(0.9rem, 1.6vw, 1.1rem)",
                  color: "#0C2726",
                }}
              >
                {frontMember.name}
              </div>
              <div
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: "0.75rem",
                  color: "#1d9e75",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  marginTop: "0.2rem",
                }}
              >
                #{String(frontMember.number).padStart(2, "0")} /{" "}
                {String(total).padStart(2, "0")}
              </div>
            </>
          ) : (
            <div
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 700,
                fontSize: "0.9rem",
                color: "#1d9e75",
                fontStyle: "italic",
              }}
            >
              Semua sudah diperkenalkan!
              <br />
              <span
                style={{
                  fontSize: "0.8rem",
                  color: "#64748b",
                  fontStyle: "normal",
                }}
              >
                Tekan ↑ untuk kembali
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Card stack — render ALL cards always so transitions work */}
      <div
        style={{
          position: "relative",
          width: 260,
          height: 380,
        }}
      >
        {members.map((member, memberIdx) => {
          const phase = phases[memberIdx];
          const slotIdx = order.indexOf(memberIdx); // -1 if spent
          const isInStack = slotIdx !== -1;

          // Rotation is ALWAYS locked to the member — never changes
          const rot = MEMBER_ROTATION[memberIdx];

          const scale = isInStack ? SLOT_SCALE[slotIdx] : SLOT_SCALE[total - 1];

          const z = isInStack ? SLOT_Z[slotIdx] : 1;

          let ty: number;
          let easing = "cubic-bezier(0.4,0,0.2,1)";
          let useTransition = true;
          let transitionDuration = "0.46s";

          if (phase === "falling") {
            ty = 800;
            easing = FALL_EASING;
            transitionDuration = "0.48s";
          } else if (phase === "snap-below") {
            ty = 800;
            useTransition = false;
          } else if (phase === "rising") {
            ty = isInStack ? SLOT_Y[slotIdx] : 0;
            easing = RISE_EASING;
            transitionDuration = "0.52s";
          } else {
            // idle
            if (isInStack) {
              ty = SLOT_Y[slotIdx];
            } else {
              // spent card sits below, out of view
              ty = 800;
              useTransition = false;
            }
          }

          return (
            <div
              key={memberIdx}
              style={{
                position: "absolute",
                inset: 0,
                zIndex: z,
                transform: `rotate(${rot}deg) translateY(${ty}px) scale(${scale})`,
                transition: useTransition
                  ? `transform ${transitionDuration} ${easing}`
                  : "none",
                willChange: "transform",
                // Hide spent cards from pointer events
                pointerEvents: isInStack && slotIdx === 0 ? "auto" : "none",
              }}
            >
              <img
                src={`/images/${member.file}`}
                alt={member.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  display: "block",
                  filter:
                    isInStack && slotIdx === 0
                      ? "drop-shadow(0 20px 40px rgba(0,0,0,0.22)) drop-shadow(0 4px 8px rgba(0,0,0,0.12))"
                      : "drop-shadow(0 4px 12px rgba(0,0,0,0.07))",
                }}
              />
            </div>
          );
        })}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;700;900&family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Lora:ital@1&display=swap');
      `}</style>
    </section>
  );
}

function NavBtn({
  onClick,
  disabled,
  children,
}: {
  onClick: () => void;
  disabled: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: 48,
        height: 48,
        borderRadius: "50%",
        background: disabled ? "rgba(29,158,117,0.2)" : "#1d9e75",
        border: "none",
        cursor: disabled ? "not-allowed" : "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: disabled ? "none" : "0 4px 20px rgba(29,158,117,0.35)",
        transition:
          "transform 0.15s ease, box-shadow 0.15s ease, background 0.2s ease",
        color: disabled ? "rgba(29,158,117,0.4)" : "#fff",
        fontSize: "1.2rem",
      }}
      onMouseEnter={(e) => {
        if (disabled) return;
        (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.1)";
        (e.currentTarget as HTMLButtonElement).style.boxShadow =
          "0 6px 28px rgba(29,158,117,0.5)";
      }}
      onMouseLeave={(e) => {
        if (disabled) return;
        (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
        (e.currentTarget as HTMLButtonElement).style.boxShadow =
          "0 4px 20px rgba(29,158,117,0.35)";
      }}
    >
      {children}
    </button>
  );
}
