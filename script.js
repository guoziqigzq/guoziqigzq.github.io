"use strict";

document.getElementById("current-year").textContent = new Date().getFullYear();

// 导航跟随阅读位置；关闭 JavaScript 仍然可以使用全部章节链接。
const navLinks = [...document.querySelectorAll(".navigation a")];
const sections = navLinks.map(link => document.querySelector(link.hash));
let scrollPending = false;
function updateNavigation() {
  const offset = document.querySelector(".topbar").offsetHeight + 56;
  let active = sections[0];
  for (const section of sections) {
    if (section.getBoundingClientRect().top <= offset) active = section;
  }
  if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4) {
    active = sections[sections.length - 1];
  }
  for (const link of navLinks) {
    if (link.hash === `#${active.id}`) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  }
  scrollPending = false;
}
window.addEventListener("scroll", () => {
  if (!scrollPending) {
    scrollPending = true;
    window.requestAnimationFrame(updateNavigation);
  }
}, { passive: true });
window.addEventListener("resize", updateNavigation);
updateNavigation();

for (const button of document.querySelectorAll(".copy-citation")) {
  button.addEventListener("click", async () => {
    const code = button.closest(".citation-content").querySelector("code");
    const status = document.getElementById("copy-status");
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(code.textContent.trim());
      button.textContent = "已复制";
      status.textContent = "BibTeX 引用已复制。";
    } catch {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(code);
      selection.removeAllRanges();
      selection.addRange(range);
      button.textContent = "请手动复制选中文字";
      status.textContent = "浏览器未允许自动复制，引用文字已选中，请手动复制。";
    }
    window.setTimeout(() => { button.textContent = "复制引用"; }, 3000);
  });
}
