import React, { useState, useMemo } from "react";
import {
  Search, Plus, X, Check, Clock, MapPin, ChevronDown,
  ArrowLeft, RotateCcw, User, AlertCircle, Wrench
} from "lucide-react";

/* ---------------------------------------------------------
   THEME — pegboard workshop: warm charcoal + amber tool-tape
--------------------------------------------------------- */
const C = {
  bg: "#1C1A17",
  bg2: "#221F1A",
  surface: "#26221D",
  surfaceHi: "#2E2921",
  line: "#3A342B",
  amber: "#E8A33D",
  amberDim: "#8A6A34",
  teal: "#4C8577",
  tealDim: "#345850",
  rust: "#C1553D",
  text: "#F2EDE4",
  textMuted: "#A69C8D",
  textFaint: "#75695A",
};

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
.mend-display { font-family: 'Space Grotesk', sans-serif; }
.mend-body { font-family: 'Inter', sans-serif; }
.mend-mono { font-family: 'IBM Plex Mono', monospace; letter-spacing: 0.03em; }
.mend-pegboard {
  background-image: radial-gradient(${C.line} 1px, transparent 1px);
  background-size: 22px 22px;
  background-position: -8px -8px;
}
.mend-scroll::-webkit-scrollbar { width: 8px; height: 8px; }
.mend-scroll::-webkit-scrollbar-thumb { background: ${C.line}; border-radius: 4px; }
.mend-scroll::-webkit-scrollbar-track { background: transparent; }
.mend-tag-hole {
  width: 10px; height: 10px; border-radius: 50%;
  background: ${C.bg};
  border: 1.5px solid ${C.textFaint};
}
.mend-input::placeholder { color: #8a8a8a; }
@keyframes mendFade { from { opacity:0; transform: translateY(4px);} to {opacity:1; transform:translateY(0);} }
.mend-anim { animation: mendFade 0.18s ease-out; }
`;

/* Forced style for every text input / select / textarea so the typed
   text is always black, regardless of OS light/dark mode. Setting
   colorScheme: "light" stops the browser's native dark-mode form
   styling from overriding the text color. */
const FIELD_STYLE = {
  background: "#FFFFFF",
  border: `1px solid ${C.line}`,
  color: "#111111",
  colorScheme: "light",
};

const CATEGORIES = [
  "Power Tools",
  "Hand Tools",
  "Garden",
  "Ladders & Access",
  "Automotive",
  "Kitchen & Craft",
];

const EMOJI_CHOICES = ["🛠️", "🪚", "🪛", "🔩", "🪜", "🧰", "🌱", "🍳", "🚗", "🔧", "🧵", "⚡"];

const CONDITIONS = ["Excellent", "Good", "Fair"];

/* ---------------------------------------------------------
   SEED DATA
--------------------------------------------------------- */
const seedUsers = [
  { id: "u1", name: "Priya Chen", neighborhood: "Elmhurst" },
  { id: "u2", name: "Marcus Webb", neighborhood: "Elmhurst" },
  { id: "u3", name: "Sofia Reyes", neighborhood: "Riverside" },
];

const todayPlus = (d) => {
  const t = new Date();
  t.setDate(t.getDate() + d);
  return t.toISOString().slice(0, 10);
};
const todayMinus = (d) => {
  const t = new Date();
  t.setDate(t.getDate() - d);
  return t.toISOString().slice(0, 10);
};

const seedTools = [
  { id: "t1", ownerId: "u1", title: "18V Cordless Drill", category: "Power Tools", condition: "Good", emoji: "🪛", status: "available", description: "Includes two batteries and a charger. Comes with a basic bit set — bring your own for masonry work." },
  { id: "t2", ownerId: "u1", title: "Extension Ladder (24ft)", category: "Ladders & Access", condition: "Fair", emoji: "🪜", status: "borrowed", description: "Aluminum, a little scuffed at the feet but structurally solid. Two-person carry recommended." },
  { id: "t3", ownerId: "u2", title: "Circular Saw", category: "Power Tools", condition: "Good", emoji: "🪚", status: "available", description: "7-1/4 inch blade, corded. New blade installed last month." },
  { id: "t4", ownerId: "u2", title: "Socket Wrench Set", category: "Automotive", condition: "Excellent", emoji: "🔧", status: "available", description: "Metric and standard, 40 pieces in a hard case. Barely used." },
  { id: "t5", ownerId: "u2", title: "Tile Cutter", category: "Hand Tools", condition: "Good", emoji: "🧰", status: "borrowed", description: "Manual snap cutter, handles up to 18 inch tiles." },
  { id: "t6", ownerId: "u3", title: "Pressure Washer", category: "Garden", condition: "Excellent", emoji: "🌱", status: "available", description: "Electric, 2000 PSI. Great for driveways and siding. Hose is 25ft." },
  { id: "t7", ownerId: "u3", title: "Stand Mixer", category: "Kitchen & Craft", condition: "Good", emoji: "🍳", status: "available", description: "5-quart, comes with dough hook, whisk, and paddle attachments." },
  { id: "t8", ownerId: "u3", title: "Hedge Trimmer", category: "Garden", condition: "Fair", emoji: "🌱", status: "available", description: "Corded electric, 20 inch blade. A bit loud but does the job." },
  { id: "t9", ownerId: "u1", title: "Angle Grinder", category: "Power Tools", condition: "Good", emoji: "⚡", status: "available", description: "4.5 inch, corded. Comes with two cutting discs and one grinding disc." },
  { id: "t10", ownerId: "u1", title: "Step Stool Ladder (3ft)", category: "Ladders & Access", condition: "Excellent", emoji: "🪜", status: "available", description: "Lightweight fiberglass, folds flat for easy transport. Good for indoor jobs." },
  { id: "t11", ownerId: "u2", title: "Car Jack & Stand Set", category: "Automotive", condition: "Good", emoji: "🚗", status: "available", description: "2-ton hydraulic jack plus a pair of jack stands. Rated for most sedans and small SUVs." },
  { id: "t12", ownerId: "u2", title: "Wood Chisel Set", category: "Hand Tools", condition: "Excellent", emoji: "🪚", status: "available", description: "Six-piece set, freshly sharpened. Comes in a canvas roll." },
  { id: "t13", ownerId: "u3", title: "Wheelbarrow", category: "Garden", condition: "Fair", emoji: "🌱", status: "borrowed", description: "Steel tray, one flat-free tire so you never have to worry about a flat mid-job." },
  { id: "t14", ownerId: "u3", title: "Food Dehydrator", category: "Kitchen & Craft", condition: "Good", emoji: "🍳", status: "available", description: "6-tray, great for jerky, dried fruit, or herbs. Comes with mesh liners." },
  { id: "t15", ownerId: "u1", title: "Impact Driver", category: "Power Tools", condition: "Excellent", emoji: "🔩", status: "available", description: "18V, brushless motor. Comes with a bit set and a spare battery." },
  { id: "t16", ownerId: "u2", title: "Sewing Machine", category: "Kitchen & Craft", condition: "Good", emoji: "🧵", status: "available", description: "Basic mechanical machine, good for hemming and simple projects. Manual included." },
];

const seedRequests = [
  { id: "r1", toolId: "t2", requesterId: "u3", status: "approved", requestedDate: todayMinus(3), dueDate: todayPlus(4) },
  { id: "r2", toolId: "t5", requesterId: "u1", status: "approved", requestedDate: todayMinus(2), dueDate: todayPlus(5) },
  { id: "r3", toolId: "t1", requesterId: "u2", status: "pending", requestedDate: todayMinus(1), dueDate: null },
  { id: "r4", toolId: "t6", requesterId: "u1", status: "declined", requestedDate: todayMinus(10), dueDate: null },
  { id: "r5", toolId: "t3", requesterId: "u3", status: "returned", requestedDate: todayMinus(20), dueDate: todayMinus(13) },
  { id: "r6", toolId: "t13", requesterId: "u1", status: "approved", requestedDate: todayMinus(1), dueDate: todayPlus(6) },
  { id: "r7", toolId: "t9", requesterId: "u3", status: "pending", requestedDate: todayMinus(0), dueDate: null },
  { id: "r8", toolId: "t11", requesterId: "u3", status: "returned", requestedDate: todayMinus(15), dueDate: todayMinus(8) },
];

/* ---------------------------------------------------------
   SMALL UI PARTS
--------------------------------------------------------- */
function StatusBadge({ status }) {
  const map = {
    available: { label: "ON SHELF", color: C.amber, bg: "rgba(232,163,61,0.12)" },
    borrowed: { label: "CHECKED OUT", color: C.teal, bg: "rgba(76,133,119,0.15)" },
    pending: { label: "PENDING", color: C.textMuted, bg: "rgba(166,156,141,0.12)" },
    approved: { label: "APPROVED", color: C.teal, bg: "rgba(76,133,119,0.15)" },
    declined: { label: "DECLINED", color: C.rust, bg: "rgba(193,85,61,0.12)" },
    returned: { label: "RETURNED", color: C.textFaint, bg: "rgba(117,105,90,0.12)" },
  };
  const s = map[status] || map.available;
  return (
    <span
      className="mend-mono text-[10px] px-2 py-1 inline-flex items-center rounded-sm"
      style={{ color: s.color, background: s.bg, border: `1px solid ${s.color}33` }}
    >
      {s.label}
    </span>
  );
}

function CategoryPill({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className="mend-mono text-xs px-3 py-1.5 rounded-sm whitespace-nowrap transition-colors"
      style={{
        background: active ? C.amber : "transparent",
        color: active ? C.bg : C.textMuted,
        border: `1px solid ${active ? C.amber : C.line}`,
      }}
    >
      {label}
    </button>
  );
}

function PrimaryButton({ children, onClick, disabled, icon: Icon, style }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="mend-body text-sm font-medium px-4 py-2 rounded-sm inline-flex items-center gap-2 transition-opacity"
      style={{
        background: disabled ? C.line : C.amber,
        color: disabled ? C.textFaint : "#20180A",
        opacity: disabled ? 0.7 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
        ...style,
      }}
    >
      {Icon && <Icon size={15} />}
      {children}
    </button>
  );
}

function GhostButton({ children, onClick, tone = "default", icon: Icon }) {
  const color = tone === "danger" ? C.rust : tone === "teal" ? C.teal : C.textMuted;
  return (
    <button
      onClick={onClick}
      className="mend-body text-sm px-3 py-1.5 rounded-sm inline-flex items-center gap-1.5 transition-colors"
      style={{ color, border: `1px solid ${color}55`, background: "transparent" }}
    >
      {Icon && <Icon size={14} />}
      {children}
    </button>
  );
}

/* ---------------------------------------------------------
   TOOL CARD (pegboard tag)
--------------------------------------------------------- */
function ToolCard({ tool, owner, onOpen }) {
  return (
    <button
      onClick={onOpen}
      className="mend-anim text-left rounded-sm p-4 flex flex-col gap-3 transition-transform hover:-translate-y-0.5"
      style={{ background: C.surface, border: `1px solid ${C.line}` }}
    >
      <div className="flex items-start justify-between">
        <div className="mend-tag-hole" />
        <StatusBadge status={tool.status} />
      </div>
      <div className="text-4xl leading-none">{tool.emoji}</div>
      <div>
        <div className="mend-mono text-[10px] mb-1" style={{ color: C.amberDim }}>
          {tool.category.toUpperCase()}
        </div>
        <div className="mend-display text-base font-semibold" style={{ color: C.text }}>
          {tool.title}
        </div>
      </div>
      <div className="flex items-center justify-between mend-mono text-[11px] pt-2" style={{ color: C.textFaint, borderTop: `1px dashed ${C.line}` }}>
        <span>{tool.condition}</span>
        <span>{owner?.name.split(" ")[0]}</span>
      </div>
    </button>
  );
}

/* ---------------------------------------------------------
   MODAL WRAPPER — dark overlay + centered box.
   Used by BOTH the tool detail popup and the add-tool popup.
   position: fixed + z-index: 9999 (inline style, not just a
   Tailwind class) so it can never fail to sit above the grid.
--------------------------------------------------------- */
function ModalShell({ onClose, children, wide }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
        zIndex: 9999,
        background: "rgba(10,9,7,0.72)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        overflowY: "auto",
      }}
      className="mend-scroll"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`mend-anim w-full ${wide ? "max-w-2xl" : "max-w-md"} rounded-sm p-6`}
        style={{ background: C.bg2, border: `1px solid ${C.line}`, maxHeight: "90vh", overflowY: "auto" }}
      >
        {children}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   TOOL DETAIL MODAL (centered popup)
--------------------------------------------------------- */
function ToolDetailModal({ tool, owner, currentUser, myRequestForTool, onClose, onRequest }) {
  const isOwn = tool.ownerId === currentUser.id;

  return (
    <ModalShell onClose={onClose}>
      <div className="flex justify-between items-start mb-4">
        <div className="text-5xl">{tool.emoji}</div>
        <button onClick={onClose} style={{ color: C.textMuted }}>
          <X size={20} />
        </button>
      </div>
      <div className="mend-mono text-[11px] mb-1" style={{ color: C.amberDim }}>
        {tool.category.toUpperCase()} · {tool.condition.toUpperCase()}
      </div>
      <h2 className="mend-display text-2xl font-semibold mb-3" style={{ color: C.text }}>
        {tool.title}
      </h2>
      <p className="mend-body text-sm leading-relaxed mb-4" style={{ color: C.textMuted }}>
        {tool.description}
      </p>
      <div className="flex items-center gap-2 mb-5 mend-body text-sm" style={{ color: C.textMuted }}>
        <User size={14} />
        <span>Listed by {owner?.name}</span>
        <span style={{ color: C.textFaint }}>·</span>
        <MapPin size={14} />
        <span>{owner?.neighborhood}</span>
      </div>

      <div className="pt-4" style={{ borderTop: `1px dashed ${C.line}` }}>
        {isOwn ? (
          <div className="mend-mono text-xs" style={{ color: C.textFaint }}>
            THIS IS YOUR TOOL — manage requests from My Bench.
          </div>
        ) : tool.status === "borrowed" ? (
          <div className="flex items-center gap-2 mend-body text-sm" style={{ color: C.teal }}>
            <Clock size={15} />
            Currently checked out{tool.dueDate ? ` · back by ${tool.dueDate}` : ""}
          </div>
        ) : myRequestForTool ? (
          <div className="flex items-center gap-2 mend-body text-sm" style={{ color: C.textMuted }}>
            <AlertCircle size={15} />
            Your request is {myRequestForTool.status}.
          </div>
        ) : (
          <PrimaryButton icon={Wrench} onClick={onRequest}>
            Request to borrow
          </PrimaryButton>
        )}
      </div>
    </ModalShell>
  );
}

/* ---------------------------------------------------------
   ADD TOOL MODAL
--------------------------------------------------------- */
function AddToolModal({ onClose, onSave }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [condition, setCondition] = useState(CONDITIONS[0]);
  const [description, setDescription] = useState("");
  const [emoji, setEmoji] = useState(EMOJI_CHOICES[0]);

  const canSave = title.trim().length > 1 && description.trim().length > 3;

  return (
    <ModalShell onClose={onClose} wide>
      <div className="flex justify-between items-start mb-5">
        <h2 className="mend-display text-xl font-semibold" style={{ color: C.text }}>
          List a tool on the pegboard
        </h2>
        <button onClick={onClose} style={{ color: C.textMuted }}>
          <X size={20} />
        </button>
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <label className="mend-mono text-[10px] block mb-1.5" style={{ color: C.textFaint }}>
            TOOL NAME
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Belt Sander"
            className="mend-body mend-input text-sm w-full px-3 py-2 rounded-sm outline-none"
            style={FIELD_STYLE}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mend-mono text-[10px] block mb-1.5" style={{ color: C.textFaint }}>
              CATEGORY
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mend-body text-sm w-full px-3 py-2 rounded-sm outline-none"
              style={FIELD_STYLE}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mend-mono text-[10px] block mb-1.5" style={{ color: C.textFaint }}>
              CONDITION
            </label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="mend-body text-sm w-full px-3 py-2 rounded-sm outline-none"
              style={FIELD_STYLE}
            >
              {CONDITIONS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="mend-mono text-[10px] block mb-1.5" style={{ color: C.textFaint }}>
            ICON
          </label>
          <div className="flex flex-wrap gap-2">
            {EMOJI_CHOICES.map((e) => (
              <button
                key={e}
                onClick={() => setEmoji(e)}
                className="text-xl w-10 h-10 flex items-center justify-center rounded-sm"
                style={{
                  background: emoji === e ? C.amber : C.surface,
                  border: `1px solid ${emoji === e ? C.amber : C.line}`,
                }}
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mend-mono text-[10px] block mb-1.5" style={{ color: C.textFaint }}>
            DESCRIPTION — condition notes, what's included, pickup tips
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="What should a borrower know?"
            className="mend-body mend-input text-sm w-full px-3 py-2 rounded-sm outline-none resize-none"
            style={FIELD_STYLE}
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <GhostButton onClick={onClose}>Cancel</GhostButton>
          <PrimaryButton
            disabled={!canSave}
            onClick={() =>
              canSave &&
              onSave({ title: title.trim(), category, condition, description: description.trim(), emoji })
            }
          >
            List tool
          </PrimaryButton>
        </div>
      </div>
    </ModalShell>
  );
}

/* ---------------------------------------------------------
   BROWSE VIEW
--------------------------------------------------------- */
function BrowseView({ tools, users, currentUser, requests, onOpenTool }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return tools.filter((t) => {
      if (category !== "All" && t.category !== category) return false;
      if (onlyAvailable && t.status !== "available") return false;

      if (q) {
        const owner = users.find((u) => u.id === t.ownerId);
        const searchableText = [
          t.title,
          t.category,
          t.condition,
          t.description,
          owner?.name,
          owner?.neighborhood,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        if (!searchableText.includes(q)) return false;
      }

      return true;
    });
  }, [tools, users, category, onlyAvailable, query]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-sm flex-1"
          style={{ background: "#000000", border: `1px solid ${C.line}` }}
        >
          <Search size={15} style={{ color: "#666666",marginRight:"4px" }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the pegboard…"
            className="mend-body mend-input text-sm bg-transparent outline-none flex-1"
            style={{ color: "#111111", colorScheme: "light" }}
          />
        </div>
        <button
          onClick={() => setOnlyAvailable((v) => !v)}
          className="mend-mono text-xs px-3 py-2 rounded-sm whitespace-nowrap"
          style={{
            background: onlyAvailable ? C.amber : "transparent",
            color: onlyAvailable ? C.bg : C.textMuted,
            border: `1px solid ${onlyAvailable ? C.amber : C.line}`,
          }}
        >
          ON SHELF ONLY
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto mend-scroll pb-1">
        <CategoryPill label="All" active={category === "All"} onClick={() => setCategory("All")} />
        {CATEGORIES.map((c) => (
          <CategoryPill key={c} label={c} active={category === c} onClick={() => setCategory(c)} />
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 mend-body text-sm" style={{ color: C.textFaint }}>
          Nothing on the pegboard matches that. Try a different filter, or be the first to list one.
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
            gap: "16px",
          }}
        >
          {filtered.map((tool) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              owner={users.find((u) => u.id === tool.ownerId)}
              onOpen={() => onOpenTool(tool)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------
   MY BENCH VIEW (owner managing own tools + requests)
--------------------------------------------------------- */
function MyBenchView({ currentUser, tools, requests, users, onApprove, onDecline, onReturn }) {
  const myTools = tools.filter((t) => t.ownerId === currentUser.id);

  if (myTools.length === 0) {
    return (
      <div className="text-center py-16 mend-body text-sm" style={{ color: C.textFaint }}>
        You haven't hung anything on the pegboard yet.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {myTools.map((tool) => {
        const toolRequests = requests
          .filter((r) => r.toolId === tool.id)
          .sort((a, b) => (a.requestedDate < b.requestedDate ? 1 : -1));
        const pending = toolRequests.filter((r) => r.status === "pending");
        const active = toolRequests.find((r) => r.status === "approved");
        const history = toolRequests.filter((r) => r.status === "declined" || r.status === "returned");

        return (
          <div key={tool.id} className="rounded-sm p-4" style={{ background: C.surface, border: `1px solid ${C.line}` }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="text-2xl">{tool.emoji}</div>
              <div className="flex-1">
                <div className="mend-display font-semibold text-sm" style={{ color: C.text }}>{tool.title}</div>
                <div className="mend-mono text-[10px]" style={{ color: C.amberDim }}>{tool.category.toUpperCase()}</div>
              </div>
              <StatusBadge status={tool.status} />
            </div>

            {active && (
              <div className="flex items-center justify-between px-3 py-2 rounded-sm mb-2" style={{ background: C.tealDim + "22", border: `1px solid ${C.teal}44` }}>
                <div className="mend-body text-sm" style={{ color: C.text }}>
                  With {users.find((u) => u.id === active.requesterId)?.name} · due {active.dueDate}
                </div>
                <GhostButton tone="teal" icon={RotateCcw} onClick={() => onReturn(active.id)}>
                  Mark returned
                </GhostButton>
              </div>
            )}

            {pending.length > 0 && (
              <div className="flex flex-col gap-2 mb-2">
                {pending.map((r) => (
                  <div key={r.id} className="flex items-center justify-between px-3 py-2 rounded-sm" style={{ background: C.bg2, border: `1px solid ${C.line}` }}>
                    <div className="mend-body text-sm" style={{ color: C.text }}>
                      {users.find((u) => u.id === r.requesterId)?.name} wants to borrow this
                    </div>
                    <div className="flex gap-2">
                      <GhostButton tone="teal" icon={Check} onClick={() => onApprove(r.id, tool.id)}>Approve</GhostButton>
                      <GhostButton tone="danger" icon={X} onClick={() => onDecline(r.id)}>Decline</GhostButton>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {history.length > 0 && (
              <div className="mend-mono text-[10px] flex flex-wrap gap-x-4 gap-y-1 pt-2" style={{ color: C.textFaint, borderTop: `1px dashed ${C.line}` }}>
                {history.map((r) => (
                  <span key={r.id}>
                    {users.find((u) => u.id === r.requesterId)?.name.split(" ")[0]} · {r.status}
                  </span>
                ))}
              </div>
            )}

            {!active && pending.length === 0 && history.length === 0 && (
              <div className="mend-mono text-[10px]" style={{ color: C.textFaint }}>NO REQUESTS YET</div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ---------------------------------------------------------
   MY REQUESTS VIEW
--------------------------------------------------------- */
function MyRequestsView({ currentUser, requests, tools, users }) {
  const mine = requests
    .filter((r) => r.requesterId === currentUser.id)
    .sort((a, b) => (a.requestedDate < b.requestedDate ? 1 : -1));

  if (mine.length === 0) {
    return (
      <div className="text-center py-16 mend-body text-sm" style={{ color: C.textFaint }}>
        You haven't requested anything yet — browse the pegboard to find something.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {mine.map((r) => {
        const tool = tools.find((t) => t.id === r.toolId);
        const owner = users.find((u) => u.id === tool.ownerId);
        return (
          <div key={r.id} className="flex items-center gap-3 rounded-sm p-3" style={{ background: C.surface, border: `1px solid ${C.line}` }}>
            <div className="text-2xl">{tool.emoji}</div>
            <div className="flex-1">
              <div className="mend-display font-semibold text-sm" style={{ color: C.text }}>{tool.title}</div>
              <div className="mend-body text-xs" style={{ color: C.textFaint }}>
                Owned by {owner.name} {r.dueDate ? `· due ${r.dueDate}` : ""}
              </div>
            </div>
            <StatusBadge status={r.status} />
          </div>
        );
      })}
    </div>
  );
}

/* ---------------------------------------------------------
   APP
--------------------------------------------------------- */
export default function App() {
  const [users] = useState(seedUsers);
  const [tools, setTools] = useState(seedTools);
  const [requests, setRequests] = useState(seedRequests);
  const [currentUserId, setCurrentUserId] = useState("u1");
  const [tab, setTab] = useState("browse");
  const [openTool, setOpenTool] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [toast, setToast] = useState(null);

  const currentUser = users.find((u) => u.id === currentUserId);

  const flash = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };

  const toolWithDue = (tool) => {
    const active = requests.find((r) => r.toolId === tool.id && r.status === "approved");
    return { ...tool, dueDate: active?.dueDate || null };
  };

  const myRequestForTool = (toolId) =>
    requests.find(
      (r) => r.toolId === toolId && r.requesterId === currentUserId && (r.status === "pending" || r.status === "approved")
    );

  const handleRequest = (tool) => {
    if (!tool) return;

    if (tool.ownerId === currentUserId) {
      flash("You cannot borrow your own tool.");
      return;
    }

    if (tool.status !== "available") {
      flash("This tool is currently checked out.");
      return;
    }

    const existingRequest = requests.find(
      (r) =>
        r.toolId === tool.id &&
        r.requesterId === currentUserId &&
        (r.status === "pending" || r.status === "approved")
    );

    if (existingRequest) {
      flash(
        existingRequest.status === "pending"
          ? "You already have a pending request for this tool."
          : "You already have this tool approved."
      );
      return;
    }

    const newReq = {
      id: "r" + Date.now(),
      toolId: tool.id,
      requesterId: currentUserId,
      status: "pending",
      requestedDate: new Date().toISOString().slice(0, 10),
      dueDate: null,
    };

    setRequests((rs) => [...rs, newReq]);
    setOpenTool(null);
    flash("Request sent — the owner will approve or decline it.");
  };

  const handleApprove = (requestId, toolId) => {
    setRequests((rs) =>
      rs.map((r) => {
        if (r.id === requestId) return { ...r, status: "approved", dueDate: todayPlus(7) };
        if (r.toolId === toolId && r.status === "pending") return { ...r, status: "declined" };
        return r;
      })
    );
    setTools((ts) => ts.map((t) => (t.id === toolId ? { ...t, status: "borrowed" } : t)));
    flash("Request approved.");
  };

  const handleDecline = (requestId) => {
    setRequests((rs) => rs.map((r) => (r.id === requestId ? { ...r, status: "declined" } : r)));
    flash("Request declined.");
  };

  const handleReturn = (requestId) => {
    const req = requests.find((r) => r.id === requestId);
    setRequests((rs) => rs.map((r) => (r.id === requestId ? { ...r, status: "returned" } : r)));
    setTools((ts) => ts.map((t) => (t.id === req.toolId ? { ...t, status: "available" } : t)));
    flash("Marked returned. Back on the shelf.");
  };

  const handleAddTool = (data) => {
    const newTool = {
      id: "t" + Date.now(),
      ownerId: currentUserId,
      status: "available",
      ...data,
    };
    setTools((ts) => [newTool, ...ts]);
    setShowAdd(false);
    setTab("bench");
    flash("Tool listed on the pegboard.");
  };

  const tabs = [
    { id: "browse", label: "Browse" },
    { id: "bench", label: "My Bench" },
    { id: "requests", label: "My Requests" },
  ];

  const activeDetail = openTool ? toolWithDue(tools.find((t) => t.id === openTool.id) || openTool) : null;

  return (
    <div
      className="min-h-screen w-full mend-pegboard mend-body"
      style={{ background: C.bg, color: C.text, minHeight: "100vh" }}
    >
      <style>{FONTS}</style>

      {/* HEADER */}
      <div className="sticky top-0 z-30" style={{ background: `${C.bg}F2`, borderBottom: `1px solid ${C.line}`, backdropFilter: "blur(6px)" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Wrench size={20} style={{ color: C.amber }} />
            <span className="mend-display text-lg font-bold tracking-tight">MEND</span>
            <span className="mend-mono text-[10px] hidden sm:inline" style={{ color: C.textFaint }}>
              · NEIGHBORHOOD TOOL LIBRARY
            </span>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={currentUserId}
              onChange={(e) => setCurrentUserId(e.target.value)}
              className="mend-mono text-xs px-2 py-1.5 rounded-sm outline-none"
              style={{ background: C.surface, border: `1px solid ${C.line}`, color: C.text }}
            >
              {users.map((u) => (
                <option key={u.id} value={u.id}>VIEWING AS {u.name.toUpperCase()}</option>
              ))}
            </select>
            <PrimaryButton icon={Plus} onClick={() => setShowAdd(true)}>
              <span className="hidden sm:inline">List a tool</span>
            </PrimaryButton>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex gap-1 pb-0">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="mend-mono text-xs px-4 py-2.5 rounded-t-sm"
              style={{
                color: tab === t.id ? C.amber : C.textFaint,
                borderBottom: tab === t.id ? `2px solid ${C.amber}` : "2px solid transparent",
              }}
            >
              {t.label.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* BODY */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {tab === "browse" && (
          <BrowseView
            tools={tools.map(toolWithDue)}
            users={users}
            currentUser={currentUser}
            requests={requests}
            onOpenTool={setOpenTool}
          />
        )}
        {tab === "bench" && (
          <MyBenchView
            currentUser={currentUser}
            tools={tools}
            requests={requests}
            users={users}
            onApprove={handleApprove}
            onDecline={handleDecline}
            onReturn={handleReturn}
          />
        )}
        {tab === "requests" && (
          <MyRequestsView currentUser={currentUser} requests={requests} tools={tools} users={users} />
        )}
      </div>

      {/* TOOL DETAIL — centered popup, above everything */}
      {activeDetail && (
        <ToolDetailModal
          tool={activeDetail}
          owner={users.find((u) => u.id === activeDetail.ownerId)}
          currentUser={currentUser}
          myRequestForTool={myRequestForTool(activeDetail.id)}
          onClose={() => setOpenTool(null)}
          onRequest={() => handleRequest(activeDetail)}
        />
      )}

      {/* ADD TOOL — centered popup, above everything */}
      {showAdd && <AddToolModal onClose={() => setShowAdd(false)} onSave={handleAddTool} />}

      {/* TOAST */}
      {toast && (
        <div
          className="mend-anim fixed bottom-5 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-sm mend-body text-sm"
          style={{ background: C.surfaceHi, border: `1px solid ${C.line}`, color: C.text }}
        >
          {toast}
        </div>
      )}
    </div>
  );
}