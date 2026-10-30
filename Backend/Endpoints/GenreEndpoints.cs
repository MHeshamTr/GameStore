using System;
using GameStore.Data;
using GameStore.Dtos;
using GameStore.models;
using Microsoft.EntityFrameworkCore;

namespace GameStore.Endpoints;

public static class GenreEndpoints
{
   public static void MapGenreEndpoints(this WebApplication app)
   {
    var group = app.MapGroup("/genres");

    // GET 
    group.MapGet("/", async (GameStoreContext dbContext) =>
    await dbContext.Genres
                   .Select(genre => new GenreDto(genre.Id,genre.Name))
                   .AsNoTracking()
                   .ToListAsync()
    );
  
   }
}
