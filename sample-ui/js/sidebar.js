// 側邊欄收合邏輯

(function () {
	"use strict";

	function initSidebar() {
		const sidebar = document.querySelector(".sidebar");
		const toggleBtn = document.querySelector(".sidebar-toggle-btn");
		const topbar = document.querySelector(".topbar");
		const mainContent = document.querySelector(".main-content");

		if (!sidebar || !toggleBtn) return;

		// 從 localStorage 讀取收合狀態
		const isCollapsed = localStorage.getItem("sidebarCollapsed") === "true";
		if (isCollapsed) {
			sidebar.classList.add("collapsed");
			topbar && topbar.classList.add("sidebar-collapsed");
			mainContent && mainContent.classList.add("sidebar-collapsed");
			updateToggleIcon(true);
		}

		toggleBtn.addEventListener("click", function () {
			const collapsed = sidebar.classList.toggle("collapsed");
			topbar && topbar.classList.toggle("sidebar-collapsed", collapsed);
			mainContent && mainContent.classList.toggle("sidebar-collapsed", collapsed);
			localStorage.setItem("sidebarCollapsed", collapsed);
			updateToggleIcon(collapsed);
		});

		function updateToggleIcon(collapsed) {
			const icon = toggleBtn.querySelector(".toggle-icon");
			const label = toggleBtn.querySelector(".toggle-label");
			if (icon) icon.textContent = collapsed ? "»" : "«";
			if (label) label.textContent = collapsed ? "展開選單" : "收合選單";
		}
	}

	function initBackToTop() {
		const btn = document.getElementById("backToTop");
		if (!btn) return;

		window.addEventListener("scroll", function () {
			btn.classList.toggle("visible", window.scrollY > 300);
		});

		btn.addEventListener("click", function () {
			window.scrollTo({ top: 0, behavior: "smooth" });
		});
	}

	// DOM 就緒後初始化
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", function () {
			initSidebar();
			initBackToTop();
		});
	} else {
		initSidebar();
		initBackToTop();
	}
})();
