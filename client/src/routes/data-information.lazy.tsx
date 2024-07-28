import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/data-information")({
	component: DataInformation,
});

export function DataInformation() {
	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-2xl font-bold mb-4">Your Data Rights</h1>

			<section className="mb-6">
				<p className="mb-2">
					Under the General Data Protection Regulation (GDPR), you have several
					rights concerning your personal data. As a user of Chemnitz Maps, an
					educational project, we are committed to upholding these rights.
				</p>
			</section>

			<section className="mb-6">
				<h2 className="text-xl font-semibold mb-2">1. Right to Access</h2>
				<p>
					You have the right to access all personal data we hold about you. You
					can view your stored data directly in your profile within the
					application. This includes your username, first name, last name,
					email, saved addresses, and any favorite locations.
				</p>
			</section>

			<section className="mb-6">
				<h2 className="text-xl font-semibold mb-2">
					2. Right to Rectification
				</h2>
				<p>
					If you believe any of your personal data is inaccurate or incomplete,
					you have the right to have this information corrected. You can update
					most of your information directly through your profile settings.
				</p>
			</section>

			<section className="mb-6">
				<h2 className="text-xl font-semibold mb-2">
					3. Right to Erasure (Right to be Forgotten)
				</h2>
				<p>
					You have the right to request the deletion of your personal data. You
					can delete your account and all associated data at any time through
					your account settings. Upon deletion, we will remove all your personal
					data from our systems within 30 days.
				</p>
			</section>

			<section className="mb-6">
				<h2 className="text-xl font-semibold mb-2">
					4. Right to Restrict Processing
				</h2>
				<p>
					In certain circumstances, you have the right to request that we
					restrict the processing of your personal data. If you believe this
					applies to your situation, please contact us.
				</p>
			</section>

			<section className="mb-6">
				<h2 className="text-xl font-semibold mb-2">5. Right to Object</h2>
				<p>
					You have the right to object to the processing of your personal data
					in certain circumstances. As we process your data based on your
					consent, you can withdraw this consent at any time by deleting your
					account.
				</p>
			</section>

			<section className="mb-6">
				<h2 className="text-xl font-semibold mb-2">Data Usage and Sharing</h2>
				<p>
					We use your data solely for creating and maintaining your profile
					within our application and providing the services you've requested.
					This includes personalizing your experience and improving our
					educational project. We do not share your personal information with
					any third parties.
				</p>
			</section>

			<section className="mb-6">
				<h2 className="text-xl font-semibold mb-2">Exercising Your Rights</h2>
				<p>
					You can exercise most of these rights directly through your account
					settings in the application. For any additional requests or questions
					about your data rights, please contact us at:
				</p>
				<p className="mt-2">Email: alejandrowurts@gmail.com</p>
			</section>

			<section className="mb-6">
				<h2 className="text-xl font-semibold mb-2">Response Time</h2>
				<p>
					We will respond to your data rights requests within one month. If the
					request is complex or we receive a high volume of requests, this
					period may be extended by two further months. We will inform you of
					any such extension within one month of receipt of your request.
				</p>
			</section>
		</div>
	);
}
