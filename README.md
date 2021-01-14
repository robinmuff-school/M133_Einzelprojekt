# M133_Einzelprojekt

Dieses Projekt wurde als Projektarbeit für das Fach M133 erarbeitet und ist auf GIT versioniert.
Ersteller:  Robin Muff
Abgabe:     15.01.2021

## Requirements
- Make sure [Deno](https://deno.land) is installed on your computer

## Installation
1. All Requirements
2. Download the source code
3. WINDOWS: Run "start.ps1"
3. OTHER OS: Run the following two lines of code on the project folder. 
```javascript
deno run --allow-read --allow-write --unstable "./tools/builder.ts"
deno run --allow-net --allow-read --allow-write "./webserver.ts"
```
4. Server running on http://localhost:8000