### Quick start

Include the script in the site:

```
<script src="./player-fetch-api.js"></script>
```


Create new EplayerApi, after the script is loaded you can create new instance of EplayerApi like in example below:

```JS
var api = new PlayerApi();

api.fetch('example.com', 'b6ycepzoau101l6kpgta7cf7u', 'a1a0bc7edad0d27b328d0b24f4');
```

.fetch method explanation:
```
api.fetch('request domain', 'publisher ID', 'player ID');
```

fetched data can be found in api.fetchedData, it's returns array with player needed informations:
```
api.fetchedData
```

after api successful fetched data it's emit custom event
```
player_fetch_data_successful
```
