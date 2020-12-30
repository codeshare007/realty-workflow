New-Item -ItemType Directory -Force dev-cert
cd dev-cert
Remove-Item * -Include *.pfx
dotnet dev-certs https -v -ep aspnetzero-devcert.pfx -p 2825e4d9-5cef-4373-bed3-d7ebf59de216
cd..