import { Link } from "@tanstack/react-router";
import { Separator } from "../ui/separator";

export function SourceLink() {
	return (
		<footer className="bg-white w-screen sm:w-full sm:rounded-tr-md">
			<div className="flex flex-col sm:flex-row justify-center items-center px-4 py-2 sm:py-0 gap-1 sm:gap-4">
				<a
					className="text-xs font-medium hover:underline"
					href="https://portal-chemnitz.opendata.arcgis.com/"
					target="_blank"
					rel="noopener noreferrer"
				>
					Data sourced from the Chemnitz Open Data Portal
				</a>
				<Separator
					orientation="vertical"
					className="h-4 bg-black hidden sm:block"
				/>
				<nav>
					<ul className="flex flex-wrap justify-center items-center gap-x-4 gap-y-0">
						<li className="">
							<Link
								to="/privacy-policy"
								className="text-xs font-medium hover:underline"
							>
								Privacy Policy
							</Link>
						</li>
						<li className="">
							<Link
								to="/terms-of-service"
								className="text-xs font-medium hover:underline"
							>
								Terms of Service
							</Link>
						</li>
						<li className="">
							<Link
								to="/imprint"
								className="text-xs font-medium hover:underline"
							>
								Imprint
							</Link>
						</li>
						<li className="">
							<Link
								to="/data-information"
								className="text-xs font-medium hover:underline"
							>
								Your Data
							</Link>
						</li>
						<li className="">
							<Link
								to="/data-attribution"
								className="text-xs font-medium hover:underline"
							>
								Data Attribution
							</Link>
						</li>
					</ul>
				</nav>
			</div>
		</footer>
	);
}
