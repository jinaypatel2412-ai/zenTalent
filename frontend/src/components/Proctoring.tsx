import { useEffect, useRef, useState, useCallback } from "react";
import { Camera, CameraOff, AlertTriangle, Shield, Monitor } from "lucide-react";
import { toast } from "sonner";

interface ProctorEvent {
  type: "tab_switch" | "face_missing" | "multiple_faces" | "screen_change";
  timestamp: Date;
  detail: string;
}

interface ProctoringProps {
  active: boolean;
  onViolation?: (event: ProctorEvent) => void;
}

export function Proctoring({ active, onViolation }: ProctoringProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [violations, setViolations] = useState<ProctorEvent[]>([]);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);

  const addViolation = useCallback((event: ProctorEvent) => {
    setViolations(prev => [...prev, event]);
    onViolation?.(event);
    toast.warning(`⚠️ Proctoring Alert: ${event.detail}`);
  }, [onViolation]);

  // Start webcam
  useEffect(() => {
    if (!active) return;
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: 320, height: 240, facingMode: "user" }, 
          audio: false 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setCameraOn(true);
        }
      } catch {
        toast.error("Camera access is required for proctored interviews");
        setCameraOn(false);
      }
    };
    startCamera();

    return () => {
      stream?.getTracks().forEach(t => t.stop());
      setCameraOn(false);
    };
  }, [active]);

  // Tab visibility monitoring
  useEffect(() => {
    if (!active) return;

    const handleVisibility = () => {
      if (document.hidden) {
        setTabSwitchCount(prev => prev + 1);
        addViolation({
          type: "tab_switch",
          timestamp: new Date(),
          detail: "Candidate switched away from the interview tab",
        });
      }
    };

    const handleBlur = () => {
      addViolation({
        type: "screen_change",
        timestamp: new Date(),
        detail: "Browser window lost focus",
      });
    };

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("blur", handleBlur);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("blur", handleBlur);
    };
  }, [active, addViolation]);

  if (!active) return null;

  return (
    <div className="space-y-3">
      {/* Webcam feed */}
      <div className="relative rounded-xl overflow-hidden border border-border bg-card">
        <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 border-b border-border">
          <Shield size={14} className="text-primary" />
          <span className="text-xs font-semibold text-foreground">Proctoring Active</span>
          <div className={`ml-auto w-2 h-2 rounded-full ${cameraOn ? "bg-emerald-500 animate-pulse" : "bg-destructive"}`} />
        </div>
        
        <div className="relative aspect-video bg-muted">
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
          {!cameraOn && (
            <div className="absolute inset-0 flex items-center justify-center">
              <CameraOff size={24} className="text-muted-foreground" />
            </div>
          )}
        </div>
      </div>

      {/* Status indicators */}
      <div className="grid grid-cols-2 gap-2">
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium ${cameraOn ? "bg-emerald-500/10 text-emerald-600" : "bg-destructive/10 text-destructive"}`}>
          {cameraOn ? <Camera size={12} /> : <CameraOff size={12} />}
          {cameraOn ? "Camera On" : "Camera Off"}
        </div>
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium ${tabSwitchCount === 0 ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"}`}>
          <Monitor size={12} />
          Tab Switches: {tabSwitchCount}
        </div>
      </div>

      {/* Violations log */}
      {violations.length > 0 && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={14} className="text-amber-500" />
            <span className="text-xs font-semibold text-amber-600">Violations ({violations.length})</span>
          </div>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {violations.map((v, i) => (
              <p key={i} className="text-xs text-muted-foreground">
                {v.timestamp.toLocaleTimeString()} — {v.detail}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}



