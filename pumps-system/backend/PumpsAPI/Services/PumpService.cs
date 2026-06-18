using PumpsAPI.Models;
public class PumpService
{
    private readonly Random _rand = new Random();

    public List<Pump> GetPumps()
    {
        return Enumerable.Range(1, 4).Select(i => new Pump
        {
            Id = i,
            Temperature = 80 + _rand.NextDouble() * 50,
            Pressure = 50 + _rand.NextDouble() * 50,
            Vibration = 2 + _rand.NextDouble() * 10,
            Power = 200 + _rand.NextDouble() * 300
        }).ToList();
    }

    public Pump GetPump(int id)
    {
        return new Pump
        {
            Id = id,
            Temperature = 80 + _rand.NextDouble() * 50,
            Pressure = 50 + _rand.NextDouble() * 50,
            Vibration = 2 + _rand.NextDouble() * 10,
            Power = 200 + _rand.NextDouble() * 300
        };
    }
}