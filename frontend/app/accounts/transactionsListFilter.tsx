import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Box,
	Button,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	SelectChangeEvent,
} from "@mui/material";
import styles from "../styles/account.module.scss";
import materialStyles from "../styles/material.module.scss";
import { Dayjs } from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import { useState } from "react";
import { getCategories } from "../helpers/transactionHelper";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { FilterAlt, FilterAltOff } from "@mui/icons-material";
import { TransactionParameters } from "../apis/base/transaction/types";

type Props = {
	searchParameters: TransactionParameters;
	setSearchParameters: (val: TransactionParameters) => void;
};

export default function TransactionsListFilter({
	searchParameters,
	setSearchParameters,
}: Props) {
	const [from, setForm] = useState<Dayjs | null>(null);
	const [to, setTo] = useState<Dayjs | null>(null);
	const [category, setCategory] = useState<string[]>([]);

	return (
		<Accordion className={styles.transactionsListFilter}>
			<AccordionSummary expandIcon={<ExpandMoreIcon />}>
				Filters
			</AccordionSummary>
			<AccordionDetails>
				<form onSubmit={handleFilter}>
					<DatePicker
						label="From"
						value={from}
						onChange={handleChangeFromDate}
					/>
					<DatePicker label="To" value={to} onChange={handleChangeToDate} />
					<FormControl>
						<InputLabel>Category</InputLabel>
						<Select
							name="category"
							label="Category"
							variant="standard"
							onChange={handleSelectChange}
							value={category}
							placeholder="Category"
							multiple
						>
							{getCategoryOptions()}
						</Select>
					</FormControl>
					<Box className={materialStyles.buttonsContainerTight}>
						<Button variant="contained" onClick={handleFilter}>
							<FilterAlt />
							Filter
						</Button>
						<Button variant="contained" color="secondary" onClick={handleReset}>
							<FilterAltOff />
							Reset
						</Button>
					</Box>
				</form>
			</AccordionDetails>
		</Accordion>
	);

	function handleChangeFromDate(value: Dayjs | null) {
		setForm(value);

		if ((value && !to) || (value && to && value >= to)) {
			setTo(value.add(1, "day"));
		}
	}

	function handleSelectChange(e: SelectChangeEvent<typeof category>) {
		const {
			target: { value },
		} = e;
		setCategory(typeof value === "string" ? value.split(",") : value);
	}

	function handleChangeToDate(value: Dayjs | null) {
		setTo(value);
		if ((value && !from) || (value && from && from >= value))
			setForm(value.add(-1, "day"));
	}

	function getCategoryOptions() {
		const options: React.ReactElement[] = [];
		const categories = getCategories();

		categories.map((category) => {
			options.push(
				<MenuItem key={category.id} value={category.id}>
					{category.name}
				</MenuItem>
			);
		});

		return options;
	}

	function handleFilter() {
		setSearchParameters({
			...searchParameters,
			from: from ? from.toDate().toDateString() : null,
			to: to ? to.toDate().toDateString() : null,
			category: category,
		});
	}
	function handleReset() {
		setForm(null);
		setTo(null);
		setCategory([]);
		setSearchParameters({
			...searchParameters,
			from: null,
			to: null,
			category: [],
		});
	}
}
