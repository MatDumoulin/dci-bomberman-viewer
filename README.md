# BombermanViewer

## Development server
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files. This server will not be discoverable by other computers on your network.

## Production server
Run `npm start` to start the prod server. This server will be bundled by webpack and other computers on your network will be able to join it.

## Before you start
The url of the load balancer for the game servers is hardcoded in the _src/environments_ folder. You must adjust the **loadBalancerUrl** environment variable to the url of the load balancer that runs on your network. If a prod server is currently running, you must restart it to reflect your changes.

## Attribution Notice
Special thanks to:
* `Created by Daniel Eddeland (daneeklu); https://opengameart.org/node/11629` for the chicken spritesheet.
* Blood _ Copyright 2011 by shimobayashi `http://opengameart.org/content/teqq-princess-image-materials` Color edit to look like explosion Copyright 2012 by qubodup.
* `https://ruwlabs.com/` for the speed upgrade icon. The background color was added by Mathieu Dumoulin for this game.
* `https://www.iconfinder.com/webalys` for the power upgrade icon. The colors were modified by Mathieu Dumoulin for this game.
* `https://www.iconfinder.com/ibrandify` for the bomb upgrade icon. The background color was added by Mathieu Dumoulin for this game.
