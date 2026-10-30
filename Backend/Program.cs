using GameStore.Data;
using GameStore.Dtos;
using GameStore.Endpoints;
using GameStore.models;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();

builder.Services.AddValidation();

builder.AddGameStoreDb();

var app = builder.Build();

if(app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

// app.UseHttpsRedirection();

app.MapGameEndpoints();

app.MigrateDb();

app.Run();
