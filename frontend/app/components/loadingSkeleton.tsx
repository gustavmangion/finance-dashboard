import { Skeleton } from "@mui/material";
import materialStyles from "../styles/material.module.scss";

export default function LoadingSkeleton() {
	return (
		<div className={materialStyles.loadingSkeleton}>
			<Skeleton />
			<Skeleton animation="wave" />
			<Skeleton />
			<Skeleton animation="wave" />
		</div>
	);
}
