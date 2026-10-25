using System;

namespace GameStore.models;

public class Game
{
    public int Id { get; set; }

    public required string Name { get; set; }
    public  Genre? genre { get; set; }
    public int GenreId { get; set; }

}
