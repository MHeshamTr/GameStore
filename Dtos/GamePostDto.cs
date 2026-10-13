namespace GameStore.Dtos;

public record GamePostDto(
     string Name,
     string Genre,
     decimal Price,
     DateOnly ReleaseDate
);
