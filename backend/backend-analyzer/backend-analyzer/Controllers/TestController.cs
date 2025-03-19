using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AnalyzerServer.Data;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging; // Добавлено

namespace AnalyzerServer.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TestController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly ILogger<TestController> _logger; // Добавлено

        public TestController(DataContext context, ILogger<TestController> logger) // Изменено
        {
            _context = context;
            _logger = logger; // Добавлено
        }

        [HttpGet("dbtest")]
        public async Task<IActionResult> TestDatabaseConnection()
        {
            try
            {
                var canConnect = await _context.Database.CanConnectAsync();
                if (canConnect)
                {
                    return Ok("Database connection successful.");
                }
                else
                {
                    return StatusCode(500, "Database connection failed.");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Database connection error"); // Добавлено
                return StatusCode(500, $"Database connection error: {ex.Message}");
            }
        }
    }
}