export default function Wrapper({ children }: { children: React.ReactNode }) {
	return (
		<div className="w-full max-w-4xl flex flex-col items-center px-4 py-6 space-y-10">
			{children}
		</div>
	);
}
