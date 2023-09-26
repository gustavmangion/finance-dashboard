import {
	FormControl,
	InputLabel,
	MenuItem,
	Paper,
	Select,
	SelectChangeEvent,
} from "@mui/material";
import styles from "../styles/account.module.scss";
import dayjs, { Dayjs } from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import { ChangeEvent, useState } from "react";
import { getCategories } from "../helpers/transactionHelper";

export default function TransactionsListFilter() {
	const [from, setForm] = useState<Dayjs | null>(null);
	const [to, setTo] = useState<Dayjs | null>(null);
	const [category, setCategory] = useState("All");

	return (
		<Paper className={styles.transactionsListFilter}>
			<form onSubmit={handleFilter}>
				<DatePicker label="From" value={from} onChange={handleChangeFromDate} />
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
					>
						{getCategoryOptions()}
					</Select>
				</FormControl>
			</form>
		</Paper>
	);

	function handleChangeFromDate(value: Dayjs | null) {
		setForm(value);

		if ((value && !to) || (value && to && value >= to)) {
			setTo(value.add(1, "day"));
			console.log("here");
		}
	}

	function handleSelectChange(e: SelectChangeEvent) {
		setCategory(e.target.value);
	}

	function handleChangeToDate(value: Dayjs | null) {
		setTo(value);
		if ((value && !from) || (value && from && from >= value))
			setForm(value.add(-1, "day"));
	}

	function getCategoryOptions() {
		const options: React.ReactElement[] = [];
		const categories = getCategories();

		options.push(
			<MenuItem key="All" value="All">
				All
			</MenuItem>
		);

		categories.map((category) => {
			options.push(
				<MenuItem key={category.id} value={category.id}>
					{category.name}
				</MenuItem>
			);
		});

		return options;
	}

	function handleFilter() {}
}
