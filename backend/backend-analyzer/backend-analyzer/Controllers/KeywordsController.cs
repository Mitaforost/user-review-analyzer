using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AnalyzerServer.Data;
using AnalyzerServer.Models;
using Microsoft.Extensions.Logging;

namespace AnalyzerServer.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class KeywordsController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly ILogger<KeywordsController> _logger;

        public KeywordsController(DataContext context, ILogger<KeywordsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Keyword>>> GetKeywords()
        {
            try
            {
                return await _context.Keywords.ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting keywords");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Keyword>> GetKeyword(int id)
        {
            try
            {
                var keyword = await _context.Keywords.FindAsync(id);

                if (keyword == null)
                {
                    return NotFound();
                }

                return keyword;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting keyword by id: {Id}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost]
        public async Task<ActionResult<Keyword>> PostKeyword(Keyword keyword)
        {
            try
            {
                _context.Keywords.Add(keyword);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetKeyword", new { id = keyword.Id }, keyword);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating keyword");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutKeyword(int id, Keyword keyword)
        {
            if (id != keyword.Id)
            {
                return BadRequest();
            }

            _context.Entry(keyword).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!KeywordExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating keyword with id: {Id}", id);
                return StatusCode(500, "Internal server error");
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteKeyword(int id)
        {
            try
            {
                var keyword = await _context.Keywords.FindAsync(id);
                if (keyword == null)
                {
                    return NotFound();
                }

                _context.Keywords.Remove(keyword);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting keyword with id: {Id}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        private bool KeywordExists(int id)
        {
            return _context.Keywords.Any(e => e.Id == id);
        }
    }
}