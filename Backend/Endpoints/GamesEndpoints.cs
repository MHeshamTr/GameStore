using GameStore.Dtos;

namespace GameStore.Endpoints;

public static class GamesEndpoints
{
   const string GetGameEndpointName = "GetGame";

   private static readonly List<GameDto> games = [
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
        new DateOnly(2024,12,30)
     ),
     new(
        4,
        "GTA V÷",
        "RPG",
        99.98M,
        new DateOnly(2026,12,30)
     ),
];
   public static void MapGameEndpoints(this WebApplication app)
   {
      var group = app.MapGroup("/games");
      // Getting games
      group.MapGet("/", () => games);


      // Getting Game1
      group.MapGet("/{id}", (int id) =>
      {
         var game = games.Find(game => game.Id == id);

         return game is not null ? Results.Ok(game) : Results.NotFound();
      })
         .WithName(GetGameEndpointName);
      //  Post
      group.MapPost("/", (GamePostDto newGame) =>
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
             GetGameEndpointName,
             new { id = game.Id },
             game
         );
      });

      // put /game/1
      group.MapPut("/{id}", (int id, UpdateGameDto updateGame) =>
      {
         var index = games.FindIndex(game => game.Id == id);

         games[index] = new GameDto(
            id,
            updateGame.Name,
            updateGame.Genre,
            updateGame.Price,
            updateGame.ReleaseDate
         );

         if (index == -1)
         {
            return Results.NotFound();
         }

         return Results.NoContent();

      });


      // DELETE ENDPOINT 
      group.MapDelete("/{id}", (int id) =>
      {
         games.RemoveAll(game => game.Id == id);

         return Results.NoContent();

      });
   }
}
