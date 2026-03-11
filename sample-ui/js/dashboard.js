(function () {
	"use strict";

	// ===== KPI 統計卡片 =====

	function renderStats() {
		const container = document.getElementById("statsRow");
		if (!container) return;

		const totalOrders = ORDERS.length;
		const shippedToday = ORDERS.filter(o => o.status === "shipped").length;
		const pending = ORDERS.filter(o => o.status === "pending" || o.status === "processing").length;
		const cancelled = ORDERS.filter(o => o.status === "cancelled").length;
		const totalRevenue = ORDERS.reduce((sum, o) => sum + o.total, 0);

		const stats = [
			{
				icon: "📦",
				iconBg: "rgba(74,158,255,0.12)",
				iconColor: "#4a9eff",
				value: totalOrders,
				label: "總訂單數",
				change: "+12%",
				changeType: "up",
			},
			{
				icon: "🚚",
				iconBg: "rgba(72,187,120,0.12)",
				iconColor: "#48bb78",
				value: shippedToday,
				label: "出貨中",
				change: "+5%",
				changeType: "up",
			},
			{
				icon: "⏳",
				iconBg: "rgba(237,137,54,0.12)",
				iconColor: "#ed8936",
				value: pending,
				label: "待處理",
				change: "-3%",
				changeType: "down",
			},
			{
				icon: "💰",
				iconBg: "rgba(159,122,234,0.12)",
				iconColor: "#9f7aea",
				value: "NT$ " + totalRevenue.toLocaleString(),
				label: "總營收",
				change: "+8%",
				changeType: "up",
			},
		];

		container.innerHTML = stats.map(s => `
			<div class="col-sm-6 col-xl-3">
				<div class="stat-card">
					<div class="stat-card-icon" style="background:${s.iconBg};">
						<span>${s.icon}</span>
					</div>
					<div class="stat-card-value">${s.value}</div>
					<div class="stat-card-label">${s.label}</div>
					<div class="stat-card-change ${s.changeType === "up" ? "text-success" : "text-danger"}">
						${s.changeType === "up" ? "▲" : "▼"} ${s.change} 較上週
					</div>
				</div>
			</div>
		`).join("");
	}

	// ===== 折線圖（Chart.js）=====

	function renderTrendChart() {
		const canvas = document.getElementById("trendChart");
		if (!canvas) return;

		new Chart(canvas, {
			type: "line",
			data: {
				labels: ["3/16", "3/17", "3/18", "3/19", "3/20", "3/21", "3/22"],
				datasets: [{
					label: "訂單數",
					data: [8, 12, 7, 15, 11, 14, 20],
					borderColor: "#4a9eff",
					borderWidth: 2.5,
					pointBackgroundColor: "#4a9eff",
					pointBorderColor: "#fff",
					pointBorderWidth: 2,
					pointRadius: 4,
					fill: true,
					backgroundColor: function (context) {
						const gradient = context.chart.ctx.createLinearGradient(0, 0, 0, context.chart.height);
						gradient.addColorStop(0, "rgba(74,158,255,0.2)");
						gradient.addColorStop(1, "rgba(74,158,255,0)");
						return gradient;
					},
					tension: 0.3,
				}],
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					legend: { display: false },
				},
				scales: {
					x: {
						grid: { color: "#e2e8f0" },
						ticks: { color: "#a0aec0", font: { size: 11 } },
					},
					y: {
						min: 0,
						max: 25,
						grid: { color: "#e2e8f0" },
						ticks: { color: "#a0aec0", font: { size: 11 } },
					},
				},
			},
		});
	}

	// ===== 狀態分佈 =====

	function renderStatusDist() {
		const container = document.getElementById("statusDist");
		if (!container) return;

		const counts = {};
		ORDERS.forEach(o => {
			counts[o.status] = (counts[o.status] || 0) + 1;
		});

		const total = ORDERS.length;
		const items = Object.entries(counts).map(([status, count]) => ({
			status,
			count,
			pct: Math.round((count / total) * 100),
			config: STATUS_CONFIG[status],
		}));

		container.innerHTML = items.map(item => `
			<div class="mb-3">
				<div class="d-flex justify-content-between align-items-center mb-1">
					<span class="badge ${item.config.badgeClass}">${item.config.label}</span>
					<span class="text-muted" style="font-size:0.85rem;">${item.count} 筆（${item.pct}%）</span>
				</div>
				<div class="progress" style="height:6px;">
					<div class="progress-bar ${item.config.badgeClass}" style="width:${item.pct}%;"></div>
				</div>
			</div>
		`).join("");
	}

	// ===== 最新訂單列表（最近 5 筆）=====

	function renderRecentOrders() {
		const tbody = document.querySelector("#recentOrdersTable tbody");
		if (!tbody) return;

		const recent = [...ORDERS].slice(-5).reverse();

		tbody.innerHTML = recent.map(o => {
			const cfg = STATUS_CONFIG[o.status];
			return `
				<tr>
					<td><span class="order-id">${o.id}</span></td>
					<td>${o.customer}</td>
					<td>${o.items}</td>
					<td class="order-amount">NT$ ${o.total.toLocaleString()}</td>
					<td><span class="badge ${cfg.badgeClass}">${cfg.label}</span></td>
					<td class="text-muted">${o.createdAt}</td>
				</tr>
			`;
		}).join("");
	}

	// ===== 初始化 =====

	renderStats();
	renderStatusDist();
	renderRecentOrders();
	renderTrendChart();
})();
