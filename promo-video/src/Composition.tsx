import React from "react";
import {Audio} from "@remotion/media";
import {TransitionSeries, linearTiming} from "@remotion/transitions";
import {fade} from "@remotion/transitions/fade";
import {
  AbsoluteFill,
  Composition,
  Easing,
  Img,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const FPS = 30;
const WIDTH = 1920;
const HEIGHT = 1080;
const DURATION = 900;
const FONT = '"Segoe UI", Inter, Arial, sans-serif';
const MONO = '"Cascadia Code", "SFMono-Regular", Consolas, monospace';
const SONORAN_BLUE = "#1e9be9";
const SONORAN_DARK = "#071522";

const clamp = (value: number) => Math.max(0, Math.min(1, value));

const ease = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const fadeOut = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [1, 0], {
    easing: Easing.in(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const SonoranMark: React.FC<{size?: number; glow?: boolean}> = ({
  size = 64,
  glow = false,
}) => (
  <Img
    src={staticFile("images/sonoran-icon.png")}
    style={{
      width: size,
      height: size,
      objectFit: "contain",
      filter: glow ? "drop-shadow(0 0 28px rgba(30,155,233,.5))" : undefined,
    }}
  />
);

const Background: React.FC<{accent?: string; quiet?: boolean}> = ({
  accent = SONORAN_BLUE,
  quiet = false,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const drift = Math.sin(frame / (fps * 3.4));
  const drift2 = Math.cos(frame / (fps * 4.1));
  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        background:
          "radial-gradient(circle at 50% 120%, #102b42 0%, #071522 48%, #040c14 100%)",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: quiet ? 0.12 : 0.22,
          backgroundImage:
            "linear-gradient(rgba(83,176,230,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(83,176,230,.12) 1px, transparent 1px)",
          backgroundSize: "54px 54px",
          transform: `perspective(800px) rotateX(64deg) translateY(${370 + drift * 12}px) scale(1.5)`,
          transformOrigin: "bottom center",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 850,
          height: 850,
          borderRadius: "50%",
          left: -320 + drift * 80,
          top: -430 + drift2 * 60,
          background: `radial-gradient(circle, ${accent}3c 0%, ${accent}10 44%, transparent 71%)`,
          filter: "blur(25px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 720,
          height: 720,
          borderRadius: "50%",
          right: -270 - drift * 70,
          bottom: -390 - drift2 * 45,
          background:
            "radial-gradient(circle, rgba(106,93,255,.25) 0%, rgba(35,120,220,.08) 48%, transparent 72%)",
          filter: "blur(20px)",
        }}
      />
    </AbsoluteFill>
  );
};

const PlatformBadge: React.FC<{
  icon: string;
  label: string;
  background: string;
  color?: string;
}> = ({icon, label, background, color = "white"}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 14,
      borderRadius: 16,
      padding: "10px 16px 10px 10px",
      background,
      color,
      fontFamily: FONT,
      fontWeight: 650,
      fontSize: 24,
      boxShadow: "0 16px 45px rgba(0,0,0,.18)",
    }}
  >
    <Img
      src={staticFile(icon)}
      style={{width: 42, height: 42, borderRadius: 11, objectFit: "contain"}}
    />
    {label}
  </div>
);

const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const enter = ease(frame, 0, 28);
  const lineEnter = ease(frame, 18, 48);
  const exit = fadeOut(frame, 82, 104);
  return (
    <AbsoluteFill style={{fontFamily: FONT, color: "white"}}>
      <Background />
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          opacity: exit,
          transform: `scale(${0.94 + enter * 0.06}) translateY(${(1 - enter) * 26}px)`,
        }}
      >
        <div style={{position: "relative", marginBottom: 34}}>
          <div
            style={{
              position: "absolute",
              inset: -36,
              borderRadius: 60,
              background: "rgba(30,155,233,.19)",
              filter: "blur(30px)",
              transform: `scale(${0.8 + enter * 0.2})`,
            }}
          />
          <SonoranMark size={132} glow />
        </div>
        <div
          style={{
            fontSize: 78,
            lineHeight: 1,
            fontWeight: 750,
            letterSpacing: -3.5,
          }}
        >
          Sonoran Plugins
        </div>
        <div
          style={{
            height: 3,
            width: 430 * lineEnter,
            marginTop: 30,
            borderRadius: 4,
            background: `linear-gradient(90deg, transparent, ${SONORAN_BLUE}, transparent)`,
          }}
        />
        <div
          style={{
            opacity: lineEnter,
            transform: `translateY(${(1 - lineEnter) * 16}px)`,
            fontSize: 31,
            marginTop: 22,
            color: "#b8d2e5",
            letterSpacing: 0.3,
          }}
        >
          Custom game integrations. Right where you build.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const WindowShell: React.FC<{
  title: string;
  theme: "light" | "dark";
  children: React.ReactNode;
  enter: number;
}> = ({title, theme, children, enter}) => {
  const light = theme === "light";
  return (
    <div
      style={{
        width: 1540,
        height: 850,
        overflow: "hidden",
        borderRadius: 28,
        background: light ? "#f7f5f0" : "#0c1119",
        border: light
          ? "1px solid rgba(255,255,255,.65)"
          : "1px solid rgba(136,175,213,.2)",
        boxShadow: "0 45px 130px rgba(0,0,0,.5), 0 2px 0 rgba(255,255,255,.08) inset",
        transform: `translateY(${(1 - enter) * 60}px) scale(${0.94 + enter * 0.06})`,
        opacity: enter,
      }}
    >
      <div
        style={{
          height: 58,
          display: "flex",
          alignItems: "center",
          padding: "0 22px",
          color: light ? "#595650" : "#aab8c6",
          background: light ? "#ece9e2" : "#111923",
          borderBottom: light ? "1px solid #ddd8ce" : "1px solid #1d2a38",
          fontFamily: FONT,
        }}
      >
        <div style={{display: "flex", gap: 9, marginRight: 24}}>
          {["#ff6259", "#ffbd2e", "#28ca42"].map((color) => (
            <span key={color} style={{width: 13, height: 13, borderRadius: "50%", background: color}} />
          ))}
        </div>
        <div style={{fontSize: 18, fontWeight: 650}}>{title}</div>
      </div>
      <div style={{height: 792}}>{children}</div>
    </div>
  );
};

const TypedPrompt: React.FC<{
  text: string;
  frame: number;
  start: number;
  speed?: number;
  dark?: boolean;
}> = ({text, frame, start, speed = 1.25, dark = false}) => {
  const count = Math.floor(Math.max(0, frame - start) * speed);
  const visible = text.slice(0, count);
  const tag = "@Sonoran Software";
  const tagStart = text.indexOf(tag);
  const before = tagStart >= 0 ? visible.slice(0, Math.min(visible.length, tagStart)) : visible;
  const visibleTag =
    tagStart >= 0 && visible.length > tagStart
      ? visible.slice(tagStart, Math.min(visible.length, tagStart + tag.length))
      : "";
  const after =
    tagStart >= 0 && visible.length > tagStart + tag.length
      ? visible.slice(tagStart + tag.length)
      : "";
  const cursor = frame >= start && Math.floor(frame / 12) % 2 === 0;
  return (
    <div
      style={{
        fontFamily: FONT,
        fontSize: 27,
        lineHeight: 1.48,
        color: dark ? "#e8edf2" : "#302f2b",
        minHeight: 84,
      }}
    >
      {before}
      {visibleTag ? (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            borderRadius: 9,
            padding: "0 7px 2px",
            margin: "0 3px",
            color: dark ? "#a8ddff" : "#0f6da8",
            background: dark ? "rgba(30,155,233,.18)" : "rgba(30,155,233,.12)",
            fontWeight: 700,
          }}
        >
          {visibleTag}
        </span>
      ) : null}
      {after}
      <span
        style={{
          display: "inline-block",
          width: 2,
          height: 29,
          marginLeft: 3,
          verticalAlign: -5,
          background: cursor ? SONORAN_BLUE : "transparent",
        }}
      />
    </div>
  );
};

const ClaudeScene: React.FC = () => {
  const frame = useCurrentFrame();
  const enter = ease(frame, 0, 32);
  const response = ease(frame, 132, 164);
  const progress = clamp((frame - 168) / 42);
  const done = ease(frame, 205, 225);
  const prompt = "Use @Sonoran Software and install the FiveM CAD resource on my server.";
  return (
    <AbsoluteFill style={{fontFamily: FONT}}>
      <Background accent="#d97757" quiet />
      <AbsoluteFill style={{alignItems: "center", justifyContent: "center"}}>
        <div style={{position: "absolute", top: 56, left: 96, zIndex: 4}}>
          <PlatformBadge
            icon="images/claude-icon.png"
            label="Claude"
            background="#d97757"
          />
        </div>
        <WindowShell title="Claude" theme="light" enter={enter}>
          <div style={{display: "flex", height: "100%", color: "#33312d"}}>
            <div
              style={{
                width: 260,
                padding: "30px 22px",
                background: "#eeeae2",
                borderRight: "1px solid #ded9cf",
              }}
            >
              <div style={{display: "flex", alignItems: "center", gap: 12, marginBottom: 34}}>
                <Img src={staticFile("images/claude-icon.png")} style={{width: 42, height: 42, borderRadius: 12}} />
                <div style={{fontSize: 23, fontWeight: 700}}>Claude</div>
              </div>
              {["New chat", "Chats", "Projects", "Artifacts"].map((item, index) => (
                <div
                  key={item}
                  style={{
                    height: 48,
                    display: "flex",
                    alignItems: "center",
                    padding: "0 14px",
                    borderRadius: 11,
                    fontSize: 18,
                    marginBottom: 6,
                    color: index === 0 ? "#1f1e1b" : "#6d6962",
                    background: index === 0 ? "rgba(255,255,255,.7)" : "transparent",
                    fontWeight: index === 0 ? 650 : 500,
                  }}
                >
                  <span style={{width: 25, color: "#9b958b"}}>{["＋", "◷", "▣", "◇"][index]}</span>
                  {item}
                </div>
              ))}
            </div>
            <div style={{flex: 1, position: "relative", padding: "34px 70px 42px"}}>
              <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                <div style={{fontSize: 19, color: "#777168", fontWeight: 600}}>New conversation</div>
                <div style={{fontSize: 16, color: "#8d877e", background: "#eeeae3", borderRadius: 9, padding: "8px 12px"}}>
                  Claude Sonnet
                </div>
              </div>

              <div
                style={{
                  marginTop: 42,
                  marginLeft: "auto",
                  width: 830,
                  padding: "24px 27px",
                  borderRadius: "22px 22px 7px 22px",
                  background: "#e7e2d8",
                  boxShadow: "0 8px 24px rgba(70,60,40,.07)",
                }}
              >
                <TypedPrompt text={prompt} frame={frame} start={25} />
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 17,
                  width: 930,
                  marginTop: 28,
                  opacity: response,
                  transform: `translateY(${(1 - response) * 18}px)`,
                }}
              >
                <div style={{paddingTop: 3}}><SonoranMark size={45} /></div>
                <div style={{flex: 1}}>
                  <div style={{fontSize: 19, color: "#7f796f", fontWeight: 700, marginBottom: 10}}>Sonoran Software</div>
                  <div style={{fontSize: 22, lineHeight: 1.45, color: "#38352f"}}>
                    I found the official CAD resource. I’ll configure it for this server and keep your API key private.
                  </div>
                  <div
                    style={{
                      marginTop: 21,
                      borderRadius: 16,
                      padding: "18px 20px",
                      background: "rgba(255,255,255,.72)",
                      border: "1px solid #ded8cd",
                    }}
                  >
                    <div style={{display: "flex", justifyContent: "space-between", fontSize: 17, color: "#6f6a61"}}>
                      <span>Installing Sonoran CAD</span>
                      <span style={{fontFamily: MONO}}>{done > 0.5 ? "Complete" : `${Math.round(progress * 100)}%`}</span>
                    </div>
                    <div style={{height: 8, borderRadius: 10, background: "#ddd8cf", marginTop: 13, overflow: "hidden"}}>
                      <div
                        style={{
                          height: "100%",
                          width: `${Math.max(5, progress * 100)}%`,
                          borderRadius: 10,
                          background: done > 0.4 ? "#35a66f" : SONORAN_BLUE,
                        }}
                      />
                    </div>
                    <div style={{fontFamily: MONO, fontSize: 15, color: "#716c64", marginTop: 15}}>
                      API key&nbsp;&nbsp; ••••••••••••••••
                    </div>
                  </div>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 9,
                      marginTop: 14,
                      fontSize: 18,
                      color: "#25835a",
                      fontWeight: 700,
                      opacity: done,
                    }}
                  >
                    <span style={{fontSize: 23}}>✓</span> Resource installed and configured
                  </div>
                </div>
              </div>
            </div>
          </div>
        </WindowShell>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const CodeLine: React.FC<{children: React.ReactNode; color?: string}> = ({children, color = "#93a4b4"}) => (
  <div style={{color, lineHeight: 1.65, whiteSpace: "pre"}}>{children}</div>
);

const CodexScene: React.FC = () => {
  const frame = useCurrentFrame();
  const enter = ease(frame, 0, 34);
  const thinking = ease(frame, 130, 152);
  const code = ease(frame, 165, 205);
  const done = ease(frame, 218, 242);
  const prompt = "Use @Sonoran Software to create an emergency CAD call whenever someone robs the gas station.";
  return (
    <AbsoluteFill style={{fontFamily: FONT, color: "#e9eff5"}}>
      <Background accent="#675cff" quiet />
      <AbsoluteFill style={{alignItems: "center", justifyContent: "center"}}>
        <div style={{position: "absolute", top: 56, left: 96, zIndex: 4}}>
          <PlatformBadge
            icon="images/codex-icon.png"
            label="ChatGPT · Codex"
            background="#24283f"
          />
        </div>
        <WindowShell title="ChatGPT · Codex" theme="dark" enter={enter}>
          <div style={{display: "flex", height: "100%"}}>
            <div
              style={{
                width: 300,
                padding: "28px 22px",
                background: "#101823",
                borderRight: "1px solid #1e2b3a",
              }}
            >
              <div style={{display: "flex", alignItems: "center", gap: 12, marginBottom: 28}}>
                <Img src={staticFile("images/codex-icon.png")} style={{width: 44, height: 44, borderRadius: 12}} />
                <div>
                  <div style={{fontSize: 22, fontWeight: 750}}>Codex</div>
                  <div style={{fontSize: 13, color: "#72869a", marginTop: 2}}>in ChatGPT</div>
                </div>
              </div>
              <div style={{height: 45, borderRadius: 10, background: "#1a2634", display: "flex", alignItems: "center", padding: "0 13px", fontSize: 17, fontWeight: 650}}>
                ＋ New task
              </div>
              <div style={{fontSize: 13, color: "#607486", fontWeight: 700, margin: "28px 10px 10px", textTransform: "uppercase", letterSpacing: 1.2}}>Recent</div>
              {["Store robbery integration", "CAD resource setup", "Radio signal logic"].map((item, index) => (
                <div
                  key={item}
                  style={{
                    padding: "11px 12px",
                    borderRadius: 9,
                    color: index === 0 ? "#d7e2ec" : "#7f92a3",
                    background: index === 0 ? "rgba(56,93,124,.23)" : "transparent",
                    fontSize: 16,
                    marginBottom: 4,
                  }}
                >
                  {item}
                </div>
              ))}
            </div>

            <div style={{flex: 1, display: "flex", flexDirection: "column", position: "relative"}}>
              <div style={{height: 66, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 30px", borderBottom: "1px solid #1c2a38"}}>
                <div>
                  <div style={{fontSize: 18, fontWeight: 700}}>Store robbery integration</div>
                  <div style={{fontSize: 13, color: "#71879a", marginTop: 3}}>SonoranCADFiveM</div>
                </div>
                <div style={{fontSize: 14, color: "#9bb0c2", background: "#162230", border: "1px solid #26384a", borderRadius: 9, padding: "7px 11px"}}>Local workspace</div>
              </div>

              <div style={{flex: 1, padding: "34px 46px 26px"}}>
                <div
                  style={{
                    background: "#121c28",
                    border: "1px solid #223448",
                    borderRadius: 18,
                    padding: "22px 25px",
                    boxShadow: "0 20px 50px rgba(0,0,0,.22)",
                  }}
                >
                  <TypedPrompt text={prompt} frame={frame} start={23} speed={1.35} dark />
                  <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12}}>
                    <div style={{display: "flex", alignItems: "center", gap: 9, color: "#8ea2b4", fontSize: 15}}>
                      <SonoranMark size={25} /> @Sonoran Software
                    </div>
                    <div style={{width: 37, height: 37, borderRadius: 10, background: SONORAN_BLUE, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20}}>↑</div>
                  </div>
                </div>

                <div
                  style={{
                    opacity: thinking,
                    transform: `translateY(${(1 - thinking) * 14}px)`,
                    display: "flex",
                    gap: 14,
                    marginTop: 25,
                  }}
                >
                  <SonoranMark size={42} />
                  <div style={{flex: 1}}>
                    <div style={{fontSize: 17, fontWeight: 700, color: "#c9d5df", marginBottom: 11}}>Sonoran Software</div>
                    <div style={{fontSize: 19, color: "#9fb0bf"}}>Using the CAD API docs and the official FiveM integration source…</div>
                    <div
                      style={{
                        opacity: code,
                        transform: `translateY(${(1 - code) * 14}px)`,
                        marginTop: 18,
                        padding: "18px 22px",
                        borderRadius: 15,
                        background: "#080e15",
                        border: "1px solid #1c2b39",
                        fontFamily: MONO,
                        fontSize: 15,
                      }}
                    >
                      <CodeLine color="#64798b">// gas-station/server.lua</CodeLine>
                      <CodeLine><span style={{color: "#8ecbff"}}>RegisterNetEvent</span>(<span style={{color: "#d8c88f"}}>&quot;store:robbery&quot;</span>, <span style={{color: "#8ecbff"}}>function</span>(location)</CodeLine>
                      <CodeLine>  SonoranCAD.createEmergencyCall({'{'}</CodeLine>
                      <CodeLine color="#9dd6ae">+   caller = &quot;Store Alarm&quot;,</CodeLine>
                      <CodeLine color="#9dd6ae">+   location = location,</CodeLine>
                      <CodeLine color="#9dd6ae">+   description = &quot;Robbery in progress&quot;</CodeLine>
                      <CodeLine>  {'}'})</CodeLine>
                      <CodeLine><span style={{color: "#8ecbff"}}>end</span>)</CodeLine>
                    </div>
                    <div
                      style={{
                        opacity: done,
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        marginTop: 14,
                        fontSize: 18,
                        color: "#54d695",
                        fontWeight: 700,
                      }}
                    >
                      <span style={{fontSize: 24}}>✓</span> Integration created and validated
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </WindowShell>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const PromptCard: React.FC<{
  text: string;
  icon: string;
  progress: number;
  typeStart: number;
  typeEnd: number;
}> = ({text, icon, progress, typeStart, typeEnd}) => {
  const frame = useCurrentFrame();
  const typedText = text.slice(0, Math.floor(interpolate(frame, [typeStart, typeEnd], [0, text.length], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })));
  const isTyping = frame >= typeStart && frame < typeEnd;

  return (
    <div
      style={{
        width: 500,
        minHeight: 292,
        borderRadius: 25,
        padding: 28,
        background: "rgba(11,29,43,.9)",
        border: "1px solid rgba(103,178,226,.24)",
        boxShadow: "0 32px 80px rgba(0,0,0,.35)",
        transform: `translateY(${(1 - progress) * 35}px)`,
        opacity: progress,
      }}
    >
      <div style={{height: 58, display: "flex", alignItems: "center", justifyContent: "center"}}>
        <Img src={staticFile(icon)} style={{maxWidth: 220, maxHeight: 48, objectFit: "contain"}} />
      </div>
      <div style={{height: 1, background: "rgba(117,180,220,.17)", margin: "21px 0"}} />
      <div style={{fontSize: 21, lineHeight: 1.48, color: "#aec7d8"}}>
        {typedText.split(/(@SonoranSoftware|@Sonoran Software)/g).map((part, index) => (
          <React.Fragment key={`${part}-${index}`}>
            {part === "@SonoranSoftware" || part === "@Sonoran Software"
              ? <span style={{color: "#67c4ff", fontWeight: 750}}>{part}</span>
              : part}
          </React.Fragment>
        ))}
        {isTyping ? <span style={{color: "#67c4ff", opacity: frame % 16 < 8 ? 1 : 0}}>▍</span> : null}
      </div>
    </div>
  );
};

const MontageScene: React.FC = () => {
  const frame = useCurrentFrame();
  const title = ease(frame, 0, 26);
  const cards = [ease(frame, 16, 46), ease(frame, 32, 62), ease(frame, 48, 78)];
  return (
    <AbsoluteFill style={{fontFamily: FONT, color: "white"}}>
      <Background />
      <div style={{position: "absolute", top: 95, left: 0, right: 0, textAlign: "center", opacity: title, transform: `translateY(${(1 - title) * 18}px)`}}>
        <div style={{fontSize: 50, fontWeight: 760, letterSpacing: -1.8}}>One prompt for custom integrations</div>
        <div style={{fontSize: 23, color: "#91adc0", marginTop: 11}}>Ask your AI agent to integrate with our open APIs</div>
      </div>
      <div style={{position: "absolute", left: 0, right: 0, top: 290, display: "flex", justifyContent: "center", gap: 28}}>
        <PromptCard
          icon="images/cad-logo.png"
          progress={cards[0]}
          typeStart={34}
          typeEnd={94}
          text="Use @Sonoran Software to create a CAD call when a player triggers an alarm."
        />
        <PromptCard
          icon="images/radio-logo.png"
          progress={cards[1]}
          typeStart={48}
          typeEnd={112}
          text="Use @Sonoran Software to lower radio signal strength while a player is underwater."
        />
        <PromptCard
          icon="images/cms-logo.png"
          progress={cards[2]}
          typeStart={62}
          typeEnd={138}
          text="Create a Discord bot with @SonoranSoftware that tells unregistered members to join the CMS."
        />
      </div>
    </AbsoluteFill>
  );
};

const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const enter = ease(frame, 0, 32);
  const logos = ease(frame, 22, 55);
  const url = ease(frame, 52, 82);
  return (
    <AbsoluteFill style={{fontFamily: FONT, color: "white"}}>
      <Background />
      <AbsoluteFill style={{alignItems: "center", justifyContent: "center", transform: `scale(${0.96 + enter * 0.04})`, opacity: enter}}>
        <SonoranMark size={112} glow />
        <div style={{fontSize: 62, fontWeight: 760, marginTop: 27, letterSpacing: -2.3}}>Build it with Sonoran.</div>
        <div style={{fontSize: 26, color: "#9cb8ca", marginTop: 14}}>Plugins for Claude, ChatGPT, and Codex.</div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            marginTop: 35,
            opacity: logos,
            transform: `translateY(${(1 - logos) * 18}px)`,
          }}
        >
          <PlatformBadge icon="images/claude-icon.png" label="Claude" background="#d97757" />
          <div style={{fontSize: 26, color: "#4b6980"}}>+</div>
          <PlatformBadge icon="images/codex-icon.png" label="ChatGPT · Codex" background="#24283f" />
        </div>
        <div
          style={{
            marginTop: 38,
            padding: "13px 24px 15px",
            borderRadius: 15,
            background: "rgba(30,155,233,.12)",
            border: "1px solid rgba(82,185,247,.28)",
            color: "#7ed0ff",
            fontSize: 25,
            fontWeight: 700,
            letterSpacing: 0.2,
            opacity: url,
            transform: `translateY(${(1 - url) * 14}px)`,
          }}
        >
          sonoransoftware.com/developers
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const SonoranAgentsPromo: React.FC = () => {
  const {fps, durationInFrames} = useVideoConfig();
  return (
    <AbsoluteFill style={{background: SONORAN_DARK}}>
      <Audio
        src={staticFile("audio/upbeat-bed.wav")}
        volume={(f) =>
          interpolate(f, [0, fps * 1.2, durationInFrames - fps * 1.7, durationInFrames], [0, 0.44, 0.44, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
        }
      />
      <Audio src={staticFile("audio/typing-synced.wav")} volume={0.2} />
      <Sequence from={88} premountFor={fps}><Audio src={staticFile("audio/whoosh.wav")} volume={0.2} /></Sequence>
      <Sequence from={309} premountFor={fps}><Audio src={staticFile("audio/ding.wav")} volume={0.12} /></Sequence>
      <Sequence from={344} premountFor={fps}><Audio src={staticFile("audio/whoosh.wav")} volume={0.2} /></Sequence>
      <Sequence from={560} premountFor={fps}><Audio src={staticFile("audio/ding.wav")} volume={0.12} /></Sequence>
      <Sequence from={620} premountFor={fps}><Audio src={staticFile("audio/whoosh.wav")} volume={0.17} /></Sequence>
      <Sequence from={779} premountFor={fps}><Audio src={staticFile("audio/whoosh.wav")} volume={0.19} /></Sequence>

      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={105} premountFor={fps}>
          <IntroScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: 15})} />
        <TransitionSeries.Sequence durationInFrames={260} premountFor={fps}>
          <ClaudeScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: 15})} />
        <TransitionSeries.Sequence durationInFrames={270} premountFor={fps}>
          <CodexScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: 15})} />
        <TransitionSeries.Sequence durationInFrames={180} premountFor={fps}>
          <MontageScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: 15})} />
        <TransitionSeries.Sequence durationInFrames={145} premountFor={fps}>
          <OutroScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};

export const PromoComposition: React.FC = () => (
  <Composition
    id="SonoranAgentsPromo"
    component={SonoranAgentsPromo}
    durationInFrames={DURATION}
    fps={FPS}
    width={WIDTH}
    height={HEIGHT}
  />
);
