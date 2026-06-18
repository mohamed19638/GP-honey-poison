using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class PumpsController : ControllerBase
{
    [HttpGet]
    public IActionResult GetPumps()
    {
        var pumps = new List<object>();

        var random = new Random();

        for (int i = 1; i <= 4; i++)
        {
            pumps.Add(new
            {
                id = i,
                temperature = random.Next(80, 130),
                pressure = random.Next(50, 100),
                vibration = random.Next(5, 15),
                power = random.Next(300, 500)
            });
        }

        return Ok(pumps);
    }

    [HttpGet("{id}")]
    public IActionResult GetPump(int id)
    {
        var random = new Random();

        var pump = new
        {
            id = id,
            temperature = random.Next(80, 130),
            pressure = random.Next(50, 100),
            vibration = random.Next(5, 15),
            power = random.Next(300, 500)
        };

        return Ok(pump);
    }
}