import { Button, styled } from "@mui/material";
import MaterialStyles from "../styles/material.module.scss";
import styles from "../styles/upload.module.scss";

export default function SelectFile() {
	const VisuallyHiddenInput = styled("input")`
		clip: rect(0 0 0 0);
		clip-path: inset(50%);
		height: 1px;
		overflow: hidden;
		position: absolute;
		bottom: 0;
		left: 0;
		white-space: nowrap;
		width: 1px;
	`;

	return (
		<div className={styles.upload}>
			<h3>Select the file you want to upload</h3>
			<Button className={MaterialStyles.primaryButton} component="label">
				Upload
				<VisuallyHiddenInput type="file" onChange={handleUploadFile} />
			</Button>
		</div>
	);

	function handleUploadFile(e) {
		console.log(e.target.value);
	}
}
