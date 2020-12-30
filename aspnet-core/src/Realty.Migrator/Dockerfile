#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/core/aspnet:3.1-buster-slim AS base
WORKDIR /app

FROM mcr.microsoft.com/dotnet/core/sdk:3.1-buster AS build
WORKDIR /src
COPY ["src/Realty.Migrator/Realty.Migrator.csproj", "src/Realty.Migrator/"]
COPY ["src/Realty.EntityFrameworkCore/Realty.EntityFrameworkCore.csproj", "src/Realty.EntityFrameworkCore/"]
COPY ["src/Realty.Core/Realty.Core.csproj", "src/Realty.Core/"]
COPY ["src/Realty.Core.Shared/Realty.Core.Shared.csproj", "src/Realty.Core.Shared/"]
RUN dotnet restore "src/Realty.Migrator/Realty.Migrator.csproj"
COPY . .
WORKDIR "/src/src/Realty.Migrator"
RUN dotnet build "Realty.Migrator.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Realty.Migrator.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Realty.Migrator.dll"]
