using GameStore.Data;
using GameStore.Dtos;
using GameStore.models;
using Microsoft.EntityFrameworkCore;

namespace GameStore.Endpoints;

public static class GamesEndpoints
{
      const string GetGameEndpointName = "GetGame";
      public static void MapGameEndpoints(this WebApplication app)
   {
      var group = app.MapGroup("/games");
      // Getting games
      group.MapGet("/", async (GameStoreContext dbConteext) 
      => await dbConteext.Games
                          .Include(game => game.Genre)
                          .Select(game => new GameSummaryDto(
                             game.Id,
                             game.Name,
                             game.Genre!.Name,
                             game.Price,
                             game.ReleaseDate
                          ))
                          .AsNoTracking()
                          .ToListAsync());


      // Getting Game1
      group.MapGet("/{id}", async (int id , GameStoreContext dbContext) =>
      {
         var game = await dbContext.Games.FindAsync(id);

         return game is null ? Results.NotFound() : Results.Ok(
            new GameDetailsDto(
               game.Id,
               game.Name,
               game.GenreId,
               game.Price,
               game.ReleaseDate
            )
         );
      })
         .WithName(GetGameEndpointName);
      //  Post
      group.MapPost("/", async (GamePostDto newGame ,GameStoreContext dbContext) =>
      {
         Game game = new()
         {
               Name = newGame.Name,
               GenreId = newGame.GenreId,
               Price = newGame.Price,
               ReleaseDate = newGame.ReleaseDate
         };
         dbContext.Games.Add(game);
         await dbContext.SaveChangesAsync();

         GameDetailsDto gameDto = new(
             game.Id,
             game.Name,
             game.GenreId,
             game.Price,
             game.ReleaseDate
         );

         return Results.CreatedAtRoute(
             GetGameEndpointName,
             new { id = gameDto.Id },
             gameDto
         );
      });

      // put /game/1
      group.MapPut("/{id}", async (int id, UpdateGameDto updateGame , GameStoreContext dbContext) =>
      {
         var existingGame = await dbContext.Games.FindAsync(id);

          if (existingGame is null)
         {
            return Results.NotFound();
         }

         existingGame.Name = updateGame.Name;
         existingGame.GenreId = updateGame.GenreId;
         existingGame.Price = updateGame.Price;
         existingGame.ReleaseDate = updateGame.ReleaseDate;
         
         await dbContext.SaveChangesAsync();

         return Results.NoContent();
      });


      // DELETE ENDPOINT 
      group.MapDelete("/{id}", async (int id , GameStoreContext dbContext) =>
      {
         await dbContext.Games
                        .Where(game => game.Id == id)
                        .ExecuteDeleteAsync();
         
         return Results.NoContent();

      });
   }
}
