using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AnalyzerServer.Data;
using AnalyzerServer.Models;

namespace AnalyzerServer.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ReviewStatisticsController : ControllerBase
    {
        private readonly DataContext _context;

        public ReviewStatisticsController(DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ReviewStatistic>>> GetReviewStatistics()
        {
            return await _context.ReviewStatistics.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ReviewStatistic>> GetReviewStatistic(int id)
        {
            var reviewStatistic = await _context.ReviewStatistics.FindAsync(id);

            if (reviewStatistic == null)
            {
                return NotFound();
            }

            return reviewStatistic;
        }

        [HttpPost]
        public async Task<ActionResult<ReviewStatistic>> PostReviewStatistic(ReviewStatistic reviewStatistic)
        {
            _context.ReviewStatistics.Add(reviewStatistic);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetReviewStatistic", new { id = reviewStatistic.Id }, reviewStatistic);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutReviewStatistic(int id, ReviewStatistic reviewStatistic)
        {
            if (id != reviewStatistic.Id)
            {
                return BadRequest();
            }

            _context.Entry(reviewStatistic).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ReviewStatisticExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReviewStatistic(int id)
        {
            var reviewStatistic = await _context.ReviewStatistics.FindAsync(id);
            if (reviewStatistic == null)
            {
                return NotFound();
            }

            _context.ReviewStatistics.Remove(reviewStatistic);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ReviewStatisticExists(int id)
        {
            return _context.ReviewStatistics.Any(e => e.Id == id);
        }
    }
}