// ---------------------------
// Hangul decomposition maps
// ---------------------------

// Initials (19, Unicode order)
const initialMap = [
  { j: "ㄱ", r: "g" },
  { j: "ㄲ", r: "kk" },
  { j: "ㄴ", r: "n" },
  { j: "ㄷ", r: "d" },
  { j: "ㄸ", r: "tt" },
  { j: "ㄹ", r: "r/l" },
  { j: "ㅁ", r: "m" },
  { j: "ㅂ", r: "b" },
  { j: "ㅃ", r: "pp" },
  { j: "ㅅ", r: "s" },
  { j: "ㅆ", r: "ss" },
  { j: "ㅇ", r: "(silent)" },
  { j: "ㅈ", r: "j" },
  { j: "ㅉ", r: "jj" },
  { j: "ㅊ", r: "ch" },
  { j: "ㅋ", r: "k" },
  { j: "ㅌ", r: "t" },
  { j: "ㅍ", r: "p" },
  { j: "ㅎ", r: "h" },
];

// Vowels (21, Unicode order)
const vowelMap = [
  { j: "ㅏ", r: "a" },
  { j: "ㅐ", r: "ae" },
  { j: "ㅑ", r: "ya" },
  { j: "ㅒ", r: "yae" },
  { j: "ㅓ", r: "eo" },
  { j: "ㅔ", r: "e" },
  { j: "ㅕ", r: "yeo" },
  { j: "ㅖ", r: "ye" },
  { j: "ㅗ", r: "o" },
  { j: "ㅘ", r: "wa" },
  { j: "ㅙ", r: "wae" },
  { j: "ㅚ", r: "oe" },
  { j: "ㅛ", r: "yo" },
  { j: "ㅜ", r: "u" },
  { j: "ㅝ", r: "wo" },
  { j: "ㅞ", r: "we" },
  { j: "ㅟ", r: "wi" },
  { j: "ㅠ", r: "yu" },
  { j: "ㅡ", r: "eu" },
  { j: "ㅢ", r: "ui" },
  { j: "ㅣ", r: "i" },
];

// Finals (28, first = no final)
const finalMap = [
  { j: "", r: "" },
  { j: "ㄱ", r: "k" },
  { j: "ㄲ", r: "kk" },
  { j: "ㄳ", r: "ks" },
  { j: "ㄴ", r: "n" },
  { j: "ㄵ", r: "nj" },
  { j: "ㄶ", r: "nh" },
  { j: "ㄷ", r: "t" },
  { j: "ㄹ", r: "l" },
  { j: "ㄺ", r: "lk" },
  { j: "ㄻ", r: "lm" },
  { j: "ㄼ", r: "lb" },
  { j: "ㄽ", r: "ls" },
  { j: "ㄾ", r: "lt" },
  { j: "ㄿ", r: "lp" },
  { j: "ㅀ", r: "lh" },
  { j: "ㅁ", r: "m" },
  { j: "ㅂ", r: "p" },
  { j: "ㅄ", r: "ps" },
  { j: "ㅅ", r: "s" },
  { j: "ㅆ", r: "ss" },
  { j: "ㅇ", r: "ng" },
  { j: "ㅈ", r: "j" },
  { j: "ㅊ", r: "ch" },
  { j: "ㅋ", r: "k" },
  { j: "ㅌ", r: "t" },
  { j: "ㅍ", r: "p" },
  { j: "ㅎ", r: "h" },
];

// ---------------------------
// Decompose Hangul syllable
// ---------------------------
function decomposeHangul(char) {
  const code = char.charCodeAt(0);
  if (code < 0xac00 || code > 0xd7a3) return null;

  const sIndex = code - 0xac00;
  const i = Math.floor(sIndex / (21 * 28));
  const v = Math.floor((sIndex % (21 * 28)) / 28);
  const f = sIndex % 28;

  const initial = initialMap[i] || { j: "?", r: "?" };
  const vowel = vowelMap[v] || { j: "?", r: "?" };
  const final = finalMap[f] || { j: "", r: "" };

  return {
    initial,
    vowel,
    final,
    romanization: initial.r + vowel.r + final.r,
  };
}

// ---------------------------
// Tooltip setup
// ---------------------------
const tooltip = document.createElement("div");
tooltip.style.position = "absolute";
tooltip.style.backgroundColor = "#222";
tooltip.style.color = "#fff";
tooltip.style.padding = "6px 10px";
tooltip.style.borderRadius = "4px";
tooltip.style.fontSize = "14px";
tooltip.style.pointerEvents = "none";
tooltip.style.zIndex = "9999";
tooltip.style.whiteSpace = "pre";
tooltip.style.display = "none";
document.body.appendChild(tooltip);

function isHangul(char) {
  return char >= "\uAC00" && char <= "\uD7A3";
}

// ---------------------------
// Get character under cursor
// ---------------------------
function getCharUnderCursor(x, y) {
  var range = null;

  // Modern API (Firefox)
  if (document.caretPositionFromPoint) {
    var pos = document.caretPositionFromPoint(x, y);
    if (!pos) return null;
    range = document.createRange();
    range.setStart(pos.offsetNode, pos.offset);
    range.setEnd(pos.offsetNode, pos.offset + 1);
  }
  // Deprecated fallback (Chrome)
  else if (document.caretRangeFromPoint) {
    range = document.caretRangeFromPoint(x, y);
  }

  if (!range || !range.startContainer || range.startContainer.nodeType !== 3)
    return null;

  var text = range.startContainer.textContent;
  if (!text) return null;

  var codePoint = text.codePointAt(range.startOffset);
  if (codePoint === undefined) return null;

  return String.fromCodePoint(codePoint);
}

// ---------------------------
// Mousemove event
// ---------------------------
document.body.addEventListener("mousemove", (e) => {
  const char = getCharUnderCursor(e.clientX, e.clientY);

  if (!char || !isHangul(char)) {
    tooltip.style.display = "none";
    return;
  }

  const parts = decomposeHangul(char);
  if (!parts) {
    tooltip.style.display = "none";
    return;
  }

  // Build tooltip text
  let text = `Char: ${char}\nInitial: ${parts.initial.j} → ${parts.initial.r}\nVowel: ${parts.vowel.j} → ${parts.vowel.r}`;
  if (parts.final.j) {
    text += `\nFinal: ${parts.final.j} → ${parts.final.r}`;
  }

  // Compute pronunciation without silent initial
  const pronunciation =
    (parts.initial.r === "(silent)" ? "" : parts.initial.r) +
    parts.vowel.r +
    (parts.final.j ? parts.final.r : "");

  text += `\nPronunciation: ${pronunciation}`;

  tooltip.innerText = text;

  // Clamp tooltip position to viewport
  tooltip.style.left =
    Math.min(e.pageX + 10, window.scrollX + window.innerWidth - 200) + "px";
  tooltip.style.top =
    Math.min(e.pageY + 10, window.scrollY + window.innerHeight - 100) + "px";

  tooltip.style.display = "block";
});
