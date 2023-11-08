import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import styles from "../styles/dashboard.module.scss";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { ChangeEvent } from "react";

type Props = {
	filterState: {
		from: Dayjs;
		to: Dayjs;
	};
	setFilterState: (filterState: { from: Dayjs; to: Dayjs }) => void;
};

export default function FilterPanel({ filterState, setFilterState }: Props) {
	return (
		<Accordion className={styles.filter} expanded>
			<AccordionSummary expandIcon={<ExpandMoreIcon />}>
				<p>Filter</p>
			</AccordionSummary>
			<AccordionDetails>
				<DatePicker
					label="From"
					value={filterState.from}
					onChange={handleChangeFromDate}
				/>
			</AccordionDetails>
			<AccordionDetails>
				<DatePicker
					label="To"
					value={filterState.to}
					onChange={handleChangeToDate}
				/>
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
}
