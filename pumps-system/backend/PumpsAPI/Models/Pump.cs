namespace PumpsAPI.Models
{
    public class Pump
    {
        public int Id { get; set; }
        public double Temperature { get; set; }
        public double Pressure { get; set; }
        public double Vibration { get; set; }
        public double Power { get; set; }
    }
}