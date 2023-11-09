import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Button,
	MenuItem,
	Select,
	SelectChangeEvent,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import styles from "../styles/dashboard.module.scss";
import { DatePicker } from "@mui/x-date-pickers";
import { Dayjs } from "dayjs";
import Portfolio from "../apis/base/portfolio/types";
import { useState } from "react";

type Props = {
	filterState: {
		from: Dayjs;
		to: Dayjs;
		portfolioId: string;
	};
	portfolios: Portfolio[];
	setFilterState: (filterState: {
		from: Dayjs;
		to: Dayjs;
		portfolioId: string;
	}) => void;
	resetFilterState: () => void;
};

export default function FilterPanel({
	filterState,
	portfolios,
	setFilterState,
	resetFilterState,
}: Props) {
	const [expanded, setExpanded] = useState(false);
	return (
		<Accordion
			className={styles.filter}
			onChange={() => setExpanded(!expanded)}
		>
			<AccordionSummary expandIcon={<ExpandMoreIcon />}>
				<div
					className={[
						styles.header,
						expanded ? styles.expanded : styles.collapsed,
					].join(" ")}
				>
					<h4>Filter</h4>
					<small>{`${filterState.from.format(
						"DD/MM/YY"
					)} to ${filterState.to.format("DD/MM/YY")}`}</small>
				</div>
			</AccordionSummary>
			<AccordionDetails>
				<div className={styles.fields}>
					<div>
						<DatePicker
							label="From"
							value={filterState.from}
							onChange={handleChangeFromDate}
						/>
						<DatePicker
							className={styles.marginTop}
							label="To"
							value={filterState.to}
							onChange={handleChangeToDate}
						/>
					</div>
					<div>
						<Select
							name="portfolioId"
							label="Portfolio"
							variant="standard"
							onChange={handleSelectChange}
							value={filterState.portfolioId}
							required
							placeholder="Portfolio"
						>
							{mapPortfolioOptions()}
						</Select>
						<Button
							className={styles.marginTop}
							variant="contained"
							color="secondary"
							onClick={resetFilterState}
						>
							Reset Filter
						</Button>
					</div>
				</div>
			</AccordionDetails>
		</Accordion>
	);

	function handleChangeFromDate(e: Dayjs | null) {
		if (e! > filterState.to)
			setFilterState({
				...filterState,
				from: e!,
				to: e!.add(1, "day"),
			});
		else {
			setFilterState({
				...filterState,
				from: e!,
			});
		}
	}

	function handleChangeToDate(e: Dayjs | null) {
		if (e! < filterState.from)
			setFilterState({
				...filterState,
				to: e!,
				from: e!.add(-1, "day"),
			});
		else {
			setFilterState({
				...filterState,
				to: e!,
			});
		}
	}

	function handleSelectChange(e: SelectChangeEvent) {
		console.log("here");
		setFilterState({
			...filterState,
			[e.target.name]: e.target.value,
		});
	}

	function mapPortfolioOptions() {
		const options: React.ReactElement[] = [];
		options.push(
			<MenuItem key="All" value="All">
				All
			</MenuItem>
		);
		portfolios.map((x) => {
			options.push(
				<MenuItem key={x.id} value={x.id}>
					{x.name}
				</MenuItem>
			);
		});

		return options;
	}
}
