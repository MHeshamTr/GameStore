using System;
using System.Security.Cryptography.X509Certificates;
using GameStore.models;
using Microsoft.EntityFrameworkCore;

namespace GameStore.Data;

public static class DataExtensions
{
    public static void MigrateDb(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        var dbContext = scope.ServiceProvider
                            .GetRequiredService<GameStoreContext>();
        dbContext.Database.Migrate();
    }

    public static void AddGameStoreDb(this WebApplicationBuilder builder)
    {
        var connString = builder.Configuration.GetConnectionString("GameStore");
        builder.Services.AddSqlite<GameStoreContext>(
            connString,
            optionsAction: options => options.UseSeeding((context, _) =>
            {
                if (!context.Set<Genre>().Any())
                {
                    context.Set<Genre>().AddRange(
                       new Genre { Name = "Fighting" },
                       new Genre { Name = "Rpg" },
                       new Genre { Name = "Platform" },
                       new Genre { Name = "Racing" },
                       new Genre { Name = "Sports" }
                    );
                    context.SaveChanges();
                }
            })
        );
    }


}
