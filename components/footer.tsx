import Link from "next/link";

export default function Footer() {
	return (
		<footer className="w-full pb-4 pt-4 sm:pb-6 sm:pt-6">
			<div className="flex flex-col items-center gap-4">
				<p>
					<Link
						className="font-semibold hover:text-primary"
						href="https://github.com/haiueom/nimetop"
						target="_blank"
					>
						NimeTop
					</Link>{" "}
					by{" "}
					<Link
						className="font-semibold hover:text-primary"
						href="https://github.com/haiueom"
						target="_blank"
					>
						Ilham Taufiq
					</Link>
				</p>
			</div>
		</footer>
	);
}
