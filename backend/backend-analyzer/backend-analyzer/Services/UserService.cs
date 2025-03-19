using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using AnalyzerServer.Data;
using AnalyzerServer.Models;
using System.Security.Cryptography;
using System.Text;
using Microsoft.Extensions.Logging; // Добавлено

namespace AnalyzerServer.Services
{
    public class UserService : IUserService
    {
        private readonly DataContext _context;
        private readonly ILogger<UserService> _logger; // Добавлено

        public UserService(DataContext context, ILogger<UserService> logger) // Изменено
        {
            _context = context;
            _logger = logger; // Добавлено
        }

        public async Task<User> Authenticate(string username, string password)
        {
            var user = await _context.Users.SingleOrDefaultAsync(x => x.Username == username);

            if (user == null || !VerifyPasswordHash(password, user.PasswordHash))
                return null;

            return user;
        }

        public async Task<User> Register(User user, string password)
        {
            if (await _context.Users.AnyAsync(x => x.Username == user.Username))
                throw new Exception("Username \"" + user.Username + "\" is already taken");

            CreatePasswordHash(password, out string passwordHash);
            user.PasswordHash = passwordHash;

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return user;
        }

        public async Task<User> GetById(int id)
        {
            try
            {
                return await _context.Users.FindAsync(id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting user by id: {Id}", id); // Добавлено
                throw;
            }
        }

        private static void CreatePasswordHash(string password, out string passwordHash)
        {
            using (var hmac = new HMACSHA512())
            {
                passwordHash = Convert.ToBase64String(hmac.ComputeHash(Encoding.UTF8.GetBytes(password)));
            }
        }

        private static bool VerifyPasswordHash(string password, string storedHash)
        {
            using (var hmac = new HMACSHA512())
            {
                var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
                var storedHashBytes = Convert.FromBase64String(storedHash);

                for (int i = 0; i < computedHash.Length; i++)
                {
                    if (computedHash[i] != storedHashBytes[i]) return false;
                }
            }

            return true;
        }
    }
}