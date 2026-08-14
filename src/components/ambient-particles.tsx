export function AmbientParticles() {
  const particles = [
    { top: "15%", left: "10%", size: "w-2.5 h-2.5", delay: "0s", duration: "7s" },
    { top: "35%", left: "25%", size: "w-3 h-3", delay: "1.5s", duration: "9s" },
    { top: "65%", left: "15%", size: "w-2 h-2", delay: "3s", duration: "8s" },
    { top: "20%", left: "80%", size: "w-3.5 h-3.5", delay: "0.8s", duration: "10s" },
    { top: "50%", left: "85%", size: "w-2 h-2", delay: "2.2s", duration: "7.5s" },
    { top: "75%", left: "70%", size: "w-2.5 h-2.5", delay: "4s", duration: "8.5s" },
    { top: "85%", left: "40%", size: "w-3 h-3", delay: "1s", duration: "9.5s" },
  ];

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-10">
      {particles.map((p, idx) => (
        <div
          key={idx}
          className={`absolute rounded-full bg-gradient-to-r from-amber-300 to-amber-500 shadow-[0_0_12px_rgba(234,179,8,0.8)] animate-particle`}
          style={{
            top: p.top,
            left: p.left,
            width: p.size.split(" ")[0].replace("w-", "") + "rem",
            height: p.size.split(" ")[1].replace("h-", "") + "rem",
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}
    </div>
  );
}
