(function () {
	"use strict";

	function getStatusSteps(status) {
		const steps = ["processing", "shipped", "delivered"];
		return steps.indexOf(status);
	}

	function renderShipmentCard(s) {
		const cfg = STATUS_CONFIG[s.status];
		const lastEvent = s.events[s.events.length - 1];

		const timelineHTML = s.events.map((ev, i) => {
			const isLast = i === s.events.length - 1;
			const isCompleted = s.status === "delivered" || !isLast;
			const isActive = isLast && s.status !== "delivered";

			return `
				<div class="timeline-item ${isCompleted ? "completed" : ""} ${isActive ? "active" : ""}">
					<div class="timeline-dot"></div>
					<div class="timeline-time">${ev.time}</div>
					<div class="timeline-desc">${ev.description}</div>
					<div class="timeline-location">📍 ${ev.location}</div>
				</div>
			`;
		}).join("");

		return `
			<div class="col-lg-6">
				<div class="content-card">
					<div class="content-card-header">
						<div>
							<div style="font-weight:600;font-size:0.95rem;">${s.id}</div>
							<div class="text-muted" style="font-size:0.8rem;">訂單 ${s.orderId} · ${s.customer}</div>
						</div>
						<span class="badge ${cfg.badgeClass}">${cfg.label}</span>
					</div>
					<div class="content-card-body">
						<div class="row g-3 mb-3">
							<div class="col-6">
								<div class="text-muted" style="font-size:0.78rem;">物流業者</div>
								<div style="font-size:0.9rem;font-weight:500;">${s.carrier}</div>
							</div>
							<div class="col-6">
								<div class="text-muted" style="font-size:0.78rem;">追蹤號碼</div>
								<div style="font-size:0.9rem;font-family:monospace;">${s.trackingNo}</div>
							</div>
							<div class="col-6">
								<div class="text-muted" style="font-size:0.78rem;">預計送達</div>
								<div style="font-size:0.9rem;">${s.estimatedDelivery}</div>
							</div>
							<div class="col-6">
								<div class="text-muted" style="font-size:0.78rem;">最新動態</div>
								<div style="font-size:0.9rem;">${lastEvent.location}</div>
							</div>
						</div>
						<hr style="margin:0.75rem 0;">
						<div style="font-size:0.8rem;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;color:#a0aec0;margin-bottom:0.75rem;">物流軌跡</div>
						<div class="timeline">
							${timelineHTML}
						</div>
					</div>
				</div>
			</div>
		`;
	}

	function init() {
		const container = document.getElementById("shipmentCards");
		if (!container) return;

		container.innerHTML = SHIPMENTS.map(renderShipmentCard).join("");
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", init);
	} else {
		init();
	}
})();
