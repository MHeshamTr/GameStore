using GameStore.Dtos;
using GameStore.Endpoints;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddValidation();

var app = builder.Build();

app.MapGameEndpoints();

app.Run();
