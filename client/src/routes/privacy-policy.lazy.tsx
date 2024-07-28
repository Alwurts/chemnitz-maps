import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/privacy-policy")({
	component: PrivacyPolicy,
});

export function PrivacyPolicy() {
	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-2xl font-bold mb-4">Privacy Policy</h1>

			<section className="mb-6">
				<h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
				<p>
					This Privacy Policy applies to the Chemnitz Maps web application,
					which is used for educational purposes only. We are committed to
					protecting your personal data and complying with the General Data
					Protection Regulation (GDPR).
				</p>
			</section>

			<section className="mb-6">
				<h2 className="text-xl font-semibold mb-2">
					2. Data Collection and Usage
				</h2>
				<p>We collect and process the following personal data:</p>
				<ul className="list-disc list-inside ml-4 mb-2">
					<li>Username</li>
					<li>First name</li>
					<li>Last name</li>
					<li>Email address</li>
					<li>User-provided addresses</li>
					<li>Favorite locations</li>
				</ul>
				<p>
					This data is used solely to create and manage your profile within our
					web app, provide personalized features, and improve our educational
					project. We do not share your data with any third parties.
				</p>
			</section>

			<section className="mb-6">
				<h2 className="text-xl font-semibold mb-2">
					3. Legal Basis for Processing
				</h2>
				<p>
					We process your personal data based on your consent, which you provide
					when creating an account. You can withdraw your consent at any time by
					deleting your account.
				</p>
			</section>

			<section className="mb-6">
				<h2 className="text-xl font-semibold mb-2">4. Data Retention</h2>
				<p>
					We retain your data for as long as you maintain an active account.
					Upon account deletion, all your personal data will be removed from our
					systems within 30 days.
				</p>
			</section>

			<section className="mb-6">
				<h2 className="text-xl font-semibold mb-2">
					5. Your Rights Under GDPR
				</h2>
				<p>You have the following rights regarding your personal data:</p>
				<ul className="list-disc list-inside ml-4">
					<li>Right to access your personal data</li>
					<li>Right to rectify inaccurate personal data</li>
					<li>Right to erase your personal data</li>
					<li>Right to restrict processing of your personal data</li>
					<li>Right to data portability</li>
					<li>Right to object to processing of your personal data</li>
				</ul>
				<p className="mt-2">
					You can exercise these rights through your profile settings or by
					contacting us directly.
				</p>
			</section>

			<section className="mb-6">
				<h2 className="text-xl font-semibold mb-2">6. Data Security</h2>
				<p>
					We implement appropriate technical and organizational measures to
					protect your personal data against unauthorized or unlawful
					processing, accidental loss, destruction, or damage.
				</p>
			</section>

			<section className="mb-6">
				<h2 className="text-xl font-semibold mb-2">
					7. Changes to This Policy
				</h2>
				<p>
					We may update this Privacy Policy from time to time. We will notify
					you of any changes by posting the new Privacy Policy on this page.
				</p>
			</section>

			<section className="mb-6">
				<h2 className="text-xl font-semibold mb-2">8. Contact Information</h2>
				<p>
					For any questions or concerns regarding this Privacy Policy or your
					personal data, please contact:
				</p>
				<p>Alejandro Wurts Santos</p>
				<p>Email: alejandrowurts@gmail.com</p>
			</section>
		</div>
	);
}
