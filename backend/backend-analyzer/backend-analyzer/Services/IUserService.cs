using System.Threading.Tasks;
using AnalyzerServer.Models;

namespace AnalyzerServer.Services
{
    public interface IUserService
    {
        Task<User> Authenticate(string username, string password);
        Task<User> Register(User user, string password);
        Task<User> GetById(int id);
    }
}