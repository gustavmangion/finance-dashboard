namespace api.Models
{
    public class DashboardFilterModel
    {
        private string _BaseCurrency;
        public string BaseCurrency
        {
            get { return _BaseCurrency; }
            set { _BaseCurrency = value.ToUpper(); }
        }
        public DateOnly From { get; set; }
        public DateOnly To { get; set; }

        internal DateOnly FromPreviousPeriod
        {
            get
            {
                if (From.Day == 1 && To.Day == DateTime.DaysInMonth(To.Year, To.Month))
                {
                    int month = From.Month - (To.Month - From.Month + 1);
                    int yearDiff = To.Year - From.Year;
                    (int, int) correctedYearMonth = GetCorrectedYearMonth(
                        From.Year - yearDiff,
                        month
                    );
                    return new DateOnly(correctedYearMonth.Item1, correctedYearMonth.Item2, 1);
                }

                return From.AddDays(From.Day - To.Day - 1);
            }
        }
        internal DateOnly ToPreviousPeriod
        {
            get
            {
                if (From.Day == 1 && To.Day == DateTime.DaysInMonth(To.Year, To.Month))
                {
                    int month = To.Month - (To.Month - From.Month + 1);
                    (int, int) correctedYearMonth = GetCorrectedYearMonth(From.Year, month);
                    return new DateOnly(
                        correctedYearMonth.Item1,
                        correctedYearMonth.Item2,
                        DateTime.DaysInMonth(To.Year, month)
                    );
                }

                return From.AddDays(From.Day - To.Day - 1);
            }
        }

        private (int, int) GetCorrectedYearMonth(int year, int month)
        {
            if (month < 0)
            {
                month += 12;
                year -= 1;
                return GetCorrectedYearMonth(year, month);
            }
            else
                return (year, month);
        }
    }
}
