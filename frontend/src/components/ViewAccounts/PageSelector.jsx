import "./PageSelector.css"

export default function PageSelector({ page, setPage, totalPages }) {
	return (
		<div className="page-selector">
			<button
				className={`page-btn ${page === 1 ? "" : "active"}`}
				onClick={() => setPage(page - 1)}
				disabled={page === 1}
			>
				Previous
			</button>

			<span className="page-info">
				Page {page} of {totalPages}
			</span>

			<button
				className={`page-btn ${page < totalPages ? "active" : ""}`}
				onClick={() => setPage(page + 1)}
				disabled={page >= totalPages}
			>
				Next
			</button>
		</div>
	)
}
