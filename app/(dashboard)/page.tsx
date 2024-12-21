import { UserButton } from "@clerk/nextjs";

export default function DashboardPage() {
	return (
		<p>
			This is an authenticated route
			<UserButton />
		</p>
	);
}
