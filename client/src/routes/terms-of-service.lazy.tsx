import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/terms-of-service")({
	component: TermsOfService,
});

export function TermsOfService() {
	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-2xl font-bold mb-4">Terms of Service</h1>

			<section className="mb-6">
				<h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
				<p>
					These Terms of Service govern your use of the Chemnitz Maps web
					application ("the Service"), an educational project developed by
					Alejandro Wurts Santos. By using
					the Service, you agree to these terms.
				</p>
			</section>

			<section className="mb-6">
				<h2 className="text-xl font-semibold mb-2">2. Services</h2>
				<p>
					Our web app provides users with the ability to visualize map data from
					the Chemnitz open data portal. Users can create an account to store
					their favorite locations and addresses. We offer both free and premium
					account options.
				</p>
			</section>

			<section className="mb-6">
				<h2 className="text-xl font-semibold mb-2">3. User Responsibilities</h2>
				<p>Users are expected to:</p>
				<ul className="list-disc list-inside ml-4">
					<li>
						Use the application responsibly and not engage in any activities
						that could harm its functionality.
					</li>
					<li>
						Provide accurate and up-to-date information when creating an
						account.
					</li>
					<li>Maintain the confidentiality of their account credentials.</li>
					<li>
						Respect the intellectual property rights associated with the Service
						and its content.
					</li>
				</ul>
			</section>

			<section className="mb-6">
				<h2 className="text-xl font-semibold mb-2">4. Intellectual Property</h2>
				<p>
					The Service and its original content, features, and functionality are
					owned by the project creator and are protected by international
					copyright, trademark, patent, trade secret, and other intellectual
					property laws.
				</p>
			</section>

			<section className="mb-6">
				<h2 className="text-xl font-semibold mb-2">5. Account Termination</h2>
				<p>
					We reserve the right to suspend or terminate user accounts if the
					Service is used in a manner inconsistent with its intended purpose or
					in violation of these Terms of Service. This includes, but is not
					limited to, any activities that may compromise the integrity,
					security, or functionality of the Service. Users will be notified of
					any account termination.
				</p>
			</section>

			<section className="mb-6">
				<h2 className="text-xl font-semibold mb-2">6. Data Protection</h2>
				<p>
					We process personal data in accordance with our Privacy Policy and
					applicable data protection laws, including the General Data Protection
					Regulation (GDPR). By using the Service, you consent to such
					processing and you warrant that all data provided by you is accurate.
				</p>
			</section>

			<section className="mb-6">
				<h2 className="text-xl font-semibold mb-2">
					7. Limitation of Liability
				</h2>
				<p>
					To the fullest extent permitted by applicable law, we shall not be
					liable for any indirect, incidental, special, consequential, or
					punitive damages, or any loss of profits or revenues, whether incurred
					directly or indirectly, or any loss of data, use, goodwill, or other
					intangible losses resulting from your use of the Service.
				</p>
			</section>

			<section className="mb-6">
				<h2 className="text-xl font-semibold mb-2">8. Changes to Terms</h2>
				<p>
					We reserve the right to modify or replace these Terms at any time. If
					a revision is material, we will provide at least 30 days' notice prior
					to any new terms taking effect. What constitutes a material change
					will be determined at our sole discretion.
				</p>
			</section>

			<section className="mb-6">
				<h2 className="text-xl font-semibold mb-2">9. Dispute Resolution</h2>
				<p>
					Any disputes arising out of or relating to these Terms or the Service
					will first be tried to be resolved amicably. If that is not possible,
					the dispute shall be subject to the exclusive jurisdiction of the
					courts in Chemnitz, Germany.
				</p>
			</section>

			<section className="mb-6">
				<h2 className="text-xl font-semibold mb-2">10. Age Restrictions</h2>
				<p>
					While there are no specific age restrictions for using this
					application, users should be capable of understanding and agreeing to
					these terms of service. If you are under the age of 18, you should
					review these terms with a parent or guardian to make sure you both
					understand them.
				</p>
			</section>

			<section className="mb-6">
				<h2 className="text-xl font-semibold mb-2">11. Contact Information</h2>
				<p>For any questions about these Terms of Service, please contact:</p>
				<p>Alejandro Wurts Santos</p>
				<p>Email: alejandrowurts@gmail.com</p>
			</section>
		</div>
	);
}
