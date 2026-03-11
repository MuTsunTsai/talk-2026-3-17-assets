(function () {
	"use strict";

	let filteredOrders = [...ORDERS];

	// ===== 渲染表格 =====

	function renderTable(orders) {
		const tbody = document.querySelector("#ordersTable tbody");
		if (!tbody) return;

		if (orders.length === 0) {
			tbody.innerHTML = `
				<tr>
					<td colspan="7" class="text-center text-muted py-4">查無符合條件的訂單</td>
				</tr>
			`;
			return;
		}

		tbody.innerHTML = orders.map(o => {
			const cfg = STATUS_CONFIG[o.status];
			return `
				<tr>
					<td><span class="order-id">${o.id}</span></td>
					<td>
						<div style="font-weight:500;">${o.customer}</div>
						<div class="text-muted" style="font-size:0.78rem;">${o.email}</div>
					</td>
					<td>${o.items} 件</td>
					<td class="order-amount">NT$ ${o.total.toLocaleString()}</td>
					<td><span class="badge ${cfg.badgeClass}">${cfg.label}</span></td>
					<td class="text-muted">${o.createdAt}</td>
					<td>
						<div class="dropdown">
							<button class="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
								操作
							</button>
							<ul class="dropdown-menu dropdown-menu-end">
								<li><a class="dropdown-item" href="#" onclick="showOrderDetail('${o.id}');return false;">查看詳情</a></li>
								<li><a class="dropdown-item" href="#">編輯訂單</a></li>
								<li><hr class="dropdown-divider"></li>
								<li><a class="dropdown-item text-danger" href="#">取消訂單</a></li>
							</ul>
						</div>
					</td>
				</tr>
			`;
		}).join("");

		const countEl = document.getElementById("filterResultCount");
		if (countEl) countEl.textContent = `共 ${orders.length} 筆`;
	}

	// ===== 篩選邏輯 =====

	function applyFilter() {
		const status = document.getElementById("filterStatus").value;
		const dateFrom = document.getElementById("filterDateFrom").value;
		const dateTo = document.getElementById("filterDateTo").value;
		const keyword = document.getElementById("filterKeyword").value.trim().toLowerCase();

		filteredOrders = ORDERS.filter(o => {
			if (status && o.status !== status) return false;
			if (dateFrom && o.createdAt < dateFrom) return false;
			if (dateTo && o.createdAt > dateTo) return false;
			if (keyword && !o.customer.toLowerCase().includes(keyword) && !o.id.toLowerCase().includes(keyword)) return false;
			return true;
		});

		renderTable(filteredOrders);
	}

	function resetFilter() {
		document.getElementById("filterStatus").value = "";
		document.getElementById("filterDateFrom").value = "2024-03-01";
		document.getElementById("filterDateTo").value = "2024-03-22";
		document.getElementById("filterKeyword").value = "";
		filteredOrders = [...ORDERS];
		renderTable(filteredOrders);
	}

	// ===== 訂單詳情 Modal =====

	window.showOrderDetail = function (orderId) {
		const order = ORDERS.find(o => o.id === orderId);
		if (!order) return;

		const cfg = STATUS_CONFIG[order.status];

		document.getElementById("modalOrderId").textContent = `訂單 ${order.id}`;
		document.getElementById("modalOrderBody").innerHTML = `
			<div class="row g-3">
				<div class="col-md-6">
					<div class="mb-3">
						<label class="form-label text-muted" style="font-size:0.8rem;">客戶姓名</label>
						<div class="fw-semibold">${order.customer}</div>
					</div>
					<div class="mb-3">
						<label class="form-label text-muted" style="font-size:0.8rem;">電子郵件</label>
						<div>${order.email}</div>
					</div>
					<div class="mb-3">
						<label class="form-label text-muted" style="font-size:0.8rem;">建立日期</label>
						<div>${order.createdAt}</div>
					</div>
				</div>
				<div class="col-md-6">
					<div class="mb-3">
						<label class="form-label text-muted" style="font-size:0.8rem;">訂單狀態</label>
						<div><span class="badge ${cfg.badgeClass} fs-6">${cfg.label}</span></div>
					</div>
					<div class="mb-3">
						<label class="form-label text-muted" style="font-size:0.8rem;">商品數量</label>
						<div>${order.items} 件</div>
					</div>
					<div class="mb-3">
						<label class="form-label text-muted" style="font-size:0.8rem;">訂單金額</label>
						<div class="fw-bold fs-5">NT$ ${order.total.toLocaleString()}</div>
					</div>
				</div>
			</div>
			<hr>
			<div class="mb-2">
				<label class="form-label text-muted" style="font-size:0.8rem;">備註</label>
				<textarea class="form-control" rows="3" placeholder="無備註"></textarea>
			</div>
		`;

		const modal = new bootstrap.Modal(document.getElementById("orderDetailModal"));
		modal.show();
	};

	// ===== 初始化 =====

	function init() {
		renderTable(ORDERS);

		document.getElementById("btnFilter").addEventListener("click", applyFilter);
		document.getElementById("btnReset").addEventListener("click", resetFilter);
		document.getElementById("filterKeyword").addEventListener("keydown", function (e) {
			if (e.key === "Enter") applyFilter();
		});
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", init);
	} else {
		init();
	}
})();
