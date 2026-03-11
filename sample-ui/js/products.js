(function () {

	let displayProducts = PRODUCTS.slice();

	// ===== 渲染表格 =====

	function renderTable() {
		const tbody = document.querySelector("#productsTable tbody");
		if (!tbody) return;

		if (displayProducts.length === 0) {
			tbody.innerHTML = `
				<tr>
					<td colspan="6" class="text-center text-muted py-4">查無商品</td>
				</tr>
			`;
			return;
		}

		tbody.innerHTML = displayProducts.map(p => {
			const isLow = p.stock <= 10;
			const isWarning = p.stock > 10 && p.stock <= 30;
			const stockClass = isLow ? "stock-low" : (isWarning ? "stock-warning" : "");
			const stockBadge = isLow
				? `<span class="badge bg-danger ms-1" style="font-size:0.7rem;">低庫存</span>`
				: (isWarning ? `<span class="badge bg-warning text-dark ms-1" style="font-size:0.7rem;">注意</span>` : "");

			return `
				<tr>
					<td style="padding:0.75rem 1rem;vertical-align:middle;">
						<div style="font-weight:500;font-size:0.9rem;">${p.name}</div>
						<div style="font-size:0.78rem;color:#a0aec0;">${p.specs.color} · ${p.specs.weight}</div>
					</td>
					<td style="padding:0.75rem 1rem;vertical-align:middle;">
						<span class="badge bg-light text-dark border">${p.category}</span>
					</td>
					<td style="padding:0.75rem 1rem;vertical-align:middle;font-family:monospace;font-size:0.82rem;color:#718096;">${p.sku}</td>
					<td style="padding:0.75rem 1rem;vertical-align:middle;font-weight:600;">NT$ ${p.price.toLocaleString()}</td>
					<td style="padding:0.75rem 1rem;vertical-align:middle;">
						<span class="stock-value ${stockClass}" id="stock-${p.id}">${p.stock}</span>
						${stockBadge}
					</td>
					<td style="padding:0.75rem 1rem;vertical-align:middle;">
						<div class="stock-control">
							<button class="btn-stock" onclick="adjustStock('${p.id}', -1)" title="減少庫存">−</button>
							<button class="btn-stock" onclick="adjustStock('${p.id}', +1)" title="增加庫存">+</button>
						</div>
					</td>
				</tr>
			`;
		}).join("");
	}

	// ===== 庫存調整 =====

	window.adjustStock = function (productId, delta) {
		const product = PRODUCTS.find(p => p.id === productId);
		if (!product) return;

		product.stock = product.stock + delta;

		renderTable();

		const stockEl = document.getElementById("stock-" + productId);
		if (stockEl) stockEl.textContent = product.stock;
	};

	// ===== 低庫存警示 =====

	function renderLowStockAlert() {
		const lowItems = PRODUCTS.filter(p => p.stock <= 10);
		const alertEl = document.getElementById("lowStockAlert");
		const msgEl = document.getElementById("lowStockMsg");

		if (!alertEl || !msgEl) return;

		if (lowItems.length === 0) {
			alertEl.style.display = "none";
			return;
		}

		msgEl.innerHTML = `<strong>${lowItems.length} 項商品庫存不足（≤10）：</strong>
			${lowItems.map(p => `<span class="badge bg-warning text-dark me-1">${p.name}（${p.stock}）</span>`).join("")}`;
	}

	// ===== 篩選 =====

	function applyFilter() {
		const keyword = document.getElementById("productSearch").value.trim().toLowerCase();
		const category = document.getElementById("categoryFilter").value;
		const stockFilter = document.getElementById("stockFilter").value;

		displayProducts = PRODUCTS.filter(p => {
			if (keyword && !p.name.toLowerCase().includes(keyword) && !p.sku.toLowerCase().includes(keyword)) return false;
			if (category && p.category !== category) return false;
			if (stockFilter === "low" && p.stock > 10) return false;
			if (stockFilter === "normal" && p.stock <= 10) return false;
			return true;
		});

		renderTable();
	}

	// ===== 初始化 =====

	function init() {
		renderLowStockAlert();
		renderTable();

		document.getElementById("btnProductSearch").addEventListener("click", applyFilter);
		document.getElementById("productSearch").addEventListener("keydown", function (e) {
			if (e.key === "Enter") applyFilter();
		});
		document.getElementById("categoryFilter").addEventListener("change", applyFilter);
		document.getElementById("stockFilter").addEventListener("change", applyFilter);
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", init);
	} else {
		init();
	}

})();
