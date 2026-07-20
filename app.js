import { loadAdBanner, loadAdBetweenSections, loadAdSidebar, loadAdNative } from "./ads.js";

const classes = ["Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12", "CUET", "NEET"];
const subjects = [
  "Mathematics",
  "Science",
  "Physics",
  "Chemistry",
  "Biology",
  "English",
  "History",
  "Geography",
  "Computer Science",
  "Economics",
  "Accountancy",
];

const savedKey = "qspark-ai-saved-results";
const themeKey = "qspark-ai-theme";
const usageKey = "qspark-ai-daily-usage";
const FREE_DAILY_LIMIT = 3;

const state = {
  currentResult: null,
  lastPayload: null,
  isLoading: false,
  generationMode: "student", // Added mode tracking for SaaS logic
};

const elements = {
  heroForm: document.getElementById("heroForm"),
  heroClass: document.getElementById("heroClass"),
  heroSubject: document.getElementById("heroSubject"),
  heroChapter: document.getElementById("heroChapter"),
  heroGenerateBtn: document.getElementById("heroGenerateBtn"),
  generatorForm: document.getElementById("generatorForm"),
  classSelect: document.getElementById("classSelect"),
  subjectSelect: document.getElementById("subjectSelect"),
  chapterInput: document.getElementById("chapterInput"),
  generateBtn: document.getElementById("generateBtn"),
  regenerateBtn: document.getElementById("regenerateBtn"),
  copyAllBtn: document.getElementById("copyAllBtn"),
  downloadPdfBtn: document.getElementById("downloadPdfBtn"),
  saveBtn: document.getElementById("saveBtn"),
  clearSavedBtn: document.getElementById("clearSavedBtn"),
  refreshSavedBtn: document.getElementById("refreshSavedBtn"),
  saveCount: document.getElementById("saveCount"),
  usageSummary: document.getElementById("usageSummary"),
  limitMessage: document.getElementById("limitMessage"),
  loadingState: document.getElementById("loadingState"),
  errorState: document.getElementById("errorState"),
  errorTitle: document.getElementById("errorTitle"),
  errorText: document.getElementById("errorText"),
  dismissErrorBtn: document.getElementById("dismissErrorBtn"),
  errorUpgradeLink: document.getElementById("errorUpgradeLink"),
  emptyState: document.getElementById("emptyState"),
  resultsPanel: document.getElementById("resultsPanel"),
  statusBadge: document.getElementById("statusBadge"),
  metaBadge: document.getElementById("metaBadge"),
  mcqList: document.getElementById("mcqList"),
  shortList: document.getElementById("shortList"),
  longList: document.getElementById("longList"),
  mcqInterstitialAd: document.getElementById("mcqInterstitialAd"),
  shortInterstitialAd: document.getElementById("shortInterstitialAd"),
  savedList: document.getElementById("savedList"),
  topBannerAd: document.getElementById("topBannerAd"),
  sidebarAdSlot: document.getElementById("sidebarAdSlot"),
  bottomStickyAd: document.getElementById("bottomStickyAd"),
  nativeAdSlot: document.getElementById("myNativeAdDiv"),
  themeToggle: document.getElementById("themeToggle"),
  // New SaaS UI Elements
  modeStudentBtn: document.getElementById("modeStudentBtn"),
  modeTeacherBtn: document.getElementById("modeTeacherBtn"),
};

function init() {
  if (elements.heroClass) populateSelect(elements.heroClass, classes);
  if (elements.classSelect) populateSelect(elements.classSelect, classes);
  if (elements.heroSubject) populateSelect(elements.heroSubject, subjects);
  if (elements.subjectSelect) populateSelect(elements.subjectSelect, subjects);

  if (elements.heroClass) elements.heroClass.value = "Class 12";
  if (elements.classSelect) elements.classSelect.value = "Class 12";
  if (elements.heroSubject) elements.heroSubject.value = "Accountancy";
  if (elements.subjectSelect) elements.subjectSelect.value = "Accountancy";

  applyUrlPreset();
  applyStoredTheme();
  bindEvents();
  initializeAds();
  renderSavedResults();
  updateUsageUI();
  syncActionAvailability();
}

// 🚀 EVENT LISTENER FOR PLAN LOADED (FROM INDEX.HTML)
window.addEventListener('planLoaded', () => {
    updateUsageUI();
    if (window.isAdsFree) {
        document.querySelectorAll('.ad-shell').forEach(el => el.style.display = 'none');
    }
});

function populateSelect(selectElement, items) {
  if (!selectElement) return;
  selectElement.innerHTML = items.map((item) => `<option value="${item}">${item}</option>`).join("");
}

function bindEvents() {
  if (elements.heroForm) elements.heroForm.addEventListener("submit", handleHeroSubmit);
  if (elements.generatorForm) elements.generatorForm.addEventListener("submit", (e) => handleGenerate(e));
  if (elements.regenerateBtn) elements.regenerateBtn.addEventListener("click", () => handleGenerate(new Event("submit")));
  if (elements.copyAllBtn) elements.copyAllBtn.addEventListener("click", copyAllResults);
  if (elements.downloadPdfBtn) elements.downloadPdfBtn.addEventListener("click", downloadPdf);
  if (elements.saveBtn) elements.saveBtn.addEventListener("click", saveCurrentResult);
  if (elements.clearSavedBtn) elements.clearSavedBtn.addEventListener("click", clearSavedResults);
  if (elements.refreshSavedBtn) elements.refreshSavedBtn.addEventListener("click", renderSavedResults);
  if (elements.themeToggle) elements.themeToggle.addEventListener("click", toggleTheme);
  if (elements.dismissErrorBtn) elements.dismissErrorBtn.addEventListener("click", clearErrorState);
  if (elements.savedList) elements.savedList.addEventListener("click", handleSavedListClick);

  document.querySelectorAll("[data-copy-section]").forEach((button) => {
    button.addEventListener("click", () => copySection(button.dataset.copySection));
  });

  // Mode Toggles
  if (elements.modeStudentBtn) elements.modeStudentBtn.addEventListener("click", () => setMode('student'));
  if (elements.modeTeacherBtn) elements.modeTeacherBtn.addEventListener("click", () => setMode('teacher'));

  // Redirect Logic for CUET/NEET
  if (elements.classSelect) elements.classSelect.addEventListener("change", (e) => handleClassRedirect(e.target.value));
  if (elements.heroClass) elements.heroClass.addEventListener("change", (e) => handleClassRedirect(e.target.value));
}

function handleClassRedirect(val) {
  if (val === "CUET" && !window.location.pathname.includes("cuet")) {
      window.location.href = "cuet.html";
  }
  if (val === "NEET" && !window.location.pathname.includes("neet")) {
      window.location.href = "neet.html";
  }
}

function setMode(mode) {
  state.generationMode = mode;
  if(mode === 'student') {
    if (elements.modeStudentBtn) {
        elements.modeStudentBtn.classList.add('bg-accent', 'text-white');
        elements.modeStudentBtn.classList.remove('bg-transparent', 'text-slate-600');
    }
    if (elements.modeTeacherBtn) {
        elements.modeTeacherBtn.classList.add('bg-transparent', 'text-slate-600');
        elements.modeTeacherBtn.classList.remove('bg-accent', 'text-white');
    }
    if (elements.chapterInput) elements.chapterInput.placeholder = "Examples: Partnership, Trigonometry";
  } else {
    if (elements.modeTeacherBtn) {
        elements.modeTeacherBtn.classList.add('bg-accent', 'text-white');
        elements.modeTeacherBtn.classList.remove('bg-transparent', 'text-slate-600');
    }
    if (elements.modeStudentBtn) {
        elements.modeStudentBtn.classList.add('bg-transparent', 'text-slate-600');
        elements.modeStudentBtn.classList.remove('bg-accent', 'text-white');
    }
    if (elements.chapterInput) elements.chapterInput.placeholder = "Enter chapter(s) or 'Whole Syllabus'";
  }
}

function handleHeroSubmit(event) {
  event.preventDefault();
  syncHeroToGenerator();
  if (document.getElementById("generator")) {
      document.getElementById("generator").scrollIntoView({ behavior: "smooth", block: "start" });
  }
  handleGenerate(new Event("submit"));
}

function syncHeroToGenerator() {
  if (elements.classSelect && elements.heroClass) elements.classSelect.value = elements.heroClass.value;
  if (elements.subjectSelect && elements.heroSubject) elements.subjectSelect.value = elements.heroSubject.value;
  if (elements.chapterInput && elements.heroChapter) elements.chapterInput.value = elements.heroChapter.value.trim();
}

function applyUrlPreset() {
  const params = new URLSearchParams(window.location.search);
  const className = params.get("class");
  const subject = params.get("subject");
  const chapter = params.get("chapter");

  if (className && classes.includes(className)) {
    if (elements.heroClass) elements.heroClass.value = className;
    if (elements.classSelect) elements.classSelect.value = className;
  }

  if (subject && subjects.includes(subject)) {
    if (elements.heroSubject) elements.heroSubject.value = subject;
    if (elements.subjectSelect) elements.subjectSelect.value = subject;
  }

  if (chapter) {
    if (elements.heroChapter) elements.heroChapter.value = chapter;
    if (elements.chapterInput) elements.chapterInput.value = chapter;
    return;
  }

  syncHeroToGenerator();
}

// ⚡ BULLETPROOF AUTO-RETRY SYSTEM (Handles Vercel Timeout & Network Drops)
async function handleGenerate(event, attempt = 1) {
  if (event && event.preventDefault) {
      event.preventDefault();
  }

  const payload = buildPayload();

  if (!payload.chapter) {
    showToast("Please enter a chapter name first.");
    if (elements.chapterInput) elements.chapterInput.focus();
    return;
  }

  if (isLimitReached()) {
    handleLimitReached();
    return;
  }

  state.lastPayload = payload;
  setLoading(true, attempt);
  clearErrorState();

  try {
    // Setting up AbortController for Vercel timeouts
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000); // 25 seconds timeout

    const response = await fetch(getApiEndpoint(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    clearTimeout(timeoutId); // Clear timeout if fetch succeeds

    const data = await readJsonResponse(response);

    if (!response.ok) {
      throw new Error(data.error || "Unable to generate questions right now.");
    }

    state.currentResult = {
      ...normalizeClientResult(data),
      input: payload,
      generatedAt: new Date().toISOString(),
    };

    recordSuccessfulGeneration();
    renderResults(state.currentResult);
    showToast("Questions generated successfully.");

  } catch (error) {
    console.warn(`[QSpark AI Engine] Attempt ${attempt} failed:`, error.message);
    
    // Exponential Backoff Logic
    if (attempt < 3) {
      const waitTime = attempt === 1 ? 2000 : 4000; 
      showToast(`AI network overload. Retrying in ${waitTime/1000}s (Attempt ${attempt + 1}/3)...`);
      
      setTimeout(() => {
          handleGenerate(null, attempt + 1);
      }, waitTime);
    } else {
      showGenerationError("Server timeout. The syllabus might be too broad, or Vercel killed the connection. Try a smaller chapter.");
      setLoading(false);
    }
  }
}

function getApiEndpoint() {
  return "/api/generate-questions";
}

function setLoading(isLoading, attempt = 1) {
  state.isLoading = isLoading;
  
  if (elements.loadingState) {
      elements.loadingState.classList.toggle("hidden", !isLoading);
  }
  
  if (isLoading) {
    if(elements.statusBadge) elements.statusBadge.textContent = attempt > 1 ? `Reconnecting (${attempt}/3)` : "Generating";
    if(elements.loadingState && elements.loadingState.querySelector('.ai-pulse')) {
        elements.loadingState.querySelector('.ai-pulse').classList.add('animate-pulse');
    }
  } else {
    if(elements.loadingState && elements.loadingState.querySelector('.ai-pulse')) {
        elements.loadingState.querySelector('.ai-pulse').classList.remove('animate-pulse');
    }
  }

  if(elements.metaBadge) {
      elements.metaBadge.textContent = isLoading
        ? "Synthesizing AI modules..."
        : state.currentResult
          ? `${state.currentResult.input.className} • ${state.currentResult.input.subject}`
          : "Waiting for input";
  }

  updateEmptyState();
  syncActionAvailability();
}

// 💎 PREMIUM SAAS UI: Interactive Answer Toggle
window.toggleAnswer = function(btn) {
  const answerDiv = btn.parentElement.nextElementSibling;
  
  if (answerDiv.classList.contains('hidden')) {
    answerDiv.classList.remove('hidden');
    btn.innerHTML = '🙈 Hide Answer';
    btn.classList.add('text-accent', 'bg-accent/10', 'border-accent/20');
    btn.classList.remove('text-slate-600', 'bg-slate-100', 'dark:text-slate-300', 'dark:bg-slate-800');
  } else {
    answerDiv.classList.add('hidden');
    btn.innerHTML = '👁️ View Answer';
    btn.classList.remove('text-accent', 'bg-accent/10', 'border-accent/20');
    btn.classList.add('text-slate-600', 'bg-slate-100', 'dark:text-slate-300', 'dark:bg-slate-800');
  }
};

function renderResults(result) {
  updateEmptyState();
  
  if (elements.resultsPanel) {
      elements.resultsPanel.classList.remove("hidden");
      elements.resultsPanel.classList.add("fade-up");
  }
  
  if(elements.statusBadge) elements.statusBadge.textContent = "Generated";
  if(elements.metaBadge) elements.metaBadge.textContent = `${result.input.className} • ${result.input.subject} • ${result.input.chapter}`;

  if(elements.mcqList) {
    elements.mcqList.innerHTML = result.mcqs
      .map(
        (mcq, index) => `
          <div class="question-tile mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900/80">
            <p class="font-bold text-lg text-ink dark:text-white">${index + 1}. ${escapeHtml(mcq.question)}</p>
            <ul class="mt-4 space-y-2 text-sm text-slate-700 dark:text-slate-300">
              ${mcq.options.map((option) => `<li class="rounded-xl border border-slate-100 bg-slate-50 px-4 py-2.5 dark:border-slate-800/60 dark:bg-slate-950/50">${escapeHtml(option)}</li>`).join("")}
            </ul>
            
            <div class="mt-5 flex justify-end">
                <button onclick="toggleAnswer(this)" class="inline-flex items-center gap-2 rounded-xl border border-transparent bg-slate-100 px-4 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">
                    👁️ View Answer
                </button>
            </div>
            
            <div class="mt-4 hidden rounded-xl border border-mint/30 bg-mint/10 p-4 transition-all duration-300 dark:border-cyan-500/20 dark:bg-cyan-500/10">
              <p class="text-sm font-bold text-ink dark:text-white">Answer: <span class="text-accent">${escapeHtml(mcq.answer)}</span></p>
              ${mcq.explanation ? `<p class="mt-2 border-t border-mint/20 pt-2 text-xs font-medium text-slate-600 dark:border-cyan-500/20 dark:text-slate-400">Explanation: ${escapeHtml(mcq.explanation)}</p>` : ''}
            </div>
          </div>
        `
      ).join("");
  }

  if(elements.shortList) {
    elements.shortList.innerHTML = result.shortQuestions
      .map((q, i) => `<div class="question-tile mb-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/80"><p class="font-semibold text-ink dark:text-white">${i + 1}. ${escapeHtml(q)}</p></div>`).join("");
  }

  if(elements.longList) {
    elements.longList.innerHTML = result.longQuestions
      .map((q, i) => `<div class="question-tile mb-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/80"><p class="font-semibold text-ink dark:text-white">${i + 1}. ${escapeHtml(q)}</p></div>`).join("");
  }

  if (elements.mcqInterstitialAd) loadAdBetweenSections(elements.mcqInterstitialAd);
  if (elements.shortInterstitialAd) loadAdBetweenSections(elements.shortInterstitialAd);
  
  syncActionAvailability();
  setLoading(false);
}

function initializeAds() {
  if (elements.topBannerAd) loadAdBanner(elements.topBannerAd);
  if (elements.sidebarAdSlot) loadAdSidebar(elements.sidebarAdSlot);
  if (elements.bottomStickyAd) loadAdBanner(elements.bottomStickyAd, { sticky: true });
  if (elements.nativeAdSlot) loadAdNative(elements.nativeAdSlot);
}

function buildPayload() {
  const isCuet = window.location.pathname.includes('cuet');
  const isNeet = window.location.pathname.includes('neet');
  
  return {
    className: elements.classSelect ? elements.classSelect.value : "",
    subject: elements.subjectSelect ? elements.subjectSelect.value : "",
    chapter: elements.chapterInput ? elements.chapterInput.value.trim() : "",
    mode: state.generationMode,
    examType: isCuet ? 'cuet' : (isNeet ? 'neet' : 'regular')
  };
}

async function readJsonResponse(response) {
  try {
      return await response.json();
  } catch (error) {
      return {};
  }
}

function normalizeClientResult(data) {
  const normalized = {
    mcqs: Array.isArray(data.mcqs) ? data.mcqs.map(normalizeMcq) : [],
    shortQuestions: Array.isArray(data.shortQuestions) ? data.shortQuestions.map((i) => String(i).trim()).filter(Boolean) : [],
    longQuestions: Array.isArray(data.longQuestions) ? data.longQuestions.map((i) => String(i).trim()).filter(Boolean) : [],
  };
  
  if (!normalized.mcqs.length) {
      throw new Error("The AI response was incomplete. Please try regenerating.");
  }
  
  return normalized;
}

function normalizeMcq(mcq) {
  return {
    question: String(mcq?.question || "Question unavailable"),
    options: Array.isArray(mcq?.options) && mcq.options.length ? mcq.options.map((item) => String(item)) : ["A. Option unavailable"],
    answer: String(mcq?.answer || "Answer unavailable"),
    explanation: mcq?.explanation ? String(mcq.explanation) : null,
  };
}

function updateEmptyState() {
  const shouldHideEmptyState = state.isLoading || Boolean(state.currentResult) || (elements.errorState && !elements.errorState.classList.contains("hidden"));
  if (elements.emptyState) {
      elements.emptyState.classList.toggle("hidden", shouldHideEmptyState);
  }
}

function syncActionAvailability() {
  const limitReached = isLimitReached();
  const hasResult = Boolean(state.currentResult);
  const hasSavedResults = getSavedResults().length > 0;

  if(elements.generateBtn) elements.generateBtn.disabled = state.isLoading || limitReached;
  if(elements.heroGenerateBtn) elements.heroGenerateBtn.disabled = state.isLoading || limitReached;
  if(elements.regenerateBtn) elements.regenerateBtn.disabled = state.isLoading || limitReached || !state.lastPayload;
  if(elements.copyAllBtn) elements.copyAllBtn.disabled = !hasResult;
  if(elements.downloadPdfBtn) elements.downloadPdfBtn.disabled = !hasResult;
  if(elements.saveBtn) elements.saveBtn.disabled = !hasResult;
  if(elements.clearSavedBtn) elements.clearSavedBtn.disabled = !hasSavedResults;
  if(elements.refreshSavedBtn) elements.refreshSavedBtn.disabled = !hasSavedResults;
}

function showGenerationError(message, options = {}) {
  if(elements.statusBadge) elements.statusBadge.textContent = options.limit ? "Limit reached" : "Generation Failed";
  if(elements.metaBadge) elements.metaBadge.textContent = options.limit ? "Upgrade required" : "Network Error";
  if(elements.errorTitle) elements.errorTitle.textContent = options.limit ? "Daily free limit reached" : "We could not complete this request";
  if(elements.errorText) elements.errorText.textContent = message;
  
  if (elements.errorUpgradeLink) {
      elements.errorUpgradeLink.classList.toggle("hidden", !options.limit);
  }
  
  if (elements.errorState) {
      elements.errorState.classList.remove("hidden");
  }
  
  updateEmptyState();
  syncActionAvailability();
}

function clearErrorState() {
  if (elements.errorState) elements.errorState.classList.add("hidden");
  if (elements.errorUpgradeLink) elements.errorUpgradeLink.classList.add("hidden");
  
  if (!state.currentResult && !state.isLoading) {
    if(elements.statusBadge) elements.statusBadge.textContent = "Ready";
    if(elements.metaBadge) elements.metaBadge.textContent = "Waiting for input";
  }
  updateEmptyState();
}

function handleLimitReached() {
  const message = "Limit reached. Upgrade to continue.";
  showGenerationError(message, { limit: true });
  showToast(message);
  syncActionAvailability();
}

function getLocalDateStamp() {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
}

function getDailyUsage() {
  const today = getLocalDateStamp();
  try {
    const savedUsage = JSON.parse(localStorage.getItem(usageKey));
    if (savedUsage?.date === today && Number.isFinite(savedUsage.count)) {
        return savedUsage;
    }
  } catch (error) {
      console.error(error);
  }
  return { date: today, count: 0 };
}

function saveDailyUsage(usage) { 
    localStorage.setItem(usageKey, JSON.stringify(usage)); 
}

function recordSuccessfulGeneration() {
  const usage = getDailyUsage();
  usage.count += 1;
  saveDailyUsage(usage);
  updateUsageUI();
}

function getRemainingGenerations() {
  if (window.qsparkPlan === "pro") return "Unlimited";
  return Math.max(0, FREE_DAILY_LIMIT - getDailyUsage().count);
}

function isLimitReached() {
  if (window.qsparkPlan === "pro") return false;
  return getRemainingGenerations() <= 0;
}

// 🚀 REFERRAL UI LOGIC
function updateUsageUI() {
  const remaining = getRemainingGenerations();
  const bannerBox = elements.limitMessage?.parentElement;

  if (remaining === "Unlimited") {
    if (bannerBox) bannerBox.style.display = 'none';
  } else {
    if (bannerBox) bannerBox.style.display = 'block';
    
    if(elements.usageSummary) {
      elements.usageSummary.textContent = `${remaining} left today`;
      elements.usageSummary.className = "rounded-full bg-white px-3 py-2 text-sm font-semibold text-ink dark:bg-slate-900 dark:text-white";
    }
    
    if(elements.limitMessage) {
      elements.limitMessage.innerHTML = remaining > 0
        ? `Free users can generate ${remaining} more set(s) today. <br><button onclick="copyReferralLink()" class="mt-2 text-accent underline font-bold">Refer a friend to get +2 credits!</button>`
        : `Limit reached. Upgrade to continue. <br><button onclick="copyReferralLink()" class="mt-2 text-accent underline font-bold">Or refer a friend to get +2 credits!</button>`;
    }
  }
  syncActionAvailability();
}

window.copyReferralLink = function() {
    if(!window.currentUserUid) {
        showToast("Please login to get a referral link!");
        return;
    }
    navigator.clipboard.writeText(`${window.location.origin}/login.html?ref=${window.currentUserUid}`);
    showToast("Referral Link Copied! Send it to your friends.");
}

function handleSavedListClick(event) {
  const loadButton = event.target.closest("[data-load-id]");
  const deleteButton = event.target.closest("[data-delete-id]");
  if (loadButton) {
      loadSavedResult(loadButton.dataset.loadId);
  }
  if (deleteButton) {
      deleteSavedResult(deleteButton.dataset.deleteId);
  }
}

function escapeHtml(value) {
  return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
}

async function copyAllResults() {
  if (!state.currentResult) {
      showToast("Generate questions before copying.");
      return; 
  }
  await copyText(buildExportText(state.currentResult));
  showToast("All questions copied to clipboard.");
}

async function copySection(section) {
  if (!state.currentResult) {
      showToast("Generate questions before copying.");
      return;
  }
  
  let text = "";
  if (section === "mcqs") {
    text = state.currentResult.mcqs.map((mcq, index) => {
        let block = `${index + 1}. ${mcq.question}\n${mcq.options.join("\n")}\nAnswer: ${mcq.answer}`;
        if(mcq.explanation) block += `\nExplanation: ${mcq.explanation}`;
        return block;
      }).join("\n\n");
  }
  if (section === "shortQuestions") {
      text = state.currentResult.shortQuestions.map((q, index) => `${index + 1}. ${q}`).join("\n");
  }
  if (section === "longQuestions") {
      text = state.currentResult.longQuestions.map((q, index) => `${index + 1}. ${q}`).join("\n");
  }
  
  await copyText(text);
  showToast("Section copied.");
}

async function copyText(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) { 
      await navigator.clipboard.writeText(text); 
      return; 
  }
  const helper = document.createElement("textarea");
  helper.value = text;
  helper.setAttribute("readonly", "");
  helper.style.position = "absolute";
  helper.style.left = "-9999px";
  document.body.appendChild(helper);
  helper.select();
  document.execCommand("copy");
  helper.remove();
}

function downloadPdf() {
  if (!state.currentResult) {
      showToast("Generate questions before downloading.");
      return;
  }
  
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  
  const applyWatermark = () => {
    doc.setTextColor(240, 240, 240);
    doc.setFontSize(45);
    doc.setFont("helvetica", "bold");
    doc.text("Generated by QSpark AI", 105, 150, { align: "center", angle: 45 });
    doc.setTextColor(0, 0, 0); 
  };

  applyWatermark();
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  const rawText = buildExportText(state.currentResult);
  const lines = doc.splitTextToSize(rawText, 180);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("QSpark AI Question Bank", 14, 20);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  let y = 35; 

  lines.forEach((line) => {
    if (y > 280) { 
        doc.addPage(); 
        applyWatermark(); 
        doc.setFont("helvetica", "normal"); 
        doc.setFontSize(11); 
        y = 20; 
    }
    doc.text(line, 14, y);
    y += 7; 
  });

  const safeChapter = state.currentResult.input.chapter.replace(/[^a-z0-9]/gi, "-").toLowerCase();
  doc.save(`qspark-ai-${safeChapter || "questions"}.pdf`);
  showToast("PDF downloaded.");
}

function saveCurrentResult() {
  if (!state.currentResult) {
      showToast("Generate questions before saving.");
      return;
  }
  const savedResults = getSavedResults();
  savedResults.unshift({ id: crypto.randomUUID(), ...state.currentResult });
  localStorage.setItem(savedKey, JSON.stringify(savedResults.slice(0, 12)));
  renderSavedResults();
  showToast("Result saved locally.");
}

function getSavedResults() {
  try { 
      return JSON.parse(localStorage.getItem(savedKey)) || []; 
  } catch (error) { 
      return []; 
  }
}

function renderSavedResults() {
  const savedResults = getSavedResults();
  
  if(elements.saveCount) {
      elements.saveCount.textContent = `${savedResults.length} saved`;
  }

  if (!savedResults.length) {
    if(elements.savedList) {
        elements.savedList.innerHTML = `<div class="saved-card text-sm text-slate-500 dark:text-slate-400">Saved question sets will appear here.</div>`;
    }
    syncActionAvailability(); 
    return;
  }

  if(elements.savedList) {
      elements.savedList.innerHTML = savedResults.map((item) => `
            <div class="saved-card mb-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-accent dark:border-slate-800 dark:bg-slate-900/60">
              <p class="font-bold text-ink dark:text-white">${escapeHtml(item.input.className)} • ${escapeHtml(item.input.subject)}</p>
              <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">${escapeHtml(item.input.chapter)}</p>
              <div class="mt-4 flex gap-2">
                <button class="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700" type="button" data-load-id="${item.id}">Load Set</button>
                <button class="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-100 dark:border-rose-900/50 dark:bg-rose-900/20 dark:text-rose-400" type="button" data-delete-id="${item.id}">Delete</button>
              </div>
            </div>
          `).join("");
  }
  syncActionAvailability();
}

function loadSavedResult(id) {
  const savedResult = getSavedResults().find((item) => item.id === id);
  if (!savedResult) {
      showToast("Saved result not found.");
      return;
  }

  state.currentResult = savedResult;
  state.lastPayload = savedResult.input;
  
  if(elements.heroClass) elements.heroClass.value = savedResult.input.className;
  if(elements.heroSubject) elements.heroSubject.value = savedResult.input.subject;
  if(elements.heroChapter) elements.heroChapter.value = savedResult.input.chapter;
  if(elements.classSelect) elements.classSelect.value = savedResult.input.className;
  if(elements.subjectSelect) elements.subjectSelect.value = savedResult.input.subject;
  if(elements.chapterInput) elements.chapterInput.value = savedResult.input.chapter;
  
  clearErrorState();
  renderResults(savedResult);
  showToast("Saved result loaded.");
}

function deleteSavedResult(id) {
  localStorage.setItem(savedKey, JSON.stringify(getSavedResults().filter((item) => item.id !== id)));
  renderSavedResults();
  showToast("Saved result deleted.");
}

function clearSavedResults() {
  localStorage.removeItem(savedKey);
  renderSavedResults();
  showToast("Saved results cleared.");
}

function buildExportText(result) {
  return `QSpark AI Question Bank\nClass: ${result.input.className}\nSubject: ${result.input.subject}\nChapter: ${result.input.chapter}\n\nMCQs\n${result.mcqs.map((mcq, index) => {
      let txt = `${index + 1}. ${mcq.question}\n${mcq.options.join("\n")}\nAnswer: ${mcq.answer}`;
      if(mcq.explanation) txt += `\nExplanation: ${mcq.explanation}`;
      return txt;
  }).join("\n\n")}\n\nShort Answer Questions\n${result.shortQuestions.map((q, i) => `${i + 1}. ${q}`).join("\n")}\n\nLong Answer Questions\n${result.longQuestions.map((q, i) => `${i + 1}. ${q}`).join("\n")}`;
}

function toggleTheme() {
  const root = document.documentElement;
  const nextTheme = root.classList.contains("dark") ? "light" : "dark";
  root.classList.toggle("dark", nextTheme === "dark");
  localStorage.setItem(themeKey, nextTheme);
}

function applyStoredTheme() {
  const storedTheme = localStorage.getItem(themeKey);
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  document.documentElement.classList.toggle("dark", (storedTheme || (prefersDark ? "dark" : "light")) === "dark");
}

function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "fixed bottom-24 right-6 z-50 rounded-2xl bg-ink px-4 py-3 text-sm font-semibold text-white shadow-xl transition-all duration-300 dark:bg-white dark:text-slate-900";
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2400);
}

document.addEventListener("DOMContentLoaded", init);
