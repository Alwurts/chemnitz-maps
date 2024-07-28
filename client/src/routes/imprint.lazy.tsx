import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/imprint")({
	component: Imprint,
});

export function Imprint() {
	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-2xl font-bold mb-4">Imprint (Impressum)</h1>

			<section className="mb-6">
				<h2 className="text-xl font-semibold mb-2">
					Information according to § 5 TMG
				</h2>
				<p>Alejandro Wurts Santos</p>
			</section>

			<section className="mb-6">
				<h2 className="text-xl font-semibold mb-2">Contact</h2>
				<p>Email: alejandrowurts@gmail.com</p>
			</section>

			<section className="mb-6">
				<h2 className="text-xl font-semibold mb-2">
					Responsible for content according to § 55 Abs. 2 RStV
				</h2>
				<p>Alejandro Wurts Santos</p>
			</section>

			<section className="mb-6">
				<h2 className="text-xl font-semibold mb-2">
					Educational Project Information
				</h2>
				<p>
					This web application, "Chemnitz Maps", is a non-commercial project
					created for educational and demonstration purposes.
				</p>
			</section>

			<section className="mb-6">
				<h2 className="text-xl font-semibold mb-2">Disclaimer</h2>
				<p>
					This is not a commercial entity. The application is provided as-is
					without any warranties. The creator is not liable for any damages or
					losses resulting from the use of this application.
				</p>
			</section>

			<section className="mb-6">
				<h2 className="text-xl font-semibold mb-2">Copyright</h2>
				<p>
					The contents and works created by the site operators on these pages
					are subject to German copyright law. Duplication, processing,
					distribution, or any form of commercialization of such material beyond
					the scope of the copyright law shall require the prior written consent
					of its respective author or creator.
				</p>
			</section>

			<section className="mb-6">
				<h2 className="text-xl font-semibold mb-2">External Links</h2>
				<p>
					This website contains links to external third-party websites, over
					whose content we have no control. Therefore, we cannot accept any
					liability for this external content. The respective provider or
					operator of the linked pages is always responsible for their content.
				</p>
			</section>
		</div>
	);
}
