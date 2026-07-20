let adObserver = null;

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
        renderAd(entry.target, entry.target.dataset.adPlacement || "banner");
        adObserver.unobserve(entry.target);
      });
    },
    { rootMargin: "180px 0px", threshold: 0.1 }
  );

  return adObserver;
}

// Ye function ab bilkul clean hai aur sirf 1 baar declare hua hai
function queueAdRender(container, placement) {
  // 🚀 Premium users ko ads se bachane ka logic
  if (window.isAdsFree) return;

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

function renderAd(container, placement) {
  if (!container || container.dataset.adLoaded === "true" || window.isAdsFree) return;

  container.style.minHeight = "50px";
  container.style.display = "flex";
  container.style.justifyContent = "center";
  container.style.backgroundColor = "transparent";

  let width = 728;
  let height = 90;
  let adKey = ''; 
  let isNative = false;
  let nativeUrl = 'https://www.topcreativeformat.com/'; 

  if (placement === "banner") { 
    width = 728; height = 90;
    adKey = 'f3d445155b697e5126b8e43360b5c63f'; 
  } else if (placement === "between-sections") {
    width = 728; height = 90;
    adKey = '170258d51d1574eeec23cae83a0daab5'; 
  } else if (placement === "sidebar") {
    width = 300; height = 250;
    adKey = '8a96ea7b5540e1102736f0c9518d8310'; 
  } else if (placement === "sticky-banner") {
    width = 320; height = 50;
    adKey = '3d1c860480bf2f9dce8c33002555ee17'; 
  } else if (placement === "native") {
    isNative = true;
    width = "100%"; 
    height = 300;    
    adKey = '5dc370d1d2732446ba768266adc1e90a'; 
  }

  if (!adKey || adKey.includes('PUT_')) {
    container.innerHTML = `<div style="color:#94a3b8; padding:20px; text-align:center; border:1px dashed #475569; border-radius:8px; width:100%; max-width:${width === '100%' ? '728px' : width+'px'};">Ad Space (${placement})<br><small style="font-size:10px;">Awaiting Unique Key</small></div>`;
    container.dataset.adLoaded = "true";
    return;
  }

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

  const iframeDoc = iframe.contentWindow.document;
  iframeDoc.open();

  if (isNative) {
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

function loadAdBanner(container, options = {}) {
  const placement = options.sticky ? "sticky-banner" : "banner";
  queueAdRender(container, placement);
}

function loadAdBetweenSections(container) {
  queueAdRender(container, "between-sections");
}

function loadAdSidebar(container) {
  queueAdRender(container, "sidebar");
}

function loadAdNative(container) {
  queueAdRender(container, "native");
}

export {
  loadAdBanner,
  loadAdBetweenSections,
  loadAdSidebar,
  loadAdNative
};
