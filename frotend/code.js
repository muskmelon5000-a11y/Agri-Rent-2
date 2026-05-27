// ============================================================
//  AgriRent — 50 Screen Figma Plugin
//  Generates all screens at 390×844 (iPhone 14 canvas size)
// ============================================================

const UI_HTML = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body { font-family: Inter, sans-serif; padding: 16px; margin: 0; background: #fff; }
  h2 { font-size: 14px; font-weight: 600; margin: 0 0 4px; }
  p { font-size: 12px; color: #666; margin: 0 0 14px; }
  button {
    width: 100%; padding: 10px; background: #1D9E75; color: #fff;
    border: none; border-radius: 6px; font-size: 13px; font-weight: 500;
    cursor: pointer;
  }
  button:hover { background: #0F6E56; }
  button:disabled { background: #aaa; cursor: default; }
  #status { margin-top: 12px; font-size: 12px; color: #444; min-height: 20px; }
  .progress { width: 100%; height: 6px; background: #eee; border-radius: 3px; margin-top: 8px; display: none; }
  .progress-bar { height: 6px; background: #1D9E75; border-radius: 3px; width: 0%; transition: width 0.2s; }
</style>
</head>
<body>
  <h2>🌾 AgriRent Screen Generator</h2>
  <p>Generates all 50 app screens organized in sections on your Figma canvas.</p>
  <button id="generate-btn" onclick="generate()">Generate 50 Screens</button>
  <div id="status"></div>
  <div class="progress" id="progress-wrap">
    <div class="progress-bar" id="progress-bar"></div>
  </div>
  <script>
    function generate() {
      document.getElementById('generate-btn').disabled = true;
      document.getElementById('generate-btn').textContent = 'Generating...';
      document.getElementById('progress-wrap').style.display = 'block';
      document.getElementById('status').textContent = 'Starting...';
      parent.postMessage({ pluginMessage: { type: 'generate' } }, '*');
    }
    window.onmessage = (event) => {
      const msg = event.data.pluginMessage;
      if (!msg) return;
      if (msg.type === 'progress') {
        const pct = Math.round((msg.current / msg.total) * 100);
        document.getElementById('progress-bar').style.width = pct + '%';
        document.getElementById('status').textContent = 'Creating screen ' + msg.current + '/' + msg.total + ': ' + msg.name;
      }
      if (msg.type === 'done') {
        document.getElementById('status').textContent = '✅ All 50 screens generated!';
        document.getElementById('generate-btn').textContent = 'Done!';
      }
    };
  </script>
</body>
</html>
`;

figma.showUI(UI_HTML, { width: 320, height: 180 });

// ── Design Tokens ──────────────────────────────────────────
const C = {
  green:      { r: 0.114, g: 0.620, b: 0.459 },  // #1D9E75
  greenDark:  { r: 0.059, g: 0.431, b: 0.333 },  // #0F6E56
  greenLight: { r: 0.882, g: 0.961, b: 0.933 },  // #E1F5EE
  amber:      { r: 0.937, g: 0.624, b: 0.153 },  // #EF9F27
  red:        { r: 0.886, g: 0.294, b: 0.290 },  // #E24B4A
  white:      { r: 1,     g: 1,     b: 1     },
  bg:         { r: 0.969, g: 0.969, b: 0.961 },  // #F7F7F5
  text:       { r: 0.137, g: 0.137, b: 0.137 },  // #232323
  textSub:    { r: 0.467, g: 0.467, b: 0.455 },  // #777774
  border:     { r: 0.878, g: 0.878, b: 0.871 },  // #E0E0DE
  black:      { r: 0,     g: 0,     b: 0     },
};

const W = 390;   // screen width
const H = 844;   // screen height
const COLS = 5;  // screens per row
const GAP = 80;  // gap between screens
const ROW_GAP = 120;

// ── All 50 screens definition ─────────────────────────────
const SCREENS = [
  // ── Onboarding (1–5) ──
  { id: 1,  section: "Onboarding",    name: "01 · Splash Screen" },
  { id: 2,  section: "Onboarding",    name: "02 · Onboarding 1 – Welcome" },
  { id: 3,  section: "Onboarding",    name: "03 · Onboarding 2 – Browse Equipment" },
  { id: 4,  section: "Onboarding",    name: "04 · Onboarding 3 – Book & Pay" },
  { id: 5,  section: "Onboarding",    name: "05 · Onboarding 4 – Earn as Owner" },

  // ── Auth (6–10) ──
  { id: 6,  section: "Auth",          name: "06 · Select Role (Farmer / Owner)" },
  { id: 7,  section: "Auth",          name: "07 · Phone Number Entry" },
  { id: 8,  section: "Auth",          name: "08 · OTP Verification" },
  { id: 9,  section: "Auth",          name: "09 · Set Profile & Location" },
  { id: 10, section: "Auth",          name: "10 · Land Size & Crop Type Setup" },

  // ── Home (11–15) ──
  { id: 11, section: "Home",          name: "11 · Home – Browse (Borrower)" },
  { id: 12, section: "Home",          name: "12 · Home – Category Grid" },
  { id: 13, section: "Home",          name: "13 · Home – Map View" },
  { id: 14, section: "Home",          name: "14 · Home – Seasonal Deals Banner" },
  { id: 15, section: "Home",          name: "15 · Home – Owner Dashboard" },

  // ── Equipment Listing (16–21) ──
  { id: 16, section: "Equipment",     name: "16 · Equipment List – All" },
  { id: 17, section: "Equipment",     name: "17 · Equipment List – Filter Sheet" },
  { id: 18, section: "Equipment",     name: "18 · Equipment Detail – Photos" },
  { id: 19, section: "Equipment",     name: "19 · Equipment Detail – Specs & Price" },
  { id: 20, section: "Equipment",     name: "20 · Equipment Detail – Owner Info" },
  { id: 21, section: "Equipment",     name: "21 · Equipment Detail – Reviews" },

  // ── Booking Flow (22–28) ──
  { id: 22, section: "Booking",       name: "22 · Select Date & Time" },
  { id: 23, section: "Booking",       name: "23 · Select Duration (Hours / Days)" },
  { id: 24, section: "Booking",       name: "24 · Add Delivery Address" },
  { id: 25, section: "Booking",       name: "25 · Booking Summary" },
  { id: 26, section: "Booking",       name: "26 · Payment – Choose Method" },
  { id: 27, section: "Booking",       name: "27 · Payment – UPI / Card" },
  { id: 28, section: "Booking",       name: "28 · Booking Confirmed" },

  // ── My Bookings (29–32) ──
  { id: 29, section: "My Bookings",   name: "29 · My Bookings – Active" },
  { id: 30, section: "My Bookings",   name: "30 · My Bookings – Past" },
  { id: 31, section: "My Bookings",   name: "31 · Booking Detail – Tracking" },
  { id: 32, section: "My Bookings",   name: "32 · Cancel / Reschedule Booking" },

  // ── Owner Flow (33–39) ──
  { id: 33, section: "Owner",         name: "33 · Owner Home – Earnings Dashboard" },
  { id: 34, section: "Owner",         name: "34 · List New Equipment – Step 1 Photo" },
  { id: 35, section: "Owner",         name: "35 · List New Equipment – Step 2 Details" },
  { id: 36, section: "Owner",         name: "36 · List New Equipment – Step 3 Pricing" },
  { id: 37, section: "Owner",         name: "37 · List New Equipment – Step 4 Availability" },
  { id: 38, section: "Owner",         name: "38 · Manage Listings" },
  { id: 39, section: "Owner",         name: "39 · Incoming Booking Request" },

  // ── Messaging (40–42) ──
  { id: 40, section: "Messaging",     name: "40 · Chat Inbox" },
  { id: 41, section: "Messaging",     name: "41 · Chat Thread – Farmer ↔ Owner" },
  { id: 42, section: "Messaging",     name: "42 · In-App Call Screen" },

  // ── Reviews & Trust (43–45) ──
  { id: 43, section: "Trust",         name: "43 · Leave a Review" },
  { id: 44, section: "Trust",         name: "44 · Report Damage / Dispute" },
  { id: 45, section: "Trust",         name: "45 · Insurance Info Sheet" },

  // ── Profile & Settings (46–49) ──
  { id: 46, section: "Profile",       name: "46 · My Profile" },
  { id: 47, section: "Profile",       name: "47 · Edit Profile" },
  { id: 48, section: "Profile",       name: "48 · Notifications" },
  { id: 49, section: "Profile",       name: "49 · Settings & Language" },

  // ── Misc (50) ──
  { id: 50, section: "Misc",          name: "50 · Empty State / No Results" },
];

// ── Helpers ───────────────────────────────────────────────

function solid(color) {
  return [{ type: "SOLID", color }];
}

function addRect(parent, x, y, w, h, color, radius = 0) {
  const r = figma.createRectangle();
  r.x = x; r.y = y; r.resize(w, h);
  r.fills = solid(color);
  r.cornerRadius = radius;
  parent.appendChild(r);
  return r;
}

function addText(parent, content, x, y, size, color, weight = "Regular", maxWidth = 0) {
  const t = figma.createText();
  t.characters = content;
  t.fontSize = size;
  t.fills = solid(color);
  t.fontName = { family: "Inter", style: weight };
  t.x = x; t.y = y;
  if (maxWidth > 0) { t.textAutoResize = "HEIGHT"; t.resize(maxWidth, 40); }
  parent.appendChild(t);
  return t;
}

function addLine(parent, x, y, w) {
  const r = figma.createRectangle();
  r.x = x; r.y = y; r.resize(w, 1);
  r.fills = solid(C.border);
  parent.appendChild(r);
  return r;
}

// ── Shared UI Components ──────────────────────────────────

function drawStatusBar(frame) {
  addRect(frame, 0, 0, W, 44, C.white);
  addText(frame, "9:41", 18, 13, 15, C.text, "SemiBold");
  addText(frame, "●●● ▶ WiFi 🔋", W - 110, 14, 12, C.text, "Regular");
}

function drawBottomNav(frame) {
  const navH = 82;
  addRect(frame, 0, H - navH, W, navH, C.white);
  addLine(frame, 0, H - navH, W);
  const items = [
    { icon: "⌂", label: "Home",    x: 0 },
    { icon: "◎", label: "Map",     x: 78 },
    { icon: "⊞", label: "Book",    x: 156 },
    { icon: "✉", label: "Chat",    x: 234 },
    { icon: "◯", label: "Profile", x: 312 },
  ];
  items.forEach((item, i) => {
    const cx = 39 + i * 78;
    const active = i === 0;
    addText(frame, item.icon, cx - 10, H - 66, 20, active ? C.green : C.textSub, "Regular");
    addText(frame, item.label, cx - 16, H - 42, 10, active ? C.green : C.textSub, active ? "SemiBold" : "Regular");
  });
}

function drawTopBar(frame, title, hasBack = true) {
  addRect(frame, 0, 44, W, 56, C.white);
  addLine(frame, 0, 100, W);
  if (hasBack) {
    addText(frame, "‹", 16, 55, 26, C.green, "Regular");
  }
  addText(frame, title, hasBack ? 44 : 16, 60, 17, C.text, "SemiBold", W - 80);
}

function drawGreenHeader(frame, title, subtitle = "") {
  addRect(frame, 0, 0, W, subtitle ? 140 : 110, C.green);
  drawStatusBar(frame);
  addText(frame, title, 20, 58, 22, C.white, "Bold", W - 40);
  if (subtitle) addText(frame, subtitle, 20, 90, 13, C.greenLight, "Regular", W - 40);
}

function drawCard(frame, x, y, w, h, label = "", sublabel = "") {
  addRect(frame, x, y, w, h, C.white, 12);
  const border = figma.createRectangle();
  border.x = x; border.y = y; border.resize(w, h);
  border.fills = [];
  border.strokes = solid(C.border);
  border.strokeWeight = 1;
  border.cornerRadius = 12;
  frame.appendChild(border);
  if (label) addText(frame, label, x + 14, y + 14, 13, C.text, "SemiBold", w - 28);
  if (sublabel) addText(frame, sublabel, x + 14, y + 34, 11, C.textSub, "Regular", w - 28);
}

function drawInputField(frame, x, y, w, placeholder) {
  addRect(frame, x, y, w, 48, C.bg, 10);
  addText(frame, placeholder, x + 14, y + 14, 14, C.textSub, "Regular");
}

function drawGreenButton(frame, x, y, w, label) {
  addRect(frame, x, y, w, 52, C.green, 12);
  addText(frame, label, x + (w / 2) - (label.length * 4.5), y + 15, 15, C.white, "SemiBold");
}

function drawChip(frame, x, y, label, active = false) {
  addRect(frame, x, y, label.length * 8 + 24, 30, active ? C.green : C.bg, 15);
  addText(frame, label, x + 12, y + 7, 12, active ? C.white : C.textSub, active ? "SemiBold" : "Regular");
  return label.length * 8 + 24;
}

function drawAvatar(frame, x, y, initials, size = 44) {
  addRect(frame, x, y, size, size, C.greenLight, size / 2);
  addText(frame, initials, x + size / 2 - initials.length * 5, y + size / 2 - 8, 14, C.green, "SemiBold");
}

function drawStars(frame, x, y, rating = 5) {
  addText(frame, "★".repeat(rating) + "☆".repeat(5 - rating), x, y, 12, C.amber, "Regular");
}

function drawSectionLabel(frame, x, y, label) {
  addText(frame, label.toUpperCase(), x, y, 10, C.textSub, "SemiBold");
}

function drawListRow(frame, y, label, value, showDivider = true) {
  addText(frame, label, 20, y, 14, C.text, "Regular");
  addText(frame, value, W - 20 - value.length * 8, y, 14, C.textSub, "Regular");
  if (showDivider) addLine(frame, 20, y + 28, W - 40);
}

// ── Screen Builders ───────────────────────────────────────

const screenBuilders = {

  // 01 Splash
  1: (f) => {
    addRect(f, 0, 0, W, H, C.green);
    addText(f, "🌾", W/2 - 30, H/2 - 80, 60, C.white, "Regular");
    addText(f, "AgriRent", W/2 - 60, H/2 + 10, 32, C.white, "Bold");
    addText(f, "The Farm Equipment Network", W/2 - 110, H/2 + 52, 14, C.greenLight, "Regular");
    addRect(f, W/2 - 30, H - 80, 60, 4, C.white, 2);
  },

  // 02 Onboarding 1
  2: (f) => {
    addRect(f, 0, 0, W, H, C.white);
    addRect(f, 0, 0, W, 420, C.greenLight);
    addText(f, "🚜", W/2 - 40, 140, 80, C.green, "Regular");
    addText(f, "Rent equipment\nnear you", 30, 460, 28, C.text, "Bold", W - 60);
    addText(f, "Find tractors, drones, harvesters\nfrom farmers in your village", 30, 535, 15, C.textSub, "Regular", W - 60);
    addRect(f, W/2 - 60, 610, 120, 6, C.bg, 3);
    addRect(f, W/2 - 60, 610, 40, 6, C.green, 3);
    drawGreenButton(f, 30, 680, W - 60, "Get Started →");
    addText(f, "Already have an account? Sign in", W/2 - 110, 750, 13, C.textSub, "Regular");
  },

  // 03 Onboarding 2
  3: (f) => {
    addRect(f, 0, 0, W, H, C.white);
    addRect(f, 0, 0, W, 420, C.greenLight);
    addText(f, "📍", W/2 - 30, 160, 60, C.green, "Regular");
    addText(f, "Browse by\nLocation", 30, 460, 28, C.text, "Bold", W - 60);
    addText(f, "See available equipment within 10 km\nof your farm on a live map", 30, 535, 15, C.textSub, "Regular", W - 60);
    addRect(f, W/2 - 60, 610, 120, 6, C.bg, 3);
    addRect(f, W/2 - 20, 610, 40, 6, C.green, 3);
    drawGreenButton(f, 30, 680, W - 60, "Next →");
  },

  // 04 Onboarding 3
  4: (f) => {
    addRect(f, 0, 0, W, H, C.white);
    addRect(f, 0, 0, W, 420, C.greenLight);
    addText(f, "💳", W/2 - 30, 160, 60, C.green, "Regular");
    addText(f, "Book & Pay\nInstantly", 30, 460, 28, C.text, "Bold", W - 60);
    addText(f, "Hourly or daily booking. Pay via UPI.\nNo cash needed.", 30, 535, 15, C.textSub, "Regular", W - 60);
    addRect(f, W/2 - 60, 610, 120, 6, C.bg, 3);
    addRect(f, W/2, 610, 40, 6, C.green, 3);
    drawGreenButton(f, 30, 680, W - 60, "Next →");
  },

  // 05 Onboarding 4
  5: (f) => {
    addRect(f, 0, 0, W, H, C.white);
    addRect(f, 0, 0, W, 420, C.greenLight);
    addText(f, "💰", W/2 - 30, 160, 60, C.green, "Regular");
    addText(f, "Earn from\nIdle Equipment", 30, 460, 28, C.text, "Bold", W - 60);
    addText(f, "List your tractor or machinery. Earn ₹500–₹1500/hr\nduring your off season.", 30, 535, 15, C.textSub, "Regular", W - 60);
    addRect(f, W/2 - 60, 610, 120, 6, C.bg, 3);
    addRect(f, W/2 + 20, 610, 40, 6, C.green, 3);
    drawGreenButton(f, 30, 680, W - 60, "Let's Begin →");
  },

  // 06 Select Role
  6: (f) => {
    addRect(f, 0, 0, W, H, C.white);
    drawStatusBar(f);
    addText(f, "I am a…", 30, 80, 26, C.text, "Bold");
    addText(f, "Choose how you'll use AgriRent", 30, 116, 14, C.textSub, "Regular");
    addRect(f, 20, 170, W - 40, 150, C.greenLight, 16);
    addText(f, "🌾", 40, 195, 40, C.green, "Regular");
    addText(f, "Farmer / Borrower", 100, 202, 18, C.text, "Bold");
    addText(f, "I want to rent equipment\nfor my farm work", 100, 228, 13, C.textSub, "Regular", W - 160);
    addRect(f, 20, 340, W - 40, 150, C.bg, 16);
    addText(f, "🚜", 40, 365, 40, C.green, "Regular");
    addText(f, "Equipment Owner", 100, 372, 18, C.text, "Bold");
    addText(f, "I want to list and rent out\nmy equipment", 100, 398, 13, C.textSub, "Regular", W - 160);
    drawGreenButton(f, 30, H - 130, W - 60, "Continue →");
  },

  // 07 Phone Entry
  7: (f) => {
    addRect(f, 0, 0, W, H, C.white);
    drawStatusBar(f);
    addText(f, "Enter your\nphone number", 30, 80, 24, C.text, "Bold");
    addText(f, "We'll send a one-time password to verify", 30, 150, 14, C.textSub, "Regular", W - 60);
    addRect(f, 20, 210, 70, 52, C.bg, 10);
    addText(f, "+91", 30, 225, 16, C.text, "SemiBold");
    addRect(f, 100, 210, W - 120, 52, C.bg, 10);
    addText(f, "98XX XXX XXX", 116, 225, 16, C.textSub, "Regular");
    addText(f, "By continuing you agree to our Terms of Service", 30, 290, 12, C.textSub, "Regular", W - 60);
    drawGreenButton(f, 30, H - 130, W - 60, "Send OTP →");
  },

  // 08 OTP
  8: (f) => {
    addRect(f, 0, 0, W, H, C.white);
    drawStatusBar(f);
    addText(f, "‹", 16, 55, 26, C.green, "Regular");
    addText(f, "Verify OTP", 30, 80, 24, C.text, "Bold");
    addText(f, "Sent to +91 98XX XXX XXX", 30, 116, 14, C.textSub, "Regular");
    const boxW = 56;
    for (let i = 0; i < 6; i++) {
      addRect(f, 20 + i * 62, 180, boxW, 64, C.bg, 10);
      if (i < 4) addText(f, "•", 20 + i * 62 + 22, 200, 22, C.text, "Bold");
    }
    addText(f, "Resend OTP in 0:42", W/2 - 70, 270, 13, C.textSub, "Regular");
    drawGreenButton(f, 30, H - 130, W - 60, "Verify →");
  },

  // 09 Set Profile
  9: (f) => {
    addRect(f, 0, 0, W, H, C.white);
    drawStatusBar(f);
    addText(f, "Your Profile", 30, 60, 22, C.text, "Bold");
    addRect(f, W/2 - 44, 110, 88, 88, C.greenLight, 44);
    addText(f, "📷", W/2 - 18, 135, 36, C.green, "Regular");
    addText(f, "Full Name", 20, 230, 12, C.textSub, "Regular");
    drawInputField(f, 20, 248, W - 40, "e.g. Rajan Kumar");
    addText(f, "Village / Town", 20, 320, 12, C.textSub, "Regular");
    drawInputField(f, 20, 338, W - 40, "e.g. Karur, Tamil Nadu");
    addText(f, "Preferred Language", 20, 410, 12, C.textSub, "Regular");
    drawInputField(f, 20, 428, W - 40, "Tamil");
    drawGreenButton(f, 30, H - 130, W - 60, "Save & Continue →");
  },

  // 10 Land Size Setup
  10: (f) => {
    addRect(f, 0, 0, W, H, C.white);
    drawStatusBar(f);
    addText(f, "Your Farm Details", 30, 60, 22, C.text, "Bold");
    addText(f, "Helps us recommend the right equipment", 30, 94, 13, C.textSub, "Regular");
    addText(f, "Land Size (acres)", 20, 150, 12, C.textSub, "Regular");
    drawInputField(f, 20, 168, W - 40, "e.g. 3.5 acres");
    addText(f, "Primary Crop", 20, 240, 12, C.textSub, "Regular");
    const crops = ["Rice", "Cotton", "Sugarcane", "Vegetables", "Wheat"];
    let cx = 20;
    crops.forEach((c, i) => {
      const cw = drawChip(f, cx, 268, c, i === 0);
      cx += cw + 8;
    });
    addText(f, "Season", 20, 324, 12, C.textSub, "Regular");
    drawInputField(f, 20, 342, W - 40, "Kharif (June–Nov)");
    drawGreenButton(f, 30, H - 130, W - 60, "Done →");
  },

  // 11 Home Borrower
  11: (f) => {
    addRect(f, 0, 0, W, H, C.bg);
    drawGreenHeader(f, "Good morning, Rajan 👋", "Karur, Tamil Nadu · 28°C Sunny");
    const searchY = 152;
    addRect(f, 20, searchY, W - 40, 46, C.white, 12);
    addText(f, "🔍  Search tractor, drone…", 36, searchY + 13, 14, C.textSub, "Regular");
    const cats = [
      { icon: "🚜", label: "Tractors" },
      { icon: "🚁", label: "Drones" },
      { icon: "🌾", label: "Harvesters" },
      { icon: "💧", label: "Sprayers" },
    ];
    addText(f, "CATEGORIES", 20, 222, 10, C.textSub, "SemiBold");
    cats.forEach((c, i) => {
      const cx = 20 + i * 90;
      addRect(f, cx, 240, 80, 80, C.white, 12);
      addText(f, c.icon, cx + 24, 250, 28, C.green, "Regular");
      addText(f, c.label, cx + 8, 286, 11, C.textSub, "Regular");
    });
    addText(f, "NEARBY (within 10 km)", 20, 344, 10, C.textSub, "SemiBold");
    const items = [
      { name: "Mahindra 575 DI", price: "₹600/hr", dist: "3.2 km" },
      { name: "DJI Agras T10 Drone", price: "₹900/hr", dist: "5.8 km" },
      { name: "John Deere W70", price: "₹1,400/hr", dist: "7.1 km" },
    ];
    items.forEach((item, i) => {
      const cy = 364 + i * 90;
      addRect(f, 20, cy, W - 40, 80, C.white, 12);
      addRect(f, 30, cy + 10, 60, 60, C.greenLight, 10);
      addText(f, "🚜", 44, cy + 20, 30, C.green, "Regular");
      addText(f, item.name, 106, cy + 16, 14, C.text, "SemiBold");
      drawStars(f, 106, cy + 36);
      addText(f, item.price, 106, cy + 54, 13, C.green, "SemiBold");
      addText(f, item.dist, W - 90, cy + 30, 12, C.textSub, "Regular");
    });
    drawBottomNav(f);
  },

  // 12 Category Grid
  12: (f) => {
    addRect(f, 0, 0, W, H, C.bg);
    drawGreenHeader(f, "All Categories");
    const items = [
      "🚜 Tractors", "🚁 Drones", "🌾 Harvesters", "💧 Sprayers",
      "🔧 Tillers", "🌱 Seeders", "💡 Solar Pumps", "🚛 Transport",
    ];
    items.forEach((item, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = 20 + col * (W/2 - 14 + 8);
      const y = 154 + row * 100;
      addRect(f, x, y, W/2 - 30, 86, C.white, 14);
      addText(f, item.split(" ")[0], x + 16, y + 14, 30, C.green, "Regular");
      addText(f, item.split(" ").slice(1).join(" "), x + 16, y + 54, 14, C.text, "SemiBold");
    });
    drawBottomNav(f);
  },

  // 13 Map View
  13: (f) => {
    addRect(f, 0, 0, W, H, C.bg);
    drawStatusBar(f);
    drawTopBar(f, "Map View", false);
    addRect(f, 0, 100, W, H - 100 - 82, { r: 0.8, g: 0.9, b: 0.8 });
    addText(f, "[ Map placeholder — shows equipment pins near location ]", 40, H/2 - 30, 13, C.textSub, "Regular", W - 80);
    const pins = [
      { x: 120, y: 280, label: "₹600/hr" },
      { x: 240, y: 360, label: "₹900/hr" },
      { x: 300, y: 220, label: "₹1,200/hr" },
    ];
    pins.forEach(p => {
      addRect(f, p.x - 36, p.y - 18, 72, 28, C.green, 6);
      addText(f, p.label, p.x - 26, p.y - 10, 12, C.white, "SemiBold");
    });
    drawBottomNav(f);
  },

  // 14 Seasonal Deals
  14: (f) => {
    addRect(f, 0, 0, W, H, C.bg);
    drawGreenHeader(f, "Seasonal Deals 🎉", "Kharif season – limited offers");
    const deals = [
      { name: "Tractor – Flat 20% OFF", sub: "Valid till June 30", badge: "HOT" },
      { name: "Drone Spraying – Book 4 hrs, get 1 free", sub: "New users only", badge: "NEW" },
      { name: "Harvester – ₹999/day (was ₹1,500)", sub: "For fields > 2 acres", badge: "SAVE" },
    ];
    deals.forEach((d, i) => {
      const cy = 154 + i * 106;
      addRect(f, 20, cy, W - 40, 92, C.white, 14);
      addRect(f, W - 72, cy + 16, 52, 22, C.amber, 4);
      addText(f, d.badge, W - 64, cy + 21, 11, C.white, "SemiBold");
      addText(f, d.name, 20, cy + 18, 14, C.text, "SemiBold", W - 100);
      addText(f, d.sub, 20, cy + 44, 12, C.textSub, "Regular", W - 60);
      addText(f, "Claim →", 20, cy + 64, 13, C.green, "SemiBold");
    });
    drawBottomNav(f);
  },

  // 15 Owner Dashboard
  15: (f) => {
    addRect(f, 0, 0, W, H, C.bg);
    drawGreenHeader(f, "Owner Dashboard", "Senthil P · 2 listings active");
    const stats = [
      { val: "₹18,400", label: "This month" },
      { val: "23", label: "Bookings" },
      { val: "94%", label: "Utilization" },
    ];
    stats.forEach((s, i) => {
      const x = 20 + i * ((W - 40 - 16) / 3 + 8);
      addRect(f, x, 154, (W - 56) / 3, 72, C.white, 12);
      addText(f, s.val, x + 10, 166, 16, C.green, "Bold");
      addText(f, s.label, x + 10, 192, 11, C.textSub, "Regular");
    });
    addText(f, "UPCOMING BOOKINGS", 20, 252, 10, C.textSub, "SemiBold");
    const bookings = [
      { name: "Rajan Kumar", item: "Tractor · 3 hrs", time: "Today 9AM" },
      { name: "Kavitha S", item: "Tractor · 5 hrs", time: "Tomorrow 7AM" },
    ];
    bookings.forEach((b, i) => {
      const cy = 272 + i * 90;
      addRect(f, 20, cy, W - 40, 80, C.white, 12);
      drawAvatar(f, 30, cy + 18, b.name.split(" ").map(w => w[0]).join(""));
      addText(f, b.name, 86, cy + 18, 14, C.text, "SemiBold");
      addText(f, b.item, 86, cy + 38, 12, C.textSub, "Regular");
      addText(f, b.time, W - 110, cy + 28, 12, C.green, "SemiBold");
    });
    drawBottomNav(f);
  },

  // 16 Equipment List
  16: (f) => {
    addRect(f, 0, 0, W, H, C.bg);
    drawStatusBar(f);
    drawTopBar(f, "Tractors near you");
    addText(f, "14 available within 10 km", 20, 112, 12, C.textSub, "Regular");
    const items = [
      { name: "Mahindra 575 DI", owner: "Rajan K.", price: "₹600/hr", dist: "3.2 km", rating: 5 },
      { name: "Sonalika DI 35", owner: "Mani S.", price: "₹500/hr", dist: "4.5 km", rating: 4 },
      { name: "John Deere 5050D", owner: "Priya V.", price: "₹750/hr", dist: "6.0 km", rating: 5 },
      { name: "TAFE 35 DI", owner: "Arumugam R.", price: "₹480/hr", dist: "8.2 km", rating: 4 },
    ];
    items.forEach((item, i) => {
      const cy = 136 + i * 100;
      addRect(f, 20, cy, W - 40, 86, C.white, 14);
      addRect(f, 30, cy + 10, 66, 66, C.greenLight, 10);
      addText(f, "🚜", 44, cy + 20, 36, C.green, "Regular");
      addText(f, item.name, 110, cy + 14, 14, C.text, "SemiBold");
      addText(f, item.owner, 110, cy + 34, 12, C.textSub, "Regular");
      drawStars(f, 110, cy + 52, item.rating);
      addText(f, item.price, W - 100, cy + 14, 14, C.green, "SemiBold");
      addText(f, item.dist + " away", W - 100, cy + 38, 11, C.textSub, "Regular");
    });
    drawBottomNav(f);
  },

  // 17 Filter Sheet
  17: (f) => {
    addRect(f, 0, 0, W, H, { r: 0, g: 0, b: 0 });
    const overlay = figma.createRectangle();
    overlay.x = 0; overlay.y = 0; overlay.resize(W, H);
    overlay.fills = [{ type: "SOLID", color: C.black, opacity: 0.4 }];
    f.appendChild(overlay);
    addRect(f, 0, 300, W, H - 300, C.white, 20);
    addText(f, "Filters", 20, 320, 18, C.text, "Bold");
    addText(f, "✕", W - 36, 322, 18, C.textSub, "Regular");
    addLine(f, 20, 356, W - 40);
    addText(f, "Max Distance", 20, 372, 13, C.textSub, "Regular");
    addRect(f, 20, 398, W - 40, 6, C.bg, 3);
    addRect(f, 20, 398, (W - 40) * 0.6, 6, C.green, 3);
    addRect(f, 20 + (W - 40) * 0.6 - 10, 392, 20, 18, C.green, 9);
    addText(f, "Within 15 km", W - 100, 396, 12, C.green, "SemiBold");
    addText(f, "Equipment Type", 20, 428, 13, C.textSub, "Regular");
    let cx = 20;
    ["All", "Tractor", "Drone", "Harvester"].forEach((c, i) => {
      const cw = drawChip(f, cx, 450, c, i <= 1);
      cx += cw + 8;
    });
    addText(f, "Price Range (per hour)", 20, 504, 13, C.textSub, "Regular");
    drawInputField(f, 20, 522, (W - 56) / 2, "Min ₹");
    drawInputField(f, 20 + (W - 56) / 2 + 16, 522, (W - 56) / 2, "Max ₹");
    addText(f, "Min Rating", 20, 590, 13, C.textSub, "Regular");
    addText(f, "★ ★ ★ ★ ☆", 20, 614, 20, C.amber, "Regular");
    drawGreenButton(f, 20, 680, W - 40, "Apply Filters");
  },

  // 18 Equipment Photos
  18: (f) => {
    addRect(f, 0, 0, W, H, C.white);
    addRect(f, 0, 0, W, 320, C.greenLight);
    addText(f, "🚜", W/2 - 50, 100, 100, C.green, "Regular");
    addText(f, "‹", 16, 12, 26, C.white, "Regular");
    addText(f, "♡", W - 36, 12, 24, C.white, "Regular");
    const dots = 4;
    for (let i = 0; i < dots; i++) {
      addRect(f, W/2 - dots * 8 + i * 16, 300, 8, 8, i === 0 ? C.green : C.white, 4);
    }
    addText(f, "Mahindra 575 DI Tractor", 20, 340, 20, C.text, "Bold", W - 40);
    addRect(f, 20, 372, 90, 26, C.greenLight, 6);
    addText(f, "✓ Available", 30, 379, 12, C.green, "SemiBold");
    drawStars(f, 130, 378, 5);
    addText(f, "4.9 (38 reviews)", 200, 379, 12, C.textSub, "Regular");
    addLine(f, 20, 416, W - 40);
    drawGreenButton(f, 20, H - 130, W - 40, "Book Now — ₹600/hr");
    drawBottomNav(f);
  },

  // 19 Equipment Specs
  19: (f) => {
    addRect(f, 0, 0, W, H, C.white);
    drawStatusBar(f);
    drawTopBar(f, "Specs & Pricing");
    addText(f, "SPECIFICATIONS", 20, 120, 10, C.textSub, "SemiBold");
    const specs = [
      ["Brand", "Mahindra"], ["Model", "575 DI"], ["HP", "45 HP"],
      ["Fuel", "Diesel"], ["Year", "2021"], ["Implements", "Plough, Rotavator"],
    ];
    specs.forEach((s, i) => drawListRow(f, 150 + i * 40, s[0], s[1]));
    addText(f, "PRICING", 20, 400, 10, C.textSub, "SemiBold");
    drawListRow(f, 424, "Hourly rate", "₹600/hr");
    drawListRow(f, 464, "Half day (4 hrs)", "₹2,200");
    drawListRow(f, 504, "Full day (8 hrs)", "₹4,000");
    drawListRow(f, 544, "Security deposit", "₹1,000 (refundable)", false);
    drawGreenButton(f, 20, H - 130, W - 40, "Book Now →");
    drawBottomNav(f);
  },

  // 20 Owner Info
  20: (f) => {
    addRect(f, 0, 0, W, H, C.white);
    drawStatusBar(f);
    drawTopBar(f, "Owner Info");
    drawAvatar(f, W/2 - 44, 120, "RK", 88);
    addText(f, "Rajan Kumar", W/2 - 50, 220, 18, C.text, "Bold");
    addText(f, "Karur, Tamil Nadu", W/2 - 60, 248, 13, C.textSub, "Regular");
    drawStars(f, W/2 - 44, 272, 5);
    addText(f, "4.9 · 38 rentals", W/2, 272, 12, C.textSub, "Regular");
    addLine(f, 20, 310, W - 40);
    const info = [
      ["Member since", "March 2023"], ["Response time", "< 15 mins"],
      ["Languages", "Tamil, English"], ["Equipment", "2 listed"],
    ];
    info.forEach((row, i) => drawListRow(f, 326 + i * 44, row[0], row[1]));
    addRect(f, 20, 510, (W - 56) / 2, 50, C.greenLight, 12);
    addText(f, "💬 Message", 40, 522, 14, C.green, "SemiBold");
    addRect(f, 20 + (W - 56) / 2 + 16, 510, (W - 56) / 2, 50, C.bg, 12);
    addText(f, "📞 Call", 20 + (W - 56) / 2 + 52, 522, 14, C.textSub, "SemiBold");
    drawBottomNav(f);
  },

  // 21 Reviews
  21: (f) => {
    addRect(f, 0, 0, W, H, C.white);
    drawStatusBar(f);
    drawTopBar(f, "Reviews (38)");
    addText(f, "4.9", 30, 120, 40, C.text, "Bold");
    drawStars(f, 30, 170, 5);
    addText(f, "out of 5  ·  38 reviews", 30, 195, 12, C.textSub, "Regular");
    const reviews = [
      { name: "Kavitha S", stars: 5, comment: "Tractor was in great condition, delivered on time. Rajan is very responsive!" },
      { name: "Mani P", stars: 5, comment: "Excellent service. Saved a lot of money vs hiring locally." },
      { name: "Priya V", stars: 4, comment: "Good equipment but slight delay in pickup. Overall positive experience." },
    ];
    reviews.forEach((r, i) => {
      const cy = 230 + i * 140;
      addLine(f, 20, cy, W - 40);
      drawAvatar(f, 20, cy + 14, r.name.split(" ").map(w => w[0]).join(""));
      addText(f, r.name, 74, cy + 16, 14, C.text, "SemiBold");
      drawStars(f, 74, cy + 36, r.stars);
      addText(f, r.comment, 20, cy + 60, 13, C.textSub, "Regular", W - 40);
    });
    drawBottomNav(f);
  },

  // 22 Select Date
  22: (f) => {
    addRect(f, 0, 0, W, H, C.white);
    drawStatusBar(f);
    drawTopBar(f, "Select Date & Time");
    addText(f, "June 2025", W/2 - 36, 120, 16, C.text, "SemiBold");
    addText(f, "‹  ›", W - 72, 122, 16, C.green, "Regular");
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    days.forEach((d, i) => addText(f, d, 22 + i * 52, 156, 11, C.textSub, "Regular"));
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 7; col++) {
        const n = row * 7 + col + 1;
        if (n > 30) break;
        const cx = 22 + col * 52;
        const cy = 178 + row * 44;
        const isSelected = n === 18;
        if (isSelected) addRect(f, cx - 4, cy - 4, 36, 36, C.green, 18);
        addText(f, String(n), cx, cy + 4, 14, isSelected ? C.white : (n < 12 ? C.textSub : C.text), isSelected ? "SemiBold" : "Regular");
      }
    }
    addLine(f, 20, 416, W - 40);
    addText(f, "Select Time", 20, 436, 14, C.text, "SemiBold");
    const times = ["6:00 AM", "7:00 AM", "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM"];
    let tx = 20;
    times.forEach((t, i) => {
      const tw = t.length * 8 + 20;
      addRect(f, tx, 464, tw, 34, i === 2 ? C.green : C.bg, 8);
      addText(f, t, tx + 10, 472, 12, i === 2 ? C.white : C.textSub, i === 2 ? "SemiBold" : "Regular");
      tx += tw + 8;
    });
    drawGreenButton(f, 20, H - 130, W - 40, "Confirm Date & Time →");
    drawBottomNav(f);
  },

  // 23 Select Duration
  23: (f) => {
    addRect(f, 0, 0, W, H, C.white);
    drawStatusBar(f);
    drawTopBar(f, "Select Duration");
    ["Hourly", "Half Day (4 hrs)", "Full Day (8 hrs)", "Custom"].forEach((opt, i) => {
      const cy = 140 + i * 90;
      const active = i === 1;
      addRect(f, 20, cy, W - 40, 70, active ? C.greenLight : C.bg, 12);
      if (active) {
        const border2 = figma.createRectangle();
        border2.x = 20; border2.y = cy; border2.resize(W - 40, 70);
        border2.fills = [];
        border2.strokes = solid(C.green);
        border2.strokeWeight = 1.5;
        border2.cornerRadius = 12;
        f.appendChild(border2);
      }
      addText(f, opt, 40, cy + 14, 15, active ? C.green : C.text, active ? "SemiBold" : "Regular");
      const prices = ["₹600/hr", "₹2,200 flat", "₹4,000 flat", "Set hours"];
      addText(f, prices[i], 40, cy + 38, 13, active ? C.green : C.textSub, "Regular");
      if (active) addText(f, "✓", W - 50, cy + 24, 18, C.green, "Bold");
    });
    drawGreenButton(f, 20, H - 130, W - 40, "Next →");
    drawBottomNav(f);
  },

  // 24 Delivery Address
  24: (f) => {
    addRect(f, 0, 0, W, H, C.white);
    drawStatusBar(f);
    drawTopBar(f, "Delivery Location");
    addText(f, "Where should the equipment be delivered?", 20, 120, 13, C.textSub, "Regular", W - 40);
    addRect(f, 20, 158, W - 40, 160, C.greenLight, 12);
    addText(f, "📍 Use GPS Location", 30, 174, 14, C.green, "SemiBold");
    addText(f, "Karur Main Road, Near Bus Stand\nKarur - 639001, Tamil Nadu", 30, 200, 13, C.text, "Regular", W - 80);
    addText(f, "Use this location →", 30, 252, 13, C.green, "SemiBold");
    addText(f, "OR ENTER MANUALLY", W/2 - 66, 340, 10, C.textSub, "SemiBold");
    addText(f, "Street / Landmark", 20, 368, 12, C.textSub, "Regular");
    drawInputField(f, 20, 386, W - 40, "e.g. Near Water Tank");
    addText(f, "Village / Town", 20, 454, 12, C.textSub, "Regular");
    drawInputField(f, 20, 472, W - 40, "e.g. Kulithalai");
    addText(f, "Pincode", 20, 540, 12, C.textSub, "Regular");
    drawInputField(f, 20, 558, 160, "6 digit pincode");
    drawGreenButton(f, 20, H - 130, W - 40, "Confirm Location →");
    drawBottomNav(f);
  },

  // 25 Booking Summary
  25: (f) => {
    addRect(f, 0, 0, W, H, C.bg);
    drawStatusBar(f);
    drawTopBar(f, "Booking Summary");
    addRect(f, 20, 116, W - 40, 100, C.white, 14);
    addRect(f, 30, 126, 80, 80, C.greenLight, 10);
    addText(f, "🚜", 48, 144, 44, C.green, "Regular");
    addText(f, "Mahindra 575 DI", 124, 132, 15, C.text, "Bold");
    addText(f, "Rajan Kumar", 124, 154, 13, C.textSub, "Regular");
    drawStars(f, 124, 174, 5);
    addRect(f, 20, 236, W - 40, 230, C.white, 14);
    const rows = [
      ["Date", "Wed, 18 Jun 2025"], ["Time", "8:00 AM"],
      ["Duration", "Half day — 4 hrs"], ["Delivery to", "Karur, TN"],
    ];
    rows.forEach((r, i) => drawListRow(f, 256 + i * 46, r[0], r[1]));
    addRect(f, 20, 490, W - 40, 150, C.white, 14);
    addText(f, "PRICE BREAKDOWN", 34, 508, 10, C.textSub, "SemiBold");
    const costs = [["Equipment (4 hrs)", "₹2,200"], ["Delivery charge", "₹100"], ["Platform fee (5%)", "₹115"], ["Total", "₹2,415"]];
    costs.forEach((c, i) => {
      addText(f, c[0], 34, 530 + i * 24, 13, i === 3 ? C.text : C.textSub, i === 3 ? "SemiBold" : "Regular");
      addText(f, c[1], W - 80, 530 + i * 24, 13, i === 3 ? C.green : C.textSub, i === 3 ? "Bold" : "Regular");
    });
    drawGreenButton(f, 20, H - 130, W - 40, "Proceed to Pay ₹2,415 →");
    drawBottomNav(f);
  },

  // 26 Payment Method
  26: (f) => {
    addRect(f, 0, 0, W, H, C.white);
    drawStatusBar(f);
    drawTopBar(f, "Payment Method");
    addText(f, "Choose how to pay ₹2,415", 20, 120, 14, C.textSub, "Regular");
    const methods = [
      { icon: "📱", label: "UPI / GPay / PhonePe", sub: "Instant — recommended" },
      { icon: "💳", label: "Debit / Credit Card", sub: "Visa, Mastercard, RuPay" },
      { icon: "🏦", label: "Net Banking", sub: "All major banks" },
      { icon: "💵", label: "Pay on Delivery", sub: "Cash to owner at arrival" },
    ];
    methods.forEach((m, i) => {
      const cy = 154 + i * 88;
      addRect(f, 20, cy, W - 40, 74, i === 0 ? C.greenLight : C.bg, 12);
      if (i === 0) {
        const b = figma.createRectangle();
        b.x = 20; b.y = cy; b.resize(W - 40, 74);
        b.fills = []; b.strokes = solid(C.green); b.strokeWeight = 1; b.cornerRadius = 12;
        f.appendChild(b);
      }
      addText(f, m.icon, 36, cy + 18, 26, C.text, "Regular");
      addText(f, m.label, 74, cy + 14, 14, C.text, "SemiBold");
      addText(f, m.sub, 74, cy + 36, 12, C.textSub, "Regular");
      if (i === 0) addText(f, "●", W - 44, cy + 28, 18, C.green, "Regular");
    });
    drawGreenButton(f, 20, H - 130, W - 40, "Pay ₹2,415 →");
    drawBottomNav(f);
  },

  // 27 UPI Payment
  27: (f) => {
    addRect(f, 0, 0, W, H, C.white);
    drawStatusBar(f);
    drawTopBar(f, "Pay via UPI");
    addRect(f, W/2 - 60, 120, 120, 120, C.bg, 14);
    addText(f, "🔲", W/2 - 28, 140, 56, C.text, "Regular");
    addText(f, "Scan QR code or enter UPI ID", W/2 - 120, 260, 13, C.textSub, "Regular", 240);
    addText(f, "OR", W/2 - 14, 300, 14, C.textSub, "Regular");
    addText(f, "UPI ID / VPA", 20, 334, 12, C.textSub, "Regular");
    drawInputField(f, 20, 352, W - 40, "yourname@upi");
    addText(f, "Amount", 20, 422, 12, C.textSub, "Regular");
    drawInputField(f, 20, 440, W - 40, "₹2,415");
    addText(f, "🔒  Secured by NPCI · UPI", W/2 - 80, 516, 12, C.textSub, "Regular");
    drawGreenButton(f, 20, H - 130, W - 40, "Pay ₹2,415 →");
    drawBottomNav(f);
  },

  // 28 Booking Confirmed
  28: (f) => {
    addRect(f, 0, 0, W, H, C.white);
    drawStatusBar(f);
    addRect(f, W/2 - 52, 120, 104, 104, C.greenLight, 52);
    addText(f, "✓", W/2 - 22, 148, 48, C.green, "Bold");
    addText(f, "Booking Confirmed!", W/2 - 90, 248, 22, C.text, "Bold");
    addText(f, "Your tractor will arrive on\nWed 18 Jun at 8:00 AM", W/2 - 120, 284, 14, C.textSub, "Regular", 240);
    addText(f, "Booking ID: AGR-20250618-0042", W/2 - 110, 340, 13, C.textSub, "Regular");
    addLine(f, 20, 376, W - 40);
    addRect(f, 20, 396, W - 40, 110, C.bg, 14);
    addText(f, "Owner: Rajan Kumar", 36, 416, 14, C.text, "SemiBold");
    addText(f, "📞 +91 94XXX XXXXX", 36, 440, 13, C.textSub, "Regular");
    addText(f, "💬 Message owner", 36, 464, 13, C.green, "SemiBold");
    drawGreenButton(f, 20, H - 200, W - 40, "Track My Booking →");
    addText(f, "Add to Calendar", W/2 - 60, H - 136, 14, C.green, "SemiBold");
    drawBottomNav(f);
  },

  // 29 My Bookings Active
  29: (f) => {
    addRect(f, 0, 0, W, H, C.bg);
    drawGreenHeader(f, "My Bookings");
    let cx2 = 20;
    ["Active (2)", "Upcoming (1)", "Past"].forEach((t, i) => {
      const tw = t.length * 8 + 20;
      addRect(f, cx2, 152, tw, 32, i === 0 ? C.green : C.white, 8);
      addText(f, t, cx2 + 10, 159, 12, i === 0 ? C.white : C.textSub, i === 0 ? "SemiBold" : "Regular");
      cx2 += tw + 8;
    });
    const bookings2 = [
      { name: "Mahindra 575 DI", date: "Today · 8AM–12PM", status: "In Progress" },
      { name: "DJI Agras T10 Drone", date: "Today · 2PM–4PM", status: "Confirmed" },
    ];
    bookings2.forEach((b, i) => {
      const cy = 206 + i * 110;
      addRect(f, 20, cy, W - 40, 96, C.white, 14);
      addRect(f, 30, cy + 12, 66, 72, C.greenLight, 10);
      addText(f, i === 0 ? "🚜" : "🚁", 46, cy + 26, 36, C.green, "Regular");
      addText(f, b.name, 110, cy + 18, 14, C.text, "SemiBold");
      addText(f, b.date, 110, cy + 40, 12, C.textSub, "Regular");
      addRect(f, 110, cy + 62, b.status.length * 8 + 16, 22, b.status === "In Progress" ? C.green : C.greenLight, 6);
      addText(f, b.status, 118, cy + 67, 11, b.status === "In Progress" ? C.white : C.green, "SemiBold");
    });
    drawBottomNav(f);
  },

  // 30 Bookings Past
  30: (f) => {
    addRect(f, 0, 0, W, H, C.bg);
    drawGreenHeader(f, "My Bookings");
    let px = 20;
    ["Active (2)", "Upcoming (1)", "Past (7)"].forEach((t, i) => {
      const tw = t.length * 8 + 20;
      addRect(f, px, 152, tw, 32, i === 2 ? C.green : C.white, 8);
      addText(f, t, px + 10, 159, 12, i === 2 ? C.white : C.textSub, i === 2 ? "SemiBold" : "Regular");
      px += tw + 8;
    });
    const pasts = [
      { name: "Mahindra 575 DI", date: "10 Jun 2025", amount: "₹2,415" },
      { name: "Sprayer Set", date: "2 Jun 2025", amount: "₹800" },
      { name: "Rotavator", date: "25 May 2025", amount: "₹1,200" },
    ];
    pasts.forEach((b, i) => {
      const cy = 206 + i * 100;
      addRect(f, 20, cy, W - 40, 86, C.white, 12);
      addRect(f, 30, cy + 10, 60, 66, C.bg, 10);
      addText(f, "🚜", 44, cy + 22, 36, C.textSub, "Regular");
      addText(f, b.name, 104, cy + 16, 14, C.text, "SemiBold");
      addText(f, b.date, 104, cy + 38, 12, C.textSub, "Regular");
      addText(f, b.amount, W - 90, cy + 22, 14, C.green, "SemiBold");
      addText(f, "⭐ Rate", W - 70, cy + 50, 12, C.amber, "SemiBold");
    });
    drawBottomNav(f);
  },

  // 31 Booking Tracking
  31: (f) => {
    addRect(f, 0, 0, W, H, C.white);
    drawStatusBar(f);
    drawTopBar(f, "Track Booking #AGR-042");
    addRect(f, 0, 100, W, 220, { r: 0.8, g: 0.9, b: 0.8 });
    addText(f, "[ Live Map — Owner en route ]", 60, 190, 13, C.textSub, "Regular");
    addRect(f, W/2 - 44, 160, 88, 88, C.green, 44);
    addText(f, "🚜", W/2 - 22, 178, 44, C.white, "Regular");
    const steps = ["Booking confirmed", "Owner en route", "Arrived", "Work in progress", "Completed"];
    steps.forEach((s, i) => {
      const cy = 344 + i * 70;
      const done = i <= 1;
      addRect(f, 30, cy - 2, 24, 24, done ? C.green : C.bg, 12);
      if (done) addText(f, "✓", 36, cy, 14, C.white, "Bold");
      else addText(f, String(i + 1), 36, cy, 12, C.textSub, "Regular");
      if (i < 4) addRect(f, 41, cy + 22, 2, 40, done ? C.green : C.border, 1);
      addText(f, s, 66, cy, 14, done ? C.text : C.textSub, done ? "SemiBold" : "Regular");
    });
    drawBottomNav(f);
  },

  // 32 Cancel / Reschedule
  32: (f) => {
    addRect(f, 0, 0, W, H, C.white);
    drawStatusBar(f);
    drawTopBar(f, "Manage Booking");
    addRect(f, 20, 116, W - 40, 80, C.bg, 12);
    addText(f, "Mahindra 575 DI · 18 Jun, 8AM", 34, 130, 14, C.text, "SemiBold");
    addText(f, "Booking ID: AGR-20250618-0042", 34, 154, 12, C.textSub, "Regular");
    addText(f, "FREE CANCELLATION UNTIL", 20, 218, 10, C.textSub, "SemiBold");
    addText(f, "17 Jun 2025, 11:59 PM", 20, 236, 16, C.green, "Bold");
    addText(f, "After this, 50% cancellation fee applies", 20, 262, 12, C.textSub, "Regular");
    addLine(f, 20, 294, W - 40);
    addText(f, "RESCHEDULE", 20, 314, 10, C.textSub, "SemiBold");
    addText(f, "Pick a new date & time to reschedule\nat no extra charge", 20, 334, 13, C.textSub, "Regular", W - 40);
    addRect(f, 20, 380, W - 40, 50, C.greenLight, 12);
    addText(f, "📅  Reschedule Booking", 40, 394, 14, C.green, "SemiBold");
    addLine(f, 20, 450, W - 40);
    addText(f, "CANCEL BOOKING", 20, 470, 10, C.textSub, "SemiBold");
    addRect(f, 20, 496, W - 40, 50, { r: 0.988, g: 0.922, b: 0.922 }, 12);
    addText(f, "✕  Cancel Booking", 40, 510, 14, C.red, "SemiBold");
    drawBottomNav(f);
  },

  // 33 Owner Earnings
  33: (f) => {
    addRect(f, 0, 0, W, H, C.bg);
    drawGreenHeader(f, "Earnings Dashboard", "June 2025");
    const stats = [
      { val: "₹18,400", label: "This month" },
      { val: "23", label: "Bookings" },
      { val: "94%", label: "Utilization" },
    ];
    stats.forEach((s, i) => {
      const x = 20 + i * ((W - 56) / 3 + 8);
      addRect(f, x, 154, (W - 56) / 3, 72, C.white, 12);
      addText(f, s.val, x + 8, 166, 15, C.green, "Bold");
      addText(f, s.label, x + 8, 190, 10, C.textSub, "Regular");
    });
    addText(f, "MONTHLY EARNINGS TREND", 20, 252, 10, C.textSub, "SemiBold");
    addRect(f, 20, 272, W - 40, 130, C.white, 12);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    const vals = [0.5, 0.6, 0.7, 0.55, 0.85, 1.0];
    months.forEach((m, i) => {
      const bx = 36 + i * ((W - 72) / 6);
      const bh = vals[i] * 80;
      addRect(f, bx, 272 + 100 - bh, 28, bh, i === 5 ? C.green : C.greenLight, 4);
      addText(f, m, bx, 378, 10, C.textSub, "Regular");
    });
    addText(f, "RECENT PAYOUTS", 20, 430, 10, C.textSub, "SemiBold");
    const payouts = [["18 Jun 2025", "₹2,200"], ["16 Jun 2025", "₹4,000"], ["14 Jun 2025", "₹1,800"]];
    payouts.forEach((p, i) => {
      addRect(f, 20, 450 + i * 56, W - 40, 46, C.white, 10);
      addText(f, p[0], 34, 464 + i * 56, 13, C.text, "Regular");
      addText(f, p[1], W - 80, 464 + i * 56, 13, C.green, "SemiBold");
    });
    drawBottomNav(f);
  },

  // 34 List Equipment Step 1
  34: (f) => {
    addRect(f, 0, 0, W, H, C.white);
    drawStatusBar(f);
    drawTopBar(f, "List Equipment  1/4");
    addRect(f, 20, 112, (W - 60) / 4, 4, C.green, 2);
    addRect(f, 20 + (W - 60) / 4 + 6, 112, (W - 60) / 4 * 3 + 12, 4, C.bg, 2);
    addText(f, "Add Photos", 20, 134, 18, C.text, "Bold");
    addText(f, "Upload at least 3 clear photos of your equipment", 20, 162, 13, C.textSub, "Regular", W - 40);
    addRect(f, 20, 200, W - 40, 180, C.bg, 14);
    addText(f, "📷", W/2 - 20, 254, 44, C.textSub, "Regular");
    addText(f, "Tap to upload main photo", W/2 - 90, 314, 13, C.textSub, "Regular");
    for (let i = 0; i < 3; i++) {
      addRect(f, 20 + i * ((W - 56) / 3 + 8), 404, (W - 56) / 3, (W - 56) / 3, C.bg, 12);
      addText(f, "+", 20 + i * ((W - 56) / 3 + 8) + (W - 56) / 6 - 8, 404 + (W - 56) / 6 - 14, 28, C.textSub, "Regular");
    }
    addText(f, "Tips: Good lighting, show all sides, include implements", 20, 544, 12, C.textSub, "Regular", W - 40);
    drawGreenButton(f, 20, H - 130, W - 40, "Next →");
    drawBottomNav(f);
  },

  // 35 List Equipment Step 2
  35: (f) => {
    addRect(f, 0, 0, W, H, C.white);
    drawStatusBar(f);
    drawTopBar(f, "List Equipment  2/4");
    addRect(f, 20, 112, (W - 60) / 4 * 2 + 6, 4, C.green, 2);
    addRect(f, 20 + (W - 60) / 4 * 2 + 12, 112, (W - 60) / 4 * 2 + 6, 4, C.bg, 2);
    addText(f, "Equipment Details", 20, 134, 18, C.text, "Bold");
    const fields = ["Equipment Type", "Brand & Model", "Year of Purchase", "Horsepower / Capacity", "Attached Implements", "Condition"];
    fields.forEach((field, i) => {
      addText(f, field, 20, 176 + i * 72, 12, C.textSub, "Regular");
      drawInputField(f, 20, 194 + i * 72, W - 40, "Enter " + field.toLowerCase());
    });
    drawGreenButton(f, 20, H - 130, W - 40, "Next →");
  },

  // 36 List Equipment Step 3
  36: (f) => {
    addRect(f, 0, 0, W, H, C.white);
    drawStatusBar(f);
    drawTopBar(f, "List Equipment  3/4");
    addRect(f, 20, 112, (W - 60) / 4 * 3 + 12, 4, C.green, 2);
    addRect(f, 20 + (W - 60) / 4 * 3 + 18, 112, (W - 60) / 4, 4, C.bg, 2);
    addText(f, "Set Your Price", 20, 134, 18, C.text, "Bold");
    addText(f, "Hourly Rate (₹)", 20, 178, 12, C.textSub, "Regular");
    addRect(f, 20, 196, W - 40, 60, C.bg, 10);
    addText(f, "₹", 34, 214, 20, C.green, "SemiBold");
    addText(f, "600", 58, 214, 24, C.text, "Bold");
    addText(f, "/hr", 100, 222, 14, C.textSub, "Regular");
    addRect(f, 20, 276, W - 40, 120, C.greenLight, 12);
    addText(f, "💡 Price suggestions", 34, 292, 13, C.green, "SemiBold");
    addText(f, "Similar tractors in Karur:", 34, 314, 12, C.textSub, "Regular");
    addText(f, "₹480 – ₹750/hr  ·  Avg ₹590", 34, 334, 13, C.green, "SemiBold");
    addText(f, "Half Day Rate (₹)", 20, 420, 12, C.textSub, "Regular");
    drawInputField(f, 20, 438, W - 40, "₹2,200 (suggested)");
    addText(f, "Full Day Rate (₹)", 20, 508, 12, C.textSub, "Regular");
    drawInputField(f, 20, 526, W - 40, "₹4,000 (suggested)");
    drawGreenButton(f, 20, H - 130, W - 40, "Next →");
  },

  // 37 List Equipment Step 4
  37: (f) => {
    addRect(f, 0, 0, W, H, C.white);
    drawStatusBar(f);
    drawTopBar(f, "List Equipment  4/4");
    addRect(f, 20, 112, W - 40, 4, C.green, 2);
    addText(f, "Set Availability", 20, 134, 18, C.text, "Bold");
    addText(f, "When can others book your equipment?", 20, 162, 13, C.textSub, "Regular");
    addText(f, "AVAILABLE DAYS", 20, 204, 10, C.textSub, "SemiBold");
    const daysArr = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    daysArr.forEach((d, i) => {
      const active = i !== 6;
      addRect(f, 20 + i * 50, 224, 42, 42, active ? C.greenLight : C.bg, 8);
      addText(f, d, 22 + i * 50, 238, 11, active ? C.green : C.textSub, active ? "SemiBold" : "Regular");
    });
    addText(f, "AVAILABLE HOURS", 20, 288, 10, C.textSub, "SemiBold");
    addRect(f, 20, 308, W - 40, 60, C.bg, 10);
    addText(f, "From  6:00 AM", 34, 328, 14, C.text, "Regular");
    addText(f, "To  6:00 PM", W/2 + 20, 328, 14, C.text, "Regular");
    addText(f, "BLOCK OFF DATES (Optional)", 20, 392, 10, C.textSub, "SemiBold");
    addText(f, "e.g. your own farming schedule", 20, 412, 12, C.textSub, "Regular");
    addRect(f, 20, 432, W - 40, 50, C.bg, 10);
    addText(f, "+ Add blocked dates", 40, 446, 14, C.green, "SemiBold");
    drawGreenButton(f, 20, H - 130, W - 40, "Publish Listing 🎉");
    drawBottomNav(f);
  },

  // 38 Manage Listings
  38: (f) => {
    addRect(f, 0, 0, W, H, C.bg);
    drawGreenHeader(f, "My Listings");
    const listings = [
      { name: "Mahindra 575 DI", status: "Active", bookings: "23 bookings", earned: "₹18,400" },
      { name: "Rotavator 5-ft", status: "Paused", bookings: "8 bookings", earned: "₹6,200" },
    ];
    listings.forEach((l, i) => {
      const cy = 154 + i * 130;
      addRect(f, 20, cy, W - 40, 116, C.white, 14);
      addRect(f, 30, cy + 12, 70, 70, C.greenLight, 10);
      addText(f, "🚜", 46, cy + 22, 40, C.green, "Regular");
      addText(f, l.name, 114, cy + 16, 15, C.text, "SemiBold");
      addRect(f, 114, cy + 42, 60, 22, l.status === "Active" ? C.greenLight : C.bg, 6);
      addText(f, l.status, 122, cy + 47, 11, l.status === "Active" ? C.green : C.textSub, "SemiBold");
      addText(f, l.bookings + " · " + l.earned, 114, cy + 76, 12, C.textSub, "Regular");
      addText(f, "Edit  Pause  Delete", W - 130, cy + 48, 12, C.green, "SemiBold");
    });
    addRect(f, 20, 434, W - 40, 54, C.greenLight, 14);
    addText(f, "+  List another equipment", 70, 450, 15, C.green, "SemiBold");
    drawBottomNav(f);
  },

  // 39 Incoming Request
  39: (f) => {
    addRect(f, 0, 0, W, H, C.white);
    addRect(f, 0, 0, W, 100, C.red);
    drawStatusBar(f);
    addText(f, "🔔 New Booking Request!", 20, 58, 16, C.white, "Bold");
    addText(f, "Respond within 30 minutes", 20, 80, 12, { r: 1, g: 0.85, b: 0.85 }, "Regular");
    addRect(f, 20, 116, W - 40, 160, C.bg, 14);
    drawAvatar(f, 34, 130, "KS");
    addText(f, "Kavitha Selvi", 90, 132, 15, C.text, "Bold");
    addText(f, "Karur · ★★★★☆ · 4 past bookings", 90, 154, 12, C.textSub, "Regular");
    addLine(f, 34, 186, W - 68);
    const details = [["Equipment", "Mahindra 575 DI"], ["Date", "20 Jun 2025"], ["Time", "7:00 AM – 1:00 PM"], ["Duration", "6 hours  ·  ₹3,600"]];
    details.forEach((d, i) => addText(f, d[0] + ":  " + d[1], 34, 200 + i * 24, 13, C.text, "Regular"));
    addText(f, "Message from farmer:", 20, 310, 12, C.textSub, "Regular");
    addRect(f, 20, 330, W - 40, 60, C.bg, 10);
    addText(f, '"Need for paddy field ploughing. 3 acres."', 34, 346, 13, C.text, "Regular", W - 80);
    addRect(f, 20, H - 180, (W - 56) / 2, 52, C.green, 12);
    addText(f, "✓  Accept", 32, H - 162, 15, C.white, "SemiBold");
    addRect(f, 20 + (W - 56) / 2 + 16, H - 180, (W - 56) / 2, 52, { r: 0.988, g: 0.922, b: 0.922 }, 12);
    addText(f, "✕  Decline", W/2 + 30, H - 162, 15, C.red, "SemiBold");
    addText(f, "💬 Message Farmer", W/2 - 62, H - 110, 14, C.green, "SemiBold");
    drawBottomNav(f);
  },

  // 40 Chat Inbox
  40: (f) => {
    addRect(f, 0, 0, W, H, C.bg);
    drawGreenHeader(f, "Messages");
    const chats = [
      { name: "Rajan Kumar", msg: "Your tractor will be there by 7:45 AM", time: "9:22 AM", unread: 2 },
      { name: "Kavitha Selvi", msg: "Is the drone available on Sunday?", time: "Yesterday", unread: 0 },
      { name: "Mani Senthil", msg: "Payment confirmed ✓", time: "Mon", unread: 0 },
    ];
    chats.forEach((c, i) => {
      const cy = 152 + i * 90;
      addRect(f, 0, cy, W, 82, C.white);
      addLine(f, 70, cy + 78, W - 20);
      drawAvatar(f, 14, cy + 18, c.name.split(" ").map(w => w[0]).join(""));
      addText(f, c.name, 70, cy + 16, 15, C.text, "SemiBold");
      addText(f, c.msg, 70, cy + 38, 12, C.textSub, "Regular", W - 130);
      addText(f, c.time, W - 60, cy + 16, 11, C.textSub, "Regular");
      if (c.unread > 0) {
        addRect(f, W - 36, cy + 42, 22, 22, C.green, 11);
        addText(f, String(c.unread), W - 30, cy + 48, 11, C.white, "Bold");
      }
    });
    drawBottomNav(f);
  },

  // 41 Chat Thread
  41: (f) => {
    addRect(f, 0, 0, W, H, C.bg);
    drawStatusBar(f);
    addRect(f, 0, 44, W, 56, C.white);
    addLine(f, 0, 100, W);
    addText(f, "‹", 10, 55, 26, C.green, "Regular");
    drawAvatar(f, 44, 52, "RK", 40);
    addText(f, "Rajan Kumar", 94, 56, 15, C.text, "SemiBold");
    addText(f, "🟢 Online", 94, 75, 11, C.green, "Regular");
    addText(f, "📞", W - 40, 62, 20, C.green, "Regular");
    const messages = [
      { text: "Hi! I booked your Mahindra tractor for tomorrow 8AM.", me: false },
      { text: "Yes I confirmed the booking. I'll be there by 7:45 AM.", me: true },
      { text: "Great! My field is near Karur bus stand.", me: false },
      { text: "Ok noted. I'll bring the rotavator attachment too.", me: true },
    ];
    messages.forEach((m, i) => {
      const cy = 120 + i * 90;
      const bw = Math.min(m.text.length * 7.5, W - 100);
      if (m.me) {
        addRect(f, W - bw - 24, cy, bw + 20, 64, C.green, 12);
        addText(f, m.text, W - bw - 14, cy + 12, 13, C.white, "Regular", bw);
      } else {
        addRect(f, 14, cy, bw + 20, 64, C.white, 12);
        addText(f, m.text, 24, cy + 12, 13, C.text, "Regular", bw);
      }
    });
    addRect(f, 0, H - 82 - 60, W, 60, C.white);
    addLine(f, 0, H - 82 - 60, W);
    addRect(f, 14, H - 122, W - 80, 40, C.bg, 20);
    addText(f, "Type a message…", 30, H - 110, 14, C.textSub, "Regular");
    addRect(f, W - 52, H - 122, 40, 40, C.green, 20);
    addText(f, "↑", W - 38, H - 110, 18, C.white, "Bold");
    drawBottomNav(f);
  },

  // 42 In-App Call
  42: (f) => {
    addRect(f, 0, 0, W, H, C.greenDark);
    drawStatusBar(f);
    addText(f, "Calling…", W/2 - 40, 100, 18, C.greenLight, "Regular");
    addRect(f, W/2 - 56, 160, 112, 112, C.green, 56);
    addText(f, "RK", W/2 - 20, 200, 32, C.white, "Bold");
    addText(f, "Rajan Kumar", W/2 - 54, 295, 20, C.white, "SemiBold");
    addText(f, "+91 94XXX XXXXX", W/2 - 66, 326, 14, C.greenLight, "Regular");
    addText(f, "0:24", W/2 - 20, 380, 22, C.greenLight, "Regular");
    const actions = ["🔇 Mute", "🔊 Speaker", "⌨ Keypad"];
    actions.forEach((a, i) => {
      const ax = 40 + i * 120;
      addRect(f, ax, 480, 90, 70, { r: 0.059, g: 0.431, b: 0.333 }, 14);
      addText(f, a, ax + 12, 508, 13, C.greenLight, "Regular");
    });
    addRect(f, W/2 - 40, H - 160, 80, 80, C.red, 40);
    addText(f, "📵", W/2 - 20, H - 144, 36, C.white, "Regular");
    addText(f, "End Call", W/2 - 28, H - 68, 14, C.greenLight, "Regular");
  },

  // 43 Leave Review
  43: (f) => {
    addRect(f, 0, 0, W, H, C.white);
    drawStatusBar(f);
    drawTopBar(f, "Leave a Review");
    addRect(f, 20, 116, W - 40, 90, C.bg, 14);
    addRect(f, 30, 128, 66, 66, C.greenLight, 10);
    addText(f, "🚜", 44, 140, 36, C.green, "Regular");
    addText(f, "Mahindra 575 DI", 110, 134, 14, C.text, "SemiBold");
    addText(f, "Rajan Kumar · 18 Jun 2025", 110, 158, 12, C.textSub, "Regular");
    addText(f, "Overall Rating", W/2 - 52, 230, 14, C.text, "SemiBold");
    addText(f, "★  ★  ★  ★  ★", W/2 - 70, 256, 32, C.amber, "Regular");
    addLine(f, 20, 310, W - 40);
    const aspects = ["Equipment condition", "Punctuality", "Owner helpfulness"];
    aspects.forEach((a, i) => {
      addText(f, a, 20, 330 + i * 56, 13, C.textSub, "Regular");
      addText(f, "★★★★★", W - 90, 330 + i * 56, 14, C.amber, "Regular");
      if (i < 2) addLine(f, 20, 356 + i * 56, W - 40);
    });
    addText(f, "Write a review (optional)", 20, 510, 12, C.textSub, "Regular");
    addRect(f, 20, 530, W - 40, 100, C.bg, 10);
    addText(f, "Great experience! Tractor was in perfect condition…", 34, 548, 13, C.textSub, "Regular", W - 80);
    drawGreenButton(f, 20, H - 130, W - 40, "Submit Review →");
    drawBottomNav(f);
  },

  // 44 Report Damage
  44: (f) => {
    addRect(f, 0, 0, W, H, C.white);
    drawStatusBar(f);
    drawTopBar(f, "Report Issue");
    addRect(f, 20, 116, W - 40, 56, { r: 0.988, g: 0.922, b: 0.922 }, 12);
    addText(f, "⚠️  Report a damage or dispute", 34, 130, 14, C.red, "SemiBold");
    addText(f, "We'll resolve within 24 hrs", 34, 152, 12, { r: 0.64, g: 0.18, b: 0.18 }, "Regular");
    addText(f, "Issue Type", 20, 196, 12, C.textSub, "Regular");
    let rx = 20;
    ["Damage", "Late Return", "No Show", "Other"].forEach((opt, i) => {
      const rw = opt.length * 9 + 20;
      addRect(f, rx, 214, rw, 32, i === 0 ? C.red : C.bg, 8);
      addText(f, opt, rx + 10, 222, 12, i === 0 ? C.white : C.textSub, i === 0 ? "SemiBold" : "Regular");
      rx += rw + 8;
    });
    addText(f, "Description", 20, 270, 12, C.textSub, "Regular");
    addRect(f, 20, 288, W - 40, 120, C.bg, 10);
    addText(f, "Describe the issue in detail…", 34, 308, 13, C.textSub, "Regular", W - 80);
    addText(f, "Upload Photos (optional)", 20, 432, 12, C.textSub, "Regular");
    for (let i = 0; i < 3; i++) {
      addRect(f, 20 + i * 112, 450, 100, 80, C.bg, 10);
      addText(f, "+  Photo", 20 + i * 112 + 22, 480, 13, C.textSub, "Regular");
    }
    addRect(f, 20, H - 130, W - 40, 52, C.red, 12);
    addText(f, "Submit Report", 20 + (W - 40) / 2 - 52, H - 112, 15, C.white, "SemiBold");
    drawBottomNav(f);
  },

  // 45 Insurance Info
  45: (f) => {
    addRect(f, 0, 0, W, H, C.white);
    drawStatusBar(f);
    drawTopBar(f, "Booking Insurance");
    addRect(f, 20, 116, W - 40, 80, C.greenLight, 14);
    addText(f, "🛡️ Every booking is covered", 34, 132, 15, C.green, "SemiBold");
    addText(f, "AgriRent auto-adds micro-insurance via Bajaj Allianz\nfor every transaction.", 34, 156, 12, C.greenDark, "Regular", W - 80);
    const features = [
      ["Equipment Damage", "Up to ₹50,000 per booking"],
      ["Accident Cover", "For operators during rental"],
      ["Third-party liability", "In case of field damage"],
      ["Claim process", "< 48 hrs online claim"],
    ];
    features.forEach((f2, i) => {
      addLine(f, 20, 220 + i * 70, W - 40);
      addText(f, "✓ " + f2[0], 20, 236 + i * 70, 14, C.text, "SemiBold");
      addText(f, f2[1], 20, 258 + i * 70, 12, C.textSub, "Regular");
    });
    addText(f, "Insurance premium: ₹20–₹80 per booking (auto-added at checkout)", 20, 510, 12, C.textSub, "Regular", W - 40);
    drawGreenButton(f, 20, H - 130, W - 40, "Got it →");
    drawBottomNav(f);
  },

  // 46 My Profile
  46: (f) => {
    addRect(f, 0, 0, W, H, C.bg);
    drawGreenHeader(f, "My Profile");
    drawAvatar(f, W/2 - 44, 158, "RK", 88);
    addText(f, "Rajan Kumar", W/2 - 50, 258, 18, C.text, "Bold");
    addText(f, "Karur, Tamil Nadu  ·  Member since 2023", W/2 - 110, 284, 12, C.textSub, "Regular", 220);
    drawStars(f, W/2 - 40, 310, 5);
    addText(f, "4.9  ·  38 rentals", W/2 + 6, 311, 11, C.textSub, "Regular");
    const rows = [
      ["My Equipment", "2 active listings"],
      ["Payment Methods", "UPI linked"],
      ["My Bookings", "View all"],
      ["Referral Code", "AGR-RAJAN20"],
    ];
    addRect(f, 20, 348, W - 40, rows.length * 56 + 10, C.white, 14);
    rows.forEach((row, i) => {
      addText(f, row[0], 34, 368 + i * 56, 14, C.text, "Regular");
      addText(f, row[1], W - 34 - row[1].length * 7.5, 368 + i * 56, 13, C.textSub, "Regular");
      addText(f, "›", W - 26, 368 + i * 56, 18, C.textSub, "Regular");
      if (i < rows.length - 1) addLine(f, 34, 396 + i * 56, W - 68);
    });
    drawBottomNav(f);
  },

  // 47 Edit Profile
  47: (f) => {
    addRect(f, 0, 0, W, H, C.white);
    drawStatusBar(f);
    drawTopBar(f, "Edit Profile");
    drawAvatar(f, W/2 - 44, 110, "RK", 88);
    addRect(f, W/2 + 16, 168, 32, 32, C.green, 16);
    addText(f, "✏", W/2 + 21, 177, 14, C.white, "Regular");
    const fields2 = [["Full Name", "Rajan Kumar"], ["Phone", "+91 94XXX XXXXX"], ["Village / Town", "Karur, Tamil Nadu"], ["Language", "Tamil"]];
    fields2.forEach((fd, i) => {
      addText(f, fd[0], 20, 228 + i * 78, 12, C.textSub, "Regular");
      addRect(f, 20, 246 + i * 78, W - 40, 48, C.bg, 10);
      addText(f, fd[1], 34, 260 + i * 78, 14, C.text, "Regular");
    });
    drawGreenButton(f, 20, H - 130, W - 40, "Save Changes →");
    drawBottomNav(f);
  },

  // 48 Notifications
  48: (f) => {
    addRect(f, 0, 0, W, H, C.bg);
    drawGreenHeader(f, "Notifications");
    const notifs = [
      { icon: "✓", label: "Booking confirmed", sub: "Mahindra 575 DI · 18 Jun", color: C.green, bg: C.greenLight },
      { icon: "💬", label: "New message from Kavitha", sub: "Is drone available Sunday?", color: C.green, bg: C.greenLight },
      { icon: "💰", label: "Payout received", sub: "₹2,200 credited to your UPI", color: C.green, bg: C.greenLight },
      { icon: "⭐", label: "New review received", sub: "Kavitha rated you 5 stars!", color: C.amber, bg: { r: 0.98, g: 0.95, b: 0.85 } },
      { icon: "⚠", label: "Booking cancellation", sub: "Mani cancelled his booking", color: C.red, bg: { r: 0.988, g: 0.922, b: 0.922 } },
    ];
    notifs.forEach((n, i) => {
      const cy = 152 + i * 86;
      addRect(f, 20, cy, W - 40, 74, C.white, 12);
      addRect(f, 30, cy + 16, 40, 40, n.bg, 20);
      addText(f, n.icon, 40, cy + 24, 20, n.color, "Regular");
      addText(f, n.label, 82, cy + 18, 14, C.text, "SemiBold");
      addText(f, n.sub, 82, cy + 40, 12, C.textSub, "Regular");
    });
    drawBottomNav(f);
  },

  // 49 Settings
  49: (f) => {
    addRect(f, 0, 0, W, H, C.bg);
    drawGreenHeader(f, "Settings");
    const groups = [
      { title: "Account", items: ["Edit Profile", "Change Phone Number", "Linked UPI / Bank"] },
      { title: "Preferences", items: ["Language", "Notifications", "Location Permissions"] },
      { title: "Support", items: ["Help & FAQ", "Contact Support", "Rate the App"] },
      { title: "Danger Zone", items: ["Delete Account"] },
    ];
    let gy = 152;
    groups.forEach(g => {
      addText(f, g.title.toUpperCase(), 20, gy, 10, C.textSub, "SemiBold");
      gy += 18;
      addRect(f, 20, gy, W - 40, g.items.length * 50, C.white, 14);
      g.items.forEach((item, j) => {
        const isRed = item === "Delete Account";
        addText(f, item, 34, gy + 16 + j * 50, 14, isRed ? C.red : C.text, "Regular");
        addText(f, "›", W - 36, gy + 16 + j * 50, 18, C.textSub, "Regular");
        if (j < g.items.length - 1) addLine(f, 34, gy + 46 + j * 50, W - 68);
      });
      gy += g.items.length * 50 + 16;
    });
    drawBottomNav(f);
  },

  // 50 Empty State
  50: (f) => {
    addRect(f, 0, 0, W, H, C.white);
    drawStatusBar(f);
    drawTopBar(f, "Tractors near you");
    addText(f, "🔍", W/2 - 24, 220, 48, C.textSub, "Regular");
    addText(f, "No equipment found", W/2 - 82, 290, 18, C.text, "SemiBold");
    addText(f, "Try expanding your search area or\nchecking nearby districts", W/2 - 120, 326, 14, C.textSub, "Regular", 240);
    addRect(f, 60, 410, W - 120, 50, C.greenLight, 12);
    addText(f, "🗺  Expand search to 25 km", 90, 425, 14, C.green, "SemiBold");
    addRect(f, 60, 480, W - 120, 50, C.bg, 12);
    addText(f, "🔔  Notify me when available", 86, 495, 14, C.text, "Regular");
    drawBottomNav(f);
  },
};

// ── Main ──────────────────────────────────────────────────

figma.ui.onmessage = async (msg) => {
  if (msg.type !== "generate") return;

  await figma.loadFontAsync({ family: "Inter", style: "Regular" });
  await figma.loadFontAsync({ family: "Inter", style: "SemiBold" });
  await figma.loadFontAsync({ family: "Inter", style: "Bold" });

  const page = figma.currentPage;

  // ── Section label nodes ──
  const sectionColors = {
    "Onboarding": C.green,
    "Auth":       C.greenDark,
    "Home":       { r: 0.137, g: 0.420, b: 0.882 },
    "Equipment":  { r: 0.573, g: 0.216, b: 0.827 },
    "Booking":    { r: 0.937, g: 0.624, b: 0.153 },
    "My Bookings":{ r: 0.886, g: 0.294, b: 0.290 },
    "Owner":      { r: 0.059, g: 0.431, b: 0.333 },
    "Messaging":  { r: 0.114, g: 0.580, b: 0.700 },
    "Trust":      { r: 0.737, g: 0.463, b: 0.133 },
    "Profile":    { r: 0.467, g: 0.467, b: 0.455 },
    "Misc":       { r: 0.467, g: 0.467, b: 0.455 },
  };

  let drawnSections = {};

  for (let i = 0; i < SCREENS.length; i++) {
    const screen = SCREENS[i];
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    const x = col * (W + GAP);
    const y = row * (H + ROW_GAP);

    // Section label
    if (!drawnSections[screen.section]) {
      const sectionRows = {};
      SCREENS.forEach((s, idx) => {
        const r2 = Math.floor(idx / COLS);
        if (!sectionRows[s.section] || r2 < sectionRows[s.section]) {
          sectionRows[s.section] = r2;
        }
      });
      drawnSections[screen.section] = true;
    }

    // Create frame
    const frame = figma.createFrame();
    frame.name = screen.name;
    frame.resize(W, H);
    frame.x = x;
    frame.y = y;
    frame.fills = solid(C.white);
    frame.clipsContent = true;
    page.appendChild(frame);

    // Run screen builder
    const builder = screenBuilders[screen.id];
    if (builder) {
      try {
        builder(frame);
      } catch (e) {
        // Fallback: render a minimal placeholder if a builder throws
        addRect(frame, 0, 0, W, H, C.bg);
        drawGreenHeader(frame, screen.name.replace(/^\d+\s·\s/, ""));
        addText(frame, screen.name, 20, H/2, 14, C.textSub, "Regular", W - 40);
      }
    }

    // Screen name label below frame
    const label = figma.createText();
    label.fontName = { family: "Inter", style: "Regular" };
    label.characters = screen.name;
    label.fontSize = 13;
    label.fills = solid(C.textSub);
    label.x = x;
    label.y = y + H + 12;
    page.appendChild(label);

    figma.ui.postMessage({ type: "progress", current: i + 1, total: SCREENS.length, name: screen.name });
  }

  // Zoom to fit all screens
  figma.viewport.scrollAndZoomIntoView(page.children);
  figma.ui.postMessage({ type: "done" });
};
