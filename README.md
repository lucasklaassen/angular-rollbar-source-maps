# Angular 6 Rollbar Source Maps

When you minify your javascript code with the Angular CLI it is hard to debug exceptions that arise in a production environment within Rollbar.
Luckily for us, [Rollbar allows us to upload our javascript source maps](https://docs.rollbar.com/docs/source-maps/) so that we can see the original source filename, line number, method name, and code snippet the exception occurred from.

Unfortunately for us, Rollbar does not have a streamlined process for uploading these source maps within an Angular 6 deployment pipeline. There is a [webpack solution](https://github.com/thredup/rollbar-sourcemap-webpack-plugin) but this would require you to use `ng eject` to gain access to the webpack configuration file which shouldn't be necessary.

I built a script that can loop through the map files within your /dist folder and upload them to rollbar when you build your angular application. After the map files have been uploaded to Rollbar via their API, it wipes them out from the /dist folder so that you can deploy the entire /dist folder to production. (Although a user can deobfuscate your code without source maps, I recommend you always cover all of your bases)

## .env

Be sure to update the `.env` file with your Rollbar Access Token as well as your websites main URL. Rollbar uses this URL to grab your minified javascript code to compare it with the source map we upload, so be sure that it's accurate.

## npm run build

As you will see the package.json file the `build` command looks like so:
```
ts-node git.version.ts && ng build --prod --source-map && node scripts/sourceMap.js
```

### Breakdown:
1. `ts-node git.version.ts` This command takes the latest git commit SHA and creates a file named `versions.ts` within the environments folder. Rollbar requires you to attach a version number to each source map you upload so this implementation will work as you make changes down the line and run deploys. You'll notice we use this file within `src/app/factories/rollbar.factory.ts` where we define the rest of our settings we send to Rollbar.
2. `ng build --prod --source-map` This command is pretty straightforward. It runs the classic ng build command and passes the production flag as well as a flag that tells the CLI to generate source maps.
3. `node scripts/sourceMap.js` This is the script I have written which loops through all of the `.map` javascript files within the /dist folder and uploads them one by one to Rollbar via their API. After it's done uploading them to Rollbar it deletes them so that you don't deploy them to production.


## Disclaimer

There are probably better ways to do this but at the time of me posting this, I was unable to find ANY resources out there to copy from. This repo was created in the hopes that it would help someone save a bit of time and provide a reference for one way to do this within an Angular 6 app.
