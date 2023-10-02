﻿namespace api.ResourceParameters
{
    public class ResourceParametersBase
    {
        const int MaxPageSize = 100;
        public int PageNumber { get; set; } = 1;

        private int _pageSize = 20;
        public int PageSize
        {
            get => _pageSize;
            set => _pageSize = (value > MaxPageSize) ? MaxPageSize : value;
        }
    }
}
