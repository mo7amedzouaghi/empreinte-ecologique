// Projet البصمة البيئية – Lycée Oued Ellil
(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);

  // ---------- Stockage local (sans erreur si indisponible) ----------
  const store = {
    get(k, d) {
      try {
        const v = localStorage.getItem(k);
        return v ? JSON.parse(v) : d;
      } catch (e) {
        return d;
      }
    },
    set(k, v) {
      try {
        localStorage.setItem(k, JSON.stringify(v));
      } catch (e) { /* stockage indisponible : on continue sans sauvegarde */ }
    }
  };

  // ---------- Langue ----------
  let lang = store.get("lang", null) || (navigator.language || "fr").slice(0, 2);
  if (!I18N[lang]) lang = "fr";
  const LOCALES = { fr: "fr-FR", ar: "ar-TN-u-nu-latn", en: "en-GB" };
  const T = (k) => (I18N[lang][k] !== undefined ? I18N[lang][k] : I18N.fr[k] !== undefined ? I18N.fr[k] : k);
  const fill = (s, o) => s.replace(/\{(\w+)\}/g, (m, k) => o[k]);
  const fmt = (n) => Math.round(n).toLocaleString(LOCALES[lang]);

  // ---------- Facteurs d'émission (kg CO2e) ----------
  const F = { elec: 0.47, water: 0.3, sheet: 0.005, sortWaste: 0.3, rawWaste: 0.5, weeks: 30 };
  const CATS = ["transport", "energy", "water", "paper", "waste", "food"];
  const COLORS = ["#2563eb", "#f59e0b", "#06b6d4", "#a16207", "#7c3aed", "#16a34a"];
  const TREE_KG = 25;

  // ---------- Calculateur ----------
  const num = (id) => Math.max(0, parseFloat($(id).value) || 0);

  function compute() {
    const transport = 2 * num("distance") * num("days") * F.weeks * parseFloat($("mode").value);
    const energy = num("elec") * 12 * F.elec;
    const water = num("water") * 12 * F.water;
    const paper = num("paper") * F.weeks * F.sheet;
    const waste = num("waste") * 52 * ($("sort").checked ? F.sortWaste : F.rawWaste);
    const food = parseFloat($("food").value);
    const vals = [transport, energy, water, paper, waste, food];
    return { vals, total: vals.reduce((a, b) => a + b, 0) };
  }

  function renderCalc() {
    $("distanceVal").textContent = $("distance").value;
    $("daysVal").textContent = $("days").value;
    const { vals, total } = compute();
    $("totalVal").textContent = fmt(total);

    // Anneau (donut) en SVG
    const R = 46, C = 2 * Math.PI * R;
    let svg = '<circle cx="60" cy="60" r="' + R + '" fill="none" stroke="var(--line)" stroke-width="16"/>';
    let offset = 0;
    if (total > 0) {
      vals.forEach((v, i) => {
        const len = (v / total) * C;
        if (len > 0.5) {
          svg += '<circle cx="60" cy="60" r="' + R + '" fill="none" stroke="' + COLORS[i] + '" stroke-width="16" ' +
            'stroke-dasharray="' + len + " " + (C - len) + '" stroke-dashoffset="' + -offset + '"/>';
        }
        offset += len;
      });
    }
    $("donut").innerHTML = svg;

    // Niveau
    const badge = $("levelBadge");
    let level = "low";
    if (total > 2660) level = "high";
    else if (total > 1330) level = "mid";
    badge.className = "badge " + level;
    badge.textContent = T("level." + level);

    // Légende avec barres
    let top = 0;
    $("legend").innerHTML = vals.map((v, i) => {
      if (v > vals[top]) top = i;
      const pct = total > 0 ? (v / total) * 100 : 0;
      return '<li><i style="background:' + COLORS[i] + '"></i><span>' + T("cat." + CATS[i]) + "</span><b>" +
        fmt(v) + " kg · " + Math.round(pct) + " %</b>" +
        '<div class="bar"><div style="width:' + pct + "%;background:" + COLORS[i] + '"></div></div></li>';
    }).join("");

    $("treesText").textContent = fill(T("calc.trees"), { n: fmt(Math.ceil(total / TREE_KG)) });
    $("topText").textContent = fill(T("calc.top"), { c: T("cat." + CATS[top]), t: T("tip." + CATS[top]) });
    return total;
  }

  function renderHistory() {
    const hist = store.get("hist", []);
    $("history").innerHTML = hist.length
      ? hist.slice(-6).reverse().map((h) =>
        "<li><span>" + new Date(h.d).toLocaleDateString(LOCALES[lang]) + "</span><b>" + fmt(h.t) + " kg CO2e</b></li>").join("")
      : '<li class="muted">' + T("calc.nohist") + "</li>";
  }

  // ---------- Suivi du lycée ----------
  const MONTHS = 9;
  let track = store.get("track", null);
  if (!Array.isArray(track) || track.length !== MONTHS) track = Array.from({ length: MONTHS }, () => ["", "", ""]);

  const rowCO2 = (r) => {
    if (r[0] === "" && r[1] === "" && r[2] === "") return null;
    return (parseFloat(r[0]) || 0) * F.elec + (parseFloat(r[1]) || 0) * F.water + (parseFloat(r[2]) || 0) * 500 * F.sheet;
  };

  function buildTrackTable() {
    const names = T("months");
    $("trackBody").innerHTML = track.map((r, i) =>
      "<tr><td>" + names[i] + "</td>" +
      [0, 1, 2].map((c) => '<td><input type="number" min="0" step="any" inputmode="decimal" data-r="' + i + '" data-c="' + c +
        '" value="' + r[c] + '" aria-label="' + names[i] + '"></td>').join("") +
      '<td id="co2_' + i + '">—</td></tr>').join("");
  }

  function renderTrack() {
    const vals = track.map(rowCO2);
    vals.forEach((v, i) => { $("co2_" + i).textContent = v === null ? "—" : fmt(v); });
    const entered = vals.map((v, i) => ({ v, i })).filter((x) => x.v !== null);

    // Graphique à barres + ligne d'objectif
    const W = 420, H = 240, L = 44, B = 30, Tp = 14, Rr = 10;
    const names = T("months");
    const baseline = entered.length ? entered[0].v : 0;
    const goal = baseline * 0.9;
    const max = Math.max(1, ...entered.map((x) => x.v), baseline) * 1.15;
    const y = (v) => Tp + (H - Tp - B) * (1 - v / max);
    const slot = (W - L - Rr) / MONTHS;
    let svg = "";
    [0, 0.5, 1].forEach((f) => {
      const v = max * f;
      svg += '<line x1="' + L + '" x2="' + (W - Rr) + '" y1="' + y(v) + '" y2="' + y(v) + '" stroke="var(--line)"/>' +
        '<text x="' + (L - 6) + '" y="' + (y(v) + 4) + '" text-anchor="end">' + fmt(v) + "</text>";
    });
    vals.forEach((v, i) => {
      const x = L + slot * i + slot * 0.15;
      const label = lang === "ar" ? names[i] : names[i].slice(0, 3);
      svg += '<text x="' + (x + slot * 0.35) + '" y="' + (H - 10) + '" text-anchor="middle">' + label + "</text>";
      if (v !== null) {
        const ok = baseline > 0 && v <= goal;
        svg += '<rect x="' + x + '" y="' + y(v) + '" width="' + slot * 0.7 + '" height="' + (H - B - y(v)) +
          '" rx="4" fill="' + (ok ? "#16a34a" : "#2563eb") + '"/>';
      }
    });
    if (baseline > 0) {
      svg += '<line x1="' + L + '" x2="' + (W - Rr) + '" y1="' + y(goal) + '" y2="' + y(goal) +
        '" stroke="#f59e0b" stroke-width="2" stroke-dasharray="6 4"/>' +
        '<text x="' + (W - Rr) + '" y="' + (y(goal) - 5) + '" text-anchor="end" style="fill:#d97706;font-weight:700">' + T("track.goal") + "</text>";
    }
    $("trackChart").innerHTML = svg;

    // Bilan
    if (!entered.length) {
      $("trackSummary").textContent = T("track.none");
      $("trackVerdict").textContent = "";
      return;
    }
    const total = entered.reduce((a, x) => a + x.v, 0);
    $("trackSummary").textContent = fill(T("track.summary"), { n: entered.length, t: fmt(total), a: fmt(total / entered.length) });
    if (entered.length > 1 && baseline > 0) {
      const last = entered[entered.length - 1].v;
      const evo = Math.round(((last - baseline) / baseline) * 1000) / 10;
      const reached = last <= goal;
      $("trackVerdict").innerHTML = fill(T("track.evo"), { e: evo }) + " <b class=\"" + (reached ? "ok" : "") + '">' +
        T(reached ? "track.ok" : "track.ko") + "</b>";
    } else {
      $("trackVerdict").textContent = "";
    }
  }

  function exportCSV() {
    const lines = ["month,electricity_kwh,water_m3,paper_reams"];
    track.forEach((r, i) => lines.push([i + 1, r[0], r[1], r[2]].join(",")));
    const blob = new Blob(["﻿" + lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "suivi-empreinte-lycee.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  function importCSV(file) {
    const reader = new FileReader();
    reader.onload = () => {
      const lines = String(reader.result).replace(/^﻿/, "").split(/\r?\n/).slice(1).filter((l) => l.trim());
      const next = Array.from({ length: MONTHS }, () => ["", "", ""]);
      lines.slice(0, MONTHS).forEach((l, i) => {
        const p = l.split(",");
        for (let c = 0; c < 3; c++) {
          const v = (p[c + 1] || "").trim();
          next[i][c] = v !== "" && !isNaN(Number(v)) && Number(v) >= 0 ? v : "";
        }
      });
      track = next;
      store.set("track", track);
      buildTrackTable();
      renderTrack();
    };
    reader.readAsText(file);
  }

  // ---------- Défis ----------
  const CHALL_IDS = ["c1", "c2", "c3", "c4", "c5", "c6", "c7", "c8", "c9", "c10"];
  const BADGES = ["🌰", "🌱", "🌳", "🌲"];
  let done = store.get("chall", []);

  function renderChall() {
    $("challList").innerHTML = CHALL_IDS.map((id) =>
      '<li class="' + (done.includes(id) ? "done" : "") + '"><label><input type="checkbox" data-id="' + id + '"' +
      (done.includes(id) ? " checked" : "") + "> <span>" + T(id) + "</span></label></li>").join("");
    const pts = done.length * 10, max = CHALL_IDS.length * 10;
    const b = pts >= 90 ? 3 : pts >= 60 ? 2 : pts >= 30 ? 1 : 0;
    $("badgeName").textContent = BADGES[b] + " " + T("badge." + b);
    $("pointsText").textContent = fill(T("chall.points"), { p: pts, m: max });
    $("progressBar").style.width = (pts / max) * 100 + "%";
  }

  // ---------- Quiz ----------
  let quiz = { i: -1, score: 0, answered: false };

  function renderQuiz() {
    const qs = QUIZ[lang], box = $("quizBox");
    if (quiz.i < 0) {
      box.innerHTML = '<div class="final"><button type="button" class="btn" id="quizStart">' + T("quiz.start") + "</button></div>";
      $("quizStart").onclick = () => { quiz = { i: 0, score: 0, answered: false }; renderQuiz(); };
      return;
    }
    if (quiz.i >= qs.length) {
      const r = quiz.score / qs.length;
      const m = r === 1 ? 2 : r >= 0.5 ? 1 : 0;
      box.innerHTML = '<div class="final"><div class="big">' + quiz.score + " / " + qs.length + "</div><p>" +
        fill(T("quiz.score"), { s: quiz.score, n: qs.length }) + "</p><p><b>" + T("quiz.m" + m) +
        '</b></p><button type="button" class="btn" id="quizAgain">' + T("quiz.again") + "</button></div>";
      $("quizAgain").onclick = () => { quiz = { i: 0, score: 0, answered: false }; renderQuiz(); };
      return;
    }
    const q = qs[quiz.i];
    box.innerHTML = '<div class="bar"><div style="width:' + (quiz.i / qs.length) * 100 + '%"></div></div>' +
      '<p class="muted">' + fill(T("quiz.q"), { i: quiz.i + 1, n: qs.length }) + "</p><h3>" + q.q + "</h3>" +
      q.o.map((o, k) => '<button type="button" class="opt" data-k="' + k + '">' + o + "</button>").join("") +
      '<div id="quizFb"></div>';
    box.querySelectorAll(".opt").forEach((btn) => {
      btn.onclick = () => {
        if (quiz.answered) return;
        quiz.answered = true;
        const k = Number(btn.dataset.k), good = k === q.a;
        if (good) quiz.score++;
        box.querySelectorAll(".opt").forEach((o, j) => {
          o.disabled = true;
          if (j === q.a) o.classList.add("good");
          else if (j === k) o.classList.add("bad");
        });
        const last = quiz.i === qs.length - 1;
        $("quizFb").innerHTML = "<p><b>" + T(good ? "quiz.ok" : "quiz.ko") + "</b> " + q.e + '</p><button type="button" class="btn" id="quizNext">' +
          T(last ? "quiz.finish" : "quiz.next") + "</button>";
        $("quizNext").onclick = () => { quiz.i++; quiz.answered = false; renderQuiz(); };
      };
    });
  }

  // ---------- Glossaire ----------
  function renderGloss() {
    const q = $("glossSearch").value.trim().toLowerCase();
    $("glossBody").innerHTML = GLOSSAIRE
      .filter((row) => !q || row.join(" ").toLowerCase().includes(q))
      .map((row) => "<tr><td>" + row[0] + "</td><td lang=\"ar\" dir=\"rtl\">" + row[1] + "</td><td>" + row[2] + "</td></tr>").join("");
  }

  // ---------- Application de la langue ----------
  function applyLang() {
    const html = document.documentElement;
    html.lang = lang;
    html.dir = lang === "ar" ? "rtl" : "ltr";
    document.title = "البصمة البيئية · " + T("app.title");
    document.querySelectorAll("[data-i18n]").forEach((el) => { el.textContent = T(el.dataset.i18n); });
    document.querySelectorAll("[data-i18n-ph]").forEach((el) => { el.placeholder = T(el.dataset.i18nPh); });
    document.querySelectorAll("[data-lang]").forEach((b) => b.setAttribute("aria-pressed", b.dataset.lang === lang));
    renderCalc();
    renderHistory();
    buildTrackTable();
    renderTrack();
    renderChall();
    renderQuiz();
    renderGloss();
  }

  // ---------- Événements ----------
  document.querySelectorAll("[data-lang]").forEach((b) => {
    b.onclick = () => { lang = b.dataset.lang; store.set("lang", lang); applyLang(); };
  });

  $("calcForm").addEventListener("input", renderCalc);
  $("calcForm").addEventListener("change", renderCalc);
  $("saveBtn").onclick = () => {
    const hist = store.get("hist", []);
    hist.push({ d: new Date().toISOString(), t: compute().total });
    store.set("hist", hist.slice(-20));
    renderHistory();
    $("savedMsg").textContent = T("calc.saved");
    setTimeout(() => { $("savedMsg").textContent = ""; }, 2500);
  };
  $("printBtn").onclick = () => window.print();
  $("clearHistory").onclick = () => { store.set("hist", []); renderHistory(); };

  $("trackBody").addEventListener("input", (e) => {
    const t = e.target;
    if (t.dataset.r === undefined) return;
    track[t.dataset.r][t.dataset.c] = t.value;
    store.set("track", track);
    renderTrack();
  });
  $("exportBtn").onclick = exportCSV;
  $("importFile").onchange = (e) => { if (e.target.files[0]) importCSV(e.target.files[0]); e.target.value = ""; };
  $("resetTrack").onclick = () => {
    if (!confirm(T("track.confirm"))) return;
    track = Array.from({ length: MONTHS }, () => ["", "", ""]);
    store.set("track", track);
    buildTrackTable();
    renderTrack();
  };

  $("challList").addEventListener("change", (e) => {
    const id = e.target.dataset.id;
    if (!id) return;
    done = e.target.checked ? done.concat(id) : done.filter((x) => x !== id);
    store.set("chall", done);
    renderChall();
  });
  $("challReset").onclick = () => { done = []; store.set("chall", done); renderChall(); };

  $("glossSearch").addEventListener("input", renderGloss);

  // Thème clair / sombre
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  let theme = store.get("theme", prefersDark ? "dark" : "light");
  const setTheme = () => { document.documentElement.dataset.theme = theme; };
  $("themeBtn").onclick = () => { theme = theme === "dark" ? "light" : "dark"; store.set("theme", theme); setTheme(); };
  setTheme();

  $("year").textContent = new Date().getFullYear();
  applyLang();
})();
