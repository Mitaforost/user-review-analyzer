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
    public class ReviewKeywordsController : ControllerBase
    {
        private readonly DataContext _context;

        public ReviewKeywordsController(DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ReviewKeyword>>> GetReviewKeywords()
        {
            return await _context.ReviewKeywords.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ReviewKeyword>> GetReviewKeyword(int id)
        {
            var reviewKeyword = await _context.ReviewKeywords.FindAsync(id);

            if (reviewKeyword == null)
            {
                return NotFound();
            }

            return reviewKeyword;
        }

        [HttpPost]
        public async Task<ActionResult<ReviewKeyword>> PostReviewKeyword(ReviewKeyword reviewKeyword)
        {
            _context.ReviewKeywords.Add(reviewKeyword);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetReviewKeyword", new { id = reviewKeyword.Id }, reviewKeyword);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutReviewKeyword(int id, ReviewKeyword reviewKeyword)
        {
            if (id != reviewKeyword.Id)
            {
                return BadRequest();
            }

            _context.Entry(reviewKeyword).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ReviewKeywordExists(id))
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
        public async Task<IActionResult> DeleteReviewKeyword(int id)
        {
            var reviewKeyword = await _context.ReviewKeywords.FindAsync(id);
            if (reviewKeyword == null)
            {
                return NotFound();
            }

            _context.ReviewKeywords.Remove(reviewKeyword);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ReviewKeywordExists(int id)
        {
            return _context.ReviewKeywords.Any(e => e.Id == id);
        }
    }
}