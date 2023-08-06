"use client";

import { useSession } from "next-auth/react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

export default function DashboardPage(): React.ReactNode {
	const { data: session } = useSession({
		required: true,
	});

	const [data, setData] = useState("");

	GetTestMessage(setData);

	return (
		<>
			<h2>This is your secure dashboard</h2>
			<h3>{data}</h3>
		</>
	);
}

function GetTestMessage(setData: Dispatch<SetStateAction<string>>) {
	useEffect(() => {
		fetch("https://localhost:7024/Dashboard/Test")
			.then((res) => res.json())
			.then((data: string) => setData(data));
	});
}
