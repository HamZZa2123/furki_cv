const imageFiles = ["images/2.jpg", "images/3.jpg", "images/4.jpg", "images/5.jpg", "images/7.jpg", "images/6.jpg"];

const bookElement = document.getElementById("book");
const prevBtn = document.getElementById("prevPageBtn");
const nextBtn = document.getElementById("nextPageBtn");
const pageCounter = document.getElementById("pageCounter");

const createPage = (src, caption, options = {}) => {
  const page = document.createElement("div");
  const classNames = ["page"];

  if (options.hard) {
    classNames.push("hard");
  }
  if (options.empty) {
    classNames.push("empty");
  }
  page.className = classNames.join(" ");

  if (!options.empty) {
    const img = document.createElement("img");
    img.src = src;
    img.alt = caption;
    img.loading = "lazy";
    page.appendChild(img);
  }

  const text = document.createElement("p");
  text.textContent = caption;
  page.appendChild(text);

  return page;
};

if (!bookElement || !window.St?.PageFlip) {
  throw new Error("Kitap bileseni veya PageFlip kutuphanesi bulunamadi.");
}

bookElement.innerHTML = "";

const frontCover = imageFiles[0];
const backCover = imageFiles[imageFiles.length - 1];
const innerPages = imageFiles.slice(1, -1);

bookElement.appendChild(createPage(frontCover, "Kapak"));
innerPages.forEach((src, idx) => {
  bookElement.appendChild(createPage(src, `Sayfa ${idx + 1}`));
});

// Cift gorunumde sayfa dengesini koruyup kaymayi azaltir.
if ((innerPages.length + 2) % 2 !== 0) {
  bookElement.appendChild(createPage("", "Bos Sayfa", { empty: true }));
}

bookElement.appendChild(createPage(backCover, "Arka Kapak"));

const pageFlip = new St.PageFlip(bookElement, {
  width: 420,
  height: 560,
  size: "stretch",
  minWidth: 260,
  maxWidth: 460,
  minHeight: 360,
  maxHeight: 620,
  maxShadowOpacity: 0.65,
  drawShadow: true,
  flippingTime: 950,
  usePortrait: true,
  showPageCorners: true,
  disableFlipByClick: true,
  showCover: false,
  mobileScrollSupport: false
});

pageFlip.loadFromHTML(document.querySelectorAll(".page"));

const syncUi = () => {
  const current = pageFlip.getCurrentPageIndex() + 1;
  const total = pageFlip.getPageCount();

  if (pageCounter) {
    pageCounter.textContent = `${current} / ${total}`;
  }
  if (prevBtn) {
    prevBtn.disabled = current <= 1;
  }
  if (nextBtn) {
    nextBtn.disabled = current >= total;
  }
};

if (prevBtn) {
  prevBtn.addEventListener("click", () => pageFlip.flipPrev());
}
if (nextBtn) {
  nextBtn.addEventListener("click", () => pageFlip.flipNext());
}

pageFlip.on("flip", syncUi);
pageFlip.on("init", syncUi);
syncUi();
