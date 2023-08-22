using Microsoft.EntityFrameworkCore;
using System.Diagnostics.CodeAnalysis;

namespace api.Contexts
{
    public class APIDBContext : DbContext
    {
        public APIDBContext([NotNull] DbContextOptions options)
            : base(options) { }
    }
}
