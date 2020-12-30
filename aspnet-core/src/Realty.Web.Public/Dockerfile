#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/core/aspnet:3.1-buster-slim AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/core/sdk:3.1-buster AS build
WORKDIR /src
COPY ["src/Realty.Web.Public/Realty.Web.Public.csproj", "src/Realty.Web.Public/"]
COPY ["src/Realty.Web.Core/Realty.Web.Core.csproj", "src/Realty.Web.Core/"]
COPY ["src/Realty.Application/Realty.Application.csproj", "src/Realty.Application/"]
COPY ["src/Realty.Application.Shared/Realty.Application.Shared.csproj", "src/Realty.Application.Shared/"]
COPY ["src/Realty.Core.Shared/Realty.Core.Shared.csproj", "src/Realty.Core.Shared/"]
COPY ["src/Realty.Core/Realty.Core.csproj", "src/Realty.Core/"]
COPY ["src/Realty.EntityFrameworkCore/Realty.EntityFrameworkCore.csproj", "src/Realty.EntityFrameworkCore/"]
COPY ["src/Realty.GraphQL/Realty.GraphQL.csproj", "src/Realty.GraphQL/"]
RUN dotnet restore "src/Realty.Web.Public/Realty.Web.Public.csproj"
COPY . .
WORKDIR "/src/src/Realty.Web.Public"
RUN dotnet build "Realty.Web.Public.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Realty.Web.Public.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Realty.Web.Public.dll"]
