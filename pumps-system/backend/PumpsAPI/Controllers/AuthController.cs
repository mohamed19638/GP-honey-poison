using Microsoft.AspNetCore.Mvc;
using PumpsAPI.Models;
using PumpsAPI.Data;
[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;   

    // 👇 Injection
    public AuthController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost("register")]
    public IActionResult Register(User user)
    {
        if (_context.Users.Any(x => x.Username == user.Username))
          //  return BadRequest("User exists");
return BadRequest(new { message = "User already exists" });
        _context.Users.Add(user);
        _context.SaveChanges();
 
        return Ok(user);
    }

    [HttpPost("login")]
public IActionResult Login([FromBody] User user)
{
    Console.WriteLine("===== LOGIN TRY =====");
    Console.WriteLine($"Input Username: '{user.Username}'");
    Console.WriteLine($"Input Password: '{user.Password}'");

    foreach (var u in _context.Users)
    {
        Console.WriteLine($"DB User: '{u.Username}' - '{u.Password}'");
    }

    var username = user.Username?.Trim().ToLower();
    var password = user.Password?.Trim();

    var foundUser = _context.Users.FirstOrDefault(x =>
        x.Username.ToLower().Trim() == username);

    if (foundUser == null)
    {
        Console.WriteLine("❌ User not found");
      //  return Unauthorized("User not found");
    return Unauthorized(new { message = "User not found" });
    }

    if (foundUser.Password.Trim() != password)
    {
        Console.WriteLine("❌ Wrong password");
       // return Unauthorized("Wrong password");
        return Unauthorized(new { message = "Wrong password" });
    }

    Console.WriteLine("✅ LOGIN SUCCESS");
    return Ok(foundUser);
}
   
    }
