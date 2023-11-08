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
    }
}
