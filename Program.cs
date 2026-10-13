
using GameStore.Dtos;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

List<GameDto> games = [
     new (
        1,
        "street fighter II",
        "Fighting",
        19.5M,
        new DateOnly(2005,5,1)
     ),
     new(
        2,
        "Red dead I",
        "Sols",
        65.9M,
        new DateOnly(2012,9,22)
     ),
     new(
        3,
        "GTA V",
        "RPG",
        99.99M,
        new DateOnly(2026,12,30)
     ),
];
// Getting games
app.MapGet("/games", () => games);

// Getting Game1
app.MapGet("/games/{id}" , (int id) => games.Find(game => game.Id == id))
   .WithName("GetGame");
//  Post
app.MapPost("/games", (GamePostDto newGame) =>
{
   GameDto game = new(
       games.Count + 1,
       newGame.Name,
       newGame.Genre,
       newGame.Price,
       newGame.ReleaseDate
   );
   games.Add(game);

   return Results.CreatedAtRoute(
       "GetGame",
       new { id = game.Id },
       game
   );
}); 
app.Run();
