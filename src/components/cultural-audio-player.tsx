import { useState, useEffect, useRef } from "react";
import { Play, Pause, Volume2, VolumeX, Headphones, Radio, Sparkles, Music } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type AudioTrack = {
  id: string;
  title: string;
  narrator: string;
  duration: string;
  ambientType: "wind" | "waves" | "rain" | "bells";
  summary: string;
};

const AUDIO_TRACKS: Record<string, AudioTrack[]> = {
  sigiriya: [
    {
      id: "sig-1",
      title: "The Legend of King Kashyapa's Sky Palace",
      narrator: "Dr. Ananda Silva · Ceylon Historical Society",
      duration: "3:45",
      ambientType: "wind",
      summary: "Discover how 5th-century architects engineered water gardens and mirror walls on a 200m sheer monolith.",
    },
    {
      id: "sig-2",
      title: "Secrets of the Gilded Frescoes",
      narrator: "Surani Fernando · Heritage Curator",
      duration: "2:50",
      ambientType: "bells",
      summary: "Step inside the sheltered rock pocket depicting royal maidens with natural earth pigments.",
    },
  ],
  ella: [
    {
      id: "ella-1",
      title: "Engineering the Nine Arch Demodara Viaduct",
      narrator: "Kishan Wickramasinghe · Railway Historian",
      duration: "4:10",
      ambientType: "wind",
      summary: "How Ceylonese master builder P.K. Appuhami constructed the bridge without a single piece of steel during WWI.",
    },
    {
      id: "ella-2",
      title: "Whispering Pines of Little Adam's Peak",
      narrator: "Nimali Perera · Ceylon Naturalist",
      duration: "3:15",
      ambientType: "rain",
      summary: "Listen to the fauna and tea garden echoes along the mountain ridge at sunrise.",
    },
  ],
  galle: [
    {
      id: "galle-1",
      title: "Ramparts of the Dutch East India Company",
      narrator: "Captain Hugo van Rijn · Maritime Historian",
      duration: "3:30",
      ambientType: "waves",
      summary: "Walk the 400-year-old bastions where Indian Ocean trading ships anchored between Europe and Spice Islands.",
    },
  ],
  mirissa: [
    {
      id: "mirissa-1",
      title: "Song of the Blue Giants in Southern Waters",
      narrator: "Dr. Asha de Vos · Marine Biologist",
      duration: "4:00",
      ambientType: "waves",
      summary: "Understand the non-migratory resident blue whale population cruising the Dondra trench.",
    },
  ],
};

export function CulturalAudioPlayer({
  destinationSlug,
  destinationName,
}: {
  destinationSlug: string;
  destinationName: string;
}) {
  const tracks = AUDIO_TRACKS[destinationSlug] || [
    {
      id: "gen-1",
      title: `The Heritage & Legends of ${destinationName}`,
      narrator: "Ceylon Heritage Society Archives",
      duration: "3:20",
      ambientType: "wind",
      summary: `An immersive historical audio walkthrough exploring the sacred roots and natural wonders of ${destinationName}.`,
    },
  ];

  const [activeTrackIndex, setActiveTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [ambientSound, setAmbientSound] = useState(true);

  const activeTrack = tracks[activeTrackIndex];

  // Web Audio API Synthesizer for Ceylon Nature Ambience (Wind/Waves/Rain)
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1.2;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const togglePlay = () => {
    if (!audioCtxRef.current) {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      } catch (e) {
        console.warn("AudioContext init warning:", e);
      }
    }
    setIsPlaying((prev) => !prev);
  };

  return (
    <Card className="rounded-3xl border border-primary/30 bg-card/80 p-6 space-y-4 shadow-lg relative overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="rounded-full border-amber-500/40 text-amber-500 bg-amber-500/10 px-3 py-1 text-xs">
            <Headphones className="w-3.5 h-3.5 mr-1.5 animate-pulse" /> Cultural Audio Guide
          </Badge>
          <span className="text-xs text-muted-foreground font-mono">{activeTrack.duration}</span>
        </div>
        <button
          onClick={() => setAmbientSound((v) => !v)}
          className={`flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full border transition-colors ${
            ambientSound ? "border-emerald-500/40 text-emerald-500 bg-emerald-500/10" : "border-border text-muted-foreground"
          }`}
        >
          <Radio className="w-3 h-3" /> {ambientSound ? "Ceylon Ambience ON" : "Ambience Muted"}
        </button>
      </div>

      <div>
        <h3 className="font-display text-xl font-semibold text-foreground">{activeTrack.title}</h3>
        <p className="text-xs text-primary font-medium mt-1">{activeTrack.narrator}</p>
        <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{activeTrack.summary}</p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1 pt-1">
        <div className="h-1.5 w-full rounded-full bg-muted/60 overflow-hidden cursor-pointer">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-amber-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
          <span>0:{String(Math.floor((progress * 2.2) % 60)).padStart(2, "0")}</span>
          <span>{activeTrack.duration}</span>
        </div>
      </div>

      {/* Player Controls */}
      <div className="flex items-center justify-between pt-2 border-t border-border/40">
        <div className="flex items-center gap-2">
          <Button
            onClick={togglePlay}
            size="icon"
            className="w-12 h-12 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 shadow-md"
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-slate-950" /> : <Play className="w-5 h-5 fill-slate-950 ml-0.5" />}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMuted((v) => !v)}
            className="w-9 h-9 rounded-full text-muted-foreground hover:text-foreground"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </Button>
        </div>

        {tracks.length > 1 && (
          <div className="flex gap-1">
            {tracks.map((t, idx) => (
              <button
                key={t.id}
                onClick={() => {
                  setActiveTrackIndex(idx);
                  setProgress(0);
                  setIsPlaying(true);
                }}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  activeTrackIndex === idx ? "bg-primary text-primary-foreground" : "bg-muted/50 text-muted-foreground hover:bg-muted"
                }`}
              >
                Part {idx + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
