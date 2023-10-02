namespace api.Models
{
    public class PaginationModel<T>
    {
        public int TotalCount { get; set; }
        public int PageSize { get; set; }
        public int CurrentPage { get; set; }
        public int TotalPages { get; set; }
        public List<T> Data { get; set; }

        public static PaginationModel<T> Create<T>(
            List<T> data,
            int totalCount,
            int totalPages,
            int currentPage = 1,
            int pagesize = 20
        )
        {
            return new PaginationModel<T>
            {
                TotalCount = totalCount,
                PageSize = pagesize,
                CurrentPage = currentPage,
                TotalPages = totalPages,
                Data = data
            };
        }
    }
}
