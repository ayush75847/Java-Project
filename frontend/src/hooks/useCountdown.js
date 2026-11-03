import { useEffect, useState } from "react";

// Counts down once per second: const [secondsLeft, start] = useCountdown(60)
// Used for "Resend code (42s)", and reusable for any cooldown later.
export function useCountdown(startSeconds = 0) {
  const [secondsLeft, setSecondsLeft] = useState(startSeconds);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  return [secondsLeft, setSecondsLeft];
}
