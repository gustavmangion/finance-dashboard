export interface ListResponse<T> {
	totalCount: number;
	pageSize: number;
	currentPage: number;
	totalPages: number;
	data: T[];
}
