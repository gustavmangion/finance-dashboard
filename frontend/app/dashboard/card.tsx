import { Card, CardContent, CircularProgress } from "@mui/material";
import styles from "../styles/dashboard.module.scss";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import { getMoneyFormat } from "../helpers/moneyHelper";

type Props = {
	title: string;
	loading: boolean;
	current: number | undefined;
	previous: number | undefined;
};

export default function NumberCard({
	title,
	loading,
	current,
	previous,
}: Props) {
	return (
		<Card className={styles.card}>
			<CardContent>
				<h4>{title}</h4>
				{loading ? (
					<CircularProgress className={styles.spinner} />
				) : (
					<>
						<p>
							<strong>{getMoneyFormat(current!)}</strong>
						</p>
						{getTrendIcon()}
						<small>
							<strong>{getMoneyFormat(previous!)}</strong>
						</small>
					</>
				)}
			</CardContent>
		</Card>
	);

	function getTrendIcon() {
		if (current! > previous!)
			return <TrendingUpIcon className={styles.trendUp} />;
		if (current! < previous!)
			return <TrendingDownIcon className={styles.trendDown} />;

		return <TrendingFlatIcon className={styles.trendFlat} />;
	}
}
