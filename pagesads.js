// pagesads.js - Auto-Injecting Alternating Adsterra System (Banner + Native)

let adObserver = null;

// ==========================================
// 1. AD OBSERVER & INJECTION LOGIC
// ==========================================
function resolveContainer(target) {
  if (!target) return null;
  return typeof target === "string" ? document.querySelector(target) : target;
}

function getObserver() {
  if (adObserver || typeof window === "undefined" || !("IntersectionObserver" in window)) {
    return adObserver;
  }

  adObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        
        renderAd(entry.target, entry.target.dataset.adPlacement);
        adObserver.unobserve(entry.target);
      });
    },
    { rootMargin: "180px 0px", threshold: 0.1 }
  );

  return adObserver;
}

function queueAdRender(container, placement) {
  const target = resolveContainer(container);

  if (!target || target.dataset.adLoaded === "true") return;

  target.dataset.adPlacement = placement;
  target.classList.remove("hidden");

  const observer = getObserver();

  if (!observer) {
    renderAd(target, placement);
    return;
  }

  observer.observe(target);
}

// 🔥 MAIN FUNCTION: Iframe Method for Both Standard & Native In-Article Ads
function renderAd(container, placement) {
  if (!container || container.dataset.adLoaded === "true") return;

  container.style.minHeight = "90px";
  container.style.display = "flex";
  container.style.justifyContent = "center";
  container.style.margin = "30px 0";
  container.style.backgroundColor = "transparent";

  let width = 728;
  let height = 90;
  let adKey = '';
  let isNative = false;
  let nativeUrl = 'https://www.topcreativeformat.com/';

  // 🎯 PLACEMENT LOGIC
  if (placement === "article-native") {
    isNative = true;
    width = "100%";
    height = 300;
    adKey = '5dc370d1d2732446ba768266adc1e90a'; // Tumhari Native Ad Key jo tumne pehle di thi
  } else {
    width = 728;
    height = 90;
    // 🚨 IMPORTANT: Yahan apne Adsterra Dashboard se ek NAYI 728x90 In-Article key daalna
    adKey = 'f3d445155b697e5126b8e43360b5c63f'; 
  }

  // Agar nayi key nahi daali hai, toh Placeholder dikhega
  if (!adKey || adKey.includes('PUT_')) {
    container.innerHTML = `<div style="color:#94a3b8; padding:20px; text-align:center; border:1px dashed #475569; border-radius:8px; width:100%; max-width:${isNative ? '100%' : width+'px'};">Article Ad Space (${isNative ? 'Native' : 'Banner'})<br><small style="font-size:10px;">Awaiting Unique Key</small></div>`;
    container.dataset.adLoaded = "true";
    return;
  }

  // Creating Iframe to bypass ad-blockers
  const iframe = document.createElement('iframe');
  iframe.width = width;
  iframe.height = height;
  iframe.frameBorder = "0";
  iframe.scrolling = "no";
  iframe.style.border = "none";
  iframe.style.overflow = "hidden";
  iframe.style.margin = "0 auto";
  iframe.style.backgroundColor = "transparent";

  container.innerHTML = ''; 
  container.appendChild(iframe);

  // Injecting Adsterra Script inside Iframe
  const iframeDoc = iframe.contentWindow.document;
  iframeDoc.open();

  if (isNative) {
    // 🔥 NATIVE AD CODE
    iframeDoc.write(`
      <!DOCTYPE html>
      <html>
      <head><title>Native Ad</title></head>
      <body style="margin:0;padding:0;background:transparent;">
        <script async="async" data-cfasync="false" src="${nativeUrl}${adKey}/invoke.js"><\/script>
        <div id="container-${adKey}"></div>
      </body>
      </html>
    `);
  } else {
    // 🔥 STANDARD BANNER CODE
    iframeDoc.write(`
      <!DOCTYPE html>
      <html>
      <head><title>Ad</title></head>
      <body style="margin:0;padding:0;text-align:center;background:transparent;">
        <script type="text/javascript">
          atOptions = {
            'key' : '${adKey}',
            'format' : 'iframe',
            'height' : ${height},
            'width' : ${width},
            'params' : {}
          };
        <\/script>
        <script type="text/javascript" src="https://www.topcreativeformat.com/${adKey}/invoke.js"><\/script>
      </body>
      </html>
    `);
  }

  iframeDoc.close();
  container.dataset.adLoaded = "true";
}

// ==========================================
// 2. AUTO-INJECTOR MAGIC (Alternating Setup)
// ==========================================
function autoInjectAds() {
  const sections = document.querySelectorAll('.content-container section');
  if (sections.length === 0) return;

  let adCounter = 0; // Ye counter ads ko mix karne ka kaam karega

  sections.forEach((section) => {
    const paragraphs = section.querySelectorAll('p');
    if (paragraphs.length < 2) return;

    // Har 3 paragraph ke baad ad inject hoga
    for (let i = 1; i < paragraphs.length; i += 3) {
      const adContainer = document.createElement('div');
      adContainer.className = 'auto-injected-ad hidden';
      
      // Magic Trick: Even number pe Banner, Odd number pe Native
      const placementType = (adCounter % 2 === 0) ? "article-banner" : "article-native";
      
      paragraphs[i].parentNode.insertBefore(adContainer, paragraphs[i].nextSibling);
      queueAdRender(adContainer, placementType);
      
      adCounter++;
    }
  });
}

// Page load hote hi articles ke andar ads auto-inject hongi
document.addEventListener("DOMContentLoaded", () => {
    setTimeout(autoInjectAds, 500); 
});