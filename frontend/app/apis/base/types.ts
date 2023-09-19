export interface ListResponse<T> {
	totalCount: number;
	pageSize: number;
	currentPage: number;
	totalPages: number;
	previousPageLink: string;
	nextPageLink: string;
	data: T[];
}
