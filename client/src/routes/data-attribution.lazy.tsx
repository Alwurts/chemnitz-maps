import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/data-attribution")({
	component: DataAttribution,
});

export function DataAttribution() {
	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-2xl font-bold mb-6">Data Attribution</h1>

			<section className="mb-8">
				<h2 className="text-xl font-semibold mb-3">Chemnitz City Open Data</h2>
				<p className="mb-2">
					This application uses open data provided by the Chemnitz City open
					data portal. We are grateful for their commitment to open data and
					transparency.
				</p>
				<p className="mb-2">
					Data Source:{" "}
					<a
						href="https://portal-chemnitz.opendata.arcgis.com/"
						className="text-blue-600 hover:underline"
						target="_blank"
						rel="noopener noreferrer"
					>
						Chemnitz Open Data Portal
					</a>
				</p>
			</section>

			<section className="mb-8">
				<h2 className="text-xl font-semibold mb-3">Google Maps</h2>
				<p className="mb-2">
					This application uses Google Maps for map visualization. The use of
					Google Maps is subject to Google's terms of service.
				</p>
				<p className="mb-2">
					Google Maps/Google Earth Additional Terms of Service:{" "}
					<a
						href="https://maps.google.com/help/terms_maps/"
						className="text-blue-600 hover:underline"
						target="_blank"
						rel="noopener noreferrer"
					>
						https://maps.google.com/help/terms_maps/
					</a>
				</p>
				<p className="mb-2">
					Google Privacy Policy:{" "}
					<a
						href="https://www.google.com/policies/privacy/"
						className="text-blue-600 hover:underline"
						target="_blank"
						rel="noopener noreferrer"
					>
						https://www.google.com/policies/privacy/
					</a>
				</p>
				<p>Map data ©2024 Google</p>
			</section>

			<section>
				<h2 className="text-xl font-semibold mb-3">Usage and Limitations</h2>
				<p className="mb-2">
					This application is created for educational purposes as part of a
					university project. The data and maps are used for demonstration and
					learning, and may not be suitable for commercial or official use
					without further verification and licensing.
				</p>
				<p>
					Users are encouraged to refer to the original data sources for the
					most up-to-date and accurate information.
				</p>
			</section>
		</div>
	);
}
